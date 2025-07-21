import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import UserManager from '../utils/UserManager';

const JobDetailsScreen = ({ route, navigation }) => {
  const { job, onJobDeleted } = route.params || {};
  
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(false);
  
  // Get current user info
  const currentUserId = UserManager.getCurrentUserId();
  const userRole = UserManager.getUserRole();
  const isPoster = userRole === "job_poster" && job.posterId === currentUserId;

  // Save/Unsave job state
  const [isSaved, setIsSaved] = useState(job.savedBy && currentUserId ? job.savedBy.includes(currentUserId) : false);
  const [saving, setSaving] = useState(false);

  const handleToggleSave = async () => {
    if (!currentUserId) {
      Alert.alert('Please log in to save jobs.');
      return;
    }
    setSaving(true);
    try {
      if (isSaved) {
        await api.unsaveJob(job._id, currentUserId);
        setIsSaved(false);
        Alert.alert('Success', 'Successfully unsaved the job!');
      } else {
        await api.saveJob(job._id, currentUserId);
        setIsSaved(true);
        Alert.alert('Success', 'Successfully saved the job!');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not update saved jobs.');
    } finally {
      setSaving(false);
    }
  };
  
  // Format the job creation date
  const formattedDate = new Date(job.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Calculate days ago
  const daysAgo = Math.floor((new Date() - new Date(job.createdAt)) / (1000 * 60 * 60 * 24));
  const timeAgo = daysAgo === 0 ? 'Today' : daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`;

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
      const userEmail = UserManager.getUserProfile().email;
      const userApplied = apps.some(app => app.applicantEmail === userEmail);
      setHasApplied(userApplied);
    } catch (error) {
      console.error('Error checking if user applied:', error);
      setHasApplied(false);
    } finally {
      setCheckingApplication(false);
    }
  }

  useEffect(() => {
    fetchApplications();
    checkIfUserApplied();
    
    const unsubscribe = navigation.addListener('focus', () => {
      checkIfUserApplied();
    });
    return unsubscribe;
  }, [isPoster, job._id]);

  // Handle job application
  const handleApply = () => {
    navigation.navigate('ApplyJob', { job: job });
  };

  // Handle job deletion
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

  // Render applications section
  const renderApplications = () => {
    if (!isPoster) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Applications ({applications.length})</Text>
        
        {loadingApplications ? (
          <View style={styles.centerContent}>
            <Text style={styles.loadingText}>Loading applications...</Text>
          </View>
        ) : applications.length > 0 ? (
          <View style={styles.applicationsList}>
            {applications.map((app) => (
              <View key={app._id} style={styles.applicationCard}>
                <View style={styles.applicantHeader}>
                  <View style={styles.applicantAvatar}>
                    <Ionicons name="person" size={20} color="#6b7280" />
                  </View>
                  <View style={styles.applicantInfo}>
                    <Text style={styles.applicantName}>{app.applicantName}</Text>
                    <Text style={styles.applicantEmail}>{app.applicantEmail}</Text>
                    {app.phone && (
                      <Text style={styles.applicantPhone}>{app.phone}</Text>
                    )}
                  </View>
                  <Text style={styles.applicationDate}>
                    {new Date(app.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                
                {app.message && (
                  <View style={styles.messageSection}>
                    <Text style={styles.messageLabel}>Cover Letter:</Text>
                    <Text style={styles.messageText}>{app.message}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.centerContent}>
            <Ionicons name="mail-outline" size={48} color="#d1d5db" />
            <Text style={styles.noApplicationsText}>No applications yet</Text>
            <Text style={styles.noApplicationsSubtext}>
              Applications will appear here once job seekers apply
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {/* Header */}
      <SafeAreaView style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollView}>
        {/* Job Header */}
        <View style={styles.jobHeader}>
          <View style={styles.companyLogoContainer}>
            <View style={styles.companyLogo}>
              <Ionicons name="business" size={32} color="#6b7280" />
            </View>
            <View style={styles.jobHeaderInfo}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <View style={styles.companyRow}>
                <Text style={styles.company}>{job.company}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#fbbf24" />
                  <Text style={styles.rating}>4.2</Text>
                  <Text style={styles.reviews}>(127 reviews)</Text>
                </View>
              </View>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={16} color="#6b7280" />
                <Text style={styles.location}>{job.location}, {job.province}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Job Details */}
        <View style={styles.jobDetails}>
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Ionicons name="cash" size={20} color="#059669" />
              <Text style={styles.detailLabel}>Salary</Text>
              <Text style={styles.detailValue}>{job.salary || 'Not specified'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="time" size={20} color="#2563eb" />
              <Text style={styles.detailLabel}>Posted</Text>
              <Text style={styles.detailValue}>{timeAgo}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="briefcase" size={20} color="#7c3aed" />
              <Text style={styles.detailLabel}>Type</Text>
              <Text style={styles.detailValue}>{job.jobType || 'Full-time'}</Text>
            </View>
          </View>
        </View>

        {/* Job Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Description</Text>
          <Text style={styles.description}>
            {isDescriptionExpanded || job.description.length <= 300 
              ? job.description 
              : job.description.substring(0, 300) + '...'
            }
          </Text>
          {job.description.length > 300 && (
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

        {/* Additional Details */}
        {(job.experience || isPoster) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Details</Text>
            
            {job.experience && (
              <View style={styles.additionalDetailRow}>
                <Text style={styles.additionalDetailLabel}>Experience Required:</Text>
                <Text style={styles.additionalDetailValue}>{job.experience}</Text>
              </View>
            )}
            
            <View style={styles.additionalDetailRow}>
              <Text style={styles.additionalDetailLabel}>Posted Date:</Text>
              <Text style={styles.additionalDetailValue}>{formattedDate}</Text>
            </View>

            {/* Delete button for job posters */}
            {isPoster && (
              <TouchableOpacity 
                style={[styles.deleteButton, deleting && styles.deleteButtonDisabled]}
                onPress={handleDeleteJob}
                disabled={deleting}
              >
                <Ionicons name="trash" size={16} color="#ffffff" />
                <Text style={styles.deleteButtonText}>
                  {deleting ? 'Deleting...' : 'Delete This Job'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Applications section for job posters */}
        {renderApplications()}
      </ScrollView>

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
              {checkingApplication ? 'Checking...' :
                hasApplied ? 'Already Applied' :
                'Apply Now'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.saveJobButton}
            onPress={handleToggleSave}
            disabled={saving}
          >
            <Ionicons 
              name={isSaved ? 'bookmark' : 'bookmark-outline'} 
              size={20} 
              color={isSaved ? '#2563eb' : '#6b7280'} 
            />
            <Text style={styles.saveJobText}>{isSaved ? 'Saved' : 'Save Job'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  
  // Header styles
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  shareButton: {
    padding: 4,
  },
  
  scrollView: {
    flex: 1,
  },

  // Job header styles
  jobHeader: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  companyLogoContainer: {
    flexDirection: 'row',
  },
  companyLogo: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  jobHeaderInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    lineHeight: 32,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  company: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2563eb',
    marginRight: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 2,
    marginRight: 4,
  },
  reviews: {
    fontSize: 14,
    color: '#9ca3af',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 16,
    color: '#6b7280',
    marginLeft: 4,
  },

  // Job details styles
  jobDetails: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
    marginTop: 2,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Section styles
  section: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4b5563',
    textAlign: 'justify',
  },
  readMoreButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },

  // Additional details styles
  additionalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  additionalDetailLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  additionalDetailValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },

  // Delete button styles
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  deleteButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },

  // Applications styles
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '500',
  },
  applicationsList: {
    marginTop: 8,
  },
  applicationCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  applicantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  applicantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  applicantInfo: {
    flex: 1,
  },
  applicantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  applicantEmail: {
    fontSize: 14,
    color: '#2563eb',
    marginBottom: 2,
  },
  applicantPhone: {
    fontSize: 14,
    color: '#6b7280',
  },
  applicationDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  messageSection: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#2563eb',
  },
  messageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
    marginBottom: 6,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4b5563',
  },
  noApplicationsText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
    fontWeight: '500',
  },
  noApplicationsSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Apply section styles
  applySection: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
  },
  applyButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    flex: 1,
    marginRight: 12,
  },
  applyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  applyButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  applyButtonTextDisabled: {
    color: '#ffffff',
  },
  saveJobButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
  },
  saveJobText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default JobDetailsScreen;