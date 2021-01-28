import React from 'react';
import { FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';

// Note: require() is a node.js function.
// Note: onPress() is a method of ListItem.

export default function Directory(props) {
    
    const renderDirectoryItem = ({item}) => {
        return (
            <ListItem
                title={item.name}
                subtitle={item.description}
                onPress={() => props.uponPress(item.id)}
                leftAvatar={{ source: require('./images/react-lake.jpg')}}
             />   
        );
    };

    return (
        <FlatList
            data={props.campsites}
            renderItem={renderDirectoryItem}
            keyExtractor={item => item.id.toString()}
        />
    );
}