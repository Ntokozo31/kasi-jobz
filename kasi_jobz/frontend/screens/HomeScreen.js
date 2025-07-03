// Import React from 'react';
// Import necessary components from React Native.
// Import the getAllJobs function from the API service.
// Import the JobCard component to display individual job listings.
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import getAllJobs from '../services/api';
import JobCard from '../components/JobCard';

// HomeScreen component to display the list of jobs.
const HomeScreen = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch jobs from the API when the component mounts.
  // Use useEffect to call the getAllJobs function and update the state.
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobData = await getAllJobs();
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
    return <Text style={{ padding: 20 }}>Loading jobs...</Text>;
  }

  // Render the list of jobs using FlatList.
  // Each job is rendered using the JobCard component.
  // If no jobs are found, display a message.
  return (
    <View style={{ padding: 20 }}>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item._id || item.id}
        renderItem={({ item }) => <JobCard job={item} />}
        ListEmptyComponent={<Text>No jobs found.</Text>}
      />
    </View>
  );
};

// Export the HomeScreen component as the default export.
export default HomeScreen;