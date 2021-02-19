import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Input, CheckBox, Button, Icon } from 'react-native-elements';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import * as Permissons from 'expo-permissions';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { baseUrl } from '../shared/baseUrl';

class LoginTab extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            username: '',
            password: '',
            remember: false
        };
    }

    static navigationOptions = {
        title: 'Login',
        tabBarIcon: ({tintColor}) => (
            <Icon   
                name='sign-in'
                type='font-awesome'
                iconStyle={{color: tintColor}}
            />
        )
    }

    handleLogin() {
        console.log(JSON.stringify(this.state));
        if (this.state.remember) {
            SecureStore.setItemAsync(
                'userinfo',
                JSON.stringify({
                    username: this.state.username,
                    password: this.state.password
                })
            ).catch(error => console.log('Could not save user info', error));
        } else {
            SecureStore.deleteItemAsync('userinfo').catch(
                error => console.log('Could not delete user info', error)
            );
        }
    }

    // userdata = temp variable to change back to object
    componentDidMount() {
        SecureStore.getItemAsync('userinfo')
            .then(userdata => {
                const userinfo = JSON.parse(userdata);
                if (userinfo) {
                    this.setState({ username: userinfo.username })
                    this.setState({ password: userinfo.password })
                    this.setState({ remember: true })
                }
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <Input
                    placeholder="Username"
                    leftIcon={{type: 'font-awesome', name: 'user-o'}}
                    onChangeText={username => this.setState({username})}
                    value={this.state.username}
                    containerStyle={styles.formInput}
                    leftIconContainerStyle={styles.formIcon}
                />
                <Input
                    placeholder="Password"
                    leftIcon={{type: 'font-awesome', name: 'key'}}
                    onChangeText={password => this.setState({password})}
                    value={this.state.password}
                    containerStyle={styles.formInput}
                    leftIconContainerStyle={styles.formIcon}
                />
                <CheckBox 
                    title="Remember Me"
                    center
                    checked={this.state.remember}
                    onPress={() => this.setState({remember: !this.state.remember})}    
                />
                <View style={styles.formButton}>
                    <Button
                        onPress={() => this.handleLogin()}
                        title='Login'
                        icon={
                            <Icon   
                                name='sign-in'
                                type='font-awesome'
                                color='#fff'
                                iconStyle={{marginRight: 10}}
                            />
                        }
                        buttonStyle={{backgroundColor: '#5637dd'}} 
                    />
                </View>
                <View style={styles.formButton}>
                    <Button
                        onPress={() => this.props.navigation.navigate('Register')}
                        title='Register'
                        type='clear'
                        icon={
                            <Icon   
                                name='user-plus'
                                type='font-awesome'
                                color='blue'
                                iconStyle={{marginRight: 10}}
                            />
                        }
                        titleStyle={{color: '#5637dd'}} 
                    />
                </View>
            </View>
        )
    }
}

class RegisterTab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            firstname: '',
            lastname: '',
            email: '',
            remember: false,
            image: baseUrl + 'images/logo.png'
        };
    }

    static navigationOptions = {
        title: 'Register',
        tabBarIcon: ({tintColor}) => (
            <Icon   
                name='user-plus'
                type='font-awesome'
                iconStyle={{color: tintColor}}
            />
        )
    } 

    handleRegister() {
        console.log(JSON.stringify(this.state));
        if (this.state.remember) {
            SecureStore.setItemAsync(
                'userinfo',
                JSON.stringify({
                    username: this.state.username,
                    password: this.state.password
                })
            ).catch(error => console.log('Could not save user info', error));
        } else {
            SecureStore.deleteItemAsync('userinfo').catch(
                error => console.log('Could not delete user info', error)
            );
        }
    }

    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <Input
                        placeholder="Username"
                        leftIcon={{type: 'font-awesome', name: 'user-o'}}
                        onChangeText={username => this.setState({username})}
                        value={this.state.username}
                        containerStyle={styles.formInput}
                        leftIconContainerStyle={styles.formIcon}
                    />
                    <Input
                        placeholder="Password"
                        leftIcon={{type: 'font-awesome', name: 'key'}}
                        onChangeText={password => this.setState({password})}
                        value={this.state.password}
                        containerStyle={styles.formInput}
                        leftIconContainerStyle={styles.formIcon}
                    />
                    <Input
                        placeholder="First Name"
                        leftIcon={{type: 'font-awesome', name: 'user-o'}}
                        onChangeText={firstname => this.setState({firstname})}
                        value={this.state.firstname}
                        containerStyle={styles.formInput}
                        leftIconContainerStyle={styles.formIcon}
                    />
                    <Input
                        placeholder="Last Name"
                        leftIcon={{type: 'font-awesome', name: 'user-o'}}
                        onChangeText={lastname => this.setState({lastname})}
                        value={this.state.lastname}
                        containerStyle={styles.formInput}
                        leftIconContainerStyle={styles.formIcon}
                    />
                    <Input
                        placeholder="Email"
                        leftIcon={{type: 'font-awesome', name: 'envelope-o'}}
                        onChangeText={email => this.setState({email})}
                        value={this.state.email}
                        containerStyle={styles.formInput}
                        leftIconContainerStyle={styles.formIcon}
                    />
                    <CheckBox 
                        title="Remember Me"
                        center
                        checked={this.state.remember}
                        onPress={() => this.setState({remember: !this.state.remember})}    
                    />
                    <View style={styles.formButton}>
                        <Button
                            onPress={() => this.handleRegister()}
                            title='Register'
                            icon={
                                <Icon   
                                    name='user-plus'
                                    type='font-awesome'
                                    color='#fff'
                                    iconStyle={{marginRight: 10}}
                                />
                            }
                            buttonStyle={{backgroundColor: '#5637dd'}} 
                        />
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const Login = createBottomTabNavigator(
    {
        Login: LoginTab,
        Register: RegisterTab
    },
    {
        tabBarOptions: {
            activeBackgroundColor: '#5637dd',
            inactiveBackgroundColor: '#cec8ff',
            activeTintColor: '#fff',
            inactiveTintColor: '#808080',
            labelStyle: {fontSize: 16}
        }
    }

);

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        margin: 20
    },
    formIcon: {
        marginRight: 10
    },
    formInput: {
        padding: 10
    },
    formCheckbox: {
        margin: 10,
        backgroundColor: null
    },
    formButton: {
        margin: 40
    }
});

export default Login;