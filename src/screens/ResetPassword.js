import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { forgotPassRequest } from '../redux/authentication';
import Header from '../components/Header';
import Bottom from '../components/Bottom';
import { StyleSheet, View, Image, Text, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

function ResetPassword({ navigation }) {
    const [user_id, setUser_id] = useState('');
    const forgotPass = useSelector(state => state.authentication.forgotPass)
    const dispatch = useDispatch()
    const handleReset = () => {
        if (user_id === '') {
            Alert.alert('', '이메일 주소를 입력해 주세요.')
        } else {
            dispatch(forgotPassRequest(user_id))
        }
    }
    useEffect(()=>{
        if(forgotPass.text.includes('완료')){
            Alert.alert('', forgotPass.text, [{ text: 'OK', onPress: () => navigation.goBack() }]);
        }
        if(forgotPass.text.includes('찾으시려고')){
            Alert.alert('', forgotPass.text);
        }
    },[forgotPass.text])
    if(forgotPass.status==='FAILURE'){
        Alert.alert('','문제가 발생했습니다. 관리자에게 문의하세요')
    }
    return (
        <>
            <Header titleText='비밀번호 재설정' navigation={navigation} />
            <View style={styles.container}>
                <Image
                    source={require('../../assets/new.png')}
                    style={styles.logo}
                />
                <Text style={styles.text}>
                    가입시 입력한 이메일 주소를 입력해주세요.{"\n"}
                    비밀번호 재설정 이메일이 발송됩니다.
                </Text>
                <TextInput
                    label='아이디'
                    selectionColor='#1E388D'
                    style={styles.input}
                    value={user_id}
                    theme={{ colors }}
                    autoCapitalize={'none'}
                    onChangeText={text => setUser_id(text)}
                />
                <Button
                    mode='contained'
                    style={styles.button}
                    onPress={() => { handleReset() }}
                    labelStyle={{ fontWeight: 'bold', fontSize: 18 }}
                >
                    비밀번호 재설정
                </Button>
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
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'center',
    },
    logo: {
        marginTop: '12%'
    },
    text: {
        margin: 30,
        fontSize: 20,
        lineHeight: 30
    },
    input: {
        width: '85%',
        backgroundColor: '#FFF',
        margin: 20
    },
    button: {
        backgroundColor: '#1E388D',
        width: '80%',
        marginTop: 40,
        padding: 5
    },
})

export default ResetPassword;