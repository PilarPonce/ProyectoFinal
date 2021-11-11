import React, { Component } from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import { db, auth } from '../firebase/config';
import firebase from 'firebase';

class Post extends Component{
    constructor(props){
        super(props);
        this.state = {
           likes: 0,
           myLike:false,
        }
    }
    
    componentDidMount(){
        if(this.props.postData.data.likes){ 
            this.setState({
                likes: this.props.postData.data.likes.length, 
                myLike: this.props.postData.data.likes.includes(auth.currentUser.email)
            })
        }
        
    }

    darLike(){
        db.collection('posts').doc(this.props.postData.id).update({
            likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email)
        })
        .then(()=>{
            this.setState({ 
                likes: this.state.likes + 1,
                myLike: true
            })
        })

    }

    quitarLike(){
        db.collection('posts').doc(this.props.postData.id).update({
            likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email)
        })
        .then(()=>{
            this.setState({ 
                likes: this.state.likes - 1,
                myLike: false
            })
        })

    }

    render(){
        console.log(this.props);
        return(
            <View style={styles.contanier}>
             <Text>Texto del post: {this.props.postData.data.texto}</Text>
             <Text>User: {this.props.postData.data.name} </Text>
             <Text>User email: {this.props.postData.data.owner} </Text>
             <Text>Likes: {this.state.likes} </Text>    

            {/* if ternario que define si aparece dar like o sacar like */}
            {this.state.myLike === false ?
             <TouchableOpacity onPress={()=>this.darLike()}>
                 <Text>Me gusta</Text>
             </TouchableOpacity> :
             <TouchableOpacity onPress={()=>this.quitarLike()}>
                  <Text>Quitar Like</Text>
              </TouchableOpacity> }
            </View>
        )
    }

}


const styles = StyleSheet.create({
    contanier:{
        marginBottom: 20,
        borderRadius:4,
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 10,
    }
})

export default Post