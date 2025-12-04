import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../context/AppContext';
import AppScreen from '../components/AppScreen';

const REPORT_TYPES = [
  { id: 'transactions', label: 'Transaction Report', description: 'Daily, weekly, or monthly transaction summaries' },
  { id: 'fraud', label: 'Fraud & Security Report', description: 'Fraud alerts, risk analysis, and security incidents' },
  { id: 'kyc', label: 'KYC Compliance Report', description: 'User verification status and compliance metrics' },
  { id: 'financial', label: 'Financial Summary', description: 'Revenue, fees, and financial performance' },
  { id: 'users', label: 'User Activity Report', description: 'User registration, activity, and engagement metrics' },
  { id: 'agents', label: 'Agent Performance Report', description: 'Agent transactions, commissions, and activity' },
];

const REPORTS_ENDPOINTS = [
  {
    id: 'api-reports-transactions',
    method: 'GET',
    path: '/api/admin/reports/transactions',
    description: 'Get transaction reports with filters (date range, currency, status)',
    parameters: ['startDate', 'endDate', 'currency', 'status', 'limit', 'offset'],
  },
  {
    id: 'api-reports-fraud',
    method: 'GET',
    path: '/api/admin/reports/fraud',
    description: 'Retrieve fraud detection reports and alerts',
    parameters: ['startDate', 'endDate', 'severity', 'status', 'riskScoreMin'],
  },
  {
    id: 'api-reports-kyc',
    method: 'GET',
    path: '/api/admin/reports/kyc',
    description: 'Get KYC compliance and verification reports',
    parameters: ['status', 'startDate', 'endDate', 'country'],
  },
  {
    id: 'api-reports-financial',
    method: 'GET',
    path: '/api/admin/reports/financial',
    description: 'Financial summaries including revenue, fees, and profits',
    parameters: ['startDate', 'endDate', 'currency', 'groupBy'],
  },
  {
    id: 'api-reports-users',
    method: 'GET',
    path: '/api/admin/reports/users',
    description: 'User activity and engagement metrics',
    parameters: ['startDate', 'endDate', 'role', 'status', 'country'],
  },
  {
    id: 'api-reports-agents',
    method: 'GET',
    path: '/api/admin/reports/agents',
    description: 'Agent performance and commission reports',
    parameters: ['agentId', 'startDate', 'endDate', 'status'],
  },
  {
    id: 'api-reports-export',
    method: 'POST',
    path: '/api/admin/reports/export',
    description: 'Export report data in various formats (CSV, PDF, Excel)',
    parameters: ['reportType', 'format', 'filters', 'startDate', 'endDate'],
  },
];

