// Home/home.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAppContext } from '../context/AppContext';
import AppScreen from '../components/AppScreen';

const Home = () => {
  const { user, authToken, balance, transactions, loading: contextLoading, fetchUserTransactions } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!authToken || !user) {
        setLoading(false);
        return;
      }

      try {
        // Load transactions from JSON storage
        const userTx = await fetchUserTransactions();
        // Get most recent 5 transactions
        const recent = userTx
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 5);
        setRecentTransactions(recent);
      } catch (error) {
        console.log('Home load error', error.message);
      } finally {
        setLoading(false);
      }
    };

    if (!contextLoading) {
      loadDashboard();
    }
  }, [authToken, user, contextLoading, fetchUserTransactions]);

  const formattedBalance = Number(balance || 0).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  if (loading || contextLoading) {
    return (
      <AppScreen>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text>Loading dashboard...</Text>
        </View>
      </AppScreen>
    );
  }

  if (!authToken || !user) {
    return (
      <AppScreen>
        <View style={styles.center}>
          <Text style={styles.warningText}>
            You are not logged in. Please log in again.
          </Text>
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen scrollable contentContainerStyle={styles.container}>
      <Text style={styles.welcome}>
        Welcome{user?.name ? `, ${user.name}` : ''} {'👋'}
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Current Balance</Text>
        <Text style={styles.balanceText}>{formattedBalance}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Transactions</Text>
        {recentTransactions.length === 0 ? (
          <Text style={styles.muted}>No transactions yet.</Text>
        ) : (
          recentTransactions.map((tx) => (
            <View key={tx.id} style={styles.txRow}>
              <View>
                <Text style={styles.txAmount}>
                  {Number(tx.amount || 0).toLocaleString('en-US', {
                    style: 'currency',
                    currency: tx.currency || 'USD',
                  })}
                </Text>
                <Text style={styles.txMeta}>
                  {tx.type === 'sent' ? 'Sent to' : 'Received from'} {tx.counterpart || 'Unknown'}
                </Text>
                {tx.note && <Text style={styles.txNote}>{tx.note}</Text>}
              </View>
              <Text style={styles.txMeta}>
                {tx.timestamp
                  ? new Date(tx.timestamp).toLocaleDateString()
                  : ''}
              </Text>
            </View>
          ))
        )}
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  welcome: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  balanceText: {
    fontSize: 28,
    fontWeight: '700',
  },
  txRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomColor: '#e5e7eb',
    borderBottomWidth: 1,
  },
  txAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  txMeta: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  txNote: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
    fontStyle: 'italic',
  },
  muted: {
    color: '#9ca3af',
  },
  warningText: {
    color: '#ef4444',
    fontSize: 16,
  },
});

export default Home;
