import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute, useNavigation } from '@react-navigation/native';
import TabBarIcon from '../components/TabBarIcon';
import theme from '../theme';

const CartScreen = () => {
  const { t, i18n } = useTranslation();
  const route = useRoute();
  const navigation = useNavigation();
  
  // Get cart items from route params or use empty array if not provided
  const [cartItems, setCartItems] = useState(route.params?.cartItems || []);
  
  const currentLanguage = i18n.language;
  const isArabic = currentLanguage === 'ar';

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (total, item) => total + (item.price * item.quantity),
    0
  );
  
  // Fixed shipping cost
  const shipping = cartItems.length > 0 ? 5.99 : 0;
  
  // Calculate total
  const total = subtotal + shipping;

  // Remove item from cart
  const removeItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  // Update item quantity
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      // Ask for confirmation before removing item
      Alert.alert(
        t('removeItem'),
        t('removeItemConfirmation'),
        [
          {
            text: t('cancel'),
            style: 'cancel'
          },
          {
            text: t('remove'),
            onPress: () => removeItem(itemId),
            style: 'destructive'
          }
        ]
      );
      return;
    }
    
    setCartItems(cartItems.map(item => 
      item.id === itemId 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };

  // Proceed to checkout
  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert(
        t('emptyCart'),
        t('emptyCartMessage'),
        [{ text: 'OK' }]
      );
      return;
    }
    
    navigation.navigate('Checkout', { 
      cartItems,
      subtotal,
      shipping,
      total
    });
  };

  // Continue shopping
  const continueShopping = () => {
    navigation.goBack();
  };

  // Render cart item
  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={item.image} style={styles.itemImage} />
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>
          {isArabic ? item.nameAr : item.name}
        </Text>
        
        <Text style={styles.itemPrice}>
          ${item.price.toFixed(2)}
        </Text>
      </View>
      
      <View style={styles.quantityContainer}>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, item.quantity - 1)}
        >
          <TabBarIcon name="remove" color={theme.colors.text.primary} size={18} />
        </TouchableOpacity>
        
        <Text style={styles.quantityText}>{item.quantity}</Text>
        
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <TabBarIcon name="add" color={theme.colors.text.primary} size={18} />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.itemTotal}>
        ${(item.price * item.quantity).toFixed(2)}
      </Text>
      
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => removeItem(item.id)}
      >
        <TabBarIcon name="trash" color={theme.colors.error} size={20} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('cart')}</Text>
        <Text style={styles.itemCount}>
          {cartItems.length} {cartItems.length === 1 ? t('item') : t('items')}
        </Text>
      </View>
      
      {cartItems.length > 0 ? (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.cartList}
          />
          
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('subtotal')}</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('shipping')}</Text>
              <Text style={styles.summaryValue}>${shipping.toFixed(2)}</Text>
            </View>
            
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>{t('total')}</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.checkoutButton]}
              onPress={proceedToCheckout}
            >
              <Text style={styles.checkoutButtonText}>{t('proceedToCheckout')}</Text>
              <TabBarIcon name="arrow-forward" color={theme.colors.text.light} size={20} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.continueButton]}
              onPress={continueShopping}
            >
              <TabBarIcon name="arrow-back" color={theme.colors.primary} size={20} />
              <Text style={styles.continueButtonText}>{t('continueShopping')}</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <TabBarIcon name="cart" color={theme.colors.text.secondary} size={64} />
          <Text style={styles.emptyTitle}>{t('emptyCart')}</Text>
          <Text style={styles.emptyText}>{t('emptyCartDescription')}</Text>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.shopButton]}
            onPress={continueShopping}
          >
            <TabBarIcon name="leaf" color={theme.colors.text.light} size={20} />
            <Text style={styles.shopButtonText}>{t('startShopping')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.main,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  itemCount: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
  },
  cartList: {
    padding: theme.spacing.md,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.md,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  itemPrice: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacing.md,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.background.main,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  quantityText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginHorizontal: theme.spacing.sm,
    minWidth: 20,
    textAlign: 'center',
  },
  itemTotal: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    minWidth: 60,
    textAlign: 'right',
  },
  removeButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
  },
  summaryContainer: {
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
  },
  summaryValue: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  totalRow: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  totalLabel: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  totalValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  actionsContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  checkoutButton: {
    backgroundColor: theme.colors.primary,
  },
  checkoutButtonText: {
    color: theme.colors.text.light,
    fontWeight: theme.typography.fontWeight.bold,
    fontSize: theme.typography.fontSize.md,
    marginRight: theme.spacing.sm,
  },
  continueButton: {
    backgroundColor: theme.colors.background.main,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  continueButtonText: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
    fontSize: theme.typography.fontSize.md,
    marginLeft: theme.spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  shopButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
  },
  shopButtonText: {
    color: theme.colors.text.light,
    fontWeight: theme.typography.fontWeight.bold,
    fontSize: theme.typography.fontSize.md,
    marginLeft: theme.spacing.sm,
  },
});

export default CartScreen;