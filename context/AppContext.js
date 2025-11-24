import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { basicEncrypt } from '../utils/security';

const AppContext = createContext();

export const ROLE_CONFIG = {
  user: {
    label: 'Regular User',
    permissions: [
      'transfer_send',
      'transfer_receive',
      'history_view',
      'beneficiary_manage',
      'support_access',
    ],
  },
  agent: {
    label: 'Agent / Partner',
    permissions: [
      'cashin_manage',
      'cashout_manage',
      'commission_view',
      'hours_manage',
      'map_visibility',
      'support_access',
    ],
  },
  admin: {
    label: 'Administrator',
    permissions: [
      'agent_approve',
      'compliance_monitor',
      'currency_manage',
      'fee_manage',
      'reporting_access',
      'fraud_detection',
    ],
  },
};

const INITIAL_TRANSACTIONS = [
  {
    id: 'TX-202501-0001',
    type: 'received',
    counterpart: 'FinPay Payroll',
    amount: 1500,
    note: 'Monthly Salary',
    timestamp: '2025-10-15T10:00:00.000Z',
  },
  {
    id: 'TX-202501-0002',
    type: 'sent',
    counterpart: 'Jamie Lee',
    amount: 120,
    note: 'Dinner refund',
    timestamp: '2025-10-18T18:45:00.000Z',
  },
  {
    id: 'TX-202501-0003',
    type: 'received',
    counterpart: 'Tasha Bank',
    amount: 300,
    note: 'Cashback bonus',
    timestamp: '2025-10-20T08:20:00.000Z',
  },
];

const INITIAL_NOTIFICATIONS = [
  'Account verified successfully',
  'Security tip: Enable biometric authentication',
  'Weekly summary ready to view',
];

const MOCK_SERVICES = [
  {
    id: 'SRV-1',
    corridor: 'USA → Kenya',
    speed: 'Instant',
    fees: 2.5,
    fxRate: 143.25,
    payout: 'M-Pesa wallet',
    promo: 'No fees for first transfer',
  },
  {
    id: 'SRV-2',
    corridor: 'UK → Philippines',
    speed: 'Same day',
    fees: 4.0,
    fxRate: 72.12,
    payout: 'Bank deposit',
    promo: 'Earn 2% cashback',
  },
];

const MOCK_BENEFICIARIES = [
  { id: 'BN-10', name: 'Jamie Lee', country: 'Canada', method: 'Bank deposit', verified: true },
  { id: 'BN-11', name: 'Amina Yusuf', country: 'Kenya', method: 'Mobile wallet', verified: false },
];

