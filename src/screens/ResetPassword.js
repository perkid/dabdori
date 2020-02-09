import React, { useState } from 'react';
import Header from '../components/Header';
import Bottom from '../components/Bottom';
import { StyleSheet, View, Image, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

function ResetPassword({ navigation }) {
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
                    theme={{ colors }}

                />
                <Button
                    mode='contained'
                    style={styles.button}
                    onPress={() => alert('메일이 발송 되었습니다.')}
                    labelStyle={{ fontWeight: 'bold', fontSize: 18 }}
                >
                    비밀번호 재설정
                </Button>
            </View>
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