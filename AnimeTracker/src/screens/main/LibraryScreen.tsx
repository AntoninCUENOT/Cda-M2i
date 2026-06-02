import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store';
import { loadLibrary, setFilter, selectFilteredLibrary, selectLibraryStats } from '../../store/slices/librarySlice';
import { UserAnime } from '../../types';
import { AnimeStatusType, AnimeStatusLabels } from '../../utils/constants';
import { useTheme } from '../../contexts/ThemeContext';
import { Spacing, FontSize, BorderRadius, Shadows } from '../../utils/constants';

type LibraryNav = NativeStackNavigationProp<MainStackParamList>;
type FilterType = AnimeStatusType | 'ALL' | 'FAVORIS';

const FILTERS: { key: FilterType; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'ALL', label: 'Tout', icon: 'grid-outline' },
  { key: 'FAVORIS', label: 'Favoris', icon: 'heart' },
  { key: 'EN_COURS', label: 'En cours', icon: 'play-circle-outline' },
  { key: 'A_VOIR', label: 'À voir', icon: 'bookmark-outline' },
  { key: 'TERMINE', label: 'Terminé', icon: 'checkmark-circle-outline' },
];

export default function LibraryScreen() {
  const navigation = useNavigation<LibraryNav>();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { filter } = useAppSelector(state => state.library);
  const filteredAnimes = useAppSelector(selectFilteredLibrary);
  const stats = useAppSelector(selectLibraryStats);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { dispatch(loadLibrary()); }, [dispatch]);

  const onRefresh = async () => { setRefreshing(true); await dispatch(loadLibrary()); setRefreshing(false); };

  const getCount = (key: FilterType) => {
    if (key === 'ALL') return stats.total;
    if (key === 'FAVORIS') return stats.favoris;
    if (key === 'EN_COURS') return stats.enCours;
    if (key === 'A_VOIR') return stats.aVoir;
    if (key === 'TERMINE') return stats.termine;
    return stats.abandonne;
  };

  const renderItem = ({ item }: { item: UserAnime }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }, Shadows.sm]}
      onPress={() => navigation.navigate('AnimeDetail', { animeId: item.animeId })}
    >
      <View style={styles.posterContainer}>
        <Image source={{ uri: item.animePoster }} style={[styles.poster, { backgroundColor: colors.gray[200] }]} />
        {item.isFavorite && (
          <View style={[styles.favoriteBadge, { backgroundColor: colors.error.main }]}>
            <Ionicons name="heart" size={12} color="#FFFFFF" />
          </View>
        )}
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: colors.text.primary }]} numberOfLines={2}>{item.animeTitle}</Text>
        <View style={styles.cardMetaRow}>
          <Text style={[styles.cardMeta, { color: colors.text.secondary }]}>{AnimeStatusLabels[item.status]}</Text>
          {item.personalRating && (
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={10} color={colors.rating.star} />
              <Text style={[styles.ratingText, { color: colors.rating.star }]}>{item.personalRating}</Text>
            </View>
          )}
        </View>
        {item.status === 'EN_COURS' && (
          <Text style={[styles.cardProgress, { color: colors.primary[500] }]}>Épisode {item.currentEpisode}/{item.totalEpisodes || '?'}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Fond coloré derrière la status bar */}
      <View style={[styles.statusBarBg, { height: insets.top, backgroundColor: colors.background.primary }]} />

      {/* Header dégradé */}
      <LinearGradient
        colors={[colors.primary[700], colors.primary[500], colors.secondary[400]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.title}>Ma Bibliothèque</Text>
        <Text style={styles.subtitle}>{stats.total} anime{stats.total > 1 ? 's' : ''} au total</Text>
      </LinearGradient>

      {/* Filtres en grille 2x2 */}
      <View style={styles.filterGrid}>
        {FILTERS.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.filterBtn,
              { backgroundColor: colors.gray[50], borderColor: colors.gray[200] },
              filter === item.key && { backgroundColor: colors.primary[500], borderColor: colors.primary[500] }
            ]}
            onPress={() => dispatch(setFilter(item.key))}
          >
            <Ionicons
              name={item.icon}
              size={20}
              color={filter === item.key ? '#FFFFFF' : colors.primary[500]}
            />
            <Text style={[styles.filterText, { color: colors.text.primary }, filter === item.key && { color: '#FFFFFF' }]}>
              {item.label}
            </Text>
            <Text style={[styles.filterCount, { color: colors.primary[500] }, filter === item.key && { color: '#FFFFFF' }]}>
              {getCount(item.key)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Liste des animes */}
      <FlatList
        data={filteredAnimes}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary[500]} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="library-outline" size={64} color={colors.gray[300]} />
            <Text style={[styles.emptyText, { color: colors.text.primary }]}>Aucun anime dans cette catégorie</Text>
            <Text style={[styles.emptySubtext, { color: colors.text.secondary }]}>Explorez et ajoutez des animes !</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  statusBarBg: {},
  header: {
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
  subtitle: {
    fontSize: FontSize.md,
    color: 'rgba(255,255,255,0.85)',
    marginTop: Spacing.xs,
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  filterBtn: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
    borderWidth: 1,
  },
  filterText: { fontSize: FontSize.sm, fontWeight: '600', flex: 1 },
  filterCount: { fontSize: FontSize.sm, fontWeight: '700' },
  list: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxxl, flexGrow: 1 },
  card: {
    flexDirection: 'row',
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  posterContainer: { position: 'relative' },
  poster: { width: 80, height: 110 },
  favoriteBadge: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.xs,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: { flex: 1, padding: Spacing.md, justifyContent: 'center' },
  cardTitle: { fontSize: FontSize.md, fontWeight: '600' },
  cardMetaRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.xs },
  cardMeta: { fontSize: FontSize.xs },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ratingText: { fontSize: FontSize.xs, fontWeight: '600' },
  cardProgress: { fontSize: FontSize.xs, marginTop: Spacing.xs },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: Spacing.xxxl * 2 },
  emptyText: { fontSize: FontSize.lg, fontWeight: '600', marginTop: Spacing.lg },
  emptySubtext: { fontSize: FontSize.md, marginTop: Spacing.xs },
});