const MOCK_AGENTS = [
  {
    id: 'AG-21',
    name: 'SwiftSend Downtown',
    city: 'Nairobi',
    hours: '08:00 - 20:00',
    status: 'Open',
    commissions: '1.5%',
  },
  {
    id: 'AG-22',
    name: 'PayPoint Lisbon',
    city: 'Lisbon',
    hours: '09:00 - 18:00',
    status: 'Closed',
    commissions: '1.8%',
  },
];

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
    phone: '+1 (555) 123-4567',
    id: 'MT-458210',
    birthYear: 1996,
  });
  const [balance, setBalance] = useState(8250.75);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [supportTickets, setSupportTickets] = useState([]);
  const [role, setRole] = useState('user');
  const [services, setServices] = useState(MOCK_SERVICES);
  const [beneficiaries, setBeneficiaries] = useState(MOCK_BENEFICIARIES);
  const [agents, setAgents] = useState(MOCK_AGENTS);

  const appendNotification = useCallback((message) => {
    setNotifications((prev) => [message, ...prev].slice(0, 25));
  }, []);

  const buildTransaction = useCallback((payload) => {
    const encryptedPayload = basicEncrypt(payload);
    return {
      id: `TX-${Date.now()}`,
      encryptedPayload,
      ...payload,
    };
  }, []);

  const sendMoney = useCallback(
    ({ counterpart, amount, note }) => {
      const numericAmount = Number(amount);
      if (!counterpart?.trim()) {
        throw new Error('Recipient information is required');
      }
      if (Number.isNaN(numericAmount)) {
        throw new Error('Amount must be a valid number');
      }
      if (numericAmount <= 0) {
        throw new Error('Amount must be greater than zero');
      }
      if (numericAmount > balance) {
        throw new Error('Insufficient balance');
      }

      const transaction = buildTransaction({
        type: 'sent',
        counterpart: counterpart.trim(),
        amount: numericAmount,
        note: note?.trim() || '',
        timestamp: new Date().toISOString(),
      });

      setBalance((prev) => prev - numericAmount);
      setTransactions((prev) => [transaction, ...prev]);
      appendNotification(`You sent $${numericAmount.toFixed(2)} to ${transaction.counterpart}`);

      return transaction;
    },
    [appendNotification, balance, buildTransaction],
  );

  const receiveMoney = useCallback(
    ({ counterpart, amount, note }) => {
      const numericAmount = Number(amount);
      if (Number.isNaN(numericAmount) || numericAmount <= 0) {
        throw new Error('Amount must be greater than zero');
      }

      const transaction = buildTransaction({
        type: 'received',
        counterpart: counterpart?.trim() || 'Unknown Sender',
        amount: numericAmount,
        note: note?.trim() || '',
        timestamp: new Date().toISOString(),
      });

      setBalance((prev) => prev + numericAmount);
      setTransactions((prev) => [transaction, ...prev]);
      appendNotification(`You received $${numericAmount.toFixed(2)} from ${transaction.counterpart}`);

      return transaction;
    },
    [appendNotification, buildTransaction],
  );

  const requestMoney = useCallback(
    ({ counterpart, amount, note }) => {
      const numericAmount = Number(amount);
      if (!counterpart?.trim()) {
        throw new Error('Requester information is required');
      }
      if (Number.isNaN(numericAmount) || numericAmount <= 0) {
        throw new Error('Amount must be greater than zero');
      }

      const encryptedPayload = basicEncrypt({ counterpart, amount: numericAmount, note });
      const requestId = `RQ-${Date.now()}`;
      appendNotification(`Money request (${requestId}) sent to ${counterpart.trim()}`);

      return { requestId, encryptedPayload };
    },
    [appendNotification],
  );

  const submitSupportTicket = useCallback(({ name, email, message }) => {
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      throw new Error('All fields are required');
    }
    const ticket = {
      id: `SUP-${supportTickets.length + 1}`,
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };
    setSupportTickets((prev) => [ticket, ...prev]);
    appendNotification('Support has received your latest request');
    return ticket;
  }, [appendNotification, supportTickets.length]);

  const signIn = useCallback(
    ({ name, email }) => {
      setUser((prev) => ({
        ...prev,
        name: name?.trim() || prev.name,
        email: email?.trim() || prev.email,
      }));
      appendNotification('Login successful. Welcome back!');
    },
    [appendNotification],
  );

  const switchRole = useCallback(
    (nextRole) => {
      if (!ROLE_CONFIG[nextRole]) {
        throw new Error('Unsupported role selected');
      }
      setRole(nextRole);
      appendNotification(`Role updated to ${ROLE_CONFIG[nextRole].label}`);
    },
    [appendNotification],
  );

  const addBeneficiary = useCallback(({ name, country, method }) => {
    if (!name?.trim() || !country?.trim() || !method?.trim()) {
      throw new Error('Beneficiary name, country, and payout method are required');
    }
    const beneficiary = {
      id: `BN-${Date.now()}`,
      name: name.trim(),
      country: country.trim(),
      method: method.trim(),
      verified: false,
    };
    setBeneficiaries((prev) => [beneficiary, ...prev]);
    appendNotification(`Beneficiary ${beneficiary.name} added, awaiting verification`);
    return beneficiary;
  }, [appendNotification]);

  const updateAgentStatus = useCallback(({ id, status }) => {
    setAgents((prev) =>
      prev.map((agent) => (agent.id === id ? { ...agent, status } : agent)),
    );
  }, []);

  const value = useMemo(
    () => ({
      user,
      balance,
      transactions,
      notifications,
      supportTickets,
      role,
      services,
      beneficiaries,
      agents,
      sendMoney,
      receiveMoney,
      requestMoney,
      submitSupportTicket,
      signIn,
      switchRole,
      addBeneficiary,
      updateAgentStatus,
      ROLE_CONFIG,
    }),
    [
      balance,
      beneficiaries,
      agents,
      notifications,
      receiveMoney,
      requestMoney,
      role,
      sendMoney,
      signIn,
      submitSupportTicket,
      supportTickets,
      transactions,
      services,
      user,
      addBeneficiary,
      switchRole,
      updateAgentStatus,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    Alert.alert('Context unavailable', 'AppContext must be used within AppProvider');
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

