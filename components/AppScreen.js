import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../Home/header';
import Bar from '../MoreStuff/bar';
import { useAppContext } from '../context/AppContext';

const AppScreen = ({
  children,
  scrollable = false,
  contentContainerStyle,
  bodyStyle,
  withBar = true,
  refreshEnabled = true,
}) => {
  const { transactions, refreshAppData, refreshing } = useAppContext();
  const image = require('../assets/profile.png');
  const insets = useSafeAreaInsets();
  const baseBottomPadding = withBar ? 120 : 40;
  const refreshControl =
    refreshEnabled && refreshAppData && scrollable
      ? (
        <RefreshControl
          refreshing={!!refreshing}
          onRefresh={refreshAppData}
          colors={['#4A90E2']}
          tintColor="#4A90E2"
        />
      )
      : undefined;

  const containerProps = scrollable
    ? {
        contentContainerStyle: [
          styles.scrollContent,
          contentContainerStyle,
          { paddingBottom: baseBottomPadding + insets.bottom },
        ],
        showsVerticalScrollIndicator: false,
        refreshControl,
      }
    : {
        style: [
          styles.body,
          bodyStyle,
          { paddingBottom: baseBottomPadding + insets.bottom },
        ],
      };

  return (
    <SafeAreaView
      style={[
        styles.screen,
        {
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <Header image={image} transaction={transactions.length} />
      {scrollable ? (
        <ScrollView {...containerProps}>{children}</ScrollView>
      ) : (
        <View style={containerProps.style}>{children}</View>
      )}
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
  scrollContent: { padding: 20 },
  body: { flexGrow: 1, padding: 20 },
  barWrapper: { borderTopWidth: 0, backgroundColor: 'transparent' },
});

export default AppScreen;
