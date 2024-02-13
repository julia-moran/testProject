import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';

//import Draggable from 'react-native-draggable';

export default function StoryGraph({navigation}) {
  const db = SQLite.openDatabase('test.db');
  const [isLoading, setIsLoading] = useState(true);
  const [scenes, setScenes] = useState([]);
  const [choices, setChoices] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS scene4 (id INTEGER PRIMARY KEY AUTOINCREMENT, scene_text TEXT, next_scene_id INTEGER)')
    });

    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS choice2 (id INTEGER PRIMARY KEY AUTOINCREMENT, scene_id INTEGER REFERENCES scene4(id), choice_text TEXT, next_scene_id INTEGER)')
    });

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM scene4', null,
        (txObj, resultSet) => setScenes(resultSet.rows._array),
        (txObj, error) => console.log(error)
      );
    });

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM choice2', null,
        (txObj, resultSet) => setChoices(resultSet.rows._array),
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
*/
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
  };

  return (
    <View style={styles.container}>
      {showScenes()}
      {showChoices()}
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