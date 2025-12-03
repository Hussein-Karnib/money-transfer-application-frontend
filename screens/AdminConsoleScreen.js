import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppContext } from '../context/AppContext';
import AppScreen from '../components/AppScreen';

const AdminConsoleScreen = () => {
  const { agents, supportTickets, kycUsers, fraudAlerts } = useAppContext();
  const pendingKycCount = kycUsers.filter((user) => user.status === 'Pending').length;
  const activeFraudAlerts = fraudAlerts.filter((alert) => alert.status !== 'Resolved').length;
  const highSeverityAlerts = fraudAlerts.filter((alert) => alert.severity === 'High' && alert.status !== 'Resolved').length;

  return (
    <AppScreen scrollable contentContainerStyle={styles.container}>
        <Text style={styles.title}>Admin Operations</Text>
        <Text style={styles.subtitle}>Monitor platform health, approvals, and compliance indicators.</Text>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Active fraud alerts</Text>
            <Text style={[styles.metricValue, highSeverityAlerts > 0 && styles.metricValueHigh]}>{activeFraudAlerts}</Text>
            {highSeverityAlerts > 0 && (
              <Text style={styles.metricSubtext}>{highSeverityAlerts} high severity</Text>
            )}
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>KYC pending approval</Text>
            <Text style={styles.metricValue}>{pendingKycCount}</Text>
          </View>
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
          <Text style={styles.cardTitle}>Latest user KYC submissions</Text>
          {kycUsers.map((kycUser) => (
            <View key={kycUser.id} style={styles.userRow}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{kycUser.name}</Text>
                <Text style={styles.userMeta}>{kycUser.email}</Text>
                <Text style={styles.userMeta}>Submitted: {kycUser.submittedDate}</Text>
              </View>
              <View style={styles.statusContainer}>
                <Text style={[
                  styles.userStatus,
                  kycUser.status === 'Approved' && styles.statusApproved,
                  kycUser.status === 'Pending' && styles.statusPending,
                  kycUser.status === 'Rejected' && styles.statusRejected,
                ]}>{kycUser.status}</Text>
              </View>
            </View>
          ))}
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
  metricsRow: { flexDirection: 'row', marginBottom: 16, flexWrap: 'wrap' },
  metricCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e4e7ec',
  },
  metricLabel: { color: '#475467', fontSize: 13 },
  metricValue: { fontSize: 28, fontWeight: '700', marginTop: 8, color: '#0f172a' },
  metricValueHigh: { color: '#ef4444' },
  metricSubtext: { fontSize: 11, color: '#ef4444', marginTop: 4 },
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
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f5',
  },
  userInfo: {
    flex: 1,
  },
  userName: { fontWeight: '600', fontSize: 16, marginBottom: 4 },
  userMeta: { color: '#475467', fontSize: 13, marginBottom: 2 },
  statusContainer: {
    alignItems: 'flex-end',
  },
  userStatus: {
    fontWeight: '600',
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusPending: {
    color: '#f59e0b',
    backgroundColor: '#fef3c7',
  },
  statusApproved: {
    color: '#10b981',
    backgroundColor: '#d1fae5',
  },
  statusRejected: {
    color: '#ef4444',
    backgroundColor: '#fee2e2',
  },
  alertItem: { color: '#101828', marginBottom: 6 },
});

export default AdminConsoleScreen;

