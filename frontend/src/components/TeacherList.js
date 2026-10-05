import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { teacherAPI } from '../services/api';

function TeacherList() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await teacherAPI.getAll();
      setTeachers(response.data.data || []);
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching teachers');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await teacherAPI.delete(id);
        toast.success('Teacher deleted successfully');
        fetchTeachers();
      } catch (error) {
        toast.error('Error deleting teacher');
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
        <h2>Teachers</h2>
        <Link to="/teachers/new" className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>Add Teacher
        </Link>
      </div>

      {teachers.length === 0 ? (
        <div className="alert alert-info">
          No teachers found. Click "Add Teacher" to create one.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Qualification</th>
                <th>Specialization</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher, index) => (
                <tr key={teacher._id}>
                  <td>{index + 1}</td>
                  <td>{teacher.firstName} {teacher.lastName}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.qualification}</td>
                  <td>{teacher.specialization}</td>
                  <td>{teacher.phone}</td>
                  <td>
                    <span className={`badge bg-${teacher.status === 'Active' ? 'success' : teacher.status === 'Inactive' ? 'warning' : 'secondary'}`}>
                      {teacher.status}
                    </span>
                  </td>
                  <td>
                    <Link to={`/teachers/edit/${teacher._id}`} className="btn btn-sm btn-info me-2">
                      <i className="fas fa-edit"></i>
                    </Link>
                    <button 
                      className="btn btn-sm btn-danger" 
                      onClick={() => handleDelete(teacher._id)}
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

export default TeacherList;