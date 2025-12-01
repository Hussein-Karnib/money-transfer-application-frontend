import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../context/AppContext';
import AppScreen from '../components/AppScreen';

const ServiceSearchScreen = () => {
  const { services } = useAppContext();
  const [destination, setDestination] = useState('');
  const [payout, setPayout] = useState('');
  const [speed, setSpeed] = useState('');

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const destinationMatch =
        !destination || service.corridor.toLowerCase().includes(destination.toLowerCase());
      const payoutMatch = !payout || service.payout.toLowerCase().includes(payout.toLowerCase());
      const speedMatch = !speed || service.speed.toLowerCase().includes(speed.toLowerCase());
      return destinationMatch && payoutMatch && speedMatch;
    });
  }, [destination, payout, services, speed]);

  return (
    <AppScreen scrollable contentContainerStyle={styles.container}>
        <Text style={styles.title}>Find Transfer Services</Text>
        <Text style={styles.subtitle}>
          Filter by destination, fee, payout method, or promotions to choose the best corridor.
        </Text>

        <View style={styles.filters}>
          <TextInput
            placeholder="Destination country"
            style={styles.input}
            value={destination}
            onChangeText={setDestination}
          />
          <TextInput placeholder="Payout method" style={styles.input} value={payout} onChangeText={setPayout} />
          <TextInput placeholder="Transfer speed" style={styles.input} value={speed} onChangeText={setSpeed} />
        </View>

        {filteredServices.map((service) => (
          <View key={service.id} style={styles.card}>
            <Text style={styles.cardTitle}>{service.corridor}</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Speed:</Text>
              <Text style={styles.value}>{service.speed}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Fees:</Text>
              <Text style={styles.value}>${service.fees.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>FX rate:</Text>
              <Text style={styles.value}>{service.fxRate}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Payout:</Text>
              <Text style={styles.value}>{service.payout}</Text>
            </View>
            <Text style={styles.promo}>{service.promo}</Text>
            <TouchableOpacity style={styles.cta}>
              <Text style={styles.ctaText}>Start transfer</Text>
            </TouchableOpacity>
          </View>
        ))}

        {filteredServices.length === 0 && <Text style={styles.empty}>No services match the filters yet.</Text>}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: '700', color: '#101828' },
  subtitle: { fontSize: 14, color: '#475467', marginBottom: 20 },
  filters: { marginBottom: 20 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#d0d5dd',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e4e7ec',
  },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12, color: '#0f172a' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { color: '#475467', fontWeight: '600' },
  value: { color: '#101828' },
  promo: { marginTop: 10, color: '#0f766e', fontWeight: '600' },
  cta: {
    marginTop: 16,
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ctaText: { color: '#fff', fontWeight: '600' },
  empty: { textAlign: 'center', color: '#98a2b3', marginTop: 40 },
});

export default ServiceSearchScreen;

