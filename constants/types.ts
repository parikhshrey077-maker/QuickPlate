export type Meal = {
    id: string;
    name: string;
    category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
    price: number;
    description: string;
    // image: string; // Removed as per request
    available: boolean;
    prepTime: number; // minutes
};

export type OrderItem = {
    mealId: string;
    name: string;
    quantity: number;
    price: number;
};

export type Order = {
    id: string;
    date: string;
    items: OrderItem[];
    total: number;
    status: 'Preparing' | 'Ready Soon' | 'Ready for Pickup' | 'Picked Up';
};

export type UserProfile = {
    id: string;
    name: string;
    email: string;
    phone: string;
    photoUrl: string;
    loyaltyPoints: number;
    tier: 'Bronze' | 'Silver' | 'Gold';
};

export interface Offer {
    id: string;
    title: string;
    points: number;
    description: string;
    icon: string; // SF Symbol name
}
