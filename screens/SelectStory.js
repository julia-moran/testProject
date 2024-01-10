
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';


export default function StoryGraph({navigation}) {
    const db = SQLite.openDatabase('test.db');
    const [isLoading, setIsLoading] = useState(true);
    const [stories, setStories] = useState([]);
    const [currentTitle, setCurrentTitle] = useState("");
    
    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS story (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT)')
        });

        db.transaction(tx => {
            tx.executeSql('SELECT * FROM story', null,
            (txObj, resultSet) => setStories(resultSet.rows._array),
            (txObj, error) => console.log(error)
            );
        });

        setIsLoading(false);
    }, []);

    if (isLoading) {
      return (
        <View style={styles.container}>
          <Text>Loading stories...</Text>
        </View>
      )
    }

    const createStory = () => {
        db.transaction(tx => {
            tx.executeSql('INSERT INTO story (title) values (?)', [currentTitle],
            (txObj, resultSet) => {
                let existingStories = [...stories];
                existingStories.push({ id: resultSet.insertId, title: currentTitle });
                setStories(existingStories);
                setCurrentTitle("");
            },
            (txObj, error) => console.log(error)
            );
        });
    };

    const showStories = () => {

        db.transaction(tx => {
          tx.executeSql('SELECT * FROM story', null,
            (txObj, resultSet) => setStories(resultSet.rows._array),
            (txObj, error) => console.log(error)
          );
        });
        
        return stories.map((story, index) => {
          return (
              <View style={styles.row} key={index}>
                <Text>{story.title}</Text>
                <Button title='Edit' onPress={() => navigation.navigate("Story Graph", {storyID: story.id})}/>
               
              </View>
          );
        });
    };

    return (
        <View style={styles.container}>
            <Text>Test Select Story Screen</Text> 
            <TextInput value={currentTitle} placeholder='Title' onChangeText={setCurrentTitle}/>
            <Button title='Create Story' onPress={createStory}/>
            {showStories()}
           
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
     },
      
    slideInOption: {
      padding: 1,
    },
    text: {
      fontSize: 18,
    },

    container2: {
      height: '30',
      width: '100%',
      display: 'flex',
      alignItems: 'flex-end',
      position: 'absolute'
    },
    topbar: {
      flexDirection: 'row',
      backgroundColor: 'dimgray',
      paddingTop : 15,
    },
    trigger: {
      padding: 5,
      margin: 5,
    },

    options: {
      flexDirection: 'column',
      flexGrow:1
    }
  });
  