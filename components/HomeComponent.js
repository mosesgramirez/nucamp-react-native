import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';

const mapStateToProps = state => {
    return {
        campsites: state.campsites,
        promotions: state.promotions,
        partners: state.partners
    }
}

// Didn't use destructured {item} so that I could include another prop.
function RenderItem(props) {
    // console.log(props);

    if (props.item) {
        const bottomMargin = props.lastItem ? 16 : 0;
        return (
            <Card
                featuredTitle={props.item.name}
                image={{uri: baseUrl + props.item.image}}
                containerStyle={{marginBottom:bottomMargin}}
            >
                <Text style={{margin: 10}}>
                    {props.item.description}
                </Text>
            </Card>
        );
    }
    return <View />;
}

class Home extends Component {
    // Delete constructor for Redux.

    static navigationOptions = {
        title: 'Home'
    }

    render() {
        return (
            <ScrollView style={{backgroundColor:'#eee'}}>
                <RenderItem
                    item={this.props.campsites.campsites.filter(campsite => campsite.featured)[0]} />
                <RenderItem
                    item={this.props.promotions.promotions.filter(promotion => promotion.featured)[0]} />
                <RenderItem
                    item={this.props.partners.partners.filter(partner => partner.featured)[0]} 
                    lastItem={true}
                />
            </ScrollView>
        );
    }
}

export default connect(mapStateToProps)(Home);