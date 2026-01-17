import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';

class APIService {
    private baseURL: string;

    constructor() {
        this.baseURL = API_BASE_URL;
    }

    private async request(endpoint: string, options: RequestInit = {}) {
        const url = `${this.baseURL}${endpoint}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const config: RequestInit = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            signal: controller.signal
        };

        try {
            const response = await fetch(url, config);
            clearTimeout(timeoutId);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'API request failed');
            }

            return data;
        } catch (error: any) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw new Error('Network request timed out. Please check if your backend is running.');
            }
            throw new Error(error.message || 'Network error occurred. Please check your connection.');
        }
    }

    // Auth
    async login(sapId: string, password?: string) {
        return this.request(API_ENDPOINTS.LOGIN, {
            method: 'POST',
            body: JSON.stringify({ sapId, password }),
        });
    }

    async signup(sapId: string, name: string, password?: string, email?: string, phone?: string) {
        return this.request(API_ENDPOINTS.SIGNUP, {
            method: 'POST',
            body: JSON.stringify({ sapId, name, password, email, phone }),
        });
    }

    async getUser(userId: number) {
        return this.request(API_ENDPOINTS.GET_USER(userId));
    }

    async updateUser(userId: number, data: { name?: string; email?: string; phone?: string }) {
        return this.request(API_ENDPOINTS.UPDATE_USER(userId), {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async changePassword(userId: number, oldPassword: string, newPassword: string) {
        return this.request(API_ENDPOINTS.CHANGE_PASSWORD, {
            method: 'POST',
            body: JSON.stringify({ userId, oldPassword, newPassword }),
        });
    }

    // Meals
    async getMeals(category?: string) {
        const query = category ? `?category=${category}` : '';
        return this.request(`${API_ENDPOINTS.GET_MEALS}${query}`);
    }

    async getMeal(mealId: string) {
        return this.request(API_ENDPOINTS.GET_MEAL(mealId));
    }

    // Orders
    async createOrder(orderData: any) {
        return this.request(API_ENDPOINTS.CREATE_ORDER, {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    }

    async getUserOrders(userId: number) {
        return this.request(API_ENDPOINTS.GET_USER_ORDERS(userId));
    }

    // Loyalty
    async getLoyaltyBalance(userId: number) {
        return this.request(API_ENDPOINTS.GET_LOYALTY_BALANCE(userId));
    }

    async getOffers() {
        return this.request(API_ENDPOINTS.GET_OFFERS);
    }

    async redeemPoints(userId: number, offerId: string) {
        return this.request(API_ENDPOINTS.REDEEM_POINTS, {
            method: 'POST',
            body: JSON.stringify({ userId, offerId }),
        });
    }

    // AI
    async chat(message: string, history: any[] = []) {
        return this.request(API_ENDPOINTS.AI_CHAT, {
            method: 'POST',
            body: JSON.stringify({ message, history }),
        });
    }

    async getRecommendations(userId: number) {
        return this.request(API_ENDPOINTS.AI_RECOMMENDATIONS(userId));
    }
}

export const apiService = new APIService();
