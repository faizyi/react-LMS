import React, { useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2'
import './auth.css'
import { auth, signInWithEmailAndPassword, onAuthStateChanged, doc, getDoc, db,collection,getDocs } from '../../firebase/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
export default function Login() {
  const navigate = useNavigate()
  const [loader, setLoader] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [coursesName,setCoursesName]  = useState(null);
  useEffect(() => {
    const fetchData = async () => {
          const querySnapshot = await getDocs(collection(db, `Teachers`));
          querySnapshot.forEach((doc) => {
              const data = doc.data()
              setCoursesName(data.courseName)              
          });
          }
          fetchData()
        }, [])
  const handleSubmit = (e) => {
    setLoader(true);
    e.preventDefault();
    const emailValue = emailRef.current.value
    const passValue = passwordRef.current.value
    signInWithEmailAndPassword(auth, emailValue, passValue)
      .then( (userCredential) => {
        const userUid = userCredential.user.uid;
        typeCheck(userUid);
      })
      // setLoader(false)
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setLoader(false)
        Swal.fire("Something Wrong!");
      });
  };
  //typeCheck
  const typeCheck = async(uid) => {  
    // const studentRef = doc(db, "Mobile Application", uid);
    // const studentSnap = await getDoc(studentRef); 
    // if (studentSnap.exists()) {
    //   navigate("/studentdash");
    // } else {
      const adminRef = doc(db, "Admin", uid);
      const adminSnap = await getDoc(adminRef);
      if (adminSnap.exists()) {
        navigate("/admin");
      } else {
        navigate("/studentdash") 
      }
    // }
    setLoader(false); 
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    const passwordInput = document.getElementById("password");
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
    } else {
      passwordInput.type = "password";
    }
  };
  return (
    <div className='login-auth'>
      {
        loader ? <div className='loader-container'><div className='loader'></div><p>Loading.....</p></div> :
          <div className="login-container">
            <div className="login-header">
              <h2>Login</h2>
            </div>
            <form onSubmit={handleSubmit} className="login-form">
              <label htmlFor="username">Email *</label>
              <input
                type="email"
                id="username"
                name="username"
                placeholder="Enter your Email"
                ref={emailRef}
                // onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label htmlFor="password">Password *</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your Password"
                  ref={passwordRef}
                  // maxLength={8}
                  // onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="toggle-password" onClick={togglePasswordVisibility}>
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </span>
              </div>
              <button type="submit">Login</button>
            </form>
            <div className="form-footer">
              <span>Don't have an account?</span>
              <Link to={'/signup'}>Sign Up</Link>
            </div>
          </div>
      }
    </div>

  )
}
