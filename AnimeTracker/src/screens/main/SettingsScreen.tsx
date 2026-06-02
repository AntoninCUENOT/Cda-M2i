import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Modal, TextInput, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList } from '../../navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout, deleteAccount } from '../../store/slices/authSlice';
import { saveSettings } from '../../store/slices/settingsSlice';
import { useTheme, ThemeColors } from '../../contexts/ThemeContext';
import { Spacing, FontSize, BorderRadius, Shadows } from '../../utils/constants';

type SettingItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  showArrow?: boolean;
  danger?: boolean;
  colors: ThemeColors;
};

const SettingItem: React.FC<SettingItemProps> = ({ icon, label, value, onPress, showArrow = true, danger = false, colors }) => (
  <TouchableOpacity
    style={[styles.settingItem, { borderBottomColor: colors.border.light }]}
    onPress={onPress}
    disabled={!onPress}
  >
    <View style={[styles.settingIcon, { backgroundColor: danger ? colors.error.light : colors.primary[50] }]}>
      <Ionicons name={icon} size={20} color={danger ? colors.error.main : colors.primary[500]} />
    </View>
    <Text style={[styles.settingLabel, { color: danger ? colors.error.main : colors.text.primary }]}>{label}</Text>
    {value && <Text style={[styles.settingValue, { color: colors.text.secondary }]}>{value}</Text>}
    {showArrow && onPress && (
      <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
    )}
  </TouchableOpacity>
);

type SettingToggleProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: boolean;
  onToggle: (value: boolean) => void;
  colors: ThemeColors;
};

const SettingToggle: React.FC<SettingToggleProps> = ({ icon, label, value, onToggle, colors }) => (
  <View style={[styles.settingItem, { borderBottomColor: colors.border.light }]}>
    <View style={[styles.settingIcon, { backgroundColor: colors.primary[50] }]}>
      <Ionicons name={icon} size={20} color={colors.primary[500]} />
    </View>
    <Text style={[styles.settingLabel, { color: colors.text.primary }]}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: colors.gray[300], true: colors.primary[300] }}
      thumbColor={value ? colors.primary[500] : colors.gray[100]}
    />
  </View>
);

