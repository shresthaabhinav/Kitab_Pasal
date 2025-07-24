import React, { useEffect, useState } from 'react'
import Loader from '../components/Loader'
import axios from 'axios';
import BookCard from '../components/BookCard'


const AllBooks = () => {

   const [Data, setData] = useState();

    useEffect(()=>{
        const fetch = async()=>{
            const response = await axios.get(
                "http://localhost:1000/api/v1/get-all-books"
            )
            setData(response.data.data)
        }
        fetch();
    },[]);

  return (
    <div className='bg-zinc-900 h-auto px-12 py-8'>
      <h4 className='lg:text-3xl text-white sm:text-xl'>All Books</h4>
           {!Data && (
              <div className='w-full h-screen flex items-center justify-center'>
                  <Loader/>{""}
           </div>
          )}
            <div className='my-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
             
              {Data && Data.map((items,i)=>(
                  <div className='hover:scale-105 transition duration-300' key={i}>
                  <BookCard data={items}/>{""}
              </div>
          ))}
            </div>
      
    </div>
  )
}

export default AllBooks
