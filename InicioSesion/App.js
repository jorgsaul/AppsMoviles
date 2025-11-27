import { StatusBar } from 'expo-status-bar';
import { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [ventana, setVentana] = useState('login');
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const [photo, setPhoto] = useState(null);
  const [facing, setFacing] = useState('back');
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Se necesitan permisos para acceder a la galería');
      }
    })();
  }, []);

  function validacionInicio() {
    if (usuario === 'admin' && contraseña === '1234') {
      setVentana('usuario');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  }

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        console.log('Foto tomada:', photo.uri);
        setPhoto(photo.uri);
      } catch (error) {
        console.error('Error tomando foto:', error);
        Alert.alert('Error', 'No se pudo tomar la foto: ' + error.message);
      }
    } else {
      Alert.alert('Error', 'Cámara no disponible');
    }
  };

  const cambiarImagen = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets[0]) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error seleccionando imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const switchCamera = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  function Button({ texto, onPress, style }) {
    return (
      <TouchableOpacity style={[styles.boton, style]} onPress={onPress}>
        <Text style={styles.botonTxt}>{texto}</Text>
      </TouchableOpacity>
    );
  }

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Esperando permisos de cámara...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Permisos de Cámara</Text>
        <Text style={styles.texto}>Necesitamos acceso a la cámara para tomar fotos</Text>
        <Button texto="Conceder Permisos" onPress={requestPermission} />
      </View>
    );
  }

  if (ventana === 'login') {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Inicio de Sesión</Text>
        <TextInput
          placeholder="Usuario"
          style={styles.textInput}
          onChangeText={(texto) => {
            setUsuario(texto);
            setError('');
          }}
          value={usuario}
          maxLength={20}
        />
        <TextInput
          placeholder="Contraseña"
          style={styles.textInput}
          onChangeText={setContraseña}
          value={contraseña}
          secureTextEntry
          maxLength={35}
        />
        <Button texto="Iniciar sesión" onPress={validacionInicio} />
        <Text style={styles.error}>{error}</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>¡Hola {usuario}!</Text>
      
      {photo ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: photo }} style={styles.imagen} />
          <View style={styles.buttonRow}>
            <Button 
              texto="Tomar otra foto" 
              onPress={() => setPhoto(null)}
              style={styles.smallButton}
            />
            <Button 
              texto="Elegir de galería" 
              onPress={cambiarImagen}
              style={styles.smallButton}
            />
          </View>
        </View>
      ) : (
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
          />
          <View style={styles.cameraControls}>
            <Button 
              texto="Tomar Foto" 
              onPress={takePhoto}
              style={styles.cameraButton}
            />
            <Button 
              texto="Cambiar Cámara" 
              onPress={switchCamera}
              style={styles.cameraButton}
            />
            <Button 
              texto="Galería" 
              onPress={cambiarImagen}
              style={styles.cameraButton}
            />
          </View>
        </View>
      )}
      
      <Button texto="Cerrar Sesión" onPress={() => setVentana('login')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  texto: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  textInput: {
    borderWidth: 1,
    width: '100%',
    maxWidth: 300,
    borderRadius: 25,
    padding: 15,
    margin: 10,
    borderColor: '#b1b1b1',
    fontSize: 16,
  },
  boton: {
    borderRadius: 25,
    backgroundColor: '#3B82F6',
    padding: 15,
    margin: 10,
    minWidth: 200,
    alignItems: 'center',
  },
  smallButton: {
    minWidth: 140,
    padding: 12,
    margin: 5,
  },
  cameraButton: {
    minWidth: 150,
    padding: 12,
    margin: 5,
  },
  botonTxt: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imagen: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderColor: '#4d4d4d',
    borderWidth: 3,
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
    margin: 20,
  },
  cameraContainer: {
    alignItems: 'center',
    margin: 10,
    width: '100%',
  },
  camera: {
    width: 300,
    height: 400,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
    fontSize: 16,
  },
});