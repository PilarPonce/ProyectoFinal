import React, { Component } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, TextInput, Image } from 'react-native';
import { Camera } from 'expo-camera';
import firebase from 'firebase';
import { db, storage } from '../firebase/config';

class MyCamera extends Component{
    constructor(props){
        super(props);
        this.state= {
            permission: false,
            photo: '',
            showCamera: true, //lu lo tiene en false 
        }
    }

    componentDidMount() {
        Camera.requestCameraPermissionsAsync()
            .then(() => {
                this.setState({
                    permission: true,
                })
            })
            .catch(error => console.log(error))
    }

    takePicture (){
        this.camera.takePictureAsync()
            .then((photo) => {
                this.setState({
                    photo: photo.uri, 
                    showCamera: false,
                })
            })
            .catch(error => console.log(error))
    }



    render(){
        return(
            <View style= {styles.container}>

                {
                    this.state.permission ?

                        this.state.showCamera === false ?

                            <Text> ya sacaste la foto</Text> : 

                            <View> 
                                <Camera
                                    style={styles.cameraBody}
                                    type={Camera.Constants.Type.back}
                                    ref={reference => this.camera = reference}
                                />
                                <TouchableOpacity styles={styles.button} onPress={() => this.takePicture()}>
                                    <Text>Tomar foto</Text>
                                </TouchableOpacity>
                            </View> : 
                        <Text> No tenes permisos para usar la cámara </Text>  // render mensaje 
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cameraBody: {
        flex: 7,
    },
    button: {
        flex: 1,
        justifyContent: 'center',
    }


})

export default MyCamera