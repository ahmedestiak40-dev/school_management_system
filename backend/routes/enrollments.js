const express = require('express');
const router = express.Router();

let enrollments = [];
let idCounter = 1;

router.get('/', (req, res) => {
  res.json({
    success: true,
    count: enrollments.length,
    data: enrollments
  });
});

router.get('/:id', (req, res) => {
  const enrollment = enrollments.find(e => e._id === parseInt(req.params.id));
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

router.post('/', (req, res) => {
  const enrollment = {
    _id: idCounter++,
    ...req.body,
    enrollmentDate: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };
  enrollments.push(enrollment);
  res.status(201).json({
    success: true,
    data: enrollment
  });
});

router.put('/:id', (req, res) => {
  const index = enrollments.findIndex(e => e._id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Enrollment not found'
    });
  }
  enrollments[index] = {
    ...enrollments[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json({
    success: true,
    data: enrollments[index]
  });
});

router.delete('/:id', (req, res) => {
  const index = enrollments.findIndex(e => e._id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Enrollment not found'
    });
  }
  enrollments.splice(index, 1);
  res.json({
    success: true,
    message: 'Enrollment deleted successfully'
  });
});

module.exports = router;