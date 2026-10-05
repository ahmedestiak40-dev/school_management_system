import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { enrollmentAPI } from '../services/api';

function EnrollmentList() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await enrollmentAPI.getAll();
      setEnrollments(response.data.data || []);
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching enrollments');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this enrollment?')) {
      try {
        await enrollmentAPI.delete(id);
        toast.success('Enrollment deleted successfully');
        fetchEnrollments();
      } catch (error) {
        toast.error('Error deleting enrollment');
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
        <h2>Enrollments</h2>
        <Link to="/enrollments/new" className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>New Enrollment
        </Link>
      </div>

      {enrollments.length === 0 ? (
        <div className="alert alert-info">
          No enrollments found. Click "New Enrollment" to create one.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>Course</th>
                <th>Semester</th>
                <th>Academic Year</th>
                <th>Status</th>
                <th>Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enrollment, index) => (
                <tr key={enrollment._id}>
                  <td>{index + 1}</td>
                  <td>
                    {enrollment.studentId ? 
                      `${enrollment.studentId.firstName} ${enrollment.studentId.lastName}` : 
                      'N/A'
                    }
                  </td>
                  <td>
                    {enrollment.courseId ? 
                      `${enrollment.courseId.courseCode} - ${enrollment.courseId.courseName}` : 
                      'N/A'
                    }
                  </td>
                  <td>{enrollment.semester}</td>
                  <td>{enrollment.academicYear}</td>
                  <td>
                    <span className={`badge bg-${enrollment.status === 'Enrolled' ? 'primary' : enrollment.status === 'Completed' ? 'success' : enrollment.status === 'In Progress' ? 'info' : 'danger'}`}>
                      {enrollment.status}
                    </span>
                  </td>
                  <td>
                    {enrollment.grade ? (
                      <span className={`badge bg-${enrollment.grade === 'A' || enrollment.grade === 'B' ? 'success' : enrollment.grade === 'C' ? 'warning' : 'danger'}`}>
                        {enrollment.grade}
                      </span>
                    ) : (
                      <span className="text-muted">Not graded</span>
                    )}
                  </td>
                  <td>
                    <Link to={`/enrollments/edit/${enrollment._id}`} className="btn btn-sm btn-info me-2">
                      <i className="fas fa-edit"></i>
                    </Link>
                    <button 
                      className="btn btn-sm btn-danger" 
                      onClick={() => handleDelete(enrollment._id)}
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

export default EnrollmentList;