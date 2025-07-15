// jobController - Handles job-related controller functions

// Import job model
const Job = require('../models/job');
const Application = require('../models/application');

// createJob function - create and save new job.
const createJob = async (req, res) => {
    try {
        const { title, company, location, province, jobType, description, salary, posterId, experience } = req.body;
        if (!title || !company || !location || !province || !description || !posterId) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const job = new Job({
            title,
            company,
            location,
            province,
            description,
            salary,
            posterId,
            jobType,
            experience
        });
        await job.save()
        res.status(201).json({ message: "Job successfully saved", job})
    } catch (error) {
        res.status(500).json({ message: "Server error trying to create job", error: error.message})
    }
};


// getJobs function - retrieve all jobs sorted by lasted job.
const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Server error trying to retrieve jobs", error: error.message })
    }
};

// getJobById function - retrieve a job by it Id.
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
        if (!job) {
            return res.status(404).json({ message: "Sorry job not found" })
        }
        res.status(200).json(job)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
};

// updateJob function - update job by Id
// Use $set to update only provided field
// Return the updated document
// Run Schema validators
const updateJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(
            req.params.id,
            {$set: req.body},
            {
                new: true,
                runValidators: true
            }
        );
        if (!job) {
            return res.status(404).json({ message: "Job not found"})
        }
        res.status(200).json({ message: "Job updated successfully", "job": job })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
};

// getJobsByPoster function - retrieve all jobs by poster Id
// Sort by createdAt in descending order
const getJobsByPoster = async (req, res) => {
    try {
        const posterId = req.params.posterId;
        const jobs = await Job.find({posterId}).sort({ createdAt: -1 })
        // Return empty array if no jobs found
        res.status(200).json(jobs || []);
    } catch (error) {
        res.status(500).json({ message: "Server error trying to retrieve jobs by poster", error: error.message})
    }
}

// deleteJobById function - delete job by it Id
const deleteJobById = async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) {
            return res.status(404).json({ message: "Sorry Job not found" })
        }
        res.status(200).json({ message: "Job Successfully deleted", deletedJob: job })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
};

// getDashboardStats function - get dashboard stats for a poster
// Returns total jobs, total applications, active jobs, and recent jobs
// Uses Application model to count applications related to the jobs
const getDashboardStats = async (req, res) => {
    try {
        const posterId = req.params.posterId;
        const jobs = await Job.find({ posterId }).sort({ createdAt: -1 });
        // Get the job IDs for application counting
        const jobIds = jobs.map(job => job._id);
        // Count total applications related to these jobs
        const totalApplications = await Application.countDocuments({ 
            jobId: { $in: jobIds } 
        });
        // Count total jobs
        const totalJobs = jobs.length;
        const activeJobs = jobs.length;
        const recentJobs = jobs.slice(0, 5);
        
        res.status(200).json({
            totalJobs,
            totalApplications,
            activeJobs,
            recentJobs
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ 
            message: 'Failed to fetch dashboard stats', 
            error: error.message 
        });
    }
};

// Export all functions.
module.exports = {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    getJobsByPoster,
    deleteJobById,
    getDashboardStats
}