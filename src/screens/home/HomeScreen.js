import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { SubscriptionContext } from '../../context/SubscriptionContext';
import { ENDPOINTS } from '../../utils/constants';
import { getFcmToken, listenForegroundNotifications, requestNotificationPermission } from '../../services/notificationService';

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext); 
  const { subscription, fetchSubscription } = useContext(SubscriptionContext);

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const setupNotifications = async () => {
      const hasPermission = await requestNotificationPermission();
      if (hasPermission) {
        await getFcmToken();
      }
    };
    setupNotifications();
    const unsubscribe = listenForegroundNotifications();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchBooks(), fetchSubscription()]);
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
    console.log("Subscription Status:", subscription);
    if (subscription.status === 'ACTIVE') {
      return (
        <Text style={styles.active}>
          {`Status: ACTIVE • Expires on (${subscription?.expiryDate || 'N/A'})`}
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
        keyExtractor={(item, index) => item._id?.toString() || item.id?.toString() || index.toString()}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        onRefresh={onRefresh}
        refreshing={refreshing}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('BookDetail', { bookId: item._id })}
            activeOpacity={0.8}
          >
            <Image 
              source={{ uri: item.image || 'https://via.placeholder.com/150' }} 
              style={styles.image} 
            />
            <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={() => (
          <View style={styles.footerContainer}>
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  welcome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  listContent: {
    paddingBottom: 20, 
  },
  card: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 16,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    top:10
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    resizeMode: 'cover'
  },
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
  title: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  footerContainer: {
    width: '100%',
    paddingVertical: 20,
    alignItems: 'center',
  },
  logoutButton: {
    width: '100%',
    padding: 16,
    borderRadius: 30,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#FF3B30',
    alignItems: 'center',
  },
  logoutText: {
    color: '#FF3B30',
    fontWeight: '700',
    fontSize: 16
  }
});