import React, { useState } from 'react';
import Header from '../components/Header';
import Bottom from '../components/Bottom';
import { StyleSheet, View, Image, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
function Login({ navigation }) {
    return (
        <>
            <Header titleText='로  그  인' navigation={navigation} />
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

                    />
                    <TextInput
                        label='패스워드'
                        style={styles.input}
                        theme={{ colors }}
                    />
                    <Button
                        mode='contained'
                        style={styles.button}
                        onPress={() => navigation.navigate('App')}
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
            <Bottom />
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