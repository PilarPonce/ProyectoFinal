import React, { Component } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer'; 
import { auth } from '../firebase/config';
import firebase from 'firebase';

import Register from '../screens/register';
import Login from '../screens/login';
import Profile from '../screens/profile';



const Drawer = createDrawerNavigator();

class Menu extends Component {
    constructor() {
        super();
        this.state = {
            errorRegister: '',
            errorLogin: '',
            logueado: false,
            user: '',
           
        }
    }

    register(email, pass, userName) {
        auth.createUserWithEmailAndPassword(email, pass)
            .then(() => {
                console.log('registrado')
                this.saveName(userName) //para que se guarde el nombre de usuario
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

    saveName(userName){
        const user = firebase.auth().currentUser;
        if (user != null) {
            user.updateProfile({
                displayName: userName,
                //photoURL: photo,
            })
            .then(()=>{
                console.log('username guardado')
            })
            .catch((error)=>{
                console.log(error)
            })
            
        }
    }

    login(email, pass){
        auth.signInWithEmailAndPassword(email, pass) 
            .then((response) =>{
                
                console.log(response);
                this.setState({
                    logueado: true,
                    user: response.user,
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

    logout(){
        auth.signOut()
            .then( (res)=>{
                this.setState({
                    user:'',
                    logueado: false,
                })
            })
            .catch()
    }

     
    render() {
        return (
            <NavigationContainer>
                {this.state.logueado == false ?
                <Drawer.Navigator>
                    <Drawer.Screen name="Registro" component={() => <Register register={(email, pass, userName) => this.register(email, pass, userName)} errorRegister= {this.state.errorRegister} />} />
                    <Drawer.Screen name ="Login" component={()=> <Login login={(email, pass)=> this.login(email, pass)} errorLogin={this.state.errorLogin}/>}/>
                </Drawer.Navigator>:
                <Drawer.Navigator>
                    {/*<Drawer.Screen name="Home" component={()=><Home />} />
                     <Drawer.Screen name ="New Post" component={(drawerProps)=><PostForm drawerProps={drawerProps}/>}/>*/}
                    <Drawer.Screen name="Profile" component={()=><Profile userData={this.state.user} logout={()=>this.logout() } />} />
                </Drawer.Navigator>}
            </NavigationContainer>
        )
    }

}

export default Menu