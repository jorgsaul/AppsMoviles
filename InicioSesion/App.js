import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [ventana, setVentana] = useState('login')
  const [usuario, setUsuario] = useState('')
  const [contraseña, setContraseña] = useState('')
  const [imageUri, setImageUri] = useState(false)
  const [error, setError] = useState('')

  function validacionInicio(){
    if(usuario == 'alma' && contraseña == 'appsmoviles'){
      setVentana('usuario');
    }else{
      setError('Usuario o contraseña incorrectos')
    }
  }

  const cambiarImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita acceso a las imágenes');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };
  
  function Button({texto, funcion}){
    return(
      <TouchableOpacity style = {styles.boton} onPress={funcion}>
        <Text style = {styles.botonTxt}>{texto}</Text>
      </TouchableOpacity>
    )
  }

  function cambioVista(){
    if(ventana == 'login'){
      return(
        <View style={styles.container}>
          <Text>Inicio Sesion!</Text>
          <TextInput placeholder='Usuario' style={styles.textInput} onChangeText={(texto) => {setUsuario(texto); setError('')}} value={usuario} maxLength={20}/>
          <TextInput placeholder='contaseña' style={styles.textInput} onChangeText={setContraseña} value={contraseña} secureTextEntry maxLength={35}/>
          <Button texto='Iniciar sesion' style={styles.boton} funcion={()=> validacionInicio()}/>
          <Text style= {styles.error}>{error}</Text>
          <StatusBar style="auto" />  
        </View>
      )
    }else if(ventana == 'usuario'){
      return(
      <View style={styles.container}>
          <Text>Oaaal</Text>
          <Image source={{uri:imageUri|| "https://static.vecteezy.com/system/resources/previews/005/005/840/non_2x/user-icon-in-trendy-flat-style-isolated-on-grey-background-user-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-free-vector.jpg"}}
          style={styles.imagen}
          />
          <Button texto={'Seleccionar de la galeria'} funcion={cambiarImagen}/>
          <Button texto={'Cerrar Sesion'} style={styles.boton} funcion={()=> setVentana('login')} />
      </View>
      )
    }
  }

  return (
    <View style={styles.container}>
      {cambioVista()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput:{
    borderWidth: 1,
    width: 300,
    borderRadius: 100,
    padding: 10,
    margin: 10,
    borderColor: '#b1b1b1'
  },
  boton:{
    borderRadius: 100,
    backgroundColor: '#3B82F6',
    padding: 10
  },
  botonTxt:{
    color: 'white'
  },
  imagen:{
    width: 100,
    height: 100,
    borderRadius: 1000,
    borderColor: "#4d4d4dff",
    borderWidth: 2
  },
  error:{
    color: 'red',
    marginTop: 20
  }
});
