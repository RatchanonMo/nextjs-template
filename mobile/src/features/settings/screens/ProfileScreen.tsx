import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { GlassCard } from "../../../components/common/GlassCard";
import { PageHeader } from "../../../components/common/PageHeader";
import { PrimaryButton } from "../../../components/common/PrimaryButton";
import { Screen } from "../../../components/common/Screen";
import { useAuthStore } from "../../../store/authStore";
import { colors, spacing, typography } from "../../../theme/tokens";

const PALETTE = [
  "#6366f1",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#0ea5e9",
  "#14b8a6",
];

export const ProfileScreen = () => {
  const user = useAuthStore((state) => state.user);
  const name = user?.name ?? user?.email?.split("@")[0] ?? "User";
  const [borderColor, setBorderColor] = useState(PALETTE[0]);

  const handlePress = (buttonName: string) => {
    const newColor = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    setBorderColor(newColor);
    Alert.alert(buttonName);
  };

  return (
    <Screen>
      <PageHeader title="Profile" subtitle="Your account info" />

      <View style={styles.center}>
        <Pressable
          style={[styles.avatar, { borderColor }]}
          onPress={() => handlePress(name)}
        >
          <Text style={styles.avatarText}>{name[0].toUpperCase()}</Text>
        </Pressable>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <GlassCard>
        <Text style={styles.cardTitle}>Account Details</Text>

        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{user?.name ?? "—"}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email ?? "—"}</Text>

        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>{user?.role ?? "—"}</Text>

        <Text style={styles.label}>Account Status</Text>
        <Text style={styles.value}>{user?.accountStatus ?? "—"}</Text>
      </GlassCard>

      <PrimaryButton label="Edit Profile" onPress={() => handlePress("Edit Profile")} />
      <PrimaryButton label="Share Profile" onPress={() => handlePress("Share Profile")} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl,
    minHeight: 220,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
  },
  avatarText: {
    fontSize: 64,
    fontWeight: "700",
    color: colors.text,
  },
  name: {
    marginTop: spacing.md,
    fontSize: typography.subtitle,
    fontWeight: "700",
    color: colors.text,
  },
  email: {
    fontSize: typography.body,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  cardTitle: {
    fontWeight: "700",
    fontSize: typography.subtitle,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  label: {
    color: colors.textMuted,
    fontSize: typography.caption,
    marginTop: spacing.sm,
  },
  value: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "500",
    marginTop: 2,
  },
});
