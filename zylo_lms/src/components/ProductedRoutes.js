import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("User:", user);
  
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          console.log("User Role:", userSnap.data().role);
          setUserRole(userSnap.data().role);
        } else {
          console.log("No such user in Firestore!");
        }
      } else {
        console.log("No user logged in");
      }
  
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);
  

  if (loading) return <div>Loading...</div>;

  if (userRole !== role) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
