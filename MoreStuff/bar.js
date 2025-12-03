import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';

const ROLE_NAV = {
  user: [
    { label: 'Home', icon: 'home', route: 'Dashboard' },
    { label: 'Send', icon: 'paper-plane', route: 'Send Money' },
    { label: 'History', icon: 'clock', route: 'Transactions' },
    { label: 'Support', icon: 'headset', route: 'Support' },
    { label: 'Settings', icon: 'cog', route: 'Settings' },
  ],
  agent: [
    { label: 'Console', icon: 'store-alt', route: 'Dashboard' },
    { label: 'Receive', icon: 'download', route: 'Receive Money' },
    { label: 'History', icon: 'clock', route: 'Transactions' },
    { label: 'Support', icon: 'headset', route: 'Support' },
    { label: 'Settings', icon: 'cog', route: 'Settings' },
  ],
  admin: [
    { label: 'Admin', icon: 'shield-alt', route: 'Dashboard' },
    { label: 'Fraud', icon: 'exclamation-triangle', route: 'Fraud Detection' },
    { label: 'Reports', icon: 'chart-line', route: 'Reports' },
    { label: 'Support', icon: 'headset', route: 'Support' },
    { label: 'Settings', icon: 'cog', route: 'Settings' },
  ],
};

const Bar = () => {
  const navigation = useNavigation();
  const { role } = useAppContext();
  const items = useMemo(() => ROLE_NAV[role] || ROLE_NAV.user, [role]);

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <TouchableOpacity key={item.route} style={styles.item} onPress={() => navigation.navigate(item.route)}>
          <FontAwesome5 name={item.icon} size={20} color="white" />
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
  },
  item: {
    alignItems: 'center',
  },
  label: {
    color: 'white',
    marginTop: 5,
    fontSize: 12,
  },
});

export default Bar;
