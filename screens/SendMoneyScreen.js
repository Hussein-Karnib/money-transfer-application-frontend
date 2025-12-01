import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { validateAmount } from '../utils/validation';
import AppScreen from '../components/AppScreen';

const SendMoneyScreen = () => {
  const { balance, sendMoney, fxRates, transferFeePercent, formatCurrency } = useAppContext();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [summary, setSummary] = useState(null);

  const currencies = Object.keys(fxRates);

  const breakdown = useMemo(() => {
    if (!validateAmount(amount)) {
      return { converted: 0, fee: 0, total: 0 };
    }
    const rate = fxRates[currency] ?? 1;
    const converted = Number(amount) * rate;
    const fee = converted * transferFeePercent;
    return {
      converted,
      fee,
      total: converted + fee,
      rate,
    };
  }, [amount, currency, fxRates, transferFeePercent]);

  const canSubmit = useMemo(() => {
    if (!recipient.trim()) return false;
    if (!validateAmount(amount)) return false;
    return breakdown.total > 0 && breakdown.total <= balance;
  }, [amount, balance, breakdown.total, recipient]);

  const handleSubmit = () => {
    try {
      const transaction = sendMoney({ counterpart: recipient, amount, note, currency });
      setSummary(transaction);
      setRecipient('');
      setAmount('');
      setNote('');
      setCurrency('USD');
      Alert.alert(
        'Transfer complete',
        `You sent ${formatCurrency(transaction.amount, transaction.currency || 'USD')} to ${transaction.counterpart}.`,
      );
    } catch (error) {
      Alert.alert('Transfer failed', error.message);
    }
  };

  return (
    <AppScreen scrollable contentContainerStyle={styles.container}>
        <Text style={styles.title}>Send Money</Text>
        <Text style={styles.subtitle}>Current balance: ${balance.toLocaleString()}</Text>
        <View style={styles.securityBanner}>
          <Text style={styles.securityTitle}>Protected transfer</Text>
          <Text style={styles.securityText}>
            Sensitive details are validated and encrypted before posting. Choose a currency to view FX and fees instantly.
          </Text>
        </View>

        <View style={styles.currencySelector}>
          {currencies.map((code) => (
            <TouchableOpacity
              key={code}
              style={[styles.currencyChip, currency === code && styles.currencyChipActive]}
              onPress={() => setCurrency(code)}
            >
              <Text style={[styles.currencyChipText, currency === code && styles.currencyChipTextActive]}>{code}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.securityBanner}>
          <Text style={styles.securityTitle}>Protected transfer</Text>
          <Text style={styles.securityText}>Sensitive details are validated and encrypted before posting.</Text>
        </View>

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

        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Transfer summary</Text>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Amount</Text>
            <Text style={styles.breakdownValue}>{formatCurrency(Number(amount) || 0, currency)}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Exchange rate</Text>
            <Text style={styles.breakdownValue}>
              1 {currency} ≈ {formatCurrency(fxRates[currency] ?? 1, 'USD')}
            </Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Converted (USD)</Text>
            <Text style={styles.breakdownValue}>{formatCurrency(breakdown.converted, 'USD')}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Fee ({(transferFeePercent * 100).toFixed(2)}%)</Text>
            <Text style={styles.breakdownValue}>{formatCurrency(breakdown.fee, 'USD')}</Text>
          </View>
          <View style={[styles.breakdownRow, styles.breakdownTotal]}>
            <Text style={styles.breakdownLabel}>Total debit</Text>
            <Text style={styles.breakdownValue}>{formatCurrency(breakdown.total, 'USD')}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
          disabled={!canSubmit}
          onPress={handleSubmit}
        >
          <Text style={styles.submitText}>Confirm transfer</Text>
        </TouchableOpacity>

        {summary && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Most recent transfer</Text>
            <Text style={styles.summaryValue}>{formatCurrency(summary.amount, summary.currency || 'USD')}</Text>
            <Text style={styles.summaryMeta}>Recipient: {summary.counterpart}</Text>
            {summary.note ? <Text style={styles.summaryMeta}>Message: {summary.note}</Text> : null}
            {summary.currency && (
              <Text style={styles.summaryMeta}>
                FX rate: 1 {summary.currency} ≈ {formatCurrency(summary.fxRate || 1, 'USD')}
              </Text>
            )}
            <Text style={styles.summaryMeta}>
              Security token: {summary.encryptedPayload.slice(0, 16)}
              ...
            </Text>
          </View>
        )}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 6, color: '#101828' },
  subtitle: { fontSize: 16, color: '#475467', marginBottom: 12 },
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
