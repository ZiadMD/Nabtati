import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import TabBarIcon from '../components/TabBarIcon';
import theme from '../theme';

// Mock data for marketplace items
const mockItems = [
  {
    id: '1',
    name: 'Monstera Deliciosa',
    nameAr: 'مونستيرا ديليسيوسا',
    category: 'indoor',
    categoryAr: 'نباتات داخلية',
    price: 25.99,
    image: require('../assets/placeholder.png.svg'), // This would be replaced with actual images
    rating: 4.8,
    reviews: 124,
    description: 'A beautiful tropical plant with unique split leaves. Easy to care for and perfect for beginners.',
    descriptionAr: 'نبات استوائي جميل بأوراق مقسمة فريدة. سهل العناية ومثالي للمبتدئين.',
    inStock: true
  },
  {
    id: '2',
    name: 'Fiddle Leaf Fig',
    nameAr: 'شجرة التين الكمان',
    category: 'indoor',
    categoryAr: 'نباتات داخلية',
    price: 34.99,
    image: require('../assets/placeholder.png.svg'),
    rating: 4.5,
    reviews: 89,
    description: 'Popular indoor plant known for its large, violin-shaped leaves. Makes a stunning statement in any room.',
    descriptionAr: 'نبات داخلي شهير معروف بأوراقه الكبيرة على شكل كمان. يضفي لمسة مميزة في أي غرفة.',
    inStock: true
  },
  {
    id: '3',
    name: 'Organic Potting Soil',
    nameAr: 'تربة زراعية عضوية',
    category: 'supplies',
    categoryAr: 'مستلزمات',
    price: 12.99,
    image: require('../assets/placeholder.png.svg'),
    rating: 4.7,
    reviews: 203,
    description: 'Premium organic potting mix perfect for indoor and outdoor plants. Enriched with nutrients for healthy growth.',
    descriptionAr: 'خليط تربة عضوية ممتازة مثالية للنباتات الداخلية والخارجية. مخصبة بالمغذيات للنمو الصحي.',
    inStock: true
  },
  {
    id: '4',
    name: 'Ceramic Plant Pot',
    nameAr: 'وعاء نباتات سيراميك',
    category: 'pots',
    categoryAr: 'أواني',
    price: 18.50,
    image: require('../assets/placeholder.png.svg'),
    rating: 4.9,
    reviews: 76,
    description: 'Elegant ceramic pot with drainage hole and saucer. Available in multiple colors and sizes.',
    descriptionAr: 'وعاء سيراميك أنيق مع فتحة تصريف وصحن. متوفر بألوان وأحجام متعددة.',
    inStock: false
  },
  {
    id: '5',
    name: 'Snake Plant',
    nameAr: 'نبات الثعبان',
    category: 'indoor',
    categoryAr: 'نباتات داخلية',
    price: 19.99,
    image: require('../assets/placeholder.png.svg'),
    rating: 4.6,
    reviews: 152,
    description: 'Nearly indestructible plant that thrives on neglect. Perfect for busy people or those new to plant care.',
    descriptionAr: 'نبات شبه مستحيل تدميره يزدهر مع قلة الاهتمام. مثالي للأشخاص المشغولين أو المبتدئين في العناية بالنباتات.',
    inStock: true
  },
  {
    id: '6',
    name: 'Plant Food Fertilizer',
    nameAr: 'سماد غذاء النبات',
    category: 'supplies',
    categoryAr: 'مستلزمات',
    price: 9.99,
    image: require('../assets/placeholder.png.svg'),
    rating: 4.4,
    reviews: 118,
    description: 'Balanced liquid fertilizer for all indoor plants. Promotes healthy growth and vibrant foliage.',
    descriptionAr: 'سماد سائل متوازن لجميع النباتات الداخلية. يعزز النمو الصحي والأوراق النابضة بالحياة.',
    inStock: true
  },
];

// Categories for filtering
const categories = [
  { id: 'all', name: 'All', nameAr: 'الكل' },
  { id: 'indoor', name: 'Indoor Plants', nameAr: 'نباتات داخلية' },
  { id: 'outdoor', name: 'Outdoor Plants', nameAr: 'نباتات خارجية' },
  { id: 'supplies', name: 'Supplies', nameAr: 'مستلزمات' },
  { id: 'pots', name: 'Pots & Planters', nameAr: 'أواني وأحواض' },
];

