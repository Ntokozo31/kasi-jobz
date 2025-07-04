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
    backgroundColor: '#1b1f23',
    paddingVertical: 8,
  },

  // Card styles
  card: {
    backgroundColor: '#262d34',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#38434f',
  },

  // Title styles
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
    lineHeight: 22,
  },
  
  // Company and Location styles
  companyLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  // Company text styles
  company: {
    fontSize: 14,
    fontWeight: '500',
    color: '#b0b3b8',
  },

  // Location text styles
  location: {
    fontSize: 14,
    fontWeight: '400',
    color: '#9ca3af',
  },
  
  // Salary text styles
  salary: {
    fontSize: 14,
    fontWeight: '500',
    color: '#57d9a3',
    marginBottom: 12,
  },

  // Description text styles
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#b0b3b8',
    marginBottom: 12,
  },

  // Date text styles
  date: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9ca3af',
    marginBottom: 12,
  },

  // Apply Button styles
  applyButton: {
    backgroundColor: '#70b5f9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },

  // Apply Button text styles
  applyButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});

// Export the JobCard component
export default JobCard;