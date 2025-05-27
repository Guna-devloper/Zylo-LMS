import React, { useEffect, useState } from 'react';
import { db, storage, auth } from '../../firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { Link } from 'react-router-dom';

const InstructorCourses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const q = query(collection(db, 'courses'), where('createdBy', '==', auth.currentUser.uid));
      const snapshot = await getDocs(q);
      const courseData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(courseData);
    };

    fetchCourses();
  }, []);

  const deleteCourse = async (course) => {
    if (window.confirm(`Delete "${course.title}"?`)) {
      await deleteDoc(doc(db, 'courses', course.id));

      // Delete files from storage
      const deleteFile = async (url) => {
        const fileRef = ref(storage, url);
        try {
          await deleteObject(fileRef);
        } catch (err) {
          console.warn("Couldn’t delete file from storage:", err);
        }
      };

      await Promise.all([
        deleteFile(course.videoURL),
        deleteFile(course.thumbnailURL),
        deleteFile(course.pdfURL),
      ]);

      setCourses(courses.filter(c => c.id !== course.id));
    }
  };

  return (
    <div className="container mt-4">
      <h3>🎓 My Uploaded Courses</h3>
      {courses.length === 0 && <p>No courses uploaded yet.</p>}
      <div className="row">
        {courses.map(course => (
          <div className="col-md-6 mt-4" key={course.id}>
            <div className="card">
              <img src={course.thumbnailURL} className="card-img-top" alt="Thumbnail" />
              <div className="card-body">
                <h5 className="card-title">{course.title}</h5>
                <p>{course.description}</p>
                <p><strong>Category:</strong> {course.category}</p>
                <a href={course.videoURL} target="_blank" rel="noreferrer">🎬 View Video</a><br />
                <a href={course.pdfURL} target="_blank" rel="noreferrer">📄 View PDF</a><br />

                <div className="d-flex mt-3">
                  <Link to={`/edit-course/${course.id}`} className="btn btn-outline-dark me-2">Edit</Link>
                  <button className="btn btn-danger" onClick={() => deleteCourse(course)}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructorCourses;
