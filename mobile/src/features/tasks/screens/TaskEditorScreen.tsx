import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { GlassCard } from "../../../components/common/GlassCard";
import { GlassInput } from "../../../components/common/GlassInput";
import { PageHeader } from "../../../components/common/PageHeader";
import { PrimaryButton } from "../../../components/common/PrimaryButton";
import { Screen } from "../../../components/common/Screen";
import { useTaskData } from "../../../hooks/useTaskData";
import { useWorkspaceData } from "../../../hooks/useWorkspaceData";
import { AppStackParamList } from "../../../navigation/types";
import { Task, TaskCategory, TaskFormData, TaskPriority, TaskStatus } from "../../../types/task";
import { colors, radius, spacing, typography } from "../../../theme/tokens";

const statusOptions: TaskStatus[] = ["todo", "in-progress", "done"];
const priorityOptions: TaskPriority[] = ["low", "medium", "high"];
const categoryOptions: TaskCategory[] = [
  "DEVELOPMENT",
  "DESIGN",
  "PRODUCT",
  "OPERATIONS",
  "MARKETING",
  "PERSONAL",
];

const emptyForm: TaskFormData = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  category: "DEVELOPMENT",
  dueDate: "",
  startTime: "",
  endTime: "",
  tags: [],
  projectId: undefined,
};

type TaskEditorRoute = RouteProp<AppStackParamList, "TaskEditor">;
type TaskEditorNav = NativeStackNavigationProp<AppStackParamList, "TaskEditor">;

const normalizeTaskToForm = (task?: Task | null): TaskFormData => {
  if (!task) return emptyForm;

  return {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    category: task.category,
    dueDate: task.dueDate ?? "",
    startTime: task.startTime ?? "",
    endTime: task.endTime ?? "",
    tags: task.tags ?? [],
    assignees: task.assignees,
    projectId: task.projectId,
  };
};

