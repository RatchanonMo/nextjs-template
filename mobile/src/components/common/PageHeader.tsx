import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "../../theme/tokens";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
  refreshing?: boolean;
  actionLabel?: string;
  onAction?: () => void;
};

export const PageHeader = ({
  title,
  subtitle,
  onRefresh,
  refreshing = false,
  actionLabel,
  onAction,
}: PageHeaderProps) => {
  return (
    <View style={styles.root}>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      <View style={styles.actions}>
        {onRefresh ? (
          <Pressable style={styles.secondaryButton} onPress={onRefresh} disabled={refreshing}>
            {refreshing ? (
              <ActivityIndicator size="small" color={colors.text} />
            ) : (
              <Text style={styles.secondaryLabel}>Refresh</Text>
            )}
          </Pressable>
        ) : null}

        {actionLabel && onAction ? (
          <Pressable style={styles.primaryButton} onPress={onAction}>
            <Text style={styles.primaryLabel}>{actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    marginTop: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  copy: {
    flex: 1,
  },
  title: {
    fontSize: typography.title - 2,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: typography.body,
    color: colors.textMuted,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  secondaryButton: {
    minWidth: 86,
    height: 38,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryLabel: {
    color: colors.text,
    fontWeight: "600",
    fontSize: typography.caption + 1,
  },
  primaryButton: {
    minWidth: 86,
    height: 38,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryLabel: {
    color: colors.surface,
    fontWeight: "700",
    fontSize: typography.caption + 1,
  },
});