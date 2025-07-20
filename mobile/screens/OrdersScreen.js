import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

export default function OrdersScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState('active');
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState([]);

  const dummyOrders = [
    {
      id: '1',
      orderNumber: '#12345',
      restaurantName: 'Spice Garden',
      restaurantImage: 'https://via.placeholder.com/60/FF6B6B/FFFFFF?text=SG',
      items: ['Butter Chicken', 'Naan', 'Masala Chai'],
      total: 420,
      status: 'active',
      orderTime: '2024-01-15T14:30:00',
      estimatedDelivery: '2024-01-15T15:15:00',
      deliveryAddress: 'Home - 123 Main Street, City',
      paymentMethod: 'UPI',
      orderStage: 'preparing', // ordered, preparing, out_for_delivery, delivered
    },
    {
      id: '2',
      orderNumber: '#12344',
      restaurantName: 'Dosa Corner',
      restaurantImage: 'https://via.placeholder.com/60/4ECDC4/FFFFFF?text=DC',
      items: ['Masala Dosa', 'Sambhar', 'Coconut Chutney'],
      total: 180,
      status: 'completed',
      orderTime: '2024-01-14T12:00:00',
      deliveredTime: '2024-01-14T12:45:00',
      deliveryAddress: 'Home - 123 Main Street, City',
      paymentMethod: 'Cash on Delivery',
      orderStage: 'delivered',
      rating: 4,
    },
    {
      id: '3',
      orderNumber: '#12343',
      restaurantName: 'Wok & Roll',
      restaurantImage: 'https://via.placeholder.com/60/45B7D1/FFFFFF?text=WR',
      items: ['Chicken Fried Rice', 'Manchurian', 'Spring Roll'],
      total: 350,
      status: 'completed',
      orderTime: '2024-01-13T19:30:00',
      deliveredTime: '2024-01-13T20:15:00',
      deliveryAddress: 'Home - 123 Main Street, City',
      paymentMethod: 'Credit Card',
      orderStage: 'delivered',
      rating: 5,
    },
  ];

  useEffect(() => {
    setOrders(dummyOrders);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const filteredOrders = orders.filter(order => 
    selectedTab === 'active' ? order.status === 'active' : order.status === 'completed'
  );

  const getStatusColor = (stage) => {
    switch (stage) {
      case 'ordered': return '#FFA000';
      case 'preparing': return '#1976D2';
      case 'out_for_delivery': return '#7B1FA2';
      case 'delivered': return '#388E3C';
      default: return '#666';
    }
  };

  const getStatusText = (stage) => {
    switch (stage) {
      case 'ordered': return 'Order Confirmed';
      case 'preparing': return 'Preparing Your Food';
      case 'out_for_delivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      default: return 'Unknown';
    }
  };

  const getStatusIcon = (stage) => {
    switch (stage) {
      case 'ordered': return 'receipt';
      case 'preparing': return 'restaurant';
      case 'out_for_delivery': return 'delivery-dining';
      case 'delivered': return 'check-circle';
      default: return 'help';
    }
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderDetail', { order: item })}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderNumber}>{item.orderNumber}</Text>
          <Text style={styles.orderDate}>{formatDate(item.orderTime)}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(item.orderStage) + '20' }
        ]}>
          <MaterialIcons 
            name={getStatusIcon(item.orderStage)} 
            size={16} 
            color={getStatusColor(item.orderStage)} 
          />
          <Text style={[
            styles.statusText,
            { color: getStatusColor(item.orderStage) }
          ]}>
            {getStatusText(item.orderStage)}
          </Text>
        </View>
      </View>

      <View style={styles.restaurantInfo}>
        <View style={styles.restaurantImageContainer}>
          <Text style={styles.restaurantImageText}>
            {item.restaurantName.split(' ').map(word => word[0]).join('')}
          </Text>
        </View>
        <View style={styles.restaurantDetails}>
          <Text style={styles.restaurantName}>{item.restaurantName}</Text>
          <Text style={styles.orderItems}>
            {item.items.slice(0, 2).join(', ')}
            {item.items.length > 2 && ` +${item.items.length - 2} more`}
          </Text>
        </View>
      </View>

      <View style={styles.orderFooter}>
        <View style={styles.orderDetails}>
          <Text style={styles.orderTotal}>₹{item.total}</Text>
          <Text style={styles.paymentMethod}>{item.paymentMethod}</Text>
        </View>
        <View style={styles.orderActions}>
          {item.status === 'active' && (
            <TouchableOpacity
              style={styles.trackButton}
              onPress={() => navigation.navigate('OrderTracking', { order: item })}
            >
              <Text style={styles.trackButtonText}>Track</Text>
            </TouchableOpacity>
          )}
          {item.status === 'completed' && !item.rating && (
            <TouchableOpacity
              style={styles.rateButton}
              onPress={() => navigation.navigate('RateOrder', { order: item })}
            >
              <Text style={styles.rateButtonText}>Rate</Text>
            </TouchableOpacity>
          )}
          {item.status === 'completed' && item.rating && (
            <View style={styles.ratingDisplay}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.reorderButton}
            onPress={() => navigation.navigate('RestaurantDetail', { 
              restaurant: { 
                name: item.restaurantName,
                image: item.restaurantImage,
                cuisine: 'Mixed Cuisine',
                rating: 4.5,
                deliveryTime: '30-45 min',
                minOrder: '₹150'
              }
            })}
          >
            <Text style={styles.reorderButtonText}>Reorder</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'active' && styles.activeTab]}
          onPress={() => setSelectedTab('active')}
        >
          <Text style={[styles.tabText, selectedTab === 'active' && styles.activeTabText]}>
            Active Orders
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'completed' && styles.activeTab]}
          onPress={() => setSelectedTab('completed')}
        >
          <Text style={[styles.tabText, selectedTab === 'completed' && styles.activeTabText]}>
            Order History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        style={styles.ordersList}
        contentContainerStyle={styles.ordersListContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="receipt" size={80} color="#CCC" />
            <Text style={styles.emptyTitle}>
              {selectedTab === 'active' ? 'No Active Orders' : 'No Order History'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {selectedTab === 'active' 
                ? 'Start ordering delicious food!' 
                : 'Your completed orders will appear here'
              }
            </Text>
            {selectedTab === 'active' && (
              <TouchableOpacity
                style={styles.browseButton}
                onPress={() => navigation.navigate('Home')}
              >
                <Text style={styles.browseButtonText}>Browse Restaurants</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  placeholder: {
    width: 34,
  },
  tabContainer: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 25,
  },
  activeTab: {
    backgroundColor: '#FF6B6B',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#FFF',
  },
  ordersList: {
    flex: 1,
  },
  ordersListContent: {
    padding: 20,
  },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  restaurantImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  restaurantImageText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  restaurantDetails: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  orderItems: {
    fontSize: 14,
    color: '#666',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderDetails: {
    flex: 1,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  paymentMethod: {
    fontSize: 12,
    color: '#666',
  },
  orderActions: {
    flexDirection: 'row',
    gap: 10,
  },
  trackButton: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  trackButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  rateButton: {
    backgroundColor: '#FFA000',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  rateButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  ratingDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF8F00',
  },
  reorderButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  reorderButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  browseButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 