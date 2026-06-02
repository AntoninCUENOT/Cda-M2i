import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  loadMessages,
  sendMessage,
  markAsRead,
  selectCurrentMessages,
  selectCurrentConversationId,
  clearCurrentMessages,
} from '../../store/slices/messagingSlice';
import { useTheme } from '../../contexts/ThemeContext';
import { Message } from '../../types';
import { Spacing, FontSize, BorderRadius } from '../../utils/constants';

type ChatRoute = RouteProp<MainStackParamList, 'Chat'>;

const AVATAR_COLORS = [
  '#6366F1', '#8B5CF6', '#22C55E', '#F59E0B',
  '#EF4444', '#9333EA', '#EC4899', '#14B8A6',
];

export default function ChatScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const route = useRoute<ChatRoute>();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { recipientId, recipientPseudo, recipientAvatar } = route.params;

  const messages = useAppSelector(selectCurrentMessages);
  const conversationId = useAppSelector(selectCurrentConversationId);
  const currentUser = useAppSelector(state => state.auth.user);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const avatarIndex = typeof recipientAvatar === 'number' ? recipientAvatar : 0;

  useEffect(() => {
    dispatch(loadMessages({ recipientId })).then((action) => {
      if (loadMessages.fulfilled.match(action)) {
        dispatch(markAsRead(action.payload.conversationId));
      }
    });

    return () => {
      dispatch(clearCurrentMessages());
    };
  }, [dispatch, recipientId]);

  const handleSend = () => {
    if (!inputText.trim() || !conversationId) return;
    dispatch(sendMessage({ conversationId, content: inputText.trim() }));
    setInputText('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Hier';
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isMe = item.senderId === currentUser?.id;
    const showDateHeader = index === 0 ||
      new Date(messages[index - 1].createdAt).toDateString() !== new Date(item.createdAt).toDateString();

    return (
      <View>
        {showDateHeader && (
          <View style={styles.dateHeader}>
            <Text style={[styles.dateHeaderText, { color: colors.text.tertiary }]}>
              {formatDateHeader(item.createdAt)}
            </Text>
          </View>
        )}
        <View style={[styles.messageBubbleContainer, isMe && styles.myMessageContainer]}>
          <View
            style={[
              styles.messageBubble,
              isMe
                ? [styles.myMessage, { backgroundColor: colors.primary[500] }]
                : [styles.theirMessage, { backgroundColor: colors.card }],
            ]}
          >
            <Text style={[styles.messageText, { color: isMe ? '#FFFFFF' : colors.text.primary }]}>
              {item.content}
            </Text>
            <Text style={[styles.messageTime, { color: isMe ? 'rgba(255,255,255,0.7)' : colors.text.tertiary }]}>
              {formatTime(item.createdAt)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background.secondary }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerCenter}
          onPress={() => navigation.navigate('UserProfile', {
            userId: recipientId,
            userPseudo: recipientPseudo,
            userAvatar: recipientAvatar,
          })}
        >
          <View style={[styles.headerAvatar, { backgroundColor: AVATAR_COLORS[avatarIndex % 8] }]}>
            <Text style={styles.headerAvatarText}>{recipientPseudo.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={[styles.headerName, { color: colors.text.primary }]}>{recipientPseudo}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        ListEmptyComponent={
          <View style={styles.emptyChat}>
            <Ionicons name="chatbubble-ellipses-outline" size={48} color={colors.gray[300]} />
            <Text style={[styles.emptyChatText, { color: colors.text.secondary }]}>
              Commencez la conversation !
            </Text>
          </View>
        }
      />

      {/* Input */}
      <View style={[styles.inputContainer, { backgroundColor: colors.card, paddingBottom: insets.bottom || Spacing.md }]}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.background.secondary, color: colors.text.primary }]}
          placeholder="Écrivez un message..."
          placeholderTextColor={colors.gray[400]}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[
            styles.sendBtn,
            { backgroundColor: inputText.trim() ? colors.primary[500] : colors.gray[300] },
          ]}
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Ionicons name="send" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backBtn: {
    padding: Spacing.sm,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
  headerAvatarText: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  headerName: {
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  messagesList: {
    padding: Spacing.md,
    flexGrow: 1,
  },
  dateHeader: {
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  dateHeaderText: {
    fontSize: FontSize.xs,
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  messageBubbleContainer: {
    marginBottom: Spacing.sm,
    alignItems: 'flex-start',
  },
  myMessageContainer: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  myMessage: {
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: FontSize.md,
    lineHeight: FontSize.md * 1.4,
  },
  messageTime: {
    fontSize: FontSize.xs,
    marginTop: Spacing.xs,
    alignSelf: 'flex-end',
  },
  emptyChat: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl * 2,
  },
  emptyChatText: {
    fontSize: FontSize.md,
    marginTop: Spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.md,
    maxHeight: 100,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
