import { PropsWithChildren } from "react";

import { NetworkProvider } from "./NetworkProvider";
import { QueryProvider } from "./QueryProvider";

export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <QueryProvider>
      <NetworkProvider>{children}</NetworkProvider>
    </QueryProvider>
  );
};
