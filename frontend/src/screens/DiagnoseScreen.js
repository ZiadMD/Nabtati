import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute, useNavigation } from '@react-navigation/native';
import TabBarIcon from '../components/TabBarIcon';
import theme from '../theme';

const DiagnoseScreen = () => {
  const { t, i18n } = useTranslation();
  const route = useRoute();
  const navigation = useNavigation();
  const { plant } = route.params;
  
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);
  
  const currentLanguage = i18n.language;
  const isArabic = currentLanguage === 'ar';

  // Mock function to simulate taking a photo
  const takePhoto = () => {
    // In a real app, this would use the camera API
    setLoading(true);
    
    // Simulate camera delay
    setTimeout(() => {
      // Use the plant's image as a placeholder
      setImage(plant.photo_url);
      setLoading(false);
    }, 1500);
  };

  // Mock function to simulate uploading a photo from gallery
  const uploadPhoto = () => {
    // In a real app, this would use the image picker API
    setLoading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      // Use the plant's image as a placeholder
      setImage(plant.photo_url);
      setLoading(false);
    }, 1500);
  };

  // Mock function to simulate diagnosing the plant
  const diagnoseImage = () => {
    if (!image) {
      Alert.alert(
        t('error'),
        t('diagnoseImageRequired'),
        [{ text: 'OK' }]
      );
      return;
    }
    
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Mock diagnosis result
      const mockDiagnosis = {
        condition: 'Leaf Spot',
        conditionAr: 'بقع الأوراق',
        confidence: 87,
        description: 'Leaf spot is a common disease characterized by brown or black spots on leaves. It is usually caused by fungi and can spread to other plants if not treated.',
        descriptionAr: 'بقع الأوراق هو مرض شائع يتميز ببقع بنية أو سوداء على الأوراق. عادة ما يكون سببه الفطريات ويمكن أن ينتشر إلى النباتات الأخرى إذا لم يتم علاجه.',
        treatment: [
          'Remove affected leaves',
          'Avoid overhead watering',
          'Apply fungicide',
          'Ensure good air circulation'
        ],
        treatmentAr: [
          'إزالة الأوراق المصابة',
          'تجنب الري العلوي',
          'استخدام مبيد فطري',
          'ضمان دوران الهواء الجيد'
        ],
        preventionTips: [
          'Water at the base of plants',
          'Space plants properly',
          'Clean garden tools regularly'
        ],
        preventionTipsAr: [
          'سقي النباتات عند القاعدة',
          'وضع النباتات بشكل صحيح',
          'تنظيف أدوات الحديقة بانتظام'
        ]
      };
      
      setDiagnosis(mockDiagnosis);
      setLoading(false);
    }, 3000);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('diagnoseTitle')}</Text>
        <Text style={styles.subtitle}>
          {isArabic ? plant.nicknameAr : plant.nickname} - {isArabic ? plant.plant_name_ar : plant.plant_name}
        </Text>
      </View>
      
      {!image ? (
        <View style={styles.imageSelectionContainer}>
          <Text style={styles.instructionText}>{t('diagnoseInstructions')}</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cameraButton]} 
              onPress={takePhoto}
              disabled={loading}
            >
              <TabBarIcon name="camera" color={theme.colors.text.light} size={24} />
              <Text style={styles.buttonText}>{t('takePhoto')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.uploadButton]} 
              onPress={uploadPhoto}
              disabled={loading}
            >
              <TabBarIcon name="image" color={theme.colors.text.light} size={24} />
              <Text style={styles.buttonText}>{t('uploadPhoto')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.diagnosisContainer}>
          <Image source={image} style={styles.plantImage} />
          
          {!diagnosis && (
            <TouchableOpacity 
              style={[styles.button, styles.diagnoseButton]} 
              onPress={diagnoseImage}
              disabled={loading}
            >
              <TabBarIcon name="search" color={theme.colors.text.light} size={24} />
              <Text style={styles.buttonText}>{t('diagnoseImage')}</Text>
            </TouchableOpacity>
          )}
          
          {diagnosis && (
            <View style={styles.resultContainer}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>
                  {isArabic ? diagnosis.conditionAr : diagnosis.condition}
                </Text>
                <View style={styles.confidenceContainer}>
                  <Text style={styles.confidenceText}>
                    {t('confidence')}: {diagnosis.confidence}%
                  </Text>
                </View>
              </View>
              
              <Text style={styles.resultDescription}>
                {isArabic ? diagnosis.descriptionAr : diagnosis.description}
              </Text>
              
              <View style={styles.treatmentContainer}>
                <Text style={styles.sectionTitle}>{t('treatment')}</Text>
                {(isArabic ? diagnosis.treatmentAr : diagnosis.treatment).map((item, index) => (
                  <View key={index} style={styles.listItem}>
                    <View style={styles.bulletPoint} />
                    <Text style={styles.listItemText}>{item}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.preventionContainer}>
                <Text style={styles.sectionTitle}>{t('prevention')}</Text>
                {(isArabic ? diagnosis.preventionTipsAr : diagnosis.preventionTips).map((item, index) => (
                  <View key={index} style={styles.listItem}>
                    <View style={styles.bulletPoint} />
                    <Text style={styles.listItemText}>{item}</Text>
                  </View>
                ))}
              </View>
              
              <TouchableOpacity 
                style={[styles.button, styles.newDiagnosisButton]} 
                onPress={() => {
                  setImage(null);
                  setDiagnosis(null);
                }}
              >
                <TabBarIcon name="refresh" color={theme.colors.text.light} size={24} />
                <Text style={styles.buttonText}>{t('newDiagnosis')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>{t('loading')}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.main,
  },
  header: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
  },
  imageSelectionContainer: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: theme.spacing.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.small,
    minWidth: 150,
  },
  cameraButton: {
    backgroundColor: theme.colors.primary,
  },
  uploadButton: {
    backgroundColor: theme.colors.secondary,
  },
  diagnoseButton: {
    backgroundColor: theme.colors.primary,
    marginTop: theme.spacing.md,
    alignSelf: 'center',
  },
  newDiagnosisButton: {
    backgroundColor: theme.colors.secondary,
    marginTop: theme.spacing.lg,
    alignSelf: 'center',
  },
  buttonText: {
    color: theme.colors.text.light,
    fontWeight: theme.typography.fontWeight.bold,
    marginLeft: theme.spacing.sm,
  },
  diagnosisContainer: {
    padding: theme.spacing.md,
  },
  plantImage: {
    width: '100%',
    height: 250,
    borderRadius: theme.borderRadius.md,
    resizeMode: 'cover',
    ...theme.shadows.small,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    color: theme.colors.text.light,
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
  },
  resultContainer: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    ...theme.shadows.small,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  resultTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    flex: 1,
  },
  confidenceContainer: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  confidenceText: {
    color: theme.colors.text.light,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  resultDescription: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
    lineHeight: 22,
  },
  treatmentContainer: {
    marginBottom: theme.spacing.lg,
  },
  preventionContainer: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginTop: 6,
    marginRight: theme.spacing.sm,
  },
  listItemText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    flex: 1,
  },
});

export default DiagnoseScreen;