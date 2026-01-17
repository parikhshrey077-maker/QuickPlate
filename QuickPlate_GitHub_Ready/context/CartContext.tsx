import { Meal, Offer } from '@/constants/MockData';
import React, { createContext, useContext, useState } from 'react';

export type CartItem = Meal & {
    quantity: number;
};

type CartType = {
    items: CartItem[];
    addToCart: (meal: Meal, quantity: number) => void;
    removeFromCart: (mealId: string) => void;
    updateQuantity: (mealId: string, delta: number) => void;
    clearCart: () => void;
    total: number;
    count: number;
    activeOffer: Offer | null;
    applyOffer: (offer: Offer) => void;
    removeOffer: () => void;
    reorder: (orderItems: CartItem[]) => void;
};

const CartContext = createContext<CartType>({
    items: [],
    addToCart: () => { },
    removeFromCart: () => { },
    updateQuantity: () => { },
    clearCart: () => { },
    total: 0,
    count: 0,
    activeOffer: null,
    applyOffer: () => { },
    removeOffer: () => { },
    reorder: () => { },
});

export function useCart() {
    return useContext(CartContext);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [activeOffer, setActiveOffer] = useState<Offer | null>(null);

    const addToCart = (meal: Meal, quantity: number) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.id === meal.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === meal.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            return [...prev, { ...meal, quantity }];
        });
    };

    const removeFromCart = (mealId: string) => {
        setItems((prev) => prev.filter((item) => item.id !== mealId));
    };

    const updateQuantity = (mealId: string, delta: number) => {
        setItems((prev) =>
            prev.map((item) => {
                if (item.id === mealId) {
                    const newQty = Math.max(0, item.quantity + delta);
                    return { ...item, quantity: newQty };
                }
                return item;
            }).filter((item) => item.quantity > 0)
        );
    };

    const clearCart = () => {
        setItems([]);
        setActiveOffer(null);
    };

    const applyOffer = (offer: Offer) => setActiveOffer(offer);
    const removeOffer = () => setActiveOffer(null);

    const reorder = (orderItems: CartItem[]) => {
        setItems(orderItems);
        setActiveOffer(null); // Optional: Do we keep the old offer? Probably not for a new cart session unless specified.
    };

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total, count, activeOffer, applyOffer, removeOffer, reorder }}>
            {children}
        </CartContext.Provider>
    );
}
