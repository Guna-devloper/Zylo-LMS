import React, { useState } from "react";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card
} from "react-bootstrap";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";

const AdminDashboard = () => {
  const [role, setRole] = useState("instructor");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contentData, setContentData] = useState([]);
  const [feedbackScore, setFeedbackScore] = useState({ total: 0, score: 0 });
  const [auditScore, setAuditScore] = useState({ total: 0, score: 0 });
  const [userRatings, setUserRatings] = useState(0);
  const [barData, setBarData] = useState([]);

  const handleContentChange = (index, field, value) => {
    const updated = [...contentData];
    updated[index][field] = value;
    setContentData(updated);
  };

  const handleBarChange = (index, field, value) => {
    const updated = [...barData];
    updated[index][field] = value;
    setBarData(updated);
  };

  const handleSubmit = async () => {
    if (!userName || !email || !password) {
      alert("Name, Email, and Password are required.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const baseData = {
        userName,
        email,
        role,
        createdAt: new Date()
      };

      if (role === "instructor") {
        Object.assign(baseData, {
          contentData,
          feedbackScore,
          auditScore,
          userRatings,
          barData
        });
      }

      const collectionName = role === "instructor" ? "instructors" : "students";

      await setDoc(doc(db, collectionName, uid), baseData);
      await setDoc(doc(db, "users", uid), {
        email,
        role,
        userName,
        createdAt: new Date()
      });

      alert(`✅ ${role.charAt(0).toUpperCase() + role.slice(1)} account created successfully!`);

      // Clear form
      setUserName("");
      setEmail("");
      setPassword("");
      setContentData([]);
      setFeedbackScore({ total: 0, score: 0 });
      setAuditScore({ total: 0, score: 0 });
      setUserRatings(0);
      setBarData([]);
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Error: " + error.message);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">👨‍💼 Admin Dashboard - Add {role.charAt(0).toUpperCase() + role.slice(1)}</h2>

      <Card className="mb-3 p-3">
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Select Role</Form.Label>
            <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="instructor">Instructor</option>
              <option value="student">Student</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{role === "student" ? "Student" : "Instructor"} Name</Form.Label>
            <Form.Control
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter full name"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </Form.Group>
        </Form>
      </Card>

      {role === "instructor" && (
        <>
          <Card className="mb-3 p-3">
            <h5>📘 Content Data</h5>
            {contentData.map((item, idx) => (
              <Row key={idx} className="mb-2">
                <Col><Form.Control placeholder="Label" value={item.label} onChange={(e) => handleContentChange(idx, "label", e.target.value)} /></Col>
                <Col><Form.Control placeholder="Count" type="number" value={item.count} onChange={(e) => handleContentChange(idx, "count", parseInt(e.target.value) || 0)} /></Col>
                <Col><Form.Control placeholder="Color" value={item.color} onChange={(e) => handleContentChange(idx, "color", e.target.value)} /></Col>
                <Col><Form.Control placeholder="Icon" value={item.icon} onChange={(e) => handleContentChange(idx, "icon", e.target.value)} /></Col>
              </Row>
            ))}
            <Button variant="outline-primary" onClick={() => setContentData([...contentData, { label: "", count: 0, color: "", icon: "" }])}>
              + Add Content
            </Button>
          </Card>

          <Card className="mb-3 p-3">
            <h5>📊 Feedback & Audit Score</h5>
            <Row className="mb-2">
              <Col><Form.Control type="number" placeholder="Feedback Total" value={feedbackScore.total} onChange={(e) => setFeedbackScore({ ...feedbackScore, total: parseInt(e.target.value) || 0 })} /></Col>
              <Col><Form.Control type="number" placeholder="Feedback Score" value={feedbackScore.score} onChange={(e) => setFeedbackScore({ ...feedbackScore, score: parseFloat(e.target.value) || 0 })} /></Col>
            </Row>
            <Row className="mb-2">
              <Col><Form.Control type="number" placeholder="Audit Total" value={auditScore.total} onChange={(e) => setAuditScore({ ...auditScore, total: parseInt(e.target.value) || 0 })} /></Col>
              <Col><Form.Control type="number" placeholder="Audit Score" value={auditScore.score} onChange={(e) => setAuditScore({ ...auditScore, score: parseFloat(e.target.value) || 0 })} /></Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>User Ratings</Form.Label>
              <Form.Control type="number" placeholder="User Ratings" value={userRatings} onChange={(e) => setUserRatings(parseFloat(e.target.value) || 0)} />
            </Form.Group>
          </Card>

          <Card className="mb-3 p-3">
            <h5>📈 Bar Graph Data</h5>
            {barData.map((item, idx) => (
              <Row key={idx} className="mb-2">
                <Col><Form.Control placeholder="Label" value={item.label} onChange={(e) => handleBarChange(idx, "label", e.target.value)} /></Col>
                <Col><Form.Control placeholder="Value" type="number" value={item.value} onChange={(e) => handleBarChange(idx, "value", parseInt(e.target.value) || 0)} /></Col>
                <Col><Form.Control placeholder="Color" value={item.color} onChange={(e) => handleBarChange(idx, "color", e.target.value)} /></Col>
              </Row>
            ))}
            <Button variant="outline-secondary" onClick={() => setBarData([...barData, { label: "", value: 0, color: "" }])}>
              + Add Bar
            </Button>
          </Card>
        </>
      )}

      <div className="text-center">
        <Button variant="success" onClick={handleSubmit}>
          ✅ Create {role.charAt(0).toUpperCase() + role.slice(1)}
        </Button>
      </div>
    </Container>
  );
};

export default AdminDashboard;
