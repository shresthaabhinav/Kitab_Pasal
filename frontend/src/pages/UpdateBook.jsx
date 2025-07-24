import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';

const UpdateBook = () => {

    const [Data, setData] = useState({
        url: "",
        title: "",
        author: "",
        price: "",
        desc: "",
        language: "",
      });
      
      const { id } = useParams();
      const navigate = useNavigate();

      const headers = {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
        bookid : id,
      };

      const change = (e) => {
        const { name, value } = e.target;
        setData({ ...Data, [name]: value });
      };
    
      const submit = async () => {
        try {
          if (
            Data.url === "" ||
            Data.title === "" ||
            Data.author === "" ||
            Data.price === "" ||
            Data.desc === "" ||
            Data.language === ""
          ) {
            alert("All fields are required");
          }
    
          if (parseFloat(Data.price) < 0) {
            alert("Price cannot be negative");
            return;
          } else {
            const response = await axios.put(
              "http://localhost:1000/api/v1/update-book",
              Data,
              { headers }
            );
            setData({
              url: "",
              title: "",
              author: "",
              price: "",
              desc: "",
              language: "",
            });
            alert(response.data.message);
            navigate(`/view-book-details/${id}`)
          }
        } catch (error) {
          alert(error.response.data.message);
         
        }
      };
      useEffect(()=>{
        const fetch = async() => {
            const response = await axios.get(
                `http://localhost:1000/api/v1/get-book-by-id/${id}`
            )
            setData(response.data.data)
        } 
        fetch()
      },[])

  return (
    <div>
      <div className="h-[100%] p-0 md:p-4">
      <h1 className="text-3xl md:text-5xl font-semibold text text-zinc-300 mb-8">
        Edit Book
      </h1>
      <div className="p-4 bg-zinc-800 rounded">
        <div>
          <label className="text-zinc-400" htmlFor="">
            Image
          </label>
          <input
            type="text"
            className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
            placeholder="url of image"
            name="url"
            required
            value={Data.url}
            onChange={change}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="" className="text-zinc-400">
            Title of Book
          </label>
          <input
            type="text"
            className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
            placeholder="Title"
            name="title"
            required
            value={Data.title}
            onChange={change}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="" className="text-zinc-400">
            Author
          </label>
          <input
            type="text"
            className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
            placeholder="Author"
            name="author"
            required
            value={Data.author}
            onChange={change}
          />
        </div>
        <div className="mt-4 flex gap-4">
          <div className="w-3/6">
            <label htmlFor="" className="text-zinc-400">
              Language
            </label>
            <input
              type="text"
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
              placeholder="Language"
              name="language"
              required
              value={Data.language}
              onChange={change}
            />
          </div>
          <div className="w-3/6">
            <label htmlFor="" className="text-zinc-400">
              Price
            </label>
            <input
              type="text"
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
              placeholder="1000"
              name="price"
              required
              value={Data.price}
              onChange={change}
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="" className="text-zinc-400">
            Description of book
          </label>
          <textarea
            className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
            placeholder="description of book"
            name="desc"
            id=""
            rows="5"
            required
            value={Data.desc}
            onChange={change}
          />
        </div>

        <button
          className="mt-4 px-3 bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition-all duration-300"
          onClick={submit}
        >
          Edit Book
        </button>
      </div>
    </div>
    </div>
  )
}

export default UpdateBook
