import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppContext } from '../context/AppContext';

const AgentMapScreen = () => {
  const { agents } = useAppContext();

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Agent Locations</Text>
        <Text style={styles.subtitle}>Explore partner stores on the map and check availability.</Text>

        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapText}>Map preview (integrate react-native-maps later)</Text>
        </View>

        {agents.map((agent) => (
          <View key={agent.id} style={styles.card}>
            <View>
              <Text style={styles.agentName}>{agent.name}</Text>
              <Text style={styles.agentMeta}>{agent.city}</Text>
              <Text style={styles.agentMeta}>Hours: {agent.hours}</Text>
            </View>
            <View style={[styles.badge, agent.status === 'Open' ? styles.badgeOpen : styles.badgeClosed]}>
              <Text style={styles.badgeText}>{agent.status}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f5f7fb' },
  container: { padding: 20, paddingBottom: 60 },
  title: { fontSize: 26, fontWeight: '700', color: '#0f172a' },
  subtitle: { color: '#475467', marginBottom: 20 },
  mapPlaceholder: {
    height: 200,
    borderRadius: 16,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  mapText: { color: '#1d4ed8', fontWeight: '600' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e4e7ec',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  agentName: { fontSize: 16, fontWeight: '600' },
  agentMeta: { color: '#475467' },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  badgeOpen: { backgroundColor: '#dcfce7' },
  badgeClosed: { backgroundColor: '#fee2e2' },
  badgeText: { fontWeight: '600', color: '#0f172a' },
});

export default AgentMapScreen;

