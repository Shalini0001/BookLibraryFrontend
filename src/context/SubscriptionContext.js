import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENDPOINTS } from '../utils/constants';

export const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState({
    status: 'LOADING',
    expiryDate: null,
  });

  const fetchSubscription = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setSubscription({ status: 'NOT_PURCHASED', expiryDate: null });
        return;
      }

      const res = await fetch(ENDPOINTS.STATUS, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok && data.status) {
        setSubscription({
          status: data.status,
          expiryDate: data.endDate ? new Date(data.endDate).toLocaleDateString() : null,
        });
      } else {
        setSubscription({ status: 'NOT_PURCHASED', expiryDate: null });
      }
    } catch (error) {
      console.error('Fetch Subscription Error:', error);
      setSubscription({ status: 'NOT_PURCHASED', expiryDate: null });
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const activateSubscription = () => {
    fetchSubscription();
  };

  return (
    <SubscriptionContext.Provider value={{ subscription, activateSubscription, fetchSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
};