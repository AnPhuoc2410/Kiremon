import styled from "@emotion/styled";

export const backgroundImages = [
  "/static/background/route_1_morning.gif",
  "/static/background/pokemon_school.gif",
  "/static/background/pokemon_gate.gif",
  "/static/background/monastiraki_square.gif",
  "/static/background/petalburg_woods.gif",
  "/static/background/pokemon_cave.gif",
  "/static/background/pokemon_beach.gif",
  "/static/background/olivine_cafe.gif",
  "/static/background/national_park.gif",
  "/static/background/national_park_night.gif",
  "/static/background/slateport_market.gif",
  "/static/background/slateport_beach.gif",
  "/static/background/pacifidlog_town.gif",
  "/static/background/forest_shrine.gif",
  "/static/background/violet_city_3.gif",
  "/static/background/violet_city_4.gif",
];

export const getRandomBackgroundIndex = () => {
  return Math.floor(Math.random() * backgroundImages.length);
};

export const Container = styled.section<{ backgroundUrl: string }>`
  background-image: url("${(props) => props.backgroundUrl}");
  background-position: center;
  background-repeat: no-repeat;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: background-image 0.3s ease-in-out;
`;

export const Centering = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  gap: "10px",
});

export const A = styled("a")({
  textDecoration: "underline",
});

export const BackgroundNavButton = styled.button<{
  direction: "left" | "right";
}>`
  position: absolute;
  top: 50%;
  ${(props) => props.direction}: 20px;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 8px;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    background: rgba(0, 0, 0, 0.25);
    color: rgba(255, 255, 255, 0.9);
    transform: translateY(-50%) scale(1.05);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  svg {
    width: 28px;
    height: 28px;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    ${(props) => props.direction}: 10px;
    background: rgba(0, 0, 0, 0.08);

    svg {
      width: 24px;
      height: 24px;
    }
  }
`;
