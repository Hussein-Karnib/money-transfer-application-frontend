import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import Header from './header';
import Bar from '../MoreStuff/bar';

const Notifications = () => {
  const { notifications } = useAppContext();
  const image = require('../assets/profile.png');

  return (
    <SafeAreaView style={styles.container}>
      <Header image={image} transaction={notifications.length} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Notifications</Text>
        {notifications.map((note) => (
          <View key={note} style={styles.notificationCard}>
            <Text style={styles.notificationText}>{note}</Text>
          </View>
        ))}
        {notifications.length === 0 && <Text style={styles.emptyText}>All caught up!</Text>}
      </ScrollView>
      <Bar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 16, paddingBottom: 70 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  notificationCard: {
    padding: 16,
    backgroundColor: '#f5f7fb',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e4e7ec',
  },
  notificationText: { color: '#101828', fontSize: 14 },
  emptyText: { textAlign: 'center', color: '#98a2b3' },
});

export default Notifications;
