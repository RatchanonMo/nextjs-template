import { StyleSheet, Text, View } from "react-native";

import { useAppStore } from "../../store/appStore";
import { colors, radius, spacing, typography } from "../../theme/tokens";

export const NetworkBanner = () => {
  const isOnline = useAppStore((state) => state.isOnline);
  const pendingQueueCount = useAppStore((state) => state.pendingQueueCount);
  const queueHydrated = useAppStore((state) => state.queueHydrated);

  if (!queueHydrated) {
    return null;
  }

  if (isOnline && pendingQueueCount === 0) {
    return null;
  }

  const text = isOnline
    ? `Syncing ${pendingQueueCount} queued change${pendingQueueCount > 1 ? "s" : ""}`
    : `Offline mode: ${pendingQueueCount} change${pendingQueueCount > 1 ? "s" : ""} queued`;

  return (
    <View style={[styles.root, isOnline ? styles.info : styles.warning]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    borderRadius: radius.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
  },
  warning: {
    backgroundColor: "rgba(245, 158, 11, 0.18)",
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.35)",
  },
  info: {
    backgroundColor: "rgba(59, 130, 246, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.28)",
  },
  text: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: "600",
    textAlign: "center",
  },
});
