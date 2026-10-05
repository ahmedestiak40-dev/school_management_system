const express = require('express');
const router = express.Router();

let courses = [];
let idCounter = 1;

router.get('/', (req, res) => {
  res.json({
    success: true,
    count: courses.length,
    data: courses
  });
});

router.get('/:id', (req, res) => {
  const course = courses.find(c => c._id === parseInt(req.params.id));
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

router.post('/', (req, res) => {
  const course = {
    _id: idCounter++,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  courses.push(course);
  res.status(201).json({
    success: true,
    data: course
  });
});

router.put('/:id', (req, res) => {
  const index = courses.findIndex(c => c._id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  courses[index] = {
    ...courses[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json({
    success: true,
    data: courses[index]
  });
});

router.delete('/:id', (req, res) => {
  const index = courses.findIndex(c => c._id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  courses.splice(index, 1);
  res.json({
    success: true,
    message: 'Course deleted successfully'
  });
});

module.exports = router;