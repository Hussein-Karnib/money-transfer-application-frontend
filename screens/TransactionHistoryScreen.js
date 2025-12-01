import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../context/AppContext';
import AppScreen from '../components/AppScreen';

const FILTERS = ['all', 'sent', 'received'];

const TransactionHistoryScreen = () => {
  const { transactions, formatCurrency } = useAppContext();
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredTransactions = useMemo(() => {
    if (activeFilter === 'all') return transactions;
    return transactions.filter((tx) => tx.type === activeFilter);
  }, [activeFilter, transactions]);

  const renderItem = ({ item }) => (
    <View style={styles.transactionCard}>
      <View>
        <Text style={styles.counterpart}>{item.counterpart}</Text>
        {item.note ? <Text style={styles.note}>{item.note}</Text> : null}
        <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
      </View>
      <Text style={[styles.amount, item.type === 'sent' ? styles.sent : styles.received]}>
        {item.type === 'sent' ? '-' : '+'}
        {formatCurrency(item.amount, item.currency || 'USD')}
      </Text>
    </View>
  );

  return (
    <AppScreen bodyStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transaction History</Text>
        <Text style={styles.subtitle}>Filter by type to quickly skim your activity.</Text>
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterButton, activeFilter === filter && styles.filterButtonActive]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>{filter.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyState}>No transactions yet.</Text>}
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingBottom: 40 },
  header: { paddingVertical: 20 },
  title: { fontSize: 28, fontWeight: '700', color: '#101828' },
  subtitle: { fontSize: 14, color: '#475467', marginTop: 4 },
  filterRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  filterButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d0d5dd',
    alignItems: 'center',
  },
  filterButtonActive: { backgroundColor: '#4A90E2', borderColor: '#4A90E2' },
  filterText: { fontSize: 13, color: '#475467', fontWeight: '600' },
  filterTextActive: { color: '#fff' },
  listContent: { paddingBottom: 20 },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  counterpart: { fontSize: 16, fontWeight: '600', color: '#101828' },
  note: { fontSize: 13, color: '#475467', marginTop: 4 },
  timestamp: { fontSize: 12, color: '#98a2b3', marginTop: 6 },
  amount: { fontSize: 18, fontWeight: '700' },
  sent: { color: '#ef4444' },
  received: { color: '#10b981' },
  emptyState: { textAlign: 'center', color: '#98a2b3', marginTop: 40 },
});

export default TransactionHistoryScreen;

