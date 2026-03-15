import { useQuery } from "@tanstack/react-query";
import { StyleSheet, Text, View } from "react-native";

import { taskAPI } from "../../../api/taskAPI";
import { GlassCard } from "../../../components/common/GlassCard";
import { PageHeader } from "../../../components/common/PageHeader";
import { Screen } from "../../../components/common/Screen";
import { queryKeys } from "../../../constants/queryKeys";
import { useAppStore } from "../../../store/appStore";
import { colors, radius, spacing, typography } from "../../../theme/tokens";

export const AnalyticsScreen = () => {
  const isOnline = useAppStore((state) => state.isOnline);

  // Two independent queries — run in parallel, fail independently
  const statsQuery = useQuery({
    queryKey: queryKeys.taskStats,
    queryFn: () => taskAPI.getStats(),
  });

  const analyticsQuery = useQuery({
    queryKey: queryKeys.taskAnalytics,
    queryFn: () => taskAPI.getAnalytics(),
  });

  const completionRate = analyticsQuery.data?.overview.completionRate ?? 0;
  const bothRefetching = statsQuery.isRefetching || analyticsQuery.isRefetching;

  return (
    <Screen>
      <PageHeader
        title="Analytics"
        subtitle="Live productivity snapshot"
        onRefresh={() => {
          // Promise.all — both queries fire simultaneously
          void Promise.all([statsQuery.refetch(), analyticsQuery.refetch()]);
        }}
        refreshing={bothRefetching}
      />

      {/* Offline cached-data banner */}
      {!isOnline && (
        <View style={styles.cachedBanner}>
          <Text style={styles.cachedText}>📦  Cached Data — Offline mode</Text>
        </View>
      )}

      {/* Stats query — partial failure handled independently */}
      {statsQuery.isError ? (
        <GlassCard>
          <Text style={styles.errorLabel}>Stats Service Unavailable</Text>
          <Text style={styles.errorDesc}>Could not load task statistics. Pull to retry.</Text>
        </GlassCard>
      ) : (
        <>
          <GlassCard>
            <Text style={styles.metricLabel}>Total tasks</Text>
            <Text style={styles.metricValue}>{statsQuery.data?.total ?? "—"}</Text>
          </GlassCard>
          <GlassCard>
            <Text style={styles.metricLabel}>In Progress</Text>
            <Text style={styles.metricValue}>{statsQuery.data?.byStatus["in-progress"] ?? "—"}</Text>
          </GlassCard>
        </>
      )}

      {/* Analytics query — partial failure handled independently */}
      {analyticsQuery.isError ? (
        <GlassCard>
          <Text style={styles.errorLabel}>Analytics Service Unavailable</Text>
          <Text style={styles.errorDesc}>Could not load completion analytics. Pull to retry.</Text>
        </GlassCard>
      ) : (
        <GlassCard>
          <Text style={styles.metricLabel}>Completion rate</Text>
          <Text style={styles.metricValue}>{completionRate}%</Text>
        </GlassCard>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  cachedBanner: {
    borderRadius: radius.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: "rgba(107, 114, 128, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(107, 114, 128, 0.3)",
  },
  cachedText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: "600",
  },
  metricLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
  metricValue: {
    marginTop: spacing.xs,
    color: colors.text,
    fontSize: typography.title,
    fontWeight: "800",
  },
  errorLabel: {
    color: colors.danger,
    fontWeight: "700",
    fontSize: typography.body,
    marginBottom: 4,
  },
  errorDesc: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
});
