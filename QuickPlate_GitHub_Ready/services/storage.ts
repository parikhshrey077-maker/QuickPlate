import AsyncStorage from '@react-native-async-storage/async-storage';

export const KEYS = {
    USER_PROFILE: 'user_profile',
    AUTH_STATE: 'auth_state',
    SAVED_UPI: 'saved_upi',
    LOYALTY_POINTS: 'loyalty_points',
    ORDERS: 'user_orders',
};

export const Storage = {
    setItem: async (key: string, value: any) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
        } catch (e) {
            console.error('Error saving data', e);
        }
    },

    getItem: async (key: string) => {
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.error('Error reading data', e);
            return null;
        }
    },

    removeItem: async (key: string) => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (e) {
            console.error('Error removing data', e);
        }
    },

    clear: async () => {
        try {
            await AsyncStorage.clear();
        } catch (e) {
            console.error('Error clearing data', e);
        }
    },
};
