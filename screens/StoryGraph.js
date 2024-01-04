import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function StoryGraph({navigation}) {
  return (
    <View style={styles.container}>
      <Button title="New Scene" onPress={() => navigation.navigate("Write Scene")}/>
      <Button title="Run Story" onPress={() => navigation.navigate("Run Story")}/>
    </View>    

  )
}

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