import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; 

const Bar = () => {
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <FontAwesome5 name="home" size={24} color="white" />
        <Text style={styles.label}>Home</Text>
      </View>

      <View style={styles.item}>
        <FontAwesome5 name="exchange-alt" size={24} color="white" />
        <Text style={styles.label}>Transfer/Send</Text>
      </View>

      <View style={styles.item}>
        <FontAwesome5 name="clock" size={24} color="white" />
        <Text style={styles.label}>History</Text>
      </View>

      <View style={styles.item}>
        <FontAwesome5 name="cog" size={24} color="white" />
        <Text style={styles.label}>Profile/Settings</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
  },
  item: {
    alignItems: 'center',
  },
  label: {
    color: 'white',
    marginTop: 5,
    fontSize: 12,
  },
});

export default Bar;
