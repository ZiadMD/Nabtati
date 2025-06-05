import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  FlatList 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

// Import components and theme
import TabBarIcon from '../components/TabBarIcon';
import theme from '../theme';

// Sample data for featured tips
const FEATURED_TIPS = [
  {
    id: '1',
    title: 'Watering Indoor Plants',
    titleAr: 'سقي النباتات الداخلية',
    image: require('../assets/tip_watering.svg'),
    content: 'Most indoor plants need to be watered when the top inch of soil feels dry to the touch.',
    contentAr: 'تحتاج معظم النباتات الداخلية إلى الري عندما تشعر بجفاف البوصة العليا من التربة عند اللمس.',
  },
  {
    id: '2',
    title: 'Best Light for Succulents',
    titleAr: 'أفضل إضاءة للنباتات العصارية',
    image: require('../assets/tip_light.svg'),
    content: 'Succulents thrive in bright, indirect sunlight for at least 6 hours per day.',
    contentAr: 'تزدهر النباتات العصارية في ضوء الشمس الساطع غير المباشر لمدة 6 ساعات على الأقل يوميًا.',
  },
  {
    id: '3',
    title: 'Repotting Basics',
    titleAr: 'أساسيات إعادة زراعة النباتات',
    image: require('../assets/tip_repotting.svg'),
    content: 'Repot your plants in spring when you notice roots growing through drainage holes.',
    contentAr: 'أعد زراعة نباتاتك في الربيع عندما تلاحظ نمو الجذور من خلال فتحات التصريف.',
  },
];

const HomeScreen = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const currentLanguage = i18n.language;
  const isArabic = currentLanguage === 'ar';

  // Handler for scan plant button
  const handleScanPlant = () => {
    navigation.navigate('Diagnose');
  };

  // Render a featured tip card
  const renderTipCard = ({ item }) => (
    <TouchableOpacity style={styles.tipCard}>
      <Image source={item.image} style={styles.tipImage} />
      <View style={styles.tipContent}>
        <Text style={styles.tipTitle}>
          {isArabic ? item.titleAr : item.title}
        </Text>
        <Text style={styles.tipDescription} numberOfLines={2}>
          {isArabic ? item.contentAr : item.content}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with welcome message */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>{t('welcomeMessage')}</Text>
      </View>
      
      {/* Scan Plant Button */}
      <View style={styles.scanButtonContainer}>
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={handleScanPlant}
        >
          <TabBarIcon name="camera" color={theme.colors.text.light} size={28} />
          <Text style={styles.scanButtonText}>{t('scanPlant')}</Text>
        </TouchableOpacity>
      </View>
      
      {/* Featured Tips Section */}
      <View style={styles.tipsSection}>
        <Text style={styles.sectionTitle}>{t('featuredTips')}</Text>
        <FlatList
          data={FEATURED_TIPS}
          renderItem={renderTipCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tipsList}
        />
      </View>
      
      {/* Recent Activity Section (placeholder) */}
      <View style={styles.activitySection}>
        <Text style={styles.sectionTitle}>{t('recentActivity')}</Text>
        <View style={styles.emptyActivity}>
          <Text style={styles.emptyText}>
            {t('noPlants')}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.main,
  },
  header: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primary,
  },
  welcomeText: {
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text.light,
    fontWeight: theme.typography.fontWeight.bold,
    textAlign: 'center',
  },
  scanButtonContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.medium,
  },
  scanButtonText: {
    color: theme.colors.text.light,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    marginLeft: theme.spacing.sm,
  },
  tipsSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  tipsList: {
    paddingHorizontal: theme.spacing.md,
  },
  tipCard: {
    width: 250,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.md,
    overflow: 'hidden',
    ...theme.shadows.small,
  },
  tipImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  tipContent: {
    padding: theme.spacing.md,
  },
  tipTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  tipDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  activitySection: {
    flex: 1,
    marginBottom: theme.spacing.lg,
  },
  emptyActivity: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});

export default HomeScreen;