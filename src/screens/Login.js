import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Bottom from '../components/Bottom';
import { StyleSheet, View, Image, Keyboard, TouchableWithoutFeedback, AsyncStorage, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { loginRequest } from '../redux/authentication';

function Login({ navigation }) {

    const [id, setID] = useState('');
    const [password, SetPassword] = useState('');
    const loginState = useSelector(state => state.authentication.login.status, []);
    const dispatch = useDispatch();
    const [test, setTest] = useState(false);

    const handleLogin = (id, password) => {
        dispatch(loginRequest(id, password));
        setTest(!test)
    }

    useEffect(() => {
        if (loginState === 'SUCCESS' && id !== '') {
            let user = {
                email: id,
                pass: password
            }
            let data = JSON.stringify(user);
            AsyncStorage.setItem("AUTH", data, () => {
                navigation.navigate('App');
            })
        }
        if (loginState === 'FAILURE') {
            Alert.alert('', '아이디 혹은 패스워드가 일치하지 않습니다.');
        }
    }, [loginState])

    // 로컬 저장소에 저장된 아이디가 있는지 체크하여 자동 로그인
    useEffect(()=>{
          AsyncStorage.getItem("AUTH", (err, data) => {
            if (err == null) {
                if (data !== null) {

                    let user = JSON.parse(data);
                    let email = user.email;
                    let password = user.pass;
                    dispatch(loginRequest(email, password))

                    navigation.navigate('App', 'Main');
                }
            }
        });
    }, [])


    return (
        <>
            <Header titleText='로  그  인' navigation={navigation} auth={true}/>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.container}>
                    <Image
                        source={require('../../assets/new.png')}
                        style={styles.logo}
                    />
                    <TextInput
                        label='아이디'
                        style={styles.input}
                        theme={{ colors }}
                        value={id}
                        autoCapitalize={'none'}
                        onChangeText={text => setID(text)}

                    />
                    <TextInput
                        label='패스워드'
                        style={styles.input}
                        theme={{ colors }}
                        value={password}
                        secureTextEntry={true}
                        onChangeText={text => SetPassword(text)}
                    />
                    <Button
                        mode='contained'
                        style={styles.button}
                        onPress={() => handleLogin(id, password)}
                        labelStyle={{ fontWeight: 'bold', fontSize: 18 }}
                    >
                        로그인
                </Button>

                    <Button
                        color='white'
                        onPress={() => navigation.push('ResetPassword')}
                        style={styles.findPass}
                        labelStyle={{ color: '#1E388D', textDecorationLine: 'underline', fontSize: 15 }}
                    >
                        비밀번호가 기억이 나지 않으세요?
                </Button>
                </View>
            </TouchableWithoutFeedback>
            {/* <Bottom /> */}
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
        marginTop: '14%'
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
    findPass: {
        margin: 20
    }
});

export default Login;