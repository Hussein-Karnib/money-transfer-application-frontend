import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Image } from 'react-native';
import Header from './header';
import Bar from '../MoreStuff/bar';

const Home = () => {
  const [transaction, setTransaction] = useState(2);
  const [name, setName] = useState('Default User');
  const [balance, setBalance] = useState(10000);
  const image = require('../assets/profile.png');

  return (
    <View style={styles.container}>
        <Header image={image} transaction={transaction} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        

        <View style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={styles.cardLabel}>Account Holder</Text>
            <Text style={styles.userName}>{name}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.cardBottom}>
            <Text style={styles.cardLabel}>Current Balance</Text>
            <Text style={styles.userBalance}>${balance.toLocaleString()}</Text>
          </View>
        </View>

       <View style={styles.section}>
  <View style={styles.separator} />
  <Text style={styles.title}>Recent Transactions</Text>
  <View style={styles.cardgroup}>
  </View>
</View>

      </ScrollView>

      <Bar />
    </View>
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
  textAlign: 'center' 
},

  cardgroup: { flexDirection: 'column', justifyContent: 'space-between' },
  separator: {
  height: 1,
  backgroundColor: '#ccc',
  marginVertical: 10,
  marginHorizontal: 16,
},

});

export default Home;
