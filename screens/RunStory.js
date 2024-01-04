import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function RunStory({navigation}) {
    const db = SQLite.openDatabase('test.db');
    const [isLoading, setIsLoading] = useState(true);
    const [scenes, setScenes] = useState([]);
    const [choices, setChoices] = useState([]);
    const [sceneTextInRun, setSceneTextInRun] = useState("");
    const [nextSceneInRun, setNextSceneInRun] = useState("");
    const [sceneIDInRun, setSceneIDInRun] = useState("");
    const [choicesInRun, setChoicesInRun] = useState([]);

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

      const getChoices = (sceneID) => {
        console.log(sceneID);
        db.transaction(tx => {
          tx.executeSql('SELECT * FROM choice2 WHERE scene_id = ?', [sceneID],
            (txObj, resultChoices) => {
              setChoicesInRun(resultChoices.rows._array);
              //console.log(choicesInRun);
              //setChoicesInRun([]);
            },
            (txObj, error) => console.log(error)
          );
        });
      }

      const showChoiceButtons = () => {
        console.log(choicesInRun);
        return choicesInRun.map((choiceInRun, index) => {
          return (
            <View key={index} style={styles.row}>
              <Button title={choiceInRun.choice_text} onPress={() => {goToSceneByChoice(choiceInRun.id)}}/>
            </View>
          );
        });
      };
    
      const goToSceneByChoice = (choiceID) => {
        let choiceIndex = (parseInt(choiceID)) - 1;
        console.log("Choice ID: " + choiceID);
        let sceneIndex = (parseInt(choices.at(choiceIndex).next_scene_id)) - 1;
        console.log("Next Scene: " + sceneIndex);
    
    
        setSceneTextInRun(scenes.at(sceneIndex).scene_text);
        setNextSceneInRun(scenes.at(sceneIndex).next_scene_id);
        setSceneIDInRun(scenes.at(sceneIndex).id);
        getChoices(scenes.at(sceneIndex).id);
      };
    
      const showSceneByID = () => {
        setSceneTextInRun(scenes.at(0).scene_text);
        setNextSceneInRun(scenes.at(0).next_scene_id);
        setSceneIDInRun(scenes.at(0).id);
        //
      };
    
      const getNextScene = () => {
        let nextSceneID = (parseInt(nextSceneInRun)) - 1;
        setSceneTextInRun(scenes.at(nextSceneID).scene_text);
        setNextSceneInRun(scenes.at(nextSceneID).next_scene_id);
        console.log("Scene to go: " + nextSceneInRun);
        setSceneIDInRun(scenes.at(nextSceneID).id);
        getChoices(scenes.at(nextSceneID).id);
      };
    
      const displayNextSceneButton = () => {
        if(nextSceneInRun != "") {
          return (
            <View style={styles.row}>
              <Button title='Next Scene' onPress={getNextScene}/>
            </View>
          )
        }
      }


    return (
        <View style={styles.container}>
          <Text>Test Run Story Screen</Text>
          <Button title='Start Story' onPress={showSceneByID}/>
          <Text>{sceneTextInRun}</Text>
          <Text>{nextSceneInRun}</Text>
          <Text>{sceneIDInRun}</Text>
          {showChoiceButtons()}
          {displayNextSceneButton()}
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
  