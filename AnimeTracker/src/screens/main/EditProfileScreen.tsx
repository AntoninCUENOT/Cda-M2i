import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateProfile } from '../../store/slices/authSlice';
import { Input, Button } from '../../components';
import { useTheme } from '../../contexts/ThemeContext';
import { Spacing, FontSize, BorderRadius } from '../../utils/constants';

const AVATARS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { user } = useAppSelector(state => state.auth);

  const AVATAR_COLORS = [
    colors.primary[500],
    colors.secondary[500],
    colors.success.main,
    colors.warning.main,
    colors.error.main,
    '#9333EA', // purple
    '#EC4899', // pink
    '#14B8A6', // teal
  ];

  const [pseudo, setPseudo] = useState(user?.pseudo || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [selectedAvatar, setSelectedAvatar] = useState(typeof user?.avatar === 'number' ? user.avatar : 0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!pseudo.trim()) {
      Alert.alert('Erreur', 'Le pseudo est obligatoire');
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(updateProfile({ pseudo: pseudo.trim(), bio: bio.trim() }));
      Alert.alert('Succès', 'Profil mis à jour avec succès', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch {
      Alert.alert('Erreur', 'Impossible de mettre à jour le profil');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background.secondary }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Status bar background */}
      <View style={[styles.statusBarBg, { height: insets.top, backgroundColor: colors.background.primary }]} />

      {/* Header */}
      <LinearGradient
        colors={[colors.primary[700], colors.primary[500], colors.secondary[400]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Modifier le profil</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Avatar selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Avatar</Text>
          <View style={styles.avatarGrid}>
            {AVATARS.map((letter, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.avatarOption,
                  { backgroundColor: AVATAR_COLORS[index] },
                  selectedAvatar === index && { borderWidth: 3, borderColor: colors.text.primary }
                ]}
                onPress={() => setSelectedAvatar(index)}
              >
                <Text style={styles.avatarLetter}>{letter}</Text>
                {selectedAvatar === index && (
                  <View style={[styles.checkmark, { backgroundColor: colors.success.main }]}>
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pseudo */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Pseudo</Text>
          <Input
            placeholder="Votre pseudo"
            value={pseudo}
            onChangeText={setPseudo}
            autoCapitalize="none"
            maxLength={20}
          />
          <Text style={[styles.charCount, { color: colors.text.tertiary }]}>{pseudo.length}/20 caractères</Text>
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Bio</Text>
          <Input
            placeholder="Parlez-nous de vous..."
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            maxLength={150}
            style={{ height: 100, textAlignVertical: 'top', paddingTop: Spacing.md }}
          />
          <Text style={[styles.charCount, { color: colors.text.tertiary }]}>{bio.length}/150 caractères</Text>
        </View>

        {/* Preview */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Aperçu</Text>
          <View style={[styles.previewCard, { backgroundColor: colors.card }]}>
            <View style={[styles.previewAvatar, { backgroundColor: AVATAR_COLORS[selectedAvatar] }]}>
              <Text style={styles.previewAvatarText}>{AVATARS[selectedAvatar]}</Text>
            </View>
            <View style={styles.previewInfo}>
              <Text style={[styles.previewPseudo, { color: colors.text.primary }]}>{pseudo || 'Pseudo'}</Text>
              <Text style={[styles.previewBio, { color: colors.text.secondary }]} numberOfLines={2}>{bio || 'Aucune bio'}</Text>
            </View>
          </View>
        </View>

        {/* Save button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Enregistrer les modifications"
            onPress={handleSave}
            loading={isLoading}
            fullWidth
          />
        </View>

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  statusBarBg: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  placeholder: { width: 40 },
  content: { flex: 1, padding: Spacing.lg },
  section: { marginBottom: Spacing.xl },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  avatarOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarLetter: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  checkmark: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  charCount: {
    fontSize: FontSize.xs,
    textAlign: 'right',
    marginTop: Spacing.xs,
  },
  previewCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  previewAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewAvatarText: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  previewInfo: {
    flex: 1,
  },
  previewPseudo: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  previewBio: {
    fontSize: FontSize.sm,
    marginTop: Spacing.xs,
  },
  buttonContainer: {
    marginTop: Spacing.lg,
  },
});
