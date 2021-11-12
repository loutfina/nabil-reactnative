import React, { useRef, useEffect, useCallback } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMessageSince } from './messageAction';

const themeCard = "Light"; //Primary',  'Success', 'Danger', 'Warning', 'Info', 'Light', 'Dark',
var options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
const themeTeams = true
var optionsTeams:Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric',  };

function MessageList() {

  const flatListRef = useRef<FlatList<any>>();
  const data = useSelector((state:any) => state.message.messages);
  const user = useSelector((state:any) => state.login.user);
  const dispatch = useDispatch()   // useDispatch give access to methode to push a change on state

  const initTimestamp = Date.now() - 200000000;
  var timestamp = { prevTimestamp: initTimestamp, current: initTimestamp };

  const refreshTimestamp = useCallback((timestamp) => {
    if (timestamp.prevTimestamp !== timestamp.current) //no refresh
      timestamp.prevTimestamp = timestamp.current;
    timestamp.current = Date.now();
    dispatch(fetchMessageSince(timestamp.prevTimestamp));    // <== add the dispatch
  }, []);

  //change every Xtime the timestamp to trigger the refresh
  useEffect(() => {
    refreshTimestamp(timestamp); // first execution without delay
    const autoRefreshInterval = 10 * 1000; //set to 10second
    const loopRefresh = setInterval(() => { refreshTimestamp(timestamp); }, autoRefreshInterval);
    return () => {
      clearInterval(loopRefresh); //on rerender stop it as a new one will be restarted after rerender
    };
  }, [refreshTimestamp])


  function isSameMessage(val:{user:any, creationDate:string}, index:number){
    return ((index!=0) && ( (val.user?.id == data[index-1].user?.id) && (new Date(val.creationDate).getTime()-new Date(data[index-1].creationDate).getTime() <300000)))
  }

  function isMe(val:any){
    return (val.user && user && val.user.id==user.id)
  }

  const renderItem = ({ item, index }:any) => {
    const backgroundColor = isMe(item) ? "white" : "azure";
    const marginLeft= isMe(item) ? "20%" : "0";
    return (
      <View style={[{backgroundColor, marginLeft},styles.message]}>
        { !isSameMessage(item, index) &&
        <View style={styles.messageHeader} >
          {!isMe(item) &&  <Text style={styles.name}>{item.user?.name}</Text> }
         
          <small><i>{new Intl.DateTimeFormat("fr-FR", optionsTeams).format(new Date(item.creationDate))}</i></small>
        </View>
        }
        <View>
          <Text style={{padding : 5}}>{item.texte}</Text>
        </View>
      </View>
    );
  };

  return (
      <FlatList ref={flatListRef} style={{padding:10, width: '100%'}}
        data={data}
        renderItem={renderItem}
        ListHeaderComponent= {<Text style={styles.listHeader}>Messages</Text>}
        stickyHeaderIndices={[0]}
        onContentSizeChange={()=> flatListRef?.current?.scrollToEnd()}
      />
  );

}

const styles = StyleSheet.create({
  listHeader:{
    fontWeight: 'bold',
    fontSize : 20,
    color: 'blue'
  },
  message:{
    width: '80%',
    borderRadius: 8,
    marginTop: 5,
    borderWidth: 0,
    shadowColor: '#171717',
    shadowOffset: {width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  name: {
    fontWeight: 'bold'
  },
  messageHeader: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    padding: 2
  }
});

export default MessageList;
