import React from "react";
import styled from "@emotion/styled";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Text } from "..";

const StyledLoading = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "1rem",
  gap: "1rem",
});

const LottieWrapper = styled("div")({
  width: "80px",
  height: "80px",
});

const Loading: React.FC<{ label?: string }> = ({ label }) => {
  return (
    <StyledLoading>
      <LottieWrapper>
        <DotLottieReact
          src="https://lottie.host/ce673ddc-d57c-4e8a-846e-d21872e693c3/y3j8lzzlZT.lottie"
          loop
          autoplay
        />
      </LottieWrapper>
      {label && (
        <Text variant="outlined" size="lg">
          {label}
        </Text>
      )}
    </StyledLoading>
  );
};

export default Loading;
