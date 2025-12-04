import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { useAppContext } from '../context/AppContext';
import AppScreen from '../components/AppScreen';

const AgentConsoleScreen = () => {
  const { agents, updateAgent } = useAppContext();
  const primaryAgent = agents[0] || { id: 'AG-21', name: 'My Store', city: '', hours: '', status: 'Open', commissions: '' };
  
  const [isEditing, setIsEditing] = useState(false);
  const [storeName, setStoreName] = useState(primaryAgent.name);
  const [city, setCity] = useState(primaryAgent.city || '');
  const [hours, setHours] = useState(primaryAgent.hours || '');

  
  useEffect(() => {
    if (primaryAgent) {
      setStoreName(primaryAgent.name || '');
      setCity(primaryAgent.city || '');
      setHours(primaryAgent.hours || '');
    }
  }, [primaryAgent]);

  const toggleStatus = async () => {
    try {
      await updateAgent(primaryAgent.id, { 
        status: primaryAgent.status === 'Open' ? 'Closed' : 'Open' 
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const handleSave = async () => {
    if (!storeName.trim()) {
      Alert.alert('Error', 'Store name is required');
      return;
    }
    
    try {
      await updateAgent(primaryAgent.id, {
        name: storeName.trim(),
        city: city.trim(),
        hours: hours.trim(),
      });
      setIsEditing(false);
      Alert.alert('Success', 'Store information updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update store information');
    }
  };

  const handleCancel = () => {
    setStoreName(primaryAgent.name);
    setCity(primaryAgent.city || '');
    setHours(primaryAgent.hours || '');
    setIsEditing(false);
  };

  return (
    <AppScreen scrollable contentContainerStyle={styles.container}>
        <Text style={styles.title}>Agent Console</Text>
        <Text style={styles.subtitle}>Manage cash operations, queue, and working hours.</Text>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Store Information</Text>
            {!isEditing ? (
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <Text style={styles.editButton}>Edit</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.editActions}>
                <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {isEditing ? (
            <>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Store Name</Text>
                <TextInput
                  style={styles.input}
                  value={storeName}
                  onChangeText={setStoreName}
                  placeholder="Enter store name"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.input}
                  value={city}
                  onChangeText={setCity}
                  placeholder="Enter city"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Hours</Text>
                <TextInput
                  style={styles.input}
                  value={hours}
                  onChangeText={setHours}
                  placeholder="e.g., 08:00 - 20:00"
                />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.cardMeta}>Store: {primaryAgent.name}</Text>
              {primaryAgent.city && <Text style={styles.cardMeta}>City: {primaryAgent.city}</Text>}
              {primaryAgent.hours && <Text style={styles.cardMeta}>Hours: {primaryAgent.hours}</Text>}
              {primaryAgent.commissions && <Text style={styles.cardMeta}>Commission: {primaryAgent.commissions}</Text>}
            </>
          )}

          <View style={[styles.badge, primaryAgent.status === 'Open' ? styles.badgeOpen : styles.badgeClosed]}>
            <Text style={styles.badgeText}>{primaryAgent.status}</Text>
          </View>
          <TouchableOpacity style={styles.cta} onPress={toggleStatus}>
            <Text style={styles.ctaText}>
              {primaryAgent.status === 'Open' ? 'Mark as closed' : 'Mark as open'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cash-in / Cash-out queue</Text>
          <Text style={styles.queueItem}>• 3 pending cash-out approvals</Text>
          <Text style={styles.queueItem}>• 1 high-value transfer requires ID verification</Text>
          <Text style={styles.queueItem}>• Settlements batch scheduled for 6pm</Text>
        </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', color: '#0f172a' },
  subtitle: { color: '#475467', marginBottom: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e4e7ec',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: { fontSize: 18, fontWeight: '700' },
  editButton: {
    color: '#4A90E2',
    fontWeight: '600',
    fontSize: 14,
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: '#e4e7ec',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: '#475467',
    fontWeight: '600',
    fontSize: 14,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#344054',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#d0d5dd',
    fontSize: 16,
  },
  cardMeta: { color: '#475467', marginBottom: 4 },
  badge: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  badgeOpen: { backgroundColor: '#dcfce7' },
  badgeClosed: { backgroundColor: '#fee2e2' },
  badgeText: { fontWeight: '700', color: '#0f172a' },
  cta: {
    marginTop: 16,
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ctaText: { color: '#fff', fontWeight: '600' },
  queueItem: { marginTop: 6, color: '#101828' },
});

export default AgentConsoleScreen;

