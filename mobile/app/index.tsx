import { StatusBar } from "expo-status-bar";

import { AppProviders } from "../src/providers/AppProviders";
import { RootNavigator } from "../src/navigation/RootNavigator";

export default function AppEntry() {
  return (
    <AppProviders>
      <StatusBar style="dark" />
      <RootNavigator />
    </AppProviders>
  );
}
