import NetInfo from "@react-native-community/netinfo";
import { PropsWithChildren, useEffect } from "react";

import { queueStore } from "../offline/queueStore";
import { syncOfflineQueue } from "../offline/syncManager";
import { useAppStore } from "../store/appStore";

export const NetworkProvider = ({ children }: PropsWithChildren) => {
  const setOnline = useAppStore((state) => state.setOnline);
  const setQueueHydrated = useAppStore((state) => state.setQueueHydrated);

  useEffect(() => {
    queueStore
      .read()
      .catch(() => undefined)
      .finally(() => setQueueHydrated(true));

    const unsubscribe = NetInfo.addEventListener(async (state) => {
      const online = Boolean(state.isConnected && state.isInternetReachable);
      setOnline(online);

      if (online) {
        await syncOfflineQueue();
      }
    });

    return () => unsubscribe();
  }, [setOnline, setQueueHydrated]);

  return <>{children}</>;
};
