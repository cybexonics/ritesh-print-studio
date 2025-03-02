"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const PaymentPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const router = useRouter()

  // Simulate a payment processing function
  const handlePayment = () => {
    setIsProcessing(true);
    setPaymentStatus('idle');

    // Simulate a delay for processing the payment
    setTimeout(() => {
      // Randomly set the payment status to success or failure
      const isPaymentSuccessful = Math.random() > 0.5; // 50% chance of success
      if (isPaymentSuccessful) {
        setPaymentStatus('success');
        router.push("/order/success")
      } else {
        setPaymentStatus('failed');
        router.push("/order/failed")
      }
      setIsProcessing(false);
    }, 3000); // 3 seconds delay
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">Mock Payment Gateway</h1>
        
        {isProcessing ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
            <p className="text-lg text-gray-700">Processing your payment...</p>
          </div>
        ) : paymentStatus === 'success' ? (
          <div className="flex flex-col items-center space-y-4">
            <p className="text-2xl text-green-600">Payment Successful!</p>
            <button
              onClick={() => setPaymentStatus('idle')}
              className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-md"
            >
              Go Back to Home
            </button>
          </div>
        ) : paymentStatus === 'failed' ? (
          <div className="flex flex-col items-center space-y-4">
            <p className="text-2xl text-red-600">Payment Failed</p>
            <button
              onClick={() => setPaymentStatus('idle')}
              className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-md"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={handlePayment}
              className="py-3 px-6 bg-green-500 text-white text-lg font-semibold rounded-md hover:bg-green-600"
            >
              Pay Now with PhonePe
            </button>
            <p className="mt-4 text-gray-600">Simulating a payment via PhonePe</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
