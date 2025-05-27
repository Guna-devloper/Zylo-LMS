import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import {
  Container, Row, Col, Card, Nav,
} from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import {
  CircularProgressbar, buildStyles,
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  FaHome, FaBook, FaLock, FaClipboardList, FaFileAlt, FaUser, FaPlay, FaPowerOff, FaBars,
} from 'react-icons/fa';
import logo from '../Images/crtlogo-removebg-preview.png';
import { useNavigate } from 'react-router-dom';

// Import your components for dynamic rendering
import Subjects from '../pages/Instructor/Subjects';
import QuestionPortal from '../pages/Instructor/QuestionPortal';
import Allocations from '../pages/Instructor/Allocations';
import Reports from '../pages/Instructor/Reports';
import Trainer from '../pages/Instructor/Trainer';
import Playground from '../pages/Instructor/Playground';
import Header from '../pages/Instructor/Header';

const Sidebar = ({ isCollapsed, toggleSidebar, activeLink, onLinkClick }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("Logging out...");
    navigate('/');
  };

  const navItems = [
    { key: 'dashboard', icon: <FaHome />, label: 'Dashboard' },
    { key: 'subjects', icon: <FaBook />, label: 'Subjects' },
    { key: 'question-portal', icon: <FaLock />, label: 'Question Portal' },
    { key: 'allocations', icon: <FaClipboardList />, label: 'Allocations' },
    { key: 'reports', icon: <FaFileAlt />, label: 'Reports' },
    { key: 'trainer', icon: <FaUser />, label: 'Trainer' },
    { key: 'playground', icon: <FaPlay />, label: 'Playground' },
  ];

  return (
    <div
      style={{
        width: isCollapsed ? 80 : 240,
        backgroundColor: '#F0F4F9',
        display: 'flex',
        flexDirection: 'column',
        alignItems: isCollapsed ? 'center' : 'flex-start',
        padding: '20px 10px',
        transition: 'width 0.3s ease',
        overflowX: 'hidden',
        height: '100vh',
        borderRight: '1px solid #dee2e6',
        position: 'fixed',
        zIndex: 10,
      }}
    >
      {/* Logo & Toggle Button */}
      <div className="mb-4 d-flex align-items-center justify-content-between w-100" style={{ gap: 8 }}>
        <img
          src={logo}
          alt="Logo"
          style={{ width: isCollapsed ? 40 : 100, height: isCollapsed ? 40 : 100, cursor: 'pointer' }}
          onClick={() => onLinkClick('dashboard')}
        />
        <button
          onClick={toggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 20,
            cursor: 'pointer',
            color: '#0d6efd',
            display: isCollapsed ? 'block' : 'none',
          }}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <FaBars />
        </button>
      </div>

      <Nav className="flex-column w-100" style={{ flexGrow: 1 }}>
        {navItems.map(({ key, icon, label }) => (
          <Nav.Link
            key={key}
            className={`d-flex align-items-center px-3 py-2 sidebar-link ${activeLink === key ? 'active' : ''}`}
            style={{
              cursor: 'pointer',
              backgroundColor: activeLink === key ? '#0d6efd' : 'transparent',
              color: activeLink === key ? 'white' : '#333',
              borderRadius: 8,
              marginBottom: 6,
              userSelect: 'none',
              transition: 'background-color 0.2s ease',
            }}
            onClick={() => onLinkClick(key)}
          >
            <span style={{ fontSize: 22, marginRight: isCollapsed ? 0 : 12, display: 'flex', justifyContent: 'center', width: 28 }}>
              {icon}
            </span>
            {!isCollapsed && <span style={{ fontSize: 14 }}>{label}</span>}
          </Nav.Link>
        ))}

        <div style={{ flexGrow: 1 }} />

        <Nav.Link
          className="d-flex align-items-center px-3 py-2 mt-auto sidebar-link"
          style={{
            cursor: 'pointer',
            color: '#dc3545',
            userSelect: 'none',
            borderRadius: 8,
            marginBottom: 6,
          }}
          onClick={handleLogout}
        >
          <span style={{ fontSize: 22, marginRight: isCollapsed ? 0 : 12, display: 'flex', justifyContent: 'center', width: 28 }}>
            <FaPowerOff />
          </span>
          {!isCollapsed && <span style={{ fontSize: 14 }}>Logout</span>}
        </Nav.Link>
      </Nav>

      {!isCollapsed && (
        <button
          onClick={toggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 20,
            cursor: 'pointer',
            color: '#0d6efd',
            alignSelf: 'flex-end',
            marginTop: 10,
          }}
          aria-label="Collapse Sidebar"
        >
          <FaBars />
        </button>
      )}
    </div>
  );
};

