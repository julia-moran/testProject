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
  const [choices, setChoices] = useState([]);
  const [currentSceneText, setCurrentSceneText] = useState("");
  const [currentNextSceneID, setCurrentNextSceneID] = useState("");
  const [currentChoiceSceneID, setCurrentChoiceSceneID] = useState("");
  const [currentChoiceText, setCurrentChoiceText] = useState("");
  const [currentChoiceLeadsToID, setCurrentChoiceLeadsToID] = useState("");
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

  const addScene = () => {
    db.transaction(tx => {
      tx.executeSql('INSERT INTO scene4 (scene_text, next_scene_id) values (?, ?)', [currentSceneText, currentNextSceneID],
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

  const showScenes = () => {
    return scenes.map((scene, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text>{scene.id}</Text>
          <Text>{scene.scene_text}</Text>
          <Text>{scene.next_scene_id}</Text>
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

  return (
    <View style={styles.container}>
      <TextInput value={currentSceneText} placeholder='Scene Text' onChangeText={setCurrentSceneText}/>
      <TextInput value={currentNextSceneID} placeholder='Next Scene ID' onChangeText={setCurrentNextSceneID}/>
      <Button title='Add Scene' onPress={addScene}/>

      <TextInput value={currentChoiceSceneID} placeholder='Choice For Scene' onChangeText={setCurrentChoiceSceneID}/>
      <TextInput value={currentChoiceText} placeholder='Choice Text' onChangeText={setCurrentChoiceText}/>
      <TextInput value={currentChoiceLeadsToID} placeholder='Choice Leads to Scene ID' onChangeText={setCurrentChoiceLeadsToID}/>
      <Button title='Add Choice' onPress={addChoice}/>
      {showScenes()}
      {showChoices()}
      <Button title='Start Story' onPress={showSceneByID}/>
      <Text>{sceneTextInRun}</Text>
      <Text>{nextSceneInRun}</Text>
      <Text>{sceneIDInRun}</Text>
      {showChoiceButtons()}
      <Button title='Next Scene' onPress={getNextScene}/>
      
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
