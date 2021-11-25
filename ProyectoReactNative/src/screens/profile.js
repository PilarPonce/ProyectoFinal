import React, { Component } from 'react';
import { db, auth } from '../firebase/config';
import { Text, TouchableOpacity, View, StyleSheet, FlatList, Modal } from 'react-native';
import Post from '../components/Post';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posteos: [],
      showModal: false,

    }
  }


//POSTEOS DEL USUARIO
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


  //RENDER 
  render() {
    console.log(this.state.posteos);
    return (
      <View style={styles.container}>
        
        <View style= {styles.userContainer}>
          {this.props.userData.displayName?
            <Text style={styles.user}>  @{this.props.userData.displayName}</Text>:
            <Text style={styles.user}>  {this.props.userData.email}</Text>        
          }
          <TouchableOpacity onPress={() => this.showModal()} style={styles.info}>
            <Text style={styles.userInformation}> Tap here to see more user information </Text>
          </TouchableOpacity>
        </View>
       

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

        { this.state.posteos.length === 0 ?
          <Text style= {styles.anyPost}> You don´t have any posts yet! Go make the first one</Text>:
          <Text style={styles.tituloPosts}>All your posts:</Text>  
        }

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
    backgroundColor: 'white',
    height: '100%'
  },
  userContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  user: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 30,
    fontWeight: 'bold', 
    marginLeft: '1%'
  },
  infoUser: {
    marginBottom: 10,
    fontSize: 18,

  },
  userInformation: {
    fontSize: 15,
    color: 'grey', 
  },

  info: {
    marginTop: 25,
    marginRight: 10
  },
  modalInformation: {
    backgroundColor: '#FAE0E4',
    width: '90%',
    height: 150,
    borderRadius: 4,
    padding: 5,
    alignSelf: 'center',
    boxShadow: 'rgb(204 204 204) 0px 0px 9px 7px',
    marginTop: '25%',
  },
  anyPost: {
    marginTop: '1%', 
    marginLeft: '1%',
    fontSize: 20,
    display: 'flex',
    alignSelf: 'center'
  },
  
  tituloPosts: {
    fontSize: 19,
    marginLeft: 10,
    marginBottom: 10
  },

  touchable: {
    backgroundColor: '#FF7096',
    display: 'flex',
    alignSelf: 'center',
    padding: 10,
    width: '50%',
    marginTop: 20,
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