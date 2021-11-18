import React, { Component } from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Modal, TextInput, Image} from 'react-native';
import { db, auth } from '../firebase/config';
import firebase from 'firebase';
import { FlatList } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements'

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

//COMPONENT DID MOUNT
    componentDidMount(){
        if(this.props.postData.data.likes){ 
            this.setState({
                likes: this.props.postData.data.likes.length, 
                myLike: this.props.postData.data.likes.includes(auth.currentUser.email)
            })
        }
        
    }

//LIKE
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

//DISLIKE
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

//COMENTARIOS:
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

//DELETE POST
    deletePost(){
        db.collection('posts').doc(this.props.postData.id).delete()
        .then((res)=>{
            console.log('post borrado', res);
        })
        .catch((error)=> console.log(error))
    }


//RENDER 
    render(){
        console.log(this.props);
        return(
        <View style={styles.body}> 
            
            <View style={styles.contanier}>

                {/* DELETE POST */}
                {
                    this.props.postData.data.owner == auth.currentUser.email ?
                        <TouchableOpacity onPress={() => this.deletePost()} style={styles.botonDeletePost}>
                            <Text style={styles.textBoton}>Delete post</Text>
                        </TouchableOpacity> :
                        <Text></Text>
                }
              
                <Text style={styles.infoUser}> @{this.props.postData.data.name} </Text>  
                
                {/* IMAGEN */}
                <Image 
                    style={
                        {
                            height: 370,
                            width: 550, 
                            alignSelf: 'center',
                            marginBottom: 20,
                        }
                    }
                    source={{ uri: this.props.postData.data.photo }} 

                />
            
                {/* INFO POSTEO */}
                <View style={styles.infoContainer}>

                    {/* LIKES */}
                    <View style= {styles.likes}>
                        <Text style={styles.infoPostLike}> {this.state.likes} like  </Text>
                        {
                            this.state.myLike == false ?
                                <TouchableOpacity onPress={() => this.darLike()}>
                                    {/* <Text>Like</Text> */}
                                        <Icon 
                                            raised
                                            name='heart'
                                            type='font-awesome'
                                            color='red'
                                            size= '100%'
                                            display= 'flex'
                                            alignContent= 'flex-end'/>
                                </TouchableOpacity> :
                                <TouchableOpacity onPress={() => this.quitarLike()}>
                                    <Icon 
                                            raised
                                            name='heart'
                                            type='font-awesome'
                                            color='blue'
                                            borderColor='black'
                                            borderWidth='5'
                                            borderStyle='solid'
                                            size='100%'
                                            display='flex'
                                            alignContent='flex-end' />
                                </TouchableOpacity>
                        }
                        {/* poner el like/dislike al lado del corazon con flex direction column  */}
                    </View>
                       

                        

                    {/* DESCRIPCION */}
                    <Text style={styles.infoPost}> @{this.props.postData.data.name}: {this.props.postData.data.texto}</Text>
                        
                    {/* COMENTARIOS */}
                    <View>
                       
                        {this.props.postData.data.comments === undefined ?
                            <Text style={styles.infoPost}> 0 comments</Text>
                            :
                            <Text style={styles.infoPost}>Comments: {this.props.postData.data.comments.length} </Text>
                        }

                        <TouchableOpacity onPress={() => this.showModal()}>
                                <Text style={styles.infoPost} >Show Comments</Text>
                        </TouchableOpacity>

                    </View>
                </View>
    
                {/* MODAL PARA COMENTARIOS */}
                {   this.state.showModal ?
                    <Modal
                        style= {styles.modalContainer}
                        visible={this.state.showModal}
                        animationType='slide'
                        transparent={false}
                    >   
                        <TouchableOpacity style={styles.closeButton} onPress={() => this.hideModal()}>
                            <Text>X</Text>
                        </TouchableOpacity>

                        {this.props.postData.data.comments  === undefined ? 
                            <Text >No comments yet! Make the first one </Text>:
                            <View>
                                <Text>Comments:</Text>
                            <FlatList
                                data={this.props.postData.data.comments} 
                                keyextractor= {(comment)=>comment.createdAt.toString()} 
                                renderItem={ ({item}) => <Text>{item.author}: {item.comment}</Text>}
                            />
                            </View>
                        }

                        {/* Formulario para nuevos comentarios */}
                        <View>
                            <TextInput 
                                style={styles.input}
                                placeholder="Comment..."
                                keyboardType="default"
                                multiline
                                onChangeText={text => this.setState({comment: text})}
                                value={this.state.comment}
                            />
                            {/* boton para que se guarde el comentario */}
                            {this.state.comment ?
                                <TouchableOpacity style={styles.button} onPress={()=>{this.guardarComentario()}}>
                                <Text style={styles.textButton}>Save comment</Text>
                                </TouchableOpacity> :
                                <TouchableOpacity  disabled={true} >
                                <Text style={styles.disabled}>I'm disabled</Text>
                                </TouchableOpacity>
                            }
                        </View>

                    </Modal>    :
                    <Text></Text>
                } 
                
                </View>
        </View>
        )
    }
}


const styles = StyleSheet.create({
    body: {
        backgroundColor: 'white',
    }, 
    disabled: {
        width: '100%',
        height: '70%',
        backgroundColor: '#FAE0E4',
        textAlign: 'center',
        padding: 5,
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'black',
        marginTop: 15,
    },
    infoUser: { 
        color: 'black',
        marginBottom: 20,
        fontSize: 20,

    },

    contanier: {
        marginBottom: 20,
        borderRadius: 4,
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 10,
        width: '100%',
        height: '600%',
        backgroundColor: 'FF5C8A',
        paddingBottom: '5%'
    },

    likes: {
        display: 'flex',
        flexDirection: 'column',

    },
  
    infoContainer: {
        backgroundColor: 'white',
        
    }, 

    infoPostLike: {
        fontSize: 16,
        color: 'black',
    },

    infoPost: {
        color: 'black',
        fontSize: 13, 
        marginBottom: 10, 
        
    }, 

    botonDeletePost: {
        width: 100,
        height: 30,
        backgroundColor: '#FF477E',
        textAlign: 'center',
        padding: 5,
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'black',
        marginBottom: 5,
        display: 'flex',
        alignSelf: 'flex-end'
    },

    textBoton:{
        fontWeight: 'bold',
    },
    modalContainer:{
        width: '97%',
        borderRadius:4,
        padding:5,
        alignSelf: 'center',
        boxShadow: 'rgb(204 204 204) 0px 0px 9px 7px', //no funciona en mobile
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