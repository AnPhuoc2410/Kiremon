import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { adminService, AdminStats } from "@/services/admin/admin.service";
import { dateFormatter } from "@/components/utils/dateTime.utils";
import { WildAreaSettings, CardRewardSettings, WildAreaConfig } from "@/types/config.types";
import toast from "react-hot-toast";
import * as S from "./index.style";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // System Config states
  const [wildAreaConfig, setWildAreaConfig] = useState<WildAreaSettings | null>(null);
  const [cardRewardConfig, setCardRewardConfig] = useState<CardRewardSettings | null>(null);
  const [configLoading, setConfigLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"global" | "weights" | "areas">("global");
  const [selectedAreaCode, setSelectedAreaCode] = useState<string>("");
  const [savingConfig, setSavingConfig] = useState<boolean>(false);

  // Syncing commands states
  const [syncingSpawns, setSyncingSpawns] = useState<boolean>(false);
  const [regeneratingTags, setRegeneratingTags] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ status: "success" | "error" | "info"; message: string } | null>(null);

  // Custom inputs for tag/type list builders
  const [newAllowedType, setNewAllowedType] = useState("");
  const [newPreferredType, setNewPreferredType] = useState("");
  const [newBannedType, setNewBannedType] = useState("");
  const [newAllowedHabitat, setNewAllowedHabitat] = useState("");
  const [newPreferredHabitat, setNewPreferredHabitat] = useState("");
  const [newRequiredAnyTag, setNewRequiredAnyTag] = useState("");
  const [newPreferredTag, setNewPreferredTag] = useState("");
  const [newAllowedTag, setNewAllowedTag] = useState("");
  const [newBannedTag, setNewBannedTag] = useState("");
  const [newRequiredAnyType, setNewRequiredAnyType] = useState("");
  const [newSecondaryAllowedType, setNewSecondaryAllowedType] = useState("");
  const [newSafeFallbackId, setNewSafeFallbackId] = useState("");

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

  const fetchConfigData = async () => {
    setConfigLoading(true);
    try {
      const [waData, crData] = await Promise.all([
        adminService.getWildAreaConfig(),
        adminService.getCardRewardConfig()
      ]);
      setWildAreaConfig(waData);
      setCardRewardConfig(crData);
      if (waData.wildAreas.length > 0) {
        setSelectedAreaCode(waData.wildAreas[0].code);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message || "Failed to load system configurations");
    } finally {
      setConfigLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchConfigData();
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

  // Wild Area Top-Level variables handlers
  const handleWildAreaTopLevelChange = (field: keyof WildAreaSettings, value: any) => {
    if (!wildAreaConfig) return;
    setWildAreaConfig({
      ...wildAreaConfig,
      [field]: value
    });
  };

  // Rarity weights modification handlers
  const handleSpawnWeightChange = (rarity: string, value: number) => {
    if (!wildAreaConfig) return;
    setWildAreaConfig({
      ...wildAreaConfig,
      spawnWeights: {
        ...wildAreaConfig.spawnWeights,
        [rarity]: value
      }
    });
  };

  const handleCardRewardWeightChange = (tier: string, value: number) => {
    if (!cardRewardConfig) return;
    setCardRewardConfig({
      ...cardRewardConfig,
      rarityWeights: {
        ...cardRewardConfig.rarityWeights,
        [tier]: value
      }
    });
  };

  // Selected Area modification helpers
  const activeArea = wildAreaConfig?.wildAreas.find(a => a.code === selectedAreaCode);

  const handleAreaChange = (field: keyof WildAreaConfig, value: any) => {
    if (!wildAreaConfig || !activeArea) return;
    const updatedAreas = wildAreaConfig.wildAreas.map(a => {
      if (a.code === selectedAreaCode) {
        return { ...a, [field]: value };
      }
      return a;
    });
    setWildAreaConfig({
      ...wildAreaConfig,
      wildAreas: updatedAreas
    });
  };

  const handleAreaRarityWeightChange = (rarity: string, value: number) => {
    if (!wildAreaConfig || !activeArea) return;
    const updatedAreas = wildAreaConfig.wildAreas.map(a => {
      if (a.code === selectedAreaCode) {
        return {
          ...a,
          rarityWeights: {
            ...a.rarityWeights,
            [rarity]: value
          }
        };
      }
      return a;
    });
    setWildAreaConfig({
      ...wildAreaConfig,
      wildAreas: updatedAreas
    });
  };

  const handleNullableNumberChange = (field: keyof WildAreaConfig, textValue: string) => {
    const val = textValue.trim();
    if (val === "") {
      handleAreaChange(field, null);
    } else {
      handleAreaChange(field, parseInt(val) || 0);
    }
  };

  const handleNullableBooleanChange = (field: keyof WildAreaConfig, valString: string) => {
    if (valString === "null") {
      handleAreaChange(field, null);
    } else {
      handleAreaChange(field, valString === "true");
    }
  };

  // Add/Remove array items helper
  const addAreaArrayItem = (field: keyof WildAreaConfig, itemValue: string | number) => {
    if (!wildAreaConfig || !activeArea || itemValue === "" || itemValue === undefined) return;
    const currentList = (activeArea[field] as any[]) || [];
    if (currentList.includes(itemValue)) return;
    handleAreaChange(field, [...currentList, itemValue]);
  };

  const removeAreaArrayItem = (field: keyof WildAreaConfig, indexToRemove: number) => {
    if (!wildAreaConfig || !activeArea) return;
    const currentList = (activeArea[field] as any[]) || [];
    handleAreaChange(field, currentList.filter((_, idx) => idx !== indexToRemove));
  };

  // Save changes to database
  const handleSaveConfigs = async () => {
    if (!wildAreaConfig || !cardRewardConfig) return;
    setSavingConfig(true);
    const saveToast = toast.loading("Saving configuration changes to DB...");
    try {
      await Promise.all([
        adminService.updateWildAreaConfig(wildAreaConfig),
        adminService.updateCardRewardConfig(cardRewardConfig)
      ]);
      toast.success("Configurations successfully updated!", { id: saveToast });
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err.message || "Save failed";
      toast.error(`Save failed: ${errMsg}`, { id: saveToast });
    } finally {
      setSavingConfig(false);
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
          <div className="card-header">
            <span className="indicator" />
            <h3>Total Trainers</h3>
          </div>
          <p className="value">{stats?.totalUsers ?? 0}</p>
        </S.Card>
        <S.Card $color="#3B82F6">
          <div className="card-header">
            <span className="indicator" />
            <h3>Pokémon Caught</h3>
          </div>
          <p className="value">{stats?.totalPokemonCaught ?? 0}</p>
        </S.Card>
        <S.Card $color="#10B981">
          <div className="card-header">
            <span className="indicator" />
            <h3>PC Boxes Active</h3>
          </div>
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

      {/* SYSTEM CONFIGURATION */}
      <S.ConfigSection>
        <h2>System Configuration</h2>
        {configLoading ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 0" }}>
            <S.Spinner />
            <span style={{ fontSize: "18px" }}>Decrypting config records...</span>
          </div>
        ) : (
          <>
            <S.TabsContainer>
              <S.TabButton $active={activeTab === "global"} onClick={() => setActiveTab("global")}>
                Global Variables
              </S.TabButton>
              <S.TabButton $active={activeTab === "weights"} onClick={() => setActiveTab("weights")}>
                Spawn & Rarity Weights
              </S.TabButton>
              <S.TabButton $active={activeTab === "areas"} onClick={() => setActiveTab("areas")}>
                Wild Biome Rules
              </S.TabButton>
            </S.TabsContainer>

            {/* TAB CONTENT: Global Variables */}
            {activeTab === "global" && wildAreaConfig && (
              <S.FormGrid>
                <S.FormGroup>
                  <S.Label>Reset Interval <S.LabelSubtitle>(Minutes)</S.LabelSubtitle></S.Label>
                  <S.Input
                    type="number"
                    min={1}
                    value={wildAreaConfig.resetIntervalMinutes}
                    onChange={(e) => handleWildAreaTopLevelChange("resetIntervalMinutes", parseInt(e.target.value) || 1)}
                  />
                </S.FormGroup>
                <S.FormGroup>
                  <S.Label>Spawn Count <S.LabelSubtitle>(Slots)</S.LabelSubtitle></S.Label>
                  <S.Input
                    type="number"
                    min={1}
                    value={wildAreaConfig.spawnCount}
                    onChange={(e) => handleWildAreaTopLevelChange("spawnCount", parseInt(e.target.value) || 1)}
                  />
                </S.FormGroup>
                <S.FormGroup>
                  <S.Label>Max Catch Attempts</S.Label>
                  <S.Input
                    type="number"
                    min={1}
                    value={wildAreaConfig.maxAttemptsPerSpawn}
                    onChange={(e) => handleWildAreaTopLevelChange("maxAttemptsPerSpawn", parseInt(e.target.value) || 1)}
                  />
                </S.FormGroup>
                <S.FormGroup>
                  <S.Label>Max Generation</S.Label>
                  <S.Input
                    type="number"
                    min={1}
                    value={wildAreaConfig.maxGeneration}
                    onChange={(e) => handleWildAreaTopLevelChange("maxGeneration", parseInt(e.target.value) || 1)}
                  />
                </S.FormGroup>
                <S.FormGroup style={{ justifyContent: "center" }}>
                  <S.CheckboxLabel>
                    <input
                      type="checkbox"
                      checked={wildAreaConfig.allowLegendarySpawn}
                      onChange={(e) => handleWildAreaTopLevelChange("allowLegendarySpawn", e.target.checked)}
                    />
                    Allow Legendary Spawns
                  </S.CheckboxLabel>
                </S.FormGroup>
              </S.FormGrid>
            )}

            {/* TAB CONTENT: Spawn & Rarity Weights */}
            {activeTab === "weights" && wildAreaConfig && cardRewardConfig && (
              <S.FormGrid>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", border: "2px solid #000", padding: "16px", background: "#f8fafc" }}>
                  <h3 style={{ fontFamily: "VT323", fontSize: "22px", margin: "0 0 8px 0", borderBottom: "2px dashed #000", paddingBottom: "4px", textTransform: "uppercase" }}>
                    Global Wild Spawn weights (%)
                  </h3>
                  {Object.entries(wildAreaConfig.spawnWeights).map(([rarity, val]) => (
                    <S.FormGroup key={rarity}>
                      <S.Label>{rarity}</S.Label>
                      <S.Input
                        type="number"
                        step="0.01"
                        min={0}
                        value={val}
                        onChange={(e) => handleSpawnWeightChange(rarity, parseFloat(e.target.value) || 0)}
                      />
                    </S.FormGroup>
                  ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px", border: "2px solid #000", padding: "16px", background: "#f8fafc" }}>
                  <h3 style={{ fontFamily: "VT323", fontSize: "22px", margin: "0 0 8px 0", borderBottom: "2px dashed #000", paddingBottom: "4px", textTransform: "uppercase" }}>
                    Card reward roll weights (%)
                  </h3>
                  {Object.entries(cardRewardConfig.rarityWeights).map(([tier, val]) => (
                    <S.FormGroup key={tier}>
                      <S.Label>{tier}</S.Label>
                      <S.Input
                        type="number"
                        step="0.01"
                        min={0}
                        value={val}
                        onChange={(e) => handleCardRewardWeightChange(tier, parseFloat(e.target.value) || 0)}
                      />
                    </S.FormGroup>
                  ))}
                </div>
              </S.FormGrid>
            )}

            {/* TAB CONTENT: Wild Biome Rules */}
            {activeTab === "areas" && wildAreaConfig && activeArea && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <S.FormGroup>
                  <S.Label>Select Wild Area Biome</S.Label>
                  <S.Select value={selectedAreaCode} onChange={(e) => setSelectedAreaCode(e.target.value)}>
                    {wildAreaConfig.wildAreas.map((area) => (
                      <option key={area.code} value={area.code}>
                        {area.name} ({area.code})
                      </option>
                    ))}
                  </S.Select>
                </S.FormGroup>

                <div style={{ border: "2px solid #000000", padding: "16px", background: "#f8fafc", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <h3 style={{ fontFamily: "VT323", fontSize: "22px", margin: "0", borderBottom: "2px dashed #000", paddingBottom: "4px", textTransform: "uppercase" }}>
                    Editing: {activeArea.name} ({activeArea.code})
                  </h3>

                  <S.FormGrid>
                    <S.FormGroup>
                      <S.Label>Display Name</S.Label>
                      <S.Input
                        type="text"
                        value={activeArea.name}
                        onChange={(e) => handleAreaChange("name", e.target.value)}
                      />
                    </S.FormGroup>
                    <S.FormGroup>
                      <S.Label>Spawn Count Override <S.LabelSubtitle>(blank = inherit)</S.LabelSubtitle></S.Label>
                      <S.Input
                        type="number"
                        placeholder="Inherit"
                        value={activeArea.spawnCount === null || activeArea.spawnCount === undefined ? "" : activeArea.spawnCount}
                        onChange={(e) => handleNullableNumberChange("spawnCount", e.target.value)}
                      />
                    </S.FormGroup>
                    <S.FormGroup>
                      <S.Label>Reset Interval Override <S.LabelSubtitle>(blank = inherit)</S.LabelSubtitle></S.Label>
                      <S.Input
                        type="number"
                        placeholder="Inherit"
                        value={activeArea.resetIntervalMinutes === null || activeArea.resetIntervalMinutes === undefined ? "" : activeArea.resetIntervalMinutes}
                        onChange={(e) => handleNullableNumberChange("resetIntervalMinutes", e.target.value)}
                      />
                    </S.FormGroup>
                    <S.FormGroup>
                      <S.Label>Min Generation <S.LabelSubtitle>(blank = 1)</S.LabelSubtitle></S.Label>
                      <S.Input
                        type="number"
                        placeholder="1"
                        value={activeArea.minGeneration === null || activeArea.minGeneration === undefined ? "" : activeArea.minGeneration}
                        onChange={(e) => handleNullableNumberChange("minGeneration", e.target.value)}
                      />
                    </S.FormGroup>
                    <S.FormGroup>
                      <S.Label>Max Generation <S.LabelSubtitle>(blank = inherit)</S.LabelSubtitle></S.Label>
                      <S.Input
                        type="number"
                        placeholder="Inherit"
                        value={activeArea.maxGeneration === null || activeArea.maxGeneration === undefined ? "" : activeArea.maxGeneration}
                        onChange={(e) => handleNullableNumberChange("maxGeneration", e.target.value)}
                      />
                    </S.FormGroup>

                    <S.FormGroup>
                      <S.Label>Allow Legendary</S.Label>
                      <S.Select
                        value={activeArea.allowLegendary === null || activeArea.allowLegendary === undefined ? "null" : activeArea.allowLegendary ? "true" : "false"}
                        onChange={(e) => handleNullableBooleanChange("allowLegendary", e.target.value)}
                      >
                        <option value="null">Inherit (Default)</option>
                        <option value="true">Allowed</option>
                        <option value="false">Banned</option>
                      </S.Select>
                    </S.FormGroup>

                    <S.FormGroup>
                      <S.Label>Allow Mythical</S.Label>
                      <S.Select
                        value={activeArea.allowMythical === null || activeArea.allowMythical === undefined ? "null" : activeArea.allowMythical ? "true" : "false"}
                        onChange={(e) => handleNullableBooleanChange("allowMythical", e.target.value)}
                      >
                        <option value="null">Inherit (Banned)</option>
                        <option value="true">Allowed</option>
                        <option value="false">Banned</option>
                      </S.Select>
                    </S.FormGroup>

                    <S.FormGroup>
                      <S.Label>Allow Baby</S.Label>
                      <S.Select
                        value={activeArea.allowBaby === null || activeArea.allowBaby === undefined ? "null" : activeArea.allowBaby ? "true" : "false"}
                        onChange={(e) => handleNullableBooleanChange("allowBaby", e.target.value)}
                      >
                        <option value="null">Inherit (Allowed)</option>
                        <option value="true">Allowed</option>
                        <option value="false">Banned</option>
                      </S.Select>
                    </S.FormGroup>
                  </S.FormGrid>

                  {/* Rarity weights override section */}
                  <h4 style={{ fontFamily: "VT323", fontSize: "19px", margin: "12px 0 0 0", borderBottom: "1px dashed #ccc", paddingBottom: "2px", textTransform: "uppercase" }}>
                    Rarity weights override (leave all 0 to inherit global weights)
                  </h4>
                  <S.FormGrid>
                    {["Common", "Uncommon", "Rare", "Epic", "Legendary"].map((rarity) => {
                      const key = rarity;
                      const val = activeArea.rarityWeights?.[key] || 0;
                      return (
                        <S.FormGroup key={key}>
                          <S.Label>{rarity}</S.Label>
                          <S.Input
                            type="number"
                            step="0.01"
                            min={0}
                            value={val}
                            onChange={(e) => handleAreaRarityWeightChange(key, parseFloat(e.target.value) || 0)}
                          />
                        </S.FormGroup>
                      );
                    })}
                  </S.FormGrid>

                  {/* Biome lists inputs */}
                  <h4 style={{ fontFamily: "VT323", fontSize: "19px", margin: "16px 0 0 0", borderBottom: "1px dashed #ccc", paddingBottom: "2px", textTransform: "uppercase" }}>
                    Biome Rules & Match Lists
                  </h4>

                  <S.FormGrid>
                    {/* Required Any Types */}
                    <S.FormGroup>
                      <S.Label>Required Any Types</S.Label>
                      <S.AddTagWrapper>
                        <S.Input
                          placeholder="e.g. water"
                          value={newRequiredAnyType}
                          onChange={(e) => setNewRequiredAnyType(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addAreaArrayItem("requiredAnyTypes", newRequiredAnyType.trim().toLowerCase());
                              setNewRequiredAnyType("");
                            }
                          }}
                        />
                        <S.Button onClick={() => {
                          addAreaArrayItem("requiredAnyTypes", newRequiredAnyType.trim().toLowerCase());
                          setNewRequiredAnyType("");
                        }} style={{ padding: "4px 12px" }}>+</S.Button>
                      </S.AddTagWrapper>
                      <S.TagList>
                        {activeArea.requiredAnyTypes?.map((t, idx) => (
                          <S.TagItem key={idx} $variant="type">
                            {t}
                            <button onClick={() => removeAreaArrayItem("requiredAnyTypes", idx)}>x</button>
                          </S.TagItem>
                        ))}
                      </S.TagList>
                    </S.FormGroup>

                    {/* Secondary Allowed Types */}
                    <S.FormGroup>
                      <S.Label>Secondary Allowed Types</S.Label>
                      <S.AddTagWrapper>
                        <S.Input
                          placeholder="e.g. ice"
                          value={newSecondaryAllowedType}
                          onChange={(e) => setNewSecondaryAllowedType(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addAreaArrayItem("secondaryAllowedTypes", newSecondaryAllowedType.trim().toLowerCase());
                              setNewSecondaryAllowedType("");
                            }
                          }}
                        />
                        <S.Button onClick={() => {
                          addAreaArrayItem("secondaryAllowedTypes", newSecondaryAllowedType.trim().toLowerCase());
                          setNewSecondaryAllowedType("");
                        }} style={{ padding: "4px 12px" }}>+</S.Button>
                      </S.AddTagWrapper>
                      <S.TagList>
                        {activeArea.secondaryAllowedTypes?.map((t, idx) => (
                          <S.TagItem key={idx} $variant="type">
                            {t}
                            <button onClick={() => removeAreaArrayItem("secondaryAllowedTypes", idx)}>x</button>
                          </S.TagItem>
                        ))}
                      </S.TagList>
                    </S.FormGroup>

                    {/* Banned Types */}
                    <S.FormGroup>
                      <S.Label>Banned Types</S.Label>
                      <S.AddTagWrapper>
                        <S.Input
                          placeholder="e.g. fire"
                          value={newBannedType}
                          onChange={(e) => setNewBannedType(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addAreaArrayItem("bannedTypes", newBannedType.trim().toLowerCase());
                              setNewBannedType("");
                            }
                          }}
                        />
                        <S.Button onClick={() => {
                          addAreaArrayItem("bannedTypes", newBannedType.trim().toLowerCase());
                          setNewBannedType("");
                        }} style={{ padding: "4px 12px" }}>+</S.Button>
                      </S.AddTagWrapper>
                      <S.TagList>
                        {activeArea.bannedTypes?.map((t, idx) => (
                          <S.TagItem key={idx} $variant="type">
                            {t}
                            <button onClick={() => removeAreaArrayItem("bannedTypes", idx)}>x</button>
                          </S.TagItem>
                        ))}
                      </S.TagList>
                    </S.FormGroup>

                    {/* Required Any Tags */}
                    <S.FormGroup>
                      <S.Label>Required Any Tags</S.Label>
                      <S.AddTagWrapper>
                        <S.Input
                          placeholder="e.g. aquatic"
                          value={newRequiredAnyTag}
                          onChange={(e) => setNewRequiredAnyTag(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addAreaArrayItem("requiredAnyTags", newRequiredAnyTag.trim().toLowerCase());
                              setNewRequiredAnyTag("");
                            }
                          }}
                        />
                        <S.Button onClick={() => {
                          addAreaArrayItem("requiredAnyTags", newRequiredAnyTag.trim().toLowerCase());
                          setNewRequiredAnyTag("");
                        }} style={{ padding: "4px 12px" }}>+</S.Button>
                      </S.AddTagWrapper>
                      <S.TagList>
                        {activeArea.requiredAnyTags?.map((t, idx) => (
                          <S.TagItem key={idx}>
                            {t}
                            <button onClick={() => removeAreaArrayItem("requiredAnyTags", idx)}>x</button>
                          </S.TagItem>
                        ))}
                      </S.TagList>
                    </S.FormGroup>

                    {/* Preferred Tags */}
                    <S.FormGroup>
                      <S.Label>Preferred Tags</S.Label>
                      <S.AddTagWrapper>
                        <S.Input
                          placeholder="e.g. water"
                          value={newPreferredTag}
                          onChange={(e) => setNewPreferredTag(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addAreaArrayItem("preferredTags", newPreferredTag.trim().toLowerCase());
                              setNewPreferredTag("");
                            }
                          }}
                        />
                        <S.Button onClick={() => {
                          addAreaArrayItem("preferredTags", newPreferredTag.trim().toLowerCase());
                          setNewPreferredTag("");
                        }} style={{ padding: "4px 12px" }}>+</S.Button>
                      </S.AddTagWrapper>
                      <S.TagList>
                        {activeArea.preferredTags?.map((t, idx) => (
                          <S.TagItem key={idx}>
                            {t}
                            <button onClick={() => removeAreaArrayItem("preferredTags", idx)}>x</button>
                          </S.TagItem>
                        ))}
                      </S.TagList>
                    </S.FormGroup>

                    {/* Allowed Tags */}
                    <S.FormGroup>
                      <S.Label>Allowed Tags</S.Label>
                      <S.AddTagWrapper>
                        <S.Input
                          placeholder="e.g. icy"
                          value={newAllowedTag}
                          onChange={(e) => setNewAllowedTag(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addAreaArrayItem("allowedTags", newAllowedTag.trim().toLowerCase());
                              setNewAllowedTag("");
                            }
                          }}
                        />
                        <S.Button onClick={() => {
                          addAreaArrayItem("allowedTags", newAllowedTag.trim().toLowerCase());
                          setNewAllowedTag("");
                        }} style={{ padding: "4px 12px" }}>+</S.Button>
                      </S.AddTagWrapper>
                      <S.TagList>
                        {activeArea.allowedTags?.map((t, idx) => (
                          <S.TagItem key={idx}>
                            {t}
                            <button onClick={() => removeAreaArrayItem("allowedTags", idx)}>x</button>
                          </S.TagItem>
                        ))}
                      </S.TagList>
                    </S.FormGroup>

                    {/* Banned Tags */}
                    <S.FormGroup>
                      <S.Label>Banned Tags</S.Label>
                      <S.AddTagWrapper>
                        <S.Input
                          placeholder="e.g. volcano"
                          value={newBannedTag}
                          onChange={(e) => setNewBannedTag(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addAreaArrayItem("bannedTags", newBannedTag.trim().toLowerCase());
                              setNewBannedTag("");
                            }
                          }}
                        />
                        <S.Button onClick={() => {
                          addAreaArrayItem("bannedTags", newBannedTag.trim().toLowerCase());
                          setNewBannedTag("");
                        }} style={{ padding: "4px 12px" }}>+</S.Button>
                      </S.AddTagWrapper>
                      <S.TagList>
                        {activeArea.bannedTags?.map((t, idx) => (
                          <S.TagItem key={idx}>
                            {t}
                            <button onClick={() => removeAreaArrayItem("bannedTags", idx)}>x</button>
                          </S.TagItem>
                        ))}
                      </S.TagList>
                    </S.FormGroup>

                    {/* Allowed Habitats */}
                    <S.FormGroup>
                      <S.Label>Allowed Habitats</S.Label>
                      <S.AddTagWrapper>
                        <S.Input
                          placeholder="e.g. grassland"
                          value={newAllowedHabitat}
                          onChange={(e) => setNewAllowedHabitat(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addAreaArrayItem("allowedHabitats", newAllowedHabitat.trim().toLowerCase());
                              setNewAllowedHabitat("");
                            }
                          }}
                        />
                        <S.Button onClick={() => {
                          addAreaArrayItem("allowedHabitats", newAllowedHabitat.trim().toLowerCase());
                          setNewAllowedHabitat("");
                        }} style={{ padding: "4px 12px" }}>+</S.Button>
                      </S.AddTagWrapper>
                      <S.TagList>
                        {activeArea.allowedHabitats?.map((t, idx) => (
                          <S.TagItem key={idx}>
                            {t}
                            <button onClick={() => removeAreaArrayItem("allowedHabitats", idx)}>x</button>
                          </S.TagItem>
                        ))}
                      </S.TagList>
                    </S.FormGroup>

                    {/* Preferred Habitats */}
                    <S.FormGroup>
                      <S.Label>Preferred Habitats</S.Label>
                      <S.AddTagWrapper>
                        <S.Input
                          placeholder="e.g. forest"
                          value={newPreferredHabitat}
                          onChange={(e) => setNewPreferredHabitat(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addAreaArrayItem("preferredHabitats", newPreferredHabitat.trim().toLowerCase());
                              setNewPreferredHabitat("");
                            }
                          }}
                        />
                        <S.Button onClick={() => {
                          addAreaArrayItem("preferredHabitats", newPreferredHabitat.trim().toLowerCase());
                          setNewPreferredHabitat("");
                        }} style={{ padding: "4px 12px" }}>+</S.Button>
                      </S.AddTagWrapper>
                      <S.TagList>
                        {activeArea.preferredHabitats?.map((t, idx) => (
                          <S.TagItem key={idx}>
                            {t}
                            <button onClick={() => removeAreaArrayItem("preferredHabitats", idx)}>x</button>
                          </S.TagItem>
                        ))}
                      </S.TagList>
                    </S.FormGroup>

                    {/* Safe Fallback IDs */}
                    <S.FormGroup>
                      <S.Label>Safe Fallback IDs</S.Label>
                      <S.AddTagWrapper>
                        <S.Input
                          type="number"
                          placeholder="e.g. 25"
                          value={newSafeFallbackId}
                          onChange={(e) => setNewSafeFallbackId(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const idNum = parseInt(newSafeFallbackId);
                              if (!isNaN(idNum)) {
                                addAreaArrayItem("safeFallbackPokemonIds", idNum);
                              }
                              setNewSafeFallbackId("");
                            }
                          }}
                        />
                        <S.Button onClick={() => {
                          const idNum = parseInt(newSafeFallbackId);
                          if (!isNaN(idNum)) {
                            addAreaArrayItem("safeFallbackPokemonIds", idNum);
                          }
                          setNewSafeFallbackId("");
                        }} style={{ padding: "4px 12px" }}>+</S.Button>
                      </S.AddTagWrapper>
                      <S.TagList>
                        {activeArea.safeFallbackPokemonIds?.map((t, idx) => (
                          <S.TagItem key={idx} $variant="id">
                            ID: {t}
                            <button onClick={() => removeAreaArrayItem("safeFallbackPokemonIds", idx)}>x</button>
                          </S.TagItem>
                        ))}
                      </S.TagList>
                    </S.FormGroup>
                  </S.FormGrid>
                </div>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
              <S.Button onClick={handleSaveConfigs} disabled={savingConfig} $variant="success">
                {savingConfig ? <S.Spinner /> : "Save Configuration System"}
              </S.Button>
            </div>
          </>
        )}
      </S.ConfigSection>

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
                    <S.StatusBadge $confirmed={trainer.emailConfirmed}>
                      {trainer.emailConfirmed ? "Verified" : "Unverified"}
                    </S.StatusBadge>
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
