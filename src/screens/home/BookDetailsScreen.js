import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { SubscriptionContext } from '../../context/SubscriptionContext';
import { ENDPOINTS } from '../../utils/constants';

const BookDetailScreen = ({ route, navigation }) => {
  const { bookId } = route.params;
  const { subscription } = useContext(SubscriptionContext);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookDetails();
  }, []);

  const fetchBookDetails = async () => {
    try {
      const response = await fetch(ENDPOINTS.GET_BOOK_DETAILS(bookId));
      const data = await response.json();
      setBook(data);
    } catch (error) {
      console.error("Error fetching book details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  const isActive = subscription.status === 'ACTIVE';

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: book?.image }} style={styles.image} />
      <Text style={styles.title}>{book?.title}</Text>
      <Text style={styles.author}>By {book?.author || 'Unknown Author'}</Text>

      <Text style={styles.description}>{book?.description}</Text>

      {!isActive ? (
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Payment')}>
          <Text style={styles.buttonText}>Unlock Full Access – ₹99</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.accessBox}>
          <Text style={styles.success}>🎉 Premium Access Active</Text>
          <TouchableOpacity style={[styles.button, { marginTop: 15, width: '100%' }]}>
            <Text style={styles.buttonText}>Read Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default BookDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    paddingHorizontal: 20
  },
  description: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginTop: 10,
    paddingHorizontal: 20
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 30,
    margin: 20
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
  },
  accessBox: {
    margin: 20,
    padding: 20,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    alignItems: 'center'
  },
  success: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: 'bold'
  },
  subText: {
    marginTop: 6,
    fontSize: 14,
    color: '#388E3C'
  }
});