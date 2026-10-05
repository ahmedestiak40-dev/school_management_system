import React, { useState, useEffect } from 'react';
import { studentAPI, teacherAPI, courseAPI, enrollmentAPI } from '../services/api';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    courses: 0,
    enrollments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [studentsRes, teachersRes, coursesRes, enrollmentsRes] = await Promise.all([
        studentAPI.getAll(),
        teacherAPI.getAll(),
        courseAPI.getAll(),
        enrollmentAPI.getAll(),
      ]);

      const students = studentsRes.data.data || [];
      const teachers = teachersRes.data.data || [];
      const courses = coursesRes.data.data || [];
      const enrollments = enrollmentsRes.data.data || [];

      setStats({
        students: students.length,
        teachers: teachers.length,
        courses: courses.length,
        enrollments: enrollments.length,
      });

      // Create recent activities
      const activities = [];
      if (students.length > 0) {
        const latestStudent = students[students.length - 1];
        activities.push({
          icon: 'fa-user-graduate',
          color: '#667eea',
          message: `New student ${latestStudent.firstName} ${latestStudent.lastName} joined`,
          time: new Date(latestStudent.createdAt || Date.now()).toLocaleDateString()
        });
      }
      if (teachers.length > 0) {
        const latestTeacher = teachers[teachers.length - 1];
        activities.push({
          icon: 'fa-chalkboard-teacher',
          color: '#43e97b',
          message: `Teacher ${latestTeacher.firstName} ${latestTeacher.lastName} joined`,
          time: new Date(latestTeacher.createdAt || Date.now()).toLocaleDateString()
        });
      }
      if (courses.length > 0) {
        const latestCourse = courses[courses.length - 1];
        activities.push({
          icon: 'fa-book',
          color: '#4facfe',
          message: `New course ${latestCourse.courseName} created`,
          time: new Date(latestCourse.createdAt || Date.now()).toLocaleDateString()
        });
      }
      setRecentActivities(activities.slice(0, 4));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  const StatCard = ({ icon, title, value, color, gradient, link }) => (
    <div className="col-md-3 mb-4 fade-in">
      <Link to={link} className="text-decoration-none">
        <div className="stat-card">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <p className="text-muted mb-1" style={{ fontSize: '0.9rem' }}>{title}</p>
              <h2 className="number mb-0">{value}</h2>
            </div>
            <div 
              className="icon"
              style={{ 
                background: gradient,
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <i className={`fas ${icon} fa-2x`} style={{ color: '#fff' }}></i>
            </div>
          </div>
          <div className="mt-3">
            <div className="progress" style={{ height: '4px', background: 'rgba(255,255,255,0.05)' }}>
              <div 
                className="progress-bar" 
                style={{ 
                  width: `${Math.min(value * 10, 100)}%`,
                  background: gradient,
                  borderRadius: '2px'
                }}
              ></div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="loading-spinner mx-auto"></div>
        <p className="mt-3 text-muted">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="glow-text">Dashboard</h2>
          <p className="text-muted">Welcome back! Here's what's happening in your school.</p>
        </div>
        <div>
          <span className="badge bg-primary">
            <i className="fas fa-clock me-1"></i> Live Updates
          </span>
        </div>
      </div>

      <div className="row">
        <StatCard 
          icon="fa-user-graduate" 
          title="Total Students" 
          value={stats.students} 
          gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          link="/students"
        />
        <StatCard 
          icon="fa-chalkboard-teacher" 
          title="Total Teachers" 
          value={stats.teachers} 
          gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
          link="/teachers"
        />
        <StatCard 
          icon="fa-book" 
          title="Total Courses" 
          value={stats.courses} 
          gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
          link="/courses"
        />
        <StatCard 
          icon="fa-clipboard-list" 
          title="Enrollments" 
          value={stats.enrollments} 
          gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
          link="/enrollments"
        />
      </div>

      {/* Recent Activities */}
      {recentActivities.length > 0 && (
        <div className="card mt-4 fade-in">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="fas fa-bolt me-2" style={{ color: '#667eea' }}></i>
              Recent Activities
            </h5>
            <span className="badge bg-primary">Live</span>
          </div>
          <div className="card-body">
            {recentActivities.map((activity, index) => (
              <div key={index} className="d-flex align-items-center mb-3">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ 
                    width: '40px', 
                    height: '40px',
                    background: `${activity.color}20`,
                    color: activity.color
                  }}
                >
                  <i className={`fas ${activity.icon}`}></i>
                </div>
                <div className="flex-grow-1">
                  <p className="mb-0">{activity.message}</p>
                  <small className="text-muted">{activity.time}</small>
                </div>
                <span className="badge bg-success">New</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="row mt-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-rocket me-2" style={{ color: '#667eea' }}></i>
                Quick Actions
              </h5>
            </div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-3">
                <Link to="/students/new" className="btn btn-primary">
                  <i className="fas fa-user-plus me-2"></i> Add Student
                </Link>
                <Link to="/teachers/new" className="btn btn-success">
                  <i className="fas fa-user-tie me-2"></i> Add Teacher
                </Link>
                <Link to="/courses/new" className="btn btn-info">
                  <i className="fas fa-book-open me-2"></i> Add Course
                </Link>
                <Link to="/enrollments/new" className="btn btn-warning">
                  <i className="fas fa-user-graduate me-2"></i> New Enrollment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;