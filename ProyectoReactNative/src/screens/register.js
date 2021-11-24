import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';


class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            userName: '',
            password: '',
        }
    }

    render() {
        return (
            <React.Fragment style= {{backgroundColor: 'white'}}>
                <View>
                    <Image 
                        style={{height: 300,
                                width: '100%',
                                display: 'flex',
                                alignContent: 'center', 
                                flexDirection: 'row'
                                }}
                        source= {require('../../assets/logo.jpg')}
                        resizeMode= 'contain'
                    />
                </View>

                <View style={styles.registerContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => this.setState({ email: text })}
                        placeholder='email'
                        keyboardType='email-address' />
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => this.setState({ userName: text })}
                        placeholder='user name'
                        keyboardType='default' />
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => this.setState({ password: text })}
                        placeholder='password'
                        keyboardType='email-address'
                        secureTextEntry={true}
                    />

                    {this.state.email && this.state.userName && this.state.password ?
                        <TouchableOpacity style={styles.button} onPress={() => this.props.register(this.state.email, this.state.password, this.state.userName)} >
                            <Text style={styles.textButton}>Register</Text>
                        </TouchableOpacity> :
                        <TouchableOpacity style={styles.buttonDisabled} disabled={true} >
                            <Text>I'm disabled</Text>
                        </TouchableOpacity>
                    }
                    <TouchableOpacity onPress={() => this.props.drawerProps.navigation.navigate('Login')}> <Text> You already have an account? Tap here to login</Text> </TouchableOpacity>
                     
                    <Text style={styles.mensajeError}> {this.props.errorRegister} </Text>
                </View> 
                </React.Fragment>
            
        )
    }
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: 'white'
    },
    registerContainer: {
        paddingHorizontal: 10,
        marginTop: 20,
        backgroundColor: 'white',
    },
    input: {
        height: 20,
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderStyle: 'solid',
        borderRadius: 6,
        marginVertical: 10,
    },
    button: {
        backgroundColor: '#FF7096',
        paddingHorizontal: 10,
        paddingVertical: 6,
        textAlign: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#FF7096'
    },
    buttonDisabled: {
        backgroundColor: '#FBB1BD',
        paddingHorizontal: 10,
        paddingVertical: 6,
        textAlign: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#FBB1BD'
    },
    textButton: {
        color: 'black'
    },
    mensajeError:{
        color: 'red',
        marginTop: 10,
        textAlign: 'center'
    }

})

export default Register;