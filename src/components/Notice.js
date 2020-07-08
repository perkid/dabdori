import React from 'react';
import { Button, Paragraph, Dialog,} from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';

function Notice({ visible, hideNotice, notice }){
    
    return (
        <Dialog visible={visible} onDismiss={hideNotice}>
          <Dialog.Title>{notice.title}</Dialog.Title>
          <Dialog.Content style={{ maxHeight: 400 }}>
            <ScrollView>
              <Paragraph>{notice.content}.</Paragraph>
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button color='#1E388D' onPress={hideNotice}>Done</Button>
          </Dialog.Actions>
        </Dialog>
    )
}

export default Notice;