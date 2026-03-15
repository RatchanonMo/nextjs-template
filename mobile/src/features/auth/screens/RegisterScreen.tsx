import { useMemo, useState } from "react";
import { Alert, StyleSheet, Switch, Text, View } from "react-native";

import { GlassCard } from "../../../components/common/GlassCard";
import { GlassInput } from "../../../components/common/GlassInput";
import { PageHeader } from "../../../components/common/PageHeader";
import { PrimaryButton } from "../../../components/common/PrimaryButton";
import { Screen } from "../../../components/common/Screen";
import { useAuthActions } from "../../../hooks/useAuthActions";
import { colors, spacing, typography } from "../../../theme/tokens";

type RegisterScreenProps = {
  onGoLogin: () => void;
};

export const RegisterScreen = ({ onGoLogin }: RegisterScreenProps) => {
  const { registerMutation } = useAuthActions();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);

  const canSubmit = useMemo(() => {
    return Boolean(name.trim() && email.trim() && password.length >= 6 && confirm === password && agreed);
  }, [name, email, password, confirm, agreed]);

  const submit = async () => {
    try {
      await registerMutation.mutateAsync({ name: name.trim(), email: email.trim(), password });
    } catch (error) {
      Alert.alert("Signup failed", error instanceof Error ? error.message : "Please try again");
    }
  };

  return (
    <Screen>
      <PageHeader
        title="Create account"
        subtitle="Your mobile workspace syncs with the web app."
        onRefresh={() => {
          setName("");
          setEmail("");
          setPassword("");
          setConfirm("");
          setAgreed(false);
        }}
      />

      <GlassCard>
        <Text style={styles.label}>Name</Text>
        <GlassInput value={name} onChangeText={setName} />

        <Text style={styles.label}>Email</Text>
        <GlassInput value={email} onChangeText={setEmail} keyboardType="email-address" />

        <Text style={styles.label}>Password</Text>
        <GlassInput value={password} onChangeText={setPassword} secureTextEntry />

        <Text style={styles.label}>Confirm Password</Text>
        <GlassInput value={confirm} onChangeText={setConfirm} secureTextEntry />

        <View style={styles.switchRow}>
          <Text style={styles.switchText}>I agree to the terms</Text>
          <Switch value={agreed} onValueChange={setAgreed} />
        </View>

        <PrimaryButton
          label="Create Account"
          onPress={submit}
          loading={registerMutation.isPending}
          disabled={!canSubmit}
        />
      </GlassCard>

      <PrimaryButton label="Back to sign in" onPress={onGoLogin} />
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
  switchRow: {
    marginTop: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchText: {
    color: colors.text,
    fontSize: typography.body,
  },
});
