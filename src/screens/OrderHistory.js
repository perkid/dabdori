import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, IconButton, Searchbar, Divider, Portal, Dialog, DataTable, RadioButton } from 'react-native-paper';
import Header from '../components/Header';
import Bottom from '../components/Bottom';
import Order from '../components/Order';

function OrderHistory({ navigation }) {
  const [firstQuery, setFirstQuery] = useState('');
  const [visible, setVisible] = useState(false);
  const [dateRange, setDateRange] = useState('custom');
  const [status, setStatus] = useState('all');
  const [role, setRole] = useState('all');
  const _showDialog = () => setVisible(true)
  const _hideDialog = () => setVisible(false)

  const date = '2020-01-31 ~ 2020-02-02';
  const orders = [
    {
      state: 3,
      company: '디자인바이스퀘어 1팀',
      orderer: '김새이',
      ordererNum: '010-1111-1111',
      addr: '동대문 매장 오전 10시 이후 수령',
      remarks: '답돌이 고객 등록 (김새이)',
      orderItem: [
        {
          name: '미라클 4-712',
          color: '2662',
          quantity: '8YD',
          price: '7,000원',
        }
      ],
      orderTime: `2020.02.05 10:46`,
      orderNo: 'OA20012-0514',
      flagBtn: true
    }
  ]

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
            {date}
          </Text>
          <Button
            style={{ marginRight: 10 }}
            mode='contained'
            color='#1E388D'
            onPress={() => _showDialog()}
          >
            기간 설정
          </Button>
          {/* 기간 설정 버튼 클릭시 modal */}
          <Portal>
            <Dialog
              visible={visible}
              onDismiss={_hideDialog}>
              <Dialog.Title style={{ textAlign: 'center' }}>기간설정</Dialog.Title>
              <DataTable style={{ marginVertical:10}}>
                <DataTable.Row>
                  <DataTable.Cell style={{ marginLeft: 30 }}>시작일</DataTable.Cell>
                  <DataTable.Cell >2018-01-01</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell style={{ marginLeft: 30 }}>종료일</DataTable.Cell>
                  <DataTable.Cell>2020-02-02</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>
                    <RadioButton.Android
                      color='#1E388D'
                      value="threeMonth"
                      status={dateRange === 'threeMonth' ? 'checked' : 'unchecked'}
                      onPress={() => setDateRange('threeMonth')}
                    />
                    <Text>3개월</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <RadioButton.Android
                      color='#1E388D'
                      value="sixMonth"
                      status={dateRange === 'sixMonth' ? 'checked' : 'unchecked'}
                      onPress={() => setDateRange('sixMonth')}
                    /><Text>6개월</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <RadioButton.Android
                      color='#1E388D'
                      value="custom"
                      status={dateRange === 'custom' ? 'checked' : 'unchecked'}
                      onPress={() => setDateRange('custom')}
                    /><Text>기간설정</Text>
                  </DataTable.Cell>
                </DataTable.Row>
              </DataTable>
              <Dialog.Title style={{ textAlign: 'center' }}>상태설정</Dialog.Title>
              <DataTable style={{ marginVertical:10}}>
                <DataTable.Row>
                  <DataTable.Cell>
                    <RadioButton.Android
                      color='#1E388D'
                      value="1"
                      status={status === '1' ? 'checked' : 'unchecked'}
                      onPress={() => setStatus('1')}
                    /><Text>접수</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <RadioButton.Android
                      color='#1E388D'
                      value="2"
                      status={status === '2' ? 'checked' : 'unchecked'}
                      onPress={() => setStatus('2')}
                    /><Text>준비</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <RadioButton.Android
                      color='#1E388D'
                      value="3"
                      status={status === '3' ? 'checked' : 'unchecked'}
                      onPress={() => setStatus('3')}
                    /><Text>완료</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <RadioButton.Android
                      color='#1E388D'
                      value="4"
                      status={status === '4' ? 'checked' : 'unchecked'}
                      onPress={() => setStatus('4')}
                    /><Text>취소</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <RadioButton.Android
                      color='#1E388D'
                      value="all"
                      status={status === 'all' ? 'checked' : 'unchecked'}
                      onPress={() => setStatus('all')}
                    /><Text>전체</Text>
                  </DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>
                    <RadioButton.Android
                      color='#1E388D'
                      value="1"
                      status={role === '1' ? 'checked' : 'unchecked'}
                      onPress={() => setRole('1')}
                    /><Text>고객용</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <RadioButton.Android
                      color='#1E388D'
                      value="2"
                      status={role === '2' ? 'checked' : 'unchecked'}
                      onPress={() => setRole('2')}
                    /><Text>직원용</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <RadioButton.Android
                      color='#1E388D'
                      value="all"
                      status={role === 'all' ? 'checked' : 'unchecked'}
                      onPress={() => setRole('all')}
                    /><Text>전체</Text>
                  </DataTable.Cell>
                </DataTable.Row>
              </DataTable>
              <Dialog.Actions style={{justifyContent:'center', marginVertical: 25}}>
                <Button
                  mode='outlined'
                  color='#1E388D'
                  onPress={_hideDialog}
                  style={{width: '40%', marginHorizontal: 10}}
                >
                  취소
                  </Button>
                <Button
                  mode='contained'
                  color='#1E388D'
                  onPress={_hideDialog}
                  style={{width: '40%', marginHorizontal: 10}}
                >
                  완료
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
        {/* modal end */}
        <Divider style={{ padding: 1, backgroundColor: '#1E388D' }}></Divider>
        {orders.map((order, index) => (
          <Order
            key={index}
            navigation={navigation}
            order={order}
          />
        ))}
      </View>
      <Bottom />
    </>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  dateSetup: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 5
  },
  iconButton: {
    position: 'absolute',
    right: 0,
    top: 40,
    margin: 10
  }
})

export default OrderHistory;