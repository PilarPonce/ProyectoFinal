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
            showCamera: true, 
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

    savePhoto(){
        fetch (this.state.photo)
        .then (res => res.blob())
        .then (
            image => {
                const ref = storage.ref(`photos/${Date.now()}.jpg`)
                ref.put (image)
                .then (()=> {
                    ref.getDownloadURL()
                    .then (url=> {
                        this.props.onImageUpload(url);
                        this.setState({
                            photo: '',
                        })
                    })
                })
            })
            .catch(error => console.log(error))
    }

    clear() {
        this.setState({
            photo: '',
            showCamera: true
        })
    }

    render(){
        return(
            <View style= {styles.container}>

                {
                    this.state.permission ?

                        this.state.showCamera === false ?

                            <React.Fragment>
                                <Image
                                    style={styles.cameraBody}
                                    source={{ uri: this.state.photo }}

                                />
                                <View>
                                    <TouchableOpacity onPress={() => this.savePhoto()}>
                                        <Text> Accept </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.clear()}>
                                        <Text> Decline </Text>
                                    </TouchableOpacity>
                                </View>

                            </React.Fragment> :

                            <View> 
                                <Camera
                                    style={styles.cameraBody}
                                    type={Camera.Constants.Type.back}
                                    ref={reference => this.camera = reference}
                                />
                                <TouchableOpacity styles={styles.button} onPress={() => this.takePicture()}>
                                    <Text>Take Picture</Text>
                                </TouchableOpacity>
                            </View> : 
                        <Text> You don´t have permission to use the camera </Text>  // render mensaje 
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