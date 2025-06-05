import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Switch,
  Alert
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import TabBarIcon from '../components/TabBarIcon';
import theme from '../theme';

// Mock user data
const mockUser = {
  id: '1',
  name: 'Sarah Johnson',
  nameAr: 'سارة جونسون',
  email: 'sarah.johnson@example.com',
  phone: '+1 (555) 123-4567',
  avatar: require('../assets/placeholder.png.svg'), // This would be replaced with actual image
  address: '123 Garden Street, Plant City, FL 33563',
  addressAr: '١٢٣ شارع الحديقة، مدينة النبات، فلوريدا ٣٣٥٦٣',
  memberSince: '2023-01-15',
  plantsCount: 12,
  ordersCount: 5,
};

const ProfileScreen = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  
  const currentLanguage = i18n.language;
  const isArabic = currentLanguage === 'ar';

  // Toggle language between English and Arabic
  const toggleLanguage = () => {
    const newLanguage = isArabic ? 'en' : 'ar';
    i18n.changeLanguage(newLanguage);
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

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      t('logout'),
      t('logoutConfirmation'),
      [
        {
          text: t('cancel'),
          style: 'cancel'
        },
        {
          text: t('logout'),
          onPress: () => {
            // In a real app, this would clear authentication state
            // and navigate to login screen
            Alert.alert(t('loggedOut'), t('loggedOutMessage'));
          },
          style: 'destructive'
        }
      ]
    );
  };

  // Navigate to edit profile
  const navigateToEditProfile = () => {
    // In a real app, this would navigate to an edit profile screen
    Alert.alert(t('editProfile'), t('featureComingSoon'));
  };

  // Navigate to orders history
  const navigateToOrders = () => {
    // In a real app, this would navigate to an orders history screen
    Alert.alert(t('orders'), t('featureComingSoon'));
  };

  // Navigate to help center
  const navigateToHelp = () => {
    // In a real app, this would navigate to a help center screen
    Alert.alert(t('helpCenter'), t('featureComingSoon'));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile header */}
      <View style={styles.header}>
        <Image source={mockUser.avatar} style={styles.avatar} />
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {isArabic ? mockUser.nameAr : mockUser.name}
          </Text>
          <Text style={styles.userEmail}>{mockUser.email}</Text>
          <Text style={styles.memberSince}>
            {t('memberSince')}: {formatDate(mockUser.memberSince)}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.editButton}
          onPress={navigateToEditProfile}
        >
          <TabBarIcon name="pencil" color={theme.colors.primary} size={20} />
        </TouchableOpacity>
      </View>
      
      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{mockUser.plantsCount}</Text>
          <Text style={styles.statLabel}>{t('plants')}</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{mockUser.ordersCount}</Text>
          <Text style={styles.statLabel}>{t('orders')}</Text>
        </View>
      </View>
      
      {/* Settings section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings')}</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <TabBarIcon name="notifications" color={theme.colors.text.primary} size={24} />
            <Text style={styles.settingLabel}>{t('notifications')}</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={theme.colors.background.secondary}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <TabBarIcon name="location" color={theme.colors.text.primary} size={24} />
            <Text style={styles.settingLabel}>{t('location')}</Text>
          </View>
          <Switch
            value={locationEnabled}
            onValueChange={setLocationEnabled}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={theme.colors.background.secondary}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <TabBarIcon name="moon" color={theme.colors.text.primary} size={24} />
            <Text style={styles.settingLabel}>{t('darkMode')}</Text>
          </View>
          <Switch
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={theme.colors.background.secondary}
          />
        </View>
        
        <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
          <View style={styles.settingInfo}>
            <TabBarIcon name="globe" color={theme.colors.text.primary} size={24} />
            <Text style={styles.settingLabel}>{t('language')}</Text>
          </View>
          <View style={styles.languageOption}>
            <Text style={styles.languageText}>
              {isArabic ? 'العربية' : 'English'}
            </Text>
            <TabBarIcon name="chevron-forward" color={theme.colors.text.secondary} size={20} />
          </View>
        </TouchableOpacity>
      </View>
      
      {/* Account section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('account')}</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={navigateToEditProfile}>
          <TabBarIcon name="person" color={theme.colors.text.primary} size={24} />
          <Text style={styles.menuItemText}>{t('editProfile')}</Text>
          <TabBarIcon name="chevron-forward" color={theme.colors.text.secondary} size={20} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={navigateToOrders}>
          <TabBarIcon name="list" color={theme.colors.text.primary} size={24} />
          <Text style={styles.menuItemText}>{t('orders')}</Text>
          <TabBarIcon name="chevron-forward" color={theme.colors.text.secondary} size={20} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={navigateToHelp}>
          <TabBarIcon name="help-circle" color={theme.colors.text.primary} size={24} />
          <Text style={styles.menuItemText}>{t('helpCenter')}</Text>
          <TabBarIcon name="chevron-forward" color={theme.colors.text.secondary} size={20} />
        </TouchableOpacity>
      </View>
      
      {/* Logout button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <TabBarIcon name="log-out" color={theme.colors.error} size={24} />
        <Text style={styles.logoutText}>{t('logout')}</Text>
      </TouchableOpacity>
      
      {/* App version */}
      <Text style={styles.versionText}>Hadeeqati v1.0.0</Text>
    </ScrollView>
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
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: theme.spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  memberSince: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background.main,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.secondary,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: theme.colors.border,
    alignSelf: 'center',
  },
  section: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    ...theme.shadows.small,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.md,
  },
  languageButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginRight: theme.spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  menuItemText: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    ...theme.shadows.small,
  },
  logoutText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.error,
    marginLeft: theme.spacing.sm,
  },
  versionText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xxl,
  },
});

export default ProfileScreen;