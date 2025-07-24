import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { FaGripLines } from "react-icons/fa";
import { useSelector } from 'react-redux';

const Navbar = () => {
  const links = [
    {
    title : "Home",
    link :"/",
    },{
    title : "All Books",
    link :"/all-books",
    },{
    title : "Cart",
    link :"/cart",
    },{
    title : "Profile",
    link :"/profile",
    },{
    title : "Admin Profile",
    link :"/profile",
    }
  ];
  const isLoggedIn = useSelector((state)=>state.auth.isLoggedIn);
  const role = useSelector((state)=> state.auth.role)
  if(isLoggedIn === false){
    links.splice(2, 3);
  }
   if(isLoggedIn == true && role === 'user'){
    links.splice(4, 1);
  }
  if(isLoggedIn == true && role === 'admin'){
    links.splice(3, 1);
  }

  const [MobileNav, setMobileNav] = useState("hidden");

  return (
    <>
       <nav className='z-50 relative flex justify-between bg-gray-700 text-white px-8 py-2 items-center'>
      <Link to="/"className='flex items-center'>
        <img className='h-10 me-4 rounded-2xl' src="/logo.jpg" alt="logo" />
        <h1 className='text-2xl font-semibold'>KitabPasal</h1>
      </Link>
      <div className='nav-links-kitabpasal block md:flex items-center gap-10'>
        <div className='hidden md:flex gap-8'>
          {links.map((items,i)=>(
        <div className='flex items-center' key={i}> 
        {items.title === "Profile" || items.title ==="Admin Profile" ?
        <Link to={items.link} className='px-4 py-1 border-2 border-blue-400 rounded hover:bg-white hover:text-black transition-all duration-300' key={i}> {items.title}</Link> : <Link to={items.link} className='hover:text-blue-400 transition-all duration-300' key={i}> {items.title}</Link>}
        </div>
      ))}
      </div>
      <div className='hidden md:flex gap-2'>
      
{isLoggedIn === false && (<>
        <Link to='/login' className='px-4 py-1 border-2 border-blue-400 rounded hover:bg-white hover:text-black transition-all duration-300'>
        Log In</Link>
        <Link to='/signup' className='px-4 py-1 border-white bg-blue-400 rounded hover:bg-white hover:text-black transition-all duration-300'>
        Sign Up</Link>
        </>
      )}

      </div>
      <button className='md:hidden block text-white text-2xl hover:text-zinc-400' onClick={()=>MobileNav ==="hidden" ? setMobileNav("block") : setMobileNav("hidden")}>
        <FaGripLines />
        </button>
    </div>
    </nav>
    <div className={`${MobileNav} bg-zinc-800 h-screen absolute top-0 left-0 w-full z-40 flex flex-col items-center justify-start mt-14`}>

      {links.map((items,i)=>(
        <Link to={items.link} className='text-white text-xl mb-4 font-semibold hover:text-blue-400 transition-all duration-300' key={i} onClick={()=>MobileNav ==="hidden" ? setMobileNav("block") : setMobileNav("hidden")}> {items.title}</Link>
      ))}
       
      {isLoggedIn === false && <>
        <Link to='/login' className={`${MobileNav} px-4 py-1 mb-4 text-xl font-semibold text-white border-2 border-blue-400 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300`} onClick={()=>MobileNav ==="hidden" ? setMobileNav("block") : setMobileNav("hidden")}>Log In</Link>
      <Link to='/signup' className={`${MobileNav} px-3 py-1 mb-4 text-xl font-semibold text-white border-white bg-blue-400 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300`} onClick={()=>MobileNav ==="hidden" ? setMobileNav("block") : setMobileNav("hidden")}>Sign Up</Link>
      </>}
      </div>
    
    </>
  )
}

export default Navbar
