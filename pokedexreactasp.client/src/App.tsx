import { useEffect } from "react";
import { Global } from "@emotion/react";
import { Toaster, toast } from "react-hot-toast";

import Routes from "./routes";
import { GlobalProvider, AuthProvider } from "./contexts";
import { QueryProvider } from "./providers/QueryProvider";
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
      <QueryProvider>
        <GlobalProvider>
          <Routes />
        </GlobalProvider>
      </QueryProvider>
      <Toaster position="top-right" />
    </>
  );
}

export default withOnlineStatus(App);
