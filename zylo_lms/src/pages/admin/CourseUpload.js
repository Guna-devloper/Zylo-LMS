// src/pages/admin/CourseUpload.js
import React, { useState } from "react";
import { db, storage } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CourseUpload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructor, setInstructor] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      if (!thumbnail) return alert("Please upload a thumbnail image");

      // Upload thumbnail to Firebase Storage
      const storageRef = ref(storage, `thumbnails/${thumbnail.name}`);
      const snapshot = await uploadBytes(storageRef, thumbnail);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Save course details to Firestore
      await addDoc(collection(db, "courses"), {
        title,
        description,
        instructor,
        thumbnail: downloadURL,
        createdAt: serverTimestamp()
      });

      alert("Course uploaded successfully!");
      setTitle("");
      setDescription("");
      setInstructor("");
      setThumbnail(null);
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="container">
      <h2>Upload Course</h2>
      <form onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Course Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Instructor Name"
          value={instructor}
          onChange={(e) => setInstructor(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files[0])}
          required
        />
        <button type="submit">Upload Course</button>
      </form>
    </div>
  );
};

export default CourseUpload;
