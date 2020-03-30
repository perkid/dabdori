import React from 'react';
import { DataTable, RadioButton } from 'react-native-paper';

function Company({ setChecked, name }){
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

export default Company;