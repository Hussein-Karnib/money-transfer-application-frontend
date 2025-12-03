import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { validateAmount } from '../utils/validation';
import AppScreen from '../components/AppScreen';

const ReceiveMoneyScreen = () => {
  const { user, receiveMoney, requestMoney } = useAppContext();
  const [sender, setSender] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const [requestRecipient, setRequestRecipient] = useState('');
  const [requestAmount, setRequestAmount] = useState('');
  const [requestNote, setRequestNote] = useState('');

  const canReceive = useMemo(() => validateAmount(amount), [amount]);
  const canRequest = useMemo(
    () => requestRecipient.trim().length > 0 && validateAmount(requestAmount),
    [requestAmount, requestRecipient],
  );

  const handleReceive = async () => {
    try {
      const transaction = await receiveMoney({ 
        counterpart: sender || 'Unknown sender', 
        amount, 
        note 
      });
      Alert.alert('Funds received', `Added $${transaction.amount.toFixed(2)} to your balance.`);
      setSender('');
      setAmount('');
      setNote('');
    } catch (error) {
      Alert.alert('Failed to register funds', error.message);
    }
  };

  const handleRequest = async () => {
    try {
      const request = await requestMoney({ 
        counterpart: requestRecipient, 
        amount: requestAmount, 
        note: requestNote 
      });
      Alert.alert('Request sent', `Tracking ID: ${request.requestId}`);
      setRequestRecipient('');
      setRequestAmount('');
      setRequestNote('');
    } catch (error) {
      Alert.alert('Request failed', error.message);
    }
  };

  return (
    <AppScreen scrollable contentContainerStyle={styles.container}>
        <Text style={styles.title}>Receive Money</Text>
        <Text style={styles.subtitle}>Log incoming funds or request money from others.</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your SwiftSend ID</Text>
          <Text style={styles.userId}>{user?.id || 'N/A'}</Text>
          <Text style={styles.cardSubtitle}>Share this ID with people who need to transfer money to you.</Text>
        </View>

        <View style={styles.formBlock}>
          <Text style={styles.blockTitle}>Log incoming funds</Text>
          <TextInput
            placeholder="Sender name or account"
            style={styles.input}
            value={sender}
            onChangeText={setSender}
          />
          <TextInput
            placeholder="Amount received"
            style={styles.input}
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
          <TextInput
            placeholder="Add a note (optional)"
            style={[styles.input, styles.multiline]}
            multiline
            numberOfLines={3}
            value={note}
            onChangeText={setNote}
          />

          <TouchableOpacity style={[styles.primaryButton, !canReceive && styles.buttonDisabled]} disabled={!canReceive} onPress={handleReceive}>
            <Text style={styles.primaryButtonText}>Confirm funds</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formBlock}>
          <Text style={styles.blockTitle}>Request money</Text>
          <TextInput
            placeholder="Recipient email or phone"
            style={styles.input}
            value={requestRecipient}
            onChangeText={setRequestRecipient}
          />
          <TextInput
            placeholder="Requested amount"
            style={styles.input}
            keyboardType="decimal-pad"
            value={requestAmount}
            onChangeText={setRequestAmount}
          />
          <TextInput
            placeholder="Reason (optional)"
            style={[styles.input, styles.multiline]}
            multiline
            numberOfLines={3}
            value={requestNote}
            onChangeText={setRequestNote}
          />
          <TouchableOpacity style={[styles.secondaryButton, !canRequest && styles.buttonDisabled]} disabled={!canRequest} onPress={handleRequest}>
            <Text style={styles.secondaryButtonText}>Send request</Text>
          </TouchableOpacity>
        </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', color: '#101828' },
  subtitle: { fontSize: 15, color: '#475467', marginBottom: 20 },
  card: {
    backgroundColor: '#1d4ed8',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: { color: '#bfdbfe', fontSize: 14, letterSpacing: 0.5 },
  userId: { color: '#fff', fontSize: 28, fontWeight: '700', marginVertical: 12 },
  cardSubtitle: { color: '#dbeafe', fontSize: 14 },
  formBlock: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e4e7ec',
  },
  blockTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#e4e7ec',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#f8fafc',
  },
  multiline: { height: 90, textAlignVertical: 'top' },
  primaryButton: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  secondaryButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0f172a',
  },
  secondaryButtonText: { color: '#0f172a', fontSize: 17, fontWeight: '600' },
  buttonDisabled: { opacity: 0.6 },
});

export default ReceiveMoneyScreen;

