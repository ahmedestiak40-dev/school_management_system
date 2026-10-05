import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { courseAPI, teacherAPI } from '../services/api';

function CourseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    description: '',
    credits: '',
    teacherId: '',
    schedule: {
      day: 'Monday',
      startTime: '',
      endTime: '',
      room: '',
    },
    maxStudents: 30,
    status: 'Active',
  });
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeachers();
    if (isEdit) {
      fetchCourse();
    }
  }, [id]);

  const fetchTeachers = async () => {
    try {
      const response = await teacherAPI.getAll();
      setTeachers(response.data.data || []);
    } catch (error) {
      toast.error('Error fetching teachers');
    }
  };

  const fetchCourse = async () => {
    try {
      const response = await courseAPI.getById(id);
      const course = response.data.data;
      setFormData({
        ...course,
        teacherId: course.teacherId?._id || course.teacherId || '',
      });
    } catch (error) {
      toast.error('Error fetching course');
      navigate('/courses');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await courseAPI.update(id, formData);
        toast.success('Course updated successfully');
      } else {
        await courseAPI.create(formData);
        toast.success('Course created successfully');
      }
      navigate('/courses');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving course');
      setLoading(false);
    }
  };

  return (
    <div className="row">
      <div className="col-md-8 mx-auto">
        <div className="card">
          <div className="card-header">
            <h3>{isEdit ? 'Edit Course' : 'Add New Course'}</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Course Code *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="courseCode"
                    value={formData.courseCode}
                    onChange={handleChange}
                    required
                    placeholder="e.g., MATH101"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Course Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Credits *</label>
                  <input
                    type="number"
                    className="form-control"
                    name="credits"
                    value={formData.credits}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Max Students</label>
                  <input
                    type="number"
                    className="form-control"
                    name="maxStudents"
                    value={formData.maxStudents}
                    onChange={handleChange}
                    min="1"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Assign Teacher *</label>
                <select
                  className="form-select"
                  name="teacherId"
                  value={formData.teacherId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a teacher</option>
                  {teachers.map(teacher => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.firstName} {teacher.lastName} - {teacher.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <h5 className="mt-4">Schedule</h5>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Day</label>
                  <select
                    className="form-select"
                    name="schedule.day"
                    value={formData.schedule.day}
                    onChange={handleChange}
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Room</label>
                  <input
                    type="text"
                    className="form-control"
                    name="schedule.room"
                    value={formData.schedule.room}
                    onChange={handleChange}
                    placeholder="e.g., Room 101"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Start Time</label>
                  <input
                    type="time"
                    className="form-control"
                    name="schedule.startTime"
                    value={formData.schedule.startTime}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">End Time</label>
                  <input
                    type="time"
                    className="form-control"
                    name="schedule.endTime"
                    value={formData.schedule.endTime}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Full">Full</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
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
                      {isEdit ? 'Update' : 'Create'} Course
                    </>
                  )}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => navigate('/courses')}
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

export default CourseForm;