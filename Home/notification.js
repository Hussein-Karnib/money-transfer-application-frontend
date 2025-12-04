import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import Header from './header';
import Bar from '../MoreStuff/bar';

const Notifications = () => {
  const { notifications, refreshAppData, refreshing } = useAppContext();
  const image = require('../assets/profile.png');
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <Header image={image} transaction={notifications.length} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={!!refreshing}
            onRefresh={refreshAppData}
            colors={['#4A90E2']}
            tintColor="#4A90E2"
          />
        }
      >
        <Text style={styles.title}>Notifications</Text>
        {notifications.map((note, index) => (
          <View key={index} style={styles.notificationCard}>
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
