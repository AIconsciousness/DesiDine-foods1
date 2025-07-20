import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

export default function RestaurantDetailScreen({ route, navigation }) {
  const { restaurant } = route.params;
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartItems, setCartItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'starters', name: 'Starters' },
    { id: 'main', name: 'Main Course' },
    { id: 'breads', name: 'Breads' },
    { id: 'rice', name: 'Rice & Biryani' },
    { id: 'desserts', name: 'Desserts' },
    { id: 'beverages', name: 'Beverages' },
  ];

  const dummyMenuItems = [
    {
      id: '1',
      name: 'Butter Chicken',
      description: 'Tender chicken in rich tomato and butter gravy',
      price: 350,
      category: 'main',
      image: 'https://via.placeholder.com/100/FF6B6B/FFFFFF?text=Butter+Chicken',
      isVeg: false,
      isSpicy: true,
      rating: 4.5,
      preparationTime: '20-25 min',
    },
    {
      id: '2',
      name: 'Paneer Tikka',
      description: 'Grilled cottage cheese with Indian spices',
      price: 280,
      category: 'starters',
      image: 'https://via.placeholder.com/100/4ECDC4/FFFFFF?text=Paneer+Tikka',
      isVeg: true,
      isSpicy: false,
      rating: 4.3,
      preparationTime: '15-20 min',
    },
    {
      id: '3',
      name: 'Naan',
      description: 'Soft and fluffy Indian bread',
      price: 30,
      category: 'breads',
      image: 'https://via.placeholder.com/100/45B7D1/FFFFFF?text=Naan',
      isVeg: true,
      isSpicy: false,
      rating: 4.0,
      preparationTime: '5-10 min',
    },
    {
      id: '4',
      name: 'Chicken Biryani',
      description: 'Aromatic rice with tender chicken and spices',
      price: 450,
      category: 'rice',
      image: 'https://via.placeholder.com/100/96CEB4/FFFFFF?text=Chicken+Biryani',
      isVeg: false,
      isSpicy: true,
      rating: 4.7,
      preparationTime: '25-30 min',
    },
    {
      id: '5',
      name: 'Gulab Jamun',
      description: 'Sweet milk dumplings in sugar syrup',
      price: 120,
      category: 'desserts',
      image: 'https://via.placeholder.com/100/FFB347/FFFFFF?text=Gulab+Jamun',
      isVeg: true,
      isSpicy: false,
      rating: 4.2,
      preparationTime: '10-15 min',
    },
    {
      id: '6',
      name: 'Masala Chai',
      description: 'Traditional Indian spiced tea',
      price: 40,
      category: 'beverages',
      image: 'https://via.placeholder.com/100/FF8C42/FFFFFF?text=Masala+Chai',
      isVeg: true,
      isSpicy: false,
      rating: 4.1,
      preparationTime: '5-8 min',
    },
  ];

  useEffect(() => {
    setMenuItems(dummyMenuItems);
  }, []);

  const filteredMenuItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory.toLowerCase());

  const addToCart = (item) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
    
    Alert.alert('Added to Cart', `${item.name} has been added to your cart!`);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.name && styles.selectedCategory,
      ]}
      onPress={() => setSelectedCategory(item.name)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item.name && styles.selectedCategoryText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderMenuItem = ({ item }) => (
    <View style={styles.menuItem}>
      <Image source={{ uri: item.image }} style={styles.menuItemImage} />
      <View style={styles.menuItemInfo}>
        <View style={styles.menuItemHeader}>
          <Text style={styles.menuItemName}>{item.name}</Text>
          <View style={styles.menuItemBadges}>
            {item.isVeg && (
              <View style={styles.vegBadge}>
                <Text style={styles.vegText}>🟢 Veg</Text>
              </View>
            )}
            {item.isSpicy && (
              <View style={styles.spicyBadge}>
                <Text style={styles.spicyText}>🌶️ Spicy</Text>
              </View>
            )}
          </View>
        </View>
        <Text style={styles.menuItemDescription}>{item.description}</Text>
        <View style={styles.menuItemDetails}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
          <Text style={styles.preparationTime}>⏱️ {item.preparationTime}</Text>
        </View>
        <View style={styles.menuItemFooter}>
          <Text style={styles.menuItemPrice}>₹{item.price}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => addToCart(item)}
          >
            <Text style={styles.addButtonText}>Add +</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
        <View style={styles.headerInfo}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <Text style={styles.restaurantCuisine}>{restaurant.cuisine}</Text>
        </View>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart', { cartItems, restaurant })}
        >
          <MaterialIcons name="shopping-cart" size={24} color="#FFF" />
          {getCartItemCount() > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{getCartItemCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Restaurant Info */}
      <View style={styles.restaurantInfo}>
        <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
        <View style={styles.restaurantDetails}>
          <View style={styles.restaurantStats}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.statText}>{restaurant.rating}</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialIcons name="access-time" size={16} color="#666" />
              <Text style={styles.statText}>{restaurant.deliveryTime}</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialIcons name="attach-money" size={16} color="#666" />
              <Text style={styles.statText}>Min ₹{restaurant.minOrder}</Text>
            </View>
          </View>
          {restaurant.offers && restaurant.offers.length > 0 && (
            <View style={styles.offersContainer}>
              {restaurant.offers.map((offer, index) => (
                <View key={index} style={styles.offerTag}>
                  <Text style={styles.offerText}>{offer}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Menu Items */}
      <FlatList
        data={filteredMenuItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
        style={styles.menuList}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Cart Button */}
      {getCartItemCount() > 0 && (
        <View style={styles.bottomCart}>
          <View style={styles.cartInfo}>
            <Text style={styles.cartItemCount}>{getCartItemCount()} items</Text>
            <Text style={styles.cartTotal}>₹{getCartTotal()}</Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => navigation.navigate('Cart', { cartItems, restaurant })}
          >
            <Text style={styles.checkoutButtonText}>View Cart</Text>
          </TouchableOpacity>
        </View>
      )}
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
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 5,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  restaurantCuisine: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
  },
  cartButton: {
    padding: 5,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FFD700',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  restaurantInfo: {
    backgroundColor: '#FFF',
    padding: 20,
  },
  restaurantImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 15,
  },
  restaurantDetails: {
    gap: 10,
  },
  restaurantStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statText: {
    fontSize: 14,
    color: '#666',
  },
  offersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  offerTag: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  offerText: {
    fontSize: 11,
    color: '#2E7D32',
    fontWeight: '600',
  },
  categoriesSection: {
    backgroundColor: '#FFF',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryItem: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  selectedCategory: {
    backgroundColor: '#FF6B6B',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  menuList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  menuItem: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuItemImage: {
    width: '100%',
    height: 150,
  },
  menuItemInfo: {
    padding: 15,
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  menuItemBadges: {
    flexDirection: 'row',
    gap: 5,
  },
  vegBadge: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  vegText: {
    fontSize: 10,
    color: '#2E7D32',
    fontWeight: '600',
  },
  spicyBadge: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  spicyText: {
    fontSize: 10,
    color: '#D32F2F',
    fontWeight: '600',
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  menuItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 12,
    color: '#FF8F00',
    fontWeight: 'bold',
  },
  preparationTime: {
    fontSize: 12,
    color: '#666',
  },
  menuItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomCart: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  cartInfo: {
    flex: 1,
  },
  cartItemCount: {
    fontSize: 14,
    color: '#666',
  },
  cartTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  checkoutButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  checkoutButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 