import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';


// JobCard component
const JobCard = ({ job }) => {
  const formattedDate = new Date(job.createdAt).toLocaleDateString();

  const navigation = useNavigation();

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

        {/* Apply Button */}
        <View style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Easily apply</Text>
        </View>
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
});

// Export the JobCard component
export default JobCard;