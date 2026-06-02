import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchTopAnimes } from '../../store/slices/animeSlice';
import { AnimeCard, GradientHeaderLarge } from '../../components';
import { Anime } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { Spacing, FontSize } from '../../utils/constants';

type HomeNav = NativeStackNavigationProp<MainStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeNav>();
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const { user } = useAppSelector(state => state.auth);
  const { topAnimes, topLoading, hasMorePages } = useAppSelector(state => state.anime);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchTopAnimes(1));
  }, [dispatch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    await dispatch(fetchTopAnimes(1));
    setRefreshing(false);
  }, [dispatch]);

  const loadMore = useCallback(() => {
    if (!topLoading && hasMorePages) {
      const nextPage = page + 1;
      setPage(nextPage);
      dispatch(fetchTopAnimes(nextPage));
    }
  }, [dispatch, topLoading, hasMorePages, page]);

  const handleAnimePress = (animeId: number) => navigation.navigate('AnimeDetail', { animeId });

  const renderItem = ({ item, index }: { item: Anime; index: number }) => (
    <View style={[styles.gridItem, index % 2 === 0 ? styles.gridItemLeft : styles.gridItemRight]}>
      <AnimeCard anime={item} variant="grid" onPress={() => handleAnimePress(item.mal_id)} />
    </View>
  );

  const renderFooter = () => {
    if (!topLoading) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={colors.primary[500]} />
        <Text style={[styles.loadingText, { color: colors.text.secondary }]}>Chargement...</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <GradientHeaderLarge
        title={`Bonjour${user?.pseudo ? `, ${user.pseudo}` : ''} !`}
        subtitle="Découvrez les meilleurs animes"
        rightIcon="settings-outline"
        onRightPress={() => navigation.navigate('Settings')}
      />

      <FlatList
        data={topAnimes}
        renderItem={renderItem}
        keyExtractor={item => item.mal_id.toString()}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary[500]}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  row: {
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: Spacing.md,
  },
  gridItemLeft: {
    marginRight: Spacing.xs,
  },
  gridItemRight: {
    marginLeft: Spacing.xs,
  },
  loadingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  loadingText: {
    fontSize: FontSize.sm,
  },
});
