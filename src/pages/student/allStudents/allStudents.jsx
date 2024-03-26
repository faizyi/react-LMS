import React, { useEffect, useState } from 'react'
import '../student.css'
import Swal from 'sweetalert2'
import { auth, doc, db, collection, getDoc, onAuthStateChanged,getDocs, } from '../../../firebase/firebase';
export default function AllStudents() {
    const [studentData,setStudentData] = useState([])
    const [loader, setLoader] = useState(true);
    const [students,setStudent] = useState()
    const [courseName,setCouresName] = useState()
    const [teacher,setTeacher] = useState()
    const [days,setDays] = useState()
    useEffect(()=>{
        const fetchData = async () => {
            setLoader(true)
            onAuthStateChanged(auth, async(user) => {
                if (user) {
                    // setUser(user)
                    const userDocRef = doc(db, 'students', user.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    if(userDocSnap.exists()){
                        const userData = userDocSnap.data();
                        // setSelectedCourse(userData.selectedCourse)
                        try {
                            const querySnapshot = await getDocs(collection(db, userData.selectedCourse));
                            const allCoursesData = [];
                            querySnapshot.forEach((doc) => {
                              const data = doc.data();
                              setCouresName(data.studentCourse)
                              setTeacher(data.courseTeacher)
                              setDays(data.courseDays)
                              allCoursesData.push({ id: doc.id, ...data });
                            });
                            setStudentData(allCoursesData);
                            studentData.length > 1 ? setStudent("Student is Available") : setStudent("Students are Available")
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
    },[])

  return (
    <div className='allstudents-container'>
        {
            loader ? <div className='allstudent-loader'><div className='loader'></div><p>Loading.....</p></div> :
            <div>
                <div  className='heading-container'>
                <div className='heading'>
                    <h1>{courseName}</h1>
                    <h3>Course by {teacher}</h3>
                    <p>Available Days are {days}</p>
                </div>
                </div>

<div className='all-students'>

    <div className='heading'>
        <h2>{studentData.length} {students}</h2>
            </div>

            <div className='table-container'>
        <table>
            <thead>
                <tr>
                    <th>Students</th>
                    <th className='enrolled'>Enrolled Courses</th>
                    <th>City</th>
                </tr>
            </thead>
            <tbody>
                {
                    studentData.map((data,index)=>{
                        return (
                            <tr key={index}>
                            <td>
                                <div className='student-info'>
                                    <div className='student-pic'><img src={data.studentProfile} alt="" /></div>
                                    <div><p style={{textTransform : "capitalize"}} className='name'>{data.studentName}</p><p className='email'>{data.studentEmail}</p></div>
                                </div>
                            </td>
                            <td className='enrolled'>{data.studentCourse}</td>
                            <td className='city'>{data.city}</td>
                        </tr>
                        )
                    })
                }
            </tbody>
        </table>
        </div>

        </div>
            </div>
        }
        
    </div>
  )
}
