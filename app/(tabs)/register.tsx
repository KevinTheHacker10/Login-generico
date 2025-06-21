import { Link, router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { auth } from "../../firebaseConfig";
WebBrowser.maybeCompleteAuthSession();


export default function RegisterScreen() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
const handleRegister = async () => {
  if (password !== confirmPassword) {
    Alert.alert("Error", "Las contraseñas no coinciden");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, {
      displayName: nombre,
    });

    Alert.alert("Éxito", "Usuario registrado correctamente");
    router.push('./index.tsx'); // Volver al login
  } catch (error: any) {
    console.error(error);
    Alert.alert("Error al registrar", error.message);
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Fondo con wallpaper (opcional) */}
      <Image 
        source={require('../../assets/wallpaper.jpg')} 
        style={styles.backgroundImage} 
      />

      {/* Contenido */}
      <View style={styles.content}>
        <Text style={styles.title}>Crear cuenta nueva</Text>

        <TextInput
          placeholder="Nombre completo"
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          placeholder="Correo electrónico"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Contraseña"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          placeholder="Comprobar contraseña"
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

        {/* Enlace para volver a login */}
        <Link href="./index.tsx" asChild>
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.2,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  button: {
    height: 50,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#4CAF50',
    textDecorationLine: 'underline',
  },
});