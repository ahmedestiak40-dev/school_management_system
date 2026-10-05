import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { studentAPI } from '../services/api';

function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    try {
      const response = await studentAPI.getById(id);
      setStudent(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching student details');
      navigate('/students');
    }
  };

  if (loading || !student) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const InfoRow = ({ label, value }) => (
    <div className="row mb-2">
      <div className="col-4 fw-bold">{label}</div>
      <div className="col-8">{value || 'N/A'}</div>
    </div>
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Student Profile</h2>
        <div>
          <Link to={`/students/edit/${id}`} className="btn btn-primary me-2">
            <i className="fas fa-edit me-1"></i> Edit
          </Link>
          <button className="btn btn-secondary" onClick={() => navigate('/students')}>
            <i className="fas fa-arrow-left me-1"></i> Back
          </button>
        </div>
      </div>

      <div className="row">
        {/* Profile Card */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              {student.profilePhoto ? (
                <img 
                  src={student.profilePhoto} 
                  alt="Profile" 
                  className="rounded-circle mb-3"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
              ) : (
                <div 
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: '150px', height: '150px', fontSize: '50px' }}
                >
                  {student.firstName[0]}{student.lastName[0]}
                </div>
              )}
              <h4>{student.firstName} {student.lastName}</h4>
              <p className="text-muted">{student.email}</p>
              <div className="d-flex justify-content-center gap-2">
                <span className={`badge bg-${student.status === 'Active' ? 'success' : 'secondary'}`}>
                  {student.status}
                </span>
                <span className="badge bg-info">{student.grade}</span>
                {student.section && <span className="badge bg-secondary">Sec {student.section}</span>}
              </div>
              <hr />
              <div className="text-start">
                <InfoRow label="Roll Number" value={student.rollNumber} />
                <InfoRow label="Gender" value={student.gender} />
                <InfoRow label="Date of Birth" value={new Date(student.dateOfBirth).toLocaleDateString()} />
                <InfoRow label="Age" value={student.age} />
                <InfoRow label="Phone" value={student.phone} />
                <InfoRow label="Academic Year" value={student.academicYear} />
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'info' ? 'active' : ''}`}
                    onClick={() => setActiveTab('info')}
                  >
                    <i className="fas fa-info-circle me-1"></i> Information
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
            </div>
            <div className="card-body">
              {activeTab === 'info' && (
                <div>
                  <h6>Address</h6>
                  <p>
                    {student.address.street && <>{student.address.street}<br /></>}
                    {student.address.city && <>{student.address.city}<br /></>}
                    {student.address.state && <>{student.address.state}, </>}
                    {student.address.zipCode && <>{student.address.zipCode}<br /></>}
                    {student.address.country && <>{student.address.country}</>}
                  </p>
                  
                  {student.notes && student.notes.length > 0 && (
                    <>
                      <h6 className="mt-3">Notes</h6>
                      {student.notes.map((note, index) => (
                        <div key={index} className="alert alert-info">
                          <small className="text-muted">{new Date(note.date).toLocaleDateString()}</small>
                          <p>{note.content}</p>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}

              {activeTab === 'guardian' && (
                <div>
                  <InfoRow label="Guardian Name" value={student.guardian.name} />
                  <InfoRow label="Relationship" value={student.guardian.relationship} />
                  <InfoRow label="Phone" value={student.guardian.phone} />
                  <InfoRow label="Email" value={student.guardian.email} />
                  <InfoRow label="Occupation" value={student.guardian.occupation} />
                  <InfoRow label="Address" value={student.guardian.address} />
                </div>
              )}

              {activeTab === 'medical' && (
                <div>
                  <InfoRow label="Blood Group" value={student.medicalInfo.bloodGroup} />
                  <InfoRow label="Allergies" value={student.medicalInfo.allergies} />
                  <InfoRow label="Chronic Conditions" value={student.medicalInfo.chronicConditions} />
                  <h6 className="mt-3">Emergency Contact</h6>
                  <InfoRow label="Name" value={student.medicalInfo.emergencyContact.name} />
                  <InfoRow label="Relationship" value={student.medicalInfo.emergencyContact.relationship} />
                  <InfoRow label="Phone" value={student.medicalInfo.emergencyContact.phone} />
                </div>
              )}

              {activeTab === 'fees' && (
                <div>
                  <div className="row">
                    <div className="col-md-4">
                      <div className="card bg-primary text-white">
                        <div className="card-body">
                          <h6>Total Fees</h6>
                          <h3>${student.fees.total}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card bg-success text-white">
                        <div className="card-body">
                          <h6>Amount Paid</h6>
                          <h3>${student.fees.paid}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card bg-warning text-white">
                        <div className="card-body">
                          <h6>Amount Due</h6>
                          <h3>${student.fees.due}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'activities' && (
                <div>
                  {student.extracurricular && student.extracurricular.length > 0 ? (
                    student.extracurricular.map((activity, index) => (
                      <div key={index} className="card mb-2">
                        <div className="card-body">
                          <h6>{activity.name}</h6>
                          <p className="mb-1"><strong>Year:</strong> {activity.year}</p>
                          <p className="mb-1"><strong>Achievement:</strong> {activity.achievement}</p>
                          <p className="mb-0"><strong>Description:</strong> {activity.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">No extracurricular activities recorded</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;