import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Keyboard, Modal, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store';
import { searchAnimes, clearSearch, fetchGenres, setSearchFilters, clearSearchFilters } from '../../store/slices/animeSlice';
import { SearchFilters } from '../../services/jikanApi';
import { AnimeCard, Loading } from '../../components';
import { useTheme } from '../../contexts/ThemeContext';
import { Anime } from '../../types';
import { Spacing, FontSize, BorderRadius } from '../../utils/constants';

type SearchNav = NativeStackNavigationProp<MainStackParamList>;

const ANIME_TYPES = [
  { key: 'tv', label: 'TV' },
  { key: 'movie', label: 'Film' },
  { key: 'ova', label: 'OVA' },
  { key: 'special', label: 'Spécial' },
  { key: 'ona', label: 'ONA' },
  { key: 'music', label: 'Musique' },
] as const;

const ANIME_STATUS = [
  { key: 'airing', label: 'En diffusion' },
  { key: 'complete', label: 'Terminé' },
  { key: 'upcoming', label: 'À venir' },
] as const;

const ORDER_OPTIONS = [
  { key: 'score', label: 'Note' },
  { key: 'popularity', label: 'Popularité' },
  { key: 'title', label: 'Titre' },
  { key: 'start_date', label: 'Date de sortie' },
  { key: 'rank', label: 'Classement' },
] as const;