const ChipGroup = <T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (next: T) => void;
}) => {
  return (
    <View style={styles.chipWrap}>
      {options.map((option) => {
        const selected = option === value;
        return (
          <Pressable
            key={option}
            style={[styles.chip, selected && styles.chipActive]}
            onPress={() => onChange(option)}
          >
            <Text style={[styles.chipLabel, selected && styles.chipLabelActive]}>{option}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export const TaskEditorScreen = () => {
  const navigation = useNavigation<TaskEditorNav>();
  const route = useRoute<TaskEditorRoute>();
  const { tasksQuery, createMutation, updateMutation } = useTaskData();
  const { workspaceQuery } = useWorkspaceData();
  const editingTask = useMemo(
    () => (tasksQuery.data ?? []).find((item) => (item._id ?? item.id) === route.params?.taskId) ?? null,
    [route.params?.taskId, tasksQuery.data]
  );

  const [form, setForm] = useState<TaskFormData>(normalizeTaskToForm(editingTask));
  const [tagsText, setTagsText] = useState((editingTask?.tags ?? []).join(", "));

  useEffect(() => {
    setForm(normalizeTaskToForm(editingTask));
    setTagsText((editingTask?.tags ?? []).join(", "));
  }, [editingTask]);

  const isEditing = Boolean(editingTask);

  const resetForm = () => {
    setForm(normalizeTaskToForm(editingTask));
    setTagsText((editingTask?.tags ?? []).join(", "));
  };

  const saveTask = async () => {
    if (!form.title.trim()) {
      Alert.alert("Missing title", "Please add a task title.");
      return;
    }

    const payload: TaskFormData = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      dueDate: form.dueDate?.trim() || undefined,
      startTime: form.startTime?.trim() || undefined,
      endTime: form.endTime?.trim() || undefined,
      projectId: form.projectId || undefined,
      tags: tagsText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      if (isEditing && editingTask) {
        await updateMutation.mutateAsync({ id: editingTask._id ?? editingTask.id, patch: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert("Unable to save task", error instanceof Error ? error.message : "Please retry");
    }
  };

  return (
    <Screen>
      <PageHeader
        title={isEditing ? "Edit Task" : "New Task"}
        subtitle={isEditing ? "Update task details and schedule." : "Create a task with full details."}
        onRefresh={resetForm}
        actionLabel="Close"
        onAction={() => navigation.goBack()}
      />

      <GlassCard>
        <Text style={styles.label}>Title</Text>
        <GlassInput value={form.title} onChangeText={(title) => setForm((prev) => ({ ...prev, title }))} />

        <Text style={styles.label}>Description</Text>
        <GlassInput
          value={form.description}
          onChangeText={(description) => setForm((prev) => ({ ...prev, description }))}
          multiline
          numberOfLines={4}
          style={styles.multilineInput}
        />

        <Text style={styles.label}>Status</Text>
        <ChipGroup options={statusOptions} value={form.status} onChange={(status) => setForm((prev) => ({ ...prev, status }))} />

        <Text style={styles.label}>Priority</Text>
        <ChipGroup
          options={priorityOptions}
          value={form.priority}
          onChange={(priority) => setForm((prev) => ({ ...prev, priority }))}
        />

        <Text style={styles.label}>Category</Text>
        <ChipGroup
          options={categoryOptions}
          value={form.category}
          onChange={(category) => setForm((prev) => ({ ...prev, category }))}
        />

        <Text style={styles.label}>Due date</Text>
        <GlassInput
          value={form.dueDate ?? ""}
          onChangeText={(dueDate) => setForm((prev) => ({ ...prev, dueDate }))}
          placeholder="YYYY-MM-DD"
        />

        <View style={styles.row}>
          <View style={styles.rowItem}>
            <Text style={styles.label}>Start</Text>
            <GlassInput
              value={form.startTime ?? ""}
              onChangeText={(startTime) => setForm((prev) => ({ ...prev, startTime }))}
              placeholder="09:00"
            />
          </View>
          <View style={styles.rowItem}>
            <Text style={styles.label}>End</Text>
            <GlassInput
              value={form.endTime ?? ""}
              onChangeText={(endTime) => setForm((prev) => ({ ...prev, endTime }))}
              placeholder="10:30"
            />
          </View>
        </View>

        <Text style={styles.label}>Tags</Text>
        <GlassInput value={tagsText} onChangeText={setTagsText} placeholder="design, launch, urgent" />

        <Text style={styles.label}>Project</Text>
        <View style={styles.chipWrap}>
          <Pressable
            style={[styles.chip, !form.projectId && styles.chipActive]}
            onPress={() => setForm((prev) => ({ ...prev, projectId: undefined }))}
          >
            <Text style={[styles.chipLabel, !form.projectId && styles.chipLabelActive]}>None</Text>
          </Pressable>
          {(workspaceQuery.data?.projects ?? []).map((project) => {
            const projectId = project._id ?? project.id;
            const selected = form.projectId === projectId;
            return (
              <Pressable
                key={projectId}
                style={[styles.chip, selected && styles.chipActive]}
                onPress={() => setForm((prev) => ({ ...prev, projectId }))}
              >
                <Text style={[styles.chipLabel, selected && styles.chipLabelActive]}>{project.name}</Text>
              </Pressable>
            );
          })}
        </View>

        <PrimaryButton
          label={isEditing ? "Save Changes" : "Create Task"}
          onPress={saveTask}
          loading={createMutation.isPending || updateMutation.isPending}
        />
      </GlassCard>
    </Screen>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: typography.caption,
    color: colors.textMuted,
    marginBottom: 6,
    marginTop: spacing.sm,
  },
  multilineInput: {
    minHeight: 96,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  rowItem: {
    flex: 1,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipLabel: {
    color: colors.text,
    fontSize: typography.caption + 1,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  chipLabelActive: {
    color: colors.surface,
  },
});