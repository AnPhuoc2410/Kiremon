import {
  HubConnectionBuilder,
  HubConnection,
  LogLevel,
  HubConnectionState,
} from "@microsoft/signalr";
import { getCookie } from "@/components/utils/cookieUtils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
// SignalR Hub URL (Remove /api if the hub is mapped at root level, but usually mapped relative to domain)
// In Program.cs: app.MapHub<PresenceHub>("/hubs/presence");
// If API_BASE_URL includes /api, we might need to adjust.
// Typically API is /api/..., and Hub is /hubs/...
// If VITE_API_BASE_URL is "http://localhost:5000/api", we want "http://localhost:5000/hubs/presence".
// Let's assume VITE_API_BASE_URL serves as the base for Axios.
// Safe bet: Construct hub URL from window.location.origin if production, or derived from env.

const getHubUrl = () => {
  // If API_BASE_URL is absolute (http...), use its origin.
  // If it's relative (/api), use window.location.origin.
  let baseUrl = API_BASE_URL;
  if (!baseUrl.startsWith("http")) {
    baseUrl = window.location.origin;
  } else {
    // extract origin from http://localhost:5000/api
    const url = new URL(baseUrl);
    baseUrl = url.origin;
  }

  console.log(baseUrl);

  return `${baseUrl}/hubs/presence`;
};

type OnlineStatusHandler = (userId: string) => void;
type OnlineFriendsHandler = (userIds: string[]) => void;

class PresenceHubService {
  private connection: HubConnection | null = null;
  private onlineHandlers: OnlineStatusHandler[] = [];
  private offlineHandlers: OnlineStatusHandler[] = [];
  private initialListHandlers: OnlineFriendsHandler[] = [];

  constructor() {
    this.createConnection();
  }

  private createConnection() {
    const hubUrl = getHubUrl();
    this.connection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => {
          return getCookie("accessToken") || "";
        },
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    this.connection.on("UserIsOnline", (userId: string) => {
      this.onlineHandlers.forEach((handler) => handler(userId));
    });

    this.connection.on("UserIsOffline", (userId: string) => {
      this.offlineHandlers.forEach((handler) => handler(userId));
    });

    this.connection.on("GetOnlineFriends", (userIds: string[]) => {
      this.initialListHandlers.forEach((handler) => handler(userIds));
    });
  }

  public async start(): Promise<void> {
    if (!this.connection) this.createConnection();

    if (this.connection?.state === HubConnectionState.Disconnected) {
      try {
        await this.connection.start();
        console.log("Presence Hub Connected");
      } catch (err) {
        console.error("SignalR Connection Error: ", err);
        // Retry logic is handled by withAutomaticReconnect for transient failures,
        // but initial start failure needs manual handling or just let it fail silently used in useEffect.
      }
    }
  }

  public async stop(): Promise<void> {
    if (
      this.connection &&
      this.connection.state !== HubConnectionState.Disconnected
    ) {
      await this.connection.stop();
      console.log("Presence Hub Disconnected");
    }
  }

  public async getOnlineFriends(): Promise<string[]> {
    if (!this.connection) this.createConnection();

    // If disconnected, try to start
    if (this.connection?.state === HubConnectionState.Disconnected) {
      await this.start();
    }

    // If still not connected (e.g. connecting or failed), we might need to wait or check
    if (this.connection?.state === HubConnectionState.Connected) {
      return await this.connection.invoke<string[]>("GetOnlineFriendsList");
    }

    return [];
  }

  public onUserOnline(handler: OnlineStatusHandler) {
    this.onlineHandlers.push(handler);
    return () => {
      this.onlineHandlers = this.onlineHandlers.filter((h) => h !== handler);
    };
  }

  public onUserOffline(handler: OnlineStatusHandler) {
    this.offlineHandlers.push(handler);
    return () => {
      this.offlineHandlers = this.offlineHandlers.filter((h) => h !== handler);
    };
  }

  public onInitialList(handler: OnlineFriendsHandler) {
    this.initialListHandlers.push(handler);
    return () => {
      this.initialListHandlers = this.initialListHandlers.filter(
        (h) => h !== handler,
      );
    };
  }
}

export const presenceHub = new PresenceHubService();
