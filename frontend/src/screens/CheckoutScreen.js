import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

// Import theme
import theme from '../theme';

// Mock checkout function (to be replaced with actual API call)
const mockProcessOrder = async (orderDetails) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate successful order
  return {
    orderId: 'ORD-' + Date.now(),
    status: 'Pending',
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  };
};

const CheckoutScreen = ({ route }) => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const { cartItems, totalAmount } = route.params || { cartItems: [], totalAmount: 0 };
  
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod'); // cash on delivery by default
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  
  const handlePlaceOrder = async () => {
    // Validate inputs
    if (!address || !city || !phone) {
      Alert.alert(t('error'), t('requiredField'));
      return;
    }
    
    if (cartItems.length === 0) {
      Alert.alert(t('error'), t('emptyCart'));
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Prepare order data
      const orderData = {
        items: cartItems,
        shippingAddress: `${address}, ${city}`,
        phoneNumber: phone,
        paymentMethod,
        totalAmount
      };
      
      // Process order
      const result = await mockProcessOrder(orderData);
      
      // Update state with order details
      setOrderDetails(result);
      setOrderComplete(true);
      
      // In a real app, you would clear the cart here
      
    } catch (error) {
      Alert.alert(t('error'), error.message || t('networkError'));
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleContinueShopping = () => {
    // Navigate back to marketplace
    navigation.navigate('Marketplace');
  };
  
  // Order confirmation screen
  if (orderComplete && orderDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.confirmationContainer}>
          <Text style={styles.confirmationTitle}>{t('orderConfirmation')}</Text>
          <Text style={styles.confirmationMessage}>{t('orderPlaced')}</Text>
          
          <View style={styles.orderInfoContainer}>
            <Text style={styles.orderInfoLabel}>{t('orderNumber')}:</Text>
            <Text style={styles.orderInfoValue}>{orderDetails.orderId}</Text>
            
            <Text style={styles.orderInfoLabel}>{t('status')}:</Text>
            <Text style={styles.orderInfoValue}>{orderDetails.status}</Text>
            
            <Text style={styles.orderInfoLabel}>{t('estimatedDelivery')}:</Text>
            <Text style={styles.orderInfoValue}>{orderDetails.estimatedDelivery}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={handleContinueShopping}
          >
            <Text style={styles.buttonText}>{t('continueShopping')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('orderSummary')}</Text>
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>{t('items')}: {cartItems.length}</Text>
            <Text style={styles.summaryText}>{t('total')}: ${totalAmount.toFixed(2)}</Text>
          </View>
        </View>
        
        {/* Shipping Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('shippingAddress')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('address')}
            value={address}
            onChangeText={setAddress}
          />
          <TextInput
            style={styles.input}
            placeholder={t('city')}
            value={city}
            onChangeText={setCity}
          />
          <TextInput
            style={styles.input}
            placeholder={t('phoneNumber')}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>
        
        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('paymentMethod')}</Text>
          <View style={styles.paymentOptions}>
            <TouchableOpacity 
              style={[styles.paymentOption, paymentMethod === 'cod' && styles.selectedPayment]}
              onPress={() => setPaymentMethod('cod')}
            >
              <Text style={styles.paymentOptionText}>{t('cashOnDelivery')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.paymentOption, paymentMethod === 'card' && styles.selectedPayment]}
              onPress={() => setPaymentMethod('card')}
            >
              <Text style={styles.paymentOptionText}>{t('creditCard')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Place Order Button */}
        <TouchableOpacity 
          style={[styles.button, isProcessing && styles.buttonDisabled]}
          onPress={handlePlaceOrder}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color={theme.colors.text.light} />
          ) : (
            <Text style={styles.buttonText}>{t('placeOrder')}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.main,
  },
  scrollContainer: {
    padding: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.shadows.small,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  input: {
    backgroundColor: theme.colors.background.main,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    fontSize: theme.typography.fontSize.md,
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentOption: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background.main,
    marginHorizontal: theme.spacing.xs,
    alignItems: 'center',
  },
  selectedPayment: {
    backgroundColor: theme.colors.primary,
  },
  paymentOptionText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: theme.colors.text.light,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
  },
  confirmationContainer: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmationTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  confirmationMessage: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  orderInfoContainer: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    width: '100%',
    marginBottom: theme.spacing.xl,
    ...theme.shadows.small,
  },
  orderInfoLabel: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  orderInfoValue: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
});

export default CheckoutScreen;