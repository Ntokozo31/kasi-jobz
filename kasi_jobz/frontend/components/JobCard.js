import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

// JobCard component to display job details and actions
const JobCard = ({ job, userRole, currentUserId }) => {
  const formattedDate = new Date(job.createdAt).toLocaleDateString();
  const navigation = useNavigation();
  
  // Check if current user is the job poster
  const isPoster = job.posterId === currentUserId;

  const daysAgo = Math.floor((new Date() - new Date(job.createdAt)) / (1000 * 60 * 60 * 24));
  const timeAgo = daysAgo === 0 ? 'Today' : daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`;

  return (
    <TouchableOpacity 
      onPress={() => navigation.navigate('JobDetail', { job })}
      style={styles.container}
    >
      <View style={styles.card}>
        {/* Header with company logo placeholder */}
        <View style={styles.cardHeader}>
          <View style={styles.companyLogoContainer}>
            <View style={styles.companyLogo}>
              <Ionicons name="business" size={20} color="#6b7280" />
            </View>
            <View style={styles.jobInfo}>
              <Text style={styles.title} numberOfLines={2}>{job.title}</Text>
              <View style={styles.companyRow}>
                <Text style={styles.company}>{job.company}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={14} color="#fbbf24" />
                  <Text style={styles.rating}>4.2</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Job details */}
        <View style={styles.jobDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="location" size={16} color="#6b7280" />
            <Text style={styles.location}>{job.location}, {job.province}</Text>
          </View>
          
          {job.salary && (
            <View style={styles.detailRow}>
              <Ionicons name="cash" size={16} color="#6b7280" />
              <Text style={styles.salary}>{job.salary}</Text>
            </View>
          )}
          
          <View style={styles.detailRow}>
            <Ionicons name="time" size={16} color="#6b7280" />
            <Text style={styles.timeAgo}>{timeAgo}</Text>
          </View>
        </View>

        {/* Job description preview */}
        {job.description && (
          <Text style={styles.description} numberOfLines={2}>
            {job.description}
          </Text>
        )}

        {/* Tags and badges */}
        <View style={styles.tagsContainer}>
          <View style={styles.jobTypeTag}>
            <Text style={styles.jobTypeText}>Full-time</Text>
          </View>
          {daysAgo <= 3 && (
            <View style={styles.urgentTag}>
              <Text style={styles.urgentText}>Urgently hiring</Text>
            </View>
          )}
        </View>

        {/* Action button */}
        <View style={styles.actionContainer}>
          {userRole === "job_poster" && isPoster ? (
            <TouchableOpacity
              style={styles.viewApplicationsButton}
              onPress={() => navigation.navigate('JobDetail', { job })}
            >
              <Ionicons name="people" size={16} color="#059669" />
              <Text style={styles.viewApplicationsText}>View Applications</Text>
            </TouchableOpacity>
          ) : userRole === "job_seeker" ? (
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => navigation.navigate('ApplyJob', { job })}
            >
              <Text style={styles.applyButtonText}>Easy Apply</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.viewDetailsButton}>
              <Text style={styles.viewDetailsText}>View Details</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  
  // Header styles
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  companyLogoContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  companyLogo: {
    width: 48,
    height: 48,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  jobInfo: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2563eb',
    marginBottom: 4,
    lineHeight: 24,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  company: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
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
  saveButton: {
    padding: 4,
  },

  // Job details styles
  jobDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  location: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
  },
  salary: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
    fontWeight: '500',
  },
  timeAgo: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
  },

  // Description styles
  description: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 12,
  },

  // Tags styles
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  jobTypeTag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  jobTypeText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  urgentTag: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  urgentText: {
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '500',
  },

  // Action buttons styles
  actionContainer: {
    alignItems: 'flex-start',
  },
  applyButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  applyButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  viewApplicationsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  viewApplicationsText: {
    color: '#059669',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  viewDetailsButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  viewDetailsText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default JobCard;