type SettingsNav = NativeStackNavigationProp<MainStackParamList>;

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsNav>();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const { darkMode, notifications, autoPlayTrailers } = useAppSelector(state => state.settings);
  const { isLoading } = useAppSelector(state => state.auth);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const CONFIRM_WORD = 'SUPPRIMER';

  const handleToggleDarkMode = (value: boolean) => {
    dispatch(saveSettings({ darkMode: value }));
  };

  const handleToggleNotifications = (value: boolean) => {
    dispatch(saveSettings({ notifications: value }));
  };

  const handleToggleAutoPlay = (value: boolean) => {
    dispatch(saveSettings({ autoPlayTrailers: value }));
  };

  const handleClearCache = () => {
    Alert.alert(
      'Vider le cache',
      'Êtes-vous sûr de vouloir vider le cache de l\'application ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Succès', 'Le cache a été vidé avec succès.');
            } catch {
              Alert.alert('Erreur', 'Impossible de vider le cache.');
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    setDeleteConfirmText('');
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = async () => {
    if (deleteConfirmText !== CONFIRM_WORD) {
      Alert.alert('Erreur', `Veuillez taper "${CONFIRM_WORD}" pour confirmer.`);
      return;
    }

    setShowDeleteModal(false);
    const result = await dispatch(deleteAccount());

    if (deleteAccount.fulfilled.match(result)) {
      // La navigation vers l'écran de connexion se fera automatiquement
      // car isAuthenticated passera à false
    } else {
      Alert.alert('Erreur', 'Impossible de supprimer le compte. Veuillez réessayer.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          onPress: () => dispatch(logout()),
        },
      ]
    );
  };

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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Paramètres</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Compte */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>Compte</Text>
          <View style={[styles.sectionContent, { backgroundColor: colors.card }, Shadows.sm]}>
            <SettingItem
              icon="person-outline"
              label="Modifier le profil"
              onPress={() => navigation.navigate('EditProfile')}
              colors={colors}
            />
            <SettingItem
              icon="lock-closed-outline"
              label="Changer le mot de passe"
              onPress={() => Alert.alert('Info', 'Fonctionnalité à venir')}
              colors={colors}
            />
            <SettingItem
              icon="mail-outline"
              label="Changer l'email"
              onPress={() => Alert.alert('Info', 'Fonctionnalité à venir')}
              colors={colors}
            />
          </View>
        </View>

        {/* Préférences */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>Préférences</Text>
          <View style={[styles.sectionContent, { backgroundColor: colors.card }, Shadows.sm]}>
            <SettingToggle
              icon="notifications-outline"
              label="Notifications"
              value={notifications}
              onToggle={handleToggleNotifications}
              colors={colors}
            />
            <SettingToggle
              icon="moon-outline"
              label="Mode sombre"
              value={darkMode}
              onToggle={handleToggleDarkMode}
              colors={colors}
            />
            <SettingToggle
              icon="play-outline"
              label="Lecture auto des bandes-annonces"
              value={autoPlayTrailers}
              onToggle={handleToggleAutoPlay}
              colors={colors}
            />
          </View>
        </View>

        {/* Données */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>Données</Text>
          <View style={[styles.sectionContent, { backgroundColor: colors.card }, Shadows.sm]}>
            <SettingItem
              icon="cloud-download-outline"
              label="Exporter mes données"
              onPress={() => Alert.alert('Info', 'Fonctionnalité à venir')}
              colors={colors}
            />
            <SettingItem
              icon="trash-outline"
              label="Vider le cache"
              onPress={handleClearCache}
              colors={colors}
            />
          </View>
        </View>

        {/* À propos */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>À propos</Text>
          <View style={[styles.sectionContent, { backgroundColor: colors.card }, Shadows.sm]}>
            <SettingItem
              icon="information-circle-outline"
              label="Version"
              value="1.0.0"
              showArrow={false}
              colors={colors}
            />
            <SettingItem
              icon="document-text-outline"
              label="Conditions d'utilisation"
              onPress={() => Alert.alert('Info', 'Fonctionnalité à venir')}
              colors={colors}
            />
            <SettingItem
              icon="shield-checkmark-outline"
              label="Politique de confidentialité"
              onPress={() => Alert.alert('Info', 'Fonctionnalité à venir')}
              colors={colors}
            />
            <SettingItem
              icon="help-circle-outline"
              label="Aide et support"
              onPress={() => Alert.alert('Info', 'Fonctionnalité à venir')}
              colors={colors}
            />
          </View>
        </View>

        {/* Actions dangereuses */}
        <View style={styles.section}>
          <View style={[styles.sectionContent, { backgroundColor: colors.card }, Shadows.sm]}>
            <SettingItem
              icon="log-out-outline"
              label="Se déconnecter"
              onPress={handleLogout}
              showArrow={false}
              danger
              colors={colors}
            />
            <SettingItem
              icon="trash-outline"
              label="Supprimer mon compte"
              onPress={handleDeleteAccount}
              showArrow={false}
              danger
              colors={colors}
            />
          </View>
        </View>

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>

      {/* Modal de confirmation de suppression */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={[styles.modalIconContainer, { backgroundColor: colors.error.light }]}>
              <Ionicons name="warning" size={40} color={colors.error.main} />
            </View>

            <Text style={[styles.modalTitle, { color: colors.error.main }]}>
              Supprimer mon compte
            </Text>

            <Text style={[styles.modalDescription, { color: colors.text.secondary }]}>
              Cette action est irréversible. Toutes vos données seront définitivement supprimées :
            </Text>

            <View style={styles.modalList}>
              <Text style={[styles.modalListItem, { color: colors.text.primary }]}>
                {"• Votre bibliothèque d'animes"}
              </Text>
              <Text style={[styles.modalListItem, { color: colors.text.primary }]}>
                • Vos avis et notes
              </Text>
              <Text style={[styles.modalListItem, { color: colors.text.primary }]}>
                • Vos messages et conversations
              </Text>
              <Text style={[styles.modalListItem, { color: colors.text.primary }]}>
                • Vos abonnés et abonnements
              </Text>
            </View>

            <Text style={[styles.modalConfirmLabel, { color: colors.text.primary }]}>
              {'Tapez "' + CONFIRM_WORD + '" pour confirmer :'}
            </Text>

            <TextInput
              style={[
                styles.modalInput,
                {
                  backgroundColor: colors.background.secondary,
                  color: colors.text.primary,
                  borderColor: deleteConfirmText === CONFIRM_WORD ? colors.error.main : colors.border.light,
                },
              ]}
              value={deleteConfirmText}
              onChangeText={setDeleteConfirmText}
              placeholder={CONFIRM_WORD}
              placeholderTextColor={colors.text.tertiary}
              autoCapitalize="characters"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton, { borderColor: colors.border.light }]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text.primary }]}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.modalDeleteButton,
                  {
                    backgroundColor: deleteConfirmText === CONFIRM_WORD ? colors.error.main : colors.gray[300],
                  },
                ]}
                onPress={confirmDeleteAccount}
                disabled={deleteConfirmText !== CONFIRM_WORD || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.modalDeleteButtonText}>Supprimer</Text>
                )}
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
  content: { flex: 1 },
  section: { marginTop: Spacing.lg },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  sectionContent: {
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  settingLabel: {
    flex: 1,
    fontSize: FontSize.md,
  },
  settingValue: {
    fontSize: FontSize.sm,
    marginRight: Spacing.sm,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: FontSize.md,
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: 22,
  },
  modalList: {
    alignSelf: 'stretch',
    marginBottom: Spacing.lg,
  },
  modalListItem: {
    fontSize: FontSize.sm,
    marginVertical: Spacing.xs,
  },
  modalConfirmLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    alignSelf: 'stretch',
  },
  modalInput: {
    width: '100%',
    height: 48,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.md,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: Spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelButton: {
    borderWidth: 1,
  },
  modalDeleteButton: {},
  modalButtonText: {
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  modalDeleteButtonText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
