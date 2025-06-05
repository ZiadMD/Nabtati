import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  Image,
  ActivityIndicator 
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

// Import components and theme
import TabBarIcon from '../components/TabBarIcon';
import theme from '../theme';

// Mock data for plants (in a real app, this would come from an API)
const MOCK_PLANTS = [
  {
    id: '1',
    nickname: 'Fern Friend',
    nicknameAr: 'صديق السرخس',
    plant_id: 3,
    plant_name: 'Boston Fern',
    plant_name_ar: 'سرخس بوسطن',
    latin_name: 'Nephrolepis exaltata',
    last_watered_date: '2023-05-30',
    watering_interval_days: 7,
    location: 'Living Room',
    locationAr: 'غرفة المعيشة',
    photo_url: require('../assets/plant_fern.png.svg'),
  },
  {
    id: '2',
    nickname: 'Spiky',
    nicknameAr: 'شائك',
    plant_id: 8,
    plant_name: 'Snake Plant',
    plant_name_ar: 'نبات الثعبان',
    latin_name: 'Sansevieria trifasciata',
    last_watered_date: '2023-06-01',
    watering_interval_days: 14,
    location: 'Bedroom',
    locationAr: 'غرفة النوم',
    photo_url: require('../assets/plant_snake.png.svg'),
  },
  {
    id: '3',
    nickname: 'Leafy',
    nicknameAr: 'ورقي',
    plant_id: 12,
    plant_name: 'Rubber Plant',
    plant_name_ar: 'نبات المطاط',
    latin_name: 'Ficus elastica',
    last_watered_date: '2023-05-25',
    watering_interval_days: 10,
    location: 'Office',
    locationAr: 'المكتب',
    photo_url: require('../assets/plant_rubber.png.svg'),
  },
];

const GardenScreen = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterWaterToday, setFilterWaterToday] = useState(false);
  
  const currentLanguage = i18n.language;
  const isArabic = currentLanguage === 'ar';

  // Fetch plants (simulated API call)
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setPlants(MOCK_PLANTS);
      setLoading(false);
    }, 1000);
  }, []);

  // Calculate days until next watering
  const calculateDaysUntilWatering = (lastWateredDate, interval) => {
    const lastWatered = new Date(lastWateredDate);
    const today = new Date();
    const diffTime = Math.abs(today - lastWatered);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const daysUntilWatering = interval - diffDays;
    
    return daysUntilWatering;
  };

  // Filter plants that need watering today
  const plantsToWaterToday = plants.filter(plant => {
    const daysUntil = calculateDaysUntilWatering(
      plant.last_watered_date, 
      plant.watering_interval_days
    );
    return daysUntil <= 0;
  });

  // Handle adding a new plant
  const handleAddPlant = () => {
    // In a real app, this would navigate to an add plant form
    alert(t('addPlant'));
  };

  // Handle plant selection
  const handleSelectPlant = (plant) => {
    navigation.navigate('Plant Details', { plant });
  };

  // Render a plant card
  const renderPlantCard = ({ item }) => {
    const daysUntilWatering = calculateDaysUntilWatering(
      item.last_watered_date, 
      item.watering_interval_days
    );
    
    const needsWatering = daysUntilWatering <= 0;
    
    return (
      <TouchableOpacity 
        style={[styles.plantCard, needsWatering && styles.needsWateringCard]}
        onPress={() => handleSelectPlant(item)}
      >
        <Image source={item.photo_url} style={styles.plantImage} />
        <View style={styles.plantInfo}>
          <Text style={styles.plantNickname}>
            {isArabic ? item.nicknameAr : item.nickname}
          </Text>
          <Text style={styles.plantSpecies}>
            {isArabic ? item.plant_name_ar : item.plant_name}
          </Text>
          <Text style={styles.plantLocation}>
            {isArabic ? item.locationAr : item.location}
          </Text>
          
          {needsWatering ? (
            <View style={styles.wateringAlert}>
              <TabBarIcon name="water" color={theme.colors.primary} size={16} />
              <Text style={styles.wateringAlertText}>{t('wateringDue')}</Text>
            </View>
          ) : (
            <View style={styles.wateringInfo}>
              <Text style={styles.wateringInfoText}>
                {t('daysUntilWatering')}: {daysUntilWatering}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Toggle filter for plants that need watering today
  const toggleWaterTodayFilter = () => {
    setFilterWaterToday(!filterWaterToday);
  };

  // Filtered plants based on current filter
  const filteredPlants = filterWaterToday ? plantsToWaterToday : plants;

  return (
    <View style={styles.container}>
      {/* Filter toggle */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, filterWaterToday && styles.filterButtonActive]}
          onPress={toggleWaterTodayFilter}
        >
          <Text style={[styles.filterButtonText, filterWaterToday && styles.filterButtonTextActive]}>
            {t('waterToday')} ({plantsToWaterToday.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, !filterWaterToday && styles.filterButtonActive]}
          onPress={() => setFilterWaterToday(false)}
        >
          <Text style={[styles.filterButtonText, !filterWaterToday && styles.filterButtonTextActive]}>
            {t('allPlants')} ({plants.length})
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Plants list */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>{t('loading')}</Text>
        </View>
      ) : filteredPlants.length > 0 ? (
        <FlatList
          data={filteredPlants}
          renderItem={renderPlantCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.plantsList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t('noPlants')}</Text>
        </View>
      )}
      
      {/* Add plant button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddPlant}
      >
        <TabBarIcon name="add" color={theme.colors.text.light} size={32} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.main,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
  },
  filterButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
    marginHorizontal: theme.spacing.xs,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  filterButtonText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  filterButtonTextActive: {
    color: theme.colors.text.light,
    fontWeight: theme.typography.fontWeight.bold,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
  },
  plantsList: {
    padding: theme.spacing.md,
  },
  plantCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    ...theme.shadows.small,
  },
  needsWateringCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  plantImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  plantInfo: {
    flex: 1,
    padding: theme.spacing.md,
  },
  plantNickname: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  plantSpecies: {
    fontSize: theme.typography.fontSize.sm,
    fontStyle: 'italic',
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  plantLocation: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  wateringInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wateringInfoText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  wateringAlert: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wateringAlertText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
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
  },
  addButton: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    right: theme.spacing.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.medium,
  },
});

export default GardenScreen;