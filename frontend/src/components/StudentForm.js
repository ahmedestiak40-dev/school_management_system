import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { studentAPI } from '../services/api';

function StudentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    gender: 'Male',
    phone: '',
    profilePhoto: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    grade: '',
    section: 'A',
    rollNumber: '',
    academicYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
    status: 'Active',
    guardian: {
      name: '',
      relationship: '',
      phone: '',
      email: '',
      occupation: '',
      address: '',
    },
    medicalInfo: {
      bloodGroup: '',
      allergies: '',
      chronicConditions: '',
      emergencyContact: {
        name: '',
        relationship: '',
        phone: '',
      },
    },
    fees: {
      total: 0,
      paid: 0,
      due: 0,
    },
    extracurricular: [],
    notes: [],
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  const grades = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
  const sections = ['A', 'B', 'C', 'D', 'E'];
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    if (isEdit) {
      fetchStudent();
    }
  }, [id]);

  const fetchStudent = async () => {
    try {
      const response = await studentAPI.getById(id);
      const student = response.data.data;
      setFormData({
        ...student,
        dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split('T')[0] : '',
        fees: student.fees || { total: 0, paid: 0, due: 0 },
        medicalInfo: student.medicalInfo || { bloodGroup: '', allergies: '', chronicConditions: '', emergencyContact: { name: '', relationship: '', phone: '' } },
        extracurricular: student.extracurricular || [],
        notes: student.notes || [],
      });
    } catch (error) {
      toast.error('Error fetching student');
      navigate('/students');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const parts = name.split('.');
      setFormData(prev => {
        let newData = { ...prev };
        let current = newData;
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) current[parts[i]] = {};
          current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
        return newData;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleArrayChange = (field, index, subField, value) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      if (subField) {
        newArray[index][subField] = value;
      } else {
        newArray[index] = value;
      }
      return { ...prev, [field]: newArray };
    });
  };

  const addExtracurricular = () => {
    setFormData(prev => ({
      ...prev,
      extracurricular: [...prev.extracurricular, { name: '', description: '', year: '', achievement: '' }]
    }));
  };

  const removeExtracurricular = (index) => {
    setFormData(prev => ({
      ...prev,
      extracurricular: prev.extracurricular.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Calculate fees due
    const feesDue = formData.fees.total - formData.fees.paid;
    const submitData = {
      ...formData,
      fees: {
        ...formData.fees,
        due: feesDue,
      }
    };

    try {
      if (isEdit) {
        await studentAPI.update(id, submitData);
        toast.success('Student updated successfully');
      } else {
        await studentAPI.create(submitData);
        toast.success('Student created successfully');
      }
      navigate('/students');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving student');
      setLoading(false);
    }
  };

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h3>{isEdit ? 'Edit Student' : 'Add New Student'}</h3>
          </div>
          <div className="card-body">
            {/* Tabs */}
            <ul className="nav nav-tabs mb-4">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'personal' ? 'active' : ''}`}
                  onClick={() => setActiveTab('personal')}
                >
                  <i className="fas fa-user me-1"></i> Personal
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'academic' ? 'active' : ''}`}
                  onClick={() => setActiveTab('academic')}
                >
                  <i className="fas fa-graduation-cap me-1"></i> Academic
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'guardian' ? 'active' : ''}`}
                  onClick={() => setActiveTab('guardian')}
                >
                  <i className="fas fa-users me-1"></i> Guardian
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'medical' ? 'active' : ''}`}
                  onClick={() => setActiveTab('medical')}
                >
                  <i className="fas fa-heartbeat me-1"></i> Medical
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'fees' ? 'active' : ''}`}
                  onClick={() => setActiveTab('fees')}
                >
                  <i className="fas fa-money-bill me-1"></i> Fees
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'activities' ? 'active' : ''}`}
                  onClick={() => setActiveTab('activities')}
                >
                  <i className="fas fa-trophy me-1"></i> Activities
                </button>
              </li>
            </ul>

            <form onSubmit={handleSubmit}>
              {/* Personal Information Tab */}
              {activeTab === 'personal' && (
                <div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">First Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Last Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Phone *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Date of Birth *</label>
                      <input
                        type="date"
                        className="form-control"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Gender *</label>
                      <select
                        className="form-select"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Profile Photo URL</label>
                      <input
                        type="url"
                        className="form-control"
                        name="profilePhoto"
                        value={formData.profilePhoto}
                        onChange={handleChange}
                        placeholder="https://example.com/photo.jpg"
                      />
                    </div>
                  </div>

                  <h5 className="mt-4">Address</h5>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Street</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Zip Code</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address.zipCode"
                        value={formData.address.zipCode}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Country</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Academic Information Tab */}
              {activeTab === 'academic' && (
                <div>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Grade *</label>
                      <select
                        className="form-select"
                        name="grade"
                        value={formData.grade}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Grade</option>
                        {grades.map(grade => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Section</label>
                      <select
                        className="form-select"
                        name="section"
                        value={formData.section}
                        onChange={handleChange}
                      >
                        {sections.map(section => (
                          <option key={section} value={section}>Section {section}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Roll Number</label>
                      <input
                        type="text"
                        className="form-control"
                        name="rollNumber"
                        value={formData.rollNumber}
                        onChange={handleChange}
                        placeholder="e.g., 2024-001"
                      />
                    </div>
                  </div>

                  <div className="row">
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
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Graduated">Graduated</option>
                        <option value="Suspended">Suspended</option>
                        <option value="Transferred">Transferred</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Guardian Information Tab */}
              {activeTab === 'guardian' && (
                <div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Guardian Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="guardian.name"
                        value={formData.guardian.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Relationship</label>
                      <input
                        type="text"
                        className="form-control"
                        name="guardian.relationship"
                        value={formData.guardian.relationship}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Guardian Phone</label>
                      <input
                        type="text"
                        className="form-control"
                        name="guardian.phone"
                        value={formData.guardian.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Guardian Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="guardian.email"
                        value={formData.guardian.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Guardian Occupation</label>
                      <input
                        type="text"
                        className="form-control"
                        name="guardian.occupation"
                        value={formData.guardian.occupation}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Guardian Address</label>
                      <input
                        type="text"
                        className="form-control"
                        name="guardian.address"
                        value={formData.guardian.address}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Medical Information Tab */}
              {activeTab === 'medical' && (
                <div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Blood Group</label>
                      <select
                        className="form-select"
                        name="medicalInfo.bloodGroup"
                        value={formData.medicalInfo.bloodGroup}
                        onChange={handleChange}
                      >
                        <option value="">Select Blood Group</option>
                        {bloodGroups.map(bg => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Allergies</label>
                      <input
                        type="text"
                        className="form-control"
                        name="medicalInfo.allergies"
                        value={formData.medicalInfo.allergies}
                        onChange={handleChange}
                        placeholder="e.g., Peanuts, Penicillin"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Chronic Conditions</label>
                    <input
                      type="text"
                      className="form-control"
                      name="medicalInfo.chronicConditions"
                      value={formData.medicalInfo.chronicConditions}
                      onChange={handleChange}
                      placeholder="e.g., Asthma, Diabetes"
                    />
                  </div>

                  <h5 className="mt-4">Emergency Contact</h5>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="medicalInfo.emergencyContact.name"
                        value={formData.medicalInfo.emergencyContact.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Relationship</label>
                      <input
                        type="text"
                        className="form-control"
                        name="medicalInfo.emergencyContact.relationship"
                        value={formData.medicalInfo.emergencyContact.relationship}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Phone</label>
                      <input
                        type="text"
                        className="form-control"
                        name="medicalInfo.emergencyContact.phone"
                        value={formData.medicalInfo.emergencyContact.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Fees Information Tab */}
              {activeTab === 'fees' && (
                <div>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Total Fees</label>
                      <input
                        type="number"
                        className="form-control"
                        name="fees.total"
                        value={formData.fees.total}
                        onChange={handleChange}
                        min="0"
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Amount Paid</label>
                      <input
                        type="number"
                        className="form-control"
                        name="fees.paid"
                        value={formData.fees.paid}
                        onChange={handleChange}
                        min="0"
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Amount Due</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.fees.total - formData.fees.paid}
                        disabled
                        class Name="form-control bg-light"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <h6>Payment History</h6>
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Receipt</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.fees.paymentHistory && formData.fees.paymentHistory.map((payment, index) => (
                            <tr key={index}>
                              <td>{new Date(payment.date).toLocaleDateString()}</td>
                              <td>${payment.amount}</td>
                              <td>{payment.method}</td>
                              <td>{payment.receiptNumber}</td>
                            </tr>
                          ))}
                          {(!formData.fees.paymentHistory || formData.fees.paymentHistory.length === 0) && (
                            <tr>
                              <td colSpan="4" className="text-center text-muted">No payment history</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Extracurricular Activities Tab */}
              {activeTab === 'activities' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6>Extracurricular Activities</h6>
                    <button type="button" className="btn btn-sm btn-primary" onClick={addExtracurricular}>
                      <i className="fas fa-plus me-1"></i> Add Activity
                    </button>
                  </div>
                  
                  {formData.extracurricular.map((activity, index) => (
                    <div key={index} className="card mb-3">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-4 mb-2">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Activity Name"
                              value={activity.name}
                              onChange={(e) => handleArrayChange('extracurricular', index, 'name', e.target.value)}
                            />
                          </div>
                          <div className="col-md-3 mb-2">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Year"
                              value={activity.year}
                              onChange={(e) => handleArrayChange('extracurricular', index, 'year', e.target.value)}
                            />
                          </div>
                          <div className="col-md-4 mb-2">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Achievement"
                              value={activity.achievement}
                              onChange={(e) => handleArrayChange('extracurricular', index, 'achievement', e.target.value)}
                            />
                          </div>
                          <div className="col-md-1">
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => removeExtracurricular(index)}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        </div>
                        <div className="mt-2">
                          <textarea
                            className="form-control form-control-sm"
                            placeholder="Description"
                            value={activity.description}
                            onChange={(e) => handleArrayChange('extracurricular', index, 'description', e.target.value)}
                            rows="2"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

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
                      {isEdit ? 'Update' : 'Create'} Student
                    </>
                  )}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => navigate('/students')}
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

export default StudentForm;