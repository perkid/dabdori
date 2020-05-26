import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { DataTable, Divider, Avatar, Paragraph, Portal, Dialog, TextInput, Button } from 'react-native-paper';
import Header from '../components/Header';
import Bottom from '../components/Bottom';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useSelector, useDispatch } from 'react-redux';
import { priceConfirmRequest, setPriceFlag, setDetailRequest, setPriceCnt } from '../redux/orderManagement';

function OrderDetail({ navigation }) {
    function toCommaStringF( number ) {
        var number_string = number
        var number_parts = number_string.split('.'); 
        var regexp = /\B(?=(\d{3})+(?!\d))/g; 
        if (number_parts.length > 1) { 
            return number_parts[0].replace( regexp, ',' ) + '.' + number_parts[1]; 
       } else { 
           return number_string.replace( regexp, ',' );
        } 
    }
    const confirmStatus = useSelector(state => state.orderManagement.confirm);
    const user = useSelector(state => state.authentication.user);
    const orders = useSelector(state => state.orderManagement.orders);
    const detail = useSelector(state => state.orderManagement.detail);
    const detailStatus = useSelector(state => state.orderManagement.detailStatus);
    const dispatch = useDispatch();

    const [ visible, setVisible ] = useState(false)
    const [ price, setPrice ] = useState('')
    const [ seq, setSeq ] = useState('')
    const [ req, setReq ] = useState('');
    const dismiss = () => {
        setPrice('')
        setVisible(false)
    }

    let order = navigation.state.params;

    const apply = () => {
        if(price===''){
            Alert.alert('','단가를 입력해주세요.')
        }
        if(price!==''){
            let data = {
                orderNo: order.orderNo,
                seq: seq,
                price: price
            }
            let index = parseInt(seq)
            index = index-1
            setVisible(false)
            dispatch(priceConfirmRequest(data))
            setReq('modify')
            
        }
    }
    const confirm = (seq) => {
        let index = parseInt(seq)
        index = index-1;
        let data = {
            orderNo: order.orderNo,
            seq: seq,
            price:detail[index].price.replace(',','')
        }
        dispatch(priceConfirmRequest(data))
        setReq('confirm')
        
    }

    useEffect(()=>{
        if(confirmStatus.result==='SUCCESS'){
            let index = parseInt(seq)
            index = index-1;
            if(req==='modify'){
                detail[index].price=toCommaStringF(price)
                dispatch(setPriceFlag(index))
                if(detail[index].priceFlag===false){
                    
                    let orderNo = order.orderNo;
                    let index = orders.findIndex(order=>order.orderNo===orderNo);
                    dispatch(setPriceCnt(index))
                }
                detail[index].priceFlag=true
                setReq('')
            }
            if(req==='confirm'){
                handleFlgbtn(index)
                setReq('')
                detail[index].priceFlag=true
            }
        }
        if(confirmStatus.result==='FAIL'){
            Alert.alert('',`${confirmStatus.cause}`)
        }
        if(confirmStatus.result===`FAILURE`){
            Alert.alert('','문제가 발생하였습니다. 담당자에게 문의하세요.')
        }

    }, [confirmStatus])

    let date = order.reg_dt.split(' ');
    let week = ['일', '월', '화', '수', '목', '금', '토'];
    let dayOfWeek = week[new Date(date[0]).getDay()];
    let time = date[1].substring(0, 5);
    let addr;
    let remark;
    let phone_number;
    let user_name;
    let jungsan=[];
    let userRole;
    if(order.orderStatusNm==='진행중'){
        if(order.muljisino_print_yn!==0){
            order.orderStatusNm='AMEND중';
        }
    }

    const handleFlgbtn = (key) => {
        let orderNo = order.orderNo;
        let index = orders.findIndex(order=>order.orderNo===orderNo);
        dispatch(setPriceCnt(index))
        dispatch(setPriceFlag(key))
    };
    
    useEffect(()=>{
        dispatch(setDetailRequest(order.orderNo))
    },[order])

    if(detail.length!==0){
        addr=detail[0].chulGbnNm
        remark=detail[0].remark
        phone_number=detail[0].phone_number
        user_name=detail[0].user_name
        jungsan=detail.filter(item=>item.jungsan_yn==='0')
    }
    if(user.status === undefined){
        userRole=user.role;
    }
    if(detailStatus==='FAILURE'){
        Alert.alert('','문제가 발생하였습니다. 담당자에게 문의하세요.')
    }
    const orderItem =
        <SwipeListView
            data={Array(detail.length).fill(detail).map((item, i) => ({ key: `${i}`, text: `${i + 1}. ${item[i].itemName} / ${item[i].colorYW} / ${item[i].qty}YD / ${item[i].price} 원`, item: item[i] }))
            }
            rightOpenValue={jungsan.length>0?(detail.priceFlag)?-75:-150:undefined}
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
            renderHiddenItem={(order.state == 3 || order.state == 4 || userRole !== 'employee') ? undefined : (data, rowMap) => (
                // data.item.item 에 orderItem들어있음
                <View style={styles.standaloneRowBack}>
                    {data.item.item.jungsan_yn==='0'? <TouchableOpacity
                        style={(data.item.item.priceFlag)?[
                            styles.backRightBtn,
                            styles.backRightBtnLeft2,
                        ]:[
                            styles.backRightBtn,
                            styles.backRightBtnLeft1,
                        ]}
                        onPress={() => {
                            setVisible(true)
                            setSeq(data.item.item.seq)
                        }
                        }
                    >
                        <Text style={{ color: 'black' }}>
                            수정
                        </Text>
                    </TouchableOpacity>:undefined}
                    {data.item.item.jungsan_yn==='0'?
                    
                        (data.item.item.priceFlag)?
                     undefined : <TouchableOpacity
                     style={[
                         styles.backRightBtn,
                         styles.backRightBtnRight,
                     ]}
                     onPress={() =>{
                        setSeq(data.item.item.seq)
                         confirm(data.item.item.seq)
                     }
                     }
                 >
                     <Text style={{ color: 'white', fontWeight: 'bold' }}>
                         확인
                     </Text>
                 </TouchableOpacity> 
                    :undefined}
                    
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
                                    <Avatar.Icon size={30} style={order.orderStatusNm === '진행중' ? { backgroundColor: '#F9E920' } : { backgroundColor: '#EAEAEA' }}></Avatar.Icon>
                                    <Paragraph>접수</Paragraph>
                                </View>
                                <View style={styles.deliveryStatus}>
                                    <Avatar.Icon size={30} style={order.orderStatusNm === 'AMEND중' ? { backgroundColor: '#98BE4E' } : { backgroundColor: '#EAEAEA' }}></Avatar.Icon>
                                    <Paragraph>준비</Paragraph>
                                </View>
                                <View style={styles.deliveryStatus}>
                                    <Avatar.Icon size={30} style={order.orderStatusNm === '출고완료' ? { backgroundColor: '#1E388D' } : { backgroundColor: '#EAEAEA' }}></Avatar.Icon>
                                    <Paragraph>완료</Paragraph>
                                </View>
                                <View style={styles.deliveryStatus}>
                                    <Avatar.Icon size={30} style={order.orderStatusNm === 'CANCEL'? { backgroundColor: 'gray' } : { backgroundColor: '#EAEAEA' }}></Avatar.Icon>
                                    <Paragraph>취소</Paragraph>
                                </View>
                            </View>
                        </View>
                    </DataTable.Row>
                    <DataTable.Row style={{ height: 80, backgroundColor: '#1E388D', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 4, justifyContent: 'center', paddingHorizontal: 20 }}>
                            <Text style={{ color: 'white' }}>{order.custName}</Text>
                        </View>
                        <View style={{ flex: 5 }}>
                            <Text style={{ color: 'white', lineHeight: 25 }}>주문번호 {order.orderNo}</Text>
                            <Text style={{ color: 'white', lineHeight: 25 }}>주문시간 {date[0]}.{dayOfWeek}.{time}</Text>
                        </View>
                    </DataTable.Row>
                    <DataTable.Row style={{ height: 100, backgroundColor: '#EAEAEA', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 4, paddingHorizontal: 20 }}>
                            <Text style={{ lineHeight: 25 }}>1. 주문자명</Text>
                            <Text style={{ lineHeight: 25 }}>2. 배송주소</Text>
                            <Text style={{ lineHeight: 25 }}>3. 비고사항</Text>
                        </View>
                        <View style={{ flex: 5 }}>
                            <Text style={{ lineHeight: 25 }}>{user_name} {phone_number !== '' ? `/ ${phone_number}` : undefined}</Text>
                            <Text style={{ lineHeight: 25 }}>{addr}</Text>
                            <Text style={{ lineHeight: 25 }}>{remark}</Text>
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
            <Portal>
                <Dialog
                    visible={visible}
                    onDismiss={() => dismiss()}
                    style={{marginBottom:350}}>
                <Dialog.Title style={{textAlign:'center'}}>단가수정</Dialog.Title>
                <Dialog.Content style={{alignItems:'center'}}>
              <Paragraph>변경 할 단가를 입력해주세요.</Paragraph>
              <TextInput
                label='단가입력'
                style={styles.input}
                theme={{ colors }}
                vlaue={price}
                onChangeText={text => setPrice(text)}
              />
            </Dialog.Content>
            <Dialog.Actions style={{ justifyContent: 'center', marginVertical: 25 }}>
                    <Button
                        mode='outlined'
                        color='#1E388D'
                        onPress={() => dismiss()}
                        style={{ width: '40%', marginHorizontal: 10 }}
                    >
                        취소
                  </Button>
                    <Button
                        mode='contained'
                        color='#1E388D'
                        onPress={() => apply()}
                        style={{ width: '40%', marginHorizontal: 10 }}
                    >
                        완료
                </Button>
                </Dialog.Actions>
                </Dialog>
            </Portal>
            <Bottom />
        </>
    )
};

const colors = {
    Text: '#000000',
    primary: '#1E388D',
    underlineColor: 'transparent',
}

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
    input: {
        width: '85%',
        backgroundColor: '#FFF',
        margin: 20
    },
})

export default OrderDetail;