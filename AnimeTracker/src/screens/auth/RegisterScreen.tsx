import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { register, clearError } from '../../store/slices/authSlice';
import { Button, Input } from '../../components';
import Colors from '../../utils/colors';
import { Spacing, FontSize, BorderRadius } from '../../utils/constants';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.auth);

  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!pseudo || pseudo.length < 3) e.pseudo = '3 caractères minimum';
    else if (!/^[a-zA-Z0-9_-]+$/.test(pseudo)) e.pseudo = 'Lettres, chiffres, _ et - uniquement';
    if (!email || !/\S+@\S+\.\S+/.test(email)) e.email = 'Email invalide';
    if (!password || password.length < 8) e.password = '8 caractères minimum';
    if (password !== confirm) e.confirm = 'Les mots de passe ne correspondent pas';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = () => {
    if (validate()) {
      dispatch(clearError());
      dispatch(register({ email, password, pseudo }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
            <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
          </TouchableOpacity>

          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>Rejoignez AnimeTracker</Text>

          {error && <View style={styles.errorBanner}><Text style={styles.errorText}>{error}</Text></View>}

          <Input label="Pseudo" placeholder="Votre pseudo" value={pseudo} onChangeText={setPseudo} autoCapitalize="none" error={errors.pseudo} />
          <Input label="Email" placeholder="votre@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" error={errors.email} />
          <Input label="Mot de passe" placeholder="Créer un mot de passe" value={password} onChangeText={setPassword} isPassword error={errors.password} />
          <Input label="Confirmer" placeholder="Confirmez le mot de passe" value={confirm} onChangeText={setConfirm} isPassword error={errors.confirm} />

          <Button title="S'inscrire" onPress={handleRegister} loading={isLoading} fullWidth style={{ marginTop: Spacing.lg }} />

          <View style={styles.loginLink}>
            <Text style={styles.linkText}>Déjà un compte ? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.linkButton}>Se connecter</Text></TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
  scroll: { flexGrow: 1, padding: Spacing.xl },
  back: { width: 40, height: 40, justifyContent: 'center', marginBottom: Spacing.lg },
  title: { fontSize: FontSize.largeTitle, fontWeight: '700', color: Colors.text.primary },
  subtitle: { fontSize: FontSize.md, color: Colors.text.secondary, marginBottom: Spacing.xxl },
  errorBanner: { backgroundColor: Colors.error.light, padding: Spacing.md, borderRadius: BorderRadius.md, marginBottom: Spacing.lg },
  errorText: { color: Colors.error.dark, fontSize: FontSize.sm, textAlign: 'center' },
  loginLink: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.xl },
  linkText: { color: Colors.text.secondary, fontSize: FontSize.md },
  linkButton: { color: Colors.primary[500], fontSize: FontSize.md, fontWeight: '600' },
});
