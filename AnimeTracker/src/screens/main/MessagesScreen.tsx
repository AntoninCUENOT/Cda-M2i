import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store';
import { loadConversations, deleteConversation, selectConversations } from '../../store/slices/messagingSlice';
import { useTheme } from '../../contexts/ThemeContext';
import { Conversation } from '../../types';
import { Spacing, FontSize, BorderRadius, Shadows } from '../../utils/constants';

type MessagesNav = NativeStackNavigationProp<MainStackParamList>;

const AVATAR_COLORS = [
  '#6366F1', '#8B5CF6', '#22C55E', '#F59E0B',
  '#EF4444', '#9333EA', '#EC4899', '#14B8A6',
];

export default function MessagesScreen() {
  const navigation = useNavigation<MessagesNav>();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const conversations = useAppSelector(selectConversations);

  useEffect(() => {
    dispatch(loadConversations());
  }, [dispatch]);

  const handleDelete = (item: Conversation) => {
    Alert.alert(
      'Supprimer la conversation',
      `Supprimer la conversation avec ${item.participantPseudo} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => dispatch(deleteConversation(item.id)),
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Hier';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('fr-FR', { weekday: 'short' });
    }
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  };

  const renderConversation = ({ item }: { item: Conversation }) => {
    const avatarIndex = typeof item.participantAvatar === 'number' ? item.participantAvatar : 0;

    return (
      <TouchableOpacity
        style={[styles.conversationCard, { backgroundColor: colors.card }, Shadows.sm]}
        onPress={() => navigation.navigate('Chat', {
          recipientId: item.participantId,
          recipientPseudo: item.participantPseudo,
          recipientAvatar: item.participantAvatar,
        })}
        onLongPress={() => handleDelete(item)}
      >
        <View style={[styles.avatar, { backgroundColor: AVATAR_COLORS[avatarIndex % 8] }]}>
          <Text style={styles.avatarText}>
            {item.participantPseudo.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={[styles.participantName, { color: colors.text.primary }]}>
              {item.participantPseudo}
            </Text>
            <Text style={[styles.timestamp, { color: colors.text.tertiary }]}>
              {formatDate(item.lastMessageDate)}
            </Text>
          </View>
          <View style={styles.messagePreviewRow}>
            <Text
              style={[
                styles.messagePreview,
                { color: colors.text.secondary },
                item.unreadCount > 0 && { fontWeight: '600', color: colors.text.primary },
              ]}
              numberOfLines={1}
            >
              {item.lastMessage}
            </Text>
            {item.unreadCount > 0 && (
              <View style={[styles.unreadBadge, { backgroundColor: colors.primary[500] }]}>
                <Text style={styles.unreadText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
      <View style={[styles.statusBarBg, { height: insets.top, backgroundColor: colors.background.primary }]} />

      <LinearGradient
        colors={[colors.primary[700], colors.primary[500], colors.secondary[400]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity
          style={styles.newMessageBtn}
          onPress={() => navigation.navigate('NewMessage')}
        >
          <Ionicons name="create-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </LinearGradient>

      {conversations.length > 0 ? (
        <FlatList
          data={conversations.sort((a, b) =>
            new Date(b.lastMessageDate).getTime() - new Date(a.lastMessageDate).getTime()
          )}
          renderItem={renderConversation}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubbles-outline" size={64} color={colors.gray[300]} />
          <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
            Aucune conversation
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.text.tertiary }]}>
            {"Commencez à discuter avec d'autres utilisateurs"}
          </Text>
          <TouchableOpacity
            style={[styles.startChatBtn, { backgroundColor: colors.primary[500] }]}
            onPress={() => navigation.navigate('NewMessage')}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.startChatText}>Nouvelle conversation</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  statusBarBg: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    fontSize: FontSize.largeTitle,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  newMessageBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: Spacing.lg,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  conversationContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  participantName: {
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: FontSize.xs,
  },
  messagePreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messagePreview: {
    fontSize: FontSize.sm,
    flex: 1,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: Spacing.sm,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxxl,
  },
  emptyText: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    marginTop: Spacing.lg,
  },
  emptySubtext: {
    fontSize: FontSize.sm,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  startChatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.xl,
  },
  startChatText: {
    color: '#FFFFFF',
    fontSize: FontSize.md,
    fontWeight: '600',
  },
});
