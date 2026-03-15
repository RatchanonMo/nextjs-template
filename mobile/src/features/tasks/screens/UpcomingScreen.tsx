import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { FlatList, StyleSheet, Text } from "react-native";

import { PageHeader } from "../../../components/common/PageHeader";
import { Screen } from "../../../components/common/Screen";
import { TaskItem } from "../../../components/tasks/TaskItem";
import { useTaskData } from "../../../hooks/useTaskData";
import { Task } from "../../../types/task";
import { colors, spacing } from "../../../theme/tokens";

export const UpcomingScreen = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { upcomingTasks, tasksQuery, updateMutation, deleteMutation } = useTaskData();

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

  return (
    <Screen scroll={false}>
      <PageHeader
        title="Upcoming"
        subtitle="Next 7 days"
        onRefresh={() => {
          void tasksQuery.refetch();
        }}
        refreshing={tasksQuery.isRefetching}
        actionLabel="New Task"
        onAction={() => navigation.navigate("TaskEditor")}
      />

      <FlatList
        data={upcomingTasks}
        keyExtractor={(item) => item._id ?? item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onEdit={(task) => navigation.navigate("TaskEditor", { taskId: task._id ?? task.id })}
            onToggleDone={toggleDone}
            onDelete={removeTask}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No upcoming tasks.</Text>}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
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
