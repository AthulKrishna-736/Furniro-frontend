import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true, 
});

axiosInstance.interceptors.response.use(
    (response) => response, // Pass successful responses
    async (error) => {
      console.log('Interceptor triggered...');
  
      if (error.response) {
        const { status, data } = error.response;
  
        // Handle 401 (Access token not provided) or 403 (Access token expired)
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
