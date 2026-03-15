import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

import { colors, radius, spacing } from "../../theme/tokens";

type GlassCardProps = PropsWithChildren<{
  padded?: boolean;
}>;

export const GlassCard = ({ children, padded = true }: GlassCardProps) => {
  return (
    <View style={[styles.card, padded && styles.padded]}>{children}</View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
  },
  padded: {
    padding: spacing.md,
  },
});
