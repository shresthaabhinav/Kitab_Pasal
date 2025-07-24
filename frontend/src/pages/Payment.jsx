import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, total } = location.state || {};

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const PlaceOrder = async (paymentMethod) => {
    try {
      const response = await axios.post(
        "http://localhost:1000/api/v1/place-order",
        {
          order: cart,
          paymentMethod: paymentMethod,
        },
        { headers }
      );
      alert(response.data.message);

      if (paymentMethod === "esewa") {
        navigate("/esewa", { state: { total } });
      } else {
        navigate("/profile/orderHistory");
      }
    } catch (error) {
      console.log(error);
      alert("Failed to place order.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center p-6">
      <div className="bg-zinc-900 shadow-2xl rounded-xl p-10 w-full max-w-xl border border-zinc-700">
        <h1 className="text-4xl font-bold text-zinc-100 mb-6 text-center">
          Payment Methods
        </h1>

        <div className="text-zinc-300 text-lg mb-6 text-center">
          <p>You are placing an order for:</p>
          <p className="text-2xl mt-2 font-semibold text-white">Rs {total}</p>
          <p className="mt-1 text-sm text-zinc-400">{cart?.length} item(s)</p>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => PlaceOrder("cash")}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 shadow hover:shadow-lg"
          >
            Cash on Delivery
          </button>

          <button
            onClick={() => PlaceOrder("esewa")}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all duration-200 shadow hover:shadow-lg"
          >
            Pay with eSewa
          </button>
        </div>

        <div className="mt-8 text-sm text-center text-zinc-500">
          Your order will be confirmed after choosing a payment method.
        </div>
      </div>
    </div>
  );
};

export default Payment;
