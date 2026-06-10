import {
  HubConnectionBuilder,
  HubConnection,
  LogLevel,
  HubConnectionState,
} from "@microsoft/signalr";
import { getMemoryToken } from "@/services/api/tokenHolder";
import { AchievementNotification } from "@/types/users.type";

const API_BASE_URL = import.meta.env.DEV
  ? "/api"
  : import.meta.env.VITE_API_BASE_URL || "/api";

const getHubUrl = () => {
  let baseUrl = API_BASE_URL;
  if (!baseUrl.startsWith("http")) {
    baseUrl = window.location.origin;
  } else {
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
  private achievementHandlers: ((
    achievement: AchievementNotification,
  ) => void)[] = [];

  constructor() {
    this.createConnection();
  }

  private createConnection() {
    const hubUrl = getHubUrl();
    this.connection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => {
          return getMemoryToken() || "";
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

    this.connection.on(
      "ReceiveAchievementUnlocked",
      (achievement: AchievementNotification) => {
        this.achievementHandlers.forEach((handler) => handler(achievement));
      },
    );
  }

  public async start(): Promise<void> {
    if (!this.connection) this.createConnection();

    if (this.connection?.state === HubConnectionState.Disconnected) {
      try {
        await this.connection.start();
        console.log("Presence Hub Connected");
      } catch (err) {
        console.error("SignalR Connection Error: ", err);
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

  public onAchievementUnlocked(
    handler: (achievement: AchievementNotification) => void,
  ) {
    this.achievementHandlers.push(handler);
    return () => {
      this.achievementHandlers = this.achievementHandlers.filter(
        (h) => h !== handler,
      );
    };
  }
}

export const presenceHub = new PresenceHubService();
