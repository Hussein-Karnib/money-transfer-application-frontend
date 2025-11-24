import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Platform, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBell as farBell } from '@fortawesome/free-regular-svg-icons';
import { faBell as fasBell, faBars } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppContext, ROLE_CONFIG } from '../context/AppContext';

const Header = ({ image, transaction }) => {
  const navigation = useNavigation();
  const { role } = useAppContext();
  const roleLabel = ROLE_CONFIG[role]?.label || 'User';

  const handleBell = () => {
    if (Platform.OS === 'web') {
      console.log('Web popup behavior');
    } else {
      navigation.navigate('Notifications');
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        <TouchableOpacity onPress={() => navigation.openDrawer?.()} style={styles.menuButton}>
          <FontAwesomeIcon icon={faBars} size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.profileWrapper}>
          <Image source={image} style={styles.image} />
          <View>
            <Text style={styles.appTitle}>SwiftSend</Text>
            <Text style={styles.roleBadge}>{roleLabel}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={handleBell} style={styles.bellContainer}>
        <FontAwesomeIcon icon={transaction === 0 ? farBell : fasBell} size={26} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#4A90E2',
  },
  leftContainer: { flexDirection: 'row', alignItems: 'center' },
  menuButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profileWrapper: { flexDirection: 'row', alignItems: 'center' },
  image: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  appTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  roleBadge: { color: '#bfdbfe', fontSize: 12 },
  bellContainer: { position: 'relative' },
});

export default Header;
