import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function EditScene({navigation, route}) {
    const db = SQLite.openDatabase('test.db');
    const [isLoading, setIsLoading] = useState(true);
    const [scenes, setScenes] = useState([]);
    const [choices, setChoices] = useState([]);
    const [currentSceneText, setCurrentSceneText] = useState("");
    //const [defaultSceneText, setDefaultSceneText] = useState("Loading Scene Text");
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

    getSceneText = (sceneID) => {
        console.log("Scene ID: " + sceneID);
        let sceneIndex = scenes.findIndex(scene => scene.id === sceneID);
        console.log("Scene Index: " + sceneIndex);
        if(sceneIndex != -1) {
            console.log("Scene Text: " + scenes.at(sceneIndex).scene_text);
            return (scenes.at(sceneIndex).scene_text);
        }
            
        //let sceneText =  scenes.at(sceneIndex).scene_text;

        //setCurrentSceneText(sceneText);
    }

    const updateSceneText = (id) => {
        console.log("Updated text: " + currentSceneText);

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

        navigation.navigate("Story Graph");
    };

    const trackChanges = (text) => {
        setCurrentSceneText(text);
        console.log("New: " + text);
        console.log("Current Scene Text: " + currentSceneText);
    }

    return (
        <View style={styles.container}>
            <Text>Scene: {route.params.sceneID}</Text>
            <TextInput defaultValue={getSceneText(route.params.sceneID)} onChangeText={trackChanges} multiline={true}/>
            <Button title="Save Changes" onPress={() => updateSceneText(route.params.sceneID)}/>
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