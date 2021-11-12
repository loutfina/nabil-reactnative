import React, { useState } from 'react';
import { Button, Alert, TextInput, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import {fetchUserByName, createUser} from './loginAction';
import { View } from '../Themed';

function Login (){

  const dispatch = useDispatch()   // useDispatch give access to methode to push a change on state
  const [ value, setValue ] = useState("");
  const [createVisible, setCreateVisible] = useState(false);
  const [logged, setLogged] = useState(false);

  //no magic binding in React, you need to create a onchange function :-(
  function handleChange(txt:string) {
      setValue(txt ? txt.trim() : txt);
  }

  async function handleSubmit() {
    console.log('Request to search a User with login ="'+value+'".');
    try {
      await dispatch(fetchUserByName(value));
      setLogged(true);
    } catch (err) {
      console.log("catch error", err);
      if (err.status > 204 ) // ==> could also be a useEffet on userHttpError=useSelector((state) => state.login.error)
        alert(`Error on getting users from API: ${err.message}`);
      else 
        createUserAlert(value); 
    }
  }

  const createUserAlert = (value:string) => {
    setCreateVisible(true);
    Alert.alert(
      "Are you a new user ?",
      "No user "+value+" has been found.<br />Could you confirm your are a new user to create it now ?",
      [{ text: "Annule", style: "cancel" },
       { text: "Confirm", onPress: () => {createNewUser(value)} }],
      { cancelable: true}
    );
  };

  function createNewUser(value:string){
    dispatch(createUser(value));
    setCreateVisible(false);
    setLogged(true);
  }

  return (
    <View style={{ flexDirection: "row", height: 40}}>
      <TextInput onChangeText={handleChange} value={value} placeholder="Your nickname" style={styles.login} /> 
      { createVisible ? 
          <Button onPress={() => {createNewUser(value)}} title="Create user" color="#bd0000"/>
        : <Button onPress={handleSubmit} title={logged ? "Change":"Connect"} />}
    </View>
  );

}

const styles = StyleSheet.create({
  login: {
    height: 40,
    width: 200,
    borderWidth: 1,
    padding: 10,
  },
});

export default Login;
