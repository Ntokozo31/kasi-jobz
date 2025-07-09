import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import api from '../services/api';

// JobDetailScreen component to display job details and applications
const JobDetailScreen = ({ route }) => {
    const { job } = route.params;

    // State to manage job applications
    const [applications, setApplications] = useState([]);
    const [loadingApplications, setLoadingApplications] = useState(true);

    // Format the job creation date
    const formattedDate = new Date(job.createdAt).toLocaleDateString();

    // Check if current user is the job poster
    const currentUserId = "temp-mock-user-123"; 
    const isPoster = job.posterId === currentUserId;

    // Fetch applications for job posters only
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoadingApplications(true);
                const applicationsData = await api.getApplications(job._id);
                setApplications(applicationsData);
            } catch (error) {
                console.error('Failed to load applications:', error);
            } finally {
                setLoadingApplications(false);
            }
        };

        // Only fetch applications if user is the poster
        if (job && isPoster) {
            fetchApplications();
        } else {
            setLoadingApplications(false);
        }
    }, [job._id, isPoster]);

    // Handle job application submission
    const handleApply = () => {
        if (Platform.OS === 'web') {
            alert(`🎉 Your application for ${job.title} has been submitted!`)
        } else {
            Alert.alert(
                "🎉 Application Sent!",
                `Your application for ${job.title} has been submitted successfully.`,
                [{ text: "OK", style: "default" }]
            )
        }
    }

    // Return the job detail screen layout
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={styles.company}>{job.company}</Text>
                <View style={styles.locationRow}>
                    <Text style={styles.location}>📍 {job.location}</Text>
                    {job.province && <Text style={styles.province}>, {job.province}</Text>}
                </View>
            </View>

            // Salary section
            <View style={styles.salaryContainer}>
                <View style={styles.salaryBadge}>
                    <Text style={styles.salaryText}>
                        💰 {job.salary || 'Salary not specified'}
                    </Text>
                </View>
            </View>

            // Job description and details
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>📄 Job Description</Text>
                <Text style={styles.description}>
                    {job.description || 'No description provided for this position.'}
                </Text>
            </View>

            // Additional details section
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
            </View>

            // Apply section
            {!isPoster && (
                <View style={styles.applySection}>
                    <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                        <Text style={styles.applyButtonText}>🚀 APPLY NOW</Text>
                    </TouchableOpacity>
                </View>
            )}

            // Applications section for job posters
            {isPoster && (
                <View style={styles.applicationsSection}>
                    <Text style={styles.applicationsTitle}>👥 Job Applications</Text>
                    
                    {loadingApplications ? (
                        <View style={styles.centerContent}>
                            <Text style={styles.loadingText}>🔄 Loading applications...</Text>
                        </View>
                    ) : applications.length > 0 ? (
                        <View style={styles.applicationsList}>
                            {applications.map((app) => (
                                <View key={app._id} style={styles.applicationCard}>
                                    <View style={styles.applicantHeader}>
                                        <Text style={styles.applicantName}>👤 Name: {app.applicantName}</Text>
                                        <Text style={styles.applicationDate}>
                                            📅 {new Date(app.createdAt).toLocaleDateString()}
                                        </Text>
                                    </View>
                                    
                                    <Text style={styles.applicantEmail}>📧 Email: {app.applicantEmail}</Text>
                                    
                                    {app.message && (
                                        <View style={styles.messageSection}>
                                            <Text style={styles.messageLabel}>💬 Message:</Text>
                                            <Text style={styles.messageText}>{app.message}</Text>
                                        </View>
                                    )}
                                    
                                    {app.phone && (
                                        <Text style={styles.applicantPhone}>📱 Phone: {app.phone}</Text>
                                    )}
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.centerContent}>
                            <Text style={styles.noApplicationsText}>📭 No applications yet.</Text>
                        </View>
                    )}
                </View>
            )}
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
        shadowOffset: {
            width: 0,
            height: 6,
        },
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
export default JobDetailScreen;