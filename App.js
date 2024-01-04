import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';
//import App from './App';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SceneWriter from './screens/SceneWriter';
import RunStory from './screens/RunStory';


const Stack = createNativeStackNavigator();

//AppRegistry.registerComponent('main', () => App);



function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Scene Writer'>
        <Stack.Screen name="Scene Writer" component={SceneWriter}/>
        <Stack.Screen name="Run Story" component={RunStory}/>
      </Stack.Navigator>

    </NavigationContainer>
    
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    margin: 8
  }
});
