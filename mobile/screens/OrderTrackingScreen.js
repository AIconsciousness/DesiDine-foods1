import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

export default function OrderTrackingScreen({ route, navigation }) {
  const { order } = route.params;
  const [currentStage, setCurrentStage] = useState(order?.orderStage || 'preparing');
  const [estimatedTime, setEstimatedTime] = useState('15-20 minutes');

  const orderStages = [
    {
      id: 'ordered',
      title: 'Order Confirmed',
      description: 'Your order has been received',
      icon: 'receipt',
      completed: true,
    },
    {
      id: 'preparing',
      title: 'Preparing Your Food',
      description: 'Chef is cooking your delicious meal',
      icon: 'restaurant',
      completed: currentStage === 'preparing' || currentStage === 'out_for_delivery' || currentStage === 'delivered',
      active: currentStage === 'preparing',
    },
    {
      id: 'out_for_delivery',
      title: 'Out for Delivery',
      description: 'Your food is on the way',
      icon: 'delivery-dining',
      completed: currentStage === 'out_for_delivery' || currentStage === 'delivered',
      active: currentStage === 'out_for_delivery',
    },
    {
      id: 'delivered',
      title: 'Delivered',
      description: 'Enjoy your meal!',
      icon: 'check-circle',
      completed: currentStage === 'delivered',
      active: currentStage === 'delivered',
    },
  ];

  useEffect(() => {
    // Simulate order progress
    const timer = setInterval(() => {
      setCurrentStage(prevStage => {
        if (prevStage === 'preparing') return 'out_for_delivery';
        if (prevStage === 'out_for_delivery') return 'delivered';
        return prevStage;
      });
    }, 30000); // Change stage every 30 seconds for demo

    return () => clearInterval(timer);
  }, []);

  const getStageColor = (stage) => {
    if (stage.completed) return '#388E3C';
    if (stage.active) return '#FF6B6B';
    return '#E0E0E0';
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const renderStageItem = (stage, index) => (
    <View key={stage.id} style={styles.stageItem}>
      <View style={styles.stageLeft}>
        <View style={[
          styles.stageIcon,
          { backgroundColor: getStageColor(stage) + '20' }
        ]}>
          <MaterialIcons 
            name={stage.icon} 
            size={24} 
            color={getStageColor(stage)} 
          />
        </View>
        {index < orderStages.length - 1 && (
          <View style={[
            styles.stageLine,
            { backgroundColor: stage.completed ? '#388E3C' : '#E0E0E0' }
          ]} />
        )}
      </View>
      <View style={styles.stageContent}>
        <Text style={[
          styles.stageTitle,
          { color: stage.completed || stage.active ? '#333' : '#999' }
        ]}>
          {stage.title}
        </Text>
        <Text style={[
          styles.stageDescription,
          { color: stage.completed || stage.active ? '#666' : '#CCC' }
        ]}>
          {stage.description}
        </Text>
        {stage.active && (
          <Text style={styles.activeTime}>
            {formatTime(new Date())}
          </Text>
        )}
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
        <Text style={styles.headerTitle}>Track Order</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Order Info Card */}
        <View style={styles.orderInfoCard}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderNumber}>{order?.orderNumber || '#12345'}</Text>
            <View style={styles.estimatedTime}>
              <MaterialIcons name="access-time" size={16} color="#FF6B6B" />
              <Text style={styles.estimatedTimeText}>{estimatedTime}</Text>
            </View>
          </View>
          
          <View style={styles.restaurantInfo}>
            <View style={styles.restaurantImageContainer}>
              <Text style={styles.restaurantImageText}>
                {order?.restaurantName?.split(' ').map(word => word[0]).join('') || 'SG'}
              </Text>
            </View>
            <View style={styles.restaurantDetails}>
              <Text style={styles.restaurantName}>{order?.restaurantName || 'Spice Garden'}</Text>
              <Text style={styles.orderItems}>
                {order?.items?.slice(0, 2).join(', ') || 'Butter Chicken, Naan'}
                {order?.items && order.items.length > 2 && ` +${order.items.length - 2} more`}
              </Text>
            </View>
          </View>

          <View style={styles.orderSummary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Order Total:</Text>
              <Text style={styles.summaryValue}>₹{order?.total || 420}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Payment Method:</Text>
              <Text style={styles.summaryValue}>{order?.paymentMethod || 'UPI'}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Address:</Text>
              <Text style={styles.summaryValue}>{order?.deliveryAddress || 'Home - 123 Main Street, City'}</Text>
            </View>
          </View>
        </View>

        {/* Order Progress */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Order Progress</Text>
          <View style={styles.stagesContainer}>
            {orderStages.map((stage, index) => renderStageItem(stage, index))}
          </View>
        </View>

        {/* Delivery Info */}
        {currentStage === 'out_for_delivery' && (
          <View style={styles.deliveryCard}>
            <Text style={styles.deliveryTitle}>Delivery Partner</Text>
            <View style={styles.deliveryPartner}>
              <View style={styles.partnerAvatar}>
                <Text style={styles.partnerInitials}>RD</Text>
              </View>
              <View style={styles.partnerInfo}>
                <Text style={styles.partnerName}>Rahul Das</Text>
                <Text style={styles.partnerVehicle}>🚗 Bike • DL-01-AB-1234</Text>
                <Text style={styles.partnerRating}>⭐ 4.8 (2.5k deliveries)</Text>
              </View>
              <TouchableOpacity style={styles.callButton}>
                <MaterialIcons name="phone" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Help Section */}
        <View style={styles.helpCard}>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <View style={styles.helpOptions}>
            <TouchableOpacity style={styles.helpOption}>
              <MaterialIcons name="support-agent" size={24} color="#FF6B6B" />
              <Text style={styles.helpOptionText}>Contact Support</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.helpOption}>
              <MaterialIcons name="chat" size={24} color="#FF6B6B" />
              <Text style={styles.helpOptionText}>Live Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      {currentStage === 'delivered' && (
        <View style={styles.bottomAction}>
          <TouchableOpacity
            style={styles.rateButton}
            onPress={() => navigation.navigate('RateOrder', { order })}
          >
            <Text style={styles.rateButtonText}>Rate Your Experience</Text>
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
  placeholder: {
    width: 34,
  },
  content: {
    flex: 1,
  },
  orderInfoCard: {
    backgroundColor: '#FFF',
    margin: 20,
    borderRadius: 15,
    padding: 20,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  estimatedTime: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    gap: 5,
  },
  estimatedTimeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B6B',
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
  orderSummary: {
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  progressCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  stagesContainer: {
    gap: 20,
  },
  stageItem: {
    flexDirection: 'row',
  },
  stageLeft: {
    alignItems: 'center',
    marginRight: 15,
  },
  stageIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stageLine: {
    width: 2,
    height: 30,
    marginTop: 5,
  },
  stageContent: {
    flex: 1,
    paddingTop: 5,
  },
  stageTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  stageDescription: {
    fontSize: 14,
    marginBottom: 5,
  },
  activeTime: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  deliveryCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
  },
  deliveryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  deliveryPartner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partnerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  partnerInitials: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  partnerInfo: {
    flex: 1,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  partnerVehicle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  partnerRating: {
    fontSize: 12,
    color: '#666',
  },
  callButton: {
    backgroundColor: '#FF6B6B',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  helpOptions: {
    flexDirection: 'row',
    gap: 20,
  },
  helpOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
  },
  helpOptionText: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  rateButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  rateButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 