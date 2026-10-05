const express = require('express');
const router = express.Router();

let teachers = [];
let idCounter = 1;

router.get('/', (req, res) => {
  res.json({
    success: true,
    count: teachers.length,
    data: teachers
  });
});

router.get('/:id', (req, res) => {
  const teacher = teachers.find(t => t._id === parseInt(req.params.id));
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

router.post('/', (req, res) => {
  const teacher = {
    _id: idCounter++,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  teachers.push(teacher);
  res.status(201).json({
    success: true,
    data: teacher
  });
});

router.put('/:id', (req, res) => {
  const index = teachers.findIndex(t => t._id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Teacher not found'
    });
  }
  teachers[index] = {
    ...teachers[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json({
    success: true,
    data: teachers[index]
  });
});

router.delete('/:id', (req, res) => {
  const index = teachers.findIndex(t => t._id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Teacher not found'
    });
  }
  teachers.splice(index, 1);
  res.json({
    success: true,
    message: 'Teacher deleted successfully'
  });
});

module.exports = router;