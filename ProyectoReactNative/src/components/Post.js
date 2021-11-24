import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal, TextInput, Image } from 'react-native';
import { db, auth } from '../firebase/config';
import firebase from 'firebase';
import { FlatList } from 'react-native-gesture-handler';

class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            likes: 0,
            myLike: false,
            showModal: false,
            showAlert: false, 
            comment: '',
        }
    }

    //COMPONENT DID MOUNT
    componentDidMount() {
        if (this.props.postData.data.likes) {
            this.setState({
                likes: this.props.postData.data.likes.length,
                myLike: this.props.postData.data.likes.includes(auth.currentUser.email)
            })
        }
    }

    //LIKE
    darLike() {
        db.collection('posts').doc(this.props.postData.id).update({
            likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email)
        })
            .then(() => {
                this.setState({
                    likes: this.state.likes + 1,
                    myLike: true
                })
            })

    }

    //DISLIKE
    quitarLike() {
        db.collection('posts').doc(this.props.postData.id).update({
            likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email)
        })
            .then(() => {
                this.setState({
                    likes: this.state.likes - 1,
                    myLike: false
                })
            })
    }

    //COMENTARIOS
    showModal() {
        this.setState({
            showModal: true,
        })
    }

    hideModal() {
        this.setState({
            showModal: false,
        })
    }

    guardarComentario() {
        console.log('comentario')
        let oneComment = {
            createdAt: Date.now(),
            author: auth.currentUser.email,
            comment: this.state.comment,
        }

        db.collection('posts').doc(this.props.postData.id).update({
            comments: firebase.firestore.FieldValue.arrayUnion(oneComment)
        })
            .then(() => {
                this.setState({
                    comment: ''
                })
            })
    }

    //DELETE POST
    deletePost() {
        db.collection('posts').doc(this.props.postData.id).delete()
        
    }

    // ALERTAS DELETE POST
    showAlert(){
        this.setState({
            showAlert: true,
        })
    }

    hideAlert(){
        this.setState({
            showAlert: false,
        })
    }

    //RENDER 
    render() {
        return (
            <View style={styles.body}>
                <View style={styles.contanier}>

                    {/* MODAL DELETE POST */}
                    {this.state.showAlert ? 
                        <Modal visible={this.state.showAlert} animationType='slide' transparent={true}>
                            <View style={styles.modalBorrar}> 
                                <Text style={styles.mensajeBorrar}> Are you sure you want to delete this post?</Text>
                                <View style={styles.viewBorrar}>
                                    <TouchableOpacity onPress={() => this.deletePost()} >  
                                        <Image
                                            style={
                                                {
                                                    height: 30,
                                                    width: 30,
                                                    marginRight: 10,
                                                }
                                            }
                                            source={{ uri: "https://img.icons8.com/external-dreamstale-lineal-dreamstale/32/000000/external-confirm-interface-dreamstale-lineal-dreamstale.png"}}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.hideAlert()} >  
                                        <Image
                                            style={
                                                {
                                                    height: 32,
                                                    width: 32,
                                                    marginLeft: 10,
                                                }
                                            }
                                            source={{ uri: "https://img.icons8.com/ios/24/000000/cancel.png"}}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal> :
                        <Text></Text>
                    }

                    {/* NOMBRE DE USUARIO Y BOTON DELETE POST */}
                    <View style={styles.viewArriba}>
                        {this.props.postData.data.name ?
                            <Text  style={styles.infoUser}>@{this.props.postData.data.name}</Text>:
                            <Text style={styles.infoUser}>{this.props.postData.data.owner}</Text>
                        }
                        {
                            this.props.postData.data.owner == auth.currentUser.email ?
                            <TouchableOpacity onPress={() => this.showAlert()} style={styles.botonDeletePost}>
                                    <Text style={styles.textBoton}>DELETE</Text>
                            </TouchableOpacity>              
                                :
                                <Text></Text>
                        }
                    </View>  
                    

                    {/* IMAGEN */}
                    <Image
                        style={
                            {
                                height: 300,
                                width: 450,
                                alignSelf: 'center',
                                marginBottom: 20,
                            }
                        }
                        source={{ uri: this.props.postData.data.photo }}
                    />

                    {/* INFO POSTEO */}
                    <View style={styles.infoContainer}>
                        <View style={styles.likesycomments}>

                            {/* LIKES */}
                            <View style={styles.likes}>
                                
                                {this.state.myLike == false ?
                                    <TouchableOpacity onPress={() => this.darLike()}>
                                        <Image
                                            style={
                                                {
                                                    height: 22,
                                                    width: 22,
                                                    alignSelf: 'left',
                                                    marginBottom: 10,
                                                    marginLeft: 5
                                                }
                                            }
                                            source={{ uri: "https://img.icons8.com/small/16/000000/like.png" }}
                                        />
                                    </TouchableOpacity> :
                                    <TouchableOpacity onPress={() => this.quitarLike()}>
                                        <Image
                                            style={
                                                {
                                                    height: 22,
                                                    width: 22,
                                                    alignSelf: 'left',
                                                    marginBottom: 10,
                                                    marginLeft: 5
                                                }
                                            }
                                            source={{ uri: "https://img.icons8.com/ios-glyphs/30/fa314a/like--v1.png" }}
                                        />
                                    </TouchableOpacity>
                                }
                                <Text style={styles.infoPostLike}> {this.state.likes} </Text>
                            </View>

                            {/* ICONO COMENTARIOS */}
                            <View>
                                {this.props.postData.data.comments === undefined ?
                                    <View  style={styles.comments}>
                                        <TouchableOpacity onPress={() => this.showModal()}>
                                            <Image
                                                style={
                                                    {
                                                        height: 22,
                                                        width: 22,
                                                        alignSelf: 'left',
                                                        marginBottom: 10,
                                                        marginLeft: 5
                                                    }
                                                }
                                                source={{ uri: "https://img.icons8.com/material-outlined/24/000000/filled-topic.png" }}
                                            />
                                        </TouchableOpacity>
                                            <Text style={styles.infoPostComment}>0 </Text>
                                    </View>
                                    :
                                    <View  style={styles.comments}>
                                        <TouchableOpacity onPress={() => this.showModal()}>
                                            <Image
                                                style={
                                                    {
                                                        height: 22,
                                                        width: 22,
                                                        alignSelf: 'left',
                                                        marginBottom: 10,
                                                        marginLeft: 5
                                                    }
                                                }
                                                source={{ uri: "https://img.icons8.com/material-outlined/24/000000/filled-topic.png" }}
                                            />
                                        </TouchableOpacity>
                                        <Text style={styles.infoPostComment}>{this.props.postData.data.comments.length} </Text>
                                    </View>
                                }
                            </View>
                        </View>

                        
                        {/* DESCRIPCION Y BOTON PARA VER COMENTARIOS*/}
                        <Text style={styles.infoPost}>@{this.props.postData.data.name}: {this.props.postData.data.texto}</Text>
                        <TouchableOpacity onPress={() => this.showModal()}>
                                <Text style={styles.showComments} >Show Comments</Text>
                        </TouchableOpacity>
                    </View>

                    {/* MODAL PARA COMENTARIOS */}
                    {this.state.showModal ?
                        <Modal visible={this.state.showModal} animationType='slide' transparent={true}>
                            <View style={styles.modalComentarios}>
                                <TouchableOpacity style={styles.closeButton} onPress={() => this.hideModal()}>
                                    <Text>X</Text>
                                </TouchableOpacity>

                                {this.props.postData.data.comments === undefined ?
                                    <Text style={styles.noComments}>No comments yet! Make the first one </Text> :

                                    <View>
                                        {this.props.postData.data.name ?
                                            <Text  style={styles.tituloComentarios}>Comments on @{this.props.postData.data.name}'s post</Text>:
                                            <Text style={styles.tituloComentarios}>Comments</Text>
                                        }
                                        <FlatList
                                            style={styles.comentarios}
                                            data={this.props.postData.data.comments}
                                            keyextractor={(comment) => comment.createdAt.toString()}
                                            renderItem={({ item }) => <Text>{item.author}: {item.comment}</Text>}
                                        />
                                    </View>
                                }
                                <View>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Comment..."
                                        keyboardType="default"
                                        multiline
                                        onChangeText={text => this.setState({ comment: text })}
                                        value={this.state.comment}
                                    />

                                    {/* boton para que se guarde el comentario */}
                                    {this.state.comment ?
                                        <TouchableOpacity style={styles.button} onPress={() => { this.guardarComentario() }}>
                                            <Text>Save comment</Text>
                                        </TouchableOpacity> :

                                        <TouchableOpacity disabled={true} >
                                            <Text style={styles.disabled}>I'm disabled</Text>
                                        </TouchableOpacity>
                                    }
                                </View>
                            </View>
                        </Modal> :

                        <Text></Text>
                    }

                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    body: {
        //backgroundColor: 'white',
        width: '100%',
        height: '100%',
        alignItems: 'center'
    },
    tituloComentarios:{
        display: 'flex',
        alignSelf: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 5
    },
    comentarios:{
        margin: 5,
        fontSize: 15,
        margin: 10
    },
    noComments:{
        fontSize: 18,
        marginLeft: 10,
        marginBottom: 30,
        marginTop: 10
    },
    contanier: {
        marginBottom: 20,
        borderRadius: 12,
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 10,
        width: '90%',
        display: 'flex',
        alignSelf: 'center',
        backgroundColor: 'white',
        paddingBottom: '5%',
        marginVertical: 10,
        
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
    viewArriba:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 60,
    },
    infoUser: {
        color: 'black',
        marginBottom: 15,
        fontSize: 20,
        marginTop: 10

    },
    likes: {
        display: 'flex',
        flexDirection: 'row',
        marginRight: 15,
        marginLeft: 5
    },
    comments: {
        display: 'flex',
        flexDirection: 'row',
    },
    likesycomments:{
        display: 'flex',
        flexDirection: 'row'
    },

    infoContainer: {
        backgroundColor: 'white',
        height: 90,
    },

    infoPostLike: {
        fontSize: 16,
        color: 'black',
    },
    infoPostComment: {
        fontSize: 16,
        color: 'black',
        marginLeft: 3
    },

    infoPost: {
        color: 'black',
        fontSize: 15,
        marginBottom: 10,

    },
    modalComentarios: {
        backgroundColor: 'white',
        width: '90%',
        height: '42vh',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#FAE0E4',
        padding: 5,
        alignSelf: 'center',
        boxShadow: 'grey 0px 0px 9px 7px',
        marginTop: '50%',
    },
    showComments: {
        backgroundColor: '#FAE0E4',
        paddingHorizontal: 10,
        paddingVertical: 6,
        textAlign: 'center',
        fontWeight: 'bold'
    },

    botonDeletePost: {
        width: 100,
        height: 30,
        backgroundColor: '#FF85A1',
        textAlign: 'center',
        padding: 5,
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'black',
        marginBottom: 18,
        display: 'flex',
        alignSelf: 'flex-end'
    },

    textBoton: {
        fontWeight: 'bold',
    },

    closeButton: {
        color: '#fff',
        padding: 5,
        backgroundColor: '#dc3545',
        alignSelf: 'flex-end',
        borderRadius: 4,
        paddingHorizontal: 8,
    },
    input: {
        height: 50,
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderRadius: 6,
        marginVertical: 10,
    },
    button: {
        backgroundColor: '#FBB1BD',
        paddingHorizontal: 10,
        paddingVertical: 6,
        textAlign: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#FBB1BD'
    },
    modalBorrar:{
        backgroundColor: 'white',
        width: '50%',
        height: 125,
        borderRadius: 6,
        padding: 5,
        borderColor: '#FBB1BD',
        borderWidth: 1,
        alignSelf: 'center',
        boxShadow: 'grey 0px 0px 9px 7px',
        marginTop: '50%',
    },
    viewBorrar:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 10
    },
    mensajeBorrar:{
        fontSize: 20,
        fontWeight: 'bold',
        display: 'flex',
        alignSelf: 'center',
        textAlign: 'center'
    }

})

export default Post