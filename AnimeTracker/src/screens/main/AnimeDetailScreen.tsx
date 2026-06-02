import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Alert, FlatList, Share, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchAnimeDetail, clearSelectedAnime } from '../../store/slices/animeSlice';
import { addToLibrary, updateLibraryAnime, removeFromLibrary, selectAnimeInLibrary } from '../../store/slices/librarySlice';
import { loadReviewsForAnime, loadMyReview, createReview, updateReview, deleteReview, toggleLikeReview, selectUserReviewForAnime, selectPublicReviewsForAnime } from '../../store/slices/reviewsSlice';
import { jikanApi } from '../../services/jikanApi';
import { Loading, Button } from '../../components';
import { AnimeStatusType, AnimeStatusLabels } from '../../utils/constants';
import Colors from '../../utils/colors';
import { Spacing, FontSize, BorderRadius } from '../../utils/constants';
import { Anime } from '../../types';
import { useNotification } from '../../contexts/NotificationContext';

const { width: screenWidth } = Dimensions.get('window');

type DetailRoute = RouteProp<MainStackParamList, 'AnimeDetail'>;
type DetailNav = NativeStackNavigationProp<MainStackParamList>;

const STATUS_OPTIONS: { key: AnimeStatusType; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'A_VOIR', label: 'À voir', icon: 'bookmark-outline' },
  { key: 'EN_COURS', label: 'En cours', icon: 'play-circle-outline' },
  { key: 'TERMINE', label: 'Terminé', icon: 'checkmark-circle-outline' },
  { key: 'ABANDONNE', label: 'Abandonné', icon: 'close-circle-outline' },
];

