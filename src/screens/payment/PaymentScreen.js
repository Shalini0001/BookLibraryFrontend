import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SubscriptionContext } from '../../context/SubscriptionContext';
import { ENDPOINTS } from '../../utils/constants';

const PaymentScreen = ({ navigation }) => {
  const { activateSubscription } = useContext(SubscriptionContext);
  const [loading, setLoading] = useState(false);

  const handleMockPayment = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');

      const orderRes = await fetch(ENDPOINTS.CREATE_ORDER, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json'
        }
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) throw new Error('Could not create order');

      console.log('Mock Order Created:', orderData.id);

      const verifyRes = await fetch(ENDPOINTS.VERIFY_PAYMENT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
           'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          razorpay_order_id: orderData.id,
          razorpay_payment_id: "pay_mock_" + Math.random().toString(36).substr(2, 9),
          razorpay_signature: "mock_signature"
        })
      });

      const verifyData = await verifyRes.json();

      if (verifyData.success) {
        activateSubscription(); 

        Alert.alert('Success', 'Subscription activated successfully (Mock Mode)');
        navigation.goBack();
      } else {
        throw new Error(verifyData.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Payment Error', 'Unable to process payment at this time.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Subscription</Text>
      <Text style={styles.price}>₹99 for 30 Days</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 30 }} />
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={handleMockPayment}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Pay Now (Mock)</Text>
        </TouchableOpacity>
      )}
      
      <Text style={styles.footerNote}>
        Note: Payment is in Mock Mode for testing purposes.
      </Text>
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  price: {
    marginTop: 10,
    fontSize: 16,
    color: '#555'
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginTop: 30
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  footerNote: {
    marginTop: 20,
    fontSize: 12,
    color: '#aaa',
    textAlign: 'center'
  }
});

// import React, { useContext } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Alert
// } from 'react-native';
// import RazorpayCheckout from 'react-native-razorpay';
// import { SubscriptionContext } from '../../context/SubscriptionContext';

// const PaymentScreen = ({ navigation }) => {
//   const { activateSubscription } = useContext(SubscriptionContext);

//   const openRazorpay = () => {
//     const options = {
//       description: 'Book Subscription',
//       image: 'https://www.domatobookco.com/', // optional
//       currency: 'INR',
//       key: 'rzp_test_xxxxxxxx', // Razorpay Test Key
//       amount: 9900, // ₹99 in paise
//       name: 'Domato',
//       prefill: {
//         email: 'test@example.com',
//         contact: '9999999999',
//       },
//       theme: { color: '#000' }
//     };

//     RazorpayCheckout.open(options)
//       .then((data) => {
//         // Payment successful
//         console.log('Payment Success:', data);

//         // Activate subscription (mock)
//         activateSubscription();

//         Alert.alert('Success', 'Subscription activated successfully');
//         navigation.goBack();
//       })
//       .catch((error) => {
//         Alert.alert('Payment Failed', error.description);
//       });
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Book Subscription</Text>
//       <Text style={styles.price}>₹99 for 30 Days</Text>

//       <TouchableOpacity
//         style={styles.button}
//         onPress={openRazorpay}
//         activeOpacity={0.8}
//       >
//         <Text style={styles.buttonText}>Pay Now</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default PaymentScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff'
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold'
//   },
//   price: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#555'
//   },
//   button: {
//     backgroundColor: '#000',
//     paddingVertical: 16,
//     paddingHorizontal: 50,
//     borderRadius: 30,
//     marginTop: 30
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600'
//   }
// });
