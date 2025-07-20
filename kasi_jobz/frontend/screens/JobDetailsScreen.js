import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../services/api';
import UserManager from '../utils/UserManager';

// JobDetailsScreen component to display job details and applications
const JobDetailsScreen = ({ route, navigation }) => {
  console.log('=== JobDetailsScreen LOADED ===');
  console.log('JobDetailsScreen: route.params:', route.params);
  console.log('JobDetailsScreen: route.params keys:', Object.keys(route.params || {}));
  
  if (route.params) {
      console.log('JobDetailsScreen: onJobDeleted in params:', 'onJobDeleted' in route.params);
      console.log('JobDetailsScreen: onJobDeleted value:', route.params.onJobDeleted);
      console.log('JobDetailsScreen: onJobDeleted type:', typeof route.params.onJobDeleted);
  }
  
  const { job, onJobDeleted } = route.params || {};
  
  console.log('JobDetailsScreen: After destructuring - job:', !!job);
  console.log('JobDetailsScreen: After destructuring - onJobDeleted:', typeof onJobDeleted);
  
  // State to manage job applications
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // State to track if user has applied for the job.
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(false);

  // Get current user info
  const currentUserId = UserManager.getCurrentUserId();
  const userRole = UserManager.getUserRole();
  const isPoster = userRole === "job_poster" && job.posterId === currentUserId;

  // Format the job creation date
  const formattedDate = new Date(job.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Fetch applications for job posters
  const fetchApplications = async () => {
    if (!isPoster) return;

    try {
      setLoadingApplications(true);
      const apps = await api.getApplications(job._id);
      setApplications(apps);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    } finally {
      setLoadingApplications(false);
    }
  };

  // Check if current user has applied for the job
  const checkIfUserApplied = async () => {
    if (isPoster) return;

    try {
      setCheckingApplication(true);
      const apps = await api.getApplications(job._id);

      // Check if current user's email is in the applications
      const userEmail = UserManager.getUserProfile().email;
      const userApplied = apps.some(app => app.applicantEmail === userEmail);
      setHasApplied(userApplied);
    } catch (error) {
      if (__DEV__) {
        console.error('Error checking if user applied:', error);
      }
      setHasApplied(false);
    } finally {
      setCheckingApplication(false);
    }
  }

  useEffect(() => {
    fetchApplications();
    checkIfUserApplied();
    
    // Listen for when user returns from ApplyJob screen
    const unsubscribe = navigation.addListener('focus', () => {
      // Re-check if user applied when returning to this screen
      checkIfUserApplied();
    });

    return unsubscribe;
  }, [isPoster, job._id]);

  // Handle job application (for job seekers)
  const handleApply = () => {
    navigation.navigate('ApplyJob', { 
      job: job
    });
  };

  // Handle job deletion (for job posters)
  const handleDeleteJob = () => {
    Alert.alert(
      'Delete Job',
      `Are you sure you want to delete "${job.title}"?\n\nThis action cannot be undone and will remove all applications for this job.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: deleteJob },
      ]
    );
  };

  const deleteJob = async () => {
    try {
      setDeleting(true);
      await api.deleteJob(job._id);
      
      Alert.alert('Success', 'Job deleted successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        }
      ]);
    } catch (error) {
      console.error('Failed to delete job:', error);
      Alert.alert('Error', 'Failed to delete job. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  // Render job description with expand/collapse
  const renderDescription = () => {
    const maxLength = 200;
    const needsExpansion = job.description.length > maxLength;
    const displayText = isDescriptionExpanded || !needsExpansion 
      ? job.description 
      : job.description.substring(0, maxLength) + '...';

    return (
      <View>
        <Text style={styles.description}>{displayText}</Text>
        {needsExpansion && (
          <TouchableOpacity 
            style={styles.readMoreButton}
            onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
          >
            <Text style={styles.readMoreText}>
              {isDescriptionExpanded ? 'Show Less' : 'Read More'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Render applications section (for job posters)
  const renderApplications = () => {
    if (!isPoster) return null;

    return (
      <View style={styles.applicationsSection}>
        <Text style={styles.applicationsTitle}>👥 Job Applications</Text>
        
        {loadingApplications ? (
          <View style={styles.centerContent}>
            <Text style={styles.loadingText}>Loading applications...</Text>
          </View>
        ) : applications.length > 0 ? (
          <View style={styles.applicationsList}>
            {applications.map((app) => (
              <View key={app._id} style={styles.applicationCard}>
                <View style={styles.applicantHeader}>
                  <Text style={styles.applicantName}>{app.applicantName}</Text>
                  <Text style={styles.applicationDate}>
                    {new Date(app.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                
                <Text style={styles.applicantEmail}>📧 {app.applicantEmail}</Text>
                
                {app.phone && (
                  <Text style={styles.applicantPhone}>📱 {app.phone}</Text>
                )}
                
                {app.message && (
                  <View style={styles.messageSection}>
                    <Text style={styles.messageLabel}>💬 Message:</Text>
                    <Text style={styles.messageText}>{app.message}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.centerContent}>
            <Text style={styles.noApplicationsText}>📭 No applications yet</Text>
            <Text style={styles.noApplicationsSubtext}>
              Applications will appear here once job seekers apply
            </Text>
          </View>
        )}
      </View>
    );
  };

  // Return the job detail screen layout
  return (
    <ScrollView style={styles.container}>
      {/* Job Header */}
      <View style={styles.header}>
        <Text style={styles.jobTitle}>{job.title}</Text>
        <Text style={styles.company}>{job.company}</Text>
        <View style={styles.locationRow}>
          <Text style={styles.location}>📍 {job.location}</Text>
          {job.province && <Text style={styles.province}>, {job.province}</Text>}
        </View>
      </View>

      {/* Salary */}
      <View style={styles.salaryContainer}>
        <View style={styles.salaryBadge}>
          <Text style={styles.salaryText}>
            💰 {job.salary || 'Salary not specified'}
          </Text>
        </View>
      </View>

      {/* Job Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📄 Job Description</Text>
        {renderDescription()}
      </View>

      {/* Additional Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ℹ️ Additional Details</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>📅 Posted:</Text>
          <Text style={styles.detailValue}>{formattedDate}</Text>
        </View>
        
        {job.jobType && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>💼 Job Type:</Text>
            <Text style={styles.detailValue}>{job.jobType}</Text>
          </View>
        )}
        
        {job.experience && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>🎯 Experience:</Text>
            <Text style={styles.detailValue}>{job.experience}</Text>
          </View>
        )}

        {/* Delete button for job posters */}
        {isPoster && (
          <TouchableOpacity 
            style={[styles.deleteButton, deleting && styles.deleteButtonDisabled]}
            onPress={handleDeleteJob}
            disabled={deleting}
          >
            <Text style={styles.deleteButtonText}>
              {deleting ? '🔄 Deleting...' : '🗑️ Delete This Job'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Apply button for job seekers */}
      {!isPoster && (
        <View style={styles.applySection}>
          <TouchableOpacity 
            style={[
              styles.applyButton, 
              hasApplied && styles.applyButtonDisabled
            ]}
            onPress={handleApply}
            disabled={hasApplied || checkingApplication}
          >
            <Text style={[
              styles.applyButtonText,
              hasApplied && styles.applyButtonTextDisabled
            ]}>
              {checkingApplication ? 'CHECKING...' : 
               hasApplied ? '✅ ALREADY APPLIED' : 
               'APPLY NOW'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Applications section for job posters */}
      {renderApplications()}
    </ScrollView>
  );
}

// Style theme for JobDetailScreen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0e13',
    },
    header: {
        backgroundColor: '#1a1f29',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#2a3441',
    },
    jobTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#ffffff',
        marginBottom: 8,
        lineHeight: 34,
    },
    company: {
        fontSize: 20,
        fontWeight: '600',
        color: '#00a8ff',
        marginBottom: 12,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    location: {
        fontSize: 16,
        color: '#8d99ae',
        fontWeight: '500',
    },
    province: {
        fontSize: 16,
        color: '#8d99ae',
        fontWeight: '500',
    },
    salaryContainer: {
        padding: 20,
        alignItems: 'center',
    },
    salaryBadge: {
        backgroundColor: '#0d2818',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#00d4aa',
    },
    salaryText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#00d4aa',
        textAlign: 'center',
    },
    section: {
        margin: 20,
        backgroundColor: '#1a1f29',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#2a3441',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#b8c5d1',
        textAlign: 'justify',
    },
    readMoreButton: {
        marginTop: 12,
        alignSelf: 'flex-start',
        backgroundColor: '#0a1929',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#00a8ff',
    },
    readMoreText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#00a8ff',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#2a3441',
    },
    detailLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#8d99ae',
        flex: 1,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffff',
        flex: 1,
        textAlign: 'right',
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
        borderWidth: 1,
        borderColor: '#ff4757',
    },
    deleteButtonDisabled: {
        backgroundColor: '#6c757d',
        borderColor: '#6c757d',
    },
    deleteButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    applySection: {
        padding: 20,
        paddingBottom: 40,
    },
    applyButton: {
        backgroundColor: '#0066cc',
        paddingVertical: 18,
        paddingHorizontal: 32,
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: '#0066cc',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },
    applyButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 1,
    },
    applyButtonDisabled: {
        backgroundColor: '#6c757d',
        shadowOpacity: 0,
        elevation: 0,
    },
    applyButtonTextDisabled: {
        color: '#adb5bd',
        opacity: 0.8,
    },
    
    // Applications section styles
    applicationsSection: {
        margin: 20,
        backgroundColor: '#1a1f29',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#2a3441',
    },
    applicationsTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 20,
        textAlign: 'center',
    },
    centerContent: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    loadingText: {
        fontSize: 16,
        color: '#00a8ff',
        fontWeight: '500',
    },
    applicationsList: {
        marginTop: 10,
    },
    applicationCard: {
        backgroundColor: '#262d34',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#38434f',
    },
    applicantHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    applicantName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#ffffff',
        flex: 1,
    },
    applicationDate: {
        fontSize: 12,
        color: '#8d99ae',
        fontWeight: '400',
    },
    applicantEmail: {
        fontSize: 14,
        color: '#00a8ff',
        marginBottom: 8,
        fontWeight: '500',
    },
    applicantPhone: {
        fontSize: 14,
        color: '#8d99ae',
        marginTop: 8,
        fontWeight: '500',
    },
    messageSection: {
        marginTop: 12,
        padding: 12,
        backgroundColor: '#1a1f29',
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#00d4aa',
    },
    messageLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#00d4aa',
        marginBottom: 6,
    },
    messageText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#b8c5d1',
    },
    noApplicationsText: {
        fontSize: 18,
        color: '#8d99ae',
        textAlign: 'center',
        marginBottom: 8,
        fontWeight: '600',
    },
    noApplicationsSubtext: {
        fontSize: 14,
        color: '#6c757d',
        textAlign: 'center',
        lineHeight: 20,
    },
});

// Export the JobDetailScreen component
export default JobDetailsScreen;