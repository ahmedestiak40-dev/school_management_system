import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { courseAPI } from '../services/api';

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getAll();
      setCourses(response.data.data || []);
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching courses');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseAPI.delete(id);
        toast.success('Course deleted successfully');
        fetchCourses();
      } catch (error) {
        toast.error('Error deleting course');
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Courses</h2>
        <Link to="/courses/new" className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>Add Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="alert alert-info">
          No courses found. Click "Add Course" to create one.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Credits</th>
                <th>Teacher</th>
                <th>Students</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={course._id}>
                  <td>{index + 1}</td>
                  <td><strong>{course.courseCode}</strong></td>
                  <td>{course.courseName}</td>
                  <td>{course.credits}</td>
                  <td>
                    {course.teacherId ? 
                      `${course.teacherId.firstName} ${course.teacherId.lastName}` : 
                      'Not Assigned'
                    }
                  </td>
                  <td>{course.currentStudents || 0}/{course.maxStudents}</td>
                  <td>
                    <span className={`badge bg-${course.status === 'Active' ? 'success' : course.status === 'Full' ? 'warning' : 'secondary'}`}>
                      {course.status}
                    </span>
                  </td>
                  <td>
                    <Link to={`/courses/edit/${course._id}`} className="btn btn-sm btn-info me-2">
                      <i className="fas fa-edit"></i>
                    </Link>
                    <button 
                      className="btn btn-sm btn-danger" 
                      onClick={() => handleDelete(course._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CourseList;