const InstructorDashboard = ({ userId }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(isMobile);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('Instructor');
  const [contentData, setContentData] = useState([]);
  const [feedbackScore, setFeedbackScore] = useState({ score: 0, total: 1 });
  const [auditScore, setAuditScore] = useState({ score: 0, total: 1 });
  const [userRatings, setUserRatings] = useState(0);
  const [activeLink, setActiveLink] = useState('dashboard');
const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchInstructorData = async () => {
      if (!userId) {
        console.warn('No userId provided');
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'instructors', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.userName || 'Instructor');
          setContentData(data.contentData || []);
          setFeedbackScore(data.feedbackScore || { score: 0, total: 1 });
          setAuditScore(data.auditScore || { score: 0, total: 1 });
          setUserRatings(data.userRatings || 0);
        } else {
          console.warn('No instructor data found');
        }
      } catch (error) {
        console.error('Error fetching instructor data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorData();
  }, [userId]);

  // Update sidebar collapse state on screen resize
  useEffect(() => {
    setIsSidebarCollapsed(isMobile);
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const handleLinkClick = (key) => {
    setActiveLink(key);
  };

  const renderContent = () => {
    switch (activeLink) {
      case 'subjects':
        return <Subjects />;
      case 'question-portal':
        return <QuestionPortal />;
      case 'allocations':
        return <Allocations />;
      case 'reports':
        return <Reports />;
      case 'trainer':
        return <Trainer />;
      case 'playground':
        return <Playground />;
      case 'dashboard':
      default:
        return (
          <>
            <h4 className="mb-0 fw-bold">Welcome, {name}!</h4>

            {/* Contribution Cards */}
            <Row xs={1} sm={2} md={4} className="g-3 mb-4">
              {contentData.map(({ count, label, color, icon }) => (
                <Col key={label}>
                  <Card
                    className="text-white h-100 shadow-sm"
                    style={{
                      backgroundColor: color,
                      borderRadius: 12,
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >


                    <div>
                      <h2 className="fw-bold">{count}</h2>
                      <div style={{ fontWeight: 600, fontSize: 18 }}>{label}</div>
                    </div>
                    <div style={{ fontSize: 24, textAlign: 'right', opacity: 0.6 }}>{icon}</div>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Feedback and Audit Score */}
            <Row xs={1} md={2} className="g-3 mb-4 justify-content-center">
              <Col xs={12} md={6}>
                <Card className="p-3 shadow-sm rounded-4 text-center">
                  <h5 className="mb-4 fw-bold">Feedback Score</h5>
                  <div style={{ width: 180, height: 180, margin: 'auto' }}>
                    <CircularProgressbar
                      value={calculatePercent(feedbackScore.score, feedbackScore.total)}
                      text={`${calculatePercent(feedbackScore.score, feedbackScore.total).toFixed(0)}%`}
                      styles={buildStyles({
                        pathColor: '#2B9EB3',
                        textColor: '#2B9EB3',
                        trailColor: '#e1e1e1',
                      })}
                    />
                  </div>
                  <div className="mt-3" style={{ fontWeight: 600, fontSize: 18 }}>
                    {feedbackScore.score} / {feedbackScore.total}
                  </div>
                </Card>
              </Col>

              <Col xs={12} md={6}>
                <Card className="p-3 shadow-sm rounded-4 text-center">
                  <h5 className="mb-4 fw-bold">Audit Score</h5>
                  <div style={{ width: 180, height: 180, margin: 'auto' }}>
                    <CircularProgressbar
                      value={calculatePercent(auditScore.score, auditScore.total)}
                      text={`${calculatePercent(auditScore.score, auditScore.total).toFixed(0)}%`}
                      styles={buildStyles({
                        pathColor: '#2B9EB3',
                        textColor: '#2B9EB3',
                        trailColor: '#e1e1e1',
                      })}
                    />
                  </div>
                  <div className="mt-3" style={{ fontWeight: 600, fontSize: 18 }}>
                    {auditScore.score} / {auditScore.total}
                  </div>
                </Card>
              </Col>
            </Row>

            {/* User Ratings */}
            <Card className="p-4 shadow-sm rounded-4 text-center">
              <h5 className="mb-3 fw-bold">User Ratings</h5>
              <div style={{ fontSize: 36, fontWeight: 'bold', color: '#0d6efd' }}>{userRatings}</div>
            </Card>
          </>
        );
    }
  };

  // Helper to calculate percentage safely
  const calculatePercent = (score, total) => (total > 0 ? (score / total) * 100 : 0);

  if (loading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 24,
          fontWeight: 'bold',
          color: '#0d6efd',
        }}
      >
        Loading...
      </div>
    );
  }
const handleDarkModeToggle = () => {
  setIsDarkMode(!isDarkMode);
  document.body.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
};
const handleChangeTheme = () => {
  // Placeholder for theme palette change logic
  alert('Theme palette change triggered');
};
  return (

    <>
 <Header onToggleDarkMode={handleDarkModeToggle} onChangeTheme={handleChangeTheme} />

    <Container fluid style={{ padding: 0, margin: 0, height: '100vh', overflow: 'hidden' }}>
      <Row style={{ height: '100%' }}>
        <Col
          xs="auto"
          style={{
            padding: 0,
            height: '100vh',
            overflowY: 'auto',
          }}
        >
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            toggleSidebar={toggleSidebar}
            activeLink={activeLink}
            onLinkClick={handleLinkClick}
          />
        </Col>
        <Col
          style={{
            marginLeft: isSidebarCollapsed ? 80 : 240,
            padding: '2rem',
            height: '100vh',
            overflowY: 'auto',
            backgroundColor: '#f8f9fa',
            transition: 'margin-left 0.3s ease',
          }}
        >
          {renderContent()}
        </Col>
      </Row>
    </Container>
    </>
  );  
};

export default InstructorDashboard;
