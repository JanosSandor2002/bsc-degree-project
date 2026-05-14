/*
 * Acxor Projektmenedzsment Rendszer
 * Szerző: Sándor János, 2026
 * Miskolci Egyetem — Szakdolgozat
 *
 * Megjegyzés: egyes kódrészletek generálása, hibakeresése
 * és javítása Claude (Anthropic) MI-alapú eszköz
 * segítségével történt, minden esetben kritikus szakmai
 * felülvizsgálattal párosulva.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  type TextInputProps,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { Colors } from '../constants/Colors';

// Button

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  small?: boolean;
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  loading,
  disabled,
  style,
  small,
}: ButtonProps) => {
  const bgColors = {
    primary: Colors.primaryLight,
    secondary: Colors.white,
    danger: '#fee2e2',
    ghost: 'transparent',
  };
  const textColors = {
    primary: Colors.white,
    secondary: Colors.primaryLight,
    danger: Colors.error,
    ghost: Colors.primaryLight,
  };
  const borderColors = {
    primary: 'transparent',
    secondary: Colors.border,
    danger: '#fecaca',
    ghost: 'transparent',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.btn,
        small && styles.btnSmall,
        {
          backgroundColor: bgColors[variant],
          borderColor: borderColors[variant],
          borderWidth: variant !== 'primary' ? 1 : 0,
        },
        (disabled || loading) && { opacity: 0.5 },
        style,
      ]}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator color={textColors[variant]} size='small' />
      ) : (
        <Text
          style={[
            styles.btnText,
            small && styles.btnTextSmall,
            { color: textColors[variant] },
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

// Input

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  onChangeText?: (text: string) => void;
}

export const Input = ({
  label,
  error,
  containerStyle,
  ...props
}: InputProps) => (
  <View style={[{ marginBottom: 12 }, containerStyle]}>
    {label && <Text style={styles.inputLabel}>{label}</Text>}
    <TextInput
      style={[
        styles.input,
        error && { borderColor: Colors.error },
        props.style as TextStyle,
      ]}
      placeholderTextColor={Colors.textLight}
      {...props}
    />
    {error && <Text style={styles.inputError}>{error}</Text>}
  </View>
);

// Badge

type BadgeVariant =
  | 'Open'
  | 'InProgress'
  | 'Done'
  | 'blue'
  | 'green'
  | 'amber'
  | 'red'
  | 'purple';

const badgeStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  Open: { bg: '#dbeafe', text: '#1d4ed8' },
  InProgress: { bg: '#fef3c7', text: '#b45309' },
  Done: { bg: '#dcfce7', text: '#15803d' },
  blue: { bg: '#dbeafe', text: '#1d4ed8' },
  green: { bg: '#dcfce7', text: '#15803d' },
  amber: { bg: '#fef3c7', text: '#b45309' },
  red: { bg: '#fee2e2', text: '#b91c1c' },
  purple: { bg: '#f3e8ff', text: '#7c3aed' },
};

export const Badge = ({
  label,
  variant,
}: {
  label: string;
  variant: BadgeVariant;
}) => {
  const s = badgeStyles[variant] ?? badgeStyles.blue;
  return (
    <View style={[styles.badge, { backgroundColor: s.bg }]}>
      <Text style={[styles.badgeText, { color: s.text }]}>{label}</Text>
    </View>
  );
};

// Card

export const Card = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) => <View style={[styles.card, style]}>{children}</View>;

// SectionHeader

export const SectionHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
  </View>
);

//HeroBanner

export const HeroBanner = ({
  badge,
  title,
  subtitle,
  right,
}: {
  badge?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) => (
  <View style={styles.hero}>
    {badge && (
      <View style={styles.heroBadge}>
        <Text style={styles.heroBadgeText}>{badge}</Text>
      </View>
    )}
    <View style={styles.heroRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.heroTitle}>{title}</Text>
        {subtitle && <Text style={styles.heroSubtitle}>{subtitle}</Text>}
      </View>
      {right}
    </View>
  </View>
);

//EmptyState

export const EmptyState = ({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle?: string;
}) => (
  <View style={styles.emptyState}>
    <View style={styles.emptyIcon}>
      <Text style={styles.emptyIconText}>{icon}</Text>
    </View>
    <Text style={styles.emptyTitle}>{title}</Text>
    {subtitle && <Text style={styles.emptySubtitle}>{subtitle}</Text>}
  </View>
);

// Toast

export const Toast = ({
  message,
  type = 'success',
}: {
  message: string;
  type?: 'success' | 'error';
}) => (
  <View
    style={[
      styles.toast,
      { backgroundColor: type === 'success' ? '#16a34a' : Colors.error },
    ]}
  >
    <Text style={styles.toastText}>{message}</Text>
  </View>
);

//Styles

const styles = StyleSheet.create({
  btn: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSmall: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10 },
  btnText: { fontSize: 14, fontWeight: '600' },
  btnTextSmall: { fontSize: 12 },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
    marginBottom: 5,
  },
  input: {
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: Colors.text,
  },
  inputError: { fontSize: 11, color: Colors.error, marginTop: 3 },
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
  },
  sectionHeader: { marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  sectionSubtitle: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  hero: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
  },
  heroBadge: {
    backgroundColor: 'rgba(59,130,246,0.35)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(147,197,253,0.5)',
  },
  heroBadgeText: { color: '#bfdbfe', fontSize: 11, fontWeight: '500' },
  heroRow: { flexDirection: 'row', alignItems: 'center' },
  heroTitle: { color: Colors.white, fontSize: 22, fontWeight: '700' },
  heroSubtitle: { color: '#93c5fd', fontSize: 13, marginTop: 3 },
  emptyState: { alignItems: 'center', paddingVertical: 40, gap: 10 },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconText: { fontSize: 22 },
  emptyTitle: { fontSize: 14, color: Colors.textMuted, fontWeight: '500' },
  emptySubtitle: { fontSize: 12, color: Colors.textLight, textAlign: 'center' },
  toast: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    zIndex: 999,
  },
  toastText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
  },
});
