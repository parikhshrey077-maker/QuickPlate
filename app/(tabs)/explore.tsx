
import { StatusBadge } from '../../components/StatusBadge';
import { BorderRadius, Colors, Spacing } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { MEALS } from '../../constants/MockData';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function ExploreScreen() {
  const { orders } = useAuth();
  const { reorder } = useCart();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Live' | 'Past'>('Live');

  const liveOrders = orders.filter(o => ['Placed', 'Processing', 'Ready', 'Ready for Pickup'].includes(o.status));
  const pastOrders = orders.filter(o => ['Picked Up', 'Delivered', 'Cancelled'].includes(o.status));

  const displayedOrders = activeTab === 'Live' ? liveOrders : pastOrders;

  const handleReorder = (order: any) => {
    // Convert OrderItem to CartItem. OrderItem has mealId, CartItem needs id.
    // Also need to fetch full meal details (image, category etc) from MEALS mock if possible, 
    // or just use what we have if CartItem structure mocks OrderItem closely.
    // CartItem extends Meal.
    // We need to reconstruct CartItems. 
    // For simplicity, we'll try to find the original meal from MEALS to get the image/desc/prepTime.

    const cartItems = order.items.map((item: any) => {
      const originalMeal = MEALS.find(m => m.id === item.mealId);
      if (originalMeal) {
        return { ...originalMeal, quantity: item.quantity };
      }
      return null;
    }).filter(Boolean);

    if (cartItems.length > 0) {
      reorder(cartItems);
      router.push('/(tabs)'); // Go to home/cart
      // Or Alert
      // Alert.alert('Cart Updated', 'Previous order items have been added to your cart.');
    } else {
      Alert.alert('Error', 'Could not find original items for this order.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order History</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Live' && styles.activeTab]}
          onPress={() => setActiveTab('Live')}
        >
          <Text style={[styles.tabText, activeTab === 'Live' && styles.activeTabText]}>Live Orders</Text>
          {liveOrders.length > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{liveOrders.length}</Text></View>}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Past' && styles.activeTab]}
          onPress={() => setActiveTab('Past')}
        >
          <Text style={[styles.tabText, activeTab === 'Past' && styles.activeTabText]}>Past Orders</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={displayedOrders}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No {activeTab.toLowerCase()} orders found.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>{item.id}</Text>
              <StatusBadge status={item.status} />
            </View>
            <Text style={styles.date}>{new Date(item.date).toLocaleDateString()} at {new Date(item.date).toLocaleTimeString()}</Text>

            <View style={styles.items}>
              {item.items.map((orderItem: any) => (
                <Text key={orderItem.mealId || orderItem.name} style={styles.itemText}>{orderItem.quantity}x {orderItem.name}</Text>
              ))}
            </View>

            <View style={styles.footer}>
              <Text style={styles.total}>Total: ₹{item.total}</Text>
              {activeTab === 'Past' && (
                <TouchableOpacity style={styles.reorderButton} onPress={() => handleReorder(item)}>
                  <Text style={styles.reorderText}>Reorder</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    padding: Spacing.md,
  },
  header: {
    padding: Spacing.md,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activeTab: {
    backgroundColor: Colors.light.surfaceHighlight, // Or explicit tint/light primary
    borderColor: Colors.light.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  activeTabText: {
    color: Colors.light.primary,
  },
  badge: {
    backgroundColor: Colors.light.error,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  listContent: {
    padding: Spacing.md,
    paddingTop: 0,
  },
  emptyState: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.light.textSecondary,
    fontSize: 16,
  },
  orderCard: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
      android: { elevation: 2 },
      web: { boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' }
    })
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  orderId: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.light.text,
  },
  date: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.sm,
  },
  items: {
    marginBottom: Spacing.md,
    backgroundColor: Colors.light.surface,
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  itemText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: Spacing.sm,
  },
  total: {
    fontWeight: '700',
    fontSize: 16,
    color: Colors.light.primary,
  },
  reorderButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.light.surfaceHighlight,
  },
  reorderText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.primary,
  },
});
