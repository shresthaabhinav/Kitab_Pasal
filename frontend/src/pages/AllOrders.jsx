import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';
import { FaCheck } from "react-icons/fa";
import { IoOpenOutline } from "react-icons/io5";
import SeeUserData from './SeeUserData';

const AllOrders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [options, setOptions] = useState(-1);
  const [values, setValues] = useState({ status: "" });
  const [userDiv, setUserDiv] = useState('hidden');
  const [userDivData, setUserDivData] = useState();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          'http://localhost:1000/api/v1/get-all-orders',
          { headers }
        );
        setAllOrders(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const handleChange = (e) => {
    setValues({ status: e.target.value });
  };

  const submitChanges = async (i) => {
    const order = allOrders[i];
    if (!order || !order._id) return;
    try {
      const response = await axios.put(
        `http://localhost:1000/api/v1/update-status/${order._id}`,
        values,
        { headers }
      );
      alert(response.data.message);
      setOptions(-1);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  // Filter out invalid orders without book
  const validOrders = allOrders.filter(order => order.book);

  return (
    <>
      {!allOrders || allOrders.length === 0 ? (
        <div className='h-[100%] flex items-center justify-center'>
          <Loader />
        </div>
      ) : (
        <div className='h-[100%] p-0 md:p-4 text-zinc-100'>
          <h1 className='text-3xl md:text-5xl font-semibold text-zinc-500 mb-8'>
            All Orders
          </h1>

          {/* Table header */}
          <div className='mt-4 bg-zinc-800 w-full rounded py-2 px-4 flex gap-2'>
            <div className='w-[3%] text-center'>Sr.</div>
            <div className='w-[22%]'>Books</div>
            <div className='w-[45%] hidden md:block'>Description</div>
            <div className='w-[9%]'>Price</div>
            <div className='w-[16%]'>Status</div>
            <div className='w-[5%] hidden md:block'>Info</div>
          </div>

          {/* Orders list */}
          {validOrders.map((order, i) => (
            <div
              key={order._id}
              className='bg-zinc-800 w-full rounded py-2 px-4 flex gap-2 hover:bg-zinc-900 hover:cursor-pointer transition-all duration-300'
            >
              <div className='w-[3%] text-center'>{i + 1}</div>

              <div className='w-[40%] md:w-[22%]'>
                <Link
                  to={`/view-book-details/${order.book?._id}`}
                  className='hover:text-blue-300'
                >
                  {order.book?.title || "Book Not Found"}
                </Link>
              </div>

              <div className='w-0 md:w-[45%] hidden md:block'>
                {order.book?.desc?.slice(0, 50) || "No Description"} ...
              </div>

              <div className='w-[17%] md:w-[9%]'>
                Rs {order.book?.price || 0}
              </div>

              <div className='w-[30%] md:w-[16%]'>
                <button
                  className='font-semibold hover:scale-105 transition-all duration-300'
                  onClick={() => setOptions(i)}
                >
                  {order.status === 'Order Placed' ? (
                    <div className='text-yellow-500'>{order.status}</div>
                  ) : order.status === 'Cancelled' ? (
                    <div className='text-red-500'>{order.status}</div>
                  ) : (
                    <div className='text-green-500'>{order.status}</div>
                  )}
                </button>

                {options === i && (
                  <div className='flex gap-2 mt-1'>
                    <select
                      name="status"
                      className='bg-gray-800 text-white p-1 rounded'
                      onChange={handleChange}
                      value={values.status}
                    >
                      {['Order Placed', 'Out for Delivery', 'Delivered', 'Cancelled'].map((status, idx) => (
                        <option value={status} key={idx}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <button
                      className='text-green-500 hover:text-pink-600'
                      onClick={() => submitChanges(i)}
                    >
                      <FaCheck />
                    </button>
                  </div>
                )}
              </div>

              <div className='w-[10%] md:w-[5%]'>
                <button
                  className='text-xl hover:text-orange-500'
                  onClick={() => {
                    setUserDiv('fixed');
                    setUserDivData(order.user);
                  }}
                >
                  <IoOpenOutline />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* User Data Modal */}
      {userDivData && (
        <SeeUserData
          UserDivData={userDivData}
          UserDiv={userDiv}
          setUserDiv={setUserDiv}
        />
      )}
    </>
  );
};

export default AllOrders;
