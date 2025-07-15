import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';
import JobCard from '../components/JobCard';
import UserManager from '../utils/UserManager';

const HomeScreen = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const navigation = useNavigation();

  // Get user information from UserManager
  const currentUserId = UserManager.getCurrentUserId();
  const userRole = UserManager.getUserRole();

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
      fetchJobs(false); // Don't show loader on focus refresh
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

  // Dashboard header component
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
        <Text style={styles.dashboardTitle}>📊 Your Dashboard</Text>
        
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
          <Text style={styles.actionButtonText}>+ Post New Job</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Welcome header for job seekers
  const renderWelcomeHeader = () => {
    if (userRole !== "job_seeker") return null;

    return (
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTitle}>👋 Welcome back!</Text>
        <Text style={styles.welcomeText}>
          Find your next opportunity from top companies in South Africa
        </Text>
        <Text style={styles.welcomeStatText}>
          🎯 {jobs.length} jobs available
        </Text>
      </View>
    );
  };

  // Section header
  const renderSectionHeader = () => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>
        {userRole === "job_poster" ? "My Posted Jobs" : "Jobs for You"}
      </Text>
      {userRole === "job_seeker" && (
        <Text style={styles.sectionSubtitle}>
          Jobs based on your activity on Kasi Jobs
        </Text>
      )}
    </View>
  );

  // Empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>
        {userRole === "job_poster" ? "📝 No jobs posted yet" : "🔍 No jobs found"}
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
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>🔄 Loading jobs...</Text>
        </View>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
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
          {renderDashboardHeader()}
          {renderWelcomeHeader()}
          {renderSectionHeader()}
        </View>
      )}
      ListEmptyComponent={renderEmptyState}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#0066cc']}
          tintColor={'#0066cc'}
        />
      }
      showsVerticalScrollIndicator={false}
      contentContainerStyle={jobs.length === 0 ? styles.emptyListContainer : undefined}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e13',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#00a8ff',
    fontWeight: '600',
  },
  
  // Dashboard styles
  dashboardContainer: {
    backgroundColor: '#1a1d23',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    borderWidth: 1,
    borderColor: '#2a2d34',
  },
  dashboardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#0a0e13',
    borderRadius: 10,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2d34',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0066cc',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8d99ae',
    textAlign: 'center',
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  
  // Welcome styles
  welcomeContainer: {
    backgroundColor: '#1a1d23',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    borderWidth: 1,
    borderColor: '#2a2d34',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: '#8d99ae',
    lineHeight: 24,
    marginBottom: 16,
  },
  welcomeStatText: {
    fontSize: 14,
    color: '#00a8ff',
    fontWeight: '600',
  },
  
  // Section styles
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#8d99ae',
  },
  
  // Empty state styles
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#8d99ae',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyActionButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  emptyActionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;