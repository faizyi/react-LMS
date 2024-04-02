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
  const [showIcon, setShowIcon] = useState({
    visibility : "hidden"
  });
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
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setLoader(false)
        Swal.fire("Something Wrong!");
      });
  };
  //typeCheck
  const typeCheck = async(uid) => {  
      const adminRef = doc(db, "Admin", uid);
      const adminSnap = await getDoc(adminRef);
      if (adminSnap.exists()) {
        navigate("/admin");
      } else {
        navigate("/studentdash") 
      }
    setLoader(false); 
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    if (passwordRef.type === "password") {
      passwordRef.type = "text";
    } else {
      passwordRef.type = "password";
    }
  };
  return (
    <div className='login-auth'>
      {
        loader ? <div className='loader-container'><div className='loader'></div></div> :
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
                required
              />
              <label htmlFor="password">Password *</label>
              <div className="password-input-container">
                <input
                onInput={()=>setShowIcon({visibility : passwordRef.current.value ? "visible" : "hidden"})}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your Password"
                  ref={passwordRef}
                  required
                />
                <span style={showIcon}  className="toggle-password" onClick={togglePasswordVisibility}>
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
