import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import getUrl from '../config/environment';
import { StyleSheet, View, Clipboard, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import { FAB, Snackbar, DataTable, Button, Dialog, Portal, RadioButton, Divider,Paragraph } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { sendMessage, setText } from '../redux/messagesApp';
import Header from '../components/Header';
import Company from '../components/Company';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import QuickReplies from 'react-native-gifted-chat/lib/QuickReplies';
import createMessage from '../libs/createMessage';
import Fab from 'rn-fab';
import Tab from '../components/Tab';
import getActions from '../static/FABaction';
import { registerForPushNotificationsAsync, sendPushNotification} from '../libs/push';
import STTButton from '../components/STTButton';

function Main({ navigation }) {
  const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

  const r = viewportWidth/12;
  const t = Platform.OS==='ios' ? 45 : 25;

  const url = getUrl();
  const userInfo = useSelector(state => state.authentication.user);
  const messages = useSelector(state => state.messagesApp.messages)
  const dispatch = useDispatch()
  const onSend = message => dispatch(sendMessage(message))
  const [snackState, setSnackState] = useState(false);
  const [option, setOption] = useState(0);
  const [subOption, setSubOption] = useState(0);
  const [item, setItem] = useState('');
  const [itemName, setItemName] = useState('');
  const [company, setCompany] = useState('');
  const [pToken, setToken] = useState('');
  const [color, setColor] = useState('');
  const [price, setPrice] = useState('');
  const [question, setQuestion] = useState('')

  const [transcript, setTranscript] = useState('');
  
  // 음성인식 설명
  const handleExplanation = () => {
    let text = userInfo.role === 'employee' ? '조회하실 내용을 마이크 버튼을 누르고 있는\n상태에서 다음과 같이 말해보세요\n\n현물 조회\n아이템명 칼라번호(생략시 전체 칼라) 현물 조회\n예) 거북선 9080 현물 조회\n\n샘플신청\n1. 업체명 샘플신청\n2. 아이템명 칼라번호 수량 단가 (단가 입력시 모든 주문 아이템에 단가를 입력해야 합니다)\n예) 영우 샘플신청\n(업체 선택 후)\n거북선 9080 10\n\n아이템 정보\n아이템명 스펙 또는 아이템명 업차지\n예) 거북선 스펙' :  '조회하실 내용을 마이크 버튼을 누르고 있는\n상태에서 다음과 같이 말해보세요\n\n현물 조회\n아이템명 칼라번호(생략시 전체 칼라) 현물 조회\n예) 거북선 9080 현물 조회\n\n샘플신청\n아이템명 칼라번호 수량 샘플신청\n예) 거북선 9080 10 샘플신청\n\n아이템 정보\n아이템명 스펙\n예) 거북선 스펙';

    let message = {
      createdAt: new Date(),
      _id: Math.round(Math.random() * 1000000),
      // text: text.replace(/ /g,""), // 공백제거
      text: text,
      user: {
        _id: 2,
      }
    }
    setOption(8)
    onSend(GiftedChat.append(messages, [message]))
  }
  // 음성인식
  const handleTranscript = (text) => {
    console.log(text)
    let message = {
      createdAt: new Date(),
      _id: Math.round(Math.random() * 1000000),
      // text: text.replace(/ /g,""), // 공백제거
      text: text,
      user: {
        _id: 1,
      }
    }
    setOption(7)
    onSend(GiftedChat.append(messages, [message]))
  }

  // 음성인식 테스트
  const handleTest = () => {
    // handleExplanation()
    if(option===7){
      setOption(0)
    } else{
      setOption(7)
    }
  }

  const actions = getActions(userInfo.role!=='employee')
    
  const [testVisible, setTestVisible] = useState(false);

  const showTest = () => setTestVisible(true);

  const hideTest = () => setTestVisible(false);

  const handleToken = (token) => {
    setToken(token)
  }

  registerForPushNotificationsAsync(handleToken)
  
  useEffect(() => {
    if (userInfo.status === undefined) {
      dispatch(setText(userInfo.dabdoriText.welcome_text, userInfo.role))
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
          // console.log(err)
        })
      }
    }
  }, [pToken])

  const handleOptionReset = () => {
    setOption(0);
    setSubOption(0);
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

  // 답돌이 답변 lib에서 메세지 보내주는 method
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
  const handelQuestion = (q) =>{
    setQuestion(q)
  }

  // 직원 샘플 신청시 업체 리스트 method
  const selectCompany = (list) => {
    setCompanyList(list.map((company, index) =>
      (<Company
        key={index}
        setChecked={setChecked}
        name={company.custName}
      />)))
    _showDialog()
  }

  // 채팅 빠른답변
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

  // 채팅 스크롤 최하단
  const ref = useRef(null)

  const scroll = () => {
    ref.current.scrollToBottom()
  }

  // 채팅 입력시 메세지 반영
  useEffect(() => {
    if (messages[0] !== undefined) {
      let r = createMessage(messages[0].text, option, subOption, item, userInfo, company, messageSend, handleOption, handleSubOption, handleItem, selectCompany, handleCompany, sendPushNotification, handleColor, color, handleItemName, itemName, handlePrice, price, handelQuestion, question, scroll) ;
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
        {/* <FAB
                style={styles.fab}
                small
                icon="plus"
                onPress={() => sendPushNotification('ExponentPushToken[VuX1tiM4uIGTHHcVMgDKjP]','테스트','테스트중 입니다.')}
              /> */}
        {/* STT Test 버튼 */}
        {/* <STTButton
          handleTranscript={handleTranscript}
          handleTest={handleTest}
          handleExplanation={handleExplanation}
        /> */}
      </View>
       {/* 상단 FAB */}
       <Fab
          actions={actions}
          style={{right: r, top: t}}
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
            if(name == "btn_qna"){
              navigation.navigate('QNA', userInfo)
            }
            if(name == "btn_test"){
              showTest()
            }
          }}
        />
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
    marginBottom:60,
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