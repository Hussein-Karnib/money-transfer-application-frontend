import React from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { refreshAppData, refreshing } = useAppContext();

  const handleGetStarted = () => {
    navigation.navigate('Auth');
  };

  return (
    <ImageBackground source={require('../assets/background.png')} style={styles.background}>
      <LinearGradient colors={['rgba(10,25,47,0.75)', 'rgba(10,25,47,0.85)']} style={styles.overlay}>
        <SafeAreaView
          style={[
            styles.container,
            { paddingTop: insets.top, paddingBottom: insets.bottom },
          ]}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            refreshControl={
              <RefreshControl
                refreshing={!!refreshing}
                onRefresh={refreshAppData}
                tintColor="#fff"
                colors={['#ffffff']}
              />
            }
          >
            <View style={styles.logoContainer}>
              <Image source={require('../assets/icon.png')} style={styles.logo} />
              <Text style={styles.title}>SwiftSend</Text>
              <Text style={styles.subtitle}>Fast. Secure. Mobile-first money transfers.</Text>
            </View>

            <View style={styles.callout}>
              <Text style={styles.calloutTitle}>Why SwiftSend?</Text>
              <Text style={styles.calloutText}>• Instant peer-to-peer transfers</Text>
              <Text style={styles.calloutText}>• Built-in support and education</Text>
              <Text style={styles.calloutText}>• Data validation & encrypted payloads</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.primaryButton} onPress={handleGetStarted}>
                <Text style={styles.primaryButtonText}>Log in / Sign up</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Main')}>
                <Text style={styles.secondaryButtonText}>Explore dashboard</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  logoContainer: { alignItems: 'center', marginTop: 40 },
  logo: { width: 120, height: 120, marginBottom: 16 },
  title: { color: '#fff', fontSize: 36, fontWeight: '700' },
  subtitle: { color: '#e3f2fd', fontSize: 16, marginTop: 8, textAlign: 'center' },
  callout: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  calloutTitle: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 8 },
  calloutText: { color: '#e3f2fd', fontSize: 16, marginVertical: 2 },
  actions: { marginBottom: 40 },
  primaryButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
  },
  secondaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '500' },
});

export default WelcomeScreen;

