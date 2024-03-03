import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function WriteScene({navigation}) {
    const db = SQLite.openDatabase('./test.db');
    const [isLoading, setIsLoading] = useState(true);
    const [scenes, setScenes] = useState([]);
    const [choices, setChoices] = useState([]);
    const [currentSceneText, setCurrentSceneText] = useState("");
    const [currentNextSceneID, setCurrentNextSceneID] = useState("");
    const [currentChoiceSceneID, setCurrentChoiceSceneID] = useState("");
    const [currentChoiceText, setCurrentChoiceText] = useState("");
    const [currentChoiceLeadsToID, setCurrentChoiceLeadsToID] = useState("");

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

      const addScene = () => {
        //console.log("Add scene: " + currentSceneText + currentNextSceneID);

        db.transaction(tx => {
          tx.executeSql('INSERT INTO scene4 (scene_text, next_scene_id) values (?, ?)', [currentSceneText, currentNextSceneID],
            (txObj, resultSet) => {
              console.log("Inserting");
              let existingScenes = [...scenes];
              console.log("Existing scenes: " + existingScenes);
              existingScenes.push({ id: resultSet.insertId, scene_text: currentSceneText, next_scene_id: currentNextSceneID});
              console.log("Existing scenes: " + existingScenes);
              setScenes(existingScenes);
              setCurrentSceneText("");
              setCurrentNextSceneID("");
            },
            (txObj, error) => console.log(error)
          );
        });
      }
    
      const addChoice = () => {
        db.transaction(tx => {
          tx.executeSql('INSERT INTO choice2 (scene_id, choice_text, next_scene_id) values (?, ?, ?)', [currentChoiceSceneID, currentChoiceText, currentChoiceLeadsToID],
            (txObj, resultChoices) => {
              let existingChoices = [...choices];
              existingChoices.push({ id: resultChoices.insertId, scene_id: currentChoiceSceneID, choice_text: currentChoiceText, next_scene_id: currentChoiceLeadsToID});
              setChoices(existingChoices);
              setCurrentChoiceText("");
              setCurrentChoiceLeadsToID("");
              setCurrentChoiceSceneID("");
            },
            (txObj, error) => console.log(error)
          );
        });
      };

    return (
        <View style={styles.container}>
          <Text>Test Scene Writer Screen</Text>
          <TextInput value={currentSceneText} placeholder='Scene Text' onChangeText={setCurrentSceneText} multiline={true}/>
          <TextInput value={currentNextSceneID} placeholder='Next Scene ID' onChangeText={setCurrentNextSceneID}/>
          <Button title='Add Scene' onPress={addScene}/>

          <TextInput value={currentChoiceSceneID} placeholder='Choice For Scene' onChangeText={setCurrentChoiceSceneID}/>
          <TextInput value={currentChoiceText} placeholder='Choice Text' onChangeText={setCurrentChoiceText}/>
          <TextInput value={currentChoiceLeadsToID} placeholder='Choice Leads to Scene ID' onChangeText={setCurrentChoiceLeadsToID}/>
          <Button title='Add Choice' onPress={addChoice}/>
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
  