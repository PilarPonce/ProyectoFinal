import React, {Component} from 'react';
import { db, auth } from '../firebase/config';
import {Text, TouchableOpacity, View, StyleSheet, Image, ActivityIndicator, FlatList, TextInput, Modal} from 'react-native';
import Post from '../components/Post';

class Profile extends Component{
  constructor(props){
    super(props);
    this.state ={
      posteos: [],
      showModal: false, 
      
    }
  }

  componentDidMount(){
    db.collection('posts').where('owner', '==', auth.currentUser.email).orderBy('createdAt', 'desc').onSnapshot(
      docs => {
        console.log(docs);
        let posts = [];
        docs.forEach( doc => {
          posts.push({
            id: doc.id,   
            data: doc.data(),
          })
        })
        console.log(posts);

        this.setState({
          posteos: posts,
        })
      }
    )
  }

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


  render(){
    console.log(this.state.posteos);
    return(
      <View style={styles.container}>
          <Text style={styles.user}>  @{this.props.userData.displayName}</Text>
          {/* podemos hacer como en el modal de comentarios y ponemos user information y que se abra y ahi adentro ponemos el email...  */}
         
        <TouchableOpacity onPress={() => this.showModal()}>
          <Text > User Information</Text>
        </TouchableOpacity>

          <Modal
            visible={this.state.showModal}
            animationType='slide'
            transparent={false}
          >
            <TouchableOpacity style={styles.closeButton} onPress={() => this.hideModal()}>
              <Text>X</Text>
            </TouchableOpacity>


            <View>
              <Text style={styles.infoUser}> Email: {this.props.userData.email}</Text>
              <Text style={styles.infoUser}> Last login: {this.props.userData.metadata.lastSignInTime}</Text>
              <Text style={styles.infoUser}> User Posts: {this.state.posteos.length} </Text>
            </View>

          </Modal> 
  
          
          {/* POSTS DEL USUARIO */}
          <View style={styles.containerPost}>
          
          <FlatList 
            data= { this.state.posteos }
            keyExtractor = { post => post.id}
            renderItem = { ({item}) => <Post postData={item} />} 
          />
          </View>

          {/* BOTON DE LOGOUT */}
          <TouchableOpacity style={styles.touchable} onPress={()=>this.props.logout()}>
            <Text style={styles.botonLogout}>Logout</Text>
          </TouchableOpacity>
      </View>       
    )
  }
}

const styles = StyleSheet.create({
    container:{
        marginTop: 20,
        marginHorizontal:10
    },
    user:{
        fontSize:18,
        marginTop:20,
        marginBottom:30,
        fontWeight: 'bold'
    },
    infoUser:{
        marginBottom:10,
    },
    touchable:{
        padding: 10,
        backgroundColor: '#FAE0E4',
        marginTop: 30,
        borderRadius: 4,
    },
  botonLogout:{
        fontWeight: 'bold',
        color:'black',
        textAlign: 'center'
    },
  containerPost:{
      paddingHorizontal:10,
    }, 
  closeButton: {
    color: '#fff',
    padding: 5,
    backgroundColor: '#dc3545',
    alignSelf: 'flex-end',
    borderRadius: 4,
    paddingHorizontal: 8,
  },
    
});

export default Profile;