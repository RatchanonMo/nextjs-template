import { TextInput, TextInputProps, StyleSheet, View } from "react-native";

import { colors, radius, spacing, typography } from "../../theme/tokens";

type GlassInputProps = TextInputProps;

export const GlassInput = (props: GlassInputProps) => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        autoCapitalize="none"
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  input: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: typography.body,
    color: colors.text,
  },
});
