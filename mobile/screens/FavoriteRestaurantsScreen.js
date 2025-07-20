import React, { useState } from 'react';
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

export default function FavoriteRestaurantsScreen({ navigation }) {
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([
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
      addedDate: '2024-01-10',
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
      addedDate: '2024-01-08',
    },
    {
      id: '3',
      name: 'Wok & Roll',
      cuisine: 'Chinese',
      rating: 4.3,
      deliveryTime: '35-50 min',
      minOrder: '₹250',
      image: 'https://via.placeholder.com/150/45B7D1/FFFFFF?text=Wok+%26+Roll',
      isOpen: false,
      offers: ['30% OFF', 'Free Delivery'],
      addedDate: '2024-01-05',
    },
  ]);

  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const handleRemoveFavorite = (restaurantId) => {
    Alert.alert(
      'Remove from Favorites',
      'Are you sure you want to remove this restaurant from favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setFavoriteRestaurants(favoriteRestaurants.filter(restaurant => restaurant.id !== restaurantId));
          },
        },
      ]
    );
  };

  const handleReorder = (restaurant) => {
    navigation.navigate('RestaurantDetail', { restaurant });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderGridItem = ({ item }) => (
    <TouchableOpacity
      style={styles.gridCard}
      onPress={() => navigation.navigate('RestaurantDetail', { restaurant: item })}
    >
      <Image source={{ uri: item.image }} style={styles.gridImage} />
      <View style={styles.gridContent}>
        <View style={styles.gridHeader}>
          <Text style={styles.gridName} numberOfLines={1}>{item.name}</Text>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => handleRemoveFavorite(item.id)}
          >
            <MaterialIcons name="favorite" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
        <Text style={styles.gridCuisine}>{item.cuisine}</Text>
        <View style={styles.gridRating}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.gridRatingText}>{item.rating}</Text>
        </View>
        <Text style={styles.gridDelivery}>🕒 {item.deliveryTime}</Text>
        {!item.isOpen && (
          <View style={styles.closedTag}>
            <Text style={styles.closedText}>Closed</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderListItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listCard}
      onPress={() => navigation.navigate('RestaurantDetail', { restaurant: item })}
    >
      <Image source={{ uri: item.image }} style={styles.listImage} />
      <View style={styles.listContent}>
        <View style={styles.listHeader}>
          <Text style={styles.listName}>{item.name}</Text>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => handleRemoveFavorite(item.id)}
          >
            <MaterialIcons name="favorite" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
        <Text style={styles.listCuisine}>{item.cuisine}</Text>
        <View style={styles.listDetails}>
          <View style={styles.listRating}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.listRatingText}>{item.rating}</Text>
          </View>
          <Text style={styles.listDelivery}>🕒 {item.deliveryTime}</Text>
          <Text style={styles.listMinOrder}>💰 Min ₹{item.minOrder}</Text>
        </View>
        {item.offers.length > 0 && (
          <View style={styles.offersContainer}>
            {item.offers.slice(0, 2).map((offer, index) => (
              <View key={index} style={styles.offerTag}>
                <Text style={styles.offerText}>{offer}</Text>
              </View>
            ))}
          </View>
        )}
        <Text style={styles.addedDate}>Added on {formatDate(item.addedDate)}</Text>
        {!item.isOpen && (
          <View style={styles.closedTag}>
            <Text style={styles.closedText}>Closed</Text>
          </View>
        )}
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
        <Text style={styles.headerTitle}>Favorite Restaurants</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.viewModeButton}
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            <MaterialIcons 
              name={viewMode === 'grid' ? 'view-list' : 'grid-view'} 
              size={24} 
              color="#FFF" 
            />
          </TouchableOpacity>
        </View>
      </View>

      {favoriteRestaurants.length > 0 ? (
        <>
          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{favoriteRestaurants.length}</Text>
              <Text style={styles.statLabel}>Restaurants</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {favoriteRestaurants.filter(r => r.isOpen).length}
              </Text>
              <Text style={styles.statLabel}>Open Now</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {favoriteRestaurants.filter(r => r.rating >= 4.5).length}
              </Text>
              <Text style={styles.statLabel}>Top Rated</Text>
            </View>
          </View>

          {/* Restaurants List */}
          <FlatList
            data={favoriteRestaurants}
            renderItem={viewMode === 'grid' ? renderGridItem : renderListItem}
            keyExtractor={(item) => item.id}
            style={styles.restaurantsList}
            contentContainerStyle={[
              styles.restaurantsListContent,
              viewMode === 'grid' && styles.gridContainer
            ]}
            numColumns={viewMode === 'grid' ? 2 : 1}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="favorite-border" size={80} color="#CCC" />
          <Text style={styles.emptyTitle}>No Favorite Restaurants</Text>
          <Text style={styles.emptySubtitle}>
            Start adding restaurants to your favorites to see them here
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.browseButtonText}>Browse Restaurants</Text>
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
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  viewModeButton: {
    padding: 5,
  },
  statsContainer: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    margin: 20,
    borderRadius: 15,
    padding: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  restaurantsList: {
    flex: 1,
  },
  restaurantsListContent: {
    padding: 20,
  },
  gridContainer: {
    paddingHorizontal: 10,
  },
  gridCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 15,
    margin: 5,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  gridImage: {
    width: '100%',
    height: 120,
  },
  gridContent: {
    padding: 12,
  },
  gridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  gridName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  favoriteButton: {
    padding: 2,
  },
  gridCuisine: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  gridRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  gridRatingText: {
    fontSize: 12,
    color: '#FF8F00',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  gridDelivery: {
    fontSize: 11,
    color: '#666',
  },
  listCard: {
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
  listImage: {
    width: '100%',
    height: 150,
  },
  listContent: {
    padding: 15,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  listName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  listCuisine: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  listDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  listRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listRatingText: {
    fontSize: 12,
    color: '#FF8F00',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  listDelivery: {
    fontSize: 12,
    color: '#666',
  },
  listMinOrder: {
    fontSize: 12,
    color: '#666',
  },
  offersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 8,
  },
  offerTag: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  offerText: {
    fontSize: 10,
    color: '#2E7D32',
    fontWeight: '600',
  },
  addedDate: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
  },
  closedTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF5252',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  closedText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
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