const ReportsScreen = () => {
  const {
    transactions = [],
    fraudAlerts = [],
    kycSubmissions = [],
    agents = [],
    supportTickets = [],
    generateReport,
    formatCurrency,
  } = useAppContext();
  const [selectedReport, setSelectedReport] = useState(null);
  const [generatedReports, setGeneratedReports] = useState([]);

  const handleGenerateReport = (reportType) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); 
    const endDate = new Date();

    const report = generateReport(reportType, startDate.toISOString(), endDate.toISOString());
    setGeneratedReports((prev) => [report, ...prev]);
    setSelectedReport(report.id);
    Alert.alert('Report Generated', `Report ${report.id} has been generated successfully.`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getReportStats = () => {
    const totalTransactions = transactions.length;
    const totalAmount = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    const pendingKyc = (kycSubmissions || []).filter((u) => u.status === 'Pending').length;
    const activeFraudAlerts = fraudAlerts.filter((a) => a.status !== 'Resolved').length;
    const totalAgents = agents.length;
    const openTickets = supportTickets.length;

    return {
      totalTransactions,
      totalAmount,
      pendingKyc,
      activeFraudAlerts,
      totalAgents,
      openTickets,
    };
  };

  const stats = getReportStats();

  return (
    <AppScreen scrollable contentContainerStyle={styles.container}>
      <Text style={styles.title}>Admin Reports</Text>
      <Text style={styles.subtitle}>Generate reports and access reporting API endpoints.</Text>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalTransactions}</Text>
          <Text style={styles.statLabel}>Total Transactions</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{formatCurrency(stats.totalAmount)}</Text>
          <Text style={styles.statLabel}>Total Volume</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.activeFraudAlerts}</Text>
          <Text style={styles.statLabel}>Active Alerts</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.pendingKyc}</Text>
          <Text style={styles.statLabel}>Pending KYC</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Generate Reports</Text>
        <Text style={styles.sectionDescription}>
          Select a report type to generate. Reports include data from the last 30 days.
        </Text>

        {REPORT_TYPES.map((reportType) => (
          <View key={reportType.id} style={styles.reportCard}>
            <View style={styles.reportInfo}>
              <Text style={styles.reportLabel}>{reportType.label}</Text>
              <Text style={styles.reportDescription}>{reportType.description}</Text>
            </View>
            <TouchableOpacity
              style={styles.generateButton}
              onPress={() => handleGenerateReport(reportType.id)}
            >
              <Text style={styles.generateButtonText}>Generate</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {generatedReports.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Generated Reports</Text>
          {generatedReports.map((report) => (
            <View key={report.id} style={styles.generatedReportCard}>
              <View style={styles.generatedReportHeader}>
                <View>
                  <Text style={styles.generatedReportId}>{report.id}</Text>
                  <Text style={styles.generatedReportType}>{report.type}</Text>
                </View>
                <Text style={styles.generatedReportDate}>{formatDate(report.generatedAt)}</Text>
              </View>
              <Text style={styles.generatedReportPeriod}>
                {formatDate(report.startDate)} - {formatDate(report.endDate)}
              </Text>
              {report.data && (
                <View style={styles.reportData}>
                  <Text style={styles.reportDataText}>
                    Transactions: {report.data.totalTransactions} | Alerts: {report.data.fraudAlerts} |
                    Pending KYC: {report.data.pendingKyc}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reporting API Endpoints</Text>
        <Text style={styles.sectionDescription}>
          RESTful endpoints for programmatic access to report data.
        </Text>

        {REPORTS_ENDPOINTS.map((endpoint) => (
          <View key={endpoint.id} style={styles.endpointCard}>
            <View style={styles.endpointHeader}>
              <View style={[styles.methodBadge, endpoint.method === 'GET' ? styles.methodGet : styles.methodPost]}>
                <Text style={styles.methodText}>{endpoint.method}</Text>
              </View>
              <Text style={styles.endpointPath}>{endpoint.path}</Text>
            </View>
            <Text style={styles.endpointDescription}>{endpoint.description}</Text>
            {endpoint.parameters && endpoint.parameters.length > 0 && (
              <View style={styles.parametersContainer}>
                <Text style={styles.parametersLabel}>Parameters:</Text>
                <View style={styles.parametersList}>
                  {endpoint.parameters.map((param, idx) => (
                    <View key={idx} style={styles.parameterTag}>
                      <Text style={styles.parameterText}>{param}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        ))}
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', color: '#0f172a' },
  subtitle: { color: '#475467', marginBottom: 20 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e4e7ec',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
    lineHeight: 20,
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e4e7ec',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportInfo: {
    flex: 1,
    marginRight: 16,
  },
  reportLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  reportDescription: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  generateButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  generateButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  generatedReportCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#10b981',
    borderLeftWidth: 4,
  },
  generatedReportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  generatedReportId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
    marginBottom: 4,
  },
  generatedReportType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  generatedReportDate: {
    fontSize: 12,
    color: '#94a3b8',
  },
  generatedReportPeriod: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 8,
  },
  reportData: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 10,
  },
  reportDataText: {
    fontSize: 13,
    color: '#475467',
  },
  endpointCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e4e7ec',
  },
  endpointHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 8,
  },
  methodBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  methodGet: {
    backgroundColor: '#dbeafe',
  },
  methodPost: {
    backgroundColor: '#d1fae5',
  },
  methodText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  endpointPath: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    fontFamily: 'monospace',
  },
  endpointDescription: {
    fontSize: 14,
    color: '#475467',
    lineHeight: 20,
    marginBottom: 12,
  },
  parametersContainer: {
    marginTop: 8,
  },
  parametersLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  parametersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  parameterTag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  parameterText: {
    fontSize: 11,
    color: '#475467',
    fontFamily: 'monospace',
  },
});

export default ReportsScreen;
