import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import './student.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCaretDown,faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { auth, doc, db, collection, getDoc, onAuthStateChanged, query,getDocs,signOut } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import AllStudents from './allStudents/allStudents';
export default function Studentdashboard() {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [courseData, setCourseData] = useState([]);
  const [profile, setProfile] = useState();
  const [name,setName] = useState()
  const [email,setEmail] = useState()
    useEffect(() => {
        const fetchData = async () => {
            setLoader(true)
            onAuthStateChanged(auth, async(user) => {
                if (user) {
                    const userDocRef = doc(db, 'students', user.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    if(userDocSnap.exists()){
                        const userData = userDocSnap.data();
                        setName(userData.studentName)
                        setEmail(userData.studentEmail)
                        setProfile(userData.studentProfile)
                        try {
                            const querySnapshot = await getDocs(collection(db, userData.selectedCourse));
                            const allCoursesData = [];
                            querySnapshot.forEach((doc) => {
                              const data = doc.data();
                              allCoursesData.push({ id: doc.id, ...data });
                            });
                            setCourseData(allCoursesData);
                            setLoader(false)
                          } catch (error) {
                            Swal.fire('Error fetching courses!', error.message, 'error');
                            setLoader(false)
                          }
                    }
                } else {
                  console.log('user not login');
                }
              });
        };
        fetchData();
    }, [])

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
    return (
        <div className='student-header'>
        <nav className="student-navbar">
          <div className="navbar-left">
            <h1 className='logo'>LMS</h1>
            {/* <img className='logo' src={logo} alt="" /> */}
          </div>
          <div className="navbar-right">
            <div className="user-info" onClick={toggleDropdown}>
                {
                    loader ? <div className='student-loader'><div className='loader'></div></div> :
                    <img className='user-profile' src={profile} alt="" />
                }
              <p className="student">STUDENT <span style={{ color: "black" }}><FontAwesomeIcon icon={faCaretDown} /></span></p>
  
              {
                courseData.map((data,index) => {
                  return (
                    <div key={index}>
                      {isDropdownOpen && (
                        <div className={`dropdown-content ${isDropdownOpen ? 'show' : ''}`}>
                          <div className='student-data'>
                            <div className='student-pic'>
                            <FontAwesomeIcon icon={faUser} />
                            </div>
                            <div className='student-email'>
                              <ul>
                                <li style={{textTransform : "capitalize"}} className='student-name'>{name}</li>
                                <li>{email}</li>
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
        {/* { */}
            {/* loader ? <div className='allstudent-loader'><div className='loader'></div></div> : */}
            <AllStudents />
        {/* } */}
      </div>
    )
}
