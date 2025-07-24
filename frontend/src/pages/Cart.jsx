import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const [Cart, setCart] = useState([]);
  const [Total, setTotal] = useState(0);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        "http://localhost:1000/api/v1/get-user-cart",
        { headers }
      );
      setCart(response.data.data);
    };
    fetch();
  }, [Cart]);

  const deleteItem = async(bookid) => {
      const response = await axios.put(`http://localhost:1000/api/v1/delete-book-from-cart/${bookid}`,{},
        { headers }
      )
      alert(response.data.message);
  }

  useEffect(()=> {
    if(Cart && Cart.length > 0){
      let total = 0;
      Cart.map((items)=>{
        total += items.price;
      })
      setTotal(total);
      total = 0;
    }
  },[Cart]);

  const PlaceOrder = () => {
  navigate("/payment", { state: { cart: Cart, total: Total } });
};
  // const PlaceOrder = async () =>{
  //   try{
  //     const response = await axios.post('http://localhost:1000/api/v1/place-order',
  //       { order: Cart },
  //       { headers }
  //     )
  //     alert(response.data.message);
      
  //   }
  //   catch(error){
  //     console.log(error);
  //   }
  // }

  return (
    <div className='bg-zinc-900 px-12 h-screen py-8'>
      {!Cart && <div className='w-full h-[100%] flex items-center justify-center'> <Loader /> </div>}
      {Cart && Cart.length === 0 && (
        <div className="h-screen">
          <div className="h-[100%] flex items-center justify-center flex-col">
            <h1 className="text-5xl lg:text-6xl font-semibold text-zinc-400">
              Empty Cart
            </h1>
          </div>
        </div>
      )}
      {Cart && Cart.length > 0 && (
        <>
  <h1 className="text-5xl font-semibold text-zinc-100 mb-8">Your Cart</h1>

  {Cart.map((items, i) => (
    <div
      key={i}
      className="w-full my-2 rounded bg-zinc-800 p-2 flex flex-col md:flex-row items-center md:items-center justify-between gap-6"
    >
      {/* Image */}
      <img
        src={items.url}
        alt=''
        className="h-[16vh] w-auto rounded-lg object-cover shadow-md"
      />

      {/* Title + Description */}
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-2xl font-semibold text-zinc-100">{items.title}</h2>
        <p className="mt-2 text-zinc-300 hidden lg:block">
          {items.desc.slice(0, 100)}…
        </p>
        <p className="mt-2 text-zinc-300 hidden md:block lg:hidden">
          {items.desc.slice(0, 65)}…
        </p>
        <p className="mt-2 text-zinc-300 block md:hidden">
          {items.desc.slice(0, 100)}…
        </p>
      </div>

       {/* Price + Remove Button  */}
      <div className="w-30 flex flex-col items-start gap-2">
        <h2 className="text-2xl font-semibold text-zinc-100">
          Rs {items.price}
        </h2>
        <button
          className="bg-red-500 text-white rounded px-4 py-2 hover:scale-105 transition-all duration-300"
          onClick={() => deleteItem(items._id)}
        >
          Remove
        </button>
      </div>
    </div>
  ))}
</>
      )}
     { Cart && Cart.length > 0 && (
        <div className='mt-4 w-full flex items-center justify-end'>
          <div className='p-4 bg-zinc-800 rounded'>
            <h1 className='text-3xl text-zinc-200 font-semibold'>
              Total Amount
              </h1>
            <div className='mt-3 flex items-center justify-between text-xl text-zinc-200'>
              <h2>{Cart.length} books</h2>
              <h2>Rs {Total}</h2>
            </div>
            <div className='w-[100]% mt-3'>
              <button className='bg-zinc-100 rounded px-4 py-2 flex justify-center w-full font-semibold hover:bg-zinc-500' onClick={PlaceOrder}>
              Place your Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
