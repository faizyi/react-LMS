import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom'
import Login from '../pages/auth/login'
import Signup from '../pages/auth/signup'
import { auth,onAuthStateChanged } from '../firebase/firebase';
import AdminDashboard from '../pages/admin/admin dashboard/admindashboard';
import Studentdashboard from '../pages/student/studentDashboard';
import Home from '../pages/home/home';
export default function Routing() {
  const [loader, setLoader] = useState(true);
  const [user, setUser] = useState(false)
  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoader(false);
    });

    return () => unsubscribe();
  },[])
  // const determineUserRole = (user) => {
  //   if (user && user.email === 'admin@gmail.com') {
  //     return 'admin';
  //   } else {
  //     return 'student';
  //   }
  // };
  return (
    <div>
      {
        loader ?  <div className='loader-container'><div className='loader'></div></div> :
        <div>
            <Router>
            <Routes>
                {/* <Route path='/' element={(<Home />)}/> */}
                <Route path='/react-LMS' element={<Home/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/signup' element={<Signup/>}/>
                <Route path='/admin' element={<AdminDashboard/>}/>
                <Route path='/studentdash' element={<Studentdashboard/>}/>
                {/* <Route path='/studentform' element={<Admissionform/>}/> */}
            </Routes>
            </Router>
        </div>
      }
    </div>
  )
}
