import React from 'react';
import { View, ScrollView } from 'react-native';
import { Card, Avatar, Title, Caption, Paragraph, Button } from 'react-native-paper';

function Order({ navigation, order }) {
  let itemLength = order.orderItem.length;
  let company = order.company;
  let orderItem = (itemLength>1) ?`${order.orderItem[0].name} / ${order.orderItem[0].color} 외 ${itemLength-1}건` : `${order.orderItem[0].name} / ${order.orderItem[0].color} / ${order.orderItem[0].quantity}`;
  let orderTime = order.orderTime;
  let orderNo = order.orderNo;
  let orderState;
  switch (order.state) {
    case 1:
      
      break;
  
    case 2:

      break;
    case 3:
      orderState= <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Avatar.Icon size={40}></Avatar.Icon>
        <Paragraph>완료</Paragraph>
      </View>
      break;
    case 4:

      break;
    default:
      break;
  }
  return (
    <ScrollView>
      <Card
        style={{ height: 85, marginTop: 20, borderLeftWidth: 5, borderLeftColor: '#1E388D' }}
        onPress={() => navigation.navigate('OrderDetail', order)}
      >
        <Card.Content
          style={{ marginTop: -15, flexDirection: 'row', justifyContent: 'space-between'}}
        >
         <View style={{justifyContent:'center' }}>
         {orderState}
         </View>
          <View style={{ marginLeft: 10 ,width:"58%" }}>
            <Title style={{ fontSize: 15 }}>{company}</Title>
            <Caption style={{ fontSize: 10 }}>{orderItem}</Caption>
            <Caption style={{ fontSize: 10 }}>{orderTime}</Caption>
          </View>
          <View style={{ alignItems: 'center'  }}>
            <Caption>{orderNo} ></Caption>
            {(order.flagBtn ? <Button
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
    </ScrollView>
  )
}

export default Order;