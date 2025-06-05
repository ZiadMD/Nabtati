import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  Alert 
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute, useNavigation } from '@react-navigation/native';

// Import components and theme
import TabBarIcon from '../components/TabBarIcon';
import theme from '../theme';

const PlantDetailScreen = () => {
  const { t, i18n } = useTranslation();
  const route = useRoute();
  const navigation = useNavigation();
  const { plant } = route.params;
  
  const [lastWateredDate, setLastWateredDate] = useState(plant.last_watered_date);
  
  const currentLanguage = i18n.language;
  const isArabic = currentLanguage === 'ar';

  // Calculate days until next watering
  const calculateDaysUntilWatering = () => {
    const lastWatered = new Date(lastWateredDate);
    const today = new Date();
    const diffTime = Math.abs(today - lastWatered);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const daysUntilWatering = plant.watering_interval_days - diffDays;
    
    return daysUntilWatering;
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Handle water now button
  const handleWaterNow = () => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // In a real app, this would make an API call to update the last watered date
    setLastWateredDate(formattedDate);
    
    Alert.alert(
      t('waterNow'),
      t('plantDetails'),
      [{ text: 'OK' }]
    );
  };

  // Handle diagnose button
  const handleDiagnose = () => {
    navigation.navigate('Diagnose', { plant });
  };

  const daysUntilWatering = calculateDaysUntilWatering();
  const needsWatering = daysUntilWatering <= 0;

  return (
    <ScrollView style={styles.container}>
      {/* Plant image */}
      <Image source={plant.photo_url} style={styles.plantImage} />
      
      {/* Plant info card */}
      <View style={styles.infoCard}>
        <Text style={styles.nickname}>
          {isArabic ? plant.nicknameAr : plant.nickname}
        </Text>
        <Text style={styles.species}>
          {isArabic ? plant.plant_name_ar : plant.plant_name}
        </Text>
        <Text style={styles.latinName}>{plant.latin_name}</Text>
        
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <TabBarIcon name="location" color={theme.colors.primary} size={20} />
            <Text style={styles.infoLabel}>{t('location')}</Text>
            <Text style={styles.infoValue}>
              {isArabic ? plant.locationAr : plant.location}
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <TabBarIcon name="calendar" color={theme.colors.primary} size={20} />
            <Text style={styles.infoLabel}>{t('lastWatered')}</Text>
            <Text style={styles.infoValue}>{formatDate(lastWateredDate)}</Text>
          </View>
        </View>
      </View>
      
      {/* Watering schedule card */}
      <View style={styles.scheduleCard}>
        <Text style={styles.cardTitle}>{t('wateringSchedule')}</Text>
        
        <View style={styles.scheduleInfo}>
          <View style={styles.intervalInfo}>
            <Text style={styles.intervalLabel}>{t('customWateringInterval')}</Text>
            <Text style={styles.intervalValue}>
              {plant.watering_interval_days} {t('days')}
            </Text>
          </View>
          
          <View style={[styles.countdownContainer, needsWatering && styles.needsWateringContainer]}>
            {needsWatering ? (
              <>
                <TabBarIcon name="water" color={theme.colors.text.light} size={24} />
                <Text style={styles.needsWateringText}>{t('wateringDue')}</Text>
              </>
            ) : (
              <>
                <Text style={styles.countdownNumber}>{daysUntilWatering}</Text>
                <Text style={styles.countdownLabel}>{t('daysUntilWatering')}</Text>
              </>
            )}
          </View>
        </View>
      </View>
      
      {/* Action buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.waterButton]}
          onPress={handleWaterNow}
        >
          <TabBarIcon name="water" color={theme.colors.text.light} size={20} />
          <Text style={styles.actionButtonText}>{t('waterNow')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.diagnoseButton]}
          onPress={handleDiagnose}
        >
          <TabBarIcon name="search" color={theme.colors.text.light} size={20} />
          <Text style={styles.actionButtonText}>{t('diagnose')}</Text>
        </TouchableOpacity>
      </View>
      
      {/* Watering history (placeholder) */}
      <View style={styles.historyCard}>
        <Text style={styles.cardTitle}>{t('wateringHistory')}</Text>
        <View style={styles.historyItem}>
          <Text style={styles.historyDate}>{formatDate(lastWateredDate)}</Text>
          <TabBarIcon name="water" color={theme.colors.primary} size={16} />
        </View>
        {/* In a real app, this would show a list of watering events */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.main,
  },
  plantImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  infoCard: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    ...theme.shadows.small,
  },
  nickname: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  species: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  latinName: {
    fontSize: theme.typography.fontSize.md,
    fontStyle: 'italic',
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginVertical: theme.spacing.xs,
  },
  infoValue: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  scheduleCard: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    ...theme.shadows.small,
  },
  cardTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  scheduleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  intervalInfo: {
    flex: 1,
  },
  intervalLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  intervalValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  countdownContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.small,
  },
  needsWateringContainer: {
    backgroundColor: theme.colors.primary,
  },
  countdownNumber: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  countdownLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  needsWateringText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.light,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: theme.spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    flex: 1,
    marginHorizontal: theme.spacing.xs,
    ...theme.shadows.small,
  },
  waterButton: {
    backgroundColor: theme.colors.primary,
  },
  diagnoseButton: {
    backgroundColor: theme.colors.secondary,
  },
  actionButtonText: {
    color: theme.colors.text.light,
    fontWeight: theme.typography.fontWeight.bold,
    marginLeft: theme.spacing.sm,
  },
  historyCard: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xxl,
    ...theme.shadows.small,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  historyDate: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
});

export default PlantDetailScreen;