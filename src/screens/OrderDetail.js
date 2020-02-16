import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, IconButton, Divider, Avatar, Paragraph, DataTable } from 'react-native-paper';
import Header from '../components/Header';
import Bottom from '../components/Bottom';

function OrderDetail({ navigation }) {

    let order = navigation.state.params;

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
                    <DataTable.Row style={{ height: '8%', backgroundColor: 'white' }}>
                        <View style={{ flex: 4, justifyContent: 'center', paddingHorizontal: 20 }}>
                            <Text>배송상태</Text>
                        </View>
                        <View style={{ flex: 5 }}>
                        </View>
                    </DataTable.Row>
                    <DataTable.Row style={{ height: '12%', backgroundColor: '#1E388D', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 4, justifyContent: 'center', paddingHorizontal: 20 }}>
                            <Text style={{ color: 'white' }}>{order.company}</Text>
                        </View>
                        <View style={{ flex: 5 }}>
                            <Text style={{ color: 'white', lineHeight: 25 }}>주문번호 {order.orderNo}</Text>
                            <Text style={{ color: 'white', lineHeight: 25 }}>주문시간 {order.orderTime}</Text>
                        </View>
                    </DataTable.Row>
                    <DataTable.Row style={{ height: '12%', backgroundColor: '#EAEAEA', flexDirection: 'row', alignItems: 'center' }}>
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
                    <DataTable.Row style={{ height: '8%', backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 4, justifyContent: 'center', paddingHorizontal: 20 }}>
                            <Text>
                                주문아이템
                            </Text>
                        </View>
                    </DataTable.Row>
                    <DataTable.Row style={{ height: '60%', backgroundColor: "white", }} >
                    </DataTable.Row>
                </DataTable>
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
    }
})

export default OrderDetail;