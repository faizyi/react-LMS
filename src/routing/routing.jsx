import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from '../pages/auth/login'
import Signup from '../pages/auth/signup'
import { auth,onAuthStateChanged } from '../firebase/firebase';
import AdminDashboard from '../pages/admin/admin dashboard/admindashboard';
import Studentdashboard from '../pages/student/studentDashboard';
export default function Routing() {
  const [loader, setLoader] = useState(true);
  const [user, setUser] = useState(false)
  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(true)
        setLoader(false)
      } else {
        console.log('user not login');
        setUser(false)
        setLoader(false)
      }
    });
  },[])
  return (
    <div>
      {
        loader ?  <div className='loader-container'><div className='loader'></div><p>Loading.....</p></div> :
        <div>
            <Router>
          {/* <AdminDashboard> */}
            <Routes>
                <Route path='/login' element={<Login/>}/>
                <Route path='/signup' element={<Signup/>}/>
                <Route path='/admin' element={<AdminDashboard/>}/>
                <Route path='/studentdash' element={<Studentdashboard/>}/>
                {/* <Route path='/studentform' element={<Admissionform/>}/> */}
            </Routes>
      {/* </AdminDashboard> */}
            </Router>
        </div>
      }
    </div>
  )
}
