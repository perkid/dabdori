import React from 'react';
import { View, ScrollView } from 'react-native';
import { Card, Avatar, Title, Caption, Paragraph, Button } from 'react-native-paper';

function Order({ navigation, order }) {
  let company = order.company;
  let orderItem = order.orderItem;
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
          style={{ marginTop: -15, flexDirection: 'row', justifyContent: 'space-between' }}
        >
         {orderState}
          <View style={{ marginLeft: 30 }}>
            <Title style={{ fontSize: 15 }}>{company}</Title>
            <Caption style={{ fontSize: 10 }}>{orderItem}</Caption>
            <Caption style={{ fontSize: 10 }}>{orderTime}</Caption>
          </View>
          <Title></Title>
          <View style={{ marginLeft: '10%', alignItems: 'center' }}>
            <Caption>{orderNo}    ></Caption>
            <Button
              style={{ marginTop: 20, borderRadius: 90, width: 80 }}
              labelStyle={{ fontSize: 10 }}
              mode='contained'
              color='#1E388D'
            >
              단가입력
              </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  )
}

export default Order;