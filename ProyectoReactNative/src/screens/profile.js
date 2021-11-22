import React, { Component } from 'react';
import { db, auth } from '../firebase/config';
import { Text, TouchableOpacity, View, StyleSheet, Image, ActivityIndicator, FlatList, TextInput, Modal } from 'react-native';
import Post from '../components/Post';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posteos: [],
      showModal: false,

    }
  }


//COMPONENT DID MOUNT
  componentDidMount() {
    db.collection('posts').where('owner', '==', auth.currentUser.email).orderBy('createdAt', 'desc').onSnapshot(
      docs => {
        console.log(docs);
        let posts = [];
        docs.forEach(doc => {
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

  //MODAL INFORMATION

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


  // /RENDER 
  render() {
    console.log(this.state.posteos);
    return (
      <View style={styles.container}>
        <Text style={styles.user}>  @{this.props.userData.displayName}</Text>

        <TouchableOpacity onPress={() => this.showModal()} style= {styles.info}>
          <Text style={styles.userInformation}> tap here to see more user information </Text>
        </TouchableOpacity>

        {/* modal user information */}
        <Modal visible={this.state.showModal} animationType='slide' transparent={true} >
          <View style={styles.modalInformation}>
            <TouchableOpacity style={styles.closeButton} onPress={() => this.hideModal()}>
              <Text>X</Text>
            </TouchableOpacity>


            <View>
              <Text style={styles.infoUser}> Email: {this.props.userData.email}</Text>
              <Text style={styles.infoUser}> Last login: {this.props.userData.metadata.lastSignInTime}</Text>
              <Text style={styles.infoUser}> User Posts: {this.state.posteos.length} </Text>
            </View>

          </View>
        </Modal>

        { this.state.posteos === 0 ?
          <Text style={styles.tituloPosts}>All your posts:</Text> : 
          <Text> You don´t have any posts yet! Go make the first one</Text> 
        }

        {/* <Text style={styles.tituloPosts}>All your posts:</Text> */}

        {/* POSTS DEL USUARIO */}
        <View style={styles.containerPost}>

          <FlatList
            data={this.state.posteos}
            keyExtractor={post => post.id}
            renderItem={({ item }) => <Post postData={item} />}
          />
        </View>

        {/* BOTON DE LOGOUT */}
        <TouchableOpacity style={styles.touchable} onPress={() => this.props.logout()}>
          <Text style={styles.botonLogout}>Logout</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    //marginTop: 20,
    //marginHorizontal: 10,
    backgroundColor: 'white'
  },
  user: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 30,
    fontWeight: 'bold'
  },
  infoUser: {
    marginBottom: 10,
    fontSize: 18,

  },
  userInformation: {
    fontSize: 15,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  info: {
    display: 'flex',
    alignContent: 'flex-end'
  },
  modalInformation: {
    backgroundColor: '#FAE0E4',
    width: '90%',
    height: '17vh',
    borderRadius: 4,
    padding: 5,
    alignSelf: 'center',
    boxShadow: 'rgb(204 204 204) 0px 0px 9px 7px',
    marginTop: '50%',
    marginBottom: 200,
},
  
  tituloPosts: {
    fontSize: 15,
    marginLeft: 10,
    marginBottom: 10
  },

  touchable: {
    padding: 10,
    backgroundColor: '#FF7096',
    marginTop: 30,
    borderRadius: 4,
    width: '60%',
    display: 'flex',
    alignSelf: 'center',
    marginBottom: 20
  },
  botonLogout: {
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  containerPost: {
    paddingHorizontal: 10,
    backgroundColor: 'white'
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