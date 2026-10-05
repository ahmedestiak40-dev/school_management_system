const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

console.log('🚀 Starting School Management API...');

// MongoDB connection (optional - will work even without MongoDB)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/school_management')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('⚠️ MongoDB not connected, using in-memory storage:', err.message));

// ============ IN-MEMORY DATABASE ============
const db = {
  students: [],
  teachers: [],
  courses: [],
  enrollments: []
};

let counters = {
  student: 1,
  teacher: 1,
  course: 1,
  enrollment: 1
};

// ============ STUDENT ROUTES ============
app.get('/api/students', (req, res) => {
  res.json({
    success: true,
    count: db.students.length,
    data: db.students
  });
});

app.get('/api/students/:id', (req, res) => {
  const student = db.students.find(s => s._id === parseInt(req.params.id));
  if (!student) {
    return res.status(404).json({
      success: false,
      message: 'Student not found'
    });
  }
  res.json({
    success: true,
    data: student
  });
});

app.post('/api/students', (req, res) => {
  const student = {
    _id: counters.student++,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  db.students.push(student);
  res.status(201).json({
    success: true,
    data: student
  });
});

app.put('/api/students/:id', (req, res) => {
  const index = db.students.findIndex(s => s._id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Student not found'
    });
  }
  db.students[index] = {
    ...db.students[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json({
    success: true,
    data: db.students[index]
  });
});

app.delete('/api/students/:id', (req, res) => {
  const index = db.students.findIndex(s => s._id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Student not found'
    });
  }
  db.students.splice(index, 1);
  res.json({
    success: true,
    message: 'Student deleted successfully'
  });
});

// ============ TEACHER ROUTES ============
app.get('/api/teachers', (req, res) => {
  res.json({
    success: true,
    count: db.teachers.length,
    data: db.teachers
  });
});

app.get('/api/teachers/:id', (req, res) => {
  const teacher = db.teachers.find(t => t._id === parseInt(req.params.id));
  if (!teacher) {
    return res.status(404).json({
      success: false,
      message: 'Teacher not found'
    });
  }
  res.json({
    success: true,
    data: teacher
  });
});

app.post('/api/teachers', (req, res) => {
  const teacher = {
    _id: counters.teacher++,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  db.teachers.push(teacher);
  res.status(201).json({
    success: true,
    data: teacher
  });
});

app.put('/api/teachers/:id', (req, res) => {
  const index = db.teachers.findIndex(t => t._id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Teacher not found'
    });
  }
  db.teachers[index] = {
    ...db.teachers[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json({
    success: true,
    data: db.teachers[index]
  });
});

app.delete('/api/teachers/:id', (req, res) => {
  const index = db.teachers.findIndex(t => t._id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Teacher not found'
    });
  }
  db.teachers.splice(index, 1);
  res.json({
    success: true,
    message: 'Teacher deleted successfully'
  });
});

// ============ COURSE ROUTES ============
app.get('/api/courses', (req, res) => {
  res.json({
    success: true,
    count: db.courses.length,
    data: db.courses
  });
});

app.get('/api/courses/:id', (req, res) => {
  const course = db.courses.find(c => c._id === parseInt(req.params.id));
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  res.json({
    success: true,
    data: course
  });
});

app.post('/api/courses', (req, res) => {
  const course = {
    _id: counters.course++,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  db.courses.push(course);
  res.status(201).json({
    success: true,
    data: course
  });
});

app.put('/api/courses/:id', (req, res) => {
  const index = db.courses.findIndex(c => c._id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  db.courses[index] = {
    ...db.courses[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json({
    success: true,
    data: db.courses[index]
  });
});

app.delete('/api/courses/:id', (req, res) => {
  const index = db.courses.findIndex(c => c._id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  db.courses.splice(index, 1);
  res.json({
    success: true,
    message: 'Course deleted successfully'
  });
});

// ============ ENROLLMENT ROUTES ============
app.get('/api/enrollments', (req, res) => {
  res.json({
    success: true,
    count: db.enrollments.length,
    data: db.enrollments
  });
});

app.get('/api/enrollments/:id', (req, res) => {
  const enrollment = db.enrollments.find(e => e._id === parseInt(req.params.id));
  if (!enrollment) {
    return res.status(404).json({
      success: false,
      message: 'Enrollment not found'
    });
  }
  res.json({
    success: true,
    data: enrollment
  });
});

app.post('/api/enrollments', (req, res) => {
  const enrollment = {
    _id: counters.enrollment++,
    ...req.body,
    enrollmentDate: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };
  db.enrollments.push(enrollment);
  res.status(201).json({
    success: true,
    data: enrollment
  });
});

app.put('/api/enrollments/:id', (req, res) => {
  const index = db.enrollments.findIndex(e => e._id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Enrollment not found'
    });
  }
  db.enrollments[index] = {
    ...db.enrollments[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json({
    success: true,
    data: db.enrollments[index]
  });
});

app.delete('/api/enrollments/:id', (req, res) => {
  const index = db.enrollments.findIndex(e => e._id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Enrollment not found'
    });
  }
  db.enrollments.splice(index, 1);
  res.json({
    success: true,
    message: 'Enrollment deleted successfully'
  });
});

// ============ ROOT ENDPOINT ============
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'School Management API is running!',
    version: '1.0.0',
    data: {
      students: db.students.length,
      teachers: db.teachers.length,
      courses: db.courses.length,
      enrollments: db.enrollments.length
    },
    endpoints: {
      students: 'GET/POST /api/students',
      studentDetail: 'GET/PUT/DELETE /api/students/:id',
      teachers: 'GET/POST /api/teachers',
      teacherDetail: 'GET/PUT/DELETE /api/teachers/:id',
      courses: 'GET/POST /api/courses',
      courseDetail: 'GET/PUT/DELETE /api/courses/:id',
      enrollments: 'GET/POST /api/enrollments',
      enrollmentDetail: 'GET/PUT/DELETE /api/enrollments/:id'
    }
  });
});

// ============ 404 HANDLER ============
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.url}`
  });
});

// ============ START SERVER ============
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`📊 Database: ${db.students.length} students, ${db.teachers.length} teachers, ${db.courses.length} courses`);
});