import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, IconButton, Searchbar, Divider } from 'react-native-paper';
import Header from '../components/Header';
import Bottom from '../components/Bottom';
import Order from '../components/Order';
import PerriodSetting from '../components/PeriodSetting';

function OrderHistory({ navigation }) {
  const [firstQuery, setFirstQuery] = useState('');
  const [visible, setVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date('2018-01-01'));
  const [endDate, setEndDate] = useState(new Date());
  const _showDialog = () => setVisible(true)
  const _hideDialog = () => setVisible(false)

  const getFormatDate = (date) => {
    var year = date.getFullYear();
    var month = date.getMonth() + 1
    var day = date.getDate();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    return `${year}-${month}-${day}`;
  }

  const period = `${getFormatDate(startDate)} ~ ${getFormatDate(endDate)}`;

  const handleStartDate = (date) => {
    setStartDate(date);
  }

  const handleEndDate = (date) => {
    setEndDate(date);
  } 

  const orders = [
    {
      state: 3,
      company: '디자인바이스퀘어 1팀',
      orderer: '김새이',
      ordererNum: '010-1111-1111',
      addr: '동대문 매장 오전 10시 이후 수령',
      remarks: '답돌이 고객 등록 (김새이)',
      orderItem: [
        {
          name: 'JERRY(제리) 2AFPP617',
          color: '9920',
          quantity: '4YD',
          price: '7,500원',
        },
        {
          name: '미라클 4-712',
          color: '2662',
          quantity: '8YD',
          price: '7,000원',
        }
      ],
      orderTime: `2020.02.05 10:46`,
      orderNo: 'OA20012-0514',
      flagBtn: true
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
            {period}
          </Text>
          <Button
            style={{ marginRight: 10 }}
            mode='contained'
            color='#1E388D'
            onPress={() => _showDialog()}
          >
            기간 설정
          </Button>
          <PerriodSetting
            visible={visible}
            _hideDialog={_hideDialog}
            startDate={startDate}
            endDate={endDate}
            getFormatDate={getFormatDate}
            handleStartDate={handleStartDate}
            handleEndDate={handleEndDate}
          />
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
  },

})

export default OrderHistory;