import axios from 'axios';

// Set the base URL for the API requests
const BASE_URL = '';

// Create an axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiService = {
  // Get all jobs (for job seekers)
  getAllJobs: async () => {
    try {
      const response = await api.get('/jobs');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      if (__DEV__) {
        console.error('Error fetching all jobs:', error.response?.data || error.message);
      }
      return [];
    }
  },

  // Get jobs by poster (for job posters)
  getJobsByPoster: async (posterId) => {
    try {
      const response = await api.get(`/jobs/poster/${posterId}`);
      
      // Handle different response formats
      if (response.data?.message === "No jobs found.") {
        return [];
      }
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      if (__DEV__) {
        console.error('Error fetching jobs by poster:', error.response?.data || error.message);
      }
      return [];
    }
  },

  // Get dashboard stats - (dashboard for job posters)
  getDashboardStats: async (posterId) => {
    try {
      const response = await api.get(`/jobs/dashboard/stats/${posterId}`);
      
      return {
        totalJobs: response.data?.totalJobs || 0,
        totalApplications: response.data?.totalApplications || 0,
        activeJobs: response.data?.activeJobs || 0,
        recentJobs: Array.isArray(response.data?.recentJobs) ? response.data.recentJobs : []
      };
    } catch (error) {
      if (__DEV__) {
        console.error('Error fetching dashboard stats:', error.response?.data || error.message);
      }
      // Fallback: Calculate stats from jobs.
      try {
        const jobs = await this.getJobsByPoster(posterId);
        return {
          totalJobs: jobs.length,
          totalApplications: 0,
          activeJobs: jobs.length,
          recentJobs: jobs.slice(0, 5)
        };
      } catch (fallbackError) {
        return {
          totalJobs: 0,
          totalApplications: 0,
          activeJobs: 0,
          recentJobs: []
        };
      }
    }
  },

  // Get job applications - (for job posters)
  getApplications: async (jobId) => {
    try {
      const response = await api.get(`/applications/${jobId}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      if (__DEV__) {
        console.error('Error fetching applications:', error.response?.data || error.message);
      }
      return [];
    }
  },

  // Delete job - (for job posters)
  deleteJob: async (jobId) => {
    try {
      const response = await api.delete(`/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      if (__DEV__) {
        console.error('API: Delete failed:', error.response?.data || error.message);
      }
      throw error;
    }
  },

  // Apply for job - (for job seekers)
  applyForJob: async (applicationData) => {
    try {
      const response = await api.post('/applications', applicationData);
      return response.data;
    } catch (error) {
      if (__DEV__) {
        console.error('Error applying for job:', error.response?.data || error.message);
      }
      throw error;
    }
  },

  // Get job by ID - (for job seekers)
  getJobById: async (jobId) => {
    try {
      const response = await api.get(`/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      if (__DEV__) {
        console.error('Error fetching job by ID:', error.response?.data || error.message);
      }
      throw error;
    }
  },
};

// Export the API service
export default apiService;