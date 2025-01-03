import React, { useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";

const PaymentComponent = ({ orderId, amount, setRazorpayOpen, placeOrder }) => {
  useEffect(() => {
    console.log('order and amount in payment: ', [orderId, amount])
    const handlePayment = async () => {
      try {
        const { data } = await axiosInstance.post('/user/createOrder', {
          amount,
          currency: 'INR',
        });
        console.log('res data razor: ', data);

        const { order } = data;

        const options = {
          key: import.meta.env.VITE_RAZORPAY_ID_KEY,
          amount: order.amount,
          currency: order.currency,
          name: 'Furniro Payment',
          description: 'Complete Your Purchase',
          order_id: order.id,
          handler: async (response) => {
            try {
              const updateResponse = await axiosInstance.put(`/user/updateStatus/${orderId}`, {
                paymentId: response.razorpay_payment_id,
                paymentStatus: 'Completed',
              });
              await placeOrder();
              console.log('updateres razor: ', updateResponse.data);

              showSuccessToast('Payment successful! Thank you for your order.');
            } catch (error) {
              showErrorToast( 'Payment error, try again later');
            }
          },
          prefill: {
            name: 'Customer Name',
            email: 'customer@example.com',
            contact: '1234567890',
          },
          theme: {
            color: '#F37254',
          },
          modal: {
            ondismiss: () => {
              setRazorpayOpen(false); 
              showErrorToast(
                'Payment failed or cancelled. Please try again or choose another payment method.'
              );
            },
          },
        };

        const razorpay = new window.Razorpay(options); 
        razorpay.open();
      } catch (error) {
        console.log('payment error razor: ', error.response);
        showErrorToast('Payment failed. Please try again.');
      }
    };

    handlePayment();

    return () => {
      setRazorpayOpen(false);
      console.log('Razorpay cleanup on unmount');
    };

  }, [amount, orderId, setRazorpayOpen]); 

};

export default PaymentComponent;
