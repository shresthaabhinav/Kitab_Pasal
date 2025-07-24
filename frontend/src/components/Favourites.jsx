import axios from 'axios';
import React, { useEffect, useState } from 'react'
import BookCard from './BookCard';

const Favourites = () => {
  const [FavouriteBooks, setFavouriteBooks] = useState([]);
  const headers = {
    id: localStorage.getItem("id"),
    authorization : `Bearer ${localStorage.getItem("token")}`,
  };

    useEffect(() =>{
      const fetch = async () =>{
        const response = await axios.get("http://localhost:1000/api/v1/get-favourite-books",
          {headers}
        );
        setFavouriteBooks(response.data.data)
      }
      fetch()
    },[FavouriteBooks]);

     return (
     <div>{FavouriteBooks.length > 0 &&
      <div className='w-full flex justify-center items-center text-white text-4xl mb-4'>
        Favourites 
      </div>
}
      <div>
       {FavouriteBooks.length === 0 &&
        (
        
        <div className='text-4xl font-semibold text-zinc-400 h-[70vh] w-full flex items-center justify-center'>No Favourite Books</div>)}
      </div>
    <div className='w-full my-0 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 '>
     
      {FavouriteBooks && FavouriteBooks.map((items, i)=>(
        <div key={i}>
        <BookCard data={items} favourite={true} /></div>
        ))}
    </div>
    </div>
  )
}

export default Favourites
