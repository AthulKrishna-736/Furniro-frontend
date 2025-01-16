import React, { useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";

const PaymentComponent = ({ userId, amount, setRazorpayOpen, onPaymentSuccess }) => {
  useEffect(() => {
    console.log('user id and amount in payment: ', [userId, amount]);
    const handlePayment = async () => {
      try {
        const { data } = await axiosInstance.post('/user/createOrder', {
          amount,
          currency: 'INR',
          userId,
        });

        console.log('res data razor: ', data);

        const { order, user } = data;

        const options = {
          key: import.meta.env.VITE_RAZORPAY_ID_KEY,
          amount: order.amount,
          currency: order.currency,
          name: 'Furniro Payment',
          description: 'Complete Your Purchase',
          order_id: order.id,
          handler: async (response) => {
            try {
              console.log('Razorpay payment response: ', response);

              showSuccessToast('Payment successful! Thank you for your order.');
              onPaymentSuccess();
            } catch (error) {
              console.error('Error in payment handler: ', error);
              showErrorToast('Payment error, try again later.');
            }
          },
          prefill: {
            name: `${user.firstName}${user.lastName}`,
            email: user.email,
            
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
      }
    };

    handlePayment();

    return () => {
      setRazorpayOpen(false);
      console.log('Razorpay cleanup on unmount');
    };
  }, [amount, setRazorpayOpen]);
};

export default PaymentComponent;
