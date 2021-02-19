import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, Button, StyleSheet, Alert, PanResponder, Share } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        campsites: state.campsites,
        comments: state.comments,
        favorites: state.favorites,
    }
}

const mapDispatchToProps = {
    postFavorite: campsiteId => postFavorite(campsiteId),
    postComment: (campsiteId, rating, author, text) => postComment(campsiteId, rating, author, text)
};

function RenderCampsite(props) {
    const {campsite} = props;

    const viewRef = React.createRef();

    const isSwipeLeft = ({dx}) => dx < -150;
    const isSwipeRight = ({dx}) => dx > 150;
    
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: () => true,
        // Allows for up/down scrolling on the campsite card.
        onShouldBlockNativeResponder: () => false,
        // React Animatable animations can be used as methods. 
        // Also, the promise here is optional, for demonstration purposes.
        onPanResponderGrant: () => {
            viewRef.current.jello(500)
            .then(endState => console.log(endState.finished ? 'Animation finished' : 'Action canceled'));
        },
        // Alternate gesture: swipe left to set favorite.
        onPanResponderEnd: (e, gestureState) => {
            console.log('pan responder end:', gestureState);
            if (isSwipeLeft(gestureState)) {
                Alert.alert(
                    'Add Favorite',
                    `Are you sure you wish to add ${campsite.name} to Favorites?`,
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                            onPress: () => console.log('Cancel pressed')
                        },
                        {
                            text: 'OK',
                            onPress: () => props.favorite 
                                ? console.log('Already set as favorite')
                                : props.markFavorite()
                        }
                    ],
                    { cancelable: false }
                )
            }
            // Alternate gesture: swipe right to submit comment.
            else if (isSwipeRight(gestureState)) {
                props.onShowModal()
            }
            return true;
        }
    })

    const shareCampsite = (title, message, url) => {
        Share.share(
        {
            title: title,
            message: `${title}: ${message} ${url}`,
            url: url
        },
        {
            dialogTitle: 'Share ' + title
        });
    };

    if (campsite) {
        return (
            <Animatable.View 
                animation='fadeInDown' 
                duration={500} 
                delay={300}
                ref={viewRef}
                {...panResponder.panHandlers}
            >
                <Card
                    featuredTitle={campsite.name}
                    image={{uri: baseUrl + campsite.image}}
                >
                    <Text style={{margin: 10}}>
                        {campsite.description}
                    </Text>
                    <View style={styles.cardRow}>
                        <Icon
                            name={props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            raised
                            reverse
                            onPress={() => props.favorite 
                                ? console.log("Already set as a favorite")
                                : props.markFavorite()}
                        />
                        <Icon
                            name='pencil'
                            type='font-awesome'
                            color='#5637dd'
                            raised
                            reverse
                            onPress={() => props.onShowModal()}
                        />
                        <Icon
                            name={'share-alt'}
                            type='font-awesome'
                            color='#5637DD'
                            raised
                            reverse
                            onPress={() => shareCampsite(campsite.name, campsite.description, baseUrl + campsite.image)} 
                        />
                    </View>
                </Card>
            </Animatable.View>
        );
    }
    return <View />;
}

function RenderComments({comments}) {

    const renderCommentItem = ({item}) => {
        return (
            <View style={{margin:10}}>
                <Text style={{fontSize:14}}>{item.text}</Text> 
                <Rating 
                    startingValue={item.rating} 
                    imageSize={10}
                    style={{
                        alignItems: 'flex-start',
                        paddingVertical: '5%'
                    }}
                    readonly
                />     
                <Text style={{fontSize:14}}>{` --- ${item.author}, ${item.date}`}</Text> 
            </View>
        )
    };

    return (
        <Animatable.View animation='fadeInUp' duration={500} delay={300}>
            <Card 
                title='Comments'
                containerStyle={{marginBottom:16}} 
                wrapperStyle={{margin:20, marginTop:0}}
            >
                <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Card>
        </Animatable.View>
    )
}

class CampsiteInfo extends Component {
    // Delete original constructor after connecting to Redux store
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            rating: 5,
            author: '',
            text: ''
        }
    }

    markFavorite(campsiteId) {
        this.props.postFavorite(campsiteId);
    }

    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }

    handleComment(campsiteId) {
        // console.log(JSON.stringify(this.state));
        this.toggleModal();
        this.props.postComment(campsiteId, this.state.rating, this.state.author, this.state.text);
    }

    resetForm() {
        this.setState({
            showModal: false,
            rating: 5,
            author: '',
            text: ''
        });
    }


    static navigationOptions = {
        title: 'Campsite Information'
    }

    render() {
        const campsiteId = this.props.navigation.getParam('campsiteId');
        const campsite = this.props.campsites.campsites.filter(campsite => campsite.id === campsiteId)[0];
        const comments = this.props.comments.comments.filter(comment => comment.campsiteId === campsiteId);
        
        return (
            <ScrollView style={{backgroundColor:'#eee'}}> 
                <RenderCampsite campsite={campsite} 
                    favorite={this.props.favorites.includes(campsiteId)}
                    markFavorite={() => this.markFavorite(campsiteId)}
                    onShowModal={() => this.toggleModal()}
                />
                <RenderComments comments={comments} />
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onRequestClose={() => this.toggleModal()}
                >
                    <View style={styles.modal}>
                        <Rating
                            showRating
                            startingValue={this.state.rating}
                            imageSize={40}
                            onFinishRating={newRating => this.setState({rating: newRating})} 
                            style={{paddingVertical: 10}}
                        ></Rating>
                        <Input
                            placeholder='Your Name'
                            leftIcon={{name: 'user-o', type: 'font-awesome'}}
                            leftIconContainerStyle={{paddingRight:10}}
                            onChangeText={newAuthor => this.setState({author: newAuthor})} 
                            value={this.state.author}
                        ></Input>
                        <Input
                            placeholder='Your Comments'
                            leftIcon={{name: 'comment-o', type: 'font-awesome'}}
                            leftIconContainerStyle={{paddingRight:10}}
                            onChangeText={newText => this.setState({text: newText})} 
                            value={this.state.text}
                            ></Input>
                            
                        <View style={{margin: 10}} >  
                            <Button
                                onPress={() => {
                                    this.handleComment(campsiteId);
                                    this.resetForm();
                                }}
                                color='#5637dd'
                                title='Submit'
                            />
                        </View>
                        <View style={{margin: 10}} >  
                            <Button
                                onPress={() => {
                                    this.toggleModal();
                                    this.resetForm();
                                }}
                                color='#808080'
                                title='Cancel'
                            />
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    cardRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    modal: { 
        justifyContent: 'center',
        margin: 20
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(CampsiteInfo);