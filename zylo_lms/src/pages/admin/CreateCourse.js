import React, { useState } from 'react';
import { db, storage, auth } from '../../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

const CreateCourse = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);
  const [pdf, setPDF] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !description || !category || !thumbnail || !video || !pdf) {
      return setMessage('Please fill in all fields and upload all files');
    }

    setLoading(true);
    try {
      // 1. Upload all files to Firebase Storage
      const uid = auth.currentUser.uid;

      const uploadFile = async (file, folder) => {
        const fileRef = ref(storage, `${folder}/${Date.now()}-${file.name}`);
        const uploadTask = uploadBytesResumable(fileRef, file);
        await uploadTask;
        return await getDownloadURL(fileRef);
      };

      const [thumbnailURL, videoURL, pdfURL] = await Promise.all([
        uploadFile(thumbnail, 'thumbnails'),
        uploadFile(video, 'videos'),
        uploadFile(pdf, 'pdfs'),
      ]);

      // 2. Save course info to Firestore
      await addDoc(collection(db, 'courses'), {
        title,
        description,
        category,
        thumbnailURL,
        videoURL,
        pdfURL,
        createdBy: uid,
        createdAt: serverTimestamp(),
      });

      setMessage('✅ Course created successfully!');
      setTimeout(() => navigate('/instructor-dashboard'), 1500);
    } catch (error) {
      console.error('Error uploading course:', error);
      setMessage('❌ Failed to create course. Try again.');
    }
    setLoading(false);
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 600 }}>
      <h3>📚 Create a New Course</h3>
      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleUpload}>
        <div className="form-group mt-3">
          <label>Course Title</label>
          <input className="form-control" type="text" value={title}
            onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="form-group mt-3">
          <label>Description</label>
          <textarea className="form-control" rows="3" value={description}
            onChange={(e) => setDescription(e.target.value)} required />
        </div>

        <div className="form-group mt-3">
          <label>Category</label>
          <input className="form-control" type="text" value={category}
            onChange={(e) => setCategory(e.target.value)} required />
        </div>

        <div className="form-group mt-3">
          <label>Thumbnail Image</label>
          <input className="form-control" type="file" accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])} required />
        </div>

        <div className="form-group mt-3">
          <label>Course Video</label>
          <input className="form-control" type="file" accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])} required />
        </div>

        <div className="form-group mt-3">
          <label>PDF Material</label>
          <input className="form-control" type="file" accept="application/pdf"
            onChange={(e) => setPDF(e.target.files[0])} required />
        </div>

        <button className="btn btn-dark mt-4 w-100" type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Create Course'}
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
