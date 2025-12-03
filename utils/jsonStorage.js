import AsyncStorage from '@react-native-async-storage/async-storage';

// Import JSON file - React Native/Expo supports require() for JSON files
const initialData = require('../data/appData.json');

const STORAGE_KEY = '@app_data';

/**
 * JSON Storage Utility
 * Manages reading and writing app data to/from AsyncStorage
 */

/**
 * Load data from AsyncStorage or return initial data
 */
export const loadData = async () => {
  try {
    const storedData = await AsyncStorage.getItem(STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
    // If no stored data, return initial data and save it
    await saveData(initialData);
    return initialData;
  } catch (error) {
    console.error('Error loading data:', error);
    return initialData;
  }
};

/**
 * Save data to AsyncStorage
 */
export const saveData = async (data) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
};

/**
 * Get a specific section of data
 */
export const getDataSection = async (section) => {
  const data = await loadData();
  return data[section] || [];
};

/**
 * Update a specific section of data
 */
export const updateDataSection = async (section, newData) => {
  const data = await loadData();
  data[section] = newData;
  await saveData(data);
  return data[section];
};

/**
 * Add an item to a section
 */
export const addToSection = async (section, item) => {
  const data = await loadData();
  if (!data[section]) {
    data[section] = [];
  }
  data[section].push(item);
  await saveData(data);
  return item;
};

/**
 * Update an item in a section by ID
 */
export const updateItemInSection = async (section, id, updates) => {
  const data = await loadData();
  if (!data[section]) {
    return null;
  }
  const index = data[section].findIndex((item) => item.id === id);
  if (index !== -1) {
    data[section][index] = { ...data[section][index], ...updates };
    await saveData(data);
    return data[section][index];
  }
  return null;
};

/**
 * Remove an item from a section by ID
 */
export const removeFromSection = async (section, id) => {
  const data = await loadData();
  if (!data[section]) {
    return false;
  }
  data[section] = data[section].filter((item) => item.id !== id);
  await saveData(data);
  return true;
};

/**
 * Find an item in a section by ID
 */
export const findItemInSection = async (section, id) => {
  const data = await loadData();
  if (!data[section]) {
    return null;
  }
  return data[section].find((item) => item.id === id) || null;
};

/**
 * Find items in a section by a filter function
 */
export const findItemsInSection = async (section, filterFn) => {
  const data = await loadData();
  if (!data[section]) {
    return [];
  }
  return data[section].filter(filterFn);
};

/**
 * Get user by email or phone
 */
export const getUserByCredentials = async (email, password) => {
  const users = await getDataSection('users');
  return users.find(
    (user) => user.email === email && user.password === password
  );
};

/**
 * Get user by ID
 */
export const getUserById = async (userId) => {
  return await findItemInSection('users', userId);
};

/**
 * Get transactions for a user
 */
export const getUserTransactions = async (userId) => {
  const transactions = await getDataSection('transactions');
  return transactions.filter(
    (tx) => tx.senderId === userId || tx.recipientId === userId
  );
};

/**
 * Get beneficiaries for a user
 */
export const getUserBeneficiaries = async (userId) => {
  return await findItemsInSection('beneficiaries', (b) => b.userId === userId);
};

/**
 * Get support tickets for a user (or all if admin)
 */
export const getSupportTickets = async (userId, isAdmin = false) => {
  const tickets = await getDataSection('supportTickets');
  if (isAdmin) {
    return tickets;
  }
  return tickets.filter((ticket) => ticket.userId === userId);
};

/**
 * Clear all data (reset to initial)
 */
export const resetData = async () => {
  await AsyncStorage.removeItem(STORAGE_KEY);
  return initialData;
};

/**
 * Export data as JSON string (for backup)
 */
export const exportData = async () => {
  const data = await loadData();
  return JSON.stringify(data, null, 2);
};

/**
 * Import data from JSON string (for restore)
 */
export const importData = async (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    await saveData(data);
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};
