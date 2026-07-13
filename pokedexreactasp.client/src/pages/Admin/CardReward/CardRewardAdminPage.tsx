import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { IconDeviceFloppy, IconRefresh, IconCards } from "@tabler/icons-react";
import { Loading, Text, Button } from "@/components/ui";
import { cardRewardAdminService } from "@/services/admin/card-reward-admin.service";
import type { CardRewardSettings } from "@/types/card-reward.types";
import * as S from "./CardRewardAdminPage.style";

const RARITY_ORDER = [
  "Common",
  "Uncommon",
  "Rare",
  "HoloRare",
  "UltraRare",
  "SecretRare",
  "Promo",
  "Unknown",
];

export default function CardRewardAdminPage() {
  const [settings, setSettings] = useState<CardRewardSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await cardRewardAdminService.getSettings();
      setSettings(data);
    } catch {
      toast.error("Failed to load Card Reward settings");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;
    try {
      setSaving(true);
      await cardRewardAdminService.saveSettings(settings);
      toast.success("Card Reward settings saved!");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleWeightChange = (rarity: string, raw: string) => {
    const value = parseFloat(raw) || 0;
    setSettings((prev) =>
      prev
        ? { ...prev, rarityWeights: { ...prev.rarityWeights, [rarity]: value } }
        : prev,
    );
  };

  const total = settings
    ? Object.values(settings.rarityWeights).reduce((s, v) => s + v, 0)
    : 0;
  const totalOk = Math.abs(total - 100) < 0.01;

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
        <Loading label="Loading Card Reward Settings..." />
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

  const orderedRarities = [
    ...RARITY_ORDER.filter((r) => r in settings.rarityWeights),
    ...Object.keys(settings.rarityWeights).filter(
      (r) => !RARITY_ORDER.includes(r),
    ),
  ];

  return (
    <S.Page>
      <S.PageHeader>Card Reward Config</S.PageHeader>
      <S.PageSubtitle>
        Adjust rarity drop weights for TCG card rewards. Weights should sum to
        100.
      </S.PageSubtitle>

      <S.TopRow>
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
      </S.TopRow>

      <S.Card>
        <S.CardHeader>
          <IconCards />
          <h3>Rarity Weights</h3>
        </S.CardHeader>

        <S.CardDescription>
          Each value is a relative weight. Higher = more common drop. They
          don&apos;t need to sum to exactly 100, but it helps visualise
          percentages.
        </S.CardDescription>

        <S.WeightsGrid>
          {orderedRarities.map((rarity) => (
            <S.WeightCard key={rarity} $rarity={rarity}>
              <S.WeightLabel $rarity={rarity} htmlFor={`weight-${rarity}`}>
                {rarity}
              </S.WeightLabel>
              <S.WeightInput
                id={`weight-${rarity}`}
                type="number"
                min={0}
                step={0.5}
                value={settings.rarityWeights[rarity]}
                onChange={(e) => handleWeightChange(rarity, e.target.value)}
              />
            </S.WeightCard>
          ))}
        </S.WeightsGrid>

        <S.TotalRow>
          <S.TotalLabel>Total weight:</S.TotalLabel>
          <S.TotalValue $ok={totalOk}>
            {total.toFixed(1)}
            {totalOk ? " ✓" : " (≠ 100)"}
          </S.TotalValue>
        </S.TotalRow>
      </S.Card>
    </S.Page>
  );
}
