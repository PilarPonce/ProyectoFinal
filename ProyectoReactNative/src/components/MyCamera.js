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

    //COMPONENT DID MOUNT
    componentDidMount() {
        Camera.requestCameraPermissionsAsync()
            .then(() => {
                this.setState({
                    permission: true,
                })
            })
            .catch(error => console.log(error))
    }

    // TAKE PICTURE
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

    // SAVE PHOTO
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

    // CLEAR
    clear() {
        this.setState({
            photo: '',
            showCamera: true
        })
    }

    // RENDER 
    render(){
        return(
            <View style= {styles.container}>

                {
                    this.state.permission ?

                        this.state.showCamera === false ?

                            <React.Fragment>
                                {/* IMAGE */}
                                <Image
                                    style={styles.cameraBody}
                                    source={{ uri: this.state.photo }}

                                />
                                {/* ACCEPT/ DECLINE PHOTO  */}
                                <View>
                                    <TouchableOpacity onPress={() => this.savePhoto()} style={styles.acceptDecline}>
                                        <Text> Accept </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.clear()} style={styles.acceptDecline}>
                                        <Text> Decline </Text>
                                    </TouchableOpacity>
                                </View>

                            </React.Fragment> :

                            <View style= {styles.container}> 
                                <Camera
                                    style={styles.cameraBody}
                                    type={Camera.Constants.Type.back}
                                    ref={reference => this.camera = reference}
                                />
                                {/* TAKE PICTURE */}
                                <TouchableOpacity styles={styles.button} onPress={() => this.takePicture()} style={styles.takePicture}>
                                    <Text>TAKE PICTURE</Text>
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
        width: '100%',
        height: '95%'

    },
    cameraBody: {
        flex: 7,
    },
    button: {
        flex: 1,
        justifyContent: 'center',
    }, 
    acceptDecline: {
        width: 100,
        height: 30,
        backgroundColor: '#FAE0E4',
        textAlign: 'center',
        padding: 5,
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'black',
        marginTop: 15,
    },
    takePicture: {
        marginTop: 20, 
        width: 100,
        height: 50,
        backgroundColor: '#FAE0E4',
        textAlign: 'center',
        padding: 5,
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'black',
        marginBottom: 5,
    },


})

export default MyCamera