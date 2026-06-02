import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import { FontSize, BorderRadius, Spacing, Shadows } from '../utils/constants';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

interface NotificationContextType {
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  hideNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

const NotificationItem = ({
  notification,
  onDismiss,
}: {
  notification: Notification;
  onDismiss: () => void;
}) => {
  const { colors } = useTheme();
  const [slideAnim] = useState(() => new Animated.Value(-100));
  const [opacityAnim] = useState(() => new Animated.Value(0));

  const dismissWithAnimation = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onDismiss());
  }, [slideAnim, opacityAnim, onDismiss]);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(dismissWithAnimation, notification.duration || 3000);
    return () => clearTimeout(timer);
  }, [dismissWithAnimation, notification.duration, slideAnim, opacityAnim]);

  const getTypeStyles = () => {
    switch (notification.type) {
      case 'success':
        return {
          backgroundColor: colors.success.light,
          borderColor: colors.success.main,
          iconColor: colors.success.main,
          icon: 'checkmark-circle' as const,
        };
      case 'error':
        return {
          backgroundColor: colors.error.light,
          borderColor: colors.error.main,
          iconColor: colors.error.main,
          icon: 'close-circle' as const,
        };
      case 'warning':
        return {
          backgroundColor: colors.warning.light,
          borderColor: colors.warning.main,
          iconColor: colors.warning.main,
          icon: 'warning' as const,
        };
      case 'info':
      default:
        return {
          backgroundColor: colors.primary[50],
          borderColor: colors.primary[500],
          iconColor: colors.primary[500],
          icon: 'information-circle' as const,
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <Animated.View
      style={[
        styles.notification,
        {
          backgroundColor: typeStyles.backgroundColor,
          borderLeftColor: typeStyles.borderColor,
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
        Shadows.md,
      ]}
    >
      <View style={styles.notificationContent}>
        <Ionicons name={typeStyles.icon} size={24} color={typeStyles.iconColor} />
        <View style={styles.notificationText}>
          <Text style={[styles.notificationTitle, { color: colors.text.primary }]}>
            {notification.title}
          </Text>
          {notification.message && (
            <Text style={[styles.notificationMessage, { color: colors.text.secondary }]}>
              {notification.message}
            </Text>
          )}
        </View>
        <TouchableOpacity onPress={dismissWithAnimation} style={styles.closeBtn}>
          <Ionicons name="close" size={20} color={colors.text.tertiary} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const insets = useSafeAreaInsets();

  const showNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { ...notification, id }]);
  }, []);

  const hideNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      <View style={[styles.container, { top: insets.top + Spacing.md }]} pointerEvents="box-none">
        {notifications.map(notification => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onDismiss={() => hideNotification(notification.id)}
          />
        ))}
      </View>
    </NotificationContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: Spacing.md,
    right: Spacing.md,
    zIndex: 9999,
  },
  notification: {
    borderRadius: BorderRadius.md,
    borderLeftWidth: 4,
    marginBottom: Spacing.sm,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  notificationMessage: {
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  closeBtn: {
    padding: Spacing.xs,
  },
});

export default NotificationContext;
