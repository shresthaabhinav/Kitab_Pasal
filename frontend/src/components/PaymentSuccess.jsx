import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [decodedData, setDecodedData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const param = searchParams.get("data");

    if (!param) {
      setError("No data received.");
      return;
    }

    try {
      const decoded = JSON.parse(atob(param));
      setDecodedData(decoded);
    } catch (err) {
      setError("Invalid payment data.");
    }
  }, [searchParams]);

  const submit = async () => {
    try {
      // You can add your backend endpoint here
      await axios.post('http://localhost:1000/api/v1/verify', decodedData);
      navigate("/profile/orderHistory");
    } catch (err) {
      console.error(err);
      alert("Failed to confirm payment. Please try again.");
    }
  };

  if (error) return <div className="text-red-500 text-center mt-20">{error}</div>;

  if (!decodedData) return <div className="text-center mt-20">Processing payment...</div>;

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center w-96">
        {decodedData.status === "COMPLETE" ? (
          <>
            <h2 className="text-xl font-semibold text-green-600">Payment Successful!</h2>
            <p className="mt-4">Thank you for your purchase!</p>
            <button
              onClick={submit}
              className="mt-6 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Go to Order History
            </button>
          </>
        ) : (
          <h2 className="text-xl text-red-600">Payment Status: {decodedData.status}</h2>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;