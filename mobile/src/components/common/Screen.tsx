import { LinearGradient } from "expo-linear-gradient";
import { PropsWithChildren } from "react";
import { SafeAreaView, ScrollView, StyleSheet, ViewStyle } from "react-native";

import { NetworkBanner } from "./NetworkBanner";
import { colors, spacing } from "../../theme/tokens";

type ScreenProps = PropsWithChildren<{
  scroll?: boolean;
  contentStyle?: ViewStyle;
}>;

export const Screen = ({ children, scroll = true, contentStyle }: ScreenProps) => {
  const content = scroll ? (
    <ScrollView contentContainerStyle={[styles.content, contentStyle]}>
      <NetworkBanner />
      {children}
    </ScrollView>
  ) : (
    <SafeAreaView style={[styles.content, contentStyle]}>
      <NetworkBanner />
      {children}
    </SafeAreaView>
  );

  return (
    <LinearGradient colors={["#ffffff", colors.background]} style={styles.root}>
      {content}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    flexGrow: 1,
  },
});
