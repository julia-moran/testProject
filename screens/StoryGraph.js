import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { Asset } from 'expo-asset';


//import Draggable from 'react-native-draggable';

if(!( FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
   FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
}
 FileSystem.downloadAsync(
  Asset.fromModule(require('../stories.db')).uri,
  FileSystem.documentDirectory + 'SQLite/stories.db'
);

const db = SQLite.openDatabase('stories.db');

export default function StoryGraph({navigation}) {
  const [isLoading, setIsLoading] = useState(true);
  const [stories, setStories] = useState([]);
  //const [choices, setChoices] = useState([]);

  useEffect(() => {
    
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM story', null,
        (txObj, resultSet) => console.log(resultSet.rows._array),
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
/*
  const showScenes = () => {

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM scene4', null,
        (txObj, resultSet) => setScenes(resultSet.rows._array),
        (txObj, error) => console.log(error)
      );
    });
    
    return scenes.map((scene, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text>{scene.id}</Text>
          <Text>{scene.scene_text}</Text>
          <Text>{scene.next_scene_id}</Text>
          <Button title="Delete" onPress={() => deleteScene(scene.id)}/>
          <Button title="Edit" onPress={() => navigation.navigate("Edit Scene", {sceneID: scene.id})}/>
        </View>
      );
    });
  };
*/
  const showChoices = () => {
    return choices.map((choice, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text>{choice.id}</Text>
          <Text>{choice.choice_text}</Text>
          <Text>{choice.scene_id}</Text>
          <Text>{choice.next_scene_id}</Text>
        </View>
      );
    });
  };
/*
  const updateScene = (id) => {
    db.transaction(tx => {
      tx.executeSql('UPDATE scene4 SET scene_text = ? WHERE id = ?', [currentSceneText, id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected) {
            let existingScenes = [...scenes];
            const indexToUpdate = existingScenes.findIndex(scene => scene.id === id);
            existingScenes[indexToUpdate].scene_text = currentSceneText;
            setScenes(existingScenes);
            setCurrentSceneText("");
          }
        },
        (txObj, error) => console.log(error)
      );
    });
  };

  const deleteScene = (id) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM scene4 WHERE id = ?', [id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let existingScenes = [...scenes].filter(scene => scene.id !== id);
            setScenes(existingScenes);
          }
        },
        (txObj, error) => console.log(error)
      );
    });
  };*/

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