// screens/BeneficiariesScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useAppContext } from '../context/AppContext';
import AppScreen from '../components/AppScreen';

const BeneficiariesScreen = () => {
  const { loadBeneficiaries, addBeneficiary } = useAppContext();
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [method, setMethod] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const list = await loadBeneficiaries();
        setBeneficiaries(list);
      } catch (e) {
        console.log('Failed to load beneficiaries', e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [loadBeneficiaries]);

  const handleAddBeneficiary = async () => {
    if (!name.trim() || !country.trim() || !method.trim()) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }

    try {
      await addBeneficiary({ name, country, method });
      Alert.alert('Success', 'Beneficiary added successfully!');
      setName('');
      setCountry('');
      setMethod('');
      setShowForm(false);
      // Refresh list
      const list = await loadBeneficiaries();
      setBeneficiaries(list);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to add beneficiary');
    }
  };

  if (loading) {
    return (
      <AppScreen>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator />
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen scrollable contentContainerStyle={styles.container}>
      <Text style={styles.title}>Beneficiaries</Text>
      <Text style={styles.subtitle}>Manage your saved recipients</Text>

      {!showForm ? (
        <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(true)}>
          <Text style={styles.addButtonText}>+ Add Beneficiary</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.form}>
          <Text style={styles.formTitle}>Add New Beneficiary</Text>
          <TextInput
            placeholder="Full Name"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            placeholder="Country"
            style={styles.input}
            value={country}
            onChangeText={setCountry}
          />
          <TextInput
            placeholder="Payout Method (e.g., Bank Deposit, Mobile Wallet)"
            style={styles.input}
            value={method}
            onChangeText={setMethod}
          />
          <View style={styles.formButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => {
              setShowForm(false);
              setName('');
              setCountry('');
              setMethod('');
            }}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleAddBeneficiary}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {beneficiaries.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No beneficiaries yet.</Text>
          <Text style={styles.emptySubtext}>Add a beneficiary to start sending money</Text>
        </View>
      ) : (
        beneficiaries.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.cardName}>{item.full_name ?? item.name}</Text>
              <Text style={styles.cardMeta}>{item.country}</Text>
              <Text style={styles.cardMeta}>{item.method || item.payout_method}</Text>
            </View>
            <View style={[styles.badge, item.verified ? styles.badgeVerified : styles.badgePending]}>
              <Text style={styles.badgeText}>{item.verified ? 'Verified' : 'Pending'}</Text>
            </View>
          </View>
        ))
      )}
    </AppScreen>
  );
};

export default BeneficiariesScreen;


const styles = StyleSheet.create({
  container: { paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: '700', color: '#0f172a', marginBottom: 8 },
  subtitle: { color: '#475467', marginBottom: 20 },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e4e7ec',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#0f172a',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d0d5dd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    backgroundColor: '#f8fafc',
    fontSize: 16,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  addButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    flex: 1,
  },
  cancelButton: {
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d0d5dd',
    flex: 1,
  },
  cancelButtonText: {
    color: '#475467',
    fontWeight: '600',
  },
  addButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e4e7ec',
  },
  cardContent: {
    flex: 1,
  },
  cardName: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  cardMeta: { color: '#475467', fontSize: 14, marginBottom: 2 },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeVerified: { backgroundColor: '#dcfce7' },
  badgePending: { backgroundColor: '#fee2e2' },
  badgeText: { color: '#0f172a', fontWeight: '600', fontSize: 12 },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e4e7ec',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
  },
});
