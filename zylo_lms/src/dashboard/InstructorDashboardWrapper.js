import React from 'react';
import InstructorDashboard from './InstructorDashboard';
import { auth } from '../firebase';
function InstructorDashboardWrapper() {
const currentUser = auth.currentUser;
  if (!currentUser) {
    return <div>Loading Instructor Dashboard...</div>;
  }

  return<InstructorDashboard userId={auth.currentUser?.uid} />
}

export default InstructorDashboardWrapper;
