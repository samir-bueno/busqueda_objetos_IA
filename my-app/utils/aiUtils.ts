import Constants from "expo-constants";
import type { GameObject } from "@/types/game";

// Token de Hugging Face
const HUGGING_FACE_TOKEN = Constants.expoConfig?.extra?.huggingFaceToken ?? "";

// URL del modelo en Hugging Face que acepta imagen binaria
const MODEL_URL = "https://api-inference.huggingface.co/models/facebook/deit-base-distilled-patch16-224";

export const analyzeImageWithAI = async (base64Image: string): Promise<string[]> => {
  if (!HUGGING_FACE_TOKEN) {
    throw new Error(
      "El token de Hugging Face no está definido. Revisa tu variable de entorno HUGGING_FACE_TOKEN."
    );
  }

  try {
    const cleanBase64 = base64Image.startsWith("data:")
      ? base64Image.split(",")[1]
      : base64Image;

    const binaryImage = Uint8Array.from(atob(cleanBase64), (c) => c.charCodeAt(0));

    const response = await fetch(MODEL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HUGGING_FACE_TOKEN}`,
        "Content-Type": "application/octet-stream",
      },
      body: binaryImage,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (Array.isArray(result) && result.length > 0) {
      return result.map((item: any) => item.label.toLowerCase());
    }

    return [];
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};

/**
 * Mapa de sinónimos para cada objeto del juego.
 * La clave es el nombre oficial (en español) y el valor es un array con sinónimos y palabras clave en inglés o español.
 */
const SYNONYMS_MAP: Record<string, string[]> = {
  "manzana": ["apple", "fruit", "red", "manzana"],
  "lápiz": ["pencil", "pen", "writing", "lapiz"],
  "gafas": ["glasses", "eyewear", "spectacles", "sunglasses", "gafas"],
  "botella": ["bottle", "water", "drink", "botella"],
  "zapatilla": ["shoe", "sneaker", "footwear", "boot", "zapatilla"],
  "planta": ["plant", "flower", "leaf", "green", "planta"],
  "libro": ["book", "notebook", "reading", "libro"],
  "taza": ["cup", "mug", "coffee", "tea", "taza"],
  "silla": ["chair", "seat", "silla"],
  "mochila": ["backpack", "bag", "mochila"],
  "teléfono": ["phone", "mobile", "smartphone", "cellphone", "telefono", "teléfono"],
  "regla": ["ruler", "measuring", "scale", "regla"],
  "cuaderno": ["notebook", "journal", "writing", "cuaderno"],
  "peluche": ["teddy", "plush", "stuffed", "toy", "peluche"],
  "pizarra": ["whiteboard", "blackboard", "board", "pizarra"],
  "mouse": ["mouse", "computer", "click", "ratón"],
  "teclado": ["keyboard", "computer", "typing", "teclado"],
  "juguete": ["toy", "play", "juguete"],
  "lámpara": ["lamp", "light", "bulb", "lámpara"],
};

/**
 * Busca un objeto del juego que coincida con alguna etiqueta detectada por la IA.
 * @param detectedLabels Array de etiquetas detectadas (todo en minúsculas).
 * @param gameObjects Lista de objetos del juego (con propiedad 'found' para saber si ya se encontraron).
 * @returns El objeto encontrado o null si no hay coincidencias.
 */
export const findMatchingObject = (detectedLabels: string[], gameObjects: GameObject[]): GameObject | null => {
  const unFoundObjects = gameObjects.filter((obj) => !obj.found);

  for (const obj of unFoundObjects) {
    const objectName = obj.name.toLowerCase();

    // Obtener sinónimos del objeto o usar el nombre oficial si no hay sinónimos definidos
    const synonyms = SYNONYMS_MAP[objectName] ?? [objectName];

    // Chequear si alguna etiqueta detectada coincide con alguno de los sinónimos
    const hasMatch = detectedLabels.some((label) =>
      synonyms.some((syn) => label.includes(syn) || syn.includes(label))
    );

    if (hasMatch) {
      return obj;
    }
  }

  return null;
};