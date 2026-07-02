import { Text } from "@/components/ui";

export default function AdminDashboardPage() {
  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: 24,
        animation: "fadeIn 0.3s ease",
      }}
    >
      <h1
        style={{
          fontFamily: '"VT323", monospace',
          fontSize: 48,
          margin: "0 0 8px 0",
        }}
      >
        Admin Dashboard
      </h1>
      <Text style={{ opacity: 0.7 }}>Overview of your system</Text>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 24,
          marginTop: 32,
        }}
      >
        {/* Placeholder Stat Cards using generic HTML to match the pixel style without relying on missing Kiremon components */}
        <div
          style={{
            background: "#ffffff",
            border: "4px solid #1a202c",
            padding: 24,
            borderRadius: 12,
            boxShadow: "4px 4px 0 #1a202c",
          }}
        >
          <Text size="sm" style={{ opacity: 0.7, marginBottom: 8 }}>
            Total Registered Users
          </Text>
          <div
            style={{
              fontSize: 48,
              fontFamily: '"VT323", monospace',
              color: "#2b6cb0",
              lineHeight: 1,
            }}
          >
            Coming Soon
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "4px solid #1a202c",
            padding: 24,
            borderRadius: 12,
            boxShadow: "4px 4px 0 #1a202c",
          }}
        >
          <Text size="sm" style={{ opacity: 0.7, marginBottom: 8 }}>
            Active Wild Areas
          </Text>
          <div
            style={{
              fontSize: 48,
              fontFamily: '"VT323", monospace',
              color: "#38a169",
              lineHeight: 1,
            }}
          >
            8
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "4px solid #1a202c",
            padding: 24,
            borderRadius: 12,
            boxShadow: "4px 4px 0 #1a202c",
          }}
        >
          <Text size="sm" style={{ opacity: 0.7, marginBottom: 8 }}>
            Server Status
          </Text>
          <div
            style={{
              fontSize: 48,
              fontFamily: '"VT323", monospace',
              color: "#d69e2e",
              lineHeight: 1,
            }}
          >
            Online
          </div>
        </div>
      </div>
    </div>
  );
}
