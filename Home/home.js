import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Header from './header';
import Bar from '../MoreStuff/bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const image = require('../assets/profile.png');
  const { user, balance, transactions } = useAppContext();
  const navigation = useNavigation();

  const recentTransactions = transactions.slice(0, 3);

  return (
    <SafeAreaView style={styles.container}>
      <Header image={image} transaction={transactions.length} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={styles.cardLabel}>Account Holder</Text>
            <Text style={styles.userName}>{user.name}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.cardBottom}>
            <Text style={styles.cardLabel}>Current Balance</Text>
            <Text style={styles.userBalance}>${balance.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Send Money')}>
            <Text style={styles.actionLabel}>Send Money</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Receive Money')}>
            <Text style={styles.actionLabel}>Receive Money</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Transactions')}>
            <Text style={styles.actionLabel}>History</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.separator} />
          <Text style={styles.title}>Recent Transactions</Text>
          <View style={styles.cardgroup}>
            {recentTransactions.map((item) => (
              <View key={item.id} style={styles.transactionRow}>
                <View>
                  <Text style={styles.transactionName}>{item.counterpart}</Text>
                  <Text style={styles.transactionNote}>{item.note || 'No note provided'}</Text>
                </View>
                <Text style={[styles.transactionAmount, item.type === 'sent' ? styles.sent : styles.received]}>
                  {item.type === 'sent' ? '-' : '+'}${item.amount.toFixed(2)}
                </Text>
              </View>
            ))}
            {recentTransactions.length === 0 && <Text style={styles.emptyText}>No transactions yet.</Text>}
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

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    borderLeftWidth: 5,
    borderLeftColor: '#4A90E2',
  },
  cardTop: { marginBottom: 12 },
  cardBottom: {},
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  cardLabel: { color: '#777', fontSize: 12, marginBottom: 4, letterSpacing: 0.5 },
  userName: { fontSize: 20, fontWeight: '700', color: '#333' },
  userBalance: { fontSize: 18, fontWeight: '600', color: '#333' },

  section: { paddingHorizontal: 16, marginTop: 20 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },

  cardgroup: { flexDirection: 'column', justifyContent: 'space-between' },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
    marginHorizontal: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionLabel: { color: '#fff', fontWeight: '600' },
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
  transactionName: { fontSize: 16, fontWeight: '600' },
  transactionNote: { fontSize: 12, color: '#777' },
  transactionAmount: { fontSize: 18, fontWeight: '700' },
  sent: { color: '#ef4444' },
  received: { color: '#10b981' },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 10 },
});

export default Home;