export default function AnimeDetailScreen() {
  const navigation = useNavigation<DetailNav>();
  const route = useRoute<DetailRoute>();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { showNotification } = useNotification();
  const { animeId } = route.params;
  const { selectedAnime: anime, selectedLoading } = useAppSelector(state => state.anime);
  const currentUser = useAppSelector(state => state.auth.user);
  const libraryAnime = useAppSelector(selectAnimeInLibrary(animeId));
  const myReview = useAppSelector(selectUserReviewForAnime(currentUser?.id || '', animeId));
  const publicReviews = useAppSelector(selectPublicReviewsForAnime(animeId));
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState(false);
  const [tempRating, setTempRating] = useState(libraryAnime?.personalRating || 0);
  const [tempNote, setTempNote] = useState(libraryAnime?.personalNote || '');
  const [tempReviewContent, setTempReviewContent] = useState(myReview?.content || '');
  const [tempReviewRating, setTempReviewRating] = useState(myReview?.rating || 7);
  const [tempReviewIsPublic, setTempReviewIsPublic] = useState(myReview?.isPublic || false);
  const [recommendations, setRecommendations] = useState<Anime[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const loadRecommendations = async () => {
    setLoadingRecommendations(true);
    try {
      const data = await jikanApi.getAnimeRecommendations(animeId);
      setRecommendations(data.slice(0, 10).map(r => r.entry));
    } catch {
      // Silently fail for recommendations
    } finally {
      setLoadingRecommendations(false);
    }
  };

  useEffect(() => {
    dispatch(fetchAnimeDetail(animeId));
    dispatch(loadReviewsForAnime(animeId));
    dispatch(loadMyReview(animeId));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRecommendations();
    return () => { dispatch(clearSelectedAnime()); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, animeId]);

  useEffect(() => {
    if (libraryAnime?.personalRating) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTempRating(libraryAnime.personalRating);
    }
    if (libraryAnime?.personalNote !== undefined) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTempNote(libraryAnime.personalNote || '');
    }
  }, [libraryAnime?.personalRating, libraryAnime?.personalNote]);

  useEffect(() => {
    if (myReview) {
      setTempReviewContent(myReview.content); // eslint-disable-line react-hooks/set-state-in-effect
      setTempReviewRating(myReview.rating); // eslint-disable-line react-hooks/set-state-in-effect
      setTempReviewIsPublic(myReview.isPublic); // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [myReview]);

  const handleAdd = (status: AnimeStatusType) => {
    if (anime) {
      dispatch(addToLibrary({ anime, status }));
      showNotification({
        type: 'success',
        title: 'Ajouté à la bibliothèque',
        message: `${anime.title_english || anime.title} a été ajouté`,
      });
    }
    setShowStatusModal(false);
  };

  const handleUpdate = (status: AnimeStatusType) => {
    dispatch(updateLibraryAnime({ animeId, data: { status } }));
    setShowStatusModal(false);
  };

  const handleRemove = () => {
    Alert.alert('Supprimer', 'Retirer cet anime de votre bibliothèque ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => dispatch(removeFromLibrary(animeId)) },
    ]);
  };

  const handleToggleFavorite = () => {
    if (libraryAnime) {
      dispatch(updateLibraryAnime({ animeId, data: { isFavorite: !libraryAnime.isFavorite } }));
      showNotification({
        type: 'success',
        title: libraryAnime.isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris',
      });
    }
  };

  const handleSaveRating = () => {
    if (libraryAnime) {
      dispatch(updateLibraryAnime({ animeId, data: { personalRating: tempRating } }));
      showNotification({
        type: 'success',
        title: 'Note enregistrée',
        message: `Vous avez noté ${tempRating}/10`,
      });
    }
    setShowRatingModal(false);
  };

  const handleSaveNote = () => {
    if (libraryAnime) {
      dispatch(updateLibraryAnime({ animeId, data: { personalNote: tempNote.trim() || null } }));
      showNotification({
        type: 'success',
        title: 'Commentaire enregistré',
      });
    }
    setShowNoteModal(false);
  };

  const handleSaveReview = async () => {
    if (!currentUser || !anime) return;

    const reviewContent = tempReviewContent.trim();
    if (!reviewContent) {
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Veuillez écrire votre avis',
      });
      return;
    }

    try {
      if (myReview) {
        await dispatch(updateReview({
          reviewId: myReview.id,
          data: {
            content: reviewContent,
            rating: tempReviewRating,
            isPublic: tempReviewIsPublic,
          },
        }));
        showNotification({
          type: 'success',
          title: 'Review mise à jour',
        });
      } else {
        await dispatch(createReview({
          userId: currentUser.id,
          userPseudo: currentUser.pseudo,
          userAvatar: currentUser.avatar,
          animeId: anime.mal_id,
          animeTitle: anime.title_english || anime.title,
          animePoster: anime.images?.jpg?.image_url || '',
          rating: tempReviewRating,
          content: reviewContent,
          isPublic: tempReviewIsPublic,
        }));
        showNotification({
          type: 'success',
          title: 'Review créée',
          message: tempReviewIsPublic ? 'Votre avis est maintenant public' : 'Votre avis est privé',
        });
      }
      setShowReviewModal(false);
    } catch {
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de sauvegarder la review',
      });
    }
  };

  const handleDeleteReview = () => {
    if (!myReview) return;
    Alert.alert(
      'Supprimer la review',
      'Voulez-vous vraiment supprimer votre avis ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await dispatch(deleteReview(myReview.id));
            showNotification({
              type: 'success',
              title: 'Review supprimée',
            });
          },
        },
      ]
    );
  };

  const handleLikeReview = (reviewId: string) => {
    if (!currentUser) return;
    dispatch(toggleLikeReview({ reviewId, userId: currentUser.id }));
  };

  const handleEpisodeIncrement = () => {
    if (libraryAnime && libraryAnime.status === 'EN_COURS') {
      const newEpisode = (libraryAnime.currentEpisode || 0) + 1;
      const totalEps = libraryAnime.totalEpisodes || anime?.episodes;

      if (totalEps && newEpisode >= totalEps) {
        Alert.alert(
          'Anime terminé ?',
          'Vous avez regardé tous les épisodes. Voulez-vous marquer cet anime comme terminé ?',
          [
            { text: 'Non', style: 'cancel', onPress: () => dispatch(updateLibraryAnime({ animeId, data: { currentEpisode: newEpisode } })) },
            { text: 'Oui', onPress: () => dispatch(updateLibraryAnime({ animeId, data: { currentEpisode: newEpisode, status: 'TERMINE' } })) },
          ]
        );
      } else {
        dispatch(updateLibraryAnime({ animeId, data: { currentEpisode: newEpisode } }));
      }
    }
  };

  const handleEpisodeDecrement = () => {
    if (libraryAnime && libraryAnime.status === 'EN_COURS' && (libraryAnime.currentEpisode || 0) > 0) {
      dispatch(updateLibraryAnime({ animeId, data: { currentEpisode: (libraryAnime.currentEpisode || 1) - 1 } }));
    }
  };

  const handleShare = async () => {
    if (!anime) return;
    try {
      const title = anime.title_english || anime.title;
      const malUrl = `https://myanimelist.net/anime/${anime.mal_id}`;
      const message = `📺 ${title}\n\n⭐ Note: ${anime.score ? anime.score.toFixed(1) : 'N/A'}/10\n📺 ${anime.episodes ? `${anime.episodes} épisodes` : 'Épisodes inconnus'}\n\n${anime.synopsis ? anime.synopsis.slice(0, 200) + '...' : ''}\n\n🔗 ${malUrl}`;

      await Share.share({
        message,
        title: `Découvre ${title} !`,
      });
    } catch {
      // User cancelled
    }
  };

  if (selectedLoading || !anime) return <Loading fullScreen text="Chargement..." />;

  const imageUrl = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.cover} resizeMode="cover" />
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)', Colors.background.primary]} style={styles.gradient} />

          {/* Header buttons */}
          <View style={[styles.headerButtons, { top: insets.top + Spacing.md }]}>
            <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={Colors.white} />
            </TouchableOpacity>
            <View style={styles.headerRightButtons}>
              <TouchableOpacity style={styles.headerBtn} onPress={handleShare}>
                <Ionicons name="share-outline" size={24} color={Colors.white} />
              </TouchableOpacity>
              {libraryAnime && (
                <TouchableOpacity style={styles.headerBtn} onPress={handleToggleFavorite}>
                  <Ionicons
                    name={libraryAnime.isFavorite ? 'heart' : 'heart-outline'}
                    size={24}
                    color={libraryAnime.isFavorite ? Colors.error.main : Colors.white}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.overlay}>
            <Text style={styles.title} numberOfLines={2}>{anime.title_english || anime.title}</Text>
            {anime.title_japanese && <Text style={styles.japTitle}>{anime.title_japanese}</Text>}
          </View>
        </View>

        <View style={styles.content}>
          {/* Scores row */}
          <View style={styles.scoresRow}>
            {anime.score && (
              <View style={styles.scoreCard}>
                <View style={styles.scoreHeader}>
                  <Ionicons name="star" size={18} color={Colors.rating.star} />
                  <Text style={styles.scoreLabel}>MAL</Text>
                </View>
                <Text style={styles.scoreValue}>{anime.score.toFixed(1)}</Text>
              </View>
            )}
            {libraryAnime && (
              <TouchableOpacity style={styles.scoreCard} onPress={() => setShowRatingModal(true)}>
                <View style={styles.scoreHeader}>
                  <Ionicons name="heart" size={18} color={Colors.primary[500]} />
                  <Text style={styles.scoreLabel}>Ma note</Text>
                </View>
                <Text style={styles.scoreValue}>
                  {libraryAnime.personalRating ? libraryAnime.personalRating.toFixed(1) : '-'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Meta info */}
          <View style={styles.metaRow}>
            {anime.type && (
              <View style={styles.metaChip}>
                <Text style={styles.metaChipText}>{anime.type}</Text>
              </View>
            )}
            {anime.episodes && (
              <View style={styles.metaChip}>
                <Text style={styles.metaChipText}>{anime.episodes} épisodes</Text>
              </View>
            )}
            {anime.status && (
              <View style={styles.metaChip}>
                <Text style={styles.metaChipText}>{anime.status}</Text>
              </View>
            )}
          </View>

          {/* Genres */}
          {anime.genres && anime.genres.length > 0 && (
            <View style={styles.genres}>
              {anime.genres.map(g => (
                <View key={g.mal_id} style={styles.genreTag}>
                  <Text style={styles.genreText}>{g.name}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Episode counter for EN_COURS */}
          {libraryAnime?.status === 'EN_COURS' && (
            <View style={styles.episodeCounter}>
              <Text style={styles.episodeLabel}>Progression</Text>
              <View style={styles.episodeControls}>
                <TouchableOpacity style={styles.episodeBtn} onPress={handleEpisodeDecrement}>
                  <Ionicons name="remove" size={20} color={Colors.primary[500]} />
                </TouchableOpacity>
                <Text style={styles.episodeText}>
                  {libraryAnime.currentEpisode || 0} / {libraryAnime.totalEpisodes || anime.episodes || '?'}
                </Text>
                <TouchableOpacity style={styles.episodeBtn} onPress={handleEpisodeIncrement}>
                  <Ionicons name="add" size={20} color={Colors.primary[500]} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            {libraryAnime ? (
              <>
                <Button
                  title={AnimeStatusLabels[libraryAnime.status]}
                  onPress={() => setShowStatusModal(true)}
                  style={{ flex: 1 }}
                  icon="chevron-down"
                />
                <TouchableOpacity style={styles.removeBtn} onPress={handleRemove}>
                  <Ionicons name="trash-outline" size={20} color={Colors.error.main} />
                </TouchableOpacity>
              </>
            ) : (
              <Button title="Ajouter à ma bibliothèque" onPress={() => setShowStatusModal(true)} fullWidth icon="add" />
            )}
          </View>

          {/* Groupe de discussion */}
          <TouchableOpacity
            style={styles.groupBtn}
            onPress={() => navigation.navigate('AnimeGroup', {
              animeId: anime.mal_id,
              animeTitle: anime.title_english || anime.title,
            })}
          >
            <View style={styles.groupBtnContent}>
              <Ionicons name="people" size={22} color={Colors.secondary[500]} />
              <View style={styles.groupBtnText}>
                <Text style={styles.groupBtnTitle}>Groupe de discussion</Text>
                <Text style={styles.groupBtnSubtitle}>{'Discutez avec d\'autres fans'}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.gray[400]} />
          </TouchableOpacity>

          {/* Synopsis */}
          {anime.synopsis && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Synopsis</Text>
              <Text style={styles.synopsis} numberOfLines={expanded ? undefined : 4}>{anime.synopsis}</Text>
              <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                <Text style={styles.expandText}>{expanded ? 'Voir moins' : 'Voir plus'}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Informations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations</Text>
            <View style={styles.infoCard}>
              {anime.studios && anime.studios.length > 0 && (
                <View style={styles.infoRow}>
                  <Ionicons name="business-outline" size={16} color={Colors.text.tertiary} />
                  <Text style={styles.infoLabel}>Studio</Text>
                  <Text style={styles.infoValue}>{anime.studios.map(s => s.name).join(', ')}</Text>
                </View>
              )}
              {anime.aired?.string && (
                <View style={styles.infoRow}>
                  <Ionicons name="calendar-outline" size={16} color={Colors.text.tertiary} />
                  <Text style={styles.infoLabel}>Diffusion</Text>
                  <Text style={styles.infoValue}>{anime.aired.string}</Text>
                </View>
              )}
              {anime.source && (
                <View style={styles.infoRow}>
                  <Ionicons name="book-outline" size={16} color={Colors.text.tertiary} />
                  <Text style={styles.infoLabel}>Source</Text>
                  <Text style={styles.infoValue}>{anime.source}</Text>
                </View>
              )}
              {anime.duration && (
                <View style={styles.infoRow}>
                  <Ionicons name="time-outline" size={16} color={Colors.text.tertiary} />
                  <Text style={styles.infoLabel}>Durée</Text>
                  <Text style={styles.infoValue}>{anime.duration}</Text>
                </View>
              )}
              {anime.rating && (
                <View style={styles.infoRow}>
                  <Ionicons name="shield-outline" size={16} color={Colors.text.tertiary} />
                  <Text style={styles.infoLabel}>Classification</Text>
                  <Text style={styles.infoValue}>{anime.rating}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Note personnelle (privée) */}
          {libraryAnime && (
            <View style={styles.section}>
              <View style={styles.noteSectionHeader}>
                <Text style={styles.sectionTitle}>Note privée</Text>
                <TouchableOpacity onPress={() => setShowNoteModal(true)}>
                  <Ionicons name="create-outline" size={20} color={Colors.primary[500]} />
                </TouchableOpacity>
              </View>
              {libraryAnime.personalNote ? (
                <View style={styles.noteCard}>
                  <Text style={styles.noteText}>{libraryAnime.personalNote}</Text>
                </View>
              ) : (
                <TouchableOpacity style={styles.addNoteBtn} onPress={() => setShowNoteModal(true)}>
                  <Ionicons name="add-circle-outline" size={20} color={Colors.primary[500]} />
                  <Text style={styles.addNoteText}>Ajouter une note privée</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Ma Review */}
          {currentUser && (
            <View style={styles.section}>
              <View style={styles.noteSectionHeader}>
                <Text style={styles.sectionTitle}>Mon avis</Text>
                {myReview && (
                  <View style={styles.reviewHeaderBtns}>
                    <TouchableOpacity onPress={() => setShowReviewModal(true)}>
                      <Ionicons name="create-outline" size={20} color={Colors.primary[500]} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDeleteReview}>
                      <Ionicons name="trash-outline" size={20} color={Colors.error.main} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              {myReview ? (
                <View style={styles.myReviewCard}>
                  <View style={styles.myReviewHeader}>
                    <View style={styles.myReviewRating}>
                      <Ionicons name="star" size={16} color={Colors.rating.star} />
                      <Text style={styles.myReviewRatingText}>{myReview.rating.toFixed(1)}</Text>
                    </View>
                    <View style={[styles.visibilityBadge, myReview.isPublic ? styles.publicBadge : styles.privateBadge]}>
                      <Ionicons
                        name={myReview.isPublic ? 'globe-outline' : 'lock-closed-outline'}
                        size={12}
                        color={myReview.isPublic ? Colors.success.main : Colors.gray[500]}
                      />
                      <Text style={[styles.visibilityText, myReview.isPublic ? styles.publicText : styles.privateText]}>
                        {myReview.isPublic ? 'Public' : 'Privé'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.myReviewContent}>{myReview.content}</Text>
                  {myReview.isPublic && (
                    <View style={styles.myReviewFooter}>
                      <Ionicons name="heart" size={14} color={Colors.error.main} />
                      <Text style={styles.likesCountText}>{myReview.likesCount}{" j'aime"}</Text>
                    </View>
                  )}
                </View>
              ) : (
                <TouchableOpacity style={styles.addReviewBtn} onPress={() => setShowReviewModal(true)}>
                  <Ionicons name="chatbubble-outline" size={20} color={Colors.primary[500]} />
                  <Text style={styles.addNoteText}>Écrire mon avis</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Avis de la communauté */}
          {publicReviews.length > 0 && (
            <View style={styles.section}>
              <View style={styles.noteSectionHeader}>
                <Text style={styles.sectionTitle}>Avis de la communauté ({publicReviews.length})</Text>
                {publicReviews.length > 3 && (
                  <TouchableOpacity onPress={() => setExpandedReviews(!expandedReviews)}>
                    <Text style={styles.expandText}>{expandedReviews ? 'Voir moins' : 'Voir tout'}</Text>
                  </TouchableOpacity>
                )}
              </View>
              {(expandedReviews ? publicReviews : publicReviews.slice(0, 3)).map(review => (
                <View key={review.id} style={styles.communityReviewCard}>
                  <View style={styles.communityReviewHeader}>
                    <TouchableOpacity
                      style={styles.communityReviewUser}
                      onPress={() => navigation.navigate('UserProfile', {
                        userId: review.userId,
                        userPseudo: review.userPseudo,
                        userAvatar: review.userAvatar,
                      })}
                    >
                      <View style={[styles.userAvatar, { backgroundColor: Colors.primary[100] }]}>
                        <Text style={styles.userAvatarText}>
                          {review.userPseudo.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <Text style={styles.reviewUserName}>{review.userPseudo}</Text>
                    </TouchableOpacity>
                    <View style={styles.communityReviewRating}>
                      <Ionicons name="star" size={14} color={Colors.rating.star} />
                      <Text style={styles.communityRatingText}>{review.rating.toFixed(1)}</Text>
                    </View>
                  </View>
                  <Text style={styles.communityReviewContent} numberOfLines={expandedReviews ? undefined : 3}>
                    {review.content}
                  </Text>
                  <View style={styles.communityReviewFooter}>
                    <TouchableOpacity
                      style={styles.likeBtn}
                      onPress={() => handleLikeReview(review.id)}
                    >
                      <Ionicons
                        name={currentUser && review.likedBy.includes(currentUser.id) ? 'heart' : 'heart-outline'}
                        size={18}
                        color={currentUser && review.likedBy.includes(currentUser.id) ? Colors.error.main : Colors.gray[400]}
                      />
                      <Text style={styles.likeBtnText}>{review.likesCount}</Text>
                    </TouchableOpacity>
                    <Text style={styles.reviewDate}>
                      {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Animes similaires */}
          {recommendations.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Animes similaires</Text>
              <FlatList
                horizontal
                data={recommendations}
                keyExtractor={item => item.mal_id.toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recommendationsList}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.recommendationCard}
                    onPress={() => navigation.push('AnimeDetail', { animeId: item.mal_id })}
                  >
                    <Image
                      source={{ uri: item.images?.jpg?.image_url }}
                      style={styles.recommendationImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.recommendationTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
          {loadingRecommendations && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Animes similaires</Text>
              <View style={styles.recommendationsLoading}>
                <Text style={styles.loadingText}>Chargement...</Text>
              </View>
            </View>
          )}

          <View style={{ height: Spacing.xxxl }} />
        </View>
      </ScrollView>

      {/* Status Modal */}
      {showStatusModal && (
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowStatusModal(false)}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{libraryAnime ? 'Modifier le statut' : 'Ajouter à la bibliothèque'}</Text>
            {STATUS_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.key}
                style={[styles.statusOpt, libraryAnime?.status === opt.key && styles.statusOptActive]}
                onPress={() => libraryAnime ? handleUpdate(opt.key) : handleAdd(opt.key)}
              >
                <Ionicons
                  name={opt.icon}
                  size={22}
                  color={libraryAnime?.status === opt.key ? Colors.primary[600] : Colors.text.secondary}
                />
                <Text style={[styles.statusOptText, libraryAnime?.status === opt.key && styles.statusOptTextActive]}>
                  {opt.label}
                </Text>
                {libraryAnime?.status === opt.key && (
                  <Ionicons name="checkmark" size={22} color={Colors.primary[600]} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowRatingModal(false)}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Ma note personnelle</Text>
            <Text style={styles.ratingDisplay}>{tempRating.toFixed(1)}/10</Text>

            {/* Stars row - full stars */}
            <View style={styles.ratingStarsRow}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => {
                const isFull = star <= tempRating;
                const isHalf = !isFull && star - 0.5 <= tempRating && star > tempRating;
                return (
                  <TouchableOpacity
                    key={star}
                    style={styles.starButton}
                    onPress={() => setTempRating(star)}
                    onLongPress={() => setTempRating(star - 0.5)}
                  >
                    <Ionicons
                      name={isFull ? 'star' : isHalf ? 'star-half' : 'star-outline'}
                      size={26}
                      color={isFull || isHalf ? Colors.rating.star : Colors.gray[300]}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Fine-tune slider for 0.5 increments */}
            <View style={styles.ratingSliderContainer}>
              <Text style={styles.ratingSliderLabel}>Ajustement précis (0.5)</Text>
              <View style={styles.ratingSliderRow}>
                <TouchableOpacity
                  style={styles.ratingSliderBtn}
                  onPress={() => setTempRating(Math.max(0, tempRating - 0.5))}
                >
                  <Ionicons name="remove" size={20} color={Colors.primary[500]} />
                </TouchableOpacity>
                <View style={styles.ratingSliderTrack}>
                  <View style={[styles.ratingSliderFill, { width: `${(tempRating / 10) * 100}%` }]} />
                </View>
                <TouchableOpacity
                  style={styles.ratingSliderBtn}
                  onPress={() => setTempRating(Math.min(10, tempRating + 0.5))}
                >
                  <Ionicons name="add" size={20} color={Colors.primary[500]} />
                </TouchableOpacity>
              </View>
              <View style={styles.ratingQuickPicks}>
                {[5, 6, 7, 8, 9, 10].map(quick => (
                  <TouchableOpacity
                    key={quick}
                    style={[styles.quickPickBtn, tempRating === quick && styles.quickPickBtnActive]}
                    onPress={() => setTempRating(quick)}
                  >
                    <Text style={[styles.quickPickText, tempRating === quick && styles.quickPickTextActive]}>{quick}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.ratingActions}>
              <Button title="Annuler" variant="outline" onPress={() => setShowRatingModal(false)} style={{ flex: 1 }} />
              <Button title="Enregistrer" onPress={handleSaveRating} style={{ flex: 1 }} />
            </View>
          </View>
        </TouchableOpacity>
      )}

      {/* Note Modal */}
      {showNoteModal && (
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setShowNoteModal(false)} />
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Note privée</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="Notez vos pensées privées sur cet anime..."
              placeholderTextColor={Colors.gray[400]}
              value={tempNote}
              onChangeText={setTempNote}
              multiline
              numberOfLines={5}
              maxLength={500}
              textAlignVertical="top"
            />
            <Text style={styles.noteCharCount}>{tempNote.length}/500 caractères</Text>
            <View style={styles.ratingActions}>
              <Button title="Annuler" variant="outline" onPress={() => setShowNoteModal(false)} style={{ flex: 1 }} />
              <Button title="Enregistrer" onPress={handleSaveNote} style={{ flex: 1 }} />
            </View>
          </View>
        </KeyboardAvoidingView>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setShowReviewModal(false)} />
          <View style={styles.reviewModal}>
            <Text style={styles.modalTitle}>{myReview ? 'Modifier mon avis' : 'Écrire mon avis'}</Text>

            {/* Rating selector */}
            <View style={styles.reviewRatingSection}>
              <Text style={styles.reviewRatingLabel}>Ma note : {tempReviewRating.toFixed(1)}/10</Text>
              <View style={styles.reviewRatingStars}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => {
                  const isFull = star <= tempReviewRating;
                  const isHalf = !isFull && star - 0.5 <= tempReviewRating && star > tempReviewRating;
                  return (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setTempReviewRating(star)}
                      onLongPress={() => setTempReviewRating(star - 0.5)}
                    >
                      <Ionicons
                        name={isFull ? 'star' : isHalf ? 'star-half' : 'star-outline'}
                        size={24}
                        color={isFull || isHalf ? Colors.rating.star : Colors.gray[300]}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Review content */}
            <TextInput
              style={styles.reviewInput}
              placeholder="Partagez votre avis sur cet anime (2000 caractères max)..."
              placeholderTextColor={Colors.gray[400]}
              value={tempReviewContent}
              onChangeText={setTempReviewContent}
              multiline
              numberOfLines={6}
              maxLength={2000}
              textAlignVertical="top"
            />
            <Text style={styles.noteCharCount}>{tempReviewContent.length}/2000 caractères</Text>

            {/* Visibility toggle */}
            <TouchableOpacity
              style={styles.visibilityToggle}
              onPress={() => setTempReviewIsPublic(!tempReviewIsPublic)}
            >
              <View style={styles.visibilityToggleLeft}>
                <Ionicons
                  name={tempReviewIsPublic ? 'globe-outline' : 'lock-closed-outline'}
                  size={22}
                  color={tempReviewIsPublic ? Colors.success.main : Colors.gray[500]}
                />
                <View>
                  <Text style={styles.visibilityToggleTitle}>
                    {tempReviewIsPublic ? 'Avis public' : 'Avis privé'}
                  </Text>
                  <Text style={styles.visibilityToggleDesc}>
                    {tempReviewIsPublic
                      ? 'Visible par tous les utilisateurs'
                      : 'Visible uniquement par vous'}
                  </Text>
                </View>
              </View>
              <View style={[styles.toggleSwitch, tempReviewIsPublic && styles.toggleSwitchActive]}>
                <View style={[styles.toggleKnob, tempReviewIsPublic && styles.toggleKnobActive]} />
              </View>
            </TouchableOpacity>

            <View style={styles.ratingActions}>
              <Button title="Annuler" variant="outline" onPress={() => setShowReviewModal(false)} style={{ flex: 1 }} />
              <Button title="Enregistrer" onPress={handleSaveReview} style={{ flex: 1 }} />
            </View>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
  imageContainer: { width: screenWidth, height: screenWidth * 1.2, position: 'relative' },
  cover: { width: '100%', height: '100%' },
  gradient: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '60%' },
  headerButtons: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerRightButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: { position: 'absolute', bottom: Spacing.lg, left: Spacing.lg, right: Spacing.lg },
  title: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.white },
  japTitle: { fontSize: FontSize.md, color: Colors.white, opacity: 0.8, marginTop: Spacing.xs },
  content: { padding: Spacing.lg },
  scoresRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  scoreCard: {
    flex: 1,
    backgroundColor: Colors.gray[50],
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  scoreLabel: { fontSize: FontSize.xs, color: Colors.text.secondary },
  scoreValue: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.text.primary },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  metaChip: {
    backgroundColor: Colors.gray[100],
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  metaChipText: { fontSize: FontSize.xs, color: Colors.text.secondary },
  genres: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  genreTag: { backgroundColor: Colors.primary[50], paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.full },
  genreText: { fontSize: FontSize.xs, color: Colors.primary[600], fontWeight: '500' },
  episodeCounter: {
    backgroundColor: Colors.primary[50],
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  episodeLabel: { fontSize: FontSize.sm, color: Colors.primary[600], fontWeight: '600', textAlign: 'center', marginBottom: Spacing.sm },
  episodeControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.lg },
  episodeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  episodeText: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.primary[600], minWidth: 80, textAlign: 'center' },
  actions: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.lg, alignItems: 'center' },
  groupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.secondary[50],
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  groupBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  groupBtnText: {},
  groupBtnTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.secondary[600],
  },
  groupBtnSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.secondary[400],
    marginTop: 2,
  },
  removeBtn: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.error.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: { marginBottom: Spacing.xl },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text.primary, marginBottom: Spacing.md },
  synopsis: { fontSize: FontSize.md, color: Colors.text.secondary, lineHeight: FontSize.md * 1.6 },
  expandText: { fontSize: FontSize.sm, color: Colors.primary[500], fontWeight: '600', marginTop: Spacing.sm },
  infoCard: {
    backgroundColor: Colors.gray[50],
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, gap: Spacing.sm },
  infoLabel: { width: 90, fontSize: FontSize.sm, color: Colors.text.tertiary },
  infoValue: { flex: 1, fontSize: FontSize.sm, color: Colors.text.primary },
  modalOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: Colors.background.primary, borderTopLeftRadius: BorderRadius.xl, borderTopRightRadius: BorderRadius.xl, padding: Spacing.xl, paddingBottom: Spacing.xxxl },
  modalTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.text.primary, marginBottom: Spacing.lg, textAlign: 'center' },
  statusOpt: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  statusOptActive: { backgroundColor: Colors.primary[50] },
  statusOptText: { flex: 1, fontSize: FontSize.md, color: Colors.text.primary },
  statusOptTextActive: { color: Colors.primary[600], fontWeight: '600' },
  ratingDisplay: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.rating.star,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  ratingStarsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 2,
    marginBottom: Spacing.lg,
  },
  starButton: {
    padding: 2,
  },
  ratingSliderContainer: {
    marginBottom: Spacing.xl,
  },
  ratingSliderLabel: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  ratingSliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  ratingSliderBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingSliderTrack: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.gray[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  ratingSliderFill: {
    height: '100%',
    backgroundColor: Colors.rating.star,
    borderRadius: 4,
  },
  ratingQuickPicks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  quickPickBtn: {
    width: 40,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickPickBtnActive: {
    backgroundColor: Colors.primary[500],
  },
  quickPickText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  quickPickTextActive: {
    color: Colors.white,
  },
  ratingActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  recommendationsList: {
    paddingRight: Spacing.lg,
  },
  recommendationCard: {
    width: 120,
    marginRight: Spacing.md,
  },
  recommendationImage: {
    width: 120,
    height: 170,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.gray[200],
  },
  recommendationTitle: {
    fontSize: FontSize.xs,
    color: Colors.text.primary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  recommendationsLoading: {
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
  },
  noteSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  noteCard: {
    backgroundColor: Colors.gray[50],
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary[500],
  },
  noteText: {
    fontSize: FontSize.md,
    color: Colors.text.secondary,
    lineHeight: FontSize.md * 1.5,
  },
  addNoteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.primary[300],
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary[50],
  },
  addNoteText: {
    fontSize: FontSize.md,
    color: Colors.primary[500],
    fontWeight: '500',
  },
  noteInput: {
    backgroundColor: Colors.gray[50],
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.text.primary,
    minHeight: 120,
    marginBottom: Spacing.sm,
  },
  noteCharCount: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    textAlign: 'right',
    marginBottom: Spacing.lg,
  },
  // Review styles
  reviewHeaderBtns: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  myReviewCard: {
    backgroundColor: Colors.gray[50],
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.secondary[500],
  },
  myReviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  myReviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  myReviewRatingText: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  visibilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  publicBadge: {
    backgroundColor: Colors.success.light,
  },
  privateBadge: {
    backgroundColor: Colors.gray[100],
  },
  visibilityText: {
    fontSize: FontSize.xs,
    fontWeight: '500',
  },
  publicText: {
    color: Colors.success.main,
  },
  privateText: {
    color: Colors.gray[500],
  },
  myReviewContent: {
    fontSize: FontSize.md,
    color: Colors.text.secondary,
    lineHeight: FontSize.md * 1.5,
  },
  myReviewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  likesCountText: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
  },
  addReviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.secondary[300],
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.secondary[50],
  },
  communityReviewCard: {
    backgroundColor: Colors.gray[50],
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  communityReviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  communityReviewUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.primary[600],
  },
  reviewUserName: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  communityReviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  communityRatingText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  communityReviewContent: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    lineHeight: FontSize.sm * 1.5,
  },
  communityReviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  likeBtnText: {
    fontSize: FontSize.xs,
    color: Colors.gray[500],
  },
  reviewDate: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
  },
  // Review Modal
  reviewModal: {
    backgroundColor: Colors.background.primary,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    maxHeight: '90%',
  },
  reviewRatingSection: {
    marginBottom: Spacing.lg,
  },
  reviewRatingLabel: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  reviewRatingStars: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 2,
  },
  reviewInput: {
    backgroundColor: Colors.gray[50],
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.text.primary,
    minHeight: 150,
    marginBottom: Spacing.sm,
  },
  visibilityToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.gray[50],
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  visibilityToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  visibilityToggleTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  visibilityToggleDesc: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  toggleSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.gray[300],
    justifyContent: 'center',
    padding: 2,
  },
  toggleSwitchActive: {
    backgroundColor: Colors.success.main,
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.white,
  },
  toggleKnobActive: {
    alignSelf: 'flex-end',
  },
});
