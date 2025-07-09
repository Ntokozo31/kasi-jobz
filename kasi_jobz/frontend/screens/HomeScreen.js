import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import api from '../services/api';
import JobCard from '../components/JobCard';
import { useNavigation } from '@react-navigation/native';

// HomeScreen component to display the list of jobs.
const HomeScreen = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Fetch jobs from the API when the component mounts.
  // Use useEffect to call the getAllJobs function and update the state.
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobData = await api.getAllJobs();
        console.log('Fetched jobs:', jobData);
        setJobs(jobData);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    // Call the fetchJobs function to get the job listings.
    fetchJobs();
  }, []);

  // Render the loading state or the list of jobs.
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>🔄 Loading jobs...</Text>
      </View>
    );
  }

  // Render the list of jobs using FlatList.
  return (
    <View style={styles.container}>
      {/* Navigation button to see posted jobs */}
      <TouchableOpacity 
        style={styles.myJobsButton}
        onPress={() => navigation.navigate('JobPoster')}
      >
        <Text style={styles.buttonText}>📝 View My Posted Jobs</Text>
      </TouchableOpacity>

      <Text style={styles.title}>🔍 All Available Jobs</Text>
      
      <FlatList
        data={jobs}
        keyExtractor={(item) => item._id || item.id}
        renderItem={({ item }) => <JobCard job={item} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No jobs found.</Text>}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

// Style theme for HomeScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e13',
    padding: 16,
  },
  myJobsButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 20,
    alignSelf: 'center',
    shadowColor: '#0066cc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingText: {
    color: '#00a8ff',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 50,
  },
  emptyText: {
    color: '#8d99ae',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 50,
  },
});

// Export the HomeScreen component as the default export.
export default HomeScreen;