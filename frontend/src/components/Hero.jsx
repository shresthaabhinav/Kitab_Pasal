import React from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <>
    <div className='h-[75vh] flex flex-col md:flex-row items-center justify-center'>
      <div className='w-full mb-12 md:mb-0 lg:w-4/6 flex flex-col items-center lg:items-start justify-center order-2 lg:order-1'>
      <h1 className='text-4xl lg:text-6xl font-semibold text-white text-center lg:text-left'>Discover Your Next Great Read</h1>
      <p className='mt-4 text-xl text-white text-center lg:text-left'>Uncover captivating stories enriching knowledge and endless inspiration in our curated collection of books.</p>

     <div className='mt-8'>
         <Link to="/all-books" className='text-white text-sm lg:text-2xl font-semibold border border-white px-10 py-3 hover:bg-zinc-800 rounded-full'>Discover Books</Link>
     </div>
      </div>
      <div className ='w-full lg:w-2/6 flex items-start justify-end pt-2 pr-10 order-1 lg:order-2'>
      <img className="w-full max-w-sm object-contain" src="/hero.png" alt="Hero" />
      </div>
    </div>
    </>
  )
}

export default Hero
