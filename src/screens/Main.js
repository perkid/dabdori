import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Clipboard } from 'react-native';
import { FAB, Snackbar } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { sendMessage } from '../redux/messagesApp';
import Header from '../components/Header';
import Bottom from '../components/Bottom';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import QuickReplies from 'react-native-gifted-chat/lib/QuickReplies';
import createMessage from '../lib/MessageFactory';

function Main({ navigation }) {
  const messages = useSelector(state => state.messages)
  const dispatch = useDispatch()
  const onSend = message => dispatch(sendMessage(message))
  const [fabState, setState] = useState(false);
  const [snackState, setSnackState] = useState(false);
  const [option, setOption] = useState(3);
  const [item, setItem] = useState('');

  const handleFabState = () => {
    setState(!fabState);
  }

  const handleSnackState = () => {
    setSnackState(!snackState);
  }

  const user = {
    _id: 1,
    id: 'perkid@youngwoo.co',
    name: '고유준',
    company: '영우',
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
    let r = createMessage(messages[0].text, option, item);
    if(r!==undefined){
      onSend(GiftedChat.append(messages, [r]))
      setOption(r.option);
      setItem(r.item)
    }
  }, [messages]);
  return (
    <>
      <Header titleText='답  돌  이' navigation={navigation} main={true} />
      <View style={styles.container}>
        <GiftedChat
          {...{ messages, onSend }}
          user={{
            _id: 1,
          }}
          alignTop={true}
          onLongPress={(context, currentMessage)=>{
            Clipboard.setString(currentMessage.text)
            handleSnackState()
          }}
          onQuickReply={onQuickReply}
          quickReplyStyle={{ backgroundColor: '#1E388D', marginTop: 30 }}
          renderQuickReplies={(props) => <QuickReplies color='#FFF' {...props} />}
          renderAvatar={null}
          renderBubble={props => {
            return (
              <Bubble
                {...props}
                touchableProps={{ delayLongPress: 200 }}
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
                    marginTop: 20
                  }
                }}
              />
            );
          }}
        />
        <Snackbar
          visible={snackState}
          duration={1300}
          onDismiss={() => setSnackState(false)}
          style={styles.snack}
        >
          메세지가 복사되었습니다.
        </Snackbar>
        <FAB.Group
          open={fabState}
          icon='plus'
          actions={[
            { icon: 'file-document-box-outline', style: { right: 10, bottom: 70 }, onPress: () => navigation.navigate('Order') },
            {
              icon: 'account', style: { right: 10, bottom: 70 }, onPress: () =>
                navigation.navigate('MyPage', user)
            },
          ]}
          fabStyle={styles.fab}
          onStateChange={({ fabState }) => handleFabState({ fabState })}
          onPress={setState}
        />
      </View>
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
    paddingVertical: 20,
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
  snack: {
    width: '100%',
  }
})

export default Main;