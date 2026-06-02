import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList } from '../../navigation/types';
import { useTheme } from '../../contexts/ThemeContext';
import { Spacing, FontSize, BorderRadius } from '../../utils/constants';
import apiClient from '../../services/apiClient';

type NewMessageNav = NativeStackNavigationProp<MainStackParamList>;

interface SearchUser {
  id_user: string;
  pseudo: string;
  photo: string | null;
}

export default function NewMessageScreen() {
  const navigation = useNavigation<NewMessageNav>();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const { data } = await apiClient.get<{ success: boolean; data: SearchUser[] }>(
          `/users/search?q=${encodeURIComponent(searchQuery)}`
        );
        setResults(data.data);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const AVATAR_COLORS = [
    colors.primary[500], colors.secondary[500], colors.success.main,
    colors.warning.main, colors.error.main, '#9333EA', '#EC4899', '#14B8A6',
  ];

  const getAvatarColor = (pseudo: string) => {
    const index = pseudo.charCodeAt(0) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
  };

  const handleSelectUser = (user: SearchUser) => {
    navigation.replace('Chat', {
      recipientId: user.id_user,
      recipientPseudo: user.pseudo,
      recipientAvatar: user.photo ?? null,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
      <View style={[styles.header, { backgroundColor: colors.card, paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Nouveau message</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBox, { backgroundColor: colors.card }]}>
          <Ionicons name="search" size={20} color={colors.gray[400]} />
          <TextInput
            style={[styles.searchInput, { color: colors.text.primary }]}
            placeholder="Rechercher un utilisateur..."
            placeholderTextColor={colors.gray[400]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.gray[400]} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.usersList}>
        <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
          {searchQuery.length >= 2 ? 'Résultats' : 'Tapez au moins 2 caractères'}
        </Text>

        {isLoading ? (
          <ActivityIndicator color={colors.primary[500]} style={{ marginTop: Spacing.xl }} />
        ) : (
          <FlatList
            data={results}
            keyExtractor={item => item.id_user}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.userCard, { backgroundColor: colors.card }]}
                onPress={() => handleSelectUser(item)}
              >
                <View style={[styles.userAvatar, { backgroundColor: getAvatarColor(item.pseudo) }]}>
                  <Text style={styles.userAvatarText}>{item.pseudo.charAt(0).toUpperCase()}</Text>
                </View>
                <Text style={[styles.userName, { color: colors.text.primary }]}>{item.pseudo}</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              searchQuery.length >= 2 ? (
                <View style={styles.noResults}>
                  <Ionicons name="person-outline" size={48} color={colors.gray[300]} />
                  <Text style={[styles.noResultsText, { color: colors.text.secondary }]}>
                    Aucun utilisateur trouvé
                  </Text>
                </View>
              ) : null
            }
          />
        )}
      </View>
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
  backBtn: { padding: Spacing.sm },
  headerTitle: { fontSize: FontSize.lg, fontWeight: '600' },
  placeholder: { width: 40 },
  searchContainer: { padding: Spacing.md },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 48,
    gap: Spacing.sm,
  },
  searchInput: { flex: 1, fontSize: FontSize.md },
  usersList: { padding: Spacing.md, flex: 1 },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: { fontSize: FontSize.lg, fontWeight: '700', color: '#FFFFFF' },
  userName: { flex: 1, fontSize: FontSize.md, fontWeight: '500', marginLeft: Spacing.md },
  noResults: { alignItems: 'center', paddingVertical: Spacing.xxxl },
  noResultsText: { fontSize: FontSize.md, marginTop: Spacing.md },
});
