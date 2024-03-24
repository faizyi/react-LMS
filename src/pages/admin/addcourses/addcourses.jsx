import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
export default function AddCourses() {
  return (
    <div className='add-courses-btn'>
        <div className='btn'>
        <FontAwesomeIcon icon={faPlus} />
        <button>Add Course</button>
        </div>
    </div>
  )
}





