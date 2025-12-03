import React, { useMemo } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../context/AppContext';
import AppScreen from '../components/AppScreen';

const FraudDetectionScreen = () => {
  const { fraudAlerts, updateFraudAlertStatus, formatCurrency } = useAppContext();

  const alertsByStatus = useMemo(() => {
    return {
      pending: fraudAlerts.filter((a) => a.status === 'Pending Review'),
      investigating: fraudAlerts.filter((a) => a.status === 'Under Investigation'),
      resolved: fraudAlerts.filter((a) => a.status === 'Resolved'),
    };
  }, [fraudAlerts]);

  const alertsBySeverity = useMemo(() => {
    return {
      high: fraudAlerts.filter((a) => a.severity === 'High'),
      medium: fraudAlerts.filter((a) => a.severity === 'Medium'),
      low: fraudAlerts.filter((a) => a.severity === 'Low'),
    };
  }, [fraudAlerts]);

  const handleStatusUpdate = async (alertId, newStatus) => {
    try {
      await updateFraudAlertStatus(alertId, newStatus);
      Alert.alert('Status Updated', `Fraud alert status changed to ${newStatus}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update fraud alert status');
      console.error('Update fraud alert error:', error);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High':
        return styles.severityHigh;
      case 'Medium':
        return styles.severityMedium;
      case 'Low':
        return styles.severityLow;
      default:
        return styles.severityLow;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending Review':
        return styles.statusPending;
      case 'Under Investigation':
        return styles.statusInvestigating;
      case 'Resolved':
        return styles.statusResolved;
      default:
        return styles.statusPending;
    }
  };

  return (
    <AppScreen scrollable contentContainerStyle={styles.container}>
      <Text style={styles.title}>Fraud Detection</Text>
      <Text style={styles.subtitle}>Monitor and manage fraud alerts and suspicious activities.</Text>

      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>High Severity</Text>
          <Text style={[styles.metricValue, styles.valueHigh]}>{alertsBySeverity.high.length}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Pending Review</Text>
          <Text style={[styles.metricValue, styles.valuePending]}>{alertsByStatus.pending.length}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Under Investigation</Text>
          <Text style={[styles.metricValue, styles.valueInvestigating]}>{alertsByStatus.investigating.length}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Total Alerts</Text>
          <Text style={styles.metricValue}>{fraudAlerts.length}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Fraud Alerts</Text>
        {fraudAlerts.filter((a) => a.status !== 'Resolved').length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No active fraud alerts</Text>
          </View>
        ) : (
          fraudAlerts
            .filter((a) => a.status !== 'Resolved')
            .map((alert) => (
              <View key={alert.id} style={styles.alertCard}>
                <View style={styles.alertHeader}>
                  <View style={styles.alertHeaderLeft}>
                    <View style={styles.alertIdRow}>
                      <Text style={styles.alertId}>{alert.id}</Text>
                      <View style={[styles.severityBadge, getSeverityColor(alert.severity)]}>
                        <Text style={styles.severityText}>{alert.severity}</Text>
                      </View>
                      <View style={[styles.statusBadge, getStatusColor(alert.status)]}>
                        <Text style={styles.statusText}>{alert.status}</Text>
                      </View>
                    </View>
                    <Text style={styles.alertType}>{alert.type}</Text>
                  </View>
                  <View style={styles.riskScoreContainer}>
                    <Text style={styles.riskScoreLabel}>Risk Score</Text>
                    <Text style={[styles.riskScore, alert.riskScore >= 70 && styles.riskScoreHigh]}>
                      {alert.riskScore}
                    </Text>
                  </View>
                </View>

                <Text style={styles.description}>{alert.description}</Text>

                <View style={styles.alertDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>User:</Text>
                    <Text style={styles.detailValue}>
                      {alert.userName} ({alert.userId})
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Transaction:</Text>
                    <Text style={styles.detailValue}>{alert.transactionId}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Amount:</Text>
                    <Text style={styles.detailValue}>
                      {formatCurrency(alert.amount, alert.currency)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Flagged:</Text>
                    <Text style={styles.detailValue}>{formatDate(alert.flaggedAt)}</Text>
                  </View>
                </View>

                {alert.status !== 'Resolved' && (
                  <View style={styles.actionButtons}>
                    {alert.status === 'Pending Review' && (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.buttonInvestigate]}
                        onPress={() => handleStatusUpdate(alert.id, 'Under Investigation')}
                      >
                        <Text style={styles.actionButtonText}>Start Investigation</Text>
                      </TouchableOpacity>
                    )}
                    {alert.status === 'Under Investigation' && (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.buttonResolve]}
                        onPress={() => handleStatusUpdate(alert.id, 'Resolved')}
                      >
                        <Text style={styles.actionButtonText}>Mark as Resolved</Text>
                      </TouchableOpacity>
                    )}
                    {alert.status === 'Pending Review' && (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.buttonResolve]}
                        onPress={() => handleStatusUpdate(alert.id, 'Resolved')}
                      >
                        <Text style={styles.actionButtonText}>Resolve</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            ))
        )}
      </View>

      {alertsByStatus.resolved.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resolved Alerts</Text>
          {alertsByStatus.resolved.map((alert) => (
            <View key={alert.id} style={[styles.alertCard, styles.resolvedCard]}>
              <View style={styles.alertHeader}>
                <Text style={styles.alertId}>{alert.id}</Text>
                <View style={[styles.statusBadge, getStatusColor(alert.status)]}>
                  <Text style={styles.statusText}>{alert.status}</Text>
                </View>
              </View>
              <Text style={styles.alertType}>{alert.type}</Text>
              <Text style={styles.description}>{alert.description}</Text>
              <Text style={styles.detailValue}>
                User: {alert.userName} • {formatCurrency(alert.amount, alert.currency)} • {formatDate(alert.flaggedAt)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', color: '#0f172a' },
  subtitle: { color: '#475467', marginBottom: 20 },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 10,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e4e7ec',
  },
  metricLabel: { color: '#475467', fontSize: 13 },
  metricValue: { fontSize: 28, fontWeight: '700', marginTop: 8, color: '#0f172a' },
  valueHigh: { color: '#ef4444' },
  valuePending: { color: '#f59e0b' },
  valueInvestigating: { color: '#3b82f6' },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  alertCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e4e7ec',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  resolvedCard: {
    opacity: 0.7,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  alertHeaderLeft: {
    flex: 1,
  },
  alertIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 8,
  },
  alertId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  severityHigh: {
    backgroundColor: '#fee2e2',
  },
  severityMedium: {
    backgroundColor: '#fef3c7',
  },
  severityLow: {
    backgroundColor: '#dbeafe',
  },
  severityText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0f172a',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusPending: {
    backgroundColor: '#fef3c7',
  },
  statusInvestigating: {
    backgroundColor: '#dbeafe',
  },
  statusResolved: {
    backgroundColor: '#d1fae5',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0f172a',
  },
  alertType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#101828',
    marginBottom: 8,
  },
  riskScoreContainer: {
    alignItems: 'flex-end',
  },
  riskScoreLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginBottom: 4,
  },
  riskScore: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10b981',
  },
  riskScoreHigh: {
    color: '#ef4444',
  },
  description: {
    fontSize: 14,
    color: '#475467',
    lineHeight: 20,
    marginBottom: 16,
  },
  alertDetails: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    width: 100,
  },
  detailValue: {
    fontSize: 13,
    color: '#0f172a',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonInvestigate: {
    backgroundColor: '#3b82f6',
  },
  buttonResolve: {
    backgroundColor: '#10b981',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e4e7ec',
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
  },
});

export default FraudDetectionScreen;
