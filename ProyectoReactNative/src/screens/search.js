import React, {Component} from "react";
import {View, Text, TextInput, StyleSheet, TouchableOpacity, Image, FlatList, ActivityIndicator} from 'react-native';
import { db } from '../firebase/config';
import Post from '../components/Post';

class Search extends Component{
    constructor(props){
        super(props);
        this.state ={
          textoBuscador: '',
          posteos: [],
          buscado: false,
          cargado: '',
          ordenAsc: true, 
          filtro: 'desc', 
        }
      }


//SEARCH
      search(){
        db.collection('posts').where('owner', '==', this.state.textoBuscador, this.state.filtro).onSnapshot(
            docs => {
              console.log(docs);
              let posts = [];
              docs.forEach( doc => {
                posts.push({
                  id: doc.id,   
                  data: doc.data(),
                })
              })
              
              this.setState({
                posteos: posts,
                buscado: true,
                ordenAsc: true, 
                cargando: true,
              })
            }
          )
      }

      ordenAscendente (){
        this.setState({
          filtro: 'asc',
          ordenAsc: false,
        })
        db.collection('posts').where('owner', '==', this.state.textoBuscador).orderBy('createdAt', 'asc').onSnapshot(
          docs => {
            console.log(docs);
            let posts = [];
            docs.forEach(doc => {
              posts.push({
                id: doc.id,
                data: doc.data(),
              })
            })
        
            this.setState({
              posteos: posts,
              buscado: true,
              cargando: true, 

            })
          }
        )
      }

  ordenDescendente() {
    this.setState({
      filtro: 'desc',
      ordenAsc: true,
    })
    db.collection('posts').where('owner', '==', this.state.textoBuscador).orderBy('createdAt', 'desc').onSnapshot(
      docs => {
        console.log(docs);
        let posts = [];
        docs.forEach(doc => {
          posts.push({
            id: doc.id,
            data: doc.data(),
          })
        })

        this.setState({
          posteos: posts,
          buscado: true,
          cargando: true,

        })
      }
    )
  }


// RENDER 
      render(){
          
          return(
              <View style={styles.todo}>

                  <TextInput
                        style={styles.input}
                        onChangeText={(text)=>this.setState({textoBuscador: text})}
                        placeholder='Search by email'
                        keyboardType='default'
                        value={this.state.textoBuscador}    
                        />

                    {/* BOTON SEARCH */}
                    <TouchableOpacity onPress={()=>this.search()} style={styles.botonSearch}>
                            <Text style={styles.textButton}>Search</Text>    
                    </TouchableOpacity>

                  {
                    this.state.cargado === false ?
                    <ActivityIndicator> </ActivityIndicator> : 
                    <Text> </Text>
                  }


                    {/* PARA VER SI HAY RESULTADOS DE BUSQUEDA */}
                    {this.state.posteos.length === 0 && this.state.buscado === true ?
                
                    <View> 
                      <Text style={styles.noResults}> Sorry, no results! </Text>
                      <Text style={styles.noResults}> The user does not exist or does not have any publications yet </Text>
                      
                    </View>
                    : 
                    <React.Fragment> 
                  {
                    this.state.ordenAsc === true ?
                      <TouchableOpacity onPress={() => this.ordenAscendente()}> <Text> ORDEN ASCENDENTE  </Text></TouchableOpacity> :
                      <TouchableOpacity onPress={() => this.ordenDescendente()}> <Text> ORDEN DESCENDENTE </Text></TouchableOpacity>
                  }
                        <FlatList
                          data={this.state.posteos}
                          keyExtractor={post => post.id}
                          renderItem={({ item }) => <Post postData={item} />}
                        />
                    </React.Fragment>
                         
                        
                        
                    }  

              </View>
          )
      }

}

const styles = StyleSheet.create({
    todo: {
      backgroundColor: 'white',
      height: '100%'
    },
    botonSearch: {
      width: '95%',
      height: 35,
      backgroundColor: '#FAE0E4',
      textAlign: 'center',
      padding: 5,
      borderRadius: 4,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'black',
      marginTop: 15,
      marginBottom: 15,
      display: 'flex',
      alignSelf: 'center'
    },
    formContainer:{
        paddingHorizontal:10,
        marginTop: 20,
        width: '100%',
        height: '95%'
    },
    input:{
        height:40,
        paddingVertical:15,
        paddingHorizontal: 10,
        borderWidth:1,
        borderColor: '#ccc',
        borderStyle: 'solid',
        borderRadius: 6,
        marginBottom:10,
        marginTop: 15,
        width: '95%',
        display: 'flex',
        alignSelf: 'center'
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
        color: 'black'
    },
    noResults:{
      display: 'flex',
      alignSelf: 'center',
      fontSize: 20,
      fontWeight: 'bold'
    }

})

export default Search;