import { StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography } from "../../theme/tokens";

type StatCardProps = {
  label: string;
  value: string;
};

export const StatCard = ({ label, value }: StatCardProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    backgroundColor: "rgba(255,255,255,0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    padding: spacing.md,
  },
  label: {
    color: "rgba(255,255,255,0.85)",
    fontSize: typography.caption,
    fontWeight: "600",
    letterSpacing: 0.8,
  },
  value: {
    color: "#fff",
    fontSize: typography.title,
    fontWeight: "800",
    marginTop: 4,
  },
});
