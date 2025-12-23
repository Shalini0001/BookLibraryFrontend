import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  SafeAreaView
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
    if (!bookId) return;
    try {
      const response = await fetch(ENDPOINTS.GET_BOOK_DETAILS(bookId));
      const contentType = response.headers.get("content-type");
      if (response.ok && contentType && contentType.includes("application/json")) {
        const data = await response.json();
        setBook(data);
      }
    } catch (error) {
      console.error("Error fetching book details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  const isActive = subscription.status === 'ACTIVE';

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Floating Back Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Image source={require('../../assets/images/backArrow.png')} style={[styles.backButtonImage, { tintColor: '#fff' }]} />
       
      </TouchableOpacity>

      <ScrollView style={styles.container} bounces={false}>
        <Image
          source={
            typeof book?.image === 'string'
              ? { uri: book.image }
              : book?.image
          }
         
          style={styles.image}
        />
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{book?.title}</Text>
          <Text style={styles.author}>By {book?.author || 'Unknown Author'}</Text>
          <Text style={styles.description}>{book?.description}</Text>

          {!isActive ? (
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Payment')}>
              <Text style={styles.buttonText}>Unlock Full Access – ₹99</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.accessBox}>
              <Text style={styles.success}>You have access to premium books 🎉</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default BookDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 350,
    resizeMode: 'contain'
  },
  contentContainer: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    paddingHorizontal: 20,
    color: '#333'
  },
  author: {
    fontSize: 16,
    color: '#777',
    marginTop: 4,
    paddingHorizontal: 20
  },
  description: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    marginTop: 15,
    paddingHorizontal: 20
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 30,
    margin: 20,
    marginTop: 30
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center'
  },
  accessBox: {
    margin: 20,
    padding: 20,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C8E6C9'
  },
  success: {
    color: '#2E7D32',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  backButtonImage:{
    width: 30,
    height: 30,
    tintColor: '#fff'
  }
});