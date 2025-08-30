import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GrLanguage } from "react-icons/gr";
import { FaHeart, FaShoppingCart, FaEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import Recommendations from "./Recommendations";

const ViewBookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [Data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isrole = useSelector((state) => state.auth.role);

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        console.log("Fetching book ID:", id);
        const response = await axios.get(
          `http://localhost:1000/api/v1/get-book-by-id/${id}`
        );
        console.log("Book API response:", response.data);
        setData(response.data.data);
        window.scrollTo(0, 0); // Scroll to top on new book
      } catch (error) {
        console.error("Error fetching book data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
    bookid: id,
  };

  const handleFavourite = async () => {
    try {
      const response = await axios.put(
        "http://localhost:1000/api/v1/add-book-to-favourites",
        {},
        { headers }
      );
      alert(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCart = async () => {
    try {
      const response = await axios.put(
        "http://localhost:1000/api/v1/add-book-to-cart",
        {},
        { headers }
      );
      alert(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBook = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:1000/api/v1/delete-book",
        { headers }
      );
      alert(response.data.message);
      navigate("/all-books");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading || !Data) {
    return (
      <div className="h-screen bg-zinc-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-zinc-900 px-4 md:px-12 py-8">
      <div className="w-full">
        {/* Flex row for Image + Book Details */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Book Image */}
          <div className="p-12 w-full lg:w-3/6">
            <div className="flex justify-around bg-zinc-800 p-12 rounded">
              <img
                src={Data.url}
                alt={Data.title}
                className="h-[50vh] lg:h-[70vh]"
              />
            </div>
          </div>

          {/* Book Details */}
          <div className="p-4 w-full lg:w-3/6 mt-8">
            <h1 className="text-4xl text-zinc-300 font-semibold">
              {Data.title}
            </h1>
            <p className="text-zinc-400 mt-1">by {Data.author}</p>

            {/* User Actions */}
            {isLoggedIn && isrole === "user" && (
              <div className="flex justify-start gap-4 mt-2">
                <div className="relative group">
                  <button
                    className="bg-white rounded-full text-xl text-red-500 p-3 hover:scale-110 transition duration-400"
                    onClick={handleFavourite}
                  >
                    <FaHeart />
                  </button>
                  <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 text-white text-sm opacity-0 group-hover:opacity-100 transition duration-300">
                    Favourite
                  </span>
                </div>
                <div className="relative group">
                  <button
                    className="bg-white rounded-full text-xl text-blue-500 p-3 hover:scale-110 transition duration-400"
                    onClick={handleCart}
                  >
                    <FaShoppingCart />
                  </button>
                  <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 text-white text-sm opacity-0 group-hover:opacity-100 transition duration-300">
                    Cart
                  </span>
                </div>
              </div>
            )}

            {/* Admin Actions */}
            {isLoggedIn && isrole === "admin" && (
              <div className="flex justify-start gap-4 mt-2">
                <div className="relative group">
                  <Link
                    to={`/updateBook/${id}`}
                    className="h-11 w-11 flex items-center justify-center bg-white rounded-full text-xl text-black hover:scale-110 transition duration-300"
                  >
                    <FaEdit />
                  </Link>
                  <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 text-white text-sm opacity-0 group-hover:opacity-100 transition duration-300">
                    Edit
                  </span>
                </div>
                <div className="relative group">
                  <button
                    className="bg-white rounded-full text-xl text-red-500 p-3 hover:scale-110 transition duration-400"
                    onClick={deleteBook}
                  >
                    <MdOutlineDelete />
                  </button>
                  <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 text-white text-sm opacity-0 group-hover:opacity-100 transition duration-300">
                    Delete
                  </span>
                </div>
              </div>
            )}

            <p className="text-zinc-500 mt-6 text-xl">{Data.desc}</p>
            <p className="flex mt-4 items-center justify-start text-zinc-400">
              <GrLanguage className="me-3" />
              {Data.language}
            </p>
            <p className="mt-4 text-zinc-100 text-3xl font-semibold">
              Price : Rs {Data.price}
            </p>
          </div>
        </div>

        {/* Book Recommendations Section BELOW */}
        <div className="mx-12 mt-12 w-full text-white">
          <Recommendations />
        </div>
      </div>
    </div>
  );
};

export default ViewBookDetails;
