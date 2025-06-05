import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import theme
import theme from '../theme';

// Mock API call for authentication (to be replaced with actual API calls)
const mockAuthenticate = async (email, password, isLogin) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, accept any well-formed email and password >= 8 chars
  if (!email.includes('@') || password.length < 8) {
    throw new Error(isLogin ? 'Invalid credentials' : 'Invalid email or password too short');
  }
  
  // Return mock token
  return { token: 'mock-jwt-token-' + Date.now(), user: { email, displayName: email.split('@')[0] } };
};

const AuthScreen = ({ setIsLoggedIn }) => {
  const { t, i18n } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAuth = async () => {
    if (isLoading) return;
    
    // Validate inputs
    if (!email || !password) {
      Alert.alert(t('error'), t('requiredField'));
      return;
    }
    
    if (!isLogin && password !== confirmPassword) {
      Alert.alert(t('error'), t('passwordMatch'));
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await mockAuthenticate(email, password, isLogin);
      
      // Save auth token
      await AsyncStorage.setItem('authToken', response.token);
      
      // Update auth state in parent component
      setIsLoggedIn(true);
    } catch (error) {
      Alert.alert(t('error'), error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    // Clear fields when switching modes
    setPassword('');
    setConfirmPassword('');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* App Logo/Branding */}
          <View style={styles.logoContainer}>
            <Text style={styles.appName}>{t('appName')}</Text>
            <Image 
              source={require('../assets/placeholder.svg')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          {/* Auth Form */}
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>
              {isLogin ? t('login') : t('register')}
            </Text>
            
            {/* Email Input */}
            <TextInput
              style={styles.input}
              placeholder={t('email')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            {/* Display Name (Register only) */}
            {!isLogin && (
              <TextInput
                style={styles.input}
                placeholder={t('displayName')}
                value={displayName}
                onChangeText={setDisplayName}
              />
            )}
            
            {/* Password Input */}
            <TextInput
              style={styles.input}
              placeholder={t('password')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            
            {/* Confirm Password (Register only) */}
            {!isLogin && (
              <TextInput
                style={styles.input}
                placeholder={t('confirmPassword')}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            )}
            
            {/* Submit Button */}
            <TouchableOpacity 
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleAuth}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading 
                  ? t('loading')
                  : isLogin ? t('signIn') : t('signUp')}
              </Text>
            </TouchableOpacity>
            
            {/* Toggle Login/Register */}
            <TouchableOpacity 
              style={styles.toggleContainer}
              onPress={toggleAuthMode}
            >
              <Text style={styles.toggleText}>
                {isLogin ? t('noAccount') : t('haveAccount')}
              </Text>
              <Text style={styles.toggleAction}>
                {isLogin ? t('signUp') : t('signIn')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.main,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logo: {
    width: 120,
    height: 120,
  },
  appName: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  formContainer: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  formTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  input: {
    backgroundColor: theme.colors.background.main,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: theme.colors.text.light,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
  },
  toggleText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
  },
  toggleAction: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    marginLeft: theme.spacing.xs,
  },
});

export default AuthScreen;