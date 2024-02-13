import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';
//import App from './App';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WriteScene from './screens/WriteScene';
import RunStory from './screens/RunStory';
import StoryGraph from './screens/StoryGraph';
import EditScene from './screens/EditScene';
import SelectStory from './screens/SelectStory';

const Stack = createNativeStackNavigator();

//AppRegistry.registerComponent('main', () => App);<Stack.Screen name="Select Story" component={SelectStory}/>



function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Story Graph'>
        
        <Stack.Screen name="Story Graph" component={StoryGraph}/>
        <Stack.Screen name="Write Scene" component={WriteScene}/>
        <Stack.Screen name="Run Story" component={RunStory}/>
        <Stack.Screen name="Edit Scene" component={EditScene}/>
      </Stack.Navigator>

    </NavigationContainer>
    
  );
}

export default App;
