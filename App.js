import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { AppRegistry, Platform } from 'react-native';
import App from './App';

AppRegistry.registerComponent('main', () => App);



export default function() {
  const db = SQLite.openDatabase('test.db');
  const [isLoading, setIsLoading] = useState(true);
  const [scenes, setScenes] = useState([]);
  const [currentSceneText, setCurrentSceneText] = useState("");
  const [currentNextSceneID, setCurrentNextSceneID] = useState("");
  const [sceneTextInRun, setSceneTextInRun] = useState("");

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS scene (id INTEGER PRIMARY KEY AUTOINCREMENT, scene_text TEXT, next_scene_id INTEGER)')
    });

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM scene', null,
        (txObj, resultSet) => setScenes(resultSet.rows._array),
        (txObj, error) => console.log(error)
      );
    });

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading scenes...</Text>
      </View>
    )
  }

  const addScene = () => {
    db.transaction(tx => {
      tx.executeSql('INSERT INTO scene (scene_text, next_scene_id) values (?, ?)', [currentSceneText, currentNextSceneID],
        (txObj, resultSet) => {
          let existingScenes = [...scenes];
          existingScenes.push({ id: resultSet.insertId, scene_text: currentSceneText, next_scene_id: currentNextSceneID});
          setScenes(existingScenes);
          setCurrentSceneText("");
          setCurrentNextSceneID("");
        },
        (txObj, error) => console.log(error)
      );
    });
  }

  const showScenes = () => {
    return scenes.map((scene, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text>{scene.scene_text}</Text>
          <Text>{scene.next_scene_id}</Text>
        </View>
      );
    });
  };

  const showSceneByID = () => {
    setSceneTextInRun(scenes.at(0).scene_text);
  }

  return (
    <View style={styles.container}>
      <TextInput value={currentSceneText} placeholder='Scene Text' onChangeText={setCurrentSceneText}/>
      <TextInput value={currentNextSceneID} placeholder='Next Scene ID' onChangeText={setCurrentNextSceneID}/>
      <Button title='Add Scene' onPress={addScene}/>
      {showScenes()}
      <Button title='Show Scene' onPress={showSceneByID}/>
      <Text>{sceneTextInRun}</Text>
      <StatusBar style="auto" />
    </View>
  );
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
