import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, IconButton, Searchbar, Divider } from 'react-native-paper';
import Header from '../components/Header';
import Bottom from '../components/Bottom';
import Order from '../components/Order';

function OrderHistory({ navigation }) {
  const [firstQuery, setFirstQuery] = useState('');
  const date = '2020-01-31 ~ 2020-02-02';
  const orders = [
    {
      state: 3,
      company: '디자인바이스퀘어 1팀',
      orderer: '김새이',
      ordererNum: '010-1111-1111',
      addr: '동대문 매장 오전 10시 이후 수령',
      remarks: '답돌이 고객 등록 (김새이)',
      orderItem: '미라클 4-712 / 2662 / 8YD',
      orderTime: `2020.02.05 10:46`,
      orderNo: 'OA20012-0514',
    }
  ]

  return (
    <>
      <Header titleText='주문조회' navigation={navigation} />
      <IconButton
        icon='close'
        size={25}
        color='white'
        onPress={() => navigation.goBack()}
        style={styles.iconButton}
      />
      <View style={styles.container}>
        <Searchbar
          placeholder="거래처,주문번호,아이템,칼라 검색 가능"
          onChangeText={query => setFirstQuery(query)}
          value={firstQuery}
          style={{ marginBottom: 20 }}
        />
        <Divider style={{ padding: 1 }}></Divider>
        <View style={styles.dateSetup}>
          <Text
            style={{ flex: 1, textAlign: 'center', fontWeight: 'bold' }}
          >
            {date}
          </Text>
          <Button
            style={{ marginRight: 10 }}
            mode='contained'
            color='#1E388D'
            onPress={() => alert('')}
          >
            기간 설정
          </Button>
        </View>
        <Divider style={{ padding: 1, backgroundColor: '#1E388D' }}></Divider>
        {orders.map((order, index) => (
          <Order
            key={index}
            navigation={navigation}
            order={order}
          />
        ))}
      </View>
      <Bottom />
    </>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  dateSetup: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 5
  },
  iconButton: {
    position: 'absolute',
    right: 0,
    top: 40,
    margin: 10
  }
})

export default OrderHistory;