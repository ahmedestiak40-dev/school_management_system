import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { studentAPI } from '../services/api';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const grades = ['All', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
  const statuses = ['All', 'Active', 'Inactive', 'Graduated', 'Suspended', 'Transferred'];

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, filterGrade, filterStatus]);

  const fetchStudents = async () => {
    try {
      const response = await studentAPI.getAll();
      const data = response.data.data || [];
      setStudents(data);
      setFilteredStudents(data);
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching students');
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = [...students];
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(student => 
        student.firstName.toLowerCase().includes(term) ||
        student.lastName.toLowerCase().includes(term) ||
        student.email.toLowerCase().includes(term) ||
        student.rollNumber?.toLowerCase().includes(term)
      );
    }
    
    // Grade filter
    if (filterGrade && filterGrade !== 'All') {
      filtered = filtered.filter(student => student.grade === filterGrade);
    }
    
    // Status filter
    if (filterStatus && filterStatus !== 'All') {
      filtered = filtered.filter(student => student.status === filterStatus);
    }
    
    setFilteredStudents(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentAPI.delete(id);
        toast.success('Student deleted successfully');
        fetchStudents();
      } catch (error) {
        toast.error('Error deleting student');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Delete ${selectedStudents.length} selected students?`)) {
      try {
        await Promise.all(selectedStudents.map(id => studentAPI.delete(id)));
        toast.success(`${selectedStudents.length} students deleted successfully`);
        setSelectedStudents([]);
        setShowBulkActions(false);
        fetchStudents();
      } catch (error) {
        toast.error('Error deleting students');
      }
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = filteredStudents.map(s => s._id);
      setSelectedStudents(allIds);
      setShowBulkActions(true);
    } else {
      setSelectedStudents([]);
      setShowBulkActions(false);
    }
  };

  const handleSelectStudent = (id) => {
    setSelectedStudents(prev => {
      const newSelection = prev.includes(id) 
        ? prev.filter(sid => sid !== id)
        : [...prev, id];
      setShowBulkActions(newSelection.length > 0);
      return newSelection;
    });
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Grade', 'Roll No', 'Phone', 'Status'];
    const rows = filteredStudents.map(s => [
      `${s.firstName} ${s.lastName}`,
      s.email,
      s.grade,
      s.rollNumber || 'N/A',
      s.phone,
      s.status
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Students exported successfully');
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
        <h2>Students ({filteredStudents.length})</h2>
        <div>
          <Link to="/students/new" className="btn btn-primary me-2">
            <i className="fas fa-plus me-2"></i>Add Student
          </Link>
          <button className="btn btn-success" onClick={exportToCSV}>
            <i className="fas fa-file-export me-2"></i>Export
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name, email, roll no..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
              >
                {grades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <button 
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearchTerm('');
                  setFilterGrade('');
                  setFilterStatus('');
                }}
              >
                <i className="fas fa-undo me-1"></i> Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {showBulkActions && (
        <div className="alert alert-info d-flex justify-content-between align-items-center">
          <span>
            <i className="fas fa-check-circle me-2"></i>
            {selectedStudents.length} student(s) selected
          </span>
          <div>
            <button className="btn btn-sm btn-danger me-2" onClick={handleBulkDelete}>
              <i className="fas fa-trash me-1"></i> Delete Selected
            </button>
            <button 
              className="btn btn-sm btn-secondary"
              onClick={() => {
                setSelectedStudents([]);
                setShowBulkActions(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Students Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                />
              </th>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Grade</th>
              <th>Roll No</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={student._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student._id)}
                    onChange={() => handleSelectStudent(student._id)}
                  />
                </td>
                <td>{index + 1}</td>
                <td>
                  <Link to={`/students/profile/${student._id}`}>
                    <strong>{student.firstName} {student.lastName}</strong>
                  </Link>
                  {student.profilePhoto && (
                    <img 
                      src={student.profilePhoto} 
                      alt="profile" 
                      className="rounded-circle ms-2"
                      style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                    />
                  )}
                </td>
                <td>{student.email}</td>
                <td>
                  <span className="badge bg-info">{student.grade}</span>
                  {student.section && <span className="badge bg-secondary ms-1">Sec {student.section}</span>}
                </td>
                <td>{student.rollNumber || 'N/A'}</td>
                <td>{student.phone}</td>
                <td>
                  <span className={`badge bg-${student.status === 'Active' ? 'success' : student.status === 'Inactive' ? 'warning' : student.status === 'Graduated' ? 'primary' : 'danger'}`}>
                    {student.status}
                  </span>
                </td>
                <td>
                  <div className="btn-group">
                    <Link to={`/students/profile/${student._id}`} className="btn btn-sm btn-outline-primary">
                      <i className="fas fa-eye"></i>
                    </Link>
                    <Link to={`/students/edit/${student._id}`} className="btn btn-sm btn-info">
                      <i className="fas fa-edit"></i>
                    </Link>
                    <button 
                      className="btn btn-sm btn-danger" 
                      onClick={() => handleDelete(student._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stats Summary */}
      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h6>Total Students</h6>
              <h3>{students.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h6>Active Students</h6>
              <h3>{students.filter(s => s.status === 'Active').length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <h6>Graduated</h6>
              <h3>{students.filter(s => s.status === 'Graduated').length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h6>Students/Class</h6>
              <h3>
                {students.length > 0 ? Math.round(students.length / new Set(students.map(s => s.grade)).size) : 0}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentList;