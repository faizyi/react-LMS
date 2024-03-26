import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import './style.css'
import logo from '../../../assets/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCaretDown,faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { auth, onAuthStateChanged, signOut, doc, getDoc,db } from '../../../firebase/firebase';
import { useNavigate } from 'react-router-dom';
export default function Navbar() {
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [adminData, setAdminData] = useState([]);
  const [loader, setLoader] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleLogout = async () => {
    await signOut(auth).then(() => {
      Swal.fire("Sign-out successful!");
      navigate("/login")
    })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    onAuthStateChanged(auth, async(user) => {
      if (user) {
        const adminId = user.uid
        const adminData = [];
        const docRef = doc(db, "Admin", adminId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          adminData.push(docSnap.data())
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }
        setAdminData(adminData)
      } else {
        console.log("User is signed out");
      }
    });
  }, [])
  return (
    <div className='header'>
      {/* {
        loader ? <div className='loader-container'><div className='loader'></div></div> : */}
      <nav className="navbar">
        <div className="navbar-left">
          <h1 className='logo'>LMS</h1>
          {/* <img className='logo' src={logo} alt="" /> */}
        </div>
        <div className="navbar-right">
          <div className="user-info" onClick={toggleDropdown}>
            <span className='user-picture'><FontAwesomeIcon icon={faUser} /></span>
            <p className="admin">Administator <span style={{ color: "black" }}><FontAwesomeIcon icon={faCaretDown} /></span></p>

            {
              adminData.map((data) => {
                return (
                  <div key={data}>
                    {isDropdownOpen && (
                      <div className={`dropdown-content ${isDropdownOpen ? 'show' : ''}`}>
                        <div className='admin-data'>
                          <div className='admin-pic'>
                          <FontAwesomeIcon icon={faUser} />
                          </div>
                          <div className='admin-email'>
                            <ul>
                              <li className='admin-name'>{data.name}</li>
                              <li>{data.email}</li>
                            </ul>
                          </div>
                        </div>
                        <div className='logout-btn'>
                        <FontAwesomeIcon icon={faRightFromBracket} />
                        <button onClick={handleLogout}>Logout</button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            }
          </div>
        </div>
      </nav>
      {/* } */}
    </div>
  )
}
