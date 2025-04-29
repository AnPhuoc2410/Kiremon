import styled from "@emotion/styled";

const backgroundImages = [
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
];

const getRandomBackground = () => {
  const randomIndex = Math.floor(Math.random() * backgroundImages.length);
  return backgroundImages[randomIndex];
};

export const Container = styled("section")({
  backgroundImage: `url('${getRandomBackground()}')`,
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  width: "100vw",
  height: "100vh",
  backgroundSize: "cover",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  position: "relative",
  overflow: "hidden",
});

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
