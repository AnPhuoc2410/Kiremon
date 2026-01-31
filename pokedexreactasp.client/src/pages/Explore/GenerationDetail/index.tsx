import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GenerationDetail as GenerationDetailComponent } from "@/components/ui";
import { Loading, NoSignal } from "@/components/ui";
import { useGenerationWithDetails } from "@/components/hooks/usePokeAPI";
import { getRegionTheme } from "@/components/utils/regionThemes";
import * as S from "./index.style";

const GenerationDetailPage: React.FC = () => {
  const { genId } = useParams<{ genId: string }>();
  const navigate = useNavigate();
  const {
    data: generation,
    isLoading,
    error,
  } = useGenerationWithDetails(genId || "");
  const [backgroundImage, setBackgroundImage] = useState<string>("");

  // Get region theme colors when data is available
  const regionTheme = useMemo(() => {
    if (!generation?.main_region?.name) return null;
    return getRegionTheme(generation.main_region.name);
  }, [generation?.main_region?.name]);

  // Apply region-specific styling
  const pageStyle = useMemo(() => {
    const style: React.CSSProperties = {};

    // Apply background image if available
    if (backgroundImage) {
      style.backgroundImage = `url(${backgroundImage})`;
    }

    // Apply region-based theme overlay
    if (regionTheme) {
      style.backgroundColor = regionTheme.background;
      style.backgroundBlendMode = "overlay";
      style.boxShadow = `inset 0 0 100px ${regionTheme.primary}66`;
    }

    return style;
  }, [backgroundImage, regionTheme]);

  useEffect(() => {
    // Set a random background image based on generation
    const backgrounds = [
      "forest_shrine.gif",
      "monastiraki_square.gif",
      "national_park_night.gif",
      "national_park.gif",
      "olivine_cafe.gif",
      "pacifidlog_town.gif",
      "petalburg_woods.gif",
      "pokemon_beach.gif",
      "pokemon_cave.gif",
      "pokemon_gate.gif",
      "pokemon_school.gif",
      "route_1_morning.gif",
      "slateport_beach.gif",
      "slateport_market.gif",
      "violet_city_3.gif",
      "violet_city_4.gif",
    ];

    const randomBackground =
      backgrounds[Math.floor(Math.random() * backgrounds.length)];
    setBackgroundImage(`/static/background/${randomBackground}`);
  }, [genId]);

  const handleBack = () => {
    navigate("/explore/generations");
  };

  if (isLoading) {
    return (
      <S.PageContainer style={pageStyle}>
        <S.ContentWrapper>
          <Loading label="Loading generation data..." />
        </S.ContentWrapper>
      </S.PageContainer>
    );
  }

  if (error || !generation) {
    return (
      <S.PageContainer style={pageStyle}>
        <S.ContentWrapper>
          <NoSignal />
          <S.BackButton onClick={handleBack}>
            Return to Generations
          </S.BackButton>
        </S.ContentWrapper>
      </S.PageContainer>
    );
  }

  return (
    <S.PageContainer style={pageStyle}>
      <S.BackButton
        onClick={handleBack}
        style={
          regionTheme
            ? {
                backgroundColor: `${regionTheme.primary}99`,
                color: "white",
              }
            : undefined
        }
      >
        ← Back to Generations
      </S.BackButton>
      <S.ContentWrapper>
        <GenerationDetailComponent generation={generation} />
      </S.ContentWrapper>
    </S.PageContainer>
  );
};

export default GenerationDetailPage;
