
# QuickPlate - Smart Campus Canteen App

Modern Expo Router frontend for QuickPlate, designed for high performance and premium user experience.

## 🚀 Features

- **Authentication**: secure SAP ID login with session management. (Currently using Mock Storage)
- **Home**: Browse meals, filter by category, search, and add to cart.
- **Cart**: Real-time cart management with quantity adjustments.
- **Ordering**: Schedule pickup times with a custom Time Picker.
- **History**: View past orders and statuses.
- **Rewards**: Loyalty points tracking and redemption UI.
- **Profile**: User settings and preferences.

## 🛠 Tech Stack

- **Framework**: React Native with Expo (Expo Router)
- **Language**: TypeScript
- **Styling**: Custom Design System (Object-based styles mimicking a Token system)
  - *Note: NativeWind was requested but environment constraints required using standard StyleSheet. The 'constants/theme.ts' file serves as the design token source.*
- **State Management**: React Context (AuthContext, CartContext)
- **Icons**: SF Symbols (via IconSymbol wrapper)

## 📱 Project Structure

```
app/
├── (tabs)/          # Main Tab Navigation
│   ├── index.tsx    # Home Screen
│   ├── explore.tsx  # Order History
│   ├── rewards.tsx  # Loyalty Program
│   └── profile.tsx  # User Profile
├── login.tsx        # Authentication Screen (Protected Route)
├── _layout.tsx      # Root Layout (Providers & Stack)
components/
├── ui/              # Base UI elements (IconSymbol)
├── CustomButton.tsx # Reusable Button
├── MealCard.tsx     # Meal Display Information
└── ...
constants/
├── MockData.ts      # Static data for development
├── theme.ts         # Colors, Spacing, Shadows
context/
├── AuthContext.tsx  # Auth logic & Session
└── CartContext.tsx  # Shopping Cart logic
services/
└── storage.ts       # Storage abstraction (currently Mock in-memory)
```

## 🔧 Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```
   *Note: If specific native modules like AsyncStorage were not installed due to environment limits, run:*
   ```bash
   npx expo install @react-native-async-storage/async-storage
   ```

2. **Run the App**:
   ```bash
   npx expo start
   ```

## 🔌 API Integration Guide

This frontend currently uses **Mock Data** (`constants/MockData.ts`) and **Mock Storage** (`services/storage.ts`).

### Authentiction
- **Current**: `AuthContext` simulates login with a timeout.
- **Integration**: Replace `signIn` in `context/AuthContext.tsx` with a call to:
  ```typescript
  POST /api/auth/login { sapId, password }
  ```
  And store the returned JWT in `Storage`.

### Meals
- **Current**: Loaded from `MEALS` constant.
- **Integration**: Fetch in `HomeScreen.tsx` via `useEffect`:
  ```typescript
  GET /api/meals
  ```

### Orders
- **Current**: Local state + Mock `ORDERS`.
- **Integration**: 
  1. **Post Order**: `POST /api/orders` in `handleCheckout`.
  2. **Fetch History**: `GET /api/orders/history` in `ExploreScreen.tsx`.

## ⚠️ Known Limitations
- **Storage**: Uses in-memory Map. Data wipes on reload. Install `AsyncStorage` for persistence.
- **NativeWind**: Not installed. Standard Styles used for maximum compatibility.

## 📝 Developer Notes
- **Theme**: Edit `constants/theme.ts` to change global colors.
- **Navigation**: Controlled by `expo-router` file structure.
