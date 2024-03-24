import React, { useEffect, useState,useContext  } from 'react'
import Swal from 'sweetalert2'
import { auth,collection,getDocs,db,onAuthStateChanged, } from '../../../firebase/firebase';
export default function AvailableCourses() {
  
  // const {teacherName} = useContext(teacherNameAPI)
  const [loader, setLoader] = useState(false);
  const [allCourses,setAllCourses]= useState([])
  useEffect(() => {
    const fetchData = async () => {
      setLoader(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'Teachers'));
        const allCoursesData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          allCoursesData.push({ id: doc.id, ...data });
        });
        setAllCourses(allCoursesData);
        setLoader(false);
      } catch (error) {
        setLoader(false);
        Swal.fire('Error fetching courses!', error.message, 'error');
      }
    };
    fetchData();
  }, []);
  return (
    <div className='all-courses'>

        <div className='heading'>
        <h1>Available Courses</h1>
      </div>
      {
        loader ? <div className='all-courses-loader'><div className='loader'></div></div> :
        <div>
          

        <div>
          {
        allCourses.map((items)=>{
          return(
            <div key={items} className="all-courses-card">
            <img src={items.courseImg} alt=""/>
            <h3>{items.courseName}</h3>
            <p>Website Design & Develop the website with web applications
            Website Design & Develop the website with web applications
            </p>
          </div>
          )
        })
      }
        </div>
        </div>
      }

    </div>
  )
}
