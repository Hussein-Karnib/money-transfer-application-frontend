import React, { useMemo, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { validateAmount } from '../utils/validation';

const SendMoneyScreen = () => {
  const { balance, sendMoney } = useAppContext();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [summary, setSummary] = useState(null);

  const canSubmit = useMemo(
    () => recipient.trim().length > 0 && validateAmount(amount) && Number(amount) <= balance,
    [amount, balance, recipient],
  );

  const handleSubmit = () => {
    try {
      const transaction = sendMoney({ counterpart: recipient, amount, note });
      setSummary(transaction);
      setRecipient('');
      setAmount('');
      setNote('');
      Alert.alert('Transfer complete', `You sent $${transaction.amount.toFixed(2)} to ${transaction.counterpart}.`);
    } catch (error) {
      Alert.alert('Transfer failed', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Send Money</Text>
        <Text style={styles.subtitle}>Current balance: ${balance.toLocaleString()}</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Recipient ID / Phone / Email</Text>
          <TextInput
            placeholder="e.g. jamie.lee@example.com"
            style={styles.input}
            value={recipient}
            onChangeText={setRecipient}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            placeholder="0.00"
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />
          <Text style={styles.helpText}>Transfers above your balance are blocked automatically.</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Message (optional)</Text>
          <TextInput
            placeholder="Add a quick note"
            style={[styles.input, styles.multiline]}
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]} disabled={!canSubmit} onPress={handleSubmit}>
          <Text style={styles.submitText}>Confirm transfer</Text>
        </TouchableOpacity>

        {summary && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Most recent transfer</Text>
            <Text style={styles.summaryValue}>${summary.amount.toFixed(2)}</Text>
            <Text style={styles.summaryMeta}>Recipient: {summary.counterpart}</Text>
            {summary.note ? <Text style={styles.summaryMeta}>Message: {summary.note}</Text> : null}
            <Text style={styles.summaryMeta}>Security token: {summary.encryptedPayload.slice(0, 16)}...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f5f7fb' },
  container: { padding: 20, paddingBottom: 80 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 6, color: '#101828' },
  subtitle: { fontSize: 16, color: '#475467', marginBottom: 20 },
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryTitle: { fontSize: 16, fontWeight: '600', color: '#475467' },
  summaryValue: { fontSize: 30, fontWeight: '700', marginVertical: 10, color: '#101828' },
  summaryMeta: { fontSize: 13, color: '#667085', marginTop: 4 },
});

export default SendMoneyScreen;

