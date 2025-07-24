import React, { useEffect, useState } from 'react'
import axios from 'axios'
import BookCard from './BookCard';
import Loader from './Loader';

const RecentlyAdded = () => {

    const [Data, setData] = useState();

    useEffect(()=>{
        const fetch = async()=>{
            const response = await axios.get(
                "http://localhost:1000/api/v1/get-recent-books"
            )
            setData(response.data.data)
        }
        fetch();
    },[]);
  return (
    <div className='mt-4 px-4'>
      <h4 className='lg:text-3xl text-white sm:text-xl'>Recently Added Books</h4>
     {!Data && (
        <div className='flex items-center justify-center my-8'>
            <Loader/>{""}
     </div>
    )}
      <div className='my-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 '>
       
        {Data && Data.map((items,i)=>(
            <div className='hover:scale-105 transition duration-300' key={i}>
            <BookCard data={items}/>{""}
        </div>
    ))}
      </div>

    </div>
  )
}

export default RecentlyAdded
