// Home.jsx

import React, { useEffect, useState } from 'react';
import './home.css';
import video from '../../assets/video.mp4';
import { Link,useNavigate } from 'react-router-dom';
import Login from '../auth/login';

export default function Home() {
  const navigate = useNavigate()
  const [loader, setLoader] = useState(false);
  const date = new Date();
  const year = date.getFullYear();
  function clickLogin(){
    setLoader(true)
    setTimeout(()=>{
      navigate('/login')
    },2000) 
  }
  function clickSignup(){
    setLoader(true)
    setTimeout(()=>{
      navigate('/signup')
    },2000) 
  }
  
  return (
    <div className='home'>
      {
        loader ? <div className='loader-container'><div className='loader'></div></div> :
        (
          <section className="hero">
          <div className="video-container">
            <header className="home-header">
              <marquee className='logo' scrollamount="20" behavior="" direction="left">
              LEARNING MANAGEMENT SYSTEM</marquee>
            </header>
            <video autoPlay loop muted>
              <source src={video} type="video/mp4" />
            </video>
            <div className="overlay"></div>
            <div className="content">
              <h1>Welcome to Our Learning Management System</h1>
              <p>Empower your learning experience with our comprehensive and 
              interactive courses. Start your journey towards knowledge and success today.</p>
              <div className="buttons">
                <button onClick={clickLogin} className="btn">Login</button>
                <button onClick={clickSignup} className="btn btn-secondary">Sign Up</button>
              </div>
            </div>
          </div>
          <footer className="footer">
            <p>&copy; {year} Learning Management System. All rights reserved.</p>
          </footer>
        </section>
        )
      }

    </div>
  );
}
