const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('studentId', 'firstName lastName email')
      .populate('courseId', 'courseCode courseName');
    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching enrollments',
      error: error.message,
    });
  }
};

exports.getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate('studentId', 'firstName lastName email')
      .populate('courseId', 'courseCode courseName');
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      });
    }
    res.status(200).json({
      success: true,
      data: enrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching enrollment',
      error: error.message,
    });
  }
};

exports.createEnrollment = async (req, res) => {
  try {
    // Check if course is full
    const course = await Course.findById(req.body.courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }
    
    if (course.currentStudents >= course.maxStudents) {
      return res.status(400).json({
        success: false,
        message: 'Course is full',
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create(req.body);
    
    // Increment current students in course
    await Course.findByIdAndUpdate(req.body.courseId, {
      $inc: { currentStudents: 1 }
    });

    res.status(201).json({
      success: true,
      data: enrollment,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Student already enrolled in this course',
      });
    }
    res.status(400).json({
      success: false,
      message: 'Error creating enrollment',
      error: error.message,
    });
  }
};

exports.updateEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      });
    }
    res.status(200).json({
      success: true,
      data: enrollment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating enrollment',
      error: error.message,
    });
  }
};

exports.deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      });
    }
    
    // Decrement current students in course
    await Course.findByIdAndUpdate(enrollment.courseId, {
      $inc: { currentStudents: -1 }
    });

    res.status(200).json({
      success: true,
      message: 'Enrollment deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting enrollment',
      error: error.message,
    });
  }
};