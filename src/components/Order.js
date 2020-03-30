import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Avatar, Title, Caption, Paragraph, Button } from 'react-native-paper';

function Order({ navigation, order }) {
  let itemLength = order.detailCounter;
  let company = order.custName;
  let orderItem = (itemLength>1) ?`${order.itemName} / ${order.colorYW} 외 ${itemLength-1}건` : `${order.itemName} / ${order.colorYW}`;
  let date = order.reg_dt.split(' ');
  let time = date[1].substring(0, 5);
  let orderTime = date[0]+' '+time;
  let orderNo = order.orderNo;
  let orderState;
  let style = styles.style1;
  switch (order.orderStatusNm) {
    
    case '진행중':
      if(order.muljisino_print_yn===0){
        orderState= <View style={{ justifyContent: 'center', alignItems: 'center'}}>
        <Avatar.Icon size={40} style={{backgroundColor:'#F9E920'}}></Avatar.Icon>
          <Paragraph>접수</Paragraph>
        </View>
      } else {
        orderState= <View style={{ justifyContent: 'center', alignItems: 'center'}}>
        <Avatar.Icon size={40} style={{backgroundColor:'#98BE4E'}}></Avatar.Icon>
          <Paragraph>준비</Paragraph>
        </View>
      }
      break;
  
    case 'AMEND중':
      orderState= <View style={{ justifyContent: 'center', alignItems: 'center'}}>
      <Avatar.Icon size={40} style={{backgroundColor:'#98BE4E'}}></Avatar.Icon>
        <Paragraph>준비</Paragraph>
      </View>
      break;
    case '출고완료':
      orderState= <View style={{ justifyContent: 'center', alignItems: 'center'}}>
      <Avatar.Icon size={40} style={{backgroundColor:'#1E388D'}}></Avatar.Icon>
        <Paragraph>완료</Paragraph>
      </View>
      break;
    case 'CANCEL':
      orderState= <View style={{ justifyContent: 'center', alignItems: 'center'}}>
      <Avatar.Icon size={40} style={{backgroundColor:'gray'}}></Avatar.Icon>
        <Paragraph>취소</Paragraph>
      </View>
      break;
    default:
      break;
  }
  return (
    <View>
      <Card
        style={style}
        onPress={() => navigation.navigate('OrderDetail', order)}
      >
        <Card.Content
          style={{ marginTop: -15, flexDirection: 'row', justifyContent: 'space-between'}}
        >
         <View style={{justifyContent:'center' }}>
         {orderState}
         </View>
          <View style={{ marginLeft: 25 ,width:"55%" }}>
            <Title style={{ fontSize: 15 }}>{company}</Title>
            <Caption style={{ fontSize: 10 }}>{orderItem}</Caption>
            <Caption style={{ fontSize: 10 }}>{orderTime}</Caption>
          </View>
          <View style={{ alignItems: 'center'  }}>
            <Caption>{orderNo} ></Caption>
            {(order.priceFlagCnt > "0" ? <Button
              style={{ marginTop: 20, borderRadius: 90, width: 80 }}
              labelStyle={{ fontSize: 10 }}
              mode='contained'
              color='#1E388D'
            >
              단가입력
              </Button> : undefined )}
          </View>
        </Card.Content>
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  style1 : {
    height: 85,
    marginTop: 6,
    borderLeftWidth: 5,
    borderLeftColor: '#1E388D'
  },
  style2 : {
    height: 85,
    marginTop: 6,
    borderLeftWidth: 5,
    borderLeftColor: 'white'
  }
})

export default Order;