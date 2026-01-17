export const API_BASE_URL = __DEV__
    ? 'http://192.168.29.190:5001'
    : 'https://your-production-url.com';

export const API_ENDPOINTS = {
    // Auth
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    CHANGE_PASSWORD: '/api/auth/change-password',
    GET_USER: (userId: number) => `/api/auth/users/${userId}`,
    UPDATE_USER: (userId: number) => `/api/auth/users/${userId}`,

    // Meals
    GET_MEALS: '/api/meals',
    GET_MEAL: (mealId: string) => `/api/meals/${mealId}`,

    // Orders
    CREATE_ORDER: '/api/orders',
    GET_USER_ORDERS: (userId: number) => `/api/orders/user/${userId}`,
    UPDATE_ORDER_STATUS: (orderId: string) => `/api/orders/${orderId}/status`,

    // Loyalty
    GET_LOYALTY_BALANCE: (userId: number) => `/api/loyalty/${userId}`,
    GET_OFFERS: '/api/loyalty/offers',
    REDEEM_POINTS: '/api/loyalty/redeem',

    // AI
    AI_CHAT: '/api/ai/chat',
    AI_RECOMMENDATIONS: (userId: number) => `/api/ai/recommendations/${userId}`,
};
