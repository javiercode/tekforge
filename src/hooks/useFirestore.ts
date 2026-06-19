import { useState, useCallback } from 'react';
import { db } from '../firebase/firebase';
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  increment,
  query,
  where,
  getDocs,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';

// Tipo para la URL
export interface UrlData {
  originalUrl: string;
  shortCode: string;
  userId: string;
  createdAt: string;
  clicks: number;
}

// Interfaces para la Página de Enlace (Link-in-Bio)
export interface BioLink {
  id: string;
  label: string;
  url: string;
}

export interface BioSocials {
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  facebook?: string;
}

export interface BioData {
  username: string; // ID único del documento (slug)
  userId: string;
  title: string;
  bio: string;
  photoURL: string;
  theme: string; // Preset visual
  buttonStyle: string; // Estilo de botón (e.g., 'rounded', 'pill', 'outline')
  links: BioLink[];
  socials: BioSocials;
  createdAt: string;
  views: number;
}

export function useFirestore() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Guardar nueva URL (usamos shortCode como ID del documento)
  const addUrl = useCallback(async (urlData: Omit<UrlData, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, 'urls', urlData.shortCode);
      await setDoc(docRef, urlData);
      return docRef.id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener URL por shortCode
  const getUrl = useCallback(async (shortCode: string) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, 'urls', shortCode);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as UrlData;
      }
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Incrementar contador de clics
  const incrementClicks = useCallback(async (shortCode: string) => {
    const docRef = doc(db, 'urls', shortCode);
    await updateDoc(docRef, {
      clicks: increment(1),
    });
  }, []);

  // Obtener URLs por userId (para historial)
  const getUserUrls = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, 'urls'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const urls: UrlData[] = [];
      querySnapshot.forEach((doc) => {
        urls.push(doc.data() as UrlData);
      });
      // Ordenar por fecha de creación descendente
      return urls.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener tus enlaces');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Eliminar un enlace acortado
  const deleteUrl = useCallback(async (shortCode: string) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, 'urls', shortCode);
      await deleteDoc(docRef);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el enlace');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener Bio por username (slug público)
  const getBio = useCallback(async (username: string) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, 'bios', username.toLowerCase());
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as BioData;
      }
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener página de enlace');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener Bio por userId (para el creador/editor)
  const getBioByUserId = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, 'bios'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data() as BioData;
      }
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al buscar tu página de enlace');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Guardar/Actualizar Bio
  const saveBio = useCallback(async (bioData: BioData) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, 'bios', bioData.username.toLowerCase());
      await setDoc(docRef, bioData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar tu página de enlace');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Incrementar contador de visualizaciones de la Bio
  const incrementBioViews = useCallback(async (username: string) => {
    try {
      const docRef = doc(db, 'bios', username.toLowerCase());
      await updateDoc(docRef, {
        views: increment(1),
      });
    } catch (err) {
      console.error('Error al incrementar vistas de bio:', err);
    }
  }, []);

  return {
    addUrl,
    getUrl,
    incrementClicks,
    getUserUrls,
    deleteUrl,
    getBio,
    getBioByUserId,
    saveBio,
    incrementBioViews,
    loading,
    error,
  };
}