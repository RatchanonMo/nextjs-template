import { useState } from "react";
import { Alert, StyleSheet, Text } from "react-native";

import { GlassCard } from "../../../components/common/GlassCard";
import { GlassInput } from "../../../components/common/GlassInput";
import { PageHeader } from "../../../components/common/PageHeader";
import { PrimaryButton } from "../../../components/common/PrimaryButton";
import { Screen } from "../../../components/common/Screen";
import { useAuthActions } from "../../../hooks/useAuthActions";
import { colors, spacing, typography } from "../../../theme/tokens";

type LoginScreenProps = {
  onGoSignup: () => void;
};

export const LoginScreen = ({ onGoSignup }: LoginScreenProps) => {
  const { loginMutation } = useAuthActions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    try {
      await loginMutation.mutateAsync({ email: email.trim(), password });
    } catch (error) {
      Alert.alert("Login failed", error instanceof Error ? error.message : "Please try again");
    }
  };

  return (
    <Screen>
      <PageHeader
        title="TaskFlow Mobile"
        subtitle="Plan, prioritize, and ship work from anywhere."
        onRefresh={() => {
          setEmail("");
          setPassword("");
        }}
      />

      <GlassCard>
        <Text style={styles.label}>Email</Text>
        <GlassInput value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Text style={styles.label}>Password</Text>
        <GlassInput value={password} onChangeText={setPassword} secureTextEntry />
        <PrimaryButton label="Sign in" onPress={submit} loading={loginMutation.isPending} />
      </GlassCard>

      <PrimaryButton label="Create account" onPress={onGoSignup} />
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
});
