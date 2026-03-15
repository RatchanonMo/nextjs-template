import { FlatList, StyleSheet, Text } from "react-native";

import { GlassCard } from "../../../components/common/GlassCard";
import { PageHeader } from "../../../components/common/PageHeader";
import { PrimaryButton } from "../../../components/common/PrimaryButton";
import { Screen } from "../../../components/common/Screen";
import { useTaskData } from "../../../hooks/useTaskData";
import { colors, spacing, typography } from "../../../theme/tokens";

export const TrashScreen = () => {
  const { deletedTasksQuery, restoreMutation } = useTaskData();

  return (
    <Screen scroll={false}>
      <PageHeader
        title="Trash"
        subtitle="Restore recently deleted tasks"
        onRefresh={() => {
          void deletedTasksQuery.refetch();
        }}
        refreshing={deletedTasksQuery.isRefetching}
      />

      <FlatList
        data={deletedTasksQuery.data ?? []}
        keyExtractor={(item) => item._id ?? item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <GlassCard>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDesc}>{item.description || "No description"}</Text>
            <PrimaryButton
              label="Restore"
              onPress={() => restoreMutation.mutate(item._id ?? item.id)}
              loading={restoreMutation.isPending}
            />
          </GlassCard>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Trash is empty.</Text>}
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
  itemTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "700",
  },
  itemDesc: {
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  empty: {
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.xl,
  },
});
