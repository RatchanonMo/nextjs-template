import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { taskAPI } from "../../../api/taskAPI";
import { GlassCard } from "../../../components/common/GlassCard";
import { PageHeader } from "../../../components/common/PageHeader";
import { PrimaryButton } from "../../../components/common/PrimaryButton";
import { Screen } from "../../../components/common/Screen";
import { queryKeys } from "../../../constants/queryKeys";
import { AppStackParamList } from "../../../navigation/types";
import { useFavoriteStore } from "../../../store/favoriteStore";
import { colors, spacing, typography } from "../../../theme/tokens";

type DetailRoute = RouteProp<AppStackParamList, "TaskDetail">;

export const TaskDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<DetailRoute>();
  const taskId = route.params?.taskId ?? "";

  // Lazy query — only fires when taskId is present
  const taskQuery = useQuery({
    queryKey: queryKeys.task(taskId),
    queryFn: () => taskAPI.getTask(taskId),
    enabled: !!taskId,
  });

  const isFavorite = useFavoriteStore((s) => s.isFavorite(taskId));
  const toggle = useFavoriteStore((s) => s.toggle);

  const task = taskQuery.data;

  return (
    <Screen>
      <PageHeader
        title="Task Detail"
        subtitle={taskId ? `ID: ${taskId}` : "Loading…"}
        onRefresh={() => void taskQuery.refetch()}
        refreshing={taskQuery.isRefetching}
      />

      {taskQuery.isLoading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading task details…</Text>
        </View>
      )}

      {taskQuery.isError && (
        <GlassCard>
          <Text style={styles.error}>Could not load task details.</Text>
          <PrimaryButton label="Retry" onPress={() => void taskQuery.refetch()} />
        </GlassCard>
      )}

      {task && (
        <>
          <GlassCard>
            <Text style={styles.taskTitle}>{task.title}</Text>
            {task.description ? (
              <Text style={styles.desc}>{task.description}</Text>
            ) : null}
          </GlassCard>

          <GlassCard>
            <View style={styles.row}>
              <Text style={styles.metaLabel}>Status</Text>
              <Text style={styles.metaValue}>{task.status}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.metaLabel}>Priority</Text>
              <Text style={styles.metaValue}>{task.priority}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.metaLabel}>Category</Text>
              <Text style={styles.metaValue}>{task.category}</Text>
            </View>
          </GlassCard>

          <PrimaryButton
            label={isFavorite ? "★  Remove Favorite" : "☆  Add to Favorites"}
            onPress={() => toggle(taskId)}
          />
        </>
      )}

      <PrimaryButton label="← Back to List" onPress={() => navigation.goBack()} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
  taskTitle: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  desc: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.xs,
  },
  metaLabel: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
  metaValue: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "600",
  },
  error: {
    color: colors.danger,
    fontSize: typography.body,
    marginBottom: spacing.sm,
  },
});
