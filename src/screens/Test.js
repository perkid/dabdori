import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Dialog, Portal, RadioButton, Divider, DataTable, IconButton }
    from 'react-native-paper';
import Header from '../components/Header';
const Company = ({ setChecked, name }) => {
    let companyName = name;
    return (
        <DataTable.Row
            onPress={() => setChecked(companyName)}
        >
            <DataTable.Cell>
                {companyName}
            </DataTable.Cell>
            <RadioButton
                color='#1E388D'
                value={companyName}
            />
        </DataTable.Row >
    )
}

function Test({navigation}) {
    const [visible, setVisible] = useState(false);
    const [checked, setChecked] = useState('');

    const _showDialog = () => {
        setVisible(true);
    }
    const _hideDialog = () => {
        setVisible(false);
    }

    return (
        <View>
            <Header titleText='테스트' navigation={navigation} />
            <IconButton
                icon='close'
                size={25}
                color='white'
                onPress={() => navigation.goBack()}
                style={styles.iconButton}
            />
            <Text>{checked}</Text>
            <Button style={{ backgroundColor: "#fff", marginTop: 100 }} onPress={_showDialog}>업체선택</Button>
            <Portal>
                <Dialog
                    visible={visible}
                    onDismiss={_hideDialog}
                >
                    <Dialog.Title
                        style={{ textAlign: 'center' }}
                    >
                        업체명 선택
                    </Dialog.Title>
                    <Divider />
                    <Dialog.Content>
                        <RadioButton.Group
                            onValueChange={value => setChecked(value)}
                            value={checked}
                        >
                            <DataTable>
                                <Company
                                    checked={checked}
                                    setChecked={setChecked}
                                    name="first"
                                />
                                <Company
                                    checked={checked}
                                    setChecked={setChecked}
                                    name="second"
                                />
                                <Company
                                    checked={checked}
                                    setChecked={setChecked}
                                    name="third"
                                />
                                <Company
                                    checked={checked}
                                    setChecked={setChecked}
                                    name="4"
                                />
                                <Company
                                    checked={checked}
                                    setChecked={setChecked}
                                    name="5"
                                />
                            </DataTable>
                        </RadioButton.Group>
                    </Dialog.Content>
                    <Divider />
                    <Dialog.Actions>
                        <Button
                            color='#1E388D'
                            style={{ backgroundColor: '#1E388D', width: '80%', marginRight: '10%' }}
                            labelStyle={{ fontSize: 18, color: "#fff" }} onPress={_hideDialog}>선택</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#1E388D',
      paddingHorizontal: 20,
      paddingVertical: 20,
      justifyContent: 'center',
      alignItems: 'center'
    },
    info: {
      color: '#fff',
      fontSize: 18,
      textAlign: 'center',
      lineHeight: 30
    },
    menu: {
      flex: 4,
      backgroundColor: '#FFF'
    },
    iconButton: {
      position: 'absolute',
      right: 0,
      top: 40,
      margin: 10
    },
    tableText: {
      fontSize: 17
    }
  
  })

export default Test;