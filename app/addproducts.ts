// src/utils/addProduct.ts
import { addDoc, collection, Firestore } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Asegurate que esta ruta apunte a donde está tu firebaseConfig.ts

export interface ProductData {
  nombre: string;
  codigo: string;
  fechaCaducidad: string;
  categoria: string;
  estado: string;
  fechaRegistro: string;
}

export async function addProduct(productData: ProductData): Promise<string> {
  try {
    const productosCollectionRef = collection(db as Firestore, 'Productos');
    const docRef = await addDoc(productosCollectionRef, productData);
    console.log('Documento añadido con ID:', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error al añadir documento:', e);
    throw new Error('No se pudo añadir el producto.');
  }
}
