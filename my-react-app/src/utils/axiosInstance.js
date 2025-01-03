import axios from 'axios';
import { showErrorToast } from './toastUtils'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true, 
});

//userblock interceptor
axiosInstance.interceptors.request.use((config)=>{
  console.log('interceptor request going...')
  const currentPath = window.location.pathname;
  console.log('current path: ', currentPath);
  const email = localStorage.getItem('email');
  console.log('email in interceptor: ', email)

  if (email) {
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        email: email,
      };
    } else {
      config.data = {
        ...config.data,
        emailInt: email,
      };
    }
  }
  console.log('congfig set: ', config.data);

  return config;
},(error)=>{
  return Promise.reject(error);
});


axiosInstance.interceptors.response.use(
  (response)=> response,
  (error)=>{
    console.log('error in interceptor')
    const { status, data } = error?.response;
    console.log('status code and data: ',[status, data, data?.message]);

    if(error.response && error.response.status == 403 && error.response?.data?.message == 'User is blocked.'){
      const { isBlocked, message } = error.response?.data;
      console.log('checking the error and redirecting...')

      if(window.location.pathname == '/login' && isBlocked){
        showErrorToast('Login is restricted')
      }else{
        if(isBlocked){
          showErrorToast('You have been blocked. Redirecting to login...')
            localStorage.removeItem('email');
            localStorage.removeItem('userId')
            window.location.href = '/login';
        }
      }

    }
    return Promise.reject(error);
  }
)

//token jwt 
axiosInstance.interceptors.response.use(
    (response) => response, 
    async (error) => {
      console.log('Interceptor triggered...');
  
      if (error.response) {
        const { status, data } = error.response;
  
        if (
          (status === 401 && data.message === 'Access token not provided') ||
          (status === 403 && data.message === 'Access token expired. Use /refreshToken to refresh.')
        ) {
          try {
            console.log('Attempting to refresh access token...');
            const refreshResponse = await axiosInstance.post('/user/refreshToken', {}, { withCredentials: true });
            console.log('Token refreshed successfully:', refreshResponse.data?.message);
  
            // Retry the original request with the new access token
          } catch (refreshError) {
            console.log('Error happened: ', refreshError.response.data);
            if(refreshError.response.status === 403 && refreshError.response?.data?.message === 'Refresh token not found'){
                console.log('user is getting redirected as no token have found...')
                localStorage.removeItem('userId')
                console.log(localStorage)
            }
          }
        }
      }
  
      // Reject the promise with the error for other cases
      return Promise.reject(error);
    }
  );  

export default axiosInstance;
