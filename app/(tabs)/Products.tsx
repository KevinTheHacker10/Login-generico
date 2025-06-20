// RegistrarProducto.tsx
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const RegistrarProducto = () => {
  const [nombreProducto, setNombreProducto] = useState('');
  const [codigoProducto, setCodigoProducto] = useState('');
  const [fechaCaducidad, setFechaCaducidad] = useState('');
  const [categoria, setCategoria] = useState('fruit'); // Valor por defecto como en la imagen

  const handleGuardar = async () => {
    if (!nombreProducto || !codigoProducto || !fechaCaducidad) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }

    try {
      const db = getFirestore();
      await addDoc(collection(db, 'productos'), {
        nombre: nombreProducto,
        codigo: codigoProducto,
        fechaCaducidad: fechaCaducidad,
        categoria: categoria,
        fechaRegistro: new Date().toISOString()
      });

      Alert.alert('Éxito', 'Producto registrado correctamente');
      // Limpiar campos después de guardar
      setNombreProducto('');
      setCodigoProducto('');
      setFechaCaducidad('');
    } catch (error) {
      console.error('Error al registrar producto:', error);
      Alert.alert('Error', 'No se pudo registrar el producto');
    }
  };

  return (
    <ImageBackground 
      source={require('../../assets/wallpaper.jpg')} 
      style={styles.background}
    >
      <View style={styles.container}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />

        <Text style={styles.titulo}>Registrar Producto</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Categoría</Text>
          <TextInput
            style={styles.input}
            value={categoria}
            onChangeText={setCategoria}
            placeholder="Ej: fruit"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre Producto</Text>
          <TextInput
            style={styles.input}
            value={nombreProducto}
            onChangeText={setNombreProducto}
            placeholder="Ingrese el nombre del producto"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Código Producto</Text>
          <TextInput
            style={styles.input}
            value={codigoProducto}
            onChangeText={setCodigoProducto}
            placeholder="Ingrese el código del producto"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Fecha caducidad</Text>
          <TextInput
            style={styles.input}
            value={fechaCaducidad}
            onChangeText={setFechaCaducidad}
            placeholder="DD/MM/YYYY"
          />
        </View>

        <TouchableOpacity style={styles.boton} onPress={handleGuardar}>
          <Text style={styles.botonTexto}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  boton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  botonTexto: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RegistrarProducto;