import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { validateEmail } from '../utils/validation';
import AppScreen from '../components/AppScreen';

const FAQ = [
  {
    question: 'How long do domestic transfers take?',
    answer: 'Most transfers are instant. In rare cases they can take up to 30 minutes due to partner bank checks.',
  },
  {
    question: 'How do I reset my PIN?',
    answer: 'Open Settings → Security → Reset PIN. You will need access to your registered email.',
  },
  {
    question: 'Is my data encrypted?',
    answer: 'Yes. We hash sensitive payloads before saving and require TLS 1.3 for all network calls.',
  },
];

const SupportScreen = () => {
  const { submitSupportTicket } = useAppContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const canSubmit = useMemo(() => name.trim().length > 2 && validateEmail(email) && message.trim().length > 5, [email, message, name]);

  const handleSubmit = () => {
    try {
      const ticket = submitSupportTicket({ name, email, message });
      Alert.alert('Support request sent', `Ticket ${ticket.id} created successfully.`);
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      Alert.alert('Unable to submit', error.message);
    }
  };

  return (
    <AppScreen scrollable contentContainerStyle={styles.container}>
        <Text style={styles.title}>Support & Contact</Text>
        <Text style={styles.subtitle}>Need help? Reach out via the form or browse the FAQ below.</Text>

        <View style={styles.formCard}>
          <Text style={styles.cardTitle}>Contact form</Text>
          <TextInput placeholder="Full name" style={styles.input} value={name} onChangeText={setName} />
          <TextInput placeholder="Email address" style={styles.input} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
          <TextInput
            placeholder="How can we help?"
            style={[styles.input, styles.multiline]}
            multiline
            numberOfLines={4}
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]} onPress={handleSubmit} disabled={!canSubmit}>
            <Text style={styles.submitText}>Send message</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Customer service</Text>
          <Text style={styles.contactText}>support@swiftsend.app</Text>
          <Text style={styles.contactText}>+1 (800) 555-2048</Text>
          <Text style={styles.policyLink}>Privacy Policy • Terms of Service</Text>
        </View>

        <View style={styles.faqCard}>
          <Text style={styles.cardTitle}>FAQ</Text>
          {FAQ.map((item) => (
            <View key={item.question} style={styles.faqItem}>
              <Text style={styles.faqQuestion}>{item.question}</Text>
              <Text style={styles.faqAnswer}>{item.answer}</Text>
            </View>
          ))}
        </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', color: '#101828' },
  subtitle: { fontSize: 15, color: '#475467', marginBottom: 20 },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#d0d5dd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#f8fafc',
  },
  multiline: { height: 120, textAlignVertical: 'top' },
  submitButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: { opacity: 0.6 },
  submitText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  infoCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  contactText: { color: '#e2e8f0', fontSize: 16, marginBottom: 4 },
  policyLink: { color: '#60a5fa', marginTop: 12, textDecorationLine: 'underline' },
  faqCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e4e7ec',
  },
  faqItem: { marginBottom: 16 },
  faqQuestion: { fontSize: 16, fontWeight: '600', color: '#101828' },
  faqAnswer: { marginTop: 4, color: '#475467', lineHeight: 20 },
});

export default SupportScreen;

