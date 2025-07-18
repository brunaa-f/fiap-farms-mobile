import { collection, addDoc, serverTimestamp, query, where, onSnapshot } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import { db } from './firebase'; 

interface LotData {
  productName: string;
  costPerUnit: number;
  status: string;
}

export interface ProductionLot extends DocumentData {
  id: string;
  productName: string;
  costPerUnit: number;
  status: string;
}

/**
 * Cria um novo lote de produção no banco de dados Firestore.
 * Esta função é assíncrona, pois a comunicação com o banco de dados leva um tempo.
 *
 * @param lotData - Os dados que o usuário preencheu no formulário.
 * @param userId - O ID do usuário que está logado.
 */
export const createLot = async (lotData: LotData, userId: string) => {
  // O bloco try/catch é uma forma segura de lidar com erros que podem
  // acontecer na comunicação com a internet ou com o Firebase.
  try {
    // A função 'addDoc' adiciona um novo documento com um ID gerado automaticamente
    // na coleção 'production_lots'.
    const docRef = await addDoc(collection(db, 'production_lots'), {
      ...lotData, // Insere os dados do formulário: productName, costPerUnit, status
      ownerId: userId, // Adiciona o ID do dono, crucial para as regras de segurança
      creationDate: serverTimestamp(), // Pede para o Firebase adicionar a data/hora exata do servidor
    });

    // Se tudo deu certo, imprime uma mensagem no console (útil para debugar)
    // e retorna um objeto indicando sucesso.
    console.log("✅ Lote de produção salvo com o ID: ", docRef.id);
    return { success: true, id: docRef.id };

  } catch (error) {
    // Se algo der errado (ex: sem internet, regras de segurança bloqueando),
    // o código dentro do 'catch' é executado.
    console.error("❌ Erro ao salvar o lote de produção: ", error);
    
    // Retorna um objeto indicando a falha e qual foi a mensagem de erro.
    return { success: false, error: (error as Error).message };
  }
};

export const listenToProductionLots = (userId: string, callback: (lots: ProductionLot[]) => void) => {
  const q = query(collection(db, 'production_lots'), where('ownerId', '==', userId));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const lots: ProductionLot[] = [];
    querySnapshot.forEach((doc) => {
      lots.push({ id: doc.id, ...doc.data() } as ProductionLot);
    });

    callback(lots);
  });

  return unsubscribe;
};