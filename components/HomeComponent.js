import React, { Component } from 'react';
import { View, Text, Animated } from 'react-native';
import { Card } from 'react-native-elements';
import Loading from './LoadingComponent';
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
    const {item} = props;

    if (props.isLoading) {
        return <Loading />;
    }

    if (props.errMess) {
        return (
            <View>
                <Text>{props.errMess}</Text>
            </View>
        )
    }

    if (item) {
        const bottomMargin = props.lastItem ? 16 : 0;
        return (
            <Card
                featuredTitle={item.name}
                image={{uri: baseUrl + item.image}}
                containerStyle={{marginBottom:bottomMargin}}
            >
                <Text style={{margin: 10}}>
                    {item.description}
                </Text>
            </Card>
        );
    }
    return <View />;
}

class Home extends Component {
    // Deleted original constructor for Redux.
    constructor(props) {
        super(props);
        this.state = {
            // arbitrary key name
            scaleValue: new Animated.Value(0)
        }
    }

    // arbitrary function name
    animate() {
        Animated.timing(
            this.state.scaleValue,
            {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
            }
        ).start();
    }

    

    componentDidMount() {
        this.animate();
    }

    static navigationOptions = {
        title: 'Home'
    }

    render() {
        return (
            <Animated.ScrollView style={{
                backgroundColor:'#eee', 
                transform: [{scale: this.state.scaleValue}]
                }}
            >
                <RenderItem
                    item={this.props.campsites.campsites.filter(campsite => campsite.featured)[0]} 
                    isLoading={this.props.campsites.isLoading}    
                    errMess={this.props.campsites.errMess}
                />
                <RenderItem
                    item={this.props.promotions.promotions.filter(promotion => promotion.featured)[0]} 
                    isLoading={this.props.promotions.isLoading}    
                    errMess={this.props.promotions.errMess}
                />
                <RenderItem
                    item={this.props.partners.partners.filter(partner => partner.featured)[0]} 
                    isLoading={this.props.partners.isLoading}    
                    errMess={this.props.partners.errMess}
                    lastItem={true}
                />
            </Animated.ScrollView>
        );
    }
}

export default connect(mapStateToProps)(Home);