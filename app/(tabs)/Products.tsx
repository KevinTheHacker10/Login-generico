import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
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

const ProductsScreen = () => {
  const [productos, setProductos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [idEnEdicion, setIdEnEdicion] = useState<string | null>(null);
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
      const snapshot = await getDocs(collection(db, 'Productos'));
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(list);
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
      if (idEnEdicion) {
        const docRef = doc(db, 'Productos', idEnEdicion);
        await updateDoc(docRef, nuevoProducto);
        Alert.alert('Actualizado', 'Producto actualizado correctamente');
      } else {
        const productosRef = collection(db, 'Productos');
        await addDoc(productosRef, nuevoProducto);
        Alert.alert('Éxito', 'Producto guardado correctamente');
      }

      setNuevoProducto({
        nombre: '',
        codigo: '',
        fechaCaducidad: '',
        categoria: '',
        cantidad: 0,
        estado: 'activo',
        fechaRegistro: new Date().toISOString().split('T')[0],
      });
      setIdEnEdicion(null);
      cargarProductos();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo guardar o actualizar el producto');
    }
  };

  const handleEliminar = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'Productos', id));
      Alert.alert('Eliminado', 'Producto eliminado correctamente');
      cargarProductos();
    } catch (error) {
      console.error('Error al eliminar:', error);
      Alert.alert('Error', 'No se pudo eliminar el producto');
    }
  };

  const handleEditar = (item: any) => {
    setNuevoProducto({
      nombre: item.nombre || '',
      codigo: item.codigo || '',
      fechaCaducidad: item.fechaCaducidad || '',
      categoria: item.categoria || '',
      cantidad: typeof item.cantidad === 'number' ? item.cantidad : parseInt(item.cantidad) || 0,
      estado: item.estado || 'activo',
      fechaRegistro: item.fechaRegistro || new Date().toISOString().split('T')[0],
    });
    setIdEnEdicion(item.id);
    Alert.alert('Editando', 'Modificá los campos y presioná "Actualizar Producto"');
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

      <View style={styles.cardButtons}>
        <TouchableOpacity
          style={[styles.smallButton, { backgroundColor: '#FF5252' }]}
          onPress={() => handleEliminar(item.id)}
        >
          <Text style={styles.smallButtonText}>🗑️ Eliminar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.smallButton, { backgroundColor: '#FFA000' }]}
          onPress={() => handleEditar(item)}
        >
          <Text style={styles.smallButtonText}>✏️ Editar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ImageBackground style={{ flex: 1 }}>
  <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
    <View style={styles.bannerImage}>
      <Image
        source={require('../../assets/wallpaper.jpg')}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
      />
    </View>

    <View style={styles.formCard}>
      <Text style={styles.title}>Productos</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre producto"
        value={nuevoProducto.nombre}
        onChangeText={(text) => setNuevoProducto({ ...nuevoProducto, nombre: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Código producto"
        value={nuevoProducto.codigo}
        onChangeText={(text) => setNuevoProducto({ ...nuevoProducto, codigo: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Cantidad"
        keyboardType="numeric"
        value={(nuevoProducto.cantidad ?? '').toString()}
        onChangeText={(text) =>
          setNuevoProducto({ ...nuevoProducto, cantidad: parseInt(text) || 0 })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha caducidad"
        value={nuevoProducto.fechaCaducidad}
        onChangeText={(text) =>
          setNuevoProducto({ ...nuevoProducto, fechaCaducidad: text })
        }
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#871f1f' }]}
        onPress={handleGuardarProducto}
      >
        <Text style={styles.buttonText}>
          {idEnEdicion ? 'Actualizar' : 'Guardar'}
        </Text>
      </TouchableOpacity>
    </View>

    <Text style={styles.title}>Productos Registrados</Text>
    {isLoading && <Text style={styles.loading}>Cargando...</Text>}

    {productos.map((item) => (
      <View key={item.id} style={styles.card}>
        <Text style={styles.nombre}>Nombre: {item.nombre}</Text>
        <Text>Código: {item.codigo}</Text>
        <Text>Caduca: {item.fechaCaducidad}</Text>
        <Text>Categoría: {item.categoria}</Text>
        <Text>Cantidad: {item.cantidad}</Text>
        <Text>Estado: {item.estado}</Text>
        <Text>Fecha Registro: {item.fechaRegistro}</Text>

        <View style={styles.cardButtons}>
          <TouchableOpacity
            style={[styles.smallButton, { backgroundColor: '#FF5252' }]}
            onPress={() => handleEliminar(item.id)}
          >
            <Text style={styles.smallButtonText}>🗑️ Eliminar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.smallButton, { backgroundColor: '#FFA000' }]}
            onPress={() => handleEditar(item)}
          >
            <Text style={styles.smallButtonText}>✏️ Editar</Text>
          </TouchableOpacity>
        </View>
      </View>
    ))}
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
    flexGrow: 1,
    padding: 20,
    paddingTop: 0,
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
  cardButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  smallButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  formCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    padding: 20,
    marginVertical: 0,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  bannerImage: {
    width: '100%',
    height: 200,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    overflow: 'hidden',
    marginTop: 0, 
    paddingTop: 0,
  },
});

export default ProductsScreen;
