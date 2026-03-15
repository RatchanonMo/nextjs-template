import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { useMemo, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { GlassCard } from "../../../components/common/GlassCard";
import { GlassInput } from "../../../components/common/GlassInput";
import { PageHeader } from "../../../components/common/PageHeader";
import { PrimaryButton } from "../../../components/common/PrimaryButton";
import { Screen } from "../../../components/common/Screen";
import { TaskItem } from "../../../components/tasks/TaskItem";
import { useTaskData } from "../../../hooks/useTaskData";
import { Task } from "../../../types/task";
import { colors, spacing, typography } from "../../../theme/tokens";

const emptyTask = {
  title: "Quick task",
  description: "Created from mobile",
  status: "todo" as const,
  priority: "medium" as const,
  category: "DEVELOPMENT" as const,
  tags: [],
};

export const InboxScreen = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [search, setSearch] = useState("");
  const [showOnlyActive, setShowOnlyActive] = useState(true);
  const { tasksQuery, createMutation, updateMutation, deleteMutation } = useTaskData();

  const toggleDone = async (task: Task) => {
    const id = task._id ?? task.id;
    await updateMutation.mutateAsync({
      id,
      patch: { status: task.status === "done" ? "todo" : "done" },
    });
  };

  const removeTask = async (task: Task) => {
    const id = task._id ?? task.id;
    await deleteMutation.mutateAsync(id);
  };

  const createTask = async () => {
    try {
      await createMutation.mutateAsync(emptyTask);
    } catch (error) {
      Alert.alert("Could not create task", error instanceof Error ? error.message : "Please retry");
    }
  };

  const allTasks = useMemo(() => tasksQuery.data ?? [], [tasksQuery.data]);

  const filteredTasks = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    return allTasks.filter((task) => {
      const searchable = `${task.title} ${task.description}`.toLowerCase();
      const searchMatched = normalized.length === 0 || searchable.includes(normalized);
      const statusMatched = showOnlyActive ? task.status !== "done" : true;
      return searchMatched && statusMatched;
    });
  }, [allTasks, search, showOnlyActive]);

  const inProgressCount = allTasks.filter((task) => task.status === "in-progress").length;

  return (
    <Screen scroll={false}>
      <PageHeader
        title="Good Focus Session"
        subtitle={`You have ${inProgressCount} tasks in progress.`}
        onRefresh={() => {
          void tasksQuery.refetch();
        }}
        refreshing={tasksQuery.isRefetching}
        actionLabel="New Task"
        onAction={() => navigation.navigate("TaskEditor")}
      />
      <GlassCard>
        <Text style={styles.searchLabel}>Search tasks</Text>
        <GlassInput value={search} onChangeText={setSearch} placeholder="Search by title or description" />

        <View style={styles.filterRow}>
          <Pressable
            onPress={() => setShowOnlyActive(true)}
            style={[styles.filterChip, showOnlyActive && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, showOnlyActive && styles.filterTextActive]}>Active</Text>
          </Pressable>
          <Pressable
            onPress={() => setShowOnlyActive(false)}
            style={[styles.filterChip, !showOnlyActive && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, !showOnlyActive && styles.filterTextActive]}>All</Text>
          </Pressable>
        </View>
      </GlassCard>

      <PrimaryButton label="Add quick task" onPress={createTask} loading={createMutation.isPending} />

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item._id ?? item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onEdit={(task) => navigation.navigate("TaskEditor", { taskId: task._id ?? task.id })}
            onViewDetail={(task) => navigation.navigate("TaskDetail", { taskId: task._id ?? task.id })}
            onToggleDone={toggleDone}
            onDelete={removeTask}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No tasks match this view.</Text>}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  searchLabel: {
    fontSize: typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  filterRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  filterChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
  },
  filterChipActive: {
    borderColor: "transparent",
    backgroundColor: colors.primary,
  },
  filterText: {
    color: colors.text,
    fontWeight: "600",
    fontSize: typography.caption,
  },
  filterTextActive: {
    color: colors.surface,
  },
  list: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
  empty: {
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.xl,
  },
});
