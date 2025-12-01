import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppContext, ROLE_CONFIG } from './context/AppContext';
import { validateEmail, validatePhone } from './utils/validation';

const MODE = {
  LOGIN: 'login',
  SIGNUP: 'signup',
};

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [mode, setMode] = useState(MODE.LOGIN);
  const [selectedRole, setSelectedRole] = useState('user');
  const navigation = useNavigation();
  const { signIn, switchRole } = useAppContext();
  const roleKeys = useMemo(() => Object.keys(ROLE_CONFIG), []);

  const formValid = useMemo(() => {
    if (mode === MODE.LOGIN) {
      return username.trim().length > 0 && password.trim().length >= 6;
    }

    return (
      fullName.trim().length > 2 &&
      validateEmail(email) &&
      validatePhone(phone) &&
      password.trim().length >= 8
    );
  }, [email, fullName, mode, password, phone, username]);

  const handleLogin = () => {
    if (!formValid) {
      Alert.alert('Missing details', 'Please fill out all required fields.');
      return;
    }

    if (mode === MODE.LOGIN) {
      signIn({ name: username.trim(), email: `${username.replace(/\s/g, '').toLowerCase()}@swiftsend.app` });
    } else {
      signIn({ name: fullName.trim(), email: email.trim() });
    }
    switchRole(selectedRole);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  const handleRecovery = () => {
    Alert.alert('Password recovery', 'We sent recovery instructions to your email and phone.');
  };

  const renderRoleSelector = () => (
    <View style={styles.roleContainer}>
      <Text style={styles.roleLabel}>Choose your role</Text>
      <View style={styles.roleSelector}>
        {roleKeys.map((role) => (
          <TouchableOpacity
            key={role}
            style={[styles.roleChip, selectedRole === role && styles.roleChipActive]}
            onPress={() => setSelectedRole(role)}
          >
            <Text style={[styles.roleChipText, selectedRole === role && styles.roleChipTextActive]}>
              {ROLE_CONFIG[role].label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <ImageBackground source={require('./assets/background.png')} style={styles.backgroundImage} resizeMode="cover">
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.logoArea}>
              <Image source={require('./assets/icon.png')} style={styles.logo} />
              <Text style={styles.appTitle}>SwiftSend</Text>
              <Text style={styles.appSubtitle}>Move money safely in seconds</Text>
            </View>

            <View style={styles.switchRow}>
              <TouchableOpacity
                style={[styles.switchButton, mode === MODE.LOGIN && styles.switchButtonActive]}
                onPress={() => setMode(MODE.LOGIN)}
              >
                <Text style={[styles.switchText, mode === MODE.LOGIN && styles.switchTextActive]}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.switchButton, mode === MODE.SIGNUP && styles.switchButtonActive]}
                onPress={() => setMode(MODE.SIGNUP)}
              >
                <Text style={[styles.switchText, mode === MODE.SIGNUP && styles.switchTextActive]}>Sign up</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              {mode === MODE.LOGIN ? (
                <>
                  <Text style={styles.title}>Welcome back</Text>
                  <Text style={styles.subtitle}>Log in to access your dashboard.</Text>
                  {renderRoleSelector()}
                  <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#9ca3af"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Password (min 6 characters)"
                    placeholderTextColor="#9ca3af"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                  <TouchableOpacity onPress={handleRecovery} style={styles.recoveryLink}>
                    <Text style={styles.recoveryText}>Forgot password?</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.title}>Create account</Text>
                  <Text style={styles.subtitle}>Set up a profile to start sending and receiving.</Text>
                  {renderRoleSelector()}
                  <TextInput
                    style={styles.input}
                    placeholder="Full name"
                    placeholderTextColor="#9ca3af"
                    value={fullName}
                    onChangeText={setFullName}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Email address"
                    placeholderTextColor="#9ca3af"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Phone number"
                    placeholderTextColor="#9ca3af"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Password (min 8 characters)"
                    placeholderTextColor="#9ca3af"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </>
              )}

              <TouchableOpacity
                style={[styles.loginButton, !formValid && styles.loginButtonDisabled]}
                onPress={handleLogin}
                activeOpacity={0.85}
                disabled={!formValid}
              >
                <Text style={styles.loginButtonText}>{mode === MODE.LOGIN ? 'Login' : 'Create account'}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(4, 12, 33, 0.55)',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 18,
  },
  logo: {
    width: 92,
    height: 92,
    marginBottom: 8,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
  },
  appSubtitle: {
    color: '#e2e8f0',
    marginTop: 4,
  },
  switchRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    padding: 4,
    marginBottom: 12,
  },
  switchButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  switchButtonActive: {
    backgroundColor: '#fff',
  },
  switchText: {
    color: '#cbd5e1',
    fontWeight: '600',
  },
  switchTextActive: {
    color: '#0f172a',
  },
  formContainer: {
    width: '100%',
    maxWidth: 480,
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  roleContainer: {
    marginTop: 6,
    marginBottom: 12,
  },
  roleLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  roleSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  roleChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    margin: 4,
    backgroundColor: '#f8fafc',
  },
  roleChipActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  roleChipText: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '700',
  },
  roleChipTextActive: {
    color: '#fff',
  },
  input: {
    width: '100%',
    height: 52,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 12,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#f8fafc',
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  recoveryLink: {
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
  recoveryText: {
    color: '#2563eb',
    fontWeight: '600',
  },
});

export default LoginScreen;
