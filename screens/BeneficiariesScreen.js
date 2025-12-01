import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../context/AppContext';
import AppScreen from '../components/AppScreen';

const BeneficiariesScreen = () => {
  const { beneficiaries, addBeneficiary } = useAppContext();
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [method, setMethod] = useState('');

  const verifiedCount = useMemo(
    () => beneficiaries.filter((beneficiary) => beneficiary.verified).length,
    [beneficiaries],
  );

  const handleAdd = () => {
    try {
      addBeneficiary({ name, country, method });
      Alert.alert('Beneficiary added', 'Verification pending.');
      setName('');
      setCountry('');
      setMethod('');
    } catch (error) {
      Alert.alert('Cannot add beneficiary', error.message);
    }
  };

  return (
    <AppScreen scrollable contentContainerStyle={styles.container}>
        <Text style={styles.title}>Beneficiaries</Text>
        <Text style={styles.subtitle}>
          Verified recipients: {verifiedCount}/{beneficiaries.length}
        </Text>

        <View style={styles.form}>
          <TextInput placeholder="Full name" style={styles.input} value={name} onChangeText={setName} />
          <TextInput placeholder="Country" style={styles.input} value={country} onChangeText={setCountry} />
          <TextInput
            placeholder="Preferred payout method"
            style={styles.input}
            value={method}
            onChangeText={setMethod}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Text style={styles.addButtonText}>Add beneficiary</Text>
          </TouchableOpacity>
        </View>

        {beneficiaries.map((beneficiary) => (
          <View key={beneficiary.id} style={styles.card}>
            <View>
              <Text style={styles.cardName}>{beneficiary.name}</Text>
              <Text style={styles.cardMeta}>{beneficiary.country}</Text>
              <Text style={styles.cardMeta}>{beneficiary.method}</Text>
            </View>
            <View style={[styles.badge, beneficiary.verified ? styles.badgeVerified : styles.badgePending]}>
              <Text style={styles.badgeText}>{beneficiary.verified ? 'Verified' : 'Pending'}</Text>
            </View>
          </View>
        ))}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: '700', color: '#0f172a' },
  subtitle: { color: '#475467', marginBottom: 20 },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e4e7ec',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d0d5dd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    backgroundColor: '#f8fafc',
  },
  addButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontWeight: '600' },
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
  cardName: { fontSize: 18, fontWeight: '600' },
  cardMeta: { color: '#475467' },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeVerified: { backgroundColor: '#dcfce7' },
  badgePending: { backgroundColor: '#fee2e2' },
  badgeText: { color: '#0f172a', fontWeight: '600' },
});

export default BeneficiariesScreen;

