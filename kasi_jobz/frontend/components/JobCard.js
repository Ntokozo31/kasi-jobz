import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';


// JobCard component
const JobCard = ({ job, userRole, currentUserId }) => {
  const formattedDate = new Date(job.createdAt).toLocaleDateString();
  const navigation = useNavigation();

  // Check if current user is the job poster
  const isPoster = job.posterId === currentUserId;

  // Return the job card layout
  return (
    <TouchableOpacity onPress={() => navigation.navigate('JobDetail', { job })}>
      <View style={styles.container}>
      <View style={styles.card}>
        {/* Job Title */}
        <Text style={styles.title}>{job.title}</Text>
        
        {/* Company */} 
        <Text style={styles.company}>{job.company}</Text>

        {/* Location and Province */}
        <Text style={styles.location}>{job.location}, {job.province}</Text>
        
        {/* Salary */}
        <Text style={styles.salary}>
          {job.salary ? `💰 ${job.salary}` : '💰 Salary not listed'}
        </Text>
        
        {/* Posted Date */}
        <Text style={styles.date}>📅 Posted: {formattedDate}</Text>

        {/* Job Description Preview */}
        {job.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel}>📄 Description:</Text>
            <Text style={styles.descriptionPreview}>
              {(() => {
                // Show longer preview for job seekers, shorter for job posters
                const maxLength = userRole === "job_seeker" ? 150 : 100;
                return job.description.length > maxLength 
                  ? `${job.description.substring(0, maxLength)}...` 
                  : job.description;
              })()}
            </Text>
            {(() => {
              const maxLength = userRole === "job_seeker" ? 150 : 100;
              return job.description.length > maxLength && (
                <Text style={styles.readMore}>Read more →</Text>
              );
            })()}
          </View>
        )}

        {/* Conditional Button based on user role and ownership */}
        {userRole === "job_poster" && isPoster ? (
          // Show "View Applications" for job posters viewing their own jobs
          <View style={styles.posterButton}>
            <Text style={styles.posterButtonText}>👥 View Applications</Text>
          </View>
        ) : userRole === "job_seeker" ? (
          // Show "Easy Apply" only for job seekers
          <View style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Easily apply</Text>
          </View>
        ) : userRole === "job_poster" && !isPoster ? (
          // Show nothing or a different message for job posters viewing other's jobs
          <View style={styles.viewOnlyButton}>
            <Text style={styles.viewOnlyText}>👁️ View Details</Text>
          </View>
        ) : null}
      </View>
      </View>
    </TouchableOpacity>
  );
};

// Styles for the JobCard component
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0a0e13',
    paddingVertical: 6,
  },

  // Card styles
  card: {
    backgroundColor: '#1a1f29',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#2a3441',
  },

  // Title styles
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
    lineHeight: 24,
  },
  
  // Company text styles 
  company: {
    fontSize: 15,
    fontWeight: '600',
    color: '#00a8ff',
    marginBottom: 4,
  },

  // Location text styles
  location: {
    fontSize: 14,
    fontWeight: '400',
    color: '#8d99ae',
    marginBottom: 8,
  },
  
  // Salary text styles
  salary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00d4aa',
    marginBottom: 12,
    backgroundColor: '#0d2818',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },

  // Date text styles
  date: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6c757d',
    marginBottom: 16,
  },

  // Description preview styles
  descriptionContainer: {
    marginBottom: 16,
    backgroundColor: '#0f1419',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#00a8ff',
  },
  descriptionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#00a8ff',
    marginBottom: 6,
  },
  descriptionPreview: {
    fontSize: 14,
    lineHeight: 20,
    color: '#b8c5d1',
    marginBottom: 4,
  },
  readMore: {
    fontSize: 12,
    color: '#00a8ff',
    fontWeight: '500',
    fontStyle: 'italic',
  },

  // Apply Button styles
  applyButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignSelf: 'flex-start',
    shadowColor: '#0066cc',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  // Apply Button text styles
  applyButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Poster Button styles (for job posters viewing their own jobs)
  posterButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignSelf: 'flex-start',
    shadowColor: '#28a745',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  // Poster Button text styles
  posterButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // View Only Button styles (for job posters viewing other's jobs)
  viewOnlyButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#6c757d',
  },

  // View Only Button text styles
  viewOnlyText: {
    color: '#6c757d',
    fontSize: 15,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

// Export the JobCard component
export default JobCard;