import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";

const BookCard = ({ data, favourite }) => {

  const headers = {
    id:localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
    bookid: data._id,
  }
  const handleRemoveBook = async () => {
    const response = await axios.put("http://localhost:1000/api/v1/delete-book-from-favourites",
      {},{headers}
    )
    alert(response.data.message)
  }
  return (
    <>
      <div className='bg-zinc-700 rounded p-4 flex flex-col'>
        <Link to={`/view-book-details/${data._id}`}>
          <div>
            <div className="bg-zinc-900 rounded flex items-center justify-center">
              <img src={data.url} alt="" className="h-[48vh]" />
            </div>
            <h2 className="mt-4 text-xl text-white font-semibold truncate">
              {data.title}
            </h2>
            <p className="mt-2 text-zinc-200 font-semibold">{data.author}</p>
            <p className="mt-2 text-zinc-200 font-semibold">Rs {data.price}</p>
          </div>
        </Link>
        {favourite && (
          <button
            className="bg-red-400 px-4 py-2 rounded-2xl border border-black text-zinc-800 mt-2 hover:scale-105 hover:bg-red-500 transition duration-300 cursor-pointer"
            onClick={handleRemoveBook}>
              Remove
          </button>
        )}
      </div>
    </>
  );
};

export default BookCard;
