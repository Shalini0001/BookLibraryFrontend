import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { SubscriptionContext } from '../../context/SubscriptionContext';
import { ENDPOINTS } from '../../utils/constants';

const BOOKS = [
  {
    id: '1',
    title: 'Atomic Habits',
    image: require('../../assets/images/atomichabit.png')
  },
  {
    id: '2',
    title: 'Deep Work',
    image: require('../../assets/images/deepwork.png')
  },
  {
    id: '3',
    title: 'Rich Dad Poor Dad',
    image: require('../../assets/images/richdad.png')
  },
  {
    id: '4',
    title: 'Think Like a Monk',
    image: require('../../assets/images/thinklikemonk.png')
  }
];

const HomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const { subscription } = useContext(SubscriptionContext);

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { fetchStatus } = useContext(SubscriptionContext); // Get the fetch function


  useEffect(() => {
    fetchBooks();
  }, []);


  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBooks();   // Refresh books list
    await fetchStatus();  // Hit the status API again
    setRefreshing(false);
  };

  const fetchBooks = async () => {
    try {
      const response = await fetch(ENDPOINTS.GET_BOOKS);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderSubscriptionStatus = () => {
    if (subscription.status === 'ACTIVE') {
      return (
        <Text style={styles.active}>
          Status: ACTIVE • Expires on {subscription.endDate}
        </Text>
      );
    }
    return <Text style={styles.notPurchased}>Status: {subscription.status || 'NOT PURCHASED'}</Text>;
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#000" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Hello, {user?.username || 'Reader'} 👋</Text>
      {renderSubscriptionStatus()}

      <FlatList
        data={books}
        numColumns={2}
        keyExtractor={(item) => item._id} // MongoDB uses _id
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ marginTop: 16 }}
        onRefresh={onRefresh}
        refreshing={refreshing}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('BookDetail', { bookId: item._id })}
            activeOpacity={0.8}
          >
            {/* Note: In production, use { uri: item.imageUrl } if loading from web */}
            <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  welcome: {
    fontSize: 22,
    fontWeight: 'bold'
  },

  /* Subscription Status */
  active: {
    marginTop: 6,
    color: 'green',
    fontWeight: '600'
  },
  expired: {
    marginTop: 6,
    color: 'red',
    fontWeight: '600'
  },
  notPurchased: {
    marginTop: 6,
    color: '#555',
    fontWeight: '600'
  },

  /* Book Card */
  card: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 16,
    padding: 10,
    alignItems: 'center'
  },
  image: {
    width: '100%',
    height: 140,
    borderRadius: 8,
    resizeMode: 'cover'
  },
  title: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center'
  }
});
