import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { DataTable, Checkbox } from 'react-native-paper';

function CartItem({index, item, allChecked, allCheckedState, handleAllCheked, cnt, handleSelect}){
    const [ checked, setChecked ] = useState(false);

    useEffect(()=>{
        if(allChecked===allCheckedState){
            setChecked(allChecked)
            if(!allCheckedState){
                handleSelect('cancelAll')
            }
        }
    },[allCheckedState])

    useEffect(()=>{
        if(!checked){
            if(allChecked===true){
                handleAllCheked()
            }
            if(cnt!==0){
                handleSelect('cancel',index)
            }
        }
        if(checked){
            handleSelect('select',index)
        }
    },[checked])
 
    return (
        <DataTable.Row>
            <View style={{justifyContent:'center'}}><Checkbox.Android status={checked ? 'checked' : 'unchecked'} onPress={()=>{setChecked(!checked)}} color='#1E388D'></Checkbox.Android></View>
            <DataTable.Cell style={styles.tableText}>{item.itemName}</DataTable.Cell>
            <DataTable.Cell style={styles.tableText}>{item.colorYW}</DataTable.Cell>
            <DataTable.Cell style={styles.tableText}>{item.amount}</DataTable.Cell>
        </DataTable.Row>
    )
}

const styles = StyleSheet.create({
    titleText:{
        fontSize: 15,
        fontWeight:'bold'
    },
    tableText: {
        justifyContent:'center',
    }
})

export default CartItem;