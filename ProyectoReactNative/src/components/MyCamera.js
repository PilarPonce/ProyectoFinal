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

    //component did mount
    componentDidMount() {
        Camera.requestCameraPermissionsAsync()
            .then(() => {
                this.setState({
                    permission: true,
                })
            })
            .catch(error => console.log(error))
    }

    //take picture
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

    //save photo
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

    //vacio el estado
    clear() {
        this.setState({
            photo: '',
            showCamera: true
        })
    }

    //render
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
                                    <TouchableOpacity  style={styles.botonAccept} onPress={() => this.savePhoto()}>
                                        <Text  style={styles.botonText}> Accept </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity  style={styles.botonDecline} onPress={() => this.clear()}>
                                        <Text  style={styles.botonText}> Decline </Text>
                                    </TouchableOpacity>
                                </View>

                            </React.Fragment> :

                            <View style= {styles.container}> 
                                <Camera
                                    style={styles.cameraBody}
                                    type={Camera.Constants.Type.back}
                                    ref={reference => this.camera = reference}
                                />
                                <TouchableOpacity style={styles.boton} onPress={() => this.takePicture()}>
                                    <Text style={styles.botonText}>Take Picture</Text>
                                </TouchableOpacity>
                            </View> : 
                        <Text style= {styles.message}> You don´t have permission to use the camera </Text>  // render mensaje 
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
        flex: 6,
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'red'
    },
    boton:{
        display: 'flex',
        alignSelf: 'center',
        backgroundColor: '#F7CAD0',
        paddingHorizontal: 10,
        paddingVertical: 6,
        textAlign: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'black',
        marginTop: 10
    },
    botonAccept:{
        display: 'flex',
        alignSelf: 'center',
        backgroundColor: '#FF99AC',
        paddingHorizontal: 10,
        paddingVertical: 6,
        textAlign: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'black',
        marginTop: 10
    },
    botonDecline:{
        display: 'flex',
        alignSelf: 'center',
        backgroundColor: '#FF5C8A',
        paddingHorizontal: 10,
        paddingVertical: 6,
        textAlign: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'black',
        marginTop: 10
    },
    botonText:{
        fontWeight: 'bold'
    },
    message:{
        color: 'red',
        fontWeight: 'bold',
        fontSize: 20,
        display: 'flex',
        alignSelf: 'center'
    }


})

export default MyCamera