import React, {Component} from "react";
import {View, Text, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import { auth, db } from '../firebase/config';
import MyCamera from "../components/MyCamera";

class PostForm extends Component{
    constructor(props){
        super(props)
        this.state={
            textoPost:'',
            showCamera: true, 
            url: '', 
        }
    }

    //SUBMIT POST
    submitPost(){
        db.collection('posts').add({
            owner: auth.currentUser.email,
            name: auth.currentUser.displayName,
            texto: this.state.textoPost,
            createdAt: Date.now(),
            photo: this.state.url, 
        })
        .then( ()=>{ 
            this.setState({
                textoPost:'',
                url: '',
                showCamera: true
            })
            this.props.drawerProps.navigation.navigate('Home')
        })
        .catch()
    }

// IMAGE UPLOAD
    onImageUpload (url){
        this.setState({
            showCamera: false,
            url: url,
        })
    }

    // RENDER 
    render(){
        return(
            <View style={styles.formContainer}>

                {
                    this.state.showCamera ?
                        <MyCamera onImageUpload={(url) => { this.onImageUpload(url) }} /> :
                    <View styles= {styles.textInput}> 
                        <TextInput
                            style={styles.input}
                            onChangeText={(text)=>this.setState({textoPost: text})}
                            placeholder='Type here...'
                            keyboardType='default'
                            multiline
                            value={this.state.textoPost}    
                        />
                        <TouchableOpacity style={styles.button} onPress={()=>this.submitPost()}>
                            <Text>SAVE POST</Text>    
                        </TouchableOpacity>
                    
                    </View>
                }

            </View>
        )
    }
}

const styles = StyleSheet.create({
    formContainer:{
        paddingHorizontal:10,
        marginTop: 20,
        width: '100%',
        height: '95%'
    },
    textInput: {
        borderColor: 'black',
        borderRadius: 2, 
        borderStyle: 'solid',
        borderWidth: 1,
    },
    input:{
        height: 100,
        paddingVertical:15,
        paddingHorizontal: 10,
        marginVertical:10,
        borderColor: 'black',
        borderStyle: 'solid',

    },
    button:{
        backgroundColor:'#FF99AC',
        paddingHorizontal: 10,
        paddingVertical: 6,
        textAlign: 'center',
        borderRadius:4, 
        borderWidth:1,
    },
    textButton:{
        color: '#fff'
    }

})

export default PostForm;
