import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import getUrl from '../config/environment';
import { StyleSheet, View, Clipboard, KeyboardAvoidingView, Platform, ScrollView, Image, Text } from 'react-native';
import { FAB, Snackbar, DataTable, Button, Dialog, Portal, RadioButton, Divider,Paragraph } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { sendMessage, setText } from '../redux/messagesApp';
import Header from '../components/Header';
import Company from '../components/Company';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import QuickReplies from 'react-native-gifted-chat/lib/QuickReplies';
import createMessage from '../libs/createMessage';
import { Notifications } from 'expo';
import Fab from 'rn-fab';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import Tab from '../components/Tab';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import getActions from '../static/FABaction';

function Main({ navigation }) {
  const url = getUrl();
  const userInfo = useSelector(state => state.authentication.user);
  const messages = useSelector(state => state.messagesApp.messages)
  const dispatch = useDispatch()
  const onSend = message => dispatch(sendMessage(message))
  const [fabState, setState] = useState(false);
  const [snackState, setSnackState] = useState(false);
  const [option, setOption] = useState(0);
  const [subOption, setSubOption] = useState(0);
  const [item, setItem] = useState('');
  const [itemName, setItemName] = useState('');
  const [company, setCompany] = useState('');
  const [pToken, setToken] = useState('');
  const [color, setColor] = useState('');
  const [price, setPrice] = useState('');

  const actions = getActions(userInfo.role!=='employee')
    
  
  const [testVisible, setTestVisible] = useState(false);


  const showTest = () => setTestVisible(true);

  const hideTest = () => setTestVisible(false);

  // 토큰 생성 코드
  const registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      // 푸시 알람 허용하지 않은 경우
      // if (finalStatus !== 'granted') {
      //   alert('Failed to get push token for push notification!');
      //   return;
      // }
      let token = await Notifications.getExpoPushTokenAsync();
      setToken(token)
      return true;
    } else {

    }
  }
  // 푸시 보내기

  const sendPushNotification = async (pushToken, pushMessage) => {

    const message = {
      to: pushToken,
      sound: 'default',
      title: '신규오더',
      body: pushMessage,
      data: { data: '' },
    };
    

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })
  };
  registerForPushNotificationsAsync()
  useEffect(() => {
    if (userInfo.status === undefined) {
      dispatch(setText(userInfo.dabdoriText.welcome_text))
    }
  }, [userInfo])
  
  // console.log('담당자 토큰 : '+userInfo.manager_firebase_token)
  useEffect(()=>{
    if (userInfo.role === 'employee') {
      if(pToken !== ''){
        axios.post(url + `/api/setToken.dab`,
        {
          user_id: userInfo.user_id,
          firebase_token: pToken
        }).then((response) => {
          // console.log('저장되는 토큰 : '+pToken)
        }).catch((err)=>{
        })
      }
    }
  }, [pToken])
  const handleOptionReset = () => {
    setOption(0);
    setSubOption(0);
  }
  const handleFabState = () => {
    setState(!fabState);
  }

  const handleSnackState = () => {
    setSnackState(!snackState);
  }

  
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState('');
  const [companyList, setCompanyList] = useState(undefined);

  const _showDialog = () => {
    setVisible(true);
  }
  const _hideDialog = () => {
    setVisible(false);
  }
  const selcet = () => {
    let r = {
      createdAt: new Date(),
      _id: Math.round(Math.random() * 1000000),
      text: checked,
      user: {
        _id: 1
      },
    }
    onSend(GiftedChat.append(messages, [r]))
    r = createMessage(checked, 2, 5, item, userInfo, company, messageSend, handleOption, handleSubOption, handleItem, selectCompany, handleCompany);
    onSend(GiftedChat.append(messages, [r]))
    setSubOption(2)
    _hideDialog()
  }

  const messageSend = (message) => {
    onSend(GiftedChat.append(messages, [message]))
  }
  const handleOption = (op) => {
    setOption(op)
  }
  const handleSubOption = (op) => {
    setSubOption(op)
  }
  const handleItem = (i) => {
    setItem(i)
  }
  const handleItemName = (i) => {
    setItemName(i)
  }
  const handleCompany = (c) => {
    setCompany(c)
  }
  const handleColor = (c) => {
    setColor(c)
  }
  const handlePrice = (p) => {
    setPrice(p)
  }

  const selectCompany = (list) => {
    setCompanyList(list.map((company, index) =>
      (<Company
        key={index}
        setChecked={setChecked}
        name={company.custName}
      />)))
    _showDialog()
  }

  const onQuickReply = replies => {
    const createdAt = new Date();
    if (replies.length === 1) {
      onSend([
        {
          createdAt,
          _id: Math.round(Math.random() * 1000000),
          text: replies[0].title,
          user: {
            _id: 1
          },
        },
      ])
    } else if (replies.length > 1) {
      onSend([
        {
          createdAt,
          _id: Math.round(Math.random() * 1000000),
          text: replies.map(reply => reply.title).join(', '),
          user: {
            _id: 1
          },
        },
      ])
    } else {
      console.warn('replies param is not set correctly')
    }
  }
  const ref = useRef(null)
  const scroll = () => {
    ref.current.scrollToBottom()
  }

  useEffect(() => {
    if (messages[0] !== undefined) {
      let r = createMessage(messages[0].text, option, subOption, item, userInfo, company, messageSend, handleOption, handleSubOption, handleItem, selectCompany, handleCompany, sendPushNotification, handleColor, color, handleItemName, itemName, handlePrice, price, scroll) ;
      if (r !== undefined) {
        onSend(GiftedChat.append(messages, [r]))
        setOption(r.option);
        setSubOption(r.subOption);
        setItem(r.item);
      }
    }
  }, [messages]);

  return (
    <>
      <Header titleText='답  돌  이' navigation={navigation} main={true} handleOptionReset={handleOptionReset} app={true}/>
      <View style={styles.container}>
        <GiftedChat
          {...{ messages, onSend }}
          user={{
            _id: 1,
          }}
          alignTop={true}
          onLongPress={(context, currentMessage) => {
            Clipboard.setString(currentMessage.text)
            handleSnackState()
          }}
          ref={ref}
          scrollToBottom={true}
          scrollToBottomStyle={{ right: '45%' }}
          onQuickReply={onQuickReply}
          quickReplyStyle={{ backgroundColor: '#1E388D', marginTop: 1, height: 35 }}
          renderQuickReplies={(props) => <QuickReplies color='#FFF' {...props} />}
          renderAvatar={null}
          renderBubble={props => {
            return (
              <Bubble
                {...props}
                touchableProps={{ delayLongPress: 300 }}
                textStyle={{
                  right: {
                    color: 'white',
                    padding: 5,
                    lineHeight: 23
                  },
                  left: {
                    padding: 5,
                    lineHeight: 23
                  }
                }}
                wrapperStyle={{
                  right: {
                    backgroundColor: '#1E388D',
                  },
                  left: {
                    marginTop: 20,
                    marginBottom: 20
                  }
                }}
              />
            );
          }}
        />
        <Portal>
          <Dialog
            visible={visible}
            onDismiss={_hideDialog}
          >
            <Dialog.Title
              style={{ textAlign: 'center' }}
            >
              업체명 선택
                    </Dialog.Title>
            <Divider />
            <ScrollView style={{ maxHeight: 400 }}>
              <Dialog.Content>
                <RadioButton.Group
                  onValueChange={value => setChecked(value)}
                  value={checked}
                >
                  <DataTable>
                    {companyList}
                  </DataTable>
                </RadioButton.Group>
              </Dialog.Content>
            </ScrollView>
            <Divider />
            <Dialog.Actions>
              <Button
                color='#1E388D'
                style={{ backgroundColor: '#1E388D', width: '80%', marginRight: '10%' }}
                labelStyle={{ fontSize: 18, color: "#fff" }} onPress={selcet}>선택</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        {Platform.OS === 'ios' ? undefined : <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={90} />}
        <Snackbar
          visible={snackState}
          duration={1300}
          onDismiss={() => setSnackState(false)}
          style={styles.snack}
        >
          메세지가 복사되었습니다.
        </Snackbar>
        {/* 새로 추가한 FAB */}
        {/* 상단 FAB */}
        <Fab
          actions={actions}
          style={{right: 40, top: -55}}
          rotation={"0deg"}
          onPress={name => {
            if(name == "btn_cart"){
              navigation.navigate('Cart', userInfo)
            }
            if(name == "btn_order"){
              navigation.navigate('OrderHistory', userInfo)
            }
            if(name == "btn_user"){
              navigation.navigate('MyPage', userInfo)
            }
            if(name == "btn_test"){
              showTest()
            }
          }}
        />
        {/* 하단 FAB */}
        {/* <Fab
          actions={actions}
          style={{right: 40, bottom:140}}
          rotation={"45deg"}
          onPress={name => {
            if(name == "btn_cart"){
              navigation.navigate('Cart', userInfo)
            }
            if(name == "btn_order"){
              navigation.navigate('OrderHistory', userInfo)
            }
            if(name == "btn_user"){
              navigation.navigate('MyPage', userInfo)
            }
            if(name == "btn_test"){
              showTest()
            }
          }}
        /> */}
      </View>
      <Portal>
      <Dialog visible={testVisible} onDismiss={hideTest}>
          <Dialog.Title>대체 아이템</Dialog.Title>
          <Dialog.Content style={{ maxHeight: 400 }}>
            <Paragraph style={{fontSize:14, fontWeight:'bold'}}>거북선 (7-8042)</Paragraph>
            <ScrollView>
              <Paragraph>
              </Paragraph>
            </ScrollView>
            <Paragraph style={{fontSize:14, fontWeight:'bold', marginTop:10}}>JERRY(제리) (2AFPP617)</Paragraph>
            <ScrollView>
              <Paragraph>
              </Paragraph>
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button color='#1E388D' onPress={hideTest}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {/* <View style={{ flex: 1 }} />
      <Bottom /> */}
      <Tab navigation={navigation}/>
    </>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 13,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginBottom:90,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  title: {
    fontSize: 20
  },
  fab: {
    backgroundColor: '#1E388D',
    right: 0,
    bottom: 70,
    height:45,
    width:45,
    justifyContent:'center',
    alignItems:'center'
  },
  icon:{
    height:25,
    width:25
  },
  listTitle: {
    fontSize: 20
  },
  box: {
    backgroundColor: "#FFF",
    width: 300,
    borderWidth: 0.2,
    borderRadius: 20,
  },
  snack: {
    width: '100%',
  }
})

export default Main;