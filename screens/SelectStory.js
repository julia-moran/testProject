import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { Asset } from 'expo-asset';
import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuOption,
    MenuTrigger,
  } from 'react-native-popup-menu';
import Dialog from "react-native-dialog";


if(!( FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
   FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
}
 FileSystem.downloadAsync(
  Asset.fromModule(require('../stories.db')).uri,
  FileSystem.documentDirectory + 'SQLite/stories.db'
);

const db = SQLite.openDatabase('stories.db');

export default function SelectStory({navigation}) {
  const [isLoading, setIsLoading] = useState(true);
  const [stories, setStories] = useState([]);
  const [visible, setVisible] = useState(false);
  const [newStoryTitle, setNewStoryTitle] = useState("");

  const showDialog = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const deleteStory = (storyID) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM story WHERE story_id = ?', [storyID],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let existingStories = [...stories].filter(story => story.story_id !== storyID);
            setStories(existingStories);
          }
        },
        (txObj, error) => console.log(error)
      );
    });
    setVisible(false);
  };

  const addStory = () => {
    db.transaction(tx => {
      tx.executeSql('INSERT INTO story (title) VALUES (?)', [newStoryTitle],
        (txObj, resultSet) => {
          let existingStories = [...stories];
          existingStories.push({ story_id: resultSet.insertId, title: newStoryTitle });
          setStories(existingStories);
          setNewStoryTitle("");
        },
        (txObj, error) => console.log(error)
      );
    });
    setVisible(false);
  };

  //const [choices, setChoices] = useState([]);

  useEffect(() => {
    
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM story', null,
        (txObj, resultSet) => {
            //console.log(resultSet.rows._array);
            setStories(resultSet.rows._array)
        },
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

  const showStories = () => {

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM story', null,
        (txObj, resultSet) => {
            //console.log(resultSet.rows._array);
            setStories(resultSet.rows._array)
        },
        (txObj, error) => console.log(error)
      );
    });
    return stories.map((story, index) => {
        return (
          <View key={index} style={styles.row}>

            <Menu>
            <MenuTrigger text={story.title} />
            <MenuOptions>
                <MenuOption value={story.story_id} text="Edit"/>
                <MenuOption value={story.story_id} text="Run"/>
                <MenuOption value={story.story_id} text="Delete" onSelect={() => deleteStory(story.story_id)}/>
            </MenuOptions>
            </Menu>
          </View>
        );
      });
  }

  return (
    <View style={styles.container}>
    <MenuProvider style={styles.row}>
    {showStories()}
    </MenuProvider>
        
      
      <Button title="New Story" onPress={showDialog} />
      <Dialog.Container visible={visible}>
        <Dialog.Title>Enter the name of your new story</Dialog.Title>
        <Dialog.Input value={newStoryTitle} placeholder='Title' onChangeText={setNewStoryTitle} ></Dialog.Input>
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button label="Add Story" onPress={addStory} />
      </Dialog.Container>
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
      flexDirection: 'column',
      alignItems: 'center',
      alignSelf: 'stretch',
      justifyContent: 'center',
      margin: 8
    }
  });