import React, { useState } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import { Card, Paragraph, TextInput, Button } from 'react-native-paper';

function Question({ role, question, insertQNA }) {
    const [ answer, setAnswer] = useState('');

    const deleteZero = (date) => {
        let time = date.split('.');
        return time[0];
    }
    
    let token = question.qetn_fireabse_token != null ? question.qetn_fireabse_token : '';

    return (
        <Card>
            <Card.Content style={{maxWidth:'95%'}}>
                <View style={{ marginLeft:10, flexDirection:'row', alignItems:'center'}}>
                    <Text style={{ color: '#1e388d', fontSize: 18, fontWeight: 'bold' }}>Q </Text><Text style={{marginLeft: 5, maxWidth: '100%'}}>{question.qetn_content}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 20 }}>
                    {role!=='employee'?<Paragraph style={{ color: 'gray' }}>
                        {question.qna_gb==='Y' ? '답변완료' : '미답변'}
                    </Paragraph>:undefined}
                    <Paragraph style={{ color: 'gray', marginHorizontal: 10 }}>
                        {question.qetn_user_name}
                    </Paragraph>
                    <Paragraph style={{ color:'gray'}}>
                        {deleteZero(question.qetn_reg_dtm)}
                    </Paragraph>
                </View>
                {
                    question.qna_gb==='Y' ? 
                    <View style={{marginTop: 10}}>
                        <View style={{marginLeft:15, flexDirection:'row', alignItems:'center'}}>
                            <Text style={{color:'#ff7c7c', fontSize: 18, fontWeight: 'bold'}}>ㄴ A </Text><Text style={{marginLeft: 5, maxWidth:'95%'}}>{question.ans_content}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 45 }}>
                            <Paragraph style={{ color: 'gray', marginHorizontal: 10 }}>
                                {question.ans_user_name}
                            </Paragraph>
                            <Paragraph style={{color:'gray'}}>
                                {deleteZero(question.and_reg_dtm)}
                            </Paragraph>
                        </View>
                    </View> : role==='employee'? 
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <TextInput
                            label='답변'
                            style={styles.input}
                            theme={{ colors }}
                            value={answer}
                            onChangeText={text => setAnswer(text)}
                        /> 
                        <Button
                            mode='contained'
                            color='#1e388D'
                            style={{justifyContent:'center', height:40, marginLeft: 10}}
                            onPress={()=>{
                                if(answer===''){
                                    Alert.alert('','답변이 입력되지 않았습니다.')
                                }
                                if(answer!==''){
                                    insertQNA(answer, question.qna_id, token)
                                }
                            }}
                        >
                            확인
                        </Button>
                    </View>
                    : undefined
                }
            </Card.Content>
        </Card>
    )
}

const colors = {
    Text: '#000000',
    primary: '#1E388D',
    underlineColor: 'transparent',
}
const styles = StyleSheet.create({
    input: {
        width: '80%',
        backgroundColor: '#FFF',
        marginLeft: 10,
        height:50
    },
})
export default Question;