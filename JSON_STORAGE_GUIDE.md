# JSON Storage Integration Guide

## Overview

The application now uses JSON file storage for data persistence. All data is stored in AsyncStorage (React Native's persistent storage) and can be managed through the JSON storage utilities.

## File Structure

### Data File
- **Location**: `data/appData.json`
- **Purpose**: Initial data structure and default values
- **Content**: Users, transactions, beneficiaries, support tickets, KYC submissions, fraud alerts, agents, notifications

### Storage Utility
- **Location**: `utils/jsonStorage.js`
- **Purpose**: Functions to read/write data from AsyncStorage
- **Features**: 
  - Load/save entire data structure
  - Add/update/remove items from sections
  - Find items by ID or filter
  - User-specific data queries

## How It Works

1. **Initial Load**: On app start, data is loaded from AsyncStorage
2. **Fallback**: If no data exists, initial data from `appData.json` is used
3. **Persistence**: All changes are automatically saved to AsyncStorage
4. **Real-time Updates**: Context state updates immediately when data changes

## Available Functions

### Basic Operations
```javascript
import { loadData, saveData } from '../utils/jsonStorage';

// Load all data
const data = await loadData();

// Save all data
await saveData(data);
```

### Section Operations
```javascript
import { 
  getDataSection, 
  updateDataSection,
  addToSection,
  updateItemInSection,
  removeFromSection 
} from '../utils/jsonStorage';

// Get all users
const users = await getDataSection('users');

// Add a new transaction
await addToSection('transactions', newTransaction);

// Update a user
await updateItemInSection('users', userId, { balance: 1000 });

// Remove a beneficiary
await removeFromSection('beneficiaries', beneficiaryId);
```

### User-Specific Queries
```javascript
import {
  getUserById,
  getUserTransactions,
  getUserBeneficiaries,
  getSupportTickets
} from '../utils/jsonStorage';

// Get user by ID
const user = await getUserById('MT-458210');

// Get user's transactions
const transactions = await getUserTransactions('MT-458210');

// Get user's beneficiaries
const beneficiaries = await getUserBeneficiaries('MT-458210');
```

## Data Structure

The JSON file contains the following sections:

- **users**: User accounts with balance, role, KYC status
- **transactions**: All money transfers (sent/received)
- **beneficiaries**: Saved recipients for each user
- **supportTickets**: Customer support messages
- **kycSubmissions**: KYC verification requests
- **fraudAlerts**: Fraud detection alerts
- **agents**: Agent locations and info
- **notifications**: User notifications
- **settings**: App settings

## Integration in AppContext

The `AppContext` now uses JSON storage for:
- ✅ User authentication (login/register)
- ✅ Transaction management (create, list)
- ✅ Beneficiary management (add, list)
- ✅ Support tickets (submit, list)
- ✅ KYC submissions (list, update status)
- ✅ Fraud alerts (list, update status)
- ✅ Balance tracking

## Example Usage in Screens

### Send Money
```javascript
const { createTransfer } = useAppContext();

const handleSend = async () => {
  try {
    const transaction = await createTransfer({
      amount: 100,
      currency: 'USD',
      beneficiary_id: selectedBeneficiaryId,
      note: 'Payment for services'
    });
    // Transaction is automatically saved to JSON
    Alert.alert('Success', 'Transfer completed!');
  } catch (error) {
    Alert.alert('Error', error.message);
  }
};
```

### Add Beneficiary
```javascript
const { addBeneficiary } = useAppContext();

const handleAdd = async () => {
  try {
    await addBeneficiary({
      name: 'John Doe',
      country: 'USA',
      method: 'Bank Deposit'
    });
    // Beneficiary is automatically saved to JSON
    Alert.alert('Success', 'Beneficiary added!');
  } catch (error) {
    Alert.alert('Error', error.message);
  }
};
```

## Data Persistence

- **Storage**: AsyncStorage (persists across app restarts)
- **Format**: JSON string
- **Location**: Device storage (not a physical file on web)
- **Backup**: Use `exportData()` to get JSON string for backup
- **Restore**: Use `importData(jsonString)` to restore from backup

## Testing

### Test Users (from appData.json)
- **Email**: `alex.doe@example.com` (User, Balance: $8,250.75)
- **Email**: `john.smith@example.com` (User, Balance: $5,000.00)
- **Email**: `admin@swiftsend.app` (Admin)

**Note**: For demo purposes, any password works if the email matches.

## Benefits

1. **Offline Support**: Works without backend connection
2. **Fast**: Local storage is faster than API calls
3. **Persistent**: Data survives app restarts
4. **Simple**: Easy to understand and debug
5. **Flexible**: Can easily switch between JSON and API

## Migration Path

The app supports both JSON storage and API:
- JSON storage is used by default
- API calls are attempted as fallback
- You can gradually migrate to full API integration

## Reset Data

To reset all data to initial state:
```javascript
import { resetData } from '../utils/jsonStorage';

await resetData(); // Resets to appData.json values
```
