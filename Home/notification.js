import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Notifications = () => {
  const notifications = [
    'Transaction 1 completed',
    'Transaction 2 received',
    'Transaction 3 pending',
  ];

  return (
   
    <ScrollView style={styles.container}>
       <SafeAreaView>
      <Text style={styles.title}>Notifications</Text>
      {notifications.map((note, index) => (
        <View key={index} style={styles.notificationCard}>
          <Text>{note}</Text>
        </View>
      ))}
      </SafeAreaView>
    </ScrollView>
    
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  notificationCard: { padding: 12, backgroundColor: '#eee', borderRadius: 8, marginBottom: 10 },
});

export default Notifications;
