import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { Doughnut } from 'react-chartjs-2';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FaBook, FaCode, FaComments, FaLightbulb } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const StudentDashboard = () => {
  const [userName, setUserName] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [mindText, setMindText] = useState('');

  useEffect(() => {
    const fetchStudentData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserName(data.name || 'Student');
        }
      }
    };
    fetchStudentData();
  }, []);

  const progressData = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        data: [60, 40],
        backgroundColor: ['#198754', '#d9d9d9'],
        borderWidth: 1,
      },
    ],
  };

  const handleMindSubmit = (e) => {
    e.preventDefault();
    if (mindText.trim() !== '') {
      alert('Submitted: ' + mindText);
      setMindText('');
    }
  };

  return (
    <div className={darkMode ? 'bg-dark text-light' : 'bg-light text-dark'} style={{ minHeight: '100vh' }}>
      <Container fluid className="p-4">
        <Row className="align-items-center mb-4">
          <Col>
            <h3>Welcome back, {userName}! 🎓</h3>
            <p>Here’s your learning summary and activities.</p>
          </Col>
          <Col className="text-end">
            <Button variant={darkMode ? 'outline-light' : 'dark'} onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
            </Button>
          </Col>
        </Row>

        <Row className="g-4">
          {/* Course Progress */}
          <Col md={6} lg={4}>
            <Card className={darkMode ? 'bg-secondary text-light' : 'shadow-sm'}>
              <Card.Body>
                <Card.Title><FaBook /> Course Progress</Card.Title>
                <Doughnut data={progressData} />
              </Card.Body>
            </Card>
          </Col>

          {/* Coding Practice */}
          <Col md={6} lg={4}>
            <Card className={darkMode ? 'bg-secondary text-light' : 'shadow-sm'}>
              <Card.Body>
                <Card.Title><FaCode /> Coding Practice</Card.Title>
                <Card.Text>You've completed 5 coding challenges this week!</Card.Text>
                <Button variant={darkMode ? 'outline-light' : 'success'}>Practice Now</Button>
              </Card.Body>
            </Card>
          </Col>

          {/* What's on your mind */}
          <Col md={12} lg={4}>
            <Card className={darkMode ? 'bg-secondary text-light' : 'shadow-sm'}>
              <Card.Body>
                <Card.Title><FaComments /> What’s on your mind?</Card.Title>
                <Form onSubmit={handleMindSubmit}>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Share your thoughts or questions..."
                    value={mindText}
                    onChange={(e) => setMindText(e.target.value)}
                    className="mb-2"
                  />
                  <Button type="submit" variant={darkMode ? 'outline-light' : 'primary'}>
                    Submit
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <Card className={darkMode ? 'bg-secondary text-light' : 'shadow-sm'}>
              <Card.Body>
                <Card.Title><FaLightbulb /> Tips for You</Card.Title>
                <ul>
                  <li>Complete at least one lesson per day for better retention.</li>
                  <li>Practice coding consistently to improve problem-solving.</li>
                  <li>Don't hesitate to post doubts or ideas in the “What’s on your mind” section.</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StudentDashboard;
