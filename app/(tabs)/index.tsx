
import { MealCard } from '@/components/MealCard';
import { TimePickerModal } from '@/components/TimePickerModal';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Meal } from '@/constants/types';
import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/services/api';
import React, { useState, useEffect } from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks'];

import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const { addToCart, updateQuantity, items, count, total, clearCart } = useCart();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [pickupTime, setPickupTime] = useState<string | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch meals from API
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await apiService.getMeals();
        setMeals(response.meals || []);
      } catch (error) {
        console.error('Failed to fetch meals:', error);
        Alert.alert('Error', 'Failed to load menu. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  const filteredMeals = meals.filter(meal => {
    const matchesCategory = selectedCategory === 'All' || meal.category === selectedCategory;
    const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (meal: Meal) => {
    addToCart(meal, 1);
  };

  const handleCheckout = () => {
    if (!pickupTime) {
      Alert.alert('Select Time', 'Please select a pickup time first.');
      setTimePickerVisible(true);
      return;
    }
    router.push({
      pathname: '/checkout',
      params: { pickupTime }
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'Guest'}</Text>
          <Text style={styles.subtitle}>Hungry?</Text>
        </View>
        <TouchableOpacity style={styles.bellButton}>
          <IconSymbol name="bell.fill" size={24} color={Colors.light.text} />
          <View style={styles.badgeDot} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <IconSymbol name="magnifyingglass" size={20} color={Colors.light.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for meals..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.categories}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContent}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <Text style={styles.loadingText}>Loading menu...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredMeals}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            const cartItem = items.find((cartItem) => cartItem.id === item.id);
            const quantity = cartItem ? cartItem.quantity : 0;
            return (
              <MealCard
                meal={item}
                quantity={quantity}
                onIncrement={() => addToCart(item, 1)}
                onDecrement={() => updateQuantity(item.id, -1)}
              />
            );
          }}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {count > 0 && (
        <View style={styles.cartBar}>
          <View>
            <Text style={styles.cartInfo}>{count} Items • ₹{total}</Text>
            <TouchableOpacity onPress={() => setTimePickerVisible(true)}>
              <Text style={styles.pickupTime}>{pickupTime ? `Pickup: ${pickupTime}` : 'Select Pickup Time >'}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      )}

      <TimePickerModal
        visible={isTimePickerVisible}
        onClose={() => setTimePickerVisible(false)}
        onSelectTime={setPickupTime}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  bellButton: {
    padding: Spacing.sm,
  },
  badgeDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.error,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 48,
    marginBottom: Spacing.md,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: Colors.light.text,
  },
  categories: {
    marginBottom: Spacing.md,
  },
  categoriesContent: {
    paddingHorizontal: Spacing.md,
  },
  categoryChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: BorderRadius.circle,
    backgroundColor: Colors.light.surface,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryChipActive: {
    backgroundColor: Colors.light.surfaceHighlight, // subtle change or primary?
    borderColor: Colors.light.primary,
  },
  categoryText: {
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  categoryTextActive: {
    color: Colors.light.primary,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: 100, // Space for cart bar
  },
  cartBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 85 : 60, // Above tabs
    left: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.light.text, // Dark bg
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Shadows.light.medium,
  },
  cartInfo: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pickupTime: {
    color: '#DDD',
    fontSize: 12,
    marginTop: 2,
  },
  checkoutButton: {
    backgroundColor: Colors.light.success,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
  },
  checkoutText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    color: Colors.light.textSecondary,
    fontSize: 16,
  },
});
