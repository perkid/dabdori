import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { IconButton, DataTable, Divider } from 'react-native-paper';
import Header from '../components/Header';
import Bottom from '../components/Bottom';
import { SwipeListView } from 'react-native-swipe-list-view';

function OrderDetail({ navigation }) {

    let order = navigation.state.params;

    const orderItem =
        <SwipeListView
            data={Array(order.orderItem.length).fill(order.orderItem).map((item, i)=>({key:`${i}`, text: `${i+1}. ${item[i].name} / ${item[i].color} / ${item[i].quantity} / ${item[i].price}`, item:item[i]}))
            }
            rightOpenValue={-150}
            disableRightSwipe={true}
            renderItem={
                data=>(
                    <View style={styles.standaloneRowFront}>
                        <Text style={styles.itemFont}>{data.item.text}</Text>
                    </View>
                )
            }
            renderHiddenItem={(data, rowMap) => (
                // data.item.item 에 orderItem들어있음
                <View style={styles.standaloneRowBack}>
                        <TouchableOpacity
                            style={[
                                styles.backRightBtn,
                                styles.backRightBtnLeft,
                            ]}
                            onPress={() =>{
                                console.log('수정')
                            }
                            }
                        >
                            <Text style={{ color: 'black' }}>
                                수정
                        </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.backRightBtn,
                                styles.backRightBtnRight,
                            ]}
                            onPress={() =>
                                console.log('확인')
                            }
                        >
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                확인
                        </Text>
                        </TouchableOpacity>
                    </View>
            )
                
            }
        ></SwipeListView>

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
                <DataTable>
                    <DataTable.Row style={{ backgroundColor: 'white' }}>
                        <View style={{ flex: 4, justifyContent: 'center', paddingHorizontal: 20 }}>
                            <Text style={{ fontSize: 17 }}>배송상태</Text>
                        </View>
                        <View style={{ flex: 5 }}>
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
                            <Text style={{ lineHeight: 25 }}>{order.orderer} / {order.ordererNum}</Text>
                            <Text style={{ lineHeight: 25 }}>{order.addr}</Text>
                            <Text style={{ lineHeight: 25 }}>{order.remarks}</Text>
                        </View>
                    </DataTable.Row>
                    <DataTable.Row style={{ backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 4, justifyContent: 'center', paddingHorizontal: 20 }}>
                            <Text style={{ fontSize: 17 }}>
                                주문아이템
                            </Text>
                        </View>
                    </DataTable.Row>
                </DataTable>
                {orderItem}
            </View>
            <Bottom />
        </>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    iconButton: {
        position: 'absolute',
        right: 0,
        top: 40,
        margin: 10
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
    backRightBtnLeft: {
        backgroundColor: '#FFDC3C',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: '#1E388D',
        right: 0,
    },
})

export default OrderDetail;