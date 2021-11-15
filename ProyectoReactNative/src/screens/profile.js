import React, {Component} from 'react';
import { db, auth } from '../firebase/config';
import {Text, TouchableOpacity, View, StyleSheet, Image, ActivityIndicator, FlatList, TextInput} from 'react-native';
import Post from '../components/Post';

class Profile extends Component{
  constructor(props){
    super(props);
    this.state ={
      posteos: [],
      
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



  render(){
    console.log(this.state.posteos);
    return(
      <View style={styles.container}>
          <Text style={styles.welcome}> Username: {this.props.userData.displayName}</Text>
          <Text style={styles.welcome}> Mail: {this.props.userData.email}</Text>
          <Text style={styles.element}> Last login: {this.props.userData.metadata.lastSignInTime}</Text>
          <Text style={styles.element}> User Posts: {this.state.posteos.length} </Text>
          <View style={styles.containerPost}>
          
          <FlatList 
            data= { this.state.posteos }
            keyExtractor = { post => post.id}
            renderItem = { ({item}) => <Post postData={item} />} 
          />
          
          </View>
          <TouchableOpacity style={styles.touchable} onPress={()=>this.props.logout()}>
            <Text style={styles.touchableText}>Logout</Text>
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
    welcome:{
        fontSize:18,
        marginTop:20,
        marginBottom:30,
        fontWeight: 'bold'
    },
    element:{
        marginBottom:10,
    },
    touchable:{
        padding: 10,
        backgroundColor: '#dc3545',
        marginTop: 30,
        borderRadius: 4,
    },
    touchableText:{
        fontWeight: 'bold',
        color:'#fff',
        textAlign: 'center'
    },
    containerPost:{
      paddingHorizontal:10,
    }
    
});

export default Profile;