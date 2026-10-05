const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/school_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Import routes
console.log('📁 Loading routes...');

// Use require with absolute path
const studentRoutes = require('./routes/students');
const teacherRoutes = require('./routes/teachers');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');

// Use routes
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);

console.log('✅ All routes loaded successfully');

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'School Management API is running',
    version: '1.0.0',
    endpoints: {
      students: {
        getAll: 'GET /api/students',
        getOne: 'GET /api/students/:id',
        create: 'POST /api/students',
        update: 'PUT /api/students/:id',
        delete: 'DELETE /api/students/:id'
      },
      teachers: {
        getAll: 'GET /api/teachers',
        getOne: 'GET /api/teachers/:id',
        create: 'POST /api/teachers',
        update: 'PUT /api/teachers/:id',
        delete: 'DELETE /api/teachers/:id'
      },
      courses: {
        getAll: 'GET /api/courses',
        getOne: 'GET /api/courses/:id',
        create: 'POST /api/courses',
        update: 'PUT /api/courses/:id',
        delete: 'DELETE /api/courses/:id'
      },
      enrollments: {
        getAll: 'GET /api/enrollments',
        getOne: 'GET /api/enrollments/:id',
        create: 'POST /api/enrollments',
        update: 'PUT /api/enrollments/:id',
        delete: 'DELETE /api/enrollments/:id'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.url}`,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});