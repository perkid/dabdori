import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, StyleSheet, Text } from 'react-native';
import { Button, Searchbar, Divider } from 'react-native-paper';
import Header from '../components/Header';
import Bottom from '../components/Bottom';
import Order from '../components/Order';
import PerriodSetting from '../components/PeriodSetting';
import { ScrollView } from 'react-native-gesture-handler';

function OrderHistory({ navigation }) {
  const orders = useSelector(state => state.orderManagement.orders);
  const [firstQuery, setFirstQuery] = useState('');
  const [visible, setVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date('2018-01-01'));
  const [endDate, setEndDate] = useState(new Date());
  const [role, setRole] = useState('all');
  const [status, setStatus] = useState('all');

  const _showDialog = () => setVisible(true)
  const _hideDialog = () => setVisible(false)

  const handleRole = (select) => {
    setRole(select);
  }
  const handleStatus = (select) => {
    setStatus(select);
  }

  const getFormatDate = (date) => {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
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

  let foundOrders = orders.filter(order =>
    getFormatDate(startDate) <= order.orderTime.substring(0, 10) && getFormatDate(endDate) >= order.orderTime.substring(0, 10)
  )


  if (status !== 'all') {
    foundOrders = foundOrders.filter(order =>
      order.state == status
    )
  }
  if (role === '1') {
    foundOrders = foundOrders.filter(order =>
      order.remarks === '답돌이 직원 등록'
    )
  }
  if (role ==='2') {
    foundOrders = foundOrders.filter(order => 
      order.remarks !== '답돌이 직원 등록'
      )
  }
  
  if (firstQuery !== '') {
    foundOrders = foundOrders.filter(order =>
      order.company.indexOf(firstQuery) >= 0 ||
      order.orderNo.indexOf(firstQuery) >= 0 ||
      order.orderItem[0].name.indexOf(firstQuery) >= 0 ||
      order.orderItem[0].color.indexOf(firstQuery) >= 0
    )
  }

  const handleStartDate = (date) => {
    setStartDate(date);
  }

  const handleEndDate = (date) => {
    setEndDate(date);
  }

  return (
    <>
      <Header titleText='주문조회' navigation={navigation} />
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
            handleRole={handleRole}
            handleStatus={handleStatus}
          />
        </View>
        <Divider style={{ padding: 1, backgroundColor: '#1E388D' }}></Divider>
        <ScrollView>
          {foundOrders.map((order, index) => (
            <Order
              key={index}
              navigation={navigation}
              order={order}
            />
          ))}
        </ScrollView>
      </View>
      <Bottom />
    </>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 40
  },
  dateSetup: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 5
  }

})

export default OrderHistory;