import React, { Component } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer'; 
import { auth } from '../firebase/config';



const Drawer = createDrawerNavigator();

class Menu extends Component {
    constructor() {
        super();
        this.state = {
            hola: ''
        }
    }

    register(email, pass) {
        auth.createUserWithEmailAndPassword(email, pass)
            .then(() => {
                console.log('registrado')
            })
            .catch(error => {
                console.log(error)
                this.setState({
                    errorRegister: error.message
                })
            })
    }
     
    render() {
        return (
            <NavigationContainer>
                <Drawer.Navigator>
                    {/* <Drawer.Screen name="Registro" component={() => <Register register={(email, pass) => this.register(email, pass)} />} />
                    <Drawer.Screen name="Home" component={() => <Home />} />
                    <Drawer.Screen name="Login" component={() => <Login />} />
                    <Drawer.Screen name="Profile" component={() => <Profile />} />
                    <Drawer.Screen name="New Post" component={() => <Posts />} />
                    <Drawer.Screen name="Search" component={() => <Search />} /> */}
                </Drawer.Navigator>
            </NavigationContainer>
        )
    }

}

export default Menu