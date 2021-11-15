import React, { Component } from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Modal, TextInput, Image} from 'react-native';
import { db, auth } from '../firebase/config';
import firebase from 'firebase';
import { FlatList } from 'react-native-gesture-handler';

class Post extends Component{
    constructor(props){
        super(props);
        this.state = {
           likes: 0,
           myLike:false,
           showModal: false,
           comment: '',
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

    showModal(){
        this.setState({
            showModal:true,
        })
    }

    hideModal(){
        this.setState({
            showModal: false, 
        })
    }

    guardarComentario(){
        console.log('comentario')
        let oneComment ={
            createdAt: Date.now(),
            author: auth.currentUser.email,
            comment: this.state.comment,
        }

        db.collection('posts').doc(this.props.postData.id).update({
            comments:firebase.firestore.FieldValue.arrayUnion(oneComment)
         })
         .then(()=>{
             this.setState({
                 comment: '' 
             })
         })
    }

    render(){
        console.log(this.props);
        return(
            <View style={styles.contanier}>
                <Image
                    style={styles.cameraBody}
                    source={{ uri: this.props.postData.data.photo }} 

                />

             <Text>Post Text: {this.props.postData.data.texto}</Text>
             <Text>User: {this.props.postData.data.name} </Text>  
             <Text>User email: {this.props.postData.data.owner} </Text>  
             <Text>Likes: {this.state.likes} </Text> 
             {this.props.postData.data.comments  === undefined ? 
                <Text>Comments: 0</Text>
                    :
                <Text>Comments: {this.props.postData.data.comments.length} </Text> 
             }
            


             {/* Cambio de botones me gusta/ me dejó de gustar */}
            {
                this.state.myLike == false ?
                <TouchableOpacity onPress={()=>this.darLike()}>
                    <Text>Like</Text>
                </TouchableOpacity> :
                <TouchableOpacity onPress={()=>this.quitarLike()}>
                    <Text>Dislike</Text>
                </TouchableOpacity>                       
            }
            {/* Ver modal */}
            <TouchableOpacity onPress={()=>this.showModal()}>
                <Text>Show Comments</Text>
            </TouchableOpacity>

            {/* Modal para los comentarios 
            Lo pongo en un if ternario que se fija el valor de showModal del estado
            */}
            {   this.state.showModal ?
                <Modal
                    style= {styles.modalContainer}
                    visible={this.state.showModal}
                    animationType='slide'
                    transparent={false}
                >   
                    <TouchableOpacity style={styles.closeButton} onPress={()=>this.hideModal()}>
                        <Text>X</Text>
                    </TouchableOpacity> 
                    

                    {this.props.postData.data.comments  === undefined ? 
                    <Text>No comments yet! Make the first one </Text>:
                    <View>
                         <Text>Comments:</Text>
                    <FlatList
                        data={this.props.postData.data.comments} 
                        keyextractor= {(comment)=>comment.createdAt.toString()} 
                        renderItem={ ({item}) => <Text>{item.author}: {item.comment}</Text>}
                    />
                    </View>
                    }
                    


                    {/* Formulario para nuevo comentarios */}
                    <View>
                        <TextInput 
                            style={styles.input}
                            placeholder="Comentar..."
                            keyboardType="default"
                            multiline
                            onChangeText={text => this.setState({comment: text})}
                            value={this.state.comment}
                        />
                        {/* boton para que se guarde el comentario */}
                        {this.state.comment ?
                            <TouchableOpacity style={styles.button} onPress={()=>{this.guardarComentario()}}>
                            <Text style={styles.textButton}>Guadar comentario</Text>
                            </TouchableOpacity> :
                            <TouchableOpacity style={styles.button} disabled={true} >
                            <Text style={styles.textButton}>I'm disabled</Text>
                            </TouchableOpacity>
                        }
                    </View>

                </Modal>    :
                <Text></Text>
            } 
            </View>
        )
    }

}


const styles = StyleSheet.create({
    cameraBody: {
        flex: 7,
        width: '100%',
        height: '95%'
    },
    contanier:{
        marginBottom: 20,
        borderRadius:4,
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 10,
        width: '100%',
        height: 1000 ,
    },
    modalContainer:{
        width: '97%',
        borderRadius:4,
        padding:5,
        alignSelf: 'center',
        boxShadow: 'rgb(204 204 204) 0px 0px 9px 7px', //no funciona en movile
        marginTop: 20,
        marginBottom: 10 
    },
    closeButton:{
        color: '#fff',
        padding: 5,
        backgroundColor: '#dc3545',
        alignSelf: 'flex-end',
        borderRadius:4,
        paddingHorizontal: 8,
    },
    input:{
        height:40,
        paddingVertical:15,
        paddingHorizontal: 10,
        borderWidth:1,
        borderColor: '#ccc',
        borderStyle: 'solid',
        borderRadius: 6,
        marginVertical:10,
    },
    button:{
        backgroundColor:'#28a745',
        paddingHorizontal: 10,
        paddingVertical: 6,
        textAlign: 'center',
        borderRadius:4, 
        borderWidth:1,
        borderStyle: 'solid',
        borderColor: '#28a745'
    },
    textButton:{
        color: '#fff'
    }
})

export default Post