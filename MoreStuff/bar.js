import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';

const Bar = ({ Name, Birth, ProfileImage, SetProfileImage }) => {
  const navigation = useNavigation(); // hook to navigate

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Home')}>
        <FontAwesome5 name="home" size={24} color="white" />
        <Text style={styles.label}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Notifications')}>
        <FontAwesome5 name="exchange-alt" size={24} color="white" />
        <Text style={styles.label}>Transfer/Send</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Home')}>
        <FontAwesome5 name="clock" size={24} color="white" />
        <Text style={styles.label}>History</Text>
      </TouchableOpacity>

      {}
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          navigation.navigate('Settings', {
            Name,
            Birth,
            ProfileImage,
            SetProfileImage,
          })
        }
      >
        <FontAwesome5 name="cog" size={24} color="white" />
        <Text style={styles.label}>Profile/Settings</Text>
      </TouchableOpacity>
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
