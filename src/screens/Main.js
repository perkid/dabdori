import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Keyboard } from 'react-native';
import { Text, FAB, List, Button } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { addnote, deletenote } from '../redux/messagesApp';
import Header from '../components/Header';
import Bottom from '../components/Bottom';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import QuickReplies from 'react-native-gifted-chat/lib/QuickReplies';

function Main({ navigation }) {
  const notes = useSelector(state => state)
  const dispatch = useDispatch()
  const addNote = note => dispatch(addnote(note))
  const deleteNote = id => dispatch(deletenote(id))
  const [fabState, setState] = useState(false);
  
  const handleFabState = () => {
    setState(!fabState);
  }

  const dapuser = {
    id: 'perkid@youngwoo.co',
    name: '고유준',
    company: '영우',
  }

  const m = `안녕하세요! ${dapuser.company} ${dapuser.name}님
인공지능 답돌이 입니다.

이용 중 처음 단계로 돌아가고
싶으시면 상단에 답돌이 아이콘
을 클릭하세요!
  `;

  const [messages, setMessages] = useState([
    {
      _id: 1,
      text: `${m}`,
      createdAt: new Date(),
      quickReplies: {
        type: 'radio',
        values: [
          {
            title: '현물조회',
            value: 'inquiry',
          },
          {
            title: '샘플신청',
            value: 'sample',
          },
          {
            title: '아이템 정보',
            value: 'item',
          },
        ],
      },
      user: {
        _id: 2,
        name: 'GiftedChat',
      },
    }
  ]);

  const user = {
    _id: 1,
    name: 'Developer',
  }

  const onQuickReply = replies => {
    const createdAt = new Date();

    if (replies.length === 1) {
      onSend([
        {
          createdAt,
          _id: Math.round(Math.random() * 1000000),
          text: replies[0].title,
          user,
        },
      ])


    } else if (replies.length > 1) {
      onSend([
        {
          createdAt,
          _id: Math.round(Math.random() * 1000000),
          text: replies.map(reply => reply.title).join(', '),
          user,
        },
      ])

    } else {
      console.warn('replies param is not set correctly')
    }
  }

  useEffect(() => {
    if(messages[0].text==='현물조회'){
      let r = {
        createdAt: new Date(),
        _id: Math.round(Math.random() * 1000000),
        text: '아이템명(또는 아이템번호)과 칼라번호 입력',
        user: 2,
      }
      reply(r)
    }
    if(messages[0].text==='샘플신청'){
      let r = {
        createdAt: new Date(),
        _id: Math.round(Math.random() * 1000000),
        text: '샘플신청 입니다.\n\n거래처 명을 입력하세요',
        user: 2,
      }
      reply(r)
    }
    if(messages[0].text==='아이템 정보'){
      let r = {
        createdAt: new Date(),
        _id: Math.round(Math.random() * 1000000),
        text: '정보 조회를 원하는 아이템명을\n입력해주세요.',
        user: 2,
      }
      reply(r)
    }
  }, [messages]);



  const reply = (r = []) => {
    setMessages(GiftedChat.append(messages, r))
  }

  const onSend = (newMessages = []) => {
    setMessages(GiftedChat.append(messages, newMessages));
  }
  const reset = () => {
    let r = {
      createdAt: new Date(),
      _id: Math.round(Math.random() * 1000000),
      text: '처음으로 돌아갑니다.',
      quickReplies: {
        type: 'radio',
        values: [
          {
            title: '현물조회',
            value: 'inquiry',
          },
          {
            title: '샘플신청',
            value: 'sample',
          },
          {
            title: '아이템 정보',
            value: 'item',
          },
        ],
      },
      user: 2,
    }
    setMessages(GiftedChat.append(messages, [r]));
  }

  return (
    <>
      <Header titleText='답  돌  이' navigation={navigation} main={true} reset={reset} />
      <View style={styles.container}>
        <GiftedChat
          {...{ messages, onSend }}
          user={{
            _id: 1,
          }}
          alignTop={true}
          onQuickReply={onQuickReply}
          quickReplyStyle={{ backgroundColor: '#1E388D', marginTop: 30 }}
          renderQuickReplies={(props) => <QuickReplies color='#FFF' {...props} />}
          renderAvatar={null}
          renderBubble={props => {
            return (
              <Bubble
                {...props}
                textStyle={{
                  right: {
                    color: 'white',
                  },
                }}
                wrapperStyle={{
                  right: {
                    backgroundColor: '#1E388D',
                  }
                }}
              />
            );
          }}
        />
        <FAB.Group
          open={fabState}
          icon='plus'
          actions={[
            { icon: 'file-document-box-outline', style: { right: 10, bottom: 70 }, onPress: () => navigation.navigate('Order') },
            {
              icon: 'account', style: { right: 10, bottom: 70 }, onPress: () =>
                navigation.navigate('MyPage', dapuser)
            },
          ]}
          fabStyle={styles.fab}
          onStateChange={({ fabState }) => handleFabState({ fabState })}
          onPress={setState}
        />
      </View>
      <Button style={{backgroundColor:'red'}}
        onPress={reset}
      ></Button>
      <View style={{ flex: 1 }} />
      <Bottom />
    </>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 13,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 20
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
    right: 11,
    bottom: 70
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
})

export default Main;