// export const BASE_URL = 'http://10.120.171.1:5000';
export const BASE_URL = 'https://corliss-fadable-allusively.ngrok-free.dev';

export const API_URL = `${BASE_URL}`;

export const ENDPOINTS = {
  LOGIN: `${API_URL}/auth/firebase-login`,
  UPDATE_PROFILE: `${API_URL}/user/profile`,
  GET_BOOKS: `${API_URL}/books`,
  GET_BOOK_DETAILS: (id) => `${API_URL}/books/${id}`,
  CREATE_ORDER: `${API_URL}/payment/create-order`,
  VERIFY_PAYMENT: `${API_URL}/payment/verify`,
  STATUS:`${API_URL}/payment/status`,
  GET_NOTIFICATIONS: `${API_URL}/notifications`,
};