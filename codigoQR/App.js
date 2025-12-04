import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, Modal } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Linking } from 'react-native';

export default function QRScannerApp() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (user === 'admin' && password === '1234') {
      setIsLoggedIn(true);
    } else {
      Alert.alert('Error', 'Usuario o contraseña incorrectos');
    }
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.loginTitle}>Iniciar sesión</Text>

        <TextInput
          style={styles.input}
          placeholder="Usuario"
          value={user}
          onChangeText={setUser}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Permiso de cámara necesario</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Permitir cámara</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }) => {
    setScannedData(data);
    setModalVisible(true);
  };

  const openLink = () => {
    if (scannedData) {
      const url = scannedData.startsWith('http')
        ? scannedData
        : `http://${scannedData}`;

      Linking.canOpenURL(url)
        .then(supported => {
          if (supported) {
            Linking.openURL(url);
          } else {
            Alert.alert('Error', 'No se puede abrir este enlace');
          }
        })
        .catch(err => {
          Alert.alert('Error', 'Error al abrir el enlace: ' + err.message);
        });
    }

    setModalVisible(false);
    setScannedData(null);
    setTimeout(() => setScanned(false), 1000);
  };

  const copyToClipboard = () => {
    if (scannedData) {
      Alert.alert('Copiado', 'Texto copiado al portapapeles');
    }

    setModalVisible(false);
    setScannedData(null);
    setTimeout(() => setScanned(false), 1000);
  };

  const resetScanner = () => {
    setModalVisible(false);
    setScannedData(null);
    setScanned(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"]
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />

      <View style={styles.overlay}>
        <View style={styles.scanFrame} />
        <Text style={styles.scanText}>Enfoca el QR</Text>
      </View>

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>QR Escaneado</Text>

            <View style={styles.dataContainer}>
              <Text style={styles.dataLabel}>Contenido:</Text>
              <Text style={styles.dataText} numberOfLines={3}>{scannedData}</Text>
            </View>

            <View style={styles.buttonContainer}>
              {scannedData && (scannedData.includes('http') || scannedData.includes('.') || scannedData.includes('://')) && (
                <TouchableOpacity
                  style={[styles.modalButton, styles.primaryButton]}
                  onPress={openLink}
                >
                  <Text style={styles.modalButtonText}>Abrir Enlace</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.modalButton, styles.secondaryButton]}
                onPress={copyToClipboard}
              >
                <Text style={[styles.modalButtonText, styles.secondaryButtonText]}>
                  Copiar Texto
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={resetScanner}
              >
                <Text style={styles.modalButtonText}>Escanear Otro</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 25,
  },
  input: {
    width: '80%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: 'white'
  },
  button: {
    backgroundColor: '#82beff',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 16,
    color: 'white'
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'white',
  },
  scanText: {
    marginTop: 20,
    color: 'white',
    fontSize: 18,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
  },
  dataContainer: {
    backgroundColor: '#eee',
    padding: 15,
    width: '100%',
    borderRadius: 10,
    marginBottom: 20,
  },
  dataLabel: {
    fontSize: 14,
    color: '#555',
  },
  dataText: {
    fontSize: 16,
    marginTop: 5,
  },
  buttonContainer: {
    width: '100%',
  },
  modalButton: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#82beff',
  },
  secondaryButton: {
    backgroundColor: '#e4ecdb',
    borderWidth: 1,
    borderColor: '#b4a2a2',
  },
  cancelButton: {
    backgroundColor: '#bd30ff',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  secondaryButtonText: {
    color: '#333',
  },
});
