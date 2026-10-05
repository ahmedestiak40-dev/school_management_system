import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { enrollmentAPI, studentAPI, courseAPI } from '../services/api';

function EnrollmentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    studentId: '',
    courseId: '',
    semester: '',
    academicYear: '',
    status: 'Enrolled',
    grade: '',
  });
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudentsAndCourses();
    if (isEdit) {
      fetchEnrollment();
    }
  }, [id]);

  const fetchStudentsAndCourses = async () => {
    try {
      const [studentsRes, coursesRes] = await Promise.all([
        studentAPI.getAll(),
        courseAPI.getAll(),
      ]);
      setStudents(studentsRes.data.data || []);
      setCourses(coursesRes.data.data || []);
    } catch (error) {
      toast.error('Error fetching data');
    }
  };

  const fetchEnrollment = async () => {
    try {
      const response = await enrollmentAPI.getById(id);
      const enrollment = response.data.data;
      setFormData({
        studentId: enrollment.studentId?._id || enrollment.studentId || '',
        courseId: enrollment.courseId?._id || enrollment.courseId || '',
        semester: enrollment.semester || '',
        academicYear: enrollment.academicYear || '',
        status: enrollment.status || 'Enrolled',
        grade: enrollment.grade || '',
      });
    } catch (error) {
      toast.error('Error fetching enrollment');
      navigate('/enrollments');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await enrollmentAPI.update(id, formData);
        toast.success('Enrollment updated successfully');
      } else {
        await enrollmentAPI.create(formData);
        toast.success('Enrollment created successfully');
      }
      navigate('/enrollments');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving enrollment');
      setLoading(false);
    }
  };

  return (
    <div className="row">
      <div className="col-md-8 mx-auto">
        <div className="card">
          <div className="card-header">
            <h3>{isEdit ? 'Edit Enrollment' : 'New Enrollment'}</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Student *</label>
                <select
                  className="form-select"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                  disabled={isEdit}
                >
                  <option value="">Select a student</option>
                  {students.map(student => (
                    <option key={student._id} value={student._id}>
                      {student.firstName} {student.lastName} - {student.grade}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Course *</label>
                <select
                  className="form-select"
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  required
                  disabled={isEdit}
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.courseCode} - {course.courseName} ({course.currentStudents || 0}/{course.maxStudents})
                    </option>
                  ))}
                </select>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Semester *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Fall 2024"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Academic Year *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 2024-2025"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Enrolled">Enrolled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Dropped">Dropped</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Grade</label>
                  <select
                    className="form-select"
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                  >
                    <option value="">Not graded</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="F">F</option>
                    <option value="I">Incomplete</option>
                    <option value="W">Withdrawn</option>
                  </select>
                </div>
              </div>

              <div className="d-flex gap-2 mt-4">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>
                      {isEdit ? 'Update' : 'Create'} Enrollment
                    </>
                  )}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => navigate('/enrollments')}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnrollmentForm;