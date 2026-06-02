import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store';
import { login, clearError } from '../../store/slices/authSlice';
import { Button, Input } from '../../components';
import Colors from '../../utils/colors';
import { Spacing, FontSize, BorderRadius } from '../../utils/constants';

type LoginNav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginNav>();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validate = () => {
    let valid = true;
    setEmailError(''); setPasswordError('');
    if (!email || !/\S+@\S+\.\S+/.test(email)) { setEmailError('Email invalide'); valid = false; }
    if (!password || password.length < 6) { setPasswordError('6 caractères minimum'); valid = false; }
    return valid;
  };

  const handleLogin = () => {
    if (validate()) {
      dispatch(clearError());
      dispatch(login({ email, password }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={styles.logo}><Text style={styles.logoText}>AT</Text></View>
            <Text style={styles.title}>AnimeTracker</Text>
            <Text style={styles.subtitle}>Suivez vos animes préférés</Text>
          </View>

          <View style={styles.form}>
            {error && <View style={styles.errorBanner}><Text style={styles.errorBannerText}>{error}</Text></View>}
            <Input label="Email" placeholder="votre@email.com" value={email} onChangeText={setEmail}
              keyboardType="email-address" autoCapitalize="none" error={emailError} />
            <Input label="Mot de passe" placeholder="Votre mot de passe" value={password}
              onChangeText={setPassword} isPassword error={passwordError} />
            <Button title="Se connecter" onPress={handleLogin} loading={isLoading} fullWidth style={{ marginTop: Spacing.lg }} />
            <View style={styles.separator}><View style={styles.line} /><Text style={styles.sepText}>ou</Text><View style={styles.line} /></View>
            <Button title="Créer un compte" onPress={() => navigation.navigate('Register')} variant="outline" fullWidth />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
  scroll: { flexGrow: 1, padding: Spacing.xl },
  header: { alignItems: 'center', marginVertical: Spacing.xxxl },
  logo: { width: 80, height: 80, borderRadius: BorderRadius.xl, backgroundColor: Colors.primary[500], alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg },
  logoText: { fontSize: 32, fontWeight: '700', color: Colors.white },
  title: { fontSize: FontSize.largeTitle, fontWeight: '700', color: Colors.text.primary },
  subtitle: { fontSize: FontSize.md, color: Colors.text.secondary, marginTop: Spacing.xs },
  form: { flex: 1 },
  errorBanner: { backgroundColor: Colors.error.light, padding: Spacing.md, borderRadius: BorderRadius.md, marginBottom: Spacing.lg },
  errorBannerText: { color: Colors.error.dark, fontSize: FontSize.sm, textAlign: 'center' },
  separator: { flexDirection: 'row', alignItems: 'center', marginVertical: Spacing.xl },
  line: { flex: 1, height: 1, backgroundColor: Colors.border.light },
  sepText: { paddingHorizontal: Spacing.md, color: Colors.text.secondary, fontSize: FontSize.sm },
});
