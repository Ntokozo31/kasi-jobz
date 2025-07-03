// Import React from 'react';
// Import View, Text, and StyleSheet from React Native.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// JobCard component to display individual job listings.
const JobCard = ({ job }) => {
  // Convert the job creation date.
  const formattedDate = new Date(job.createdAt).toLocaleDateString();

  // Render the job card with job details.
  // Display the job title, company, location, salary, description, and posting date.
  // If the salary is not listed, display a default message.
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.company}>{job.company}</Text>
      <Text style={styles.location}>{job.location}</Text>
      <Text style={styles.salary}>
        {job.salary ? `Salary: ${job.salary}` : 'Salary not listed'}
      </Text>
      <Text style={styles.description}> {job.description}</Text>
      <Text style={styles.date}>📅 Posted on: {formattedDate}</Text>
    </View>
  );
};

// Define styles for the JobCard component.
// Styles include card container, title, company, location, salary, description, and date.
const styles = StyleSheet.create({
  // Main card container.
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  company: {
    color: '#333',
    marginBottom: 3,
  },
  location: {
    color: '#777',
  },
  salary: {
    marginTop: 5,
    color: '#009688',
  },
  description: {
    marginTop: 10,
    color: '#444',
  },
  date: {
    marginTop: 5,
    fontSize: 12,
    color: '#999',
  },
});

// Export the JobCard component as the default export.
export default JobCard;