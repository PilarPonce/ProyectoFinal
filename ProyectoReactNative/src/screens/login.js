import React, {Component} from "react";
import {View, Text, TextInput, StyleSheet, TouchableOpacity, Image} from 'react-native';

class Login extends Component{
    constructor(props){
        super(props)
        this.state={
            email:'',
            password:'',
        }
    }

    render(){
        console.log(this.props.login);
        return(
            <React.Fragment>
                <View style={styles.todo}>
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
                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text)=>this.setState({email: text})}
                            placeholder='email'
                            keyboardType='email-address'/>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text)=>this.setState({password: text})}
                            placeholder='password'
                            keyboardType='email-address'
                            secureTextEntry={true}
                        />

                    
                        {this.state.email && this.state.password ?
                            <TouchableOpacity style={styles.button} onPress={()=>this.props.login(this.state.email, this.state.password)}>
                                <Text style={styles.textButton}>Log in</Text>    
                            </TouchableOpacity>:
                            <TouchableOpacity style={styles.buttonDisabled} disabled={true} >
                                <Text>I'm disabled</Text>
                            </TouchableOpacity>
                        }
                        <TouchableOpacity onPress={() => this.props.drawerProps.navigation.navigate('Register')} style={styles.redireccion}>
                            <Text >Don´t have an account? Tap here to sign up </Text> 
                        </TouchableOpacity>

                        <Text style={styles.mensajeError}> {this.props.errorLogin} </Text>
                    </View>
                </View>
            </React.Fragment>
        )
    }
}

const styles = StyleSheet.create({
    todo: {
        backgroundColor: 'white',
        height: '100%',
    },
    redireccion:{
        display: 'flex',
        alignSelf: 'center',
        fontSize: 20,
        marginTop: 10,
    },
    formContainer:{
        backgroundColor: 'white',
        paddingHorizontal:10,
        marginTop: 20,
    },
    input:{
        height:20,
        paddingVertical:15,
        paddingHorizontal: 10,
        borderWidth:1,
        borderColor: '#ccc',
        borderStyle: 'solid',
        borderRadius: 6,
        marginVertical:10,
        width: '95%',
        display: 'flex',
        alignSelf: 'center'
    },
    textButton: {
        color: 'black'
    },
    button: {
        backgroundColor: '#FF7096',
        paddingHorizontal: 10,
        paddingVertical: 6,
        textAlign: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#FF7096',
        width: '95%',
        display: 'flex',
        alignSelf: 'center'
    },
    buttonDisabled: {
        backgroundColor: '#FBB1BD',
        paddingHorizontal: 10,
        paddingVertical: 6,
        textAlign: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#FBB1BD',
        width: '95%',
        display: 'flex',
        alignSelf: 'center'
    },
    mensajeError:{
        color: 'red',
        marginTop: 10,
        textAlign: 'center'
    }

})

export default Login;