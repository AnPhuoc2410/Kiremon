import { useEffect } from "react";
import { Global } from "@emotion/react";
import { Toaster, toast } from "react-hot-toast";

import Routes from "./routes";
import { GlobalProvider } from "./contexts";
import NoSignal from "./components/ui/NoSignal";
import { globalStyle } from "./emotion/global.style";
import withOnlineStatus from "./components/utils/hoc/onlineStatus";

interface AppProps {
  onlineStatus?: boolean;
}

function App({ onlineStatus }: AppProps) {
  useEffect(() => {
    if (!onlineStatus) {
      toast(() => <NoSignal />, {
        position: "top-right",
        duration: 50000,
      });
    }

    return () => {
      toast.dismiss();
    };
  }, [onlineStatus]);

  return (
    <>
      <Global styles={globalStyle} />
      <GlobalProvider>
        <Routes />
      </GlobalProvider>
      <Toaster position="top-right" />
    </>
  );
}

export default withOnlineStatus(App);
