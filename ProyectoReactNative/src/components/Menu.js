import React, { Component } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer'; 
import { auth } from '../firebase/config';
import Register from '../screens/register';
import Login from '../screens/login';



const Drawer = createDrawerNavigator();

class Menu extends Component {
    constructor() {
        super();
        this.state = {
            errorRegister: '',
            errorLogin: '',
           
        }
    }

    register(email, pass) {
        auth.createUserWithEmailAndPassword(email, pass)
            .then(() => {
                console.log('registrado')
                this.setState({
                    errorRegister:''
                })
            })
            .catch(error => {
                console.log(error)
                this.setState({
                    errorRegister: error.message
                })
            })
    }

    login(email, pass){
        auth.signInWithEmailAndPassword(email, pass) 
            .then((response) =>{
                
                console.log(response);
                this.setState({
                    logueado: true,
                    userData: response.user,
                    errorLogin: '',
                    
                })
            })

            .catch(error => {
                console.log(error)
                this.setState({
                    errorLogin: error.message
                })
            })
    }

     
    render() {
        return (
            <NavigationContainer>
                <Drawer.Navigator>
                    <Drawer.Screen name="Registro" component={() => <Register register={(email, pass) => this.register(email, pass)} errorRegister= {this.state.errorRegister} />} />
                    <Drawer.Screen name ="Login" component={()=> <Login login={(email, pass)=> this.login(email, pass)} errorLogin={this.state.errorLogin}/>}/>
                    {/* <Drawer.Screen name="Home" component={() => <Home />} />
                    <Drawer.Screen name="Profile" component={() => <Profile />} />
                    <Drawer.Screen name="New Post" component={() => <Posts />} />
                    <Drawer.Screen name="Search" component={() => <Search />} /> */} 
                </Drawer.Navigator>
            </NavigationContainer>
        )
    }

}

export default Menu