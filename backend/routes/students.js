const express = require('express');
const router = express.Router();

// Temporary in-memory storage (will be replaced with MongoDB later)
let students = [];
let idCounter = 1;

// Get all students
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: students.length,
    data: students
  });
});

// Get single student
router.get('/:id', (req, res) => {
  const student = students.find(s => s._id === parseInt(req.params.id));
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

// Create student
router.post('/', (req, res) => {
  const student = {
    _id: idCounter++,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  students.push(student);
  res.status(201).json({
    success: true,
    data: student
  });
});

// Update student
router.put('/:id', (req, res) => {
  const index = students.findIndex(s => s._id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Student not found'
    });
  }
  students[index] = {
    ...students[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json({
    success: true,
    data: students[index]
  });
});

// Delete student
router.delete('/:id', (req, res) => {
  const index = students.findIndex(s => s._id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Student not found'
    });
  }
  students.splice(index, 1);
  res.json({
    success: true,
    message: 'Student deleted successfully'
  });
});

module.exports = router;