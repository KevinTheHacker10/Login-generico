// products.tsx
import { addDoc, collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { db } from '../../firebaseConfig';

// Tipo para producto
type ProductData = {
  nombre: string;
  codigo: string;
  fechaCaducidad: string;
  categoria: string;
  cantidad: number;
  estado: string;
  fechaRegistro: string;
};

// Función para guardar producto directamente
const addProduct = async (productData: ProductData): Promise<string> => {
  try {
    const productosRef = collection(db, 'Productos');
    const docRef = await addDoc(productosRef, productData);
    console.log('Documento guardado con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error al guardar producto:', error);
    throw new Error('No se pudo guardar el producto');
  }
};

const ProductsScreen = () => {
  const [productos, setProductos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nuevoProducto, setNuevoProducto] = useState<ProductData>({
    nombre: '',
    codigo: '',
    fechaCaducidad: '',
    categoria: '',
    cantidad: 1,
    estado: 'activo',
    fechaRegistro: new Date().toISOString().split('T')[0],
  });

  const cargarProductos = async () => {
    try {
      const productosSnapshot = await getDocs(collection(db, 'Productos'));
      const productosList = productosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(productosList);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      Alert.alert('Error', 'No se pudieron cargar los productos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleGuardarProducto = async () => {
    try {
      const id = await addProduct(nuevoProducto);
      Alert.alert('Éxito', `Producto guardado con ID: ${id}`);
      setNuevoProducto({
        nombre: '',
        codigo: '',
        fechaCaducidad: '',
        categoria: '',
        cantidad: 0,
        estado: 'activo',
        fechaRegistro: new Date().toISOString().split('T')[0],
      });
      cargarProductos();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el producto');
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.nombre}>Nombre: {item.nombre}</Text>
      <Text>Código: {item.codigo}</Text>
      <Text>Caduca: {item.fechaCaducidad}</Text>
      <Text>Categoría: {item.categoria}</Text>
      <Text>Cantidad: {item.cantidad}</Text>
      <Text>Estado: {item.estado}</Text>
      <Text>Fecha Registro: {item.fechaRegistro}</Text>
    </View>
  );

  return (
    <ImageBackground
      source={require('../../assets/wallpaper.jpg')}
      style={styles.background}
      blurRadius={4}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Registrar Nuevo Producto</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nuevoProducto.nombre}
          onChangeText={(text) =>
            setNuevoProducto({ ...nuevoProducto, nombre: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Código"
          value={nuevoProducto.codigo}
          onChangeText={(text) =>
            setNuevoProducto({ ...nuevoProducto, codigo: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Fecha Caducidad (DD/MM/YYYY)"
          value={nuevoProducto.fechaCaducidad}
          onChangeText={(text) =>
            setNuevoProducto({ ...nuevoProducto, fechaCaducidad: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Categoría"
          value={nuevoProducto.categoria}
          onChangeText={(text) =>
            setNuevoProducto({ ...nuevoProducto, categoria: text })
          }
        />
        <Text style={styles.nombre}>Cantidad</Text>
        <TextInput
          style={styles.input}
          placeholder="Cantidad"
          value={nuevoProducto.cantidad.toString()}
          onChangeText={(text) =>
            setNuevoProducto({ ...nuevoProducto, cantidad: parseInt(text) })
          }
        />

        <TouchableOpacity style={styles.button} onPress={handleGuardarProducto}>
          <Text style={styles.buttonText}>Guardar Producto</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Productos Registrados</Text>

        {isLoading ? (
          <Text style={styles.loading}>Cargando...</Text>
        ) : (
          <FlatList
            data={productos}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />
        )}
      </ScrollView>
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
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loading: {
    textAlign: 'center',
    fontSize: 16,
  },
  list: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default ProductsScreen;
