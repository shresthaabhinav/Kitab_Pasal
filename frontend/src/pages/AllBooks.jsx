import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import axios from "axios";
import BookCard from "../components/BookCard";

const AllBooks = () => {
  const [Data, setData] = useState();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        "http://localhost:1000/api/v1/get-all-books"
      );
      setData(response.data.data);
    };
    fetch();
  }, []);

  const filteredBooks =
    Data &&
    Data.filter((book) => {
      const searchLower = search.toLowerCase();
      return (
        book.title.toLowerCase().includes(searchLower) ||
        (book.author && book.author.toLowerCase().includes(searchLower))
      );
    });

  return (
    <div className="bg-zinc-900 h-auto px-12 py-8">
      <div className=''>
      <h4 className="lg:text-3xl text-white sm:text-xl">All Books</h4>
      <div className="my-4">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md p-2 rounded bg-zinc-800 text-white border border-zinc-700"
        />
      </div>
      </div>
      {!Data && (
        <div className="w-full h-screen flex items-center justify-center">
          <Loader />
          {""}
        </div>
      )}
      <div className="my-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredBooks &&
          filteredBooks.map((items, i) => (
            <div className="hover:scale-105 transition duration-300" key={i}>
              <BookCard data={items} />
              {""}
            </div>
          ))}
      </div>
    </div>
  );
};

export default AllBooks;
