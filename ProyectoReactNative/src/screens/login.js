import React, {Component} from "react";
import {View, Text, TextInput, StyleSheet, TouchableOpacity} from 'react-native';

class Login extends Component{
    constructor(props){
        super(props)
        this.state={
            email:'',
            password:'',
        }
    }

    // redireccionar () {
    //     this.props.drawerProps.navigation.navigate('Register')
    // }

    render(){
        console.log(this.props.login);
        return(

            // FORMULARIO
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
                <TouchableOpacity onPress={() => this.props.drawerProps.navigation.navigate('Register')}><Text >Don´t have an account? Sign up </Text> </TouchableOpacity>

                <Text style={styles.mensajeError}> {this.props.errorLogin} </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
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
    },
    textButton: {
        color: 'black'
    },
    button: {
        backgroundColor: '#FBB1BD',
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
    mensajeError:{
        color: 'red',
        marginTop: 10,
        textAlign: 'center'
    }

})

export default Login;