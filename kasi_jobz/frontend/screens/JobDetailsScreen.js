// Import React from 'react';
// Import necessary components from React Native.
// Import the Alert component for displaying alerts.
// Import the Button component for the apply button.
// Import the Platform component to handle platform-specific behavior.
import React from 'react';
import { View, Text } from 'react-native';
import { Button, Alert, Platform } from 'react-native';

// Initialize the JobDetailScreen component.
const JobDetailScreen = ({ route }) => {

    // Extract the job data from the route parameters.
    const { job } = route.params;

    // Format the job creation date to a readable format.
    const formattedDate = new Date(job.createdAt).toLocaleDateString();

    // Function to handle the apply button press.
    const handleApply = () => {
        if (Platform.OS === 'web') {
            alert(`Your Application for ${job.title} has been submitted`)
        } else {
            Alert.alert(
            "Application Send",
            `Your Application for ${job.title} has been submitted`
            )
        }
        
    }

    // Render the job details.
    return (
        <View>
            <Text>🧾 {job.title}</Text>
            <Text>🏢 {job.company}</Text>
            <Text>📍 {job.location}</Text>
            <Text>💰{job.salary}</Text>
            <Text>📄 {job.description}</Text>
            <Text>📅 Posted: {formattedDate}</Text>
            <Button title='Apply Now' onPress={handleApply} />
        </View>
    );
}

export default JobDetailScreen;

//<Text>📍 {job.location}</Text>