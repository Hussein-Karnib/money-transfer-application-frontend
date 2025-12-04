import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  Alert,
  Modal,
  Dimensions,
  RefreshControl,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import Bar from '../MoreStuff/bar';
import { useAppContext, ROLE_CONFIG } from '../context/AppContext';
import { resetToAuth } from '../navigation/navigationRef';

export default function Settings() {
  const [modalVisible, setModalVisible] = useState(false);
  const { user, role, switchRole, signOut, refreshAppData, refreshing } = useAppContext();
  const [profileImage, setProfileImage] = useState(null);
  const insets = useSafeAreaInsets();

  // Request permission
  const requestPermission = async (mode) => {
    try {
      if (mode === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        return status === 'granted';
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        return status === 'granted';
      }
    } catch (e) {
      Alert.alert('Error', 'Permission request failed: ' + e.message);
      return false;
    }
  };

  // Upload image function
  const UploadImage = async (mode) => {
    const hasPermission = await requestPermission(mode);
    if (!hasPermission) {
      Alert.alert('Permission denied', 'Cannot access ' + mode);
      return;
    }

    try {
      let result = {};
      if (mode === 'camera') {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images, 
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images, 
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }

      if (!result.canceled) {
        SaveImage(result.assets[0].uri);
        setModalVisible(false);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to pick image: ' + e.message);
      setModalVisible(false);
    }
  };

  const SaveImage = (image) => {
    setProfileImage(image);
  };

  const calculateAge = (birthYear) => {
    if (!birthYear) return '';
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } catch (error) {
            console.error('Logout error:', error);
          }

          resetToAuth();
        },
      },
    ]);
  };

  const safeUser = user || {
    name: 'Guest user',
    id: 'N/A',
    email: 'Not available',
    phone: 'Not available',
  };

  return (
    <SafeAreaView
      style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={!!refreshing}
            onRefresh={refreshAppData}
            colors={['#4A90E2']}
            tintColor="#4A90E2"
          />
        }
      >
        <View style={styles.profileRow}>
          <View style={styles.profileContainer}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Image
                source={
                  profileImage
                    ? { uri: profileImage }
                    : require('../assets/profile.png')
                }
                style={styles.profileImage}
              />
              {!profileImage && (
                <FontAwesomeIcon icon={faCirclePlus} style={styles.addIcon} />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.nameText}>{safeUser.name}</Text>
            <Text style={styles.birthText}>
              Account ID: {safeUser.id}
            </Text>
            {safeUser.birthYear ? (
              <Text style={styles.birthText}>
                Birth year: {safeUser.birthYear} ({calculateAge(safeUser.birthYear)} yrs)
              </Text>
            ) : null}
            <Text style={styles.contactText}>{safeUser.email}</Text>
            <Text style={styles.contactText}>{safeUser.phone}</Text>
          </View>
        </View>

        <View style={styles.roleSection}>
          <Text style={styles.roleLabel}>Role: {ROLE_CONFIG[role].label}</Text>
          <Text style={styles.roleInfo}>
            {user?.role === 'admin' 
              ? 'Your role is set by your account type and cannot be changed.'
              : 'Your role is set by your account type and cannot be changed.'}
          </Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Option</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => UploadImage('camera')}
              >
                <Text style={styles.modalButtonText}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => UploadImage('gallery')}
              >
                <Text style={styles.modalButtonText}>Gallery</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#888', marginTop: 10 }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom }]}>
        <Bar />
      </View>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  container: { flexGrow: 1, padding: 20, paddingBottom: 100 },
  profileRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  profileContainer: { position: 'relative' },
  profileImage: { width: 140, height: 140, borderRadius: 70, borderWidth: 3, borderColor: '#888' },
  addIcon: { position: 'absolute', bottom: 5, right: 5, fontSize: 30, color: '#4A90E2' },
  infoContainer: { marginLeft: 20, flex: 1 },
  nameText: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  birthText: { fontSize: 16, marginBottom: 10 },
  bottomBar: { position: 'absolute', bottom: 0, width: '100%' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: width * 0.7, backgroundColor: '#fff', padding: 20, borderRadius: 15, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  modalButton: { flex: 1, backgroundColor: '#4A90E2', paddingVertical: 10, marginHorizontal: 5, borderRadius: 10, alignItems: 'center' },
  modalButtonText: { color: '#fff', fontWeight: 'bold' },
  roleSection: { marginTop: 30 },
  roleLabel: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  roleInfo: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  roleChips: { flexDirection: 'row', flexWrap: 'wrap' },
  roleChip: {
    borderWidth: 1,
    borderColor: '#4A90E2',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  roleChipActive: { backgroundColor: '#4A90E2' },
  roleChipText: { color: '#4A90E2', fontWeight: '600' },
  roleChipTextActive: { color: '#fff' },
  logoutButton: {
    marginTop: 30,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#ef4444',
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
