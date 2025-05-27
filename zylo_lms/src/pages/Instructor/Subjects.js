import React from 'react';
import './Subjects.css';
import {
  FaBookOpen,
  FaClipboardList,
  FaFlask,
  FaCalendarAlt,
  FaBriefcase
} from 'react-icons/fa';

const subjectsData = [
  {
    title: 'Course',
    description: 'Access structured lessons & video content',
    icon: <FaBookOpen />,
    color: '#6C63FF'
  },
  {
    title: 'Assessment',
    description: 'Attempt quizzes and tests to evaluate progress',
    icon: <FaClipboardList />,
    color: '#F59E0B'
  },
  {
    title: 'Lab',
    description: 'Hands-on coding and practical assignments',
    icon: <FaFlask />,
    color: '#10B981'
  },
  {
    title: 'Events',
    description: 'Workshops, webinars, and community events',
    icon: <FaCalendarAlt />,
    color: '#3B82F6'
  },
  {
    title: 'Drives',
    description: 'Placement drives & internship opportunities',
    icon: <FaBriefcase />,
    color: '#EF4444'
  }
];

const Subjects = () => {
  return (
    <div className="subjects-wrapper">
      <h2 className="subjects-heading">Explore Subjects</h2>
      <p className="subjects-subheading">Your learning hub — Interactive, Practical, and Career-Oriented</p>
      <div className="subjects-grid">
        {subjectsData.map((subject, index) => (
          <div className="subject-card" key={index}>
            <div
              className="subject-icon"
              style={{ backgroundColor: subject.color + '20', color: subject.color }}
            >
              {subject.icon}
            </div>
            <h3 className="subject-title">{subject.title}</h3>
            <p className="subject-description">{subject.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subjects;
