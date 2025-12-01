import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppContext } from '../context/AppContext';
import AppScreen from '../components/AppScreen';

const AdminConsoleScreen = () => {
  const { agents, supportTickets } = useAppContext();

  return (
    <AppScreen scrollable contentContainerStyle={styles.container}>
        <Text style={styles.title}>Admin Operations</Text>
        <Text style={styles.subtitle}>Monitor platform health, approvals, and compliance indicators.</Text>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Agents pending approval</Text>
            <Text style={styles.metricValue}>{agents.filter((agent) => agent.status !== 'Open').length}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Open support tickets</Text>
            <Text style={styles.metricValue}>{supportTickets.length}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Latest agent submissions</Text>
          {agents.map((agent) => (
            <View key={agent.id} style={styles.agentRow}>
              <View>
                <Text style={styles.agentName}>{agent.name}</Text>
                <Text style={styles.agentMeta}>{agent.city}</Text>
              </View>
              <Text style={styles.agentStatus}>{agent.status}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Compliance alerts</Text>
          <Text style={styles.alertItem}>• Remind users about updated AML guidelines</Text>
          <Text style={styles.alertItem}>• Review large transfers flagged on 21 Oct</Text>
        </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', color: '#0f172a' },
  subtitle: { color: '#475467', marginBottom: 20 },
  metricsRow: { flexDirection: 'row', marginBottom: 16 },
  metricCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e4e7ec',
  },
  metricLabel: { color: '#475467' },
  metricValue: { fontSize: 28, fontWeight: '700', marginTop: 8 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e4e7ec',
  },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  agentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f5',
  },
  agentName: { fontWeight: '600' },
  agentMeta: { color: '#475467' },
  agentStatus: { fontWeight: '600', color: '#0f172a' },
  alertItem: { color: '#101828', marginBottom: 6 },
});

export default AdminConsoleScreen;

