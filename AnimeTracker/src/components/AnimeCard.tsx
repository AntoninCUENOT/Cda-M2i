import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { Spacing, FontSize, BorderRadius, Shadows } from '../utils/constants';
import { Anime } from '../types';

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = (screenWidth - Spacing.lg * 3) / 2;

interface AnimeCardProps {
  anime: Anime;
  onPress?: () => void;
  variant?: 'grid' | 'horizontal' | 'large';
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime, onPress, variant = 'grid' }) => {
  const { colors } = useTheme();
  const imageUrl = anime.images?.jpg?.image_url || anime.images?.jpg?.large_image_url;
  const title = anime.title_english || anime.title;

  if (variant === 'large') {
    return (
      <TouchableOpacity style={[styles.largeCard, Shadows.lg]} onPress={onPress} activeOpacity={0.7}>
        <Image source={{ uri: imageUrl }} style={[styles.largeImage, { backgroundColor: colors.gray[200] }]} resizeMode="cover" />
        <View style={styles.largeOverlay}>
          <Text style={styles.largeTitle} numberOfLines={2}>{title}</Text>
          {anime.score && (
            <View style={styles.scoreRow}>
              <Ionicons name="star" size={14} color={colors.rating.star} />
              <Text style={styles.largeScore}>{anime.score.toFixed(1)}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === 'horizontal') {
    return (
      <TouchableOpacity
        style={[styles.horizontalCard, { backgroundColor: colors.card }, Shadows.sm]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Image source={{ uri: imageUrl }} style={[styles.horizontalImage, { backgroundColor: colors.gray[200] }]} resizeMode="cover" />
        <View style={styles.horizontalContent}>
          <Text style={[styles.horizontalTitle, { color: colors.text.primary }]} numberOfLines={2}>{title}</Text>
          <Text style={[styles.metaText, { color: colors.text.secondary }]}>{anime.type} • {anime.episodes || '?'} épisodes</Text>
          {anime.score && (
            <View style={styles.scoreRow}>
              <Ionicons name="star" size={14} color={colors.rating.star} />
              <Text style={[styles.scoreText, { color: colors.text.primary }]}>{anime.score.toFixed(1)}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.gridCard} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.imageContainer, Shadows.md]}>
        <Image source={{ uri: imageUrl }} style={[styles.gridImage, { backgroundColor: colors.gray[200] }]} resizeMode="cover" />
        {anime.score && (
          <View style={styles.scoreBadge}>
            <Ionicons name="star" size={10} color={colors.rating.star} />
            <Text style={styles.scoreBadgeText}>{anime.score.toFixed(1)}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.gridTitle, { color: colors.text.primary }]} numberOfLines={2}>{title}</Text>
      {anime.type && <Text style={[styles.gridType, { color: colors.text.secondary }]}>{anime.type}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gridCard: { width: cardWidth, marginBottom: Spacing.lg },
  imageContainer: { position: 'relative', borderRadius: BorderRadius.md, overflow: 'hidden' },
  gridImage: { width: '100%', height: cardWidth * 1.4 },
  scoreBadge: {
    position: 'absolute', top: Spacing.sm, right: Spacing.sm,
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: BorderRadius.xs, gap: 2,
  },
  scoreBadgeText: { color: '#FFFFFF', fontSize: FontSize.xs, fontWeight: '600' },
  gridTitle: { fontSize: FontSize.sm, fontWeight: '600', marginTop: Spacing.sm },
  gridType: { fontSize: FontSize.xs, marginTop: 2 },

  horizontalCard: {
    flexDirection: 'row', borderRadius: BorderRadius.md,
    overflow: 'hidden', marginBottom: Spacing.md,
  },
  horizontalImage: { width: 100, height: 140 },
  horizontalContent: { flex: 1, padding: Spacing.md, justifyContent: 'center' },
  horizontalTitle: { fontSize: FontSize.md, fontWeight: '600', marginBottom: Spacing.xs },
  metaText: { fontSize: FontSize.xs, marginBottom: Spacing.sm },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  scoreText: { fontSize: FontSize.sm, fontWeight: '600' },

  largeCard: { width: screenWidth - Spacing.lg * 2, height: 200, borderRadius: BorderRadius.lg, overflow: 'hidden', marginRight: Spacing.md },
  largeImage: { width: '100%', height: '100%' },
  largeOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end', padding: Spacing.lg },
  largeTitle: { fontSize: FontSize.xl, fontWeight: '700', color: '#FFFFFF', marginBottom: Spacing.sm },
  largeScore: { fontSize: FontSize.md, fontWeight: '600', color: '#FFFFFF' },
});

export default AnimeCard;