export default function SearchScreen() {
  const navigation = useNavigation<SearchNav>();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { searchResults, searchLoading, searchQuery, searchFilters, genres } = useAppSelector(state => state.anime);
  const [query, setQuery] = useState(searchQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState<SearchFilters>(searchFilters);

  useEffect(() => {
    if (genres.length === 0) {
      dispatch(fetchGenres());
    }
  }, [dispatch, genres.length]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasFilters = Object.keys(searchFilters).length > 0;
      if (query.trim().length >= 3 || hasFilters) {
        dispatch(searchAnimes({ query, page: 1, filters: searchFilters }));
      } else if (query.trim().length === 0 && !hasFilters) {
        dispatch(clearSearch());
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [query, searchFilters, dispatch]);

  const handleClear = () => { setQuery(''); dispatch(clearSearch()); Keyboard.dismiss(); };

  const activeFiltersCount = Object.keys(searchFilters).filter(k => {
    const val = searchFilters[k as keyof SearchFilters];
    if (Array.isArray(val)) return val.length > 0;
    return val !== undefined;
  }).length;

  const applyFilters = () => {
    dispatch(setSearchFilters(tempFilters));
    setShowFilters(false);
    if (query.trim().length >= 3 || Object.keys(tempFilters).length > 0) {
      dispatch(searchAnimes({ query, page: 1, filters: tempFilters }));
    }
  };

  const resetFilters = () => {
    setTempFilters({});
    dispatch(clearSearchFilters());
    setShowFilters(false);
  };

  const toggleGenre = (genreId: number) => {
    const current = tempFilters.genres || [];
    const updated = current.includes(genreId)
      ? current.filter(id => id !== genreId)
      : [...current, genreId];
    setTempFilters({ ...tempFilters, genres: updated.length > 0 ? updated : undefined });
  };

  const renderItem = ({ item, index }: { item: Anime; index: number }) => (
    <View style={[styles.gridItem, index % 2 === 0 ? styles.gridItemLeft : styles.gridItemRight]}>
      <AnimeCard anime={item} variant="grid" onPress={() => navigation.navigate('AnimeDetail', { animeId: item.mal_id })} />
    </View>
  );

  const showResults = query.trim().length >= 3 || activeFiltersCount > 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
      {/* Status bar background */}
      <View style={[styles.statusBarBg, { height: insets.top, backgroundColor: colors.background.primary }]} />

      {/* Header */}
      <LinearGradient
        colors={[colors.primary[700], colors.primary[500], colors.secondary[400]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.title}>Recherche</Text>
        <View style={styles.searchRow}>
          <View style={[styles.searchBox, { backgroundColor: colors.card, flex: 1 }]}>
            <Ionicons name="search" size={20} color={colors.gray[500]} style={styles.searchIcon} />
            <TextInput
              style={[styles.input, { color: colors.text.primary }]}
              placeholder="Rechercher un anime..."
              placeholderTextColor={colors.gray[400]}
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={handleClear}>
                <Ionicons name="close-circle" size={20} color={colors.gray[400]} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={[styles.filterButton, { backgroundColor: activeFiltersCount > 0 ? colors.primary[500] : colors.card }]}
            onPress={() => { setTempFilters(searchFilters); setShowFilters(true); }}
          >
            <Ionicons name="options" size={22} color={activeFiltersCount > 0 ? '#FFFFFF' : colors.text.primary} />
            {activeFiltersCount > 0 && (
              <View style={[styles.filterBadge, { backgroundColor: colors.error.main }]}>
                <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {showResults ? (
        searchLoading && searchResults.length === 0 ? (
          <Loading />
        ) : (
          <FlatList
            data={searchResults}
            renderItem={renderItem}
            keyExtractor={item => item.mal_id.toString()}
            numColumns={2}
            contentContainerStyle={styles.list}
            columnWrapperStyle={styles.row}
            ListEmptyComponent={
              <Text style={[styles.empty, { color: colors.text.secondary }]}>
                Aucun résultat {query ? `pour "${query}"` : 'avec ces filtres'}
              </Text>
            }
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        )
      ) : (
        <View style={styles.placeholder}>
          <Ionicons name="search" size={64} color={colors.gray[300]} />
          <Text style={[styles.placeholderText, { color: colors.text.secondary }]}>
            Tapez au moins 3 caractères ou utilisez les filtres
          </Text>
        </View>
      )}

      {/* Filters Modal */}
      <Modal visible={showFilters} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background.primary }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border.light }]}>
              <Text style={[styles.modalTitle, { color: colors.text.primary }]}>Filtres</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Type */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { color: colors.text.primary }]}>Type</Text>
                <View style={styles.filterChips}>
                  {ANIME_TYPES.map(type => (
                    <TouchableOpacity
                      key={type.key}
                      style={[
                        styles.chip,
                        { backgroundColor: colors.gray[100], borderColor: colors.border.light },
                        tempFilters.type === type.key && { backgroundColor: colors.primary[500], borderColor: colors.primary[500] }
                      ]}
                      onPress={() => setTempFilters({ ...tempFilters, type: tempFilters.type === type.key ? undefined : type.key })}
                    >
                      <Text style={[styles.chipText, { color: colors.text.primary }, tempFilters.type === type.key && { color: '#FFFFFF' }]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Status */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { color: colors.text.primary }]}>Statut</Text>
                <View style={styles.filterChips}>
                  {ANIME_STATUS.map(status => (
                    <TouchableOpacity
                      key={status.key}
                      style={[
                        styles.chip,
                        { backgroundColor: colors.gray[100], borderColor: colors.border.light },
                        tempFilters.status === status.key && { backgroundColor: colors.primary[500], borderColor: colors.primary[500] }
                      ]}
                      onPress={() => setTempFilters({ ...tempFilters, status: tempFilters.status === status.key ? undefined : status.key })}
                    >
                      <Text style={[styles.chipText, { color: colors.text.primary }, tempFilters.status === status.key && { color: '#FFFFFF' }]}>
                        {status.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Order By */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { color: colors.text.primary }]}>Trier par</Text>
                <View style={styles.filterChips}>
                  {ORDER_OPTIONS.map(order => (
                    <TouchableOpacity
                      key={order.key}
                      style={[
                        styles.chip,
                        { backgroundColor: colors.gray[100], borderColor: colors.border.light },
                        tempFilters.orderBy === order.key && { backgroundColor: colors.primary[500], borderColor: colors.primary[500] }
                      ]}
                      onPress={() => setTempFilters({ ...tempFilters, orderBy: tempFilters.orderBy === order.key ? undefined : order.key, sort: 'desc' })}
                    >
                      <Text style={[styles.chipText, { color: colors.text.primary }, tempFilters.orderBy === order.key && { color: '#FFFFFF' }]}>
                        {order.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Genres */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { color: colors.text.primary }]}>Genres</Text>
                <View style={styles.filterChips}>
                  {genres.slice(0, 20).map(genre => (
                    <TouchableOpacity
                      key={genre.mal_id}
                      style={[
                        styles.chip,
                        { backgroundColor: colors.gray[100], borderColor: colors.border.light },
                        tempFilters.genres?.includes(genre.mal_id) && { backgroundColor: colors.primary[500], borderColor: colors.primary[500] }
                      ]}
                      onPress={() => toggleGenre(genre.mal_id)}
                    >
                      <Text style={[styles.chipText, { color: colors.text.primary }, tempFilters.genres?.includes(genre.mal_id) && { color: '#FFFFFF' }]}>
                        {genre.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={{ height: Spacing.xxxl }} />
            </ScrollView>

            <View style={[styles.modalFooter, { borderTopColor: colors.border.light }]}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.gray[200] }]}
                onPress={resetFilters}
              >
                <Text style={[styles.modalButtonText, { color: colors.text.primary }]}>Réinitialiser</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary[500], flex: 2 }]}
                onPress={applyFilters}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Appliquer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: Spacing.lg,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 48,
  },
  searchIcon: { marginRight: Spacing.sm },
  input: { flex: 1, fontSize: FontSize.md },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  list: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.xxxl },
  row: { justifyContent: 'space-between' },
  gridItem: { width: '48%', marginBottom: Spacing.md },
  gridItemLeft: { marginRight: Spacing.xs },
  gridItemRight: { marginLeft: Spacing.xs },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xxxl },
  placeholderText: { fontSize: FontSize.md, marginTop: Spacing.lg, textAlign: 'center' },
  empty: { fontSize: FontSize.md, textAlign: 'center', marginTop: Spacing.xxxl },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderBottomWidth: 1,
  },
  modalTitle: { fontSize: FontSize.xl, fontWeight: '700' },
  modalBody: { padding: Spacing.lg },
  filterSection: { marginBottom: Spacing.xl },
  filterSectionTitle: { fontSize: FontSize.md, fontWeight: '600', marginBottom: Spacing.md },
  filterChips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  chipText: { fontSize: FontSize.sm },
  modalFooter: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.md,
    borderTopWidth: 1,
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: { fontSize: FontSize.md, fontWeight: '600' },
});
