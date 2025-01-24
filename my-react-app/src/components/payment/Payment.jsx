import React, { useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";

const PaymentComponent = ({ userId, amount, setRazorpayOpen, onPaymentSuccess, orderId }) => {
  useEffect(()=>{
    if(orderId){
      console.log('order id is there');
    }else{
      console.log('order id is not there');
    }
  },[])
  useEffect(() => {
    const handlePayment = async () => {
      try {
        const { data } = await axiosInstance.post('/user/createOrder', {
          amount,
          currency: 'INR',
          userId,
        });

        const { order, user }  = data

        const options = {
          key: import.meta.env.VITE_RAZORPAY_ID_KEY,
          amount: order.amount,
          currency: order.currency,
          name: 'Furniro Payment',
          description: 'Complete Your Purchase',
          order_id: order.id,
          handler: async (response) => {
            try {
              await axiosInstance.put(`/user/updateOrderPaymentStatus`, {
                orderId,
                paymentStatus: 'Completed',
                razorpayDetails: response,
              });

              showSuccessToast('Payment successful! Thank you for your order.');
            } catch (error) {
              showErrorToast('Payment processing failed. Please contact support.');
            }
          },
          modal: {
            ondismiss: async () => {
              try {
                await axiosInstance.put(`/user/updateOrderPaymentStatus`, {
                  orderId,
                  paymentStatus: 'Failed',
                });
              } catch (error) {
                console.error('Failed to update payment status on dismiss: ', error);
              }
              setRazorpayOpen(false);
              showErrorToast('Payment cancelled. Order status updated.');
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (error) {
        showErrorToast('Error initializing payment. Please try again.');
      }
    };

    handlePayment();

    return () => {
      setRazorpayOpen(false);
    };
  }, [amount, setRazorpayOpen, orderId]);

  return null;
};

export default PaymentComponent;
