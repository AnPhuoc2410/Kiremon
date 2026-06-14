import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { adminService, AdminStats } from "@/services/admin/admin.service";
import { dateFormatter } from "@/components/utils/dateTime.utils";
import toast from "react-hot-toast";
import * as S from "./index.style";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [syncingSpawns, setSyncingSpawns] = useState<boolean>(false);
  const [regeneratingTags, setRegeneratingTags] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ status: "success" | "error" | "info"; message: string } | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getStats();
      setStats(data);
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err.message || "Failed to load admin statistics";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSyncSpawns = async () => {
    setSyncingSpawns(true);
    setFeedback(null);
    const syncToast = toast.loading("Syncing spawn metadata from PokeAPI...");
    try {
      await adminService.syncSpawnMetadata(true);
      toast.success("Spawn metadata sync completed successfully!", { id: syncToast });
      setFeedback({
        status: "success",
        message: "Spawn metadata synchronization successfully completed from PokeAPI source."
      });
      fetchDashboardData();
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err.message || "Sync failed";
      toast.error(errMsg, { id: syncToast });
      setFeedback({
        status: "error",
        message: `Sync failed: ${errMsg}`
      });
    } finally {
      setSyncingSpawns(false);
    }
  };

  const handleRegenerateTags = async () => {
    setRegeneratingTags(true);
    setFeedback(null);
    const tagToast = toast.loading("Regenerating biome tags...");
    try {
      await adminService.regenerateBiomeTags(true);
      toast.success("Biome tags successfully regenerated!", { id: tagToast });
      setFeedback({
        status: "success",
        message: "Biome tags regeneration successfully completed."
      });
      fetchDashboardData();
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err.message || "Regeneration failed";
      toast.error(errMsg, { id: tagToast });
      setFeedback({
        status: "error",
        message: `Regeneration failed: ${errMsg}`
      });
    } finally {
      setRegeneratingTags(false);
    }
  };

  if (loading && !stats) {
    return (
      <S.Container style={{ justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <S.Spinner />
        <p style={{ fontFamily: "VT323", fontSize: "24px", marginTop: "12px" }}>Loading Admin Terminal...</p>
      </S.Container>
    );
  }

  if (error && !stats) {
    return (
      <S.Container>
        <S.Header>
          <h1>Admin Command Center</h1>
        </S.Header>
        <S.Alert $status="error">
          Error initializing connection: {error}
        </S.Alert>
        <S.Button onClick={fetchDashboardData} style={{ alignSelf: "flex-start" }}>Retry Handshake</S.Button>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <S.Header>
        <div>
          <h1>Admin Terminal</h1>
          <p>Welcome back, Overseer {user?.username}!</p>
        </div>
        <S.UserBadge>
          <span>Level: {user?.level}</span>
          <span>•</span>
          <span>Caught: {user?.pokemonCaught}</span>
        </S.UserBadge>
      </S.Header>

      {feedback && (
        <S.Alert $status={feedback.status}>
          {feedback.message}
        </S.Alert>
      )}

      <S.Grid>
        <S.Card $color="#EF4444">
          <h3>Total Trainers</h3>
          <p className="value">{stats?.totalUsers ?? 0}</p>
        </S.Card>
        <S.Card $color="#3B82F6">
          <h3>Pokémon Caught</h3>
          <p className="value">{stats?.totalPokemonCaught ?? 0}</p>
        </S.Card>
        <S.Card $color="#10B981">
          <h3>PC Boxes Active</h3>
          <p className="value">{stats?.totalBoxes ?? 0}</p>
        </S.Card>
      </S.Grid>

      <S.ActionSection>
        <h2>System Commands</h2>
        <S.ActionButtons>
          <S.Button 
            onClick={handleSyncSpawns} 
            disabled={syncingSpawns || regeneratingTags}
          >
            {syncingSpawns ? <S.Spinner /> : "Sync Spawn Metadata"}
          </S.Button>
          <S.Button 
            onClick={handleRegenerateTags} 
            disabled={syncingSpawns || regeneratingTags}
            $variant="success"
          >
            {regeneratingTags ? <S.Spinner /> : "Regenerate Biome Tags"}
          </S.Button>
        </S.ActionButtons>
      </S.ActionSection>

      <S.TableSection>
        <h2>Trainer Database</h2>
        <S.TableWrapper>
          <S.Table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Status</th>
                <th>Level</th>
                <th>Coins</th>
                <th>Experience</th>
                <th>Caught</th>
                <th>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {stats?.users.map((trainer) => (
                <tr key={trainer.id}>
                  <td><strong>{trainer.username}</strong></td>
                  <td>{trainer.email}</td>
                  <td>
                    <span style={{ 
                      color: trainer.emailConfirmed ? "#10B981" : "#EF4444",
                      fontWeight: "bold"
                    }}>
                      {trainer.emailConfirmed ? "Verified" : "Unverified"}
                    </span>
                  </td>
                  <td>{trainer.level}</td>
                  <td>{trainer.coins} PokeCoins</td>
                  <td>{trainer.experience} XP</td>
                  <td>{trainer.pokemonCaught}</td>
                  <td>{dateFormatter({ value: trainer.lastActiveDate })}</td>
                </tr>
              ))}
              {(!stats?.users || stats.users.length === 0) && (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "24px" }}>
                    No trainers registered in database.
                  </td>
                </tr>
              )}
            </tbody>
          </S.Table>
        </S.TableWrapper>
      </S.TableSection>
    </S.Container>
  );
};

export default AdminDashboard;
