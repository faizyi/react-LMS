import React, { useEffect, useState } from 'react'
import teacherNameAPI from '../../../context/context'
import Swal from 'sweetalert2'
import Navbar from '../components/navbar'
import '../admin.css';
import { auth,collection, addDoc,db,onAuthStateChanged, storage, ref, uploadBytesResumable, getDownloadURL } from '../../../firebase/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark} from '@fortawesome/free-solid-svg-icons';
import AddCourses from '../addcourses/addcourses'
import { useRef } from 'react';
import AvailableCourses from '../availableCourses/availableCourses';
export default function AdminDashboard() {
    const [loader, setLoader] = useState(false);
    const coursePicRef = useRef(null);
    const [courseName,setCourseName] = useState('')
    const [teacherName,setTeacherName] = useState('')
    const [id,setId] = useState(null);
    const [showCourseBox, setShowCourseBox] = useState(false);
    const [active,setIsActive] = useState(false);
    const [selectedDays, setSelectedDay] = useState('');
    // console.log(value);
    const addcourse=()=>{
        setShowCourseBox(!showCourseBox)
        setIsActive(true)
        // setAnimate(true);
    }
    const cancel=()=>{
        setShowCourseBox(false)
        setIsActive(false)
        // daysRef.current.value = ''
    }
    const handleDayChange = (event) => {
        setSelectedDay(event.target.value);
    };
    const addCourseDetails = async (e) => {
        setLoader(true)
        e.preventDefault();
        const courseImg = coursePicRef.current.files[0].name
        const storageRef = ref(storage, `courseImages/${courseImg}`);
        const uploadTask = uploadBytesResumable(storageRef, coursePicRef.current.files[0]);
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        setLoader(true)
                        break;
                    case 'running':
                        console.log('Upload is running');
                        setLoader(true)
                        break;
                }
            },
            (error) => {
                // Handle unsuccessful uploads
                setLoader(false)
                Swal.fire("Handle unsuccessful uploads!");
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
                    console.log('File available at', downloadURL);
                    // setURL(downloadURL)

                    try {
                        const docRef = await addDoc(collection(db,`Teachers`), {
                            courseName : courseName,
                            courseImg : downloadURL,
                            teacherName : teacherName,
                            courseDays : selectedDays
                        });
                        setLoader(false)
                        setShowCourseBox(false)
                        console.log("Document written with ID: ");
                      } catch (e) {
                        console.error("Error adding document: ", e);
                        setLoader(false)
                      }
                });
            }
        );
    }
  return (
    <div className='container'>
        {/* <teacherNameAPI.Provider value={{teacherName,setTeacherName: handleSetTeacherName}}>
        {children}
        </teacherNameAPI.Provider> */}
        <div className='admin-navbar'>
            <Navbar/>
        </div>

        <div className='admin-dash-container'>
            <div className='heading'>
                <h1>Dashboard</h1>
                <p>Welcome to Learning Management Dashboard.</p>
            {/* AvailableCourses */}
            </div>

            <div className='add-courses' onClick={addcourse}>
                <AddCourses />
            </div>
        </div>

                 {
            showCourseBox ? (       
             <div className={`course-box-container ${active ? "display" : "course-box-container"}`}>

                {
                    loader ? <div className='loader-container'><div className='loader'></div><p>Loading.....</p></div> :
                    
            <div className='course-box'>
            <div className='heading'>
                <h1>Add New Course</h1>
                <span onClick={cancel}><FontAwesomeIcon icon={faXmark} /></span>
            </div>

            <form onSubmit={addCourseDetails} className="course-form">
              <label htmlFor="coursename">Course Name</label>
              <input
                type="text"
                id="coursename"
                name="coursename"
                placeholder="e.g. Web Development"
                required
                onChange={(event)=>setCourseName(event.target.value)}
              />
              <label htmlFor="Coursethumbnail">Course thumbnail</label>
              <input
                type="file"
                id="Coursethumbnail"
                name="Coursethumbnail"
                required
                accept="image/*"
                ref={coursePicRef}
              />
              <label htmlFor="teachername">Teacher Name</label>
              <input
                type="text"
                id="teachername"
                name="teachername"
                placeholder="Enter Teacher Name"
                required
                onChange={(event)=>setTeacherName(event.target.value)}
              />
              <label htmlFor="weeks">Select Days of Week</label>
              <select  name="days" id="days"onChange={handleDayChange} >
                <option disabled value='Select' selected>Select</option>
                <option value="Monday , Wednesday & Friday">Monday , Wednesday & Friday</option>
                <option value="Tuesday , Thursday & Saturday">Tuesday , Thursday & Saturday</option>
              </select>
              <br />
               <button type='submit'>Save</button>
               </form>
            </div>
                }

        </div>) 
        : ("")
        }
        {
            !loader &&( <div className='available-courses'><AvailableCourses/></div>
           )
        }


    </div>
  )
}
