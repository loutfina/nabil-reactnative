import React, { useState } from 'react';
import { View, Button, TextInput, StyleSheet } from 'react-native';
import { useSelector, useDispatch} from 'react-redux';
import { createMessage} from '../MessageList/messageAction';

function MessageForm() {

  const [ message, setMessage ] = useState("");

  const user = useSelector((state:any) => state.login.user);  // useSelector subscribe for update on state.<sliceName>.<value>
  const dispatch = useDispatch()   // useDispatch give access to methode to push a change on state

  function handleSubmit() {
    dispatch(createMessage(message, user)); //dispatch action to Store
  }

  return (
    <>
    { user && <View style={{ flexDirection: "row", height: 100, width:'100%'}}>
          <TextInput 
              onChangeText={setMessage} 
              value={message} 
              placeholder="Write your messaga here" 
              style={styles.message}
              multiline
              numberOfLines={4}/> 
          <Button onPress={handleSubmit} title="Send" />
        </View>
      }
    </>
  );
}

const styles = StyleSheet.create({
  message: {
    height: 100,
    flexGrow: 1,
    borderWidth: 1,
    padding: 10,
  },
});

export default MessageForm;
