import { StyleSheet, Text, View, FlatList } from 'react-native';
import React from 'react';
import { hp, wp } from '@/helpers/common'; 
import ScreenWrapper from '@/components/ScreenWrapper'; 
import Icon from '@/components/Icons';

const notifications = [
  { id: '1', type: 'follow', user: 'Eren', time: 'Just now' },
  { id: '2', type: 'like', user: 'Goku', target: 'post', time: '17m' },
  { id: '3', type: 'comment', user: 'Kokushibo...', target: 'post', time: '35m' },
  { id: '4', type: 'like', user: 'Gojo', target: 'photo', time: '2h' },
  { id: '5', type: 'like', user: 'Someone', target: 'photo', time: '2h' },
  { id: '6', type: 'like', user: 'Rengoku', target: 'photo', time: '3h' },
  { id: '7', type: 'follow', user: 'Elon Musk', time: '5h' },
  { id: '8', type: 'like', user: 'Patrick', target: 'comment', time: '11h' },
  { id: '9', type: 'follow', user: 'The Rock', time: '15h' },
  { id: '10', type: 'follow', user: 'Jinwoo', time: '16h' },
  { id: '11', type: 'follow', user: 'Chris Evans', time: '18h' },
  { id: '12', type: 'follow', user: 'Tanjiro', time: '19h' },
  { id: '13', type: 'follow', user: 'Octo', time: '21h' },

];

const NotificationItem = ({ item }) => {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.icon}>
        <Icon type="FontAwesome5" name="user" size={hp(2.5)} color="#00FFC2" />
      </View>
      <Text style={styles.text}>
        <Text style={styles.bold}>{item.user}</Text>{' '}
        {item.type === 'follow' && 'followed you'}
        {item.type === 'like' && `liked your `}
        {item.type === 'comment' && `commented on your `}
        {item.target && <Text style={styles.link}>{item.target}</Text>}
        <Text style={styles.time}>     {item.time}</Text>
      </Text>
    </View>

  );
};

const Notifications = () => {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.heading}>Notifications</Text>
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NotificationItem item={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenWrapper>

  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#130321',
    paddingTop: hp(3),
  },
  heading: {
    fontSize: hp(3),
    fontWeight: 'bold',
    marginBottom: hp(2),
    marginTop: hp(1),
    marginHorizontal: wp(4),
    color: 'white',
  },
  list: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(2),
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: hp(2),
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: '#130321',
    padding: hp(1.5), 
    backgroundColor: '#1f0833ff', 
  },
  icon: {
    width: wp(10),
    alignItems: 'center',
    marginTop: hp(0.5),
  },
  text: {
    flex: 1,
    fontSize: hp(2),
    color: 'white',
  },
  bold: {
    fontWeight: 'bold',
  },
  link: {
    color: '#00FFC2',
    fontWeight: '500',
  },
  time: {
    color: '#888',
  },
});
