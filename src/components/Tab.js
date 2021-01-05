import React from 'react';
import { Card, DataTable } from 'react-native-paper';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

function Tab({ navigation }) {
    const routeName = useSelector(state => state.route.routeName)
    return (
        <Card style={styles.container}>
            <View style={{flexDirection:'row', flex:1}}>
            <TouchableOpacity
                style={styles.button}
                onPress={()=>{navigation.navigate('NoticeMain')}}
            >
            <MaterialCommunityIcons name='home'  size={35} color={routeName==='NoticeMain'?'#1e388d':'#b7b7b7'}/>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={()=>{navigation.navigate('Main')}}
            >
            <MaterialCommunityIcons name='chat'  size={35} color={routeName==='Main'?'#1e388d':'#b7b7b7'}/>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={()=>{navigation.navigate('OrderHistory')}}
            >
            <MaterialCommunityIcons name='format-list-bulleted'  size={35} color={routeName==='OrderHistory'?'#1e388d':'#b7b7b7'}/>
            </TouchableOpacity>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        position: 'absolute',
        backgroundColor: '#ffffff',
        left: 0,
        right: 0,
        bottom: 0,
        height: 60
    },
    button:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    }
})
export default Tab;