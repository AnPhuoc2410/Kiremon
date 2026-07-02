import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  IconSettings,
  IconDeviceFloppy,
  IconRefresh,
  IconAlertCircle,
  IconMap,
  IconBolt,
} from "@tabler/icons-react";
import { Header, Loading, Text, Button } from "@/components/ui";
import { wildAreaAdminService } from "@/services/admin/wild-area-admin.service";
import * as S from "./WildAreaAdminPage.style";

export default function WildAreaAdminPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"global" | "areas">("global");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await wildAreaAdminService.getSettings();
      setSettings(data);
    } catch (error) {
      toast.error("Failed to load settings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      await wildAreaAdminService.saveSettings(settings);
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleGlobalChange = (field: string, value: any) => {
    setSettings({ ...settings, [field]: value });
  };

  const handleAreaChange = (index: number, field: string, value: any) => {
    const newAreas = [...settings.wildAreas] as any[];
    newAreas[index][field] = value;
    setSettings({ ...settings, wildAreas: newAreas });
  };

  if (loading) {
    return (
      <S.Page
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Loading label="Loading Admin Settings..." />
      </S.Page>
    );
  }

  if (!settings) {
    return (
      <S.Page
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Text variant="error">Failed to load configuration.</Text>
      </S.Page>
    );
  }

  return (
    <S.Page>
      <Header
        title="Wild Area Configuration"
        subtitle="Manage global spawning rules and area-specific behaviors"
      />

      <S.TopRow>
        <S.TabContainer>
          <S.TabButton
            $active={activeTab === "global"}
            onClick={() => setActiveTab("global")}
          >
            <IconSettings /> Global
          </S.TabButton>
          <S.TabButton
            $active={activeTab === "areas"}
            onClick={() => setActiveTab("areas")}
          >
            <IconMap /> Areas
          </S.TabButton>
        </S.TabContainer>

        <S.Actions>
          <Button variant="light" onClick={fetchSettings} disabled={saving}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <IconRefresh size={18} /> Reset
            </div>
          </Button>
          <Button variant="primary" onClick={saveSettings} disabled={saving}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {saving ? (
                <IconRefresh size={18} className="animate-spin" />
              ) : (
                <IconDeviceFloppy size={18} />
              )}
              Save Changes
            </div>
          </Button>
        </S.Actions>
      </S.TopRow>

      {activeTab === "global" && (
        <S.SettingsGrid>
          {/* Global Parameters Card */}
          <S.Card>
            <S.CardHeader>
              <IconBolt />
              <h3>General Parameters</h3>
            </S.CardHeader>

            <S.FormGroup>
              <S.Label>Reset Interval (Minutes)</S.Label>
              <S.Description>
                How often pokemon respawn for all users.
              </S.Description>
              <S.Input
                type="number"
                value={settings.resetIntervalMinutes}
                onChange={(e) =>
                  handleGlobalChange(
                    "resetIntervalMinutes",
                    parseInt(e.target.value) || 0,
                  )
                }
              />
            </S.FormGroup>

            <S.FormGroup>
              <S.Label>Default Spawn Count</S.Label>
              <S.Input
                type="number"
                value={settings.spawnCount}
                onChange={(e) =>
                  handleGlobalChange(
                    "spawnCount",
                    parseInt(e.target.value) || 0,
                  )
                }
              />
            </S.FormGroup>

            <S.FormGroup>
              <S.Label>Max Catch Attempts Per Spawn</S.Label>
              <S.Input
                type="number"
                value={settings.maxAttemptsPerSpawn}
                onChange={(e) =>
                  handleGlobalChange(
                    "maxAttemptsPerSpawn",
                    parseInt(e.target.value) || 0,
                  )
                }
              />
            </S.FormGroup>
          </S.Card>

          {/* Rarity & Generations Card */}
          <S.Card>
            <S.CardHeader>
              <IconAlertCircle />
              <h3>Rarity & Generations</h3>
            </S.CardHeader>

            <S.FormGroup>
              <S.ToggleContainer>
                <div>
                  <S.Label style={{ marginBottom: 4 }}>
                    Allow Legendary Spawns
                  </S.Label>
                  <S.Description>
                    Enable legendary pokemon to appear.
                  </S.Description>
                </div>
                <S.StyledCheckbox
                  type="checkbox"
                  checked={settings.allowLegendarySpawn}
                  onChange={(e) =>
                    handleGlobalChange("allowLegendarySpawn", e.target.checked)
                  }
                />
              </S.ToggleContainer>
            </S.FormGroup>

            <S.FormGroup>
              <S.Label>Max Generation</S.Label>
              <S.Input
                type="number"
                value={settings.maxGeneration}
                onChange={(e) =>
                  handleGlobalChange(
                    "maxGeneration",
                    parseInt(e.target.value) || 0,
                  )
                }
              />
            </S.FormGroup>
          </S.Card>
        </S.SettingsGrid>
      )}

      {activeTab === "areas" && (
        <S.SettingsGrid>
          {settings.wildAreas.map((area: any, index: number) => (
            <S.AreaCard key={area.code} $areaCode={area.code}>
              <S.AreaHeader>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 26,
                      fontFamily: '"VT323", monospace',
                    }}
                  >
                    {area.name}
                  </h3>
                </div>
                <S.AreaBadge>{area.code}</S.AreaBadge>
              </S.AreaHeader>

              <div style={{ display: "flex", gap: 16 }}>
                <S.FormGroup style={{ flex: 1 }}>
                  <S.Label style={{ fontSize: 16 }}>Spawn Count</S.Label>
                  <S.Input
                    type="number"
                    value={area.spawnCount}
                    onChange={(e) =>
                      handleAreaChange(
                        index,
                        "spawnCount",
                        parseInt(e.target.value) || 0,
                      )
                    }
                  />
                </S.FormGroup>

                <S.FormGroup style={{ flex: 1 }}>
                  <S.Label style={{ fontSize: 16 }}>Reset (Mins)</S.Label>
                  <S.Input
                    type="number"
                    value={area.resetIntervalMinutes}
                    onChange={(e) =>
                      handleAreaChange(
                        index,
                        "resetIntervalMinutes",
                        parseInt(e.target.value) || 0,
                      )
                    }
                  />
                </S.FormGroup>
              </div>

              <S.Divider />

              <S.FormGroup>
                <S.Label style={{ fontSize: 18 }}>Rarity Weights</S.Label>
                <S.WeightsGrid>
                  {Object.keys(area.rarityWeights || {}).map((rarity) => (
                    <S.WeightInputContainer key={rarity}>
                      <label>{rarity}</label>
                      <input
                        type="number"
                        value={area.rarityWeights[rarity]}
                        onChange={(e) => {
                          const newWeights = {
                            ...area.rarityWeights,
                            [rarity]: parseFloat(e.target.value) || 0,
                          };
                          handleAreaChange(index, "rarityWeights", newWeights);
                        }}
                      />
                    </S.WeightInputContainer>
                  ))}
                </S.WeightsGrid>
              </S.FormGroup>
            </S.AreaCard>
          ))}
        </S.SettingsGrid>
      )}
    </S.Page>
  );
}
