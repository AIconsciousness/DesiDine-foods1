import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  RefreshControl,
  ImageBackground,
  Platform,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const BG_IMAGE = { uri: 'https://via.placeholder.com/400x600/4CAF50/FFFFFF?text=DesiDine' };

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [restaurants, setRestaurants] = useState([]);

  const categories = [
    { id: 'all', name: 'All', icon: 'restaurant' },
    { id: 'north', name: 'North Indian', icon: 'local-pizza' },
    { id: 'south', name: 'South Indian', icon: 'rice-bowl' },
    { id: 'chinese', name: 'Chinese', icon: 'takeout-dining' },
    { id: 'fast', name: 'Fast Food', icon: 'fastfood' },
    { id: 'dessert', name: 'Desserts', icon: 'cake' },
  ];

  const dummyRestaurants = [
    {
      id: '1',
      name: 'Spice Garden',
      cuisine: 'North Indian',
      rating: 4.5,
      deliveryTime: '30-45 min',
      minOrder: '₹200',
      image: 'https://via.placeholder.com/150/FF6B6B/FFFFFF?text=Spice+Garden',
      isOpen: true,
      offers: ['20% OFF', 'Free Delivery'],
    },
    {
      id: '2',
      name: 'Dosa Corner',
      cuisine: 'South Indian',
      rating: 4.2,
      deliveryTime: '25-35 min',
      minOrder: '₹150',
      image: 'https://via.placeholder.com/150/4ECDC4/FFFFFF?text=Dosa+Corner',
      isOpen: true,
      offers: ['15% OFF'],
    },
    {
      id: '3',
      name: 'Wok & Roll',
      cuisine: 'Chinese',
      rating: 4.3,
      deliveryTime: '35-50 min',
      minOrder: '₹250',
      image: 'https://via.placeholder.com/150/45B7D1/FFFFFF?text=Wok+%26+Roll',
      isOpen: true,
      offers: ['30% OFF', 'Free Delivery'],
    },
    {
      id: '4',
      name: 'Burger House',
      cuisine: 'Fast Food',
      rating: 4.0,
      deliveryTime: '20-30 min',
      minOrder: '₹180',
      image: 'https://via.placeholder.com/150/96CEB4/FFFFFF?text=Burger+House',
      isOpen: false,
      offers: ['25% OFF'],
    },
  ];

  useEffect(() => {
    setRestaurants(dummyRestaurants);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.name && styles.selectedCategory,
      ]}
      onPress={() => setSelectedCategory(item.name)}
    >
      <MaterialIcons
        name={item.icon}
        size={24}
        color={selectedCategory === item.name ? '#FF6B6B' : '#666'}
      />
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

  const renderRestaurantItem = ({ item }) => (
    <TouchableOpacity
      style={styles.restaurantCard}
      onPress={() => navigation.navigate('RestaurantDetail', { restaurant: item })}
    >
      <Image source={{ uri: item.image }} style={styles.restaurantImage} />
      <View style={styles.restaurantInfo}>
        <View style={styles.restaurantHeader}>
          <Text style={styles.restaurantName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
        </View>
        <Text style={styles.cuisineType}>{item.cuisine}</Text>
        <View style={styles.restaurantDetails}>
          <Text style={styles.deliveryTime}>🕒 {item.deliveryTime}</Text>
          <Text style={styles.minOrder}>💰 Min ₹{item.minOrder}</Text>
        </View>
        {item.offers.length > 0 && (
          <View style={styles.offersContainer}>
            {item.offers.map((offer, index) => (
              <View key={index} style={styles.offerTag}>
                <Text style={styles.offerText}>{offer}</Text>
              </View>
            ))}
          </View>
        )}
        {!item.isOpen && (
          <View style={styles.closedTag}>
            <Text style={styles.closedText}>Closed</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={BG_IMAGE}
      style={styles.bg}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(168,224,99,0.85)", "rgba(86,171,47,0.85)"]}
        style={styles.gradient}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.greeting}>Hello, User! 👋</Text>
                <Text style={styles.subtitle}>What would you like to eat today?</Text>
              </View>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => navigation.navigate('Profile')}
              >
                <MaterialIcons name="account-circle" size={32} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
            
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <MaterialIcons name="search" size={24} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for restaurants, dishes..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#999"
              />
              <TouchableOpacity style={styles.filterButton}>
                <MaterialIcons name="tune" size={24} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            style={styles.content}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {/* Categories */}
            <View style={styles.categoriesSection}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <FlatList
                data={categories}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesList}
              />
            </View>

            {/* Restaurants */}
            <View style={styles.restaurantsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Popular Restaurants</Text>
                <TouchableOpacity onPress={() => navigation.navigate('AllRestaurants')}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={restaurants}
                renderItem={renderRestaurantItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              />
            </View>
          </ScrollView>

          {/* Bottom Navigation */}
          <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navItem}>
              <MaterialIcons name="home" size={24} color="#FF6B6B" />
              <Text style={styles.navText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => navigation.navigate('Orders')}
            >
              <MaterialIcons name="receipt" size={24} color="#666" />
              <Text style={styles.navText}>Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => navigation.navigate('Cart')}
            >
              <MaterialIcons name="shopping-cart" size={24} color="#666" />
              <Text style={styles.navText}>Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => navigation.navigate('Profile')}
            >
              <MaterialIcons name="person" size={24} color="#666" />
              <Text style={styles.navText}>Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    // backgroundColor: '#F8F9FA', // हटाएं, अब bg image है
  },
  header: {
    backgroundColor: '#FF6B6B',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.9,
  },
  profileButton: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  categoriesSection: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#FFF',
    minWidth: 80,
  },
  selectedCategory: {
    backgroundColor: '#FF6B6B',
  },
  categoryText: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  restaurantsSection: {
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  seeAllText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
  restaurantCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 18,
    marginBottom: 18,
    marginHorizontal: 8,
    padding: 12,
    shadowColor: '#388e3c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 6,
    alignItems: 'center',
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginRight: 14,
    backgroundColor: '#e8f5e9',
    shadowColor: '#388e3c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  restaurantInfo: {
    flex: 1,
    padding: 0, // Adjusted padding
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF8F00',
  },
  cuisineType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  restaurantDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  deliveryTime: {
    fontSize: 12,
    color: '#666',
  },
  minOrder: {
    fontSize: 12,
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
  closedTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF5252',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  closedText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
}); 