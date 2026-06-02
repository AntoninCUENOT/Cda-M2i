import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import Colors from '../utils/colors';
import { Spacing, FontSize, BorderRadius } from '../utils/constants';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? Colors.primary[500] : Colors.white} size="small" />
      ) : (
        <Text style={[styles.text, styles[`${variant}Text`], isDisabled && styles.disabledText, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    minHeight: 48,
  },
  primary: { backgroundColor: Colors.primary[500] },
  secondary: { backgroundColor: Colors.secondary[500] },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: Colors.primary[500] },
  ghost: { backgroundColor: 'transparent' },
  fullWidth: { width: '100%' },
  disabled: { backgroundColor: Colors.gray[300] },
  text: { fontWeight: '600', fontSize: FontSize.md, textAlign: 'center' },
  primaryText: { color: Colors.white },
  secondaryText: { color: Colors.white },
  outlineText: { color: Colors.primary[500] },
  ghostText: { color: Colors.primary[500] },
  disabledText: { color: Colors.gray[500] },
});

export default Button;
