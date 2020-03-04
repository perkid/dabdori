import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { DataTable, Divider, Avatar, Paragraph } from 'react-native-paper';
import Header from '../components/Header';
import Bottom from '../components/Bottom';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useSelector, useDispatch } from 'react-redux';
import { prcieConfirm } from '../redux/orderManagement';

function OrderDetail({ navigation }) {

    const orders = useSelector(state => state.orderManagement.orders);
    const dispatch = useDispatch();
    let order = navigation.state.params;
    const handleFlgbtn = () => {
        dispatch(prcieConfirm(order.orderNo))
        order.flagBtn=false
    };

    const orderItem =
        <SwipeListView
            data={Array(order.orderItem.length).fill(order.orderItem).map((item, i) => ({ key: `${i}`, text: `${i + 1}. ${item[i].name} / ${item[i].color} / ${item[i].quantity} / ${item[i].price}`, item: item[i] }))
            }
            rightOpenValue={(order.flagBtn)?-150:-75}
            disableRightSwipe={true}
            renderItem={
                data => (
                    <View>
                        <View style={styles.standaloneRowFront}>
                            <Text style={styles.itemFont}>{data.item.text}</Text>
                        </View>
                    </View>
                )
            }
            renderHiddenItem={(order.state == 3 || order.state == 4) ? undefined : (data, rowMap) => (
                // data.item.item 에 orderItem들어있음
                <View style={styles.standaloneRowBack}>
                    <TouchableOpacity
                        style={(order.flagBtn)?[
                            styles.backRightBtn,
                            styles.backRightBtnLeft1,
                        ]:[
                            styles.backRightBtn,
                            styles.backRightBtnLeft2,
                        ]}
                        onPress={() => {
                            console.log('수정')
                        }
                        }
                    >
                        <Text style={{ color: 'black' }}>
                            수정
                        </Text>
                    </TouchableOpacity>
                    {
                        (order.flagBtn)?
                    <TouchableOpacity
                        style={[
                            styles.backRightBtn,
                            styles.backRightBtnRight,
                        ]}
                        onPress={() =>{
                            console.log('확인')
                            handleFlgbtn()
                        }
                        }
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>
                            확인
                        </Text>
                    </TouchableOpacity> : undefined
                    }
                </View>
            )

            }
        ></SwipeListView>

    return (
        <>
            <Header titleText='주문조회' navigation={navigation} />

            <View style={styles.container}>
                <DataTable>
                    <DataTable.Row style={{ backgroundColor: 'white', height: 60 }}>
                        <View style={{ flex: 4, justifyContent: 'center', paddingHorizontal: 20 }}>
                            <Text style={{ fontSize: 17 }}>배송상태</Text>
                        </View>
                        <View style={{ flex: 7, alignContent: 'center', justifyContent: 'center' }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                <View style={styles.deliveryStatus}>
                                    <Avatar.Icon size={30} style={order.state === 1 ? { backgroundColor: '#F9E920' } : { backgroundColor: '#EAEAEA' }}></Avatar.Icon>
                                    <Paragraph>접수</Paragraph>
                                </View>
                                <View style={styles.deliveryStatus}>
                                    <Avatar.Icon size={30} style={order.state === 2 ? { backgroundColor: '#98BE4E' } : { backgroundColor: '#EAEAEA' }}></Avatar.Icon>
                                    <Paragraph>준비</Paragraph>
                                </View>
                                <View style={styles.deliveryStatus}>
                                    <Avatar.Icon size={30} style={order.state === 3 ? { backgroundColor: '#1E388D' } : { backgroundColor: '#EAEAEA' }}></Avatar.Icon>
                                    <Paragraph>완료</Paragraph>
                                </View>
                                <View style={styles.deliveryStatus}>
                                    <Avatar.Icon size={30} style={order.state === 4 ? { backgroundColor: 'gray' } : { backgroundColor: '#EAEAEA' }}></Avatar.Icon>
                                    <Paragraph>취소</Paragraph>
                                </View>
                            </View>
                        </View>
                    </DataTable.Row>
                    <DataTable.Row style={{ height: 80, backgroundColor: '#1E388D', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 4, justifyContent: 'center', paddingHorizontal: 20 }}>
                            <Text style={{ color: 'white' }}>{order.company}</Text>
                        </View>
                        <View style={{ flex: 5 }}>
                            <Text style={{ color: 'white', lineHeight: 25 }}>주문번호 {order.orderNo}</Text>
                            <Text style={{ color: 'white', lineHeight: 25 }}>주문시간 {order.orderTime}</Text>
                        </View>
                    </DataTable.Row>
                    <DataTable.Row style={{ height: 100, backgroundColor: '#EAEAEA', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 4, paddingHorizontal: 20 }}>
                            <Text style={{ lineHeight: 25 }}>1. 주문자명</Text>
                            <Text style={{ lineHeight: 25 }}>2. 배송주소</Text>
                            <Text style={{ lineHeight: 25 }}>3. 비고사항</Text>
                        </View>
                        <View style={{ flex: 5 }}>
                            <Text style={{ lineHeight: 25 }}>{order.orderer} {order.ordererNum !== '' ? `/ ${order.ordererNum}` : undefined}</Text>
                            <Text style={{ lineHeight: 25 }}>{order.addr}</Text>
                            <Text style={{ lineHeight: 25 }}>{order.remarks}</Text>
                        </View>
                    </DataTable.Row>
                    <DataTable.Row style={{ backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', height: 60 }}>
                        <View style={{ flex: 4, justifyContent: 'center', paddingHorizontal: 20 }}>
                            <Text style={{ fontSize: 17 }}>
                                주문아이템
                            </Text>
                        </View>
                    </DataTable.Row>
                </DataTable>
                <Divider style={{ padding: 0.3, backgroundColor: 'black' }} />
                {orderItem}
            </View>
            <Bottom />
        </>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 55
    },
    deliveryStatus: {
        paddingHorizontal: 15,
        paddingTop: 5,
        alignItems: 'center'
    },
    orderItem: {
        backgroundColor: 'white',
    },
    standaloneRowFront: {
        backgroundColor: 'white',
        justifyContent: 'center',
        height: 50,
    },
    standaloneRowBack: {
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
    },
    itemFont: {
        marginLeft: 30,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft1: {
        backgroundColor: '#FFDC3C',
        right: 75,
    },
    backRightBtnLeft2: {
        backgroundColor: '#FFDC3C',
        right: 0,
    },
    backRightBtnRight: {
        backgroundColor: '#1E388D',
        right: 0,
    },
})

export default OrderDetail;