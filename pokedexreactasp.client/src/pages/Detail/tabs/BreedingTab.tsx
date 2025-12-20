import React from 'react';
import { Text } from '../../../components/ui';
import * as S from './BreedingTab.style';

interface BreedingTabProps {
  eggGroups: string[];
  genderRate: number;
  hatchCounter: number;
  baseHappiness: number;
}

const BreedingTab: React.FC<BreedingTabProps> = ({
  eggGroups,
  genderRate,
  hatchCounter,
  baseHappiness
}) => {
  const getGenderInfo = (genderRate: number) => {
    if (genderRate === -1) {
      return { male: 0, female: 0, genderless: true };
    }
    const femalePercent = (genderRate / 8) * 100;
    const malePercent = 100 - femalePercent;
    return { male: malePercent, female: femalePercent, genderless: false };
  };

  const genderInfo = getGenderInfo(genderRate);

  // Calculate egg cycles to steps
  const eggCycles = hatchCounter;
  const stepsToHatch = eggCycles * 257; // Each egg cycle is approximately 257 steps

  return (
    <S.Container>
      <S.Section>
        <S.SectionTitle>
          <Text as="h3">Egg Groups</Text>
        </S.SectionTitle>
        <S.Card>
          {eggGroups.length > 0 ? (
            <S.EggGroupGrid>
              {eggGroups.map((group, index) => (
                <S.EggGroupBadge key={index}>
                  <S.EggGroupName>{group.replace('-', ' ')}</S.EggGroupName>
                </S.EggGroupBadge>
              ))}
            </S.EggGroupGrid>
          ) : (
            <S.NoData>
              <Text>No egg group information available</Text>
            </S.NoData>
          )}
        </S.Card>
      </S.Section>

      {/* Gender Ratio Section */}
      <S.Section>
        <S.SectionTitle>
          <Text as="h3">Gender Ratio</Text>
        </S.SectionTitle>
        <S.Card>
          {genderInfo.genderless ? (
            <S.GenderlessBox>
              <Text style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Genderless</Text>
              <Text style={{ color: '#9CA3AF' }}>
                This Pokémon has no gender
              </Text>
            </S.GenderlessBox>
          ) : (
            <S.GenderContainer>
              <S.GenderBar>
                {genderInfo.male > 0 && (
                  <S.MaleBar percentage={genderInfo.male}>
                    <S.GenderLabel show={genderInfo.male > 15}>
                      ♂ {genderInfo.male.toFixed(1)}%
                    </S.GenderLabel>
                  </S.MaleBar>
                )}
                {genderInfo.female > 0 && (
                  <S.FemaleBar percentage={genderInfo.female}>
                    <S.GenderLabel show={genderInfo.female > 15}>
                      ♀ {genderInfo.female.toFixed(1)}%
                    </S.GenderLabel>
                  </S.FemaleBar>
                )}
              </S.GenderBar>
              <S.GenderLegend>
                {genderInfo.male > 0 && (
                  <S.GenderLegendItem>
                    <S.MaleIcon>♂</S.MaleIcon>
                    <Text>Male: {genderInfo.male.toFixed(1)}%</Text>
                  </S.GenderLegendItem>
                )}
                {genderInfo.female > 0 && (
                  <S.GenderLegendItem>
                    <S.FemaleIcon>♀</S.FemaleIcon>
                    <Text>Female: {genderInfo.female.toFixed(1)}%</Text>
                  </S.GenderLegendItem>
                )}
              </S.GenderLegend>
            </S.GenderContainer>
          )}
        </S.Card>
      </S.Section>

      {/* Hatching Section */}
      <S.Section>
        <S.SectionTitle>
          <Text as="h3">Hatching Information</Text>
        </S.SectionTitle>
        <S.InfoGrid>
          <S.InfoCard>
            <S.InfoLabel>Egg Cycles</S.InfoLabel>
            <S.InfoValue>{eggCycles}</S.InfoValue>
            <S.InfoDescription>Number of cycles to hatch</S.InfoDescription>
          </S.InfoCard>

          <S.InfoCard>
            <S.InfoLabel>Steps to Hatch</S.InfoLabel>
            <S.InfoValue>{stepsToHatch.toLocaleString()}</S.InfoValue>
            <S.InfoDescription>Approximate steps needed</S.InfoDescription>
          </S.InfoCard>

          <S.InfoCard>
            <S.InfoLabel>Initial Happiness</S.InfoLabel>
            <S.InfoValue>{baseHappiness}</S.InfoValue>
            <S.HappinessBar>
              <S.HappinessFill happiness={baseHappiness} />
            </S.HappinessBar>
            <S.InfoDescription>Friendship when hatched</S.InfoDescription>
          </S.InfoCard>
        </S.InfoGrid>
      </S.Section>

      {/* Breeding Tips */}
      <S.Section>
        <S.SectionTitle>
          <Text as="h3">Breeding Tips</Text>
        </S.SectionTitle>
        <S.TipsCard>
          <S.Tip>
            <S.TipContent>
              <S.TipTitle>Faster Hatching</S.TipTitle>
              <S.TipText>
                Use a Pokémon with Flame Body or Magma Armor ability to halve egg cycles!
              </S.TipText>
            </S.TipContent>
          </S.Tip>
          <S.Tip>
            <S.TipContent>
              <S.TipTitle>Egg Moves</S.TipTitle>
              <S.TipText>
                Breed with compatible Pokémon to pass down special moves to offspring.
              </S.TipText>
            </S.TipContent>
          </S.Tip>
          <S.Tip>
            <S.TipContent>
              <S.TipTitle>Perfect IVs</S.TipTitle>
              <S.TipText>
                Use Destiny Knot to pass down 5 random IVs from parents to offspring.
              </S.TipText>
            </S.TipContent>
          </S.Tip>
        </S.TipsCard>
      </S.Section>
    </S.Container>
  );
};

export default BreedingTab;
