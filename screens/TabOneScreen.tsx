import * as React from 'react';
import { StyleSheet } from 'react-native';
import { useSelector} from 'react-redux';

import { View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

import Login from '../components/Login/Login';
import MessageList from '../components/MessageList/MessageList';
import MessageForm from '../components/MessageForm/MessageForm';


export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

  const user = useSelector((state:any) => state.login.user);  // useSelector subscribe for update on state.<sliceName>.<value>

  return (
    <View style={styles.container}>
      {!user && <>
        <Login /> 
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      </>
      }
      <MessageList />
      <MessageForm />
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
