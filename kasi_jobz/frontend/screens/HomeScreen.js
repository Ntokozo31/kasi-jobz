import React, { useEffect, useState } from 'react';
import { 
  View, 
  FlatList, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  RefreshControl, 
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import JobCard from '../components/JobCard';
import UserManager from '../utils/UserManager';

// HomeScreen component to display job listings and user dashboard
const HomeScreen = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const navigation = useNavigation();

  // Get user information from UserManager
  const currentUserId = UserManager.getCurrentUserId();
  const userRole = UserManager.getUserRole();

  // Popular searches for job seekers
  const popularSearches = [
    "Software Engineer",
    "Marketing",
    "Sales",
    "Customer Service",
    "Data Analyst",
    "Project Manager"
  ];

  // Fetch jobs from the API
  const fetchJobs = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      
      let jobData = [];
      if (userRole === "job_poster") {
        jobData = await api.getJobsByPoster(currentUserId);
      } else {
        jobData = await api.getAllJobs();
      }
      
      setJobs(jobData);
      console.log(`Fetched ${jobData.length} jobs for ${userRole}`);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  // Fetch dashboard stats for job posters
  const fetchDashboardStats = async () => {
    if (userRole !== "job_poster") {
      setDashboardLoading(false);
      return;
    }
    try {
      const stats = await api.getDashboardStats(currentUserId);
      setDashboardStats(stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setDashboardStats({
        totalJobs: 0,
        totalApplications: 0,
        activeJobs: 0,
        recentJobs: []
      });
    } finally {
      setDashboardLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchJobs();
    fetchDashboardStats();
  }, [userRole, currentUserId]);

  // Refresh when screen comes back into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('HomeScreen: Screen focused - refreshing data');
      fetchJobs(false);
      if (userRole === "job_poster") {
        fetchDashboardStats();
      }
    }, [userRole, currentUserId])
  );

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJobs(false);
    if (userRole === "job_poster") {
      await fetchDashboardStats();
    }
    setRefreshing(false);
  };

  // Handle search
  const handleSearch = () => {
    console.log('Searching for:', searchTerm, 'in', location);
  };

  // Header component
  const renderHeader = () => (
    <SafeAreaView style={styles.headerContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.logoContainer}>
            <Ionicons name="briefcase" size={28} color="#2563eb" />
            <Text style={styles.logoText}>Kasï Jobs</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle-outline" size={28} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );

  // Search section for job seekers
  const renderSearchSection = () => {
    if (userRole !== "job_seeker") return null;
    
    return (
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchTitle}>Find your next job</Text>
          <Text style={styles.searchSubtitle}>Search thousands of jobs</Text>
          
          <View style={styles.searchForm}>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color="#6b7280" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Job title, keywords, or company"
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholderTextColor="#9ca3af"
              />
            </View>
            
            <View style={styles.searchInputContainer}>
              <Ionicons name="location" size={20} color="#6b7280" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="City or province"
                value={location}
                onChangeText={setLocation}
                placeholderTextColor="#9ca3af"
              />
            </View>
            
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>Find jobs</Text>
            </TouchableOpacity>
          </View>

          {/* Popular Searches */}
          <View style={styles.popularSearches}>
            <Text style={styles.popularSearchesTitle}>Popular searches:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.popularSearchesList}>
                {popularSearches.map((search, index) => (
                  <TouchableOpacity key={index} style={styles.popularSearchTag}>
                    <Text style={styles.popularSearchText}>{search}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    );
  };

  // Dashboard header for job posters
  const renderDashboardHeader = () => {
    if (userRole !== "job_poster") return null;
    
    if (dashboardLoading) {
      return (
        <View style={styles.dashboardContainer}>
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      );
    }

    return (
      <View style={styles.dashboardContainer}>
        <Text style={styles.dashboardTitle}>Your Dashboard</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{dashboardStats?.totalJobs || 0}</Text>
            <Text style={styles.statLabel}>Posted Jobs</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{dashboardStats?.totalApplications || 0}</Text>
            <Text style={styles.statLabel}>Applications</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{dashboardStats?.activeJobs || 0}</Text>
            <Text style={styles.statLabel}>Active Jobs</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('PostJob')}
        >
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={styles.actionButtonText}>Post New Job</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Jobs section header
  const renderJobsHeader = () => (
    <View style={styles.jobsHeader}>
      <View style={styles.jobsHeaderContent}>
        <Text style={styles.jobsTitle}>
          {userRole === "job_poster" ? "My Posted Jobs" : "Jobs for you in South Africa"}
        </Text>
        <Text style={styles.jobsCount}>{jobs.length} jobs found</Text>
      </View>
      <TouchableOpacity style={styles.filterButton}>
        <Ionicons name="filter" size={16} color="#6b7280" />
        <Text style={styles.filterButtonText}>Filters</Text>
      </TouchableOpacity>
    </View>
  );

  // Empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons 
        name={userRole === "job_poster" ? "document-text-outline" : "search-outline"} 
        size={64} 
        color="#d1d5db" 
      />
      <Text style={styles.emptyTitle}>
        {userRole === "job_poster" ? "No jobs posted yet" : "No jobs found"}
      </Text>
      <Text style={styles.emptyText}>
        {userRole === "job_poster" 
          ? "Start by posting your first job to attract candidates"
          : "Check back later for new opportunities"
        }
      </Text>
      {userRole === "job_poster" && (
        <TouchableOpacity 
          style={styles.emptyActionButton}
          onPress={() => navigation.navigate('PostJob')}
        >
          <Text style={styles.emptyActionButtonText}>Post Your First Job</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading jobs...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList
        data={jobs}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <JobCard 
            job={item}
            userRole={userRole}
            currentUserId={currentUserId}
          />
        )}
        ListHeaderComponent={() => (
          <View>
            {renderSearchSection()}
            {renderDashboardHeader()}
            {renderJobsHeader()}
          </View>
        )}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2563eb']}
            tintColor={'#2563eb'}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={jobs.length === 0 ? styles.emptyListContainer : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  
  // Header styles
  headerContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    marginLeft: 8,
  },
  profileButton: {
    padding: 4,
  },

  // Search section styles
  searchSection: {
    backgroundColor: '#ffffff',
    paddingVertical: 32,
  },
  searchContainer: {
    paddingHorizontal: 16,
  },
  searchTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  searchSubtitle: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  searchForm: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginBottom: 16,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  searchButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  popularSearches: {
    marginTop: 24,
  },
  popularSearchesTitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    textAlign: 'center',
  },
  popularSearchesList: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  popularSearchTag: {
    backgroundColor: '#eff6ff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  popularSearchText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '500',
  },

  // Dashboard styles
  dashboardContainer: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dashboardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  // Jobs header styles
  jobsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  jobsHeaderContent: {
    flex: 1,
  },
  jobsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  jobsCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    backgroundColor: '#ffffff',
  },
  filterButtonText: {
    color: '#6b7280',
    fontSize: 14,
    marginLeft: 4,
  },

  // Loading and empty states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '500',
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyActionButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyActionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;