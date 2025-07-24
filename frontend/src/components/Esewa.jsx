import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import { useLocation } from "react-router-dom";

const Esewa = () => {
  const location = useLocation();
  const total = location.state?.total || "10";

  const [formData, setFormData] = useState({
    amount: total.toString(),
    tax_amount: "0",
    total_amount: total.toString(),
    transaction_uuid: uuidv4(),
    product_service_charge: "0",
    product_delivery_charge: "0",
    product_code: "EPAYTEST",
    success_url: "http://localhost:5173/paymentsuccess",
    failure_url: "http://localhost:5173/paymentfailure",
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature: "",
    secret: "8gBm/:&EnhH.1/q",
  });

  const generateSignature = (
    total_amount,
    transaction_uuid,
    product_code,
    secret
  ) => {
    const hashString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const hash = CryptoJS.HmacSHA256(hashString, secret);
    return CryptoJS.enc.Base64.stringify(hash);
  };

  useEffect(() => {
    const { total_amount, transaction_uuid, product_code, secret } = formData;
    const hashedSignature = generateSignature(
      total_amount,
      transaction_uuid,
      product_code,
      secret
    );
    setFormData((prev) => ({ ...prev, signature: hashedSignature }));
  }, [formData.total_amount, formData.transaction_uuid]);

  return (
    <form
      action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
      method="POST"
      className="max-w-lg mx-auto bg-zinc-900 text-white p-6 rounded-xl shadow-xl space-y-4 mt-10"
    >
      <h1 className="text-2xl font-bold text-center mb-4">eSewa Checkout</h1>

      <div className="space-y-2">
        <label>Amount</label>
        <input
          type="text"
          name="amount"
          value={formData.amount}
          readOnly
          className="w-full p-2 bg-zinc-800 rounded text-white border border-zinc-700"
        />
      </div>

      {/* Hidden fields */}
      <input type="hidden" name="tax_amount" value={formData.tax_amount} />
      <input type="hidden" name="total_amount" value={formData.total_amount} />
      <input type="hidden" name="transaction_uuid" value={formData.transaction_uuid} />
      <input type="hidden" name="product_code" value={formData.product_code} />
      <input type="hidden" name="product_service_charge" value={formData.product_service_charge} />
      <input type="hidden" name="product_delivery_charge" value={formData.product_delivery_charge} />
      <input type="hidden" name="success_url" value={formData.success_url} />
      <input type="hidden" name="failure_url" value={formData.failure_url} />
      <input type="hidden" name="signed_field_names" value={formData.signed_field_names} />
      <input type="hidden" name="signature" value={formData.signature} />

      {/* Optional: hidden user name fields (hardcoded values if needed) */}
      <input type="hidden" name="first_name" value="John" />
      <input type="hidden" name="last_name" value="Doe" />

      <button
        type="submit"
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded font-bold transition"
      >
        Pay via eSewa
      </button>
    </form>
  );
};

export default Esewa;
