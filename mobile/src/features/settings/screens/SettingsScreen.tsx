import { useState } from "react";
import { Alert, StyleSheet, Text } from "react-native";

import { authAPI } from "../../../api/authAPI";
import { GlassCard } from "../../../components/common/GlassCard";
import { GlassInput } from "../../../components/common/GlassInput";
import { PageHeader } from "../../../components/common/PageHeader";
import { PrimaryButton } from "../../../components/common/PrimaryButton";
import { Screen } from "../../../components/common/Screen";
import { useAuthActions } from "../../../hooks/useAuthActions";
import { useAuthStore } from "../../../store/authStore";
import { colors, spacing, typography } from "../../../theme/tokens";

export const SettingsScreen = () => {
  const { logoutMutation } = useAuthActions();
  const user = useAuthStore((state) => state.user);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [updating, setUpdating] = useState(false);

  const updatePassword = async () => {
    if (!currentPassword || !newPassword) return;

    try {
      setUpdating(true);
      const message = await authAPI.changePassword({ currentPassword, newPassword });
      Alert.alert("Success", message);
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      Alert.alert("Password change failed", error instanceof Error ? error.message : "Please retry");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Screen>
      <PageHeader
        title="Settings"
        subtitle={user?.email ?? "No account"}
        onRefresh={() => {
          setCurrentPassword("");
          setNewPassword("");
        }}
      />

      <GlassCard>
        <Text style={styles.cardTitle}>Change password</Text>
        <Text style={styles.label}>Current password</Text>
        <GlassInput value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry />
        <Text style={styles.label}>New password</Text>
        <GlassInput value={newPassword} onChangeText={setNewPassword} secureTextEntry />
        <PrimaryButton label="Update password" onPress={updatePassword} loading={updating} />
      </GlassCard>

      <PrimaryButton label="Sign out" onPress={() => logoutMutation.mutate()} loading={logoutMutation.isPending} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  cardTitle: {
    color: colors.text,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  label: {
    color: colors.textMuted,
    marginTop: spacing.sm,
    marginBottom: 6,
    fontSize: typography.caption,
  },
});
