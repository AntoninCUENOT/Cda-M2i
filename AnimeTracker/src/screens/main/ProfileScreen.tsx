import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { selectDetailedStats } from '../../store/slices/librarySlice';
import { loadFollowers, loadFollowing } from '../../store/slices/socialSlice';
import { selectUserReviews } from '../../store/slices/reviewsSlice';
import { MainStackParamList } from '../../navigation/types';
import { useTheme } from '../../contexts/ThemeContext';
import { Spacing, FontSize, BorderRadius, Shadows } from '../../utils/constants';

type ProfileNav = NativeStackNavigationProp<MainStackParamList>;

const StatCard = ({ label, value, color, icon }: { label: string; value: number | string; color: string; icon?: string }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.statCard, { backgroundColor: colors.card }, Shadows.sm]}>
      {icon && <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={20} color={color} style={styles.statIcon} />}
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.text.secondary }]}>{label}</Text>
    </View>
  );
};

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileNav>();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { user } = useAppSelector(state => state.auth);
  const stats = useAppSelector(selectDetailedStats);
  const followers = useAppSelector(state => state.social.followers);
  const following = useAppSelector(state => state.social.following);
  const myReviews = useAppSelector(selectUserReviews(user?.id || ''));

  useEffect(() => {
    if (user?.id) {
      dispatch(loadFollowers(user.id));
      dispatch(loadFollowing(user.id));
    }
  }, [dispatch, user?.id]);

  const formatWatchTime = () => {
    if (stats.watchTimeDays > 0) {
      return `${stats.watchTimeDays}j ${stats.watchTimeHours % 24}h`;
    }
    if (stats.watchTimeHours > 0) {
      return `${stats.watchTimeHours}h ${stats.watchTimeMinutes % 60}min`;
    }
    return `${stats.watchTimeMinutes}min`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
      {/* Fond coloré derrière la status bar */}
      <View style={[styles.statusBarBg, { height: insets.top, backgroundColor: colors.background.primary }]} />

      <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: insets.top }}>
        {/* Header dégradé avec avatar */}
        <LinearGradient
          colors={[colors.primary[700], colors.primary[500], colors.secondary[400]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerRow}>
            <Text style={styles.title}>Profil</Text>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => navigation.navigate('Settings')}
            >
              <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.pseudo?.charAt(0).toUpperCase() || 'U'}</Text>
            </View>
            <Text style={styles.pseudo}>{user?.pseudo || 'Utilisateur'}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </LinearGradient>

        {/* Statistiques de la bibliothèque */}
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Ma bibliothèque</Text>
          <View style={styles.statsGrid}>
            <StatCard label="Total" value={stats.total} color={colors.primary[500]} icon="library" />
            <StatCard label="En cours" value={stats.enCours} color={colors.animeStatus.enCours} icon="play-circle" />
            <StatCard label="Terminés" value={stats.termine} color={colors.animeStatus.termine} icon="checkmark-circle" />
            <StatCard label="À voir" value={stats.aVoir} color={colors.animeStatus.aVoir} icon="bookmark" />
          </View>
        </View>

        {/* Statistiques de visionnage */}
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Visionnage</Text>
          <View style={[styles.watchTimeCard, { backgroundColor: colors.card }, Shadows.sm]}>
            <View style={styles.watchTimeRow}>
              <View style={styles.watchTimeItem}>
                <Ionicons name="tv" size={24} color={colors.primary[500]} />
                <Text style={[styles.watchTimeValue, { color: colors.text.primary }]}>{stats.totalEpisodesWatched}</Text>
                <Text style={[styles.watchTimeLabel, { color: colors.text.secondary }]}>Épisodes vus</Text>
              </View>
              <View style={[styles.watchTimeDivider, { backgroundColor: colors.border.light }]} />
              <View style={styles.watchTimeItem}>
                <Ionicons name="time" size={24} color={colors.secondary[500]} />
                <Text style={[styles.watchTimeValue, { color: colors.text.primary }]}>{formatWatchTime()}</Text>
                <Text style={[styles.watchTimeLabel, { color: colors.text.secondary }]}>Temps total</Text>
              </View>
              <View style={[styles.watchTimeDivider, { backgroundColor: colors.border.light }]} />
              <View style={styles.watchTimeItem}>
                <Ionicons name="star" size={24} color={colors.warning.main} />
                <Text style={[styles.watchTimeValue, { color: colors.text.primary }]}>{stats.averageRating > 0 ? stats.averageRating : '-'}</Text>
                <Text style={[styles.watchTimeLabel, { color: colors.text.secondary }]}>Note moyenne</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Progression et activité */}
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Progression</Text>
          <View style={[styles.progressCard, { backgroundColor: colors.card }, Shadows.sm]}>
            <View style={styles.progressRow}>
              <View style={styles.progressItem}>
                <Text style={[styles.progressLabel, { color: colors.text.secondary }]}>Taux de complétion</Text>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBarBg, { backgroundColor: colors.gray[200] }]}>
                    <View style={[styles.progressBarFill, { width: `${stats.completionRate}%`, backgroundColor: colors.success.main }]} />
                  </View>
                  <Text style={[styles.progressPercent, { color: colors.success.main }]}>{stats.completionRate}%</Text>
                </View>
              </View>
            </View>
            <View style={[styles.activityDivider, { backgroundColor: colors.border.light }]} />
            <View style={styles.activityRow}>
              <View style={styles.activityItem}>
                <Ionicons name="heart" size={18} color={colors.error.main} />
                <Text style={[styles.activityValue, { color: colors.text.primary }]}>{stats.favoris}</Text>
                <Text style={[styles.activityLabel, { color: colors.text.secondary }]}>Favoris</Text>
              </View>
              <View style={styles.activityItem}>
                <Ionicons name="add-circle" size={18} color={colors.primary[500]} />
                <Text style={[styles.activityValue, { color: colors.text.primary }]}>{stats.recentlyAdded}</Text>
                <Text style={[styles.activityLabel, { color: colors.text.secondary }]}>Cette semaine</Text>
              </View>
              <View style={styles.activityItem}>
                <Ionicons name="close-circle" size={18} color={colors.animeStatus.abandonne} />
                <Text style={[styles.activityValue, { color: colors.text.primary }]}>{stats.abandonne}</Text>
                <Text style={[styles.activityLabel, { color: colors.text.secondary }]}>Abandonnés</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Section Sociale */}
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Social</Text>
          <View style={[styles.socialCard, { backgroundColor: colors.card }, Shadows.sm]}>
            <View style={styles.socialRow}>
              <View style={styles.socialItem}>
                <Ionicons name="people" size={22} color={colors.primary[500]} />
                <Text style={[styles.socialValue, { color: colors.text.primary }]}>{followers.length}</Text>
                <Text style={[styles.socialLabel, { color: colors.text.secondary }]}>Abonnés</Text>
              </View>
              <View style={[styles.socialDivider, { backgroundColor: colors.border.light }]} />
              <View style={styles.socialItem}>
                <Ionicons name="person-add" size={22} color={colors.secondary[500]} />
                <Text style={[styles.socialValue, { color: colors.text.primary }]}>{following.length}</Text>
                <Text style={[styles.socialLabel, { color: colors.text.secondary }]}>Abonnements</Text>
              </View>
              <View style={[styles.socialDivider, { backgroundColor: colors.border.light }]} />
              <View style={styles.socialItem}>
                <Ionicons name="chatbubbles" size={22} color={colors.warning.main} />
                <Text style={[styles.socialValue, { color: colors.text.primary }]}>{myReviews.length}</Text>
                <Text style={[styles.socialLabel, { color: colors.text.secondary }]}>Mes avis</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          {user?.role === 'ADMIN' && (
            <TouchableOpacity
              style={[styles.adminBtn, { backgroundColor: '#0f3460' }, Shadows.sm]}
              onPress={() => navigation.navigate('AdminPanel')}
            >
              <Ionicons name="shield-checkmark" size={20} color="#e94560" />
              <Text style={[styles.logoutText, { color: '#FFFFFF' }]}>Panneau Admin</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.logoutBtn, { backgroundColor: colors.card }, Shadows.sm]}
            onPress={() => dispatch(logout())}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.error.main} />
            <Text style={[styles.logoutText, { color: colors.error.main }]}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.version, { color: colors.text.tertiary }]}>AnimeTracker v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  statusBarBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: FontSize.largeTitle,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: { fontSize: 40, fontWeight: '700', color: '#FFFFFF' },
  pseudo: { fontSize: FontSize.xxl, fontWeight: '700', color: '#FFFFFF' },
  email: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.85)', marginTop: Spacing.xs },
  statsSection: { padding: Spacing.lg, paddingTop: 0 },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '600', marginBottom: Spacing.md, marginTop: Spacing.lg },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  statCard: { flex: 1, minWidth: '45%', borderRadius: BorderRadius.md, padding: Spacing.md, alignItems: 'center' },
  statIcon: { marginBottom: Spacing.xs },
  statValue: { fontSize: FontSize.xxl, fontWeight: '700' },
  statLabel: { fontSize: FontSize.xs, marginTop: Spacing.xs },
  // Watch time card
  watchTimeCard: { borderRadius: BorderRadius.md, padding: Spacing.lg },
  watchTimeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  watchTimeItem: { alignItems: 'center', flex: 1 },
  watchTimeValue: { fontSize: FontSize.lg, fontWeight: '700', marginTop: Spacing.sm },
  watchTimeLabel: { fontSize: FontSize.xs, marginTop: Spacing.xs },
  watchTimeDivider: { width: 1, height: 50 },
  // Progress card
  progressCard: { borderRadius: BorderRadius.md, padding: Spacing.lg },
  progressRow: { marginBottom: Spacing.md },
  progressItem: {},
  progressLabel: { fontSize: FontSize.sm, marginBottom: Spacing.sm },
  progressBarContainer: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  progressBarBg: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  progressPercent: { fontSize: FontSize.md, fontWeight: '700', minWidth: 45 },
  activityDivider: { height: 1, marginVertical: Spacing.md },
  activityRow: { flexDirection: 'row', justifyContent: 'space-around' },
  activityItem: { alignItems: 'center' },
  activityValue: { fontSize: FontSize.lg, fontWeight: '700', marginTop: Spacing.xs },
  activityLabel: { fontSize: FontSize.xs, marginTop: Spacing.xs },
  menuSection: { padding: Spacing.lg },
  adminBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: Spacing.lg, borderRadius: BorderRadius.md, gap: Spacing.sm, marginBottom: Spacing.md },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: Spacing.lg, borderRadius: BorderRadius.md, gap: Spacing.sm },
  logoutText: { fontSize: FontSize.md, fontWeight: '600' },
  version: { fontSize: FontSize.sm, textAlign: 'center', paddingVertical: Spacing.xl },
  // Social card
  socialCard: { borderRadius: BorderRadius.md, padding: Spacing.lg },
  socialRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  socialItem: { alignItems: 'center', flex: 1 },
  socialValue: { fontSize: FontSize.xl, fontWeight: '700', marginTop: Spacing.sm },
  socialLabel: { fontSize: FontSize.xs, marginTop: Spacing.xs },
  socialDivider: { width: 1, height: 50 },
});
