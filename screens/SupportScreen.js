import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native';
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
  const { submitSupportTicket, supportTickets, role } = useAppContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const canSubmit = useMemo(() => name.trim().length > 2 && validateEmail(email) && message.trim().length > 5, [email, message, name]);

  const handleSubmit = async () => {
    try {
      const ticket = await submitSupportTicket({ name, email, message });
      Alert.alert('Support request sent', `Ticket ${ticket.id} created successfully.`);
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      Alert.alert('Unable to submit', error.message);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Admin view: Show customer support chat (read-only)
  if (role === 'admin') {
    return (
      <AppScreen scrollable contentContainerStyle={styles.container}>
        <Text style={styles.title}>Customer Support Chat</Text>
        <Text style={styles.subtitle}>View all customer support messages and inquiries.</Text>

        {supportTickets.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No support tickets yet</Text>
            <Text style={styles.emptySubtext}>Customer messages will appear here</Text>
          </View>
        ) : (
          <View style={styles.chatContainer}>
            {supportTickets.map((ticket) => (
              <View key={ticket.id} style={styles.chatMessage}>
                <View style={styles.messageHeader}>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{ticket.name}</Text>
                    <Text style={styles.userEmail}>{ticket.email}</Text>
                  </View>
                  <View style={styles.ticketInfo}>
                    <Text style={styles.ticketId}>{ticket.id}</Text>
                    <Text style={styles.messageTime}>{formatDate(ticket.timestamp)}</Text>
                  </View>
                </View>
                <View style={styles.messageBubble}>
                  <Text style={styles.messageText}>{ticket.message}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </AppScreen>
    );
  }

  // Regular user view: Show form to submit support tickets
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
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
    } : {
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 10,
      elevation: 2,
    }),
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
  chatContainer: {
    marginTop: 20,
  },
  chatMessage: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e4e7ec',
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    } : {
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: 2,
    }),
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f5',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#101828',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#475467',
  },
  ticketInfo: {
    alignItems: 'flex-end',
  },
  ticketId: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A90E2',
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 12,
    color: '#94a3b8',
  },
  messageBubble: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#4A90E2',
  },
  messageText: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e4e7ec',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#101828',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
  },
});

export default SupportScreen;

