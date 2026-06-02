import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store';
import { followUser, unfollowUser, selectIsFollowing, loadFollowers, loadFollowing } from '../../store/slices/socialSlice';
import { selectPublicReviewsByUser } from '../../store/slices/reviewsSlice';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotification } from '../../contexts/NotificationContext';
import { Button } from '../../components';
import { Spacing, FontSize, BorderRadius } from '../../utils/constants';
import Colors from '../../utils/colors';

type UserProfileRoute = RouteProp<MainStackParamList, 'UserProfile'>;
type UserProfileNav = NativeStackNavigationProp<MainStackParamList>;

const AVATAR_COLORS = [
  '#6366F1', '#8B5CF6', '#22C55E', '#F59E0B',
  '#EF4444', '#9333EA', '#EC4899', '#14B8A6',
];

export default function UserProfileScreen() {
  const navigation = useNavigation<UserProfileNav>();
  const route = useRoute<UserProfileRoute>();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { showNotification } = useNotification();

  const { userId, userPseudo, userAvatar } = route.params;
  const currentUser = useAppSelector(state => state.auth.user);
  const isFollowing = useAppSelector(selectIsFollowing(currentUser?.id || '', userId));
  const userReviews = useAppSelector(selectPublicReviewsByUser(userId));
  const followers = useAppSelector(state => state.social.followers.filter(f => f.followingId === userId));
  const following = useAppSelector(state => state.social.following.filter(f => f.followerId === userId));

  const [activeTab, setActiveTab] = useState<'reviews' | 'followers' | 'following'>('reviews');

  useEffect(() => {
    dispatch(loadFollowers(userId));
    dispatch(loadFollowing(userId));
  }, [dispatch, userId]);

  const handleFollow = async () => {
    if (!currentUser) return;

    try {
      if (isFollowing) {
        await dispatch(unfollowUser({ targetUserId: userId }));
        showNotification({
          type: 'info',
          title: 'Ne plus suivre',
          message: `Vous ne suivez plus ${userPseudo}`,
        });
      } else {
        await dispatch(followUser({
          targetUserId: userId,
        }));
        showNotification({
          type: 'success',
          title: 'Nouveau suivi',
          message: `Vous suivez maintenant ${userPseudo}`,
        });
      }
    } catch {
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Une erreur est survenue',
      });
    }
  };

  const handleSendMessage = () => {
    navigation.navigate('Chat', {
      recipientId: userId,
      recipientPseudo: userPseudo,
      recipientAvatar: userAvatar,
    });
  };

  const avatarIndex = typeof userAvatar === 'number' ? userAvatar : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Profil</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={[styles.profileSection, { backgroundColor: colors.card }]}>
          <View style={[styles.avatar, { backgroundColor: AVATAR_COLORS[avatarIndex % 8] }]}>
            <Text style={styles.avatarText}>{userPseudo.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={[styles.pseudo, { color: colors.text.primary }]}>{userPseudo}</Text>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <TouchableOpacity style={styles.statItem} onPress={() => setActiveTab('reviews')}>
              <Text style={[styles.statValue, { color: colors.text.primary }]}>{userReviews.length}</Text>
              <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Avis</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem} onPress={() => setActiveTab('followers')}>
              <Text style={[styles.statValue, { color: colors.text.primary }]}>{followers.length}</Text>
              <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Abonnés</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem} onPress={() => setActiveTab('following')}>
              <Text style={[styles.statValue, { color: colors.text.primary }]}>{following.length}</Text>
              <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Abonnements</Text>
            </TouchableOpacity>
          </View>

          {/* Actions */}
          {currentUser && currentUser.id !== userId && (
            <View style={styles.actionsRow}>
              <Button
                title={isFollowing ? 'Ne plus suivre' : 'Suivre'}
                variant={isFollowing ? 'outline' : 'primary'}
                onPress={handleFollow}
                style={{ flex: 1 }}
                icon={isFollowing ? 'person-remove-outline' : 'person-add-outline'}
              />
              <TouchableOpacity
                style={[styles.messageBtn, { borderColor: colors.border.light }]}
                onPress={handleSendMessage}
              >
                <Ionicons name="chatbubble-outline" size={20} color={colors.primary[500]} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Tabs */}
        <View style={[styles.tabs, { backgroundColor: colors.card }]}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'reviews' && styles.tabActive]}
            onPress={() => setActiveTab('reviews')}
          >
            <Text style={[styles.tabText, activeTab === 'reviews' && { color: colors.primary[500] }]}>
              Avis publics
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'followers' && styles.tabActive]}
            onPress={() => setActiveTab('followers')}
          >
            <Text style={[styles.tabText, activeTab === 'followers' && { color: colors.primary[500] }]}>
              Abonnés
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'following' && styles.tabActive]}
            onPress={() => setActiveTab('following')}
          >
            <Text style={[styles.tabText, activeTab === 'following' && { color: colors.primary[500] }]}>
              Abonnements
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {activeTab === 'reviews' && (
            <>
              {userReviews.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="chatbubbles-outline" size={48} color={colors.gray[300]} />
                  <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
                    Aucun avis public
                  </Text>
                </View>
              ) : (
                userReviews.map(review => (
                  <TouchableOpacity
                    key={review.id}
                    style={[styles.reviewCard, { backgroundColor: colors.card }]}
                    onPress={() => navigation.navigate('AnimeDetail', { animeId: review.animeId })}
                  >
                    <Image
                      source={{ uri: review.animePoster }}
                      style={styles.animePoster}
                      resizeMode="cover"
                    />
                    <View style={styles.reviewContent}>
                      <Text style={[styles.animeTitle, { color: colors.text.primary }]} numberOfLines={1}>
                        {review.animeTitle}
                      </Text>
                      <View style={styles.ratingRow}>
                        <Ionicons name="star" size={14} color={Colors.rating.star} />
                        <Text style={[styles.ratingText, { color: colors.text.primary }]}>
                          {review.rating.toFixed(1)}
                        </Text>
                      </View>
                      <Text style={[styles.reviewText, { color: colors.text.secondary }]} numberOfLines={2}>
                        {review.content}
                      </Text>
                      <View style={styles.reviewFooter}>
                        <View style={styles.likesRow}>
                          <Ionicons name="heart" size={12} color={Colors.error.main} />
                          <Text style={[styles.likesText, { color: colors.text.tertiary }]}>
                            {review.likesCount}
                          </Text>
                        </View>
                        <Text style={[styles.dateText, { color: colors.text.tertiary }]}>
                          {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </>
          )}

          {activeTab === 'followers' && (
            <>
              {followers.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="people-outline" size={48} color={colors.gray[300]} />
                  <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
                    Aucun abonné
                  </Text>
                </View>
              ) : (
                followers.map(follow => (
                  <TouchableOpacity
                    key={follow.id}
                    style={[styles.userCard, { backgroundColor: colors.card }]}
                    onPress={() => navigation.push('UserProfile', {
                      userId: follow.followerId,
                      userPseudo: follow.followerPseudo,
                      userAvatar: follow.followerAvatar,
                    })}
                  >
                    <View style={[styles.userAvatar, { backgroundColor: AVATAR_COLORS[
                      typeof follow.followerAvatar === 'number' ? follow.followerAvatar % 8 : 0
                    ] }]}>
                      <Text style={styles.userAvatarText}>
                        {follow.followerPseudo.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={[styles.userName, { color: colors.text.primary }]}>
                      {follow.followerPseudo}
                    </Text>
                    <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
                  </TouchableOpacity>
                ))
              )}
            </>
          )}

          {activeTab === 'following' && (
            <>
              {following.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="people-outline" size={48} color={colors.gray[300]} />
                  <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
                    Aucun abonnement
                  </Text>
                </View>
              ) : (
                following.map(follow => (
                  <TouchableOpacity
                    key={follow.id}
                    style={[styles.userCard, { backgroundColor: colors.card }]}
                    onPress={() => navigation.push('UserProfile', {
                      userId: follow.followingId,
                      userPseudo: follow.followingPseudo,
                      userAvatar: follow.followingAvatar,
                    })}
                  >
                    <View style={[styles.userAvatar, { backgroundColor: AVATAR_COLORS[
                      typeof follow.followingAvatar === 'number' ? follow.followingAvatar % 8 : 0
                    ] }]}>
                      <Text style={styles.userAvatarText}>
                        {follow.followingPseudo.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={[styles.userName, { color: colors.text.primary }]}>
                      {follow.followingPseudo}
                    </Text>
                    <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
                  </TouchableOpacity>
                ))
              )}
            </>
          )}
        </View>

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backBtn: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    fontSize: FontSize.xxxl,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pseudo: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  statValue: {
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  messageBtn: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary[500],
  },
  tabText: {
    fontSize: FontSize.sm,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  content: {
    padding: Spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl * 2,
  },
  emptyText: {
    fontSize: FontSize.md,
    marginTop: Spacing.md,
  },
  reviewCard: {
    flexDirection: 'row',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  animePoster: {
    width: 60,
    height: 85,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.gray[200],
  },
  reviewContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  animeTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  ratingText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  reviewText: {
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * 1.4,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  likesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likesText: {
    fontSize: FontSize.xs,
  },
  dateText: {
    fontSize: FontSize.xs,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userName: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: '500',
    marginLeft: Spacing.md,
  },
});
