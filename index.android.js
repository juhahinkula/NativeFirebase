/**
 * React Native todo list with Firebase
 */

import React, { Component } from 'react';
import * as firebase from 'firebase';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  Button,
  FlatList,
  View
} from 'react-native';

const firebaseConfig = {
  apiKey: "YOUR_API_KET",
  authDomain: "YOUR_DOMAIN",
  databaseURL: "YOUR_DB_URL",
  storageBucket: "YOUR_BUCKET"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

export default class nativefirebase extends Component {
  
  constructor(props) {
    super(props);
    //realtime listener for firebase db
    this.itemsRef = firebaseApp.database().ref('todos');
    this.state = { description: '', todos: [] };
  }
  
  keyExtractor = (item) => item.id;

  renderItem = ({item}) =>
  <View >
    <Text>{item.description}, {item.date}</Text>   
  </View>;

  saveData = () => {
    let dat = new Date();
    let datString = (dat.getMonth() + 1) + "-" + dat.getDate() + "-" + dat.getFullYear();
    this.itemsRef.push({ description: this.state.description, date: datString});


  };

  // List todos
  listenForItems(itemsRef) {
    itemsRef.on('value', (snap) => {
      var items = [];
      snap.forEach((child) => {
        items.push({
          id: child.key,
          description: child.val().description,
          date: child.val().date,
        });
      });

      this.setState({
        todos: items
      });

    });
  }

  componentDidMount() {
    this.listenForItems(this.itemsRef);
  }

  render() {
    return (
      <View style={styles.maincontainer}>
        <View style={styles.inputcontainer}>
          <TextInput
          style={{height: 40, width: 200, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(description) => this.setState({description})}
          value={this.state.text}
          />
          <Button onPress={this.saveData} title="Save" /> 
        </View>
        <View style={styles.listcontainer}>
          <FlatList
            data = {this.state.todos}
            keyExtractor = {this.keyExtractor}
            renderItem = {this.renderItem}
            />
        </View>        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  inputcontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  listcontainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

});

AppRegistry.registerComponent('nativefirebase', () => nativefirebase);
