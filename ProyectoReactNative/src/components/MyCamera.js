import React, { Component } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { storage } from '../firebase/config';

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

                {this.state.permission ?
                    this.state.showCamera === true ?
                     <View style= {styles.container}> 

                                <Camera
                                    style={styles.cameraBody}
                                    type={Camera.Constants.Type.back}
                                    ref={reference => this.camera = reference}
                                />
                                
                                <TouchableOpacity style={styles.botonPicture} onPress={() => this.takePicture()}>
                                    <Text style={styles.botonText}>TAKE PICTURE</Text>
                                </TouchableOpacity>

                            </View> : 
                        <React.Fragment>
                            <Image
                                style={styles.cameraBody}
                                source={{ uri: this.state.photo }}
                            />
                            <View>
                                <TouchableOpacity  style={styles.botonAccept} onPress={() => this.savePhoto()}>
                                    <Text  style={styles.botonText}> ACCEPT </Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.botonDecline} onPress={() => this.clear()}>
                                    <Text style={styles.botonText}> DECLINE </Text>
                                </TouchableOpacity>   
                            </View>

                        </React.Fragment> : 
                        <Text style= {styles.message}> YOU DON´T HAVE PERMISSION TO USE THE CAMERA </Text> 
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
    botonPicture:{
        backgroundColor: '#F7CAD0',
        paddingHorizontal: 10,
        paddingVertical: 6,
        textAlign: 'center',
        borderRadius: 4,
        borderWidth: 1,
       
        borderColor: 'black',
        marginTop: 10, 
        width: '100%'
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
        borderColor: 'black',
        marginTop: 10
    },
    botonText:{
        fontWeight: 'bold'
    },
    message:{
        color: 'red',
        fontSize: 25,
        display: 'flex',
        alignSelf: 'center'
    }


})

export default MyCamera