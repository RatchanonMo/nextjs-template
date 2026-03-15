import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { StatCard } from "../../../components/common/CurrencyCard";
import { NetworkBanner } from "../../../components/common/NetworkBanner";
import { radius, spacing, typography } from "../../../theme/tokens";

const fmt = (n: number): string => String(Math.max(0, Math.floor(n)));

const fmtTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
};

export const FocusPlannerScreen = () => {
  const [hours, setHours] = useState("");

  const totalMin = parseFloat(hours) * 60;
  const valid = !isNaN(totalMin) && totalMin > 0;

  // Each pomodoro = 25 min focus + 5 min short break
  // Every 4 pomodoros → 15 min long break instead of 5 min short break
  const pomodoros = valid ? Math.floor(totalMin / 30) : 0; // 25+5 cycle
  const longBreaks = valid ? Math.floor(pomodoros / 4) : 0;
  const shortBreaks = valid ? pomodoros - longBreaks : 0;
  const focusMin = pomodoros * 25;
  const breakMin = shortBreaks * 5 + longBreaks * 15;
  const tasks = Math.floor(pomodoros / 2); // ~2 pomodoros per task
  const weeklyFocus = focusMin * 5;

  return (
    <LinearGradient colors={["#0f172a", "#1e3a5f", "#0369a1"]} style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.flex}
        >
          <ScrollView contentContainerStyle={styles.content}>
            <NetworkBanner />

            <Text style={styles.title}>Focus Planner</Text>
            <Text style={styles.subtitle}>Plan your deep work session</Text>

            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>Available hours today</Text>
              <TextInput
                style={styles.input}
                value={hours}
                onChangeText={setHours}
                placeholder="e.g. 4"
                placeholderTextColor="rgba(255,255,255,0.4)"
                keyboardType="decimal-pad"
              />
              <Text style={styles.inputHint}>
                1 Pomodoro = 25 min focus + 5 min break
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Your session breakdown</Text>

            <StatCard
              label="🍅  Pomodoros"
              value={valid ? fmt(pomodoros) : "—"}
            />
            <StatCard
              label="📋  Tasks Feasible"
              value={valid ? fmt(tasks) : "—"}
            />
            <StatCard
              label="🎯  Focus Time"
              value={valid ? fmtTime(focusMin) : "—"}
            />
            <StatCard
              label="☕  Short Breaks"
              value={valid ? `${fmt(shortBreaks)} × 5 min` : "—"}
            />
            <StatCard
              label="🌿  Long Breaks"
              value={valid ? `${fmt(longBreaks)} × 15 min` : "—"}
            />
            <StatCard
              label="📅  Weekly Focus (×5 days)"
              value={valid ? fmtTime(weeklyFocus) : "—"}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  title: {
    color: "#fff",
    fontSize: typography.title,
    fontWeight: "800",
  },
  subtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: typography.body,
    marginTop: -spacing.xs,
  },
  inputCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    backgroundColor: "rgba(255,255,255,0.12)",
    padding: spacing.md,
    gap: spacing.xs,
  },
  inputLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: typography.caption,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  input: {
    color: "#fff",
    fontSize: typography.title,
    fontWeight: "700",
    paddingVertical: spacing.xs,
  },
  inputHint: {
    color: "rgba(255,255,255,0.45)",
    fontSize: typography.caption,
  },
  sectionTitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: typography.subtitle,
    fontWeight: "700",
  },
});
