import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card } from 'react-native-elements';
import { CAMPSITES } from '../shared/campsites';
import { PROMOTIONS } from '../shared/promotions';
import { PARTNERS } from '../shared/partners';

// Didn't use destructured {item} so that I could include another prop.
function RenderItem(props) {
    console.log(props);
    if (props.item) {
        const bottomMargin = props.lastItem ? 16 : 0;
        return (
            <Card
                featuredTitle={props.item.name}
                image={require('./images/react-lake.jpg')}
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
    constructor(props) {
        super(props);
        this.state = {
            campsites: CAMPSITES,
            promotions: PROMOTIONS,
            partners: PARTNERS
        };
    }

    static navigationOptions = {
        title: 'Home'
    }

    render() {
        return (
            <ScrollView style={{backgroundColor:'#eee'}}>
                <RenderItem
                    item={this.state.campsites.filter(campsite => campsite.featured)[0]} />
                <RenderItem
                    item={this.state.promotions.filter(promotion => promotion.featured)[0]} />
                <RenderItem
                    item={this.state.partners.filter(partner => partner.featured)[0]} 
                    lastItem={true}
                />
            </ScrollView>
        );
    }
}

export default Home;