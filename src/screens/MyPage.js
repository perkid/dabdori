import React, { useState } from 'react';
import { Text, View, StyleSheet, AsyncStorage } from 'react-native';
import { DataTable } from 'react-native-paper';
import Header from '../components/Header';
import Bottom from '../components/Bottom';
import { useDispatch } from 'react-redux';
import { clearMessage } from '../redux/messagesApp';

function MyPage({ navigation }) {
  const user = navigation.state.params;
  const dispatch = useDispatch();
  const clearChat = () => dispatch(clearMessage());
  const handleLogout = () => {
    clearChat();
    AsyncStorage.clear()
    navigation.navigate('Auth')
  }
  let last_login_date = user.last_login_date.split(' ');
  let lastLogin = last_login_date[0];

  return (
    <>
      <Header titleText='마이페이지' navigation={navigation} />
      <View style={styles.container}>
        <Text style={styles.info}>
          안녕하세요 {user.company_name}{'\n'}
          {user.user_name} 님{'\n'}
          {user.counter}번째 방문을 환영합니다.{'\n'}
          최근 접속일 : {lastLogin}
        </Text>
      </View>
      <View style={styles.menu}>
        <DataTable>
          <DataTable.Row>
            <DataTable.Cell style={{ marginLeft: 5 }}>
              <Text style={styles.tableText}>
                아이디
              </Text>
            </DataTable.Cell>
            <DataTable.Title>{user.user_id}</DataTable.Title>
          </DataTable.Row>
          <DataTable.Row onPress={() => navigation.navigate('PasswordChange')}>
            <DataTable.Cell style={{ marginLeft: 5 }}>
              <Text style={styles.tableText}>
                비밀번호 변경
              </Text>
            </DataTable.Cell>
            <DataTable.Cell numeric={true}>
              >
            </DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row onPress={() => handleLogout()}>
            <DataTable.Cell style={{ marginLeft: 5 }}>
              <Text style={styles.tableText}>
                로그아웃
              </Text>
            </DataTable.Cell>
            <DataTable.Cell numeric={true}>
              >
            </DataTable.Cell>
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
    backgroundColor: '#1E388D',
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  info: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 30
  },
  menu: {
    flex: 4,
    backgroundColor: '#FFF'
  },
  tableText: {
    fontSize: 17
  }

})

export default MyPage;