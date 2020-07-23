import React, {useState, useEffect} from 'react';
import Header from '../components/Header';
import { Text, View, StyleSheet, Alert } from 'react-native';
import { Divider, FAB, Portal, Dialog, Button, TextInput } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import Question from '../components/Question';
import Bottom from '../components/Bottom';
import { useSelector, useDispatch } from 'react-redux';
import { getQNAListRequest, insertQNARequest } from '../redux/qna';

function QNA({ navigation }) {
    const userInfo = navigation.state.params;
    const [visible, setVisible] = useState(false);
    const [question, setQuestion] = useState('');
    const [state, setState] = useState(0);
    const dispatch = useDispatch();

    const showVisible = () => setVisible(true);
    const hideVisible = () => setVisible(false);

    const getQNA = () => {
        dispatch(getQNAListRequest(userInfo));
    }
    
    const insertQNA = (content, qna_id) => {
        dispatch(insertQNARequest(userInfo, content, qna_id));
        getQNA();
    }

    useEffect(()=>{
        getQNA()
    },[])

    const questions = useSelector(state => state.qna.qna.list);

    const sortedQuestions = questions.sort((a, b) => {
        return a.qetn_reg_dtm < b.qetn_reg_dtm;
    })

    const unansweredQuestions = sortedQuestions.filter(question =>
        question.qna_gb==='N'
    )

    const answeredQuestions = sortedQuestions.filter(question =>
        question.qna_gb==='Y'
    )

    return (
        <>
            <Header titleText='문의사항' navigation={navigation} />
            {
                (userInfo.role !== 'employee') ?
                    <View style={styles.container}>
                        {/* <View><Text style={{margin:15, marginLeft: 20, color:'gray'}}>전체  |  답변완료  |  미답변</Text></View> */}
                        <View style={{flexDirection:'row', alignItems:'center', marginVertical:5}}><Button color='#1e388d' labelStyle={state===0?{color:'#1e388d',fontWeight:'bold'}:{color:'gray'}} onPress={()=>setState(0)}>전체</Button><Text style={{color:'gray'}}>|</Text><Button  color='#1e388d'labelStyle={state===1?{color:'#1e388d',fontWeight:'bold'}:{color:'gray'}} onPress={()=>setState(1)}>답변완료</Button><Text style={{color:'gray'}}>|</Text><Button color='#1e388d' labelStyle={state===2?{color:'#1e388d',fontWeight:'bold'}:{color:'gray'}} onPress={()=>setState(2)}>미답변</Button></View>
                        <Divider></Divider>
                        <ScrollView>
                            {
                                state===0?
                                sortedQuestions.map((question,i)=>(
                                    <Question
                                        key={i}
                                        role={userInfo.role}
                                        question={question}
                                        insertQNA={insertQNA}
                                    />
                                ))
                                :
                                state===1?
                                answeredQuestions.map((question,i)=>(
                                    <Question
                                        key={i}
                                        role={userInfo.role}
                                        question={question}
                                        insertQNA={insertQNA}
                                    />
                                ))
                                :
                                unansweredQuestions.map((question,i)=>(
                                    <Question
                                        key={i}
                                        role={userInfo.role}
                                        question={question}
                                        insertQNA={insertQNA}
                                    />
                                ))
                            }
                        </ScrollView>
                    </View>
                    :
                    <View style={styles.container}>
                        <View style={{ flex: 1 }}>
                        <Text style={{ color: 'gray', margin: 15 }}>미답변 ({unansweredQuestions.length})</Text>
                            <ScrollView>
                                {
                                    unansweredQuestions.map((question, i) => (
                                        <Question
                                            key={i}
                                            role={userInfo.role}
                                            question={question}
                                            insertQNA={insertQNA}
                                        />
                                    ))
                                }
                            </ScrollView>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: 'gray', margin: 15 }}>답변완료 ({answeredQuestions.length})</Text>
                            <ScrollView>
                                {answeredQuestions.map((question, i) => (
                                    <Question
                                        key={i}
                                        role={userInfo.role}
                                        question={question}
                                        insertQNA={insertQNA}
                                    />
                                ))}
                            </ScrollView>
                        </View>
                    </View>
            }
            {
                userInfo.role!=='employee'?
            <FAB
                style={styles.fab}
                small
                icon="plus"
                onPress={() => showVisible()}
            />:undefined
            }
            <Portal>
                <Dialog
                    visible={visible}
                    onDismiss={()=>hideVisible()}
                >
                    <Dialog.Title>
                        문의하기
                    </Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            // editable
                            // maxLength={40}
                            mode='outlined'
                            multiline={true}
                            style={styles.input}
                            theme={{ colors }}
                            value={question}
                            onChangeText={text => setQuestion(text)}
                        />
                    </Dialog.Content>
                    <Dialog.Actions style={{justifyContent:'space-around', marginBottom:20}}>
                        <Button
                            style={{ width: '40%', marginHorizontal: 10 }}
                            contentStyle={{paddingHorizontal:10}}
                            mode='outlined'
                            labelStyle={{fontSize:15}}
                            color={'#1e388d'}
                            onPress={()=>{
                                setQuestion('')
                                hideVisible()
                            }}
                        >
                            취소
                        </Button>
                        <Button
                            style={{ width: '40%', marginHorizontal: 10 }}
                            contentStyle={{paddingHorizontal:10}}
                            mode='contained'
                            labelStyle={{fontSize:15}}
                            color={'#1e388d'}
                            onPress={()=>{
                                if(question===''){
                                    Alert.alert('','질문이 입력되지 않았습니다.')
                                }
                                if(question!==''){
                                    insertQNA(question)
                                    setQuestion('')
                                    hideVisible()
                                }
                            }}
                        >
                            등록
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <Bottom/>
        </>
    )
}

const colors = {
    Text: '#000000',
    primary: '#1E388D',
    underlineColor: 'transparent',
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginBottom:55
    },
    fab:{
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 70,
        backgroundColor:'#1e388d'
    },
    input: {
        width: '100%',
        backgroundColor: '#FFF',
        // margin: 20,
        // height:150
    },
})

export default QNA;