
import { UserProfile } from '../constants/types';
import { Storage, KEYS } from '../services/storage';
import { apiService } from '../services/api';
import { useRouter, useSegments } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthType = {
    user: any | null;
    isLoading: boolean;
    signIn: (sapId: string, password?: string) => Promise<void>;
    signOut: () => Promise<void>;
    addLoyaltyPoints: (points: number) => void;
    redeemPoints: (points: number) => boolean;
    orders: any[];
    placeOrder: (order: any) => Promise<void>;
    updateProfile: (data: Partial<UserProfile>) => Promise<void>;
};

const AuthContext = createContext<AuthType>({
    user: null,
    isLoading: false,
    signIn: async () => { },
    signOut: async () => { },
    addLoyaltyPoints: () => { },
    redeemPoints: () => false,
    orders: [],
    placeOrder: async () => { },
    updateProfile: async () => { },
});

export function useAuth() {
    return useContext(AuthContext);
}

function useProtectedRoute(user: any) {
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        const inAuthGroup = (segments as string[]).includes('login') || (segments as string[]).includes('hello') || (segments as string[]).includes('signup');

        if (user === undefined) return; // Loading

        if (!user && !inAuthGroup) {
            router.replace('/hello');
        } else if (user && inAuthGroup) {
            router.replace('/(tabs)');
        }
    }, [user, segments]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        const loadSession = async () => {
            // Check for stored user session
            const storedUser = await Storage.getItem(KEYS.USER_PROFILE);

            if (storedUser) {
                // Fetch fresh data from backend
                try {
                    const userData = await apiService.getUser(storedUser.id);
                    const ordersData = await apiService.getUserOrders(storedUser.id);

                    setUser(userData);
                    setOrders(ordersData.orders || []);
                } catch (error) {
                    console.error('Failed to load user data:', error);
                    // Fallback to stored data
                    setUser(storedUser);
                }
            } else {
                setUser(null);
            }
        };
        loadSession();
    }, []);

    useProtectedRoute(user);

    const signIn = async (sapId: string, password?: string) => {
        setIsLoading(true);
        try {
            // Try to login via API
            const response = await apiService.login(sapId, password);

            if (response.success) {
                const userData = response.user;
                await Storage.setItem(KEYS.USER_PROFILE, userData);

                // Fetch orders
                const ordersData = await apiService.getUserOrders(userData.id);
                setOrders(ordersData.orders || []);

                setUser(userData);
            }
        } catch (error: any) {
            throw new Error(error.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        await Storage.removeItem(KEYS.USER_PROFILE);
        setUser(null);
        setOrders([]);
    };

    const addLoyaltyPoints = async (points: number) => {
        if (user) {
            const newPoints = (user.loyaltyPoints || 0) + points;
            const updatedUser = { ...user, loyaltyPoints: newPoints };

            setUser(updatedUser);
            await Storage.setItem(KEYS.USER_PROFILE, updatedUser);
        }
    };

    const redeemPoints = (pointsToRedeem: number): boolean => {
        if (user && (user.loyaltyPoints || 0) >= pointsToRedeem) {
            const newPoints = user.loyaltyPoints - pointsToRedeem;
            const updatedUser = { ...user, loyaltyPoints: newPoints };

            setUser(updatedUser);
            Storage.setItem(KEYS.USER_PROFILE, updatedUser);
            return true;
        }
        return false;
    };

    const placeOrder = async (orderDetails: any) => {
        if (!user) return;

        try {
            // Create order via API
            const response = await apiService.createOrder({
                userId: user.id,
                items: orderDetails.items,
                total: orderDetails.total,
                pickupTime: orderDetails.pickupTime,
                paymentMethod: orderDetails.paymentMethod,
                pointsUsed: orderDetails.pointsUsed || 0,
            });

            if (response.success) {
                // Update local orders
                const updatedOrders = [response.order, ...orders];
                setOrders(updatedOrders);

                // Freshly fetch user data to get updated points balance
                const userData = await apiService.getUser(user.id);
                setUser(userData);
                await Storage.setItem(KEYS.USER_PROFILE, userData);
            }
        } catch (error) {
            console.error('Failed to place order:', error);
            throw error;
        }
    };

    const updateProfile = async (data: Partial<UserProfile>) => {
        if (user) {
            try {
                const response = await apiService.updateUser(user.id, data);

                if (response.success) {
                    const updatedUser = response.user;
                    setUser(updatedUser);
                    await Storage.setItem(KEYS.USER_PROFILE, updatedUser);
                }
            } catch (error) {
                console.error('Failed to update profile:', error);
                throw error;
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, signIn, signOut, addLoyaltyPoints, redeemPoints, orders, placeOrder, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
}
