import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import axios from "axios";
import { Link } from "react-router-dom";

const UserOrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState(null);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1000/api/v1/get-order-history",
          { headers }
        );
        console.log(response.data);
        setOrderHistory(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch order history", error);
        setOrderHistory([]);
      }
    };
    fetchOrders();
  }, []);

  if (!orderHistory) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="h-[88vh] p-6 text-zinc-100">
      <h1 className="text-4xl font-bold text-center text-zinc-300 mb-6">
        {orderHistory.length === 0 ? "No Order History" : "Your Order History"}
      </h1>

      {orderHistory.length > 0 && (
        <>
          {/* Header Row */}
          <div className="grid grid-cols-12 bg-zinc-900 rounded py-3 px-4 mb-2 text-sm font-semibold">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-3">Book</div>
            <div className="col-span-4 mx-2">Description</div>
            <div className="col-span-1">Price</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 hidden md:block">Mode</div>
          </div>

          {/* Order Rows */}
          {orderHistory.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-12 bg-zinc-800 hover:bg-zinc-700 transition-all duration-150 rounded py-3 px-4 mb-2 text-sm items-center"
            >
              <div className="col-span-1 text-center">{i + 1}</div>

              <div className="col-span-3">
                {item?.book ? (
                  <Link
                    to={`/view-book-details/${item.book._id}`}
                    className="hover:text-blue-300 font-medium truncate block"
                  >
                    {item.book.title}
                  </Link>
                ) : (
                  <span className="text-red-400">[Deleted]</span>
                )}
              </div>

              <div className="col-span-4 truncate mx-2">
                {item?.book?.desc
                  ? item.book.desc.slice(0, 50) + "..."
                  : "No description"}
              </div>

              <div className="col-span-1">
                {item?.book?.price !== undefined
                  ? `Rs. ${item.book.price}`
                  : "--"}
              </div>

              <div className="col-span-2 font-semibold">
                {item.status === "Order placed" ? (
                  <span className="text-yellow-400">{item.status}</span>
                ) : item.status === "Cancelled" ? (
                  <span className="text-red-500">{item.status}</span>
                ) : (
                  <span className="text-green-400">{item.status}</span>
                )}
              </div>

              <div className="col-span-1 hidden md:block text-zinc-400">
                {item?.paymentMethod === "esewa" ? "eSewa" : "COD"}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default UserOrderHistory;
