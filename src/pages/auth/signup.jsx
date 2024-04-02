import React, { useEffect, useRef, useState,useContext } from 'react'
import Swal from 'sweetalert2'
import './auth.css'
// import coursesCollection from '../../context/context';
import { auth, createUserWithEmailAndPassword, doc, setDoc, db,addDoc,
collection, getDocs, onAuthStateChanged,storage, ref,uploadBytesResumable, getDownloadURL,
query, orderBy, limit} from '../../firebase/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
export default function Signup() {
  const cities = ["Karachi", "Lahore", "Faisalabad", "Rawalpindi", "Multan", "Gujranwala", "Hyderabad", "Peshawar", "Quetta", "Islamabad", /* Add more cities as needed */];
  const navigate = useNavigate()
  const[firstName,setFirstName] = useState()
  const[lastName,setLastName] = useState()
  const[email,setEmail] = useState()
  const[password,setPassword] = useState()
  const passwordRef = useRef(null);
  const [course,setCourse] = useState();
  const [gender,setGender] = useState();
  const [city,setCity] = useState();
  const profileRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showIcon, setShowIcon] = useState({
    visibility : "hidden"
  });
  const [loader, setLoader] = useState(false);
  const [loading,setLoading] = useState(false)
  const [allCourses, setAllCourses] = useState([])
  const courses = [];
  const allCoursesData = [];
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
          const querySnapshot = await getDocs(collection(db, `Teachers`));
          querySnapshot.forEach((doc) => {
              const data = doc.data()
              allCoursesData.push({id : doc.id, ...data})
          });
          setAllCourses(allCoursesData)
          setLoading(false)
          }
          fetchData()
        }, [])
  //student signup
  const handleSubmit = (e) => {
    setLoader(true);
    e.preventDefault();
    const studentProfile = profileRef.current.files[0].name
    const storageRef = ref(storage, `studentProfile/${studentProfile}`);
    const uploadTask = uploadBytesResumable(storageRef, profileRef.current.files[0]);
    uploadTask.on('state_changed', 
  (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    // Handle unsuccessful uploads
  }, 
  () => {
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      allCourses.forEach((items)=>{
        if(course == items.courseName){
          const studentData={
            studentName: firstName + "  " + lastName,
            studentEmail: email,
            studentPass: password,
            studentCourse: course,
            gender: gender,
            city : city,
         }
         createUserWithEmailAndPassword(auth, studentData.studentEmail, studentData.studentPass)
         .then(async (userCredential) => {
           const student = userCredential.user;
           await addDoc(collection(db, course), {
             ...studentData,
             studentProfile : downloadURL,
             type: "student",
             courseTeacher : items.teacherName,
             courseDays : items.courseDays,
             id : student.uid,
           });
           await setDoc(doc(db, "students", student.uid),{
             selectedCourse: course,
             studentProfile : downloadURL,
             studentName: firstName + "  " + lastName,
             studentEmail: email,
            },{merge : true})
            setLoader(false)
            navigate("/studentdash");
          })
         .catch((error) => {
           const errorCode = error.code;
           const errorMessage = error.message;
           setLoader(false)
           Swal.fire("This Email Alredy Exist!");
         });
        }
      })
    });
  }
);

  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    if (passwordRef.type === "password") {
      passwordRef.type = "text";
    } else {
      passwordRef.type = "password";
    }
  };
  return (
    <div className='signup-auth'>
      {
        loader ? <div className='loader-container'><div className='loader'></div><p>Loading.....</p></div> :
          <div className="signup-container">
            <div className="signup-header">
              <h2>Admission Form</h2>
            </div>
            <form onSubmit={handleSubmit} className="signup-form">
              <div>
                <label htmlFor="firstname">First Name *</label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  placeholder="Enter your First Name"
                  required
                  onChange={(event)=>setFirstName(event.target.value)}
                  value={firstName}
                />
              </div>
              <div>
                <label htmlFor="lastname">Last Name *</label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  placeholder="Enter your Last Name"
                  required
                  onChange={(event)=>setLastName(event.target.value)}
                  value={lastName}
                />
              </div>
              <div>
                <label htmlFor="email">Enter Your Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your Email"
                  required
                  onChange={(event)=>setEmail(event.target.value)}
                  value={email}
                />
              </div>
              <div>
                <label htmlFor="password">Create Password *</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Enter your Password"
                    required
                    onChange={(event)=>setPassword(event.target.value)}
                    onInput={()=>setShowIcon({visibility : passwordRef.current.value ? "visible" : "hidden"})}
                    value={password}
                    ref={passwordRef}
                  />
                  <span style={showIcon} className="toggle-password" onClick={togglePasswordVisibility}>
                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                  </span>
                </div>
              </div>
              <div className='allCourses'>
                <label>Course *</label>
                <select value={course} name="course" required onChange={(event)=>setCourse(event.target.value)}>
                  <option  value='Select Course'disabled selected  >Select Course</option>
                  {
                    loading ? (<option value="loading.....">Loading.....</option>) : (
                        allCourses.map((items,index) => {
                          return (<option key={index} value={items.courseName}>{items.courseName}</option>)
                        })
                      
                    )
                  }
                </select>
              </div>
              <div className='gender'>
                <label>Gender *</label>
                <select name="gender" value={gender} onChange={(event) => setGender(event.target.value)} required>
                  <option  value='Select Gender' disabled selected >Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className='cities'>
                <label>City *</label>
                <select name="city" value={city} required onChange={(event)=>setCity(event.target.value)}>
                  <option value='' disabled selected >Select City</option>
                  {
                    cities.map((city,index) => {
                      return (
                        <option key={index} value={city}>{city}</option>
                      )
                    })
                  }
                </select>
              </div>
              <div className='profile'>
                <label>Student Picture *</label>
                <input type="file" accept="image/*" required ref={profileRef} />
              </div>
              <button type="submit">Submit</button>
            </form>
            <div className="form-footer">
              <span>Already have an account?</span>
              <Link to={'/login'}>Login</Link>
            </div>
          </div>
      }
    </div>

  )
}
