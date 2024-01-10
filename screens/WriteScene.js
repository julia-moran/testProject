import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function WriteScene({navigation, route}) {
    const storyID = route.params.storyID;

    const db = SQLite.openDatabase('test.db');
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
        tx.executeSql('CREATE TABLE IF NOT EXISTS scene5 (id INTEGER PRIMARY KEY AUTOINCREMENT, story_id INTEGER REFERENCES story(id), scene_text TEXT, next_scene_id INTEGER)')
      });
  
      db.transaction(tx => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS choice3 (id INTEGER PRIMARY KEY AUTOINCREMENT, story_id INTEGER REFERENCES story(id), scene_id INTEGER REFERENCES scene5(id), choice_text TEXT, next_scene_id INTEGER)')
      });
  
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM scene5 WHERE story_id = ?', [storyID],
          (txObj, resultSet) => setScenes(resultSet.rows._array),
          (txObj, error) => console.log(error)
        );
      });
  
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM choice3 WHERE story_id = ?', [storyID],
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
        db.transaction(tx => {
          tx.executeSql('INSERT INTO scene5 (story_id, scene_text, next_scene_id) values (?, ?, ?)', [storyID, currentSceneText, currentNextSceneID],
            (txObj, resultSet) => {
              let existingScenes = [...scenes];
              existingScenes.push({ id: resultSet.insertId, story_id: storyID, scene_text: currentSceneText, next_scene_id: currentNextSceneID});
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
          tx.executeSql('INSERT INTO choice3 (story_id, scene_id, choice_text, next_scene_id) values (?, ?, ?, ?)', [storyID, currentChoiceSceneID, currentChoiceText, currentChoiceLeadsToID],
            (txObj, resultChoices) => {
              let existingChoices = [...choices];
              existingChoices.push({ id: resultChoices.insertId, story_id: storyID, scene_id: currentChoiceSceneID, choice_text: currentChoiceText, next_scene_id: currentChoiceLeadsToID});
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
          <Text>{storyID}</Text>
          <TextInput value={currentSceneText} placeholder='Scene Text' onChangeText={setCurrentSceneText} multiline={true}/>
          <TextInput value={currentNextSceneID} placeholder='Next Scene ID' onChangeText={setCurrentNextSceneID}/>
          <Button title='Add Scene' onPress={addScene}/>

          <TextInput value={currentChoiceSceneID} placeholder='Choice For Scene' onChangeText={setCurrentChoiceSceneID}/>
          <TextInput value={currentChoiceText} placeholder='Choice Text' onChangeText={setCurrentChoiceText}/>
          <TextInput value={currentChoiceLeadsToID} placeholder='Choice Leads to Scene ID' onChangeText={setCurrentChoiceLeadsToID}/>
          <Button title='Add Choice' onPress={addChoice}/>
          <Button title="Run Story" onPress={() => navigation.navigate("Run Story", {storyID: storyID})}/>
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
  