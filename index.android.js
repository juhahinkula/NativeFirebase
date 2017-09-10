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
  apiKey: "YOUR_API_KEY",
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
  
  keyExtractor = (item) => item.description;

  renderItem = ({item}) =>
  <View >
    <Text>{item}</Text>
  </View>;

  saveData = () => {
    fetch('https://YOUR_PROJECT.firebaseio.com/todos.json', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: this.state.description,
        date: new Date()
      })
    }) 
  };

  listenForItems(itemsRef) {
    itemsRef.on('value', (snap) => {
      var items = [];
      snap.forEach((child) => {
        items.push(
          child.val().description,
        );
      });

      var s= JSON.stringify(items);
      console.log("s: " + s);

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
