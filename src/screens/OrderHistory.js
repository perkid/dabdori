import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, StyleSheet, Text, Image, Platform, Dimensions } from 'react-native';
import { Button, Searchbar, Divider } from 'react-native-paper';
import Header from '../components/Header';
import Order from '../components/Order';
import { setOrderRequest } from '../redux/order';
import PerriodSetting from '../components/PeriodSetting';
import { ScrollView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import Tab from '../components/Tab';
import Fab from 'rn-fab';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import getActions from '../static/FABaction';

function OrderHistory({ navigation }) {

  const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

  const r = viewportWidth/12;
  const t = Platform.OS==='ios' ? 45 : 25;

  const iPhone8 = viewportHeight < 812
  const iPad = r > 85

  const user = useSelector(state => state.authentication.user);
  const orders = useSelector(state => state.order.orders);
  const [firstQuery, setFirstQuery] = useState('');
  const [visible, setVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date('2019-01-01'));
  const [endDate, setEndDate] = useState(new Date());
  const [status, setStatus] = useState('all');
  const dispatch = useDispatch();
  const orderStatus = useSelector(state => state.order.orderStatus);
  const _showDialog = () => setVisible(true)
  const _hideDialog = () => setVisible(false)

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
  const getEndDate = (date) => {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate() + 1;

    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    return `${year}-${month}-${day}`;
  }

  const period = `${getFormatDate(startDate)} ~ ${getFormatDate(endDate)}`;

  let foundOrders = orders;
  
  if (status !== 'all') {
    let state;
    let sub;
    switch (status) {
      case '1':
        state = '진행중';
        sub = 'AMEND중';
        break;
      case '2':
        state = '진행중';
        break;
      case '3':
        state = '출고완료';
        break;
      case '4':
        state = 'CANCEL';
      default:
        break;
    }

    foundOrders = foundOrders.filter(order =>
      order.orderStatusNm == state ||
      order.orderStatusNm == sub
    )
  }

  if (firstQuery !== '') {
    foundOrders = foundOrders.filter(order =>
      order.custName.indexOf(firstQuery) >= 0 ||
      order.orderNo.indexOf(firstQuery) >= 0 ||
      order.itemName.indexOf(firstQuery) >= 0 ||
      order.colorYW.indexOf(firstQuery) >= 0
    )
  }

  const handleStartDate = (date) => {
    setStartDate(date);
  }

  const handleEndDate = (date) => {
    setEndDate(date);
  }

  useEffect(() => {
    let id = user.role === 'employee' ? user.erp_id : user.object_id;
    let data = {
      erp_id: id,
      start_date: getFormatDate(startDate),
      end_date: getEndDate(endDate)
    }
    dispatch(setOrderRequest(data))
  }, [period])
  if(orderStatus==='FAILURE'){
    Alert.alert('','문제가 발생하였습니다. 담당자에게 문의하세요.')
}

const actions = getActions(user.role!=='employee')
    
const version = user.user_name==='이성재'||user.user_name==='고유준'?'v4.0.7':''

  return (
    <>
      <Header titleText='주문조회' navigation={navigation} auth={true} app={true}/>
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
            handleStatus={handleStatus}
          />
        </View>
        <Divider style={{ padding: 1, backgroundColor: '#1E388D' }}></Divider>
        <ScrollView>
          {foundOrders.length===0 ? <View style={{width:'100%', alignItems:'center', marginTop: 20}}><Text>검색된 결과가 없습니다.</Text></View> : foundOrders.map((order, index) => (
            <Order
              key={index}
              navigation={navigation}
              order={order}
            />
          ))}
        </ScrollView>
      {version!==''?<View style={{alignItems:'flex-end'}}><Text>{version}</Text></View>:undefined}
      </View>
      <Tab navigation={navigation}/>
      <Fab
            actions={actions}
            style={iPad?{right:35, top: 25}:iPhone8?{right: 25, top: 20}:{right: r, top: t}}
            rotation={"0deg"}
            onPress={name => {
                if(name == "btn_cart"){
                  navigation.navigate('Cart', user)
                }
                if(name == "btn_order"){
                  navigation.navigate('OrderHistory', user)
                }
                if(name == "btn_user"){
                  navigation.navigate('MyPage', user)
                }
                if(name == "btn_qna"){
                  navigation.navigate('QNA', user)
                }
                if(name == "btn_test"){
                  showTest()
                }
            }}
            />
      {/* <Bottom /> */}
    </>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 90
  },
  dateSetup: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 5
  },
  icon:{
    height:25,
    width:25
  },

})

export default OrderHistory;