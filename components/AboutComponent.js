import React, { Component } from 'react';
import { ScrollView, FlatList, Text, View, Image } from 'react-native';
import { Card, ListItem } from 'react-native-elements';
import Loading from './LoadingComponent';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        partners: state.partners
    }
}

class About extends Component {

    static navigationOptions = {
        title: 'About Us'
    }

    render() {
        const renderPartner = ({item}) => {
            return (
                <ListItem
                    title={item.name}
                    subtitle={item.description}
                    leftAvatar={{source: {uri: baseUrl + item.image}} }
                />
            );
        };

        if (this.props.partners.isLoading) {
            return (
                <ScrollView style={{backgroundColor:'#eee'}}>
                <Mission />
                <Card title="Community Partners" containerStyle={{marginBottom:16}} wrapperStyle={{margin:20, marginTop:0}}>
                    <Loading />
                </Card>
            </ScrollView>
            )
        }

        if (this.props.partners.errMess) {
            return (
                <ScrollView style={{backgroundColor:'#eee'}}>
                    <Animatable.View animation='fadeInDown' duration={500} delay={300}>
                        <Mission />
                        <Card title="Community Partners" containerStyle={{marginBottom:16}} wrapperStyle={{margin:20, marginTop:0}}>
                            <Text>{this.props.partners.errMess}</Text>
                        </Card>
                    </Animatable.View>
                </ScrollView>
            )
        }

        return (
            <ScrollView style={{backgroundColor:'#eee'}}>
                <Animatable.View animation='fadeInDown' duration={500} delay={300}>
                    <Mission />
                    <Card title="Community Partners" containerStyle={{marginBottom:16}} wrapperStyle={{margin:20, marginTop:0}}>
                        <FlatList
                            data={this.props.partners.partners}
                            renderItem={renderPartner}
                            keyExtractor={item => item.id.toString()}
                        />
                    </Card>
                </Animatable.View>
            </ScrollView>
        );
    }
}

function Mission() {
    return (
        <Card title="Our Mission" wrapperStyle={{margin:20, marginTop:0}}>
                <Text>
                We present a curated database of the best campsites in the vast woods and backcountry of the World Wide Web Wilderness. We increase access to adventure for the public while promoting safe and respectful use of resources. The expert wilderness trekkers on our staff personally verify each campsite to make sure that they are up to our standards. We also present a platform for campers to share reviews on campsites they have visited with each other.
                </Text>
            </Card>
    );
}

export default connect(mapStateToProps)(About);