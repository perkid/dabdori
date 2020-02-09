import React from 'react';
import { Appbar } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

function Bottom() {
    return (
        <Appbar style={styles.bottom}>
        </Appbar>
    );
}

const styles = StyleSheet.create({
    bottom: {
        position: 'absolute',
        backgroundColor: '#FFF',
        left: 0,
        right: 0,
        bottom: 0
    },
    
})
export default Bottom;