const MarketplaceScreen = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState([]);
  
  const currentLanguage = i18n.language;
  const isArabic = currentLanguage === 'ar';

  // Filter items based on search query and selected category
  const filteredItems = mockItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nameAr.includes(searchQuery);
    
    const matchesCategory = 
      selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Add item to cart
  const addToCart = (item) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      // If item already in cart, increase quantity
      setCartItems(cartItems.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 } 
          : cartItem
      ));
    } else {
      // Add new item to cart with quantity 1
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  // Navigate to product details
  const goToProductDetails = (item) => {
    navigation.navigate('ProductDetails', { product: item });
  };

  // Navigate to cart
  const goToCart = () => {
    navigation.navigate('Cart', { cartItems });
  };

  // Render category item
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.selectedCategoryItem
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text 
        style={[
          styles.categoryText,
          selectedCategory === item.id && styles.selectedCategoryText
        ]}
      >
        {isArabic ? item.nameAr : item.name}
      </Text>
    </TouchableOpacity>
  );

  // Render product item
  const renderProductItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.productItem}
      onPress={() => goToProductDetails(item)}
    >
      <Image source={item.image} style={styles.productImage} />
      
      {!item.inStock && (
        <View style={styles.outOfStockBadge}>
          <Text style={styles.outOfStockText}>{t('outOfStock')}</Text>
        </View>
      )}
      
      <View style={styles.productInfo}>
        <Text style={styles.productName}>
          {isArabic ? item.nameAr : item.name}
        </Text>
        
        <Text style={styles.productCategory}>
          {isArabic ? item.categoryAr : item.category}
        </Text>
        
        <View style={styles.ratingContainer}>
          <TabBarIcon name="star" color={theme.colors.accent} size={16} />
          <Text style={styles.ratingText}>
            {item.rating} ({item.reviews})
          </Text>
        </View>
        
        <View style={styles.productBottom}>
          <Text style={styles.productPrice}>
            ${item.price.toFixed(2)}
          </Text>
          
          <TouchableOpacity 
            style={[styles.addButton, !item.inStock && styles.disabledButton]}
            onPress={() => addToCart(item)}
            disabled={!item.inStock}
          >
            <TabBarIcon name="add" color={theme.colors.text.light} size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header with search and cart */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <TabBarIcon name="search" color={theme.colors.text.secondary} size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('searchMarketplace')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={theme.colors.text.secondary}
          />
        </View>
        
        <TouchableOpacity style={styles.cartButton} onPress={goToCart}>
          <TabBarIcon name="cart" color={theme.colors.primary} size={24} />
          {cartItems.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>
                {cartItems.reduce((total, item) => total + item.quantity, 0)}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      {/* Categories horizontal list */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      {/* Products grid */}
      <FlatList
        data={filteredItems}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productsList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <TabBarIcon name="leaf" color={theme.colors.text.secondary} size={48} />
            <Text style={styles.emptyText}>{t('noProductsFound')}</Text>
          </View>
        }
      />
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
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.main,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
  },
  cartButton: {
    position: 'relative',
    padding: theme.spacing.sm,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: theme.colors.text.light,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  },
  categoriesContainer: {
    backgroundColor: theme.colors.background.secondary,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  categoriesList: {
    paddingHorizontal: theme.spacing.md,
  },
  categoryItem: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.main,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedCategoryItem: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  selectedCategoryText: {
    color: theme.colors.text.light,
  },
  productsList: {
    padding: theme.spacing.md,
  },
  productItem: {
    flex: 1,
    margin: theme.spacing.xs,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    ...theme.shadows.small,
    maxWidth: '48%',
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  outOfStockText: {
    color: theme.colors.text.light,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  productInfo: {
    padding: theme.spacing.sm,
  },
  productName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  productCategory: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
    textTransform: 'capitalize',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  ratingText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  productBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: theme.colors.text.disabled,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
});

export default MarketplaceScreen;