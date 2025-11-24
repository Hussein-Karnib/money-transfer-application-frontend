import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../context/AppContext';

const AgentConsoleScreen = () => {
  const { agents, updateAgentStatus } = useAppContext();
  const primaryAgent = agents[0];

  const toggleStatus = () => {
    updateAgentStatus({ id: primaryAgent.id, status: primaryAgent.status === 'Open' ? 'Closed' : 'Open' });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Agent Console</Text>
        <Text style={styles.subtitle}>Manage cash operations, queue, and working hours.</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{primaryAgent.name}</Text>
          <Text style={styles.cardMeta}>City: {primaryAgent.city}</Text>
          <Text style={styles.cardMeta}>Hours: {primaryAgent.hours}</Text>
          <Text style={styles.cardMeta}>Commission: {primaryAgent.commissions}</Text>
          <View style={[styles.badge, primaryAgent.status === 'Open' ? styles.badgeOpen : styles.badgeClosed]}>
            <Text style={styles.badgeText}>{primaryAgent.status}</Text>
          </View>
          <TouchableOpacity style={styles.cta} onPress={toggleStatus}>
            <Text style={styles.ctaText}>
              {primaryAgent.status === 'Open' ? 'Mark as closed' : 'Mark as open'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cash-in / Cash-out queue</Text>
          <Text style={styles.queueItem}>• 3 pending cash-out approvals</Text>
          <Text style={styles.queueItem}>• 1 high-value transfer requires ID verification</Text>
          <Text style={styles.queueItem}>• Settlements batch scheduled for 6pm</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f5f7fb' },
  container: { padding: 20, paddingBottom: 60 },
  title: { fontSize: 28, fontWeight: '700', color: '#0f172a' },
  subtitle: { color: '#475467', marginBottom: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e4e7ec',
  },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  cardMeta: { color: '#475467', marginBottom: 4 },
  badge: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  badgeOpen: { backgroundColor: '#dcfce7' },
  badgeClosed: { backgroundColor: '#fee2e2' },
  badgeText: { fontWeight: '700', color: '#0f172a' },
  cta: {
    marginTop: 16,
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ctaText: { color: '#fff', fontWeight: '600' },
  queueItem: { marginTop: 6, color: '#101828' },
});

export default AgentConsoleScreen;

