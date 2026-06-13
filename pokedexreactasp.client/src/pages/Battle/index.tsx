import { useSearchParams } from "react-router-dom";
import VersusBattleModule from "./modules/VSBattle";

const BattlePage = () => {
  const [searchParams] = useSearchParams();
  const leaderId = searchParams.get("leaderId") || "";
  const nickname = searchParams.get("nickname") || "";

  return (
    <VersusBattleModule leaderId={leaderId} pokemonNicknameParam={nickname} />
  );
};

export default BattlePage;
