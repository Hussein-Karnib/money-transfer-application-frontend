import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBell as farBell } from '@fortawesome/free-regular-svg-icons';
import { faBell as fasBell } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';

const Header = ({ image, transaction }) => {
  const navigation = useNavigation();

  const handleBell = () => {
    if (Platform.OS === 'web') {
      console.log('Web popup behavior');
    } else {
      navigation.navigate('Notifications');
    }
  };

  return (
    <View style={styles.header}>
      <Image source={image} style={styles.image} />
      <TouchableOpacity onPress={handleBell} style={styles.bellContainer}>
        <FontAwesomeIcon icon={transaction === 0 ? farBell : fasBell} size={26} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#4A90E2' },
  image: { width: 40, height: 40, borderRadius: 20 },
  bellContainer: { position: 'relative' },
});

export default Header;
