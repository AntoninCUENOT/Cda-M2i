import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchAdminStats,
  fetchAdminUsers,
  fetchAdminReviews,
  fetchAdminGroupMessages,
  changeUserRole,
  suspendUser,
  unsuspendUser,
  deleteAdminUser,
  deleteAdminReview,
  changeReviewVisibility,
  deleteAdminGroupMessage,
} from '../../store/slices/adminSlice';
import { AdminUser, AdminReview, AdminGroupMessage } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { Spacing, FontSize, BorderRadius, Shadows } from '../../utils/constants';

type Tab = 'stats' | 'users' | 'reviews' | 'messages';

export default function AdminPanelScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { stats, users, reviews, groupMessages, isLoading } = useAppSelector(
    state => state.admin,
  );
  const [activeTab, setActiveTab] = useState<Tab>('stats');

  useEffect(() => {
    dispatch(fetchAdminStats());
    dispatch(fetchAdminUsers({}));
    dispatch(fetchAdminReviews(1));
    dispatch(fetchAdminGroupMessages(1));
  }, [dispatch]);

  const handleChangeRole = (user: AdminUser) => {
    const nextRole = user.role === 'USER' ? 'ADMIN' : 'USER';
    Alert.alert(
      'Changer le rôle',
      `Passer ${user.pseudo} en ${nextRole} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: () => dispatch(changeUserRole({ userId: user.id_user, role: nextRole })),
        },
      ],
    );
  };

  const handleSuspend = (user: AdminUser) => {
    if (user.is_suspended) {
      Alert.alert('Lever la suspension', `Réactiver ${user.pseudo} ?`, [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Confirmer', onPress: () => dispatch(unsuspendUser(user.id_user)) },
      ]);
    } else {
      Alert.alert('Suspendre', `Suspendre ${user.pseudo} 7 jours ?`, [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Suspendre',
          style: 'destructive',
          onPress: () => dispatch(suspendUser({ userId: user.id_user, days: 7 })),
        },
      ]);
    }
  };

  const handleDeleteUser = (user: AdminUser) => {
    Alert.alert(
      'Supprimer l\'utilisateur',
      `Supprimer définitivement ${user.pseudo} ? Cette action est irréversible.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => dispatch(deleteAdminUser(user.id_user)),
        },
      ],
    );
  };

  const handleToggleVisibility = (review: AdminReview) => {
    const next: 'PUBLIC' | 'PRIVE' = review.visibility === 'PUBLIC' ? 'PRIVE' : 'PUBLIC';
    dispatch(changeReviewVisibility({ reviewId: review.id_review, visibility: next }));
  };

  const handleDeleteReview = (review: AdminReview) => {
    Alert.alert('Supprimer l\'avis', 'Supprimer cet avis définitivement ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: () => dispatch(deleteAdminReview(review.id_review)),
      },
    ]);
  };

  const handleDeleteMessage = (message: AdminGroupMessage) => {
    Alert.alert('Supprimer le message', 'Supprimer ce message du groupe ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: () => dispatch(deleteAdminGroupMessage(message.id_group_message)),
      },
    ]);
  };

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'stats', label: 'Stats', icon: 'bar-chart' },
    { key: 'users', label: 'Utilisateurs', icon: 'people' },
    { key: 'reviews', label: 'Avis', icon: 'star' },
    { key: 'messages', label: 'Messages', icon: 'chatbubbles' },
  ];

  const renderUserItem = ({ item }: { item: AdminUser }) => (
    <View style={[styles.itemCard, { backgroundColor: colors.card }, Shadows.sm]}>
      <View style={styles.itemHeader}>
        <View style={styles.itemAvatar}>
          <Text style={styles.itemAvatarText}>{item.pseudo.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.itemInfo}>
          <Text style={[styles.itemTitle, { color: colors.text.primary }]}>{item.pseudo}</Text>
          <Text style={[styles.itemSub, { color: colors.text.secondary }]}>{item.email}</Text>
          <View style={styles.itemTags}>
            <View style={[styles.tag, { backgroundColor: item.role === 'ADMIN' ? colors.error.main : colors.primary[500] }]}>
              <Text style={styles.tagText}>{item.role}</Text>
            </View>
            {item.is_suspended && (
              <View style={[styles.tag, { backgroundColor: colors.warning.main }]}>
                <Text style={styles.tagText}>SUSPENDU</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.primary[100] }]}
          onPress={() => handleChangeRole(item)}
        >
          <Ionicons name="shield" size={14} color={colors.primary[600]} />
          <Text style={[styles.actionText, { color: colors.primary[600] }]}>Rôle</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: item.is_suspended ? colors.success.light : colors.warning.light }]}
          onPress={() => handleSuspend(item)}
        >
          <Ionicons
            name={item.is_suspended ? 'checkmark-circle' : 'pause-circle'}
            size={14}
            color={item.is_suspended ? colors.success.main : colors.warning.main}
          />
          <Text style={[styles.actionText, { color: item.is_suspended ? colors.success.main : colors.warning.main }]}>
            {item.is_suspended ? 'Réactiver' : 'Suspendre'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.error.light }]}
          onPress={() => handleDeleteUser(item)}
        >
          <Ionicons name="trash" size={14} color={colors.error.main} />
          <Text style={[styles.actionText, { color: colors.error.main }]}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderReviewItem = ({ item }: { item: AdminReview }) => (
    <View style={[styles.itemCard, { backgroundColor: colors.card }, Shadows.sm]}>
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={[styles.itemTitle, { color: colors.text.primary }]}>
            {item.author?.pseudo ?? 'Inconnu'} — {item.anime?.title ?? `Anime #${item.id_review}`}
          </Text>
          <View style={styles.reviewMeta}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text style={[styles.itemSub, { color: colors.text.secondary }]}>
              {' '}{item.rating}/10 · {item.visibility}
            </Text>
          </View>
          {item.comment ? (
            <Text style={[styles.reviewComment, { color: colors.text.secondary }]} numberOfLines={2}>
              {item.comment}
            </Text>
          ) : null}
        </View>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.primary[100] }]}
          onPress={() => handleToggleVisibility(item)}
        >
          <Ionicons
            name={item.visibility === 'PUBLIC' ? 'eye-off' : 'eye'}
            size={14}
            color={colors.primary[600]}
          />
          <Text style={[styles.actionText, { color: colors.primary[600] }]}>
            {item.visibility === 'PUBLIC' ? 'Rendre privé' : 'Rendre public'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.error.light }]}
          onPress={() => handleDeleteReview(item)}
        >
          <Ionicons name="trash" size={14} color={colors.error.main} />
          <Text style={[styles.actionText, { color: colors.error.main }]}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderMessageItem = ({ item }: { item: AdminGroupMessage }) => (
    <View style={[styles.itemCard, { backgroundColor: colors.card }, Shadows.sm]}>
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={[styles.itemTitle, { color: colors.text.primary }]}>
            {item.author?.pseudo ?? 'Inconnu'} dans {item.group?.name ?? 'Groupe'}
          </Text>
          <Text style={[styles.reviewComment, { color: colors.text.secondary }]} numberOfLines={3}>
            {item.content}
          </Text>
        </View>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.error.light }]}
          onPress={() => handleDeleteMessage(item)}
        >
          <Ionicons name="trash" size={14} color={colors.error.main} />
          <Text style={[styles.actionText, { color: colors.error.main }]}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
      <View style={[styles.statusBarBg, { height: insets.top, backgroundColor: '#1a1a2e' }]} />

      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + Spacing.md }]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <Ionicons name="shield-checkmark" size={22} color="#e94560" />
            <Text style={styles.title}>Panneau Admin</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsRow}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabBtn, activeTab === tab.key && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Ionicons
                name={tab.icon as keyof typeof Ionicons.glyphMap}
                size={16}
                color={activeTab === tab.key ? '#1a1a2e' : 'rgba(255,255,255,0.7)'}
              />
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      {isLoading && !stats ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      ) : (
        <>
          {activeTab === 'stats' && stats && (
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Vue d'ensemble</Text>
              <View style={styles.statsGrid}>
                {[
                  { label: 'Utilisateurs', value: stats.totalUsers, icon: 'people', color: colors.primary[500] },
                  { label: 'Animés en cache', value: stats.totalAnimes, icon: 'tv', color: '#8B5CF6' },
                  { label: 'Avis', value: stats.totalReviews, icon: 'star', color: '#F59E0B' },
                  { label: 'Groupes', value: stats.totalGroups, icon: 'people-circle', color: '#10B981' },
                  { label: 'Messages groupes', value: stats.totalGroupMessages, icon: 'chatbubbles', color: '#EF4444' },
                  { label: 'Messages privés', value: stats.totalMessages, icon: 'mail', color: '#6366F1' },
                ].map(item => (
                  <View key={item.label} style={[styles.statCard, { backgroundColor: colors.card }, Shadows.sm]}>
                    <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={28} color={item.color} />
                    <Text style={[styles.statValue, { color: item.color }]}>{item.value}</Text>
                    <Text style={[styles.statLabel, { color: colors.text.secondary }]}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}

          {activeTab === 'users' && (
            <FlatList
              data={users?.data ?? []}
              keyExtractor={item => item.id_user}
              renderItem={renderUserItem}
              contentContainerStyle={styles.listContent}
              ListHeaderComponent={
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                  {users?.total ?? 0} utilisateur{(users?.total ?? 0) > 1 ? 's' : ''}
                </Text>
              }
              ListEmptyComponent={
                <Text style={[styles.emptyText, { color: colors.text.secondary }]}>Aucun utilisateur</Text>
              }
            />
          )}

          {activeTab === 'reviews' && (
            <FlatList
              data={reviews?.data ?? []}
              keyExtractor={item => item.id_review}
              renderItem={renderReviewItem}
              contentContainerStyle={styles.listContent}
              ListHeaderComponent={
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                  {reviews?.total ?? 0} avis
                </Text>
              }
              ListEmptyComponent={
                <Text style={[styles.emptyText, { color: colors.text.secondary }]}>Aucun avis</Text>
              }
            />
          )}

          {activeTab === 'messages' && (
            <FlatList
              data={groupMessages?.data ?? []}
              keyExtractor={item => item.id_group_message}
              renderItem={renderMessageItem}
              contentContainerStyle={styles.listContent}
              ListHeaderComponent={
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                  {groupMessages?.total ?? 0} message{(groupMessages?.total ?? 0) > 1 ? 's' : ''} de groupe
                </Text>
              }
              ListEmptyComponent={
                <Text style={[styles.emptyText, { color: colors.text.secondary }]}>Aucun message</Text>
              }
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  statusBarBg: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 },
  header: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  title: { fontSize: FontSize.xl, fontWeight: '700', color: '#FFFFFF' },
  tabsRow: { marginTop: Spacing.sm },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  tabBtnActive: { backgroundColor: '#FFFFFF' },
  tabText: { fontSize: FontSize.sm, fontWeight: '600', color: 'rgba(255,255,255,0.7)' },
  tabTextActive: { color: '#1a1a2e' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, padding: Spacing.lg },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statValue: { fontSize: FontSize.xxl, fontWeight: '800' },
  statLabel: { fontSize: FontSize.xs, textAlign: 'center' },
  listContent: { paddingBottom: Spacing.xl },
  itemCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  itemHeader: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.sm },
  itemAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0f3460',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemAvatarText: { fontSize: FontSize.md, fontWeight: '700', color: '#FFFFFF' },
  itemInfo: { flex: 1 },
  itemTitle: { fontSize: FontSize.md, fontWeight: '600', marginBottom: 2 },
  itemSub: { fontSize: FontSize.sm, marginBottom: Spacing.xs },
  itemTags: { flexDirection: 'row', gap: Spacing.xs, flexWrap: 'wrap' },
  tag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  tagText: { fontSize: 10, fontWeight: '700', color: '#FFFFFF' },
  reviewMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs },
  reviewComment: { fontSize: FontSize.sm, lineHeight: 18 },
  itemActions: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  actionText: { fontSize: FontSize.xs, fontWeight: '600' },
  emptyText: { textAlign: 'center', marginTop: Spacing.xl, fontSize: FontSize.md },
});
