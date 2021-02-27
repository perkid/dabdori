import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../components/Header';
import CartItem from '../components/CartItem';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { DataTable, Checkbox, Button, Portal, Dialog, TextInput } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { setCartListRequest, deleteCartItemRequest, selectItem, cancelItem, createOrderRequest, createOrder } from '../redux/cart';

function Cart({ navigation }){
    const userInfo = navigation.state.params;
    const [ allCheckedState, setAllCheckedState] = useState(false);
    const [ allChecked , setAllChecked ] = useState(false);
    const [ visible, setVisible ] = useState(false);
    const [ orderVisible, setOrderVisible ] = useState(false);
    const [ remarkVisible, setRemarkVisible ] = useState(false);
    const [ method, setMethod ] = useState('');
    const [ vTime, setVTime ] = useState('');
    const [ remark, setRemark ] = useState('');
    const [ orderList, setOrderList ] = useState([]);
    const [ order, setOrder ] = useState({});
    const [ refresh, setRefresh ] = useState(0);
    const dispatch = useDispatch();

    const showMethodModal = () => {
        if(selectIndex.length===0){
            Alert.alert('','한 개 이상의 상품을 선택해주세요.')
        } else {
            setVisible(true)
        }
    };
    
    const hideMethodModal = () => setVisible(false);
    
    const showOrderModal = () => setOrderVisible(true);
    
    const hideOrderModal = () => setOrderVisible(false);
    
    const showRemarkModal = () => setRemarkVisible(true);

    const hideRemarkModal = () => {
        setRemarkVisible(false);
        setRemark('');
    }

    const cartItems = useSelector(state => state.cart.cartList);
    const selectIndex = useSelector(state => state.cart.selectItem);
    const createOrderStatus = useSelector(state => state.cart.createOrderStatus);

    const handleAllChekedState = () => {
        setAllCheckedState(!allCheckedState)
        setAllChecked(!allCheckedState)
    }

    const handleAllCheked = () => {
        setAllCheckedState(false)
    }

    const handleSelect = (type, index) => {
        if(type==='select'){
            dispatch(selectItem(index))
        }
        if(type==='cancel'){
            dispatch(cancelItem(index))
        }
        if(type==='cancelAll'){
            dispatch(cancelItem('all'))
        }
    }

    const deleteCartItem = (type) => {
        let selectItem = []
        if(type==='select'&&selectIndex.length===0){
            Alert.alert('','선택된 아이템이 없습니다.')
        }
        if(type==='select'){
            selectIndex.forEach((i)=>{
                selectItem.push({
                    user_id:userInfo.object_id,
                    item_code:cartItems[i].item_code,
                    color_code:cartItems[i].color_code
                })
            })
            // console.log(selectItem)
            selectIndex.forEach((i)=>{
                dispatch(cancelItem(i))
            })
            dispatch(deleteCartItemRequest(selectItem))
            setRefresh(refresh+1)
            // dispatch(setCartListRequest(userInfo.object_id))
        }
        if(type==='all'){
            cartItems.forEach((i)=>{
                selectItem.push({
                    user_id:userInfo.object_id,
                    item_code:i.item_code,
                    color_code:i.color_code
                })
            })
            // console.log(selectItem)
            selectIndex.forEach((i)=>{
                dispatch(cancelItem(i))
            })
            dispatch(deleteCartItemRequest(selectItem))
            setRefresh(refresh+1)
            // dispatch(setCartListRequest(userInfo.object_id))
        }
    }

    const handelCreateOrder = (type) => {
        let date = new Date();
        let hour = date.getHours();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let time;

        if (month < 10) {
            month = "0" + month;
        }

        if (day < 10) {
            day = "0" + day;
        }
        let tmpOrder = {
            company_code: userInfo.company_code,
            delyDate: '',
            deli_type: '',
            dept: userInfo.dept,
            remark: '',
            manager_id: userInfo.manager_id,
            object_id: userInfo.object_id,
            detailList: []
        }

        let orderText;
        orderText = selectIndex.map((i,index)=>(
            <View key={index}>
                <Text>
                    {`${index+1}. ${cartItems[i].itemName} / ${cartItems[i].colorYW} / ${cartItems[i].amount}YD`}
                </Text>
                <Text/>
            </View>
        ))
        selectIndex.forEach((i)=>{
            tmpOrder.detailList.push({
                company_code: userInfo.company_code,
                item_name: cartItems[i].itemName,
                item_code: cartItems[i].item_code,
                color_code: cartItems[i].color_code,
                colorYW: cartItems[i].colorYW,
                amount: cartItems[i].amount,
                price: cartItems[i].price
            })
        })

        if (method === '영업사원 직접전달') {
            tmpOrder.delyDate = `${year}-${month}-${day}`;
            tmpOrder.deli_type = 20;
            tmpOrder.remark = (userInfo.role === 'employee') ? '답돌이 직원 등록' : `답돌이 고객 등록 (${userInfo.user_name})`;
            setVTime('')
        }
        if (method === '거래처(택배)') {
            tmpOrder.delyDate = `${year}-${month}-${day}`;
            tmpOrder.deli_type = 30;
            tmpOrder.remark = (userInfo.role === 'employee') ? '답돌이 직원 등록' : `답돌이 고객 등록 (${userInfo.user_name})`;
            setVTime('')
        }

        if (method === '매장') {
            if (hour < 14) {
                tmpOrder.delyDate = `${year}-${month}-${day}`;
            }
            else if (hour >= 14) {
                day = day + 1
                tmpOrder.delyDate = `${year}-${month}-${day}`;
            }
            if (hour >= 11 && hour < 14) {
                tmpOrder.deli_type = 11;
                time = '2타임'
                setVTime(time)
            } else {
                tmpOrder.deli_type = 10;
                time = '1타임'
                setVTime(time)
            }
            tmpOrder.remark = (userInfo.role === 'employee') ? '답돌이 직원 등록' : `답돌이 고객 등록 (${userInfo.user_name})`;
        }
        

        setOrderList(orderText)
        setOrder(tmpOrder)

        if(type==='addRemark') {
            tmpOrder.remark += ' '+ remark
            createOrder(tmpOrder)
        }
    }
    
    const createOrder = (order) => {
        // console.log(order)
        dispatch(createOrderRequest(order, userInfo))
    }

    useEffect(()=>{
        let id = userInfo.object_id;
        dispatch(setCartListRequest(id))
    }, [refresh])

    useEffect(()=>{
        handelCreateOrder() 
    }, [orderVisible])

    useEffect(()=> {
        if(createOrderStatus.status==='SUCCESS'){
            Alert.alert('',`샘플 신청이 완료 되었습니다.`)
            deleteCartItem('select')
        }
        if(createOrderStatus.status==='FAILURE'){
            Alert.alert('',`${createOrderStatus.cause}`)
        }
    }, [createOrderStatus])

    return (
        <>
            <Header titleText='장바구니' navigation={navigation}/>
            <View style={styles.container}>
                <View style={{width:'100%', padding:20}}><Text>장바구니 아이템은 당일 자정이 지나면 모두 사라집니다.</Text></View>
                <DataTable style={{marginLeft:10, maxHeight:300}}>
                    <DataTable.Header style={{justifyContent:'center', alignItems:'center'}}>
                        <Checkbox.Android status={allCheckedState ? 'checked' : 'unchecked'} onPress={()=>{handleAllChekedState()}} color='#1E388D'></Checkbox.Android>
                        <DataTable.Title style={styles.tableText}><Text style={styles.titleText}>아이템명</Text></DataTable.Title>
                        <DataTable.Title style={styles.tableText}><Text style={styles.titleText}>컬러명</Text></DataTable.Title>
                        <DataTable.Title style={styles.tableText}><Text style={styles.titleText}>수량(YD)</Text></DataTable.Title>
                    </DataTable.Header>
                    <ScrollView>
                    {cartItems.length===0 ? <View style={{paddingVertical:20, paddingTop:35, alignItems:'center'}}><Text>장바구니에 담긴 상품이 없습니다.</Text></View>:
                        <>
                        {
                            cartItems.map((item, index)=> (
                                <CartItem
                                    key={index}
                                    index={index}
                                    item={item}
                                    allChecked={allChecked}
                                    allCheckedState={allCheckedState}
                                    handleAllCheked={handleAllCheked}
                                    cnt={selectIndex.length}
                                    handleSelect={handleSelect}
                                />
                            ))
                        }
                        </>
                    }
                    </ScrollView>
                </DataTable>
                <View style={{flexDirection:'row', padding: 20, width:'100%', justifyContent:'space-between'}}>
                    <Button
                        color='red'
                        onPress={()=>{deleteCartItem('select')}}
                    >
                        선택 삭제
                    </Button>
                    <Button
                        mode='outlined'
                        color='#1E388D'
                        onPress={()=>{deleteCartItem('all')}}
                    >
                        전체 삭제
                    </Button>
                </View>
                <View style={{width:'100%', position:'absolute', bottom:20}}>
                    <Button
                        mode='outlined'
                        color='#1E388D'
                        style={{height:50,justifyContent:'center'}}
                        contentStyle={{height:50}}
                        onPress={()=>{handleAllChekedState()}}
                    >{allCheckedState ? '전체 선택 해제' : '전체 선택'}</Button>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Button
                        mode='outlined'
                        color='black'
                        style={{flex:1, height:50, justifyContent:'center'}}
                        >총 {selectIndex.length}건</Button>
                        <Button
                            mode='contained'
                            color='#1E388D'
                            style={{flex:2, height:50, justifyContent:'center'}}
                            contentStyle={{height:50}}
                            onPress={()=>showMethodModal()}
                        >샘플신청</Button>
                        <Portal>
                            <Dialog visible={visible} onDismiss={()=>hideMethodModal()}>
                                <Dialog.Title style={{ textAlign:'center', fontSize:18 }}>
                                    배송 방법을 선택해 주세요.
                                </Dialog.Title>
                                <Dialog.Content>
                                        <DataTable>
                                            <DataTable.Row
                                                onPress={()=>{
                                                    setMethod('매장')
                                                    hideMethodModal()
                                                    showOrderModal()
                                                }}
                                            >
                                                <DataTable.Cell style={{justifyContent:'center'}}>
                                                    <Text>
                                                        매장
                                                    </Text>
                                                </DataTable.Cell>
                                            </DataTable.Row >
                                            <DataTable.Row
                                                onPress={()=>{
                                                    setMethod('영업사원 직접전달')
                                                    hideMethodModal()
                                                    showOrderModal()
                                                }}
                                            >
                                                <DataTable.Cell style={{justifyContent:'center'}}>
                                                    <Text>
                                                        영업사원 직접전달
                                                    </Text>
                                                </DataTable.Cell>
                                            </DataTable.Row >
                                            <DataTable.Row
                                                onPress={()=>{
                                                    setMethod('거래처(택배)')
                                                    hideMethodModal()
                                                    showOrderModal()
                                                }}
                                            >
                                                <DataTable.Cell style={{justifyContent:'center'}}>
                                                    <Text>
                                                        거래처(택배)
                                                    </Text>
                                                </DataTable.Cell>
                                            </DataTable.Row >
                                        </DataTable>
                                </Dialog.Content>
                            </Dialog>
                        </Portal>
                        <Portal>
                            <Dialog visible={orderVisible} onDismiss={()=>hideOrderModal()}>
                                <Dialog.Title style={{ textAlign:'center', fontSize:18 }}>
                                    주문내역
                                </Dialog.Title>
                                <Dialog.Content>
                                        <DataTable>
                                            <DataTable.Row style={{height:150}}>
                                                <ScrollView>
                                                    <View>
                                                        <Text>
                                                            {userInfo.company_name}
                                                        </Text>
                                                        <Text/>
                                                            {orderList}
                                                        <Text>
                                                            {method} {vTime}
                                                        </Text>
                                                    </View>
                                                </ScrollView>
                                            </DataTable.Row>
                                        </DataTable>
                                </Dialog.Content>
                                <Dialog.Actions style={{justifyContent:'center', flexDirection:'column'}}>
                                    <Button
                                        style={{width:'85%', marginVertical:3}}
                                        mode='outlined'
                                        color='#1E388D'
                                        onPress={()=>{
                                            createOrder(order)
                                            hideOrderModal()
                                        }}
                                    >주문완료</Button>
                                    <Button
                                        style={{width:'85%', marginVertical:3}}
                                        mode='outlined'
                                        color='#1E388D'
                                        onPress={()=>{
                                            hideOrderModal()
                                            showRemarkModal()
                                        }}
                                    >전달사항추가</Button>
                                    <Button
                                        style={{width:'85%', marginVertical:3}}
                                        mode='outlined'
                                        color='#1E388D'
                                        onPress={()=>{hideOrderModal()}}
                                    >취소</Button>
                                </Dialog.Actions>
                            </Dialog>
                        </Portal>
                        <Portal>
                            <Dialog visible={remarkVisible} onDismiss={()=>hideRemarkModal()}>
                                <Dialog.Title style={{ textAlign:'center', fontSize:18 }}>
                                        전달사항추가
                                </Dialog.Title>
                                <Dialog.Content>
                                    <TextInput
                                        mode='outlined'
                                        style={{backgroundColor:'#FFF', }}
                                        theme={{colors}}
                                        onChangeText={(text)=>setRemark(text)}
                                        value={remark}
                                    />
                                </Dialog.Content>
                                <Dialog.Actions style={{justifyContent:'center'}}>
                                    <Button
                                        mode='outlined'
                                        color='#1E388D'
                                        style={{width:'30%', marginHorizontal:20}}
                                        onPress={()=>{
                                            hideRemarkModal()
                                            showOrderModal()
                                        }}
                                    >취소</Button>
                                    <Button
                                        mode='contained'
                                        color='#1E388D'
                                        style={{width:'30%', marginHorizontal:20}}
                                        onPress={()=>{
                                            handelCreateOrder('addRemark')
                                            hideRemarkModal()
                                        }}
                                    >확인</Button>
                                </Dialog.Actions>
                            </Dialog>
                        </Portal>
                    </View>
                </View>
            </View>
        </>
    )
}

const colors = {
    Text: '#000000',
    primary: '#1E388D',
    underlineColor: 'transparent',
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#FFF',
        alignItems:'center',
    },
    titleText:{
        fontSize: 15,
        fontWeight:'bold'
    },
    tableText: {
        justifyContent:'center',
    }
})

export default Cart;