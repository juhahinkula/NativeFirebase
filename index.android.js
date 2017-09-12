/**
 * React Native todo list with Firebase
 */

import React, { Component } from 'react';
import * as firebase from 'firebase';
import Toast, {DURATION} from 'react-native-easy-toast';
import DatePicker from 'react-native-datepicker';
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
  apiKey: "AIzaSyBPA0cO9zhmh0LscOORL_OG0IB7MA57Edw",
  authDomain: "reactexample-ea128.firebaseapp.com",
  databaseURL: "https://reactexample-ea128.firebaseio.com",
  storageBucket: "reactexample-ea128.appspot.com"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

export default class nativefirebase extends Component {
  
  constructor(props) {
    super(props);
    //realtime listener for firebase db
    this.itemsRef = firebaseApp.database().ref('todos');
    this.state = { description: '', todos: [], date: '' };
  }
  
  keyExtractor = (item) => item.id;

  renderItem = ({item}) =>
  <View >
    <Text>{item.description}, {item.date}</Text>   
  </View>;

  saveData = () => {
    this.itemsRef.push({ description: this.state.description, date: this.state.date});
    this.refs.toast.show('Todo saved');
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
          placeholder="description"
          />
          <DatePicker
          style={{width: 200}}
          date={this.state.date}
          mode="date"
          placeholder="select date"
          format="YYYY-MM-DD" 
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0
            },
            dateInput: {
              marginLeft: 36
            }
            // ... You can check the source to find the other keys.
          }}
          onDateChange={(date) => {this.setState({date: date})}}
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
        <Toast ref="toast" position="top"/>        
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
