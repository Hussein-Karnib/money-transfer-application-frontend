import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Header from './header';
import Bar from '../MoreStuff/bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const image = require('../assets/profile.png');
  const { user, balance, transactions, notifications, formatCurrency } = useAppContext();
  const navigation = useNavigation();

  const recentTransactions = transactions.slice(0, 3);

  return (
    <SafeAreaView style={styles.container}>
      <Header image={image} transaction={transactions.length} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.welcomeLabel}>Welcome back</Text>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.balanceLabel}>Current balance</Text>
              <Text style={styles.userBalance}>${balance.toLocaleString()}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Secure • Encrypted</Text>
            </View>
          </View>
          <View style={styles.quickRow}>
            <TouchableOpacity style={styles.quickButton} onPress={() => navigation.navigate('Send Money')}>
              <Text style={styles.quickTitle}>Send</Text>
              <Text style={styles.quickSubtitle}>Transfer instantly</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickButton} onPress={() => navigation.navigate('Receive Money')}>
              <Text style={styles.quickTitle}>Receive</Text>
              <Text style={styles.quickSubtitle}>Share ID or QR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickButton} onPress={() => navigation.navigate('Transactions')}>
              <Text style={styles.quickTitle}>History</Text>
              <Text style={styles.quickSubtitle}>Filters & insights</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent activity</Text>
          <View style={styles.cardgroup}>
            {recentTransactions.map((item) => (
              <View key={item.id} style={styles.transactionRow}>
                <View>
                  <Text style={styles.transactionName}>{item.counterpart}</Text>
                  <Text style={styles.transactionNote}>{item.note || 'No note provided'}</Text>
                </View>
                <Text style={[styles.transactionAmount, item.type === 'sent' ? styles.sent : styles.received]}>
                  {item.type === 'sent' ? '-' : '+'}
                  {formatCurrency(item.amount, item.currency || 'USD')}
                </Text>
              </View>
            ))}
            {recentTransactions.length === 0 && <Text style={styles.emptyText}>No transactions yet.</Text>}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security reminders</Text>
          <View style={styles.alertCard}>
            <Text style={styles.alertTitle}>Stay in control</Text>
            <Text style={styles.alertCopy}>
              All transfers are validated, encrypted, and summarized in your secure ledger. Add beneficiaries to speed up
              future payments and monitor your alerts below.
            </Text>
            <Text style={styles.alertHighlight}>{notifications[0]}</Text>
          </View>
        </View>
      </ScrollView>

      <Bar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 70 },
  heroCard: {
    backgroundColor: '#0f172a',
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 20,
    padding: 18,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  welcomeLabel: { color: '#bfdbfe', fontSize: 12, letterSpacing: 0.6 },
  userName: { fontSize: 24, fontWeight: '800', color: '#fff', marginTop: 4 },
  balanceLabel: { color: '#cbd5e1', marginTop: 8, fontSize: 13 },
  userBalance: { fontSize: 26, fontWeight: '700', color: '#38bdf8' },
  badge: {
    backgroundColor: '#10b981',
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: '#022c22', fontWeight: '800', fontSize: 12 },
  quickRow: { flexDirection: 'row', marginTop: 16 },
  quickButton: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  quickTitle: { color: '#fff', fontWeight: '700', fontSize: 16 },
  quickSubtitle: { color: '#cbd5e1', marginTop: 4, fontSize: 12 },
  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#0f172a',
  },
  cardgroup: { flexDirection: 'column', justifyContent: 'space-between' },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f1f1f5',
  },
  transactionName: { fontSize: 16, fontWeight: '600', color: '#0f172a' },
  transactionNote: { fontSize: 12, color: '#475467' },
  transactionAmount: { fontSize: 18, fontWeight: '700' },
  sent: { color: '#ef4444' },
  received: { color: '#10b981' },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 10 },
  alertCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  alertTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 6 },
  alertCopy: { color: '#0f172a', lineHeight: 20, marginBottom: 8 },
  alertHighlight: { color: '#2563eb', fontWeight: '700' },
});

export default Home;
