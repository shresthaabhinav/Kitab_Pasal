import React from 'react'
import Hero from '../components/Hero'
import RecentlyAdded from '../components/RecentlyAdded'

const Home = () => {
  return (
   <div className='bg-zinc-900 text-white px-10 py-8'>
    <Hero/>
    <hr />
    <RecentlyAdded/>
   </div>
  )
}

export default Home
