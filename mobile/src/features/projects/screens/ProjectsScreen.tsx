import { useState } from "react";
import { FlatList, StyleSheet, Text } from "react-native";

import { GlassCard } from "../../../components/common/GlassCard";
import { GlassInput } from "../../../components/common/GlassInput";
import { PageHeader } from "../../../components/common/PageHeader";
import { PrimaryButton } from "../../../components/common/PrimaryButton";
import { Screen } from "../../../components/common/Screen";
import { useWorkspaceData } from "../../../hooks/useWorkspaceData";
import { colors, spacing, typography } from "../../../theme/tokens";

export const ProjectsScreen = () => {
  const { workspaceQuery, createProjectMutation } = useWorkspaceData();
  const [name, setName] = useState("");

  const createProject = async () => {
    if (!name.trim()) return;
    await createProjectMutation.mutateAsync({
      name: name.trim(),
      description: "Created on mobile",
      category: "DEVELOPMENT",
      icon: "📱",
      accentColor: "#3b82f6",
    });
    setName("");
  };

  return (
    <Screen scroll={false}>
      <PageHeader
        title="Projects"
        subtitle="Manage workspace projects"
        onRefresh={() => {
          void workspaceQuery.refetch();
        }}
        refreshing={workspaceQuery.isRefetching}
      />

      <GlassCard>
        <Text style={styles.inputLabel}>Create project</Text>
        <GlassInput value={name} onChangeText={setName} placeholder="Project name" />
        <PrimaryButton label="Add project" onPress={createProject} loading={createProjectMutation.isPending} />
      </GlassCard>

      <FlatList
        data={workspaceQuery.data?.projects ?? []}
        keyExtractor={(item) => item._id ?? item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <GlassCard>
            <Text style={styles.projectName}>{item.name}</Text>
            <Text style={styles.projectDesc}>{item.description}</Text>
            <Text style={styles.projectMeta}>{item.category}</Text>
          </GlassCard>
        )}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  inputLabel: {
    fontSize: typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  list: {
    gap: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  projectName: {
    color: colors.text,
    fontWeight: "700",
    fontSize: typography.body,
  },
  projectDesc: {
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  projectMeta: {
    color: colors.primary,
    marginTop: spacing.sm,
    fontWeight: "600",
  },
});
