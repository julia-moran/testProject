import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function RunStory({navigation, route}) {
    const storyID = route.params.storyID;
    const db = SQLite.openDatabase('test.db');
    const [isLoading, setIsLoading] = useState(true);
    const [scenes, setScenes] = useState([]);
    const [choices, setChoices] = useState([]);
    const [sceneTextInRun, setSceneTextInRun] = useState("");
    const [nextSceneInRun, setNextSceneInRun] = useState("");
    const [sceneIDInRun, setSceneIDInRun] = useState("");
    const [choicesInRun, setChoicesInRun] = useState([]);

    useEffect(() => {
      /*
      db.transaction(tx => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS scene5 (id INTEGER PRIMARY KEY AUTOINCREMENT, story_id INTEGER REFERENCES story(id), scene_text TEXT, next_scene_id INTEGER)')
      });
  
      db.transaction(tx => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS choice3 (id INTEGER PRIMARY KEY AUTOINCREMENT, story_id INTEGER REFERENCES story(id), scene_id INTEGER REFERENCES scene5(id), choice_text TEXT, next_scene_id INTEGER)')
      });*/
  /*
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
        
        setIsLoading(false);*/
      }, []);
    /*
      if (isLoading) {
        return (
          <View style={styles.container}>
            <Text>Loading scenes...</Text>
          </View>
        )
      }*/

      const getChoices = (sceneID) => {
        //console.log(sceneID);
        db.transaction(tx => {
          tx.executeSql('SELECT * FROM choice3 WHERE scene_id = ? and story_id = ?', [sceneID, storyID],
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
        //console.log(choicesInRun);
        return choicesInRun.map((choiceInRun, index) => {
          return (
            <View key={index} style={styles.row}>
              <Button title={choiceInRun.choice_text} onPress={() => {goToSceneByChoice(choiceInRun.id)}}/>
            </View>
          );
        });
      };
    
      const goToSceneByChoice = (choiceID) => {
        let choiceIndex = choices.findIndex(choice => choice.id === choiceID)
        //console.log("Choice ID: " + choiceID);
        let nextSceneID = choices.at(choiceIndex).next_scene_id;
        let sceneIndex = scenes.findIndex(scene => scene.id === nextSceneID);
        
       // console.log("Next Scene: " + sceneIndex);
    
    
        setSceneTextInRun(scenes.at(sceneIndex).scene_text);
        setNextSceneInRun(scenes.at(sceneIndex).next_scene_id);
        setSceneIDInRun(scenes.at(sceneIndex).id);
        getChoices(scenes.at(sceneIndex).id);
      };
    
      const showSceneByID = () => {
         db.transaction(tx => {
          tx.executeSql('SELECT * FROM scene5 WHERE story_id = ?', [storyID],
            (txObj, resultSet) => {
              //console.log(scenes);
              //console.log(resultSet.rows._array);
              tempScenes = resultSet.rows._array;
              //console.log(tempScenes.at(0));
              setScenes(resultSet.rows._array);
              //console.log(scenes);
              setSceneIDInRun(tempScenes.at(0).id);
              setSceneTextInRun(tempScenes.at(0).scene_text);
              setNextSceneInRun(tempScenes.at(0).next_scene_id);
            },
            (txObj, error) => console.log(error)
          );
        });
       
        ///setSceneIDInRun(scenes.at(0).id);
        //setSceneTextInRun(scenes.at(0).scene_text);
        //setNextSceneInRun(scenes.at(0).next_scene_id);
        
        //
      };
    
      const getNextScene = () => {
        let nextSceneID = scenes.findIndex(scene => scene.id === nextSceneInRun);
       // console.log("Test getNextScene: " + nextSceneID);
        setSceneTextInRun(scenes.at(nextSceneID).scene_text);
        setNextSceneInRun(scenes.at(nextSceneID).next_scene_id);
        //console.log("Scene to go: " + nextSceneInRun);
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
          <Text>{storyID}</Text>
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
  