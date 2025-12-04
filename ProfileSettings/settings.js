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
        <View style={styles.headerSection}>
          <Text style={styles.screenTitle}>Profile & Settings</Text>
          <Text style={styles.screenSubtitle}>Manage your account, identity, and security.</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.profileRow}>
            <View style={styles.profileContainer}>
              <TouchableOpacity onPress={() => setModalVisible(true)} activeOpacity={0.8}>
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
              <Text style={styles.mutedText}>Account ID • {safeUser.id}</Text>
              {safeUser.birthYear ? (
                <Text style={styles.mutedText}>
                  Age • {calculateAge(safeUser.birthYear)} ({safeUser.birthYear})
                </Text>
              ) : null}
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Account</Text>
          <View style={styles.divider} />
          <View style={styles.itemRow}>
            <Text style={styles.itemLabel}>Email</Text>
            <Text style={styles.itemValue}>{safeUser.email}</Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.itemLabel}>Phone</Text>
            <Text style={styles.itemValue}>{safeUser.phone}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Role & access</Text>
          <View style={styles.divider} />
          <View style={styles.roleRow}>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>{ROLE_CONFIG[role].label}</Text>
            </View>
            <Text style={styles.roleInfo}>
              Your permissions and features are based on your current role.
            </Text>
          </View>
        </View>

        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.85}>
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>
          <Text style={styles.logoutHint}>
            Logging out will clear local session data from this device.
          </Text>
        </View>
      </ScrollView>

      {}
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

      {}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom }]}>
        <Bar />
      </View>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f3f4f6' },
  container: { flexGrow: 1, padding: 20, paddingBottom: 120 },
  headerSection: {
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  profileContainer: { position: 'relative' },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: '#4A90E2',
  },
  addIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    fontSize: 20,
    color: '#4A90E2',
    backgroundColor: '#ffffff',
    borderRadius: 999,
  },
  infoContainer: { marginLeft: 16, flex: 1 },
  nameText: { fontSize: 20, fontWeight: '700', color: '#0f172a', marginBottom: 6 },
  mutedText: { fontSize: 13, color: '#6b7280', marginBottom: 2 },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  itemValue: {
    fontSize: 14,
    color: '#111827',
    maxWidth: '60%',
    textAlign: 'right',
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#e0ecff',
    marginRight: 12,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1d4ed8',
    textTransform: 'uppercase',
  },
  roleInfo: { flex: 1, fontSize: 13, color: '#6b7280' },
  logoutSection: {
    marginTop: 8,
    alignItems: 'stretch',
  },
  logoutButton: {
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
  logoutHint: {
    marginTop: 8,
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  bottomBar: { position: 'absolute', bottom: 0, width: '100%' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.7,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  modalButton: {
    flex: 1,
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: { color: '#fff', fontWeight: 'bold' },
});
