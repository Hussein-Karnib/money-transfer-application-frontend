import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from './Home/home';
import Notifications from './Home/notification';
import Settings from './ProfileSettings/settings';
import WelcomeScreen from './screens/WelcomeScreen';
import SendMoneyScreen from './screens/SendMoneyScreen';
import ReceiveMoneyScreen from './screens/ReceiveMoneyScreen';
import TransactionHistoryScreen from './screens/TransactionHistoryScreen';
import SupportScreen from './screens/SupportScreen';
import LoginScreen from './login';
import ServiceSearchScreen from './screens/ServiceSearchScreen';
import BeneficiariesScreen from './screens/BeneficiariesScreen';
import AgentConsoleScreen from './screens/AgentConsoleScreen';
import AdminConsoleScreen from './screens/AdminConsoleScreen';
import AgentMapScreen from './screens/AgentMapScreen';
import { AppProvider, useAppContext } from './context/AppContext';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const drawerScreensByRole = {
  user: [
    { name: 'Dashboard', component: Home, options: { headerTitle: 'Dashboard' } },
    { name: 'Send Money', component: SendMoneyScreen },
    { name: 'Receive Money', component: ReceiveMoneyScreen },
    { name: 'Transactions', component: TransactionHistoryScreen },
    { name: 'Service Search', component: ServiceSearchScreen },
    { name: 'Beneficiaries', component: BeneficiariesScreen },
    { name: 'Agents Near You', component: AgentMapScreen },
    { name: 'Support', component: SupportScreen },
    { name: 'Settings', component: Settings },
  ],
  agent: [
    { name: 'Dashboard', component: AgentConsoleScreen, options: { headerTitle: 'Agent Console' } },
    { name: 'Receive Money', component: ReceiveMoneyScreen },
    { name: 'Transactions', component: TransactionHistoryScreen },
    { name: 'Agents Near You', component: AgentMapScreen },
    { name: 'Support', component: SupportScreen },
    { name: 'Settings', component: Settings },
  ],
  admin: [
    { name: 'Dashboard', component: AdminConsoleScreen, options: { headerTitle: 'Admin Console' } },
    { name: 'Agents Near You', component: AgentMapScreen },
    { name: 'Support', component: SupportScreen },
    { name: 'Settings', component: Settings },
  ],
};

const RoleAwareDrawer = () => {
  const { role } = useAppContext();
  const screens = drawerScreensByRole[role] || drawerScreensByRole.user;
  const enhancedScreens = [
    ...screens,
    {
      name: 'Notifications',
      component: Notifications,
      options: { drawerItemStyle: { display: 'none' } },
    },
  ];

  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerStyle: { backgroundColor: '#4A90E2' },
        headerTintColor: '#fff',
        sceneContainerStyle: { backgroundColor: '#f5f7fb' },
        headerShown: false,
      }}
    >
      {enhancedScreens.map(({ name, component, options }) => (
        <Drawer.Screen key={name} name={name} component={component} options={options} />
      ))}
    </Drawer.Navigator>
  );
};

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Auth" component={LoginScreen} />
          <Stack.Screen name="Main" component={RoleAwareDrawer} />
          <Stack.Screen name="Notifications" component={Notifications} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
