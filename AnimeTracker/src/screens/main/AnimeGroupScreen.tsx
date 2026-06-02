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
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  checkAnimeGroup,
  loadGroupMessages,
  sendGroupMessage,
  createOrJoinGroup,
  leaveGroup,
  selectCurrentGroupMessages,
  selectJoinedGroupIds,
  clearCurrentGroupMessages,
} from '../../store/slices/groupsSlice';
import { useTheme } from '../../contexts/ThemeContext';
import { GroupMessage } from '../../types';
import { Spacing, FontSize, BorderRadius } from '../../utils/constants';

type AnimeGroupRoute = RouteProp<MainStackParamList, 'AnimeGroup'>;

const AVATAR_COLORS = [
  '#6366F1', '#8B5CF6', '#22C55E', '#F59E0B',
  '#EF4444', '#9333EA', '#EC4899', '#14B8A6',
];

export default function AnimeGroupScreen() {
  const navigation = useNavigation();
  const route = useRoute<AnimeGroupRoute>();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { animeId, animeTitle } = route.params;

  const messages = useAppSelector(selectCurrentGroupMessages);
  const joinedGroupIds = useAppSelector(selectJoinedGroupIds);
  const currentUser = useAppSelector(state => state.auth.user);
  const group = useAppSelector(state => state.groups.groups.find(g => g.animeId === animeId));

  const groupId = group?.id ?? null;
  const [inputText, setInputText] = useState('');
  const isJoined = groupId ? joinedGroupIds.includes(groupId) : false;
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    dispatch(checkAnimeGroup(animeId));
  }, [dispatch, animeId]);

  useEffect(() => {
    if (isJoined && groupId) {
      dispatch(loadGroupMessages(groupId));
    }
    return () => {
      dispatch(clearCurrentGroupMessages());
    };
  }, [dispatch, groupId, isJoined]);

  const handleJoin = async () => {
    await dispatch(createOrJoinGroup({
      animeId,
      animeTitle,
      animePoster: '', // Sera rempli depuis la page détail
    }));
  };

  const handleLeave = () => {
    if (!groupId) return;
    Alert.alert(
      'Quitter le groupe',
      `Voulez-vous quitter le groupe de discussion de "${animeTitle}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Quitter',
          style: 'destructive',
          onPress: () => dispatch(leaveGroup(groupId)),
        },
      ]
    );
  };

  const handleSend = () => {
    if (!inputText.trim() || !groupId) return;
    dispatch(sendGroupMessage({ groupId, content: inputText.trim() }));

    setInputText('');
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
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

  const renderMessage = ({ item, index }: { item: GroupMessage; index: number }) => {
    const isMe = item.senderId === currentUser?.id;
    const avatarIndex = typeof item.senderAvatar === 'number' ? item.senderAvatar : 0;
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
        <View style={[styles.messageRow, isMe && styles.myMessageRow]}>
          {!isMe && (
            <View style={[styles.messageAvatar, { backgroundColor: AVATAR_COLORS[avatarIndex % 8] }]}>
              <Text style={styles.messageAvatarText}>{item.senderPseudo.charAt(0).toUpperCase()}</Text>
            </View>
          )}
          <View style={[styles.messageContent, isMe && styles.myMessageContent]}>
            {!isMe && (
              <Text style={[styles.senderName, { color: colors.primary[500] }]}>
                {item.senderPseudo}
              </Text>
            )}
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
      </View>
    );
  };

  if (!isJoined) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.card, paddingTop: insets.top + Spacing.sm }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={[styles.headerName, { color: colors.text.primary }]} numberOfLines={1}>
              {animeTitle}
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
              Groupe de discussion
            </Text>
          </View>
        </View>

        <View style={styles.joinContainer}>
          <Ionicons name="people-outline" size={64} color={colors.gray[300]} />
          <Text style={[styles.joinTitle, { color: colors.text.primary }]}>
            Rejoignez la discussion !
          </Text>
          <Text style={[styles.joinSubtitle, { color: colors.text.secondary }]}>
            {'Discutez avec d\'autres fans de "' + animeTitle + '"'}
          </Text>
          {group && (
            <Text style={[styles.memberCount, { color: colors.text.tertiary }]}>
              {group.memberCount} membre{group.memberCount > 1 ? 's' : ''}
            </Text>
          )}
          <TouchableOpacity
            style={[styles.joinBtn, { backgroundColor: colors.primary[500] }]}
            onPress={handleJoin}
          >
            <Ionicons name="enter-outline" size={20} color="#FFFFFF" />
            <Text style={styles.joinBtnText}>Rejoindre le groupe</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
        <View style={styles.headerInfo}>
          <Text style={[styles.headerName, { color: colors.text.primary }]} numberOfLines={1}>
            {animeTitle}
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
            {group?.memberCount || 1} membre{(group?.memberCount || 1) > 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity style={styles.leaveBtn} onPress={handleLeave}>
          <Ionicons name="exit-outline" size={22} color={colors.error.main} />
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
            <Ionicons name="chatbubbles-outline" size={48} color={colors.gray[300]} />
            <Text style={[styles.emptyChatText, { color: colors.text.secondary }]}>
              Soyez le premier à envoyer un message !
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
  headerInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  headerName: {
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  leaveBtn: {
    padding: Spacing.sm,
  },
  joinContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxxl,
  },
  joinTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    marginTop: Spacing.lg,
  },
  joinSubtitle: {
    fontSize: FontSize.md,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  memberCount: {
    fontSize: FontSize.sm,
    marginTop: Spacing.md,
  },
  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.xl,
  },
  joinBtnText: {
    color: '#FFFFFF',
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
  messageRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
    alignItems: 'flex-end',
  },
  myMessageRow: {
    justifyContent: 'flex-end',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  messageAvatarText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  messageContent: {
    maxWidth: '75%',
  },
  myMessageContent: {
    alignItems: 'flex-end',
  },
  senderName: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    marginBottom: 2,
    marginLeft: Spacing.sm,
  },
  messageBubble: {
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
    textAlign: 'center',
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
