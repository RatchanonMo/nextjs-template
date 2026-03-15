import { Pressable, StyleSheet, Text, View } from "react-native";

import { Task } from "../../types/task";
import { formatDateLabel } from "../../utils/date";
import { GlassCard } from "../common/GlassCard";
import { colors, spacing, typography } from "../../theme/tokens";

type TaskItemProps = {
  task: Task;
  onToggleDone: (task: Task) => void;
  onDelete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onViewDetail?: (task: Task) => void;
};

const statusLabel: Record<Task["status"], string> = {
  todo: "To do",
  "in-progress": "In progress",
  done: "Done",
};

export const TaskItem = ({ task, onToggleDone, onDelete, onEdit, onViewDetail }: TaskItemProps) => {
  return (
    <GlassCard>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.pill}>{statusLabel[task.status]}</Text>
      </View>
      <Text style={styles.description}>{task.description || "No description"}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>{task.category}</Text>
        <Text style={styles.metaText}>{formatDateLabel(task.dueDate)}</Text>
      </View>
      <View style={styles.actionRow}>
        {onViewDetail && (
          <Pressable style={styles.secondaryAction} onPress={() => onViewDetail(task)}>
            <Text style={styles.secondaryLabel}>Details</Text>
          </Pressable>
        )}
        <Pressable style={styles.secondaryAction} onPress={() => onEdit(task)}>
          <Text style={styles.secondaryLabel}>Edit</Text>
        </Pressable>
        <Pressable style={styles.secondaryAction} onPress={() => onToggleDone(task)}>
          <Text style={styles.secondaryLabel}>{task.status === "done" ? "Mark Active" : "Mark Done"}</Text>
        </Pressable>
        <Pressable style={styles.dangerAction} onPress={() => onDelete(task)}>
          <Text style={styles.dangerLabel}>Delete</Text>
        </Pressable>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  title: {
    flex: 1,
    fontSize: typography.body + 1,
    fontWeight: "700",
    color: colors.text,
    marginRight: spacing.sm,
  },
  pill: {
    fontSize: typography.caption,
    color: colors.primary,
    backgroundColor: "rgba(17,24,39,0.1)",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 999,
  },
  description: {
    fontSize: typography.body,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  metaText: {
    fontSize: typography.caption,
    color: colors.textMuted,
  },
  actionRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  secondaryAction: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: spacing.xs,
    alignItems: "center",
  },
  secondaryLabel: {
    color: colors.text,
    fontWeight: "600",
  },
  dangerAction: {
    flex: 1,
    backgroundColor: "rgba(239,68,68,0.12)",
    borderRadius: 10,
    paddingVertical: spacing.xs,
    alignItems: "center",
  },
  dangerLabel: {
    color: colors.danger,
    fontWeight: "700",
  },
});
