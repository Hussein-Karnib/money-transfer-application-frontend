import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import Header from '../Home/header';
import Bar from '../MoreStuff/bar';
import { useAppContext } from '../context/AppContext';

const AppScreen = ({
  children,
  scrollable = false,
  contentContainerStyle,
  bodyStyle,
  withBar = true,
}) => {
  const { transactions } = useAppContext();
  const image = require('../assets/profile.png');
  const Container = scrollable ? ScrollView : View;
  const containerProps = scrollable
    ? { contentContainerStyle: [styles.scrollContent, contentContainerStyle] }
    : { style: [styles.body, bodyStyle] };

  return (
    <SafeAreaView style={styles.screen}>
      <Header image={image} transaction={transactions.length} />
      <Container {...containerProps}>{children}</Container>
      {withBar && (
        <View style={styles.barWrapper}>
          <Bar />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f5f7fb' },
  scrollContent: { padding: 20, paddingBottom: 120 },
  body: { flex: 1, padding: 20, paddingBottom: 120 },
  barWrapper: { borderTopWidth: 0, backgroundColor: 'transparent' },
});

export default AppScreen;

