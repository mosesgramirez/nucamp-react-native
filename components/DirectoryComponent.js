import React, { Component } from 'react';
import { FlatList, View, Text } from 'react-native';
import { Tile } from 'react-native-elements';
import Loading from './LoadingComponent';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        campsites: state.campsites,
    }
}

// Note: require() is a node.js function.
// Note: onPress() is a method of ListItem.
// Each 'screen' component is automatically provided with the 'navigation' prop.


class Directory extends Component {
    // Delete constructor and local state for Redux.
    // Configure text for header. "static" is a js keyword.

    static navigationOptions = {
        title: 'Directory'
    }

    render() {
        const { navigate } = this.props.navigation;
        const renderDirectoryItem = ({item}) => {
            return (
                <Animatable.View animation='fadeInRightBig' duration={500} delay={300}>
                    <Tile
                        title={item.name}
                        caption={item.description}
                        featured
                        onPress={() => navigate('CampsiteInfo', { campsiteId: item.id })}
                        imageSrc={{uri: baseUrl + item.image}}
                    />
                </Animatable.View>
            );
        };

        if (this.props.campsites.isLoading) {
            return <Loading />;
        }

        if (this.props.campsites.errMess) {
            return (
                <View>
                    <Text>{this.props.campsites.errMess}</Text>
                </View>
            )
        }

        return (
            <FlatList
                data={this.props.campsites.campsites}
                renderItem={renderDirectoryItem}
                keyExtractor={item => item.id.toString()}
            />
        );
    }
}

export default connect(mapStateToProps)(Directory);