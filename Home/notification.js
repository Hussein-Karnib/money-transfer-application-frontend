import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';

const Notifications = () => {
  const { notifications } = useAppContext();

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <Text style={styles.title}>Notifications</Text>
        {notifications.map((note, index) => (
          <View key={note} style={styles.notificationCard}>
            <Text style={styles.notificationText}>{note}</Text>
          </View>
        ))}
        {notifications.length === 0 && <Text style={styles.emptyText}>All caught up!</Text>}
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
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
