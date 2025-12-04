import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, Platform } from 'react-native';
import { useAppContext } from '../context/AppContext';
import AppScreen from '../components/AppScreen';

const SendMoneyScreen = () => {
  const {
    loadBeneficiaries,
    createTransfer,
    user,
    balance,
  } = useAppContext();

  const [beneficiaries, setBeneficiaries] = useState([]);
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBens = async () => {
      try {
        const list = await loadBeneficiaries();
        setBeneficiaries(list);
        if (list.length > 0) {
          setSelectedBeneficiaryId(list[0].id);
        }
      } catch (e) {
        console.log('Failed to load beneficiaries in SendMoneyScreen', e.message);
      }
    };

    fetchBens();
  }, []);

  const handleSend = async () => {
    if (!selectedBeneficiaryId) {
      Alert.alert('Select beneficiary', 'Please choose a beneficiary.');
      return;
    }

    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid amount.');
      return;
    }

    if (numericAmount > (balance || 0)) {
      Alert.alert('Insufficient balance', 'You do not have enough funds.');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        amount: numericAmount,
        currency,
        beneficiary_id: selectedBeneficiaryId,
        note: note.trim(),
      };

      const result = await createTransfer(payload);

      Alert.alert(
        'Transfer Successful',
        `You sent ${currency} ${numericAmount.toFixed(2)} successfully!`,
        [{ text: 'OK', onPress: () => {
          setAmount('');
          setNote('');
        }}]
      );
    } catch (e) {
      console.log('createTransfer error', e.message);
      Alert.alert('Error', e.message || 'Failed to create transfer.');
    } finally {
      setLoading(false);
    }
  };

  const selectedBeneficiary = beneficiaries.find(b => b.id === selectedBeneficiaryId);
  const numericAmount = Number(amount) || 0;
  const fee = numericAmount * 0.0125;
  const totalAmount = numericAmount + fee;
  const canSend = selectedBeneficiaryId && numericAmount > 0 && totalAmount <= (balance || 0);

  return (
    <AppScreen scrollable contentContainerStyle={styles.container}>
      <Text style={styles.title}>Send Money</Text>
      <Text style={styles.subtitle}>Transfer funds to your beneficiaries</Text>

      {beneficiaries.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No beneficiaries yet</Text>
          <Text style={styles.emptySubtext}>Add a beneficiary first to send money</Text>
        </View>
      ) : (
        <>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Select Beneficiary</Text>
            <View style={styles.beneficiarySelector}>
              {beneficiaries.map((ben) => (
                <TouchableOpacity
                  key={ben.id}
                  style={[
                    styles.beneficiaryChip,
                    selectedBeneficiaryId === ben.id && styles.beneficiaryChipActive,
                  ]}
                  onPress={() => setSelectedBeneficiaryId(ben.id)}
                >
                  <Text
                    style={[
                      styles.beneficiaryChipText,
                      selectedBeneficiaryId === ben.id && styles.beneficiaryChipTextActive,
                    ]}
                  >
                    {ben.name} - {ben.country}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Amount ({currency})</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Note (optional)</Text>
            <TextInput
              style={[styles.input, styles.multiline]}
              placeholder="Add a note for this transfer"
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={3}
            />
          </View>

          {numericAmount > 0 && (
            <View style={styles.breakdownCard}>
              <Text style={styles.breakdownTitle}>Transfer Summary</Text>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Amount</Text>
                <Text style={styles.breakdownValue}>{currency} {numericAmount.toFixed(2)}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Fee (1.25%)</Text>
                <Text style={styles.breakdownValue}>{currency} {fee.toFixed(2)}</Text>
              </View>
              <View style={[styles.breakdownRow, styles.breakdownTotal]}>
                <Text style={[styles.breakdownLabel, { fontWeight: '700' }]}>Total</Text>
                <Text style={[styles.breakdownValue, { fontWeight: '700' }]}>
                  {currency} {totalAmount.toFixed(2)}
                </Text>
              </View>
              {totalAmount > (balance || 0) && (
                <Text style={styles.insufficientText}>Insufficient balance</Text>
              )}
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitButton, (!canSend || loading) && styles.submitButtonDisabled]}
            onPress={handleSend}
            disabled={!canSend || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Send Money</Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </AppScreen>
  );
};



const styles = StyleSheet.create({
  container: { paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 6, color: '#101828' },
  subtitle: { fontSize: 16, color: '#475467', marginBottom: 20 },
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
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
  },
  beneficiarySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  beneficiaryChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d0d5dd',
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  beneficiaryChipActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  beneficiaryChipText: {
    color: '#475467',
    fontWeight: '600',
    fontSize: 14,
  },
  beneficiaryChipTextActive: {
    color: '#fff',
  },
  insufficientText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 8,
    fontWeight: '600',
  },
  securityBanner: {
    backgroundColor: '#ecfeff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#cffafe',
    marginBottom: 16,
  },
  securityTitle: { fontWeight: '700', color: '#0f172a' },
  securityText: { color: '#0f172a', marginTop: 4 },
  currencySelector: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  currencyChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cbd5f5',
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  currencyChipActive: { backgroundColor: '#4A90E2', borderColor: '#4A90E2' },
  currencyChipText: { color: '#4A90E2', fontWeight: '600' },
  currencyChipTextActive: { color: '#fff' },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#344054', marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#d0d5dd',
    fontSize: 16,
  },
  multiline: { height: 90, textAlignVertical: 'top' },
  helpText: { fontSize: 12, color: '#98a2b3', marginTop: 4 },
  breakdownCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e4e7ec',
    marginBottom: 16,
  },
  breakdownTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10, color: '#0f172a' },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  breakdownLabel: { color: '#475467' },
  breakdownValue: { color: '#0f172a', fontWeight: '600' },
  breakdownTotal: { borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 8 },
  submitButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: { opacity: 0.6 },
  submitText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  summaryCard: {
    marginTop: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 3px 8px rgba(0, 0, 0, 0.1)',
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    }),
  },
  summaryTitle: { fontSize: 16, fontWeight: '600', color: '#475467' },
  summaryValue: { fontSize: 30, fontWeight: '700', marginVertical: 10, color: '#101828' },
  summaryMeta: { fontSize: 13, color: '#667085', marginTop: 4 },
});

export default SendMoneyScreen;
