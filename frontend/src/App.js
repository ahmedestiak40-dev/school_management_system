import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import ParticleBackground from './components/ParticleBackground';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import StudentProfile from './components/StudentProfile';
import TeacherList from './components/TeacherList';
import TeacherForm from './components/TeacherForm';
import CourseList from './components/CourseList';
import CourseForm from './components/CourseForm';
import EnrollmentList from './components/EnrollmentList';
import EnrollmentForm from './components/EnrollmentForm';

function App() {
  return (
    <Router>
      <div className="App">
        <ParticleBackground />
        
        <Navbar bg="dark" variant="dark" expand="lg" className="navbar">
          <Container>
            <Navbar.Brand as={Link} to="/">
              <i className="fas fa-graduation-cap me-2"></i>
              School Management
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link as={Link} to="/">
                  <i className="fas fa-chart-pie me-1"></i> Dashboard
                </Nav.Link>
                <NavDropdown title={<><i className="fas fa-users me-1"></i> Students</>} id="students-dropdown">
                  <NavDropdown.Item as={Link} to="/students">
                    <i className="fas fa-list me-2"></i> Student List
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/students/new">
                    <i className="fas fa-plus-circle me-2"></i> Add Student
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title={<><i className="fas fa-chalkboard-teacher me-1"></i> Teachers</>} id="teachers-dropdown">
                  <NavDropdown.Item as={Link} to="/teachers">
                    <i className="fas fa-list me-2"></i> Teacher List
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/teachers/new">
                    <i className="fas fa-plus-circle me-2"></i> Add Teacher
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title={<><i className="fas fa-book me-1"></i> Courses</>} id="courses-dropdown">
                  <NavDropdown.Item as={Link} to="/courses">
                    <i className="fas fa-list me-2"></i> Course List
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/courses/new">
                    <i className="fas fa-plus-circle me-2"></i> Add Course
                  </NavDropdown.Item>
                </NavDropdown>
                <Nav.Link as={Link} to="/enrollments">
                  <i className="fas fa-clipboard-list me-1"></i> Enrollments
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container className="mt-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/students/new" element={<StudentForm />} />
            <Route path="/students/edit/:id" element={<StudentForm />} />
            <Route path="/students/profile/:id" element={<StudentProfile />} />
            <Route path="/teachers" element={<TeacherList />} />
            <Route path="/teachers/new" element={<TeacherForm />} />
            <Route path="/teachers/edit/:id" element={<TeacherForm />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/courses/new" element={<CourseForm />} />
            <Route path="/courses/edit/:id" element={<CourseForm />} />
            <Route path="/enrollments" element={<EnrollmentList />} />
            <Route path="/enrollments/new" element={<EnrollmentForm />} />
            <Route path="/enrollments/edit/:id" element={<EnrollmentForm />} />
          </Routes>
        </Container>

        <ToastContainer 
          position="bottom-right" 
          autoClose={3000}
          theme="dark"
          toastStyle={{
            background: 'rgba(15, 15, 26, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            color: '#fff',
            borderRadius: '12px'
          }}
        />
      </div>
    </Router>
  );
}

export default App;