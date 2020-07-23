import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function getActions(boolean){
    if(boolean){
        return [
            // Main button - does not need to receive the "text" property.
            {
              icon: <MaterialCommunityIcons name='menu'  size={30} style={{marginTop:5,color:'#ffffff'}} />,
              name: "btn_plus",
              color: '#1E388D'
            },
            // Action Buttons - will be displayed when you tap the main button.
            {
              icon: <Image source={require('../../assets/cart.png')} style={styles.icon}/>,
              name: "btn_cart",
              color: '#ffffff'
            },
            {
              icon: <Image source={require('../../assets/question.png')} style={styles.icon}/>,
              name: "btn_qna",
              color: '#ffffff'
            },
            {
              icon: <Image source={require('../../assets/user.png')} style={styles.icon}/>,
              name: "btn_user",
              color: '#ffffff'
            },
          ]
    }
    if(!boolean){
        return [
            // Main button - does not need to receive the "text" property.
            {
              icon: <MaterialCommunityIcons name='menu'  size={30} style={{marginTop:5,color:'#ffffff'}} />,
              name: "btn_plus",
              color: '#1E388D'
            },
            // Action Buttons - will be displayed when you tap the main button.
            {
              icon: <Image source={require('../../assets/question.png')} style={styles.icon}/>,
              name: "btn_qna",
              color: '#ffffff'
            },
            {
              icon: <Image source={require('../../assets/user.png')} style={styles.icon}/>,
              name: "btn_user",
              color: '#ffffff'
            },
          ]
    }
}

const styles = StyleSheet.create({
    icon:{
        height:25,
        width:25
      },
})