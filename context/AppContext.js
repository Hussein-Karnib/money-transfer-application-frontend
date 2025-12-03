// context/AppContext.js

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  loadData,
  saveData,
  getUserByCredentials,
  getUserById,
  getUserTransactions,
  getUserBeneficiaries,
  getSupportTickets,
  addToSection,
  updateItemInSection,
  removeFromSection,
  updateDataSection,
  getDataSection,
  findItemInSection,
} from '../utils/jsonStorage';

const API_BASE_URL = 'http://192.168.10.175:8000/api';

export const ROLE_CONFIG = {
  user: { label: 'Customer' },
  agent: { label: 'Agent' },
  admin: { label: 'Admin' },
};

const AppContext = createContext(null);

// 🔹 Shared axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('user');
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([
    'Welcome to SwiftSend mobile app.',
  ]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [kycSubmissions, setKycSubmissions] = useState([]);
  const [fraudAlerts, setFraudAlerts] = useState([]);
  const [agents, setAgents] = useState([]);
  const [balance, setBalance] = useState(0);

  // 🔹 Keep axios Authorization header in sync
  useEffect(() => {
    if (authToken) {
      api.defaults.headers.common.Authorization = `Bearer ${authToken}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [authToken]);

  // --- Bootstrap from JSON storage on app start ---
  useEffect(() => {
    const bootstrap = async () => {
      try {
        // Load data from JSON storage
        const data = await loadData();
        
        // Load stored auth state
        const storedToken = await AsyncStorage.getItem('authToken');
        const storedRole = await AsyncStorage.getItem('role');
        const storedUserId = await AsyncStorage.getItem('userId');

        if (storedToken && storedUserId) {
          setAuthToken(storedToken);
          if (storedRole) setRole(storedRole);
          
          // Load user from JSON data
          const userData = await getUserById(storedUserId);
          if (userData) {
            setUser(userData);
            setBalance(userData.balance || 0);
            
            // Load user-specific data
            const userTx = await getUserTransactions(storedUserId);
            setTransactions(userTx);
            
            const userBens = await getUserBeneficiaries(storedUserId);
            setBeneficiaries(userBens);
          }
        }

        // Load global data (for admin/agent)
        const allTickets = await getDataSection('supportTickets');
        setSupportTickets(allTickets);
        
        const allKyc = await getDataSection('kycSubmissions');
        setKycSubmissions(allKyc);
        
        const allFraud = await getDataSection('fraudAlerts');
        setFraudAlerts(allFraud);
        
        const allAgents = await getDataSection('agents');
        setAgents(allAgents);
        
        const allNotifications = await getDataSection('notifications');
        if (allNotifications && allNotifications.length > 0) {
          setNotifications(allNotifications);
        }
      } catch (e) {
        console.log('Bootstrap error', e.message);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  // --- Auth functions ---

  const login = async (email, password) => {
    try {
      // Try JSON storage first - find user by email
      const users = await getDataSection('users');
      const userData = users.find((u) => u.email === email);
      
      if (userData) {
        // For demo: accept any password if email matches
        // In production, verify password hash
        const token = `token_${Date.now()}_${userData.id}`;
        
        setAuthToken(token);
        setUser(userData);
        setBalance(userData.balance || 0);
        setRole(userData.role || 'user');

        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('role', userData.role || 'user');
        await AsyncStorage.setItem('userId', userData.id);

        // Load user data
        const userTx = await getUserTransactions(userData.id);
        setTransactions(userTx);
        
        const userBens = await getUserBeneficiaries(userData.id);
        setBeneficiaries(userBens);

        setNotifications((prev) => [
          `Logged in as ${userData.name}`,
          ...prev.slice(0, 24),
        ]);

        return { success: true, user: userData, token };
      }

      // Fallback to API if JSON storage doesn't have user
      try {
        const res = await api.post('/auth/login', { email, password });
        const token = res.data.token;
        const backendUser = res.data.user;

        setAuthToken(token);
        setUser(backendUser);
        setBalance(backendUser.balance || 0);
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('role', backendUser.role || role);
        await AsyncStorage.setItem('userId', backendUser.id);

        setNotifications((prev) => [
          `Logged in as ${backendUser.name}`,
          ...prev.slice(0, 24),
        ]);

        return { success: true, user: backendUser, token };
      } catch (apiError) {
        throw new Error('Login failed. Please check your email / password.');
      }
    } catch (error) {
      console.log('Login error', error.message);
      throw error;
    }
  };

  const registerAndLogin = async ({ name, email, password, phone }) => {
    try {
      // Create new user in JSON storage
      const newUser = {
        id: `MT-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: password, // In production, hash this
        birthYear: new Date().getFullYear() - 25,
        balance: 0,
        role: 'user',
        kycStatus: 'pending',
        createdAt: new Date().toISOString(),
      };

      // Add user to JSON storage
      await addToSection('users', newUser);

      const token = `token_${Date.now()}_${newUser.id}`;
      
      setAuthToken(token);
      setUser(newUser);
      setBalance(0);
      setRole('user');

      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('role', 'user');
      await AsyncStorage.setItem('userId', newUser.id);

      setNotifications((prev) => [
        `Welcome ${newUser.name}!`,
        ...prev.slice(0, 24),
      ]);

      return { success: true, user: newUser, token };
    } catch (error) {
      console.log('Register error', error.message);
      throw new Error('Sign up failed. Please check your info.');
    }
  };

  const signOut = async () => {
    try {
      if (authToken) {
        try {
          await api.post('/auth/logout');
        } catch (error) {
          // Ignore API logout errors
        }
      }
    } finally {
      setUser(null);
      setAuthToken(null);
      setRole('user');
      setBalance(0);
      setTransactions([]);
      setBeneficiaries([]);
      await AsyncStorage.multiRemove(['authToken', 'role', 'userId']);
    }
  };

  const switchRole = (newRole) => {
    setRole(newRole);
    AsyncStorage.setItem('role', newRole).catch(() => {});
  };

  // Format currency helper
  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // --- Shared data fetchers using JSON storage ---

  const loadBeneficiaries = useCallback(async () => {
    if (!user?.id) return [];
    
    try {
      const userBens = await getUserBeneficiaries(user.id);
      setBeneficiaries(userBens);
      return userBens;
    } catch (error) {
      console.error('Error loading beneficiaries:', error);
      return [];
    }
  }, [user?.id]);

  const fetchBeneficiaries = loadBeneficiaries;

  const fetchUserAccounts = async () => {
    // Return user's account info from JSON
    if (!user) return [];
    return [{
      id: user.id,
      account_number: user.id,
      balance: user.balance || 0,
      currency_code: 'USD',
    }];
  };

  const fetchUserTransactions = useCallback(async () => {
    if (!user?.id) {
      setTransactions([]);
      return [];
    }
    
    try {
      const userTx = await getUserTransactions(user.id);
      setTransactions(userTx);
      return userTx;
    } catch (error) {
      console.error('Error loading transactions:', error);
      setTransactions([]);
      return [];
    }
  }, [user?.id]);

  const createTransfer = useCallback(async (payload) => {
    if (!user?.id) {
      throw new Error('User must be logged in');
    }

    const { amount, currency = 'USD', beneficiary_id, note = '' } = payload;
    const numericAmount = Number(amount);
    
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      throw new Error('Invalid amount');
    }

    // Get beneficiary
    const beneficiary = await getUserBeneficiaries(user.id).then(bens => 
      bens.find(b => b.id === beneficiary_id)
    );
    
    if (!beneficiary) {
      throw new Error('Beneficiary not found');
    }

    // Check balance
    if (numericAmount > (user.balance || 0)) {
      throw new Error('Insufficient balance');
    }

    // Calculate fee (1.25%)
    const fee = numericAmount * 0.0125;
    const totalAmount = numericAmount + fee;

    if (totalAmount > (user.balance || 0)) {
      throw new Error('Insufficient balance after fees');
    }

    // Create transaction
    const transaction = {
      id: `TX-${Date.now()}`,
      senderId: user.id,
      recipientId: beneficiary_id,
      type: 'sent',
      counterpart: beneficiary.name,
      amount: numericAmount,
      currency,
      fxRate: 1.0,
      fee,
      note: note.trim(),
      status: 'completed',
      timestamp: new Date().toISOString(),
    };

    // Save transaction to JSON
    await addToSection('transactions', transaction);

    // Update user balance
    const updatedUser = await updateItemInSection('users', user.id, {
      balance: (user.balance || 0) - totalAmount,
    });

    if (updatedUser) {
      setUser(updatedUser);
      setBalance(updatedUser.balance);
    }

    // Refresh transactions
    await fetchUserTransactions();

    // Add notification
    setNotifications((prev) => [
      `You sent ${currency} ${numericAmount.toFixed(2)} to ${beneficiary.name}`,
      ...prev.slice(0, 24),
    ]);

    return transaction;
  }, [user, fetchUserTransactions]);

  const addBeneficiary = useCallback(async (beneficiaryData) => {
    if (!user?.id) {
      throw new Error('User must be logged in');
    }

    const newBeneficiary = {
      id: `BN-${Date.now()}`,
      userId: user.id,
      name: beneficiaryData.name.trim(),
      country: beneficiaryData.country.trim(),
      method: beneficiaryData.method.trim(),
      verified: false,
      createdAt: new Date().toISOString(),
    };

    await addToSection('beneficiaries', newBeneficiary);
    await loadBeneficiaries();

    setNotifications((prev) => [
      `Beneficiary ${newBeneficiary.name} added`,
      ...prev.slice(0, 24),
    ]);

    return newBeneficiary;
  }, [user?.id, loadBeneficiaries]);

  const submitSupportTicket = useCallback(async (ticketData) => {
    if (!user?.id) {
      throw new Error('User must be logged in');
    }

    const newTicket = {
      id: `SUP-${Date.now()}`,
      userId: user.id,
      name: ticketData.name.trim(),
      email: ticketData.email.trim(),
      message: ticketData.message.trim(),
      status: 'open',
      timestamp: new Date().toISOString(),
    };

    await addToSection('supportTickets', newTicket);
    
    // Refresh tickets
    const allTickets = await getDataSection('supportTickets');
    setSupportTickets(allTickets);

    setNotifications((prev) => [
      'Support ticket submitted successfully',
      ...prev.slice(0, 24),
    ]);

    return newTicket;
  }, [user?.id]);

  const updateKycStatus = useCallback(async (id, status) => {
    // Get the KYC submission to find the userId
    const kycSubmission = await findItemInSection('kycSubmissions', id);
    if (!kycSubmission) {
      throw new Error('KYC submission not found');
    }

    // Update the KYC submission status
    const updated = await updateItemInSection('kycSubmissions', id, { status });
    if (updated) {
      // Update the user's kycStatus in the users array
      if (kycSubmission.userId) {
        const userKycStatus = status === 'Approved' ? 'approved' : status === 'Rejected' ? 'rejected' : 'pending';
        await updateItemInSection('users', kycSubmission.userId, { kycStatus: userKycStatus });
      }

      // Refresh KYC submissions list
      const allKyc = await getDataSection('kycSubmissions');
      setKycSubmissions(allKyc);
    }
    return updated;
  }, []);

  const updateFraudAlertStatus = useCallback(async (id, status) => {
    const updated = await updateItemInSection('fraudAlerts', id, { status });
    if (updated) {
      const allFraud = await getDataSection('fraudAlerts');
      setFraudAlerts(allFraud);
    }
    return updated;
  }, []);

  const updateAgent = useCallback(async (id, updates) => {
    const updated = await updateItemInSection('agents', id, updates);
    if (updated) {
      const allAgents = await getDataSection('agents');
      setAgents(allAgents);
    }
    return updated;
  }, []);

  const receiveMoney = useCallback(async ({ counterpart, amount, note = '', currency = 'USD' }) => {
    if (!user?.id) {
      throw new Error('User must be logged in');
    }

    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      throw new Error('Amount must be greater than zero');
    }

    // Create received transaction
    const transaction = {
      id: `TX-${Date.now()}`,
      senderId: 'SYSTEM',
      recipientId: user.id,
      type: 'received',
      counterpart: counterpart.trim() || 'Unknown sender',
      amount: numericAmount,
      currency,
      fxRate: 1.0,
      fee: 0,
      note: note.trim(),
      status: 'completed',
      timestamp: new Date().toISOString(),
    };

    // Save transaction to JSON
    await addToSection('transactions', transaction);

    // Update user balance
    const updatedUser = await updateItemInSection('users', user.id, {
      balance: (user.balance || 0) + numericAmount,
    });

    if (updatedUser) {
      setUser(updatedUser);
      setBalance(updatedUser.balance);
    }

    // Refresh transactions
    await fetchUserTransactions();

    // Add notification
    setNotifications((prev) => [
      `You received ${currency} ${numericAmount.toFixed(2)} from ${transaction.counterpart}`,
      ...prev.slice(0, 24),
    ]);

    return transaction;
  }, [user, fetchUserTransactions]);

  const requestMoney = useCallback(async ({ counterpart, amount, note = '' }) => {
    if (!user?.id) {
      throw new Error('User must be logged in');
    }

    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      throw new Error('Amount must be greater than zero');
    }

    const requestId = `RQ-${Date.now()}`;

    // Add notification
    setNotifications((prev) => [
      `Money request (${requestId}) sent to ${counterpart.trim()}`,
      ...prev.slice(0, 24),
    ]);

    return { requestId, counterpart: counterpart.trim(), amount: numericAmount, note: note.trim() };
  }, [user]);

  // Generate report function
  const generateReport = useCallback((reportType, startDate, endDate) => {
    const reportId = `RPT-${Date.now()}`;
    const stats = {
      totalTransactions: transactions.length,
      totalAmount: transactions.reduce((sum, t) => sum + (t.amount || 0), 0),
      pendingKyc: kycSubmissions.filter((u) => u.status === 'Pending').length,
      activeFraudAlerts: fraudAlerts.filter((a) => a.status !== 'Resolved').length,
      totalAgents: agents.length,
      openTickets: supportTickets.length,
    };

    return {
      id: reportId,
      type: reportType,
      startDate,
      endDate,
      generatedAt: new Date().toISOString(),
      stats,
      data: {
        transactions: transactions.filter((t) => {
          const txDate = new Date(t.timestamp);
          return txDate >= new Date(startDate) && txDate <= new Date(endDate);
        }),
        fraudAlerts: fraudAlerts.filter((a) => {
          const alertDate = new Date(a.flaggedAt);
          return alertDate >= new Date(startDate) && alertDate <= new Date(endDate);
        }),
        kycSubmissions: kycSubmissions.filter((k) => {
          const kycDate = new Date(k.submittedDate || k.createdAt);
          return kycDate >= new Date(startDate) && kycDate <= new Date(endDate);
        }),
      },
    };
  }, [transactions, kycSubmissions, fraudAlerts, agents, supportTickets]);

  // Legacy
  const signIn = (fakeUser) => {
    setUser(fakeUser);
  };

  const value = useMemo(
    () => ({
      user,
      role,
      authToken,
      loading,
      transactions,
      notifications,
      beneficiaries,
      supportTickets,
      kycSubmissions,
      fraudAlerts,
      agents,
      balance,
      // axios instance, useful in screens:
      api,
      // auth
      login,
      registerAndLogin,
      signOut,
      switchRole,
      // data helpers
      fetchBeneficiaries,
      loadBeneficiaries,
      fetchUserAccounts,
      fetchUserTransactions,
      createTransfer,
      addBeneficiary,
      submitSupportTicket,
      updateKycStatus,
      updateFraudAlertStatus,
      updateAgent,
      receiveMoney,
      requestMoney,
      formatCurrency,
      generateReport,
      // legacy
      signIn,
      API_BASE_URL,
    }),
    [
      user,
      role,
      authToken,
      loading,
      transactions,
      notifications,
      beneficiaries,
      supportTickets,
      kycSubmissions,
      fraudAlerts,
      agents,
      balance,
      loadBeneficiaries,
      fetchUserTransactions,
      createTransfer,
      addBeneficiary,
      submitSupportTicket,
      updateKycStatus,
      updateFraudAlertStatus,
      updateAgent,
      receiveMoney,
      requestMoney,
      formatCurrency,
      generateReport,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used inside AppProvider');
  }
  return ctx;
};
