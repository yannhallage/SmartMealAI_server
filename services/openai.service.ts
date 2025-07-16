import { config } from '../config/openai';

export interface RecipeGenerationRequest {
  ingredients: string[];
  healthCriteria: string[];
  allergies: string[];
  userId: string;
}

export interface GeneratedRecipe {
  id: string;
  titre: string;
  description: string;
  origine: string;
  tempsPreparation: number;
  criteresSante: string[];
  allergenes: string[];
  ingredientsPrincipaux: string[];
  nutritionParPortion: {
    kcal: number;
    proteines: number;
    glucides: number;
    lipides: number;
  };
  imageUrl: string;
  instructions: string;
  genereeParIA: boolean;
  dateGeneration: string;
  utilisateurId: string;
}

export class OpenAIService {
  static async generateRecipes(request: RecipeGenerationRequest): Promise<GeneratedRecipe[]> {
    try {
      const { ingredients, healthCriteria, allergies, userId } = request;

      const prompt = `
Tu es un assistant IA expert en nutrition et cuisine.

À partir des ingrédients suivants :
${ingredients.join(', ')}

Critères santé à respecter : ${healthCriteria.length ? healthCriteria.join(', ') : 'aucun'}
Allergènes à éviter : ${allergies.length ? allergies.join(', ') : 'aucun'}

Génère exactement 7 recettes.
Chaque recette doit être retournée **sous forme d'un objet JSON** respectant **cette structure** :

{
  "id": "uuid généré",
  "titre": "Titre de la recette",
  "description": "Brève description du plat",
  "origine": "Nom de l'origine culturelle (ex: asiatique, italienne...)",
  "tempsPreparation": nombre entier en minutes,

  "criteresSante": [array de string],
  "allergenes": [array de string],
  "ingredientsPrincipaux": [array de string],

  "nutritionParPortion": {
    "kcal": nombre,
    "proteines": nombre,
    "glucides": nombre,
    "lipides": nombre
  },

  "imageUrl": "lien d'image fictif ou texte alternatif (pas de vrai lien nécessaire)",
  "instructions": "texte avec étapes de préparation (1 à 5 étapes)",
  "genereeParIA": true,
  "dateGeneration": "ISO date string (génère une date actuelle)",
  "utilisateurId": "${userId}"
}

Retourne un **tableau JSON** de 7 recettes comme celui-ci :
[
  { ... },
  { ... },
  ...
]

Consignes importantes pour chaque recette :
- Utilise un vocabulaire varié pour les titres, descriptions, instructions et ingrédients.
- Évite de répéter les mêmes mots ou expressions d'une recette à l'autre.
- Varie les styles culinaires, origines culturelles, et types de plats.
- Les recettes doivent être originales et créatives.
- Privilégie la diversité dans la formulation et la présentation.

Ne retourne rien d'autre que le tableau JSON (aucune phrase autour).
Langue : Français.
`;

      const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 4000,
            temperature: 0.7,
            do_sample: true,
            return_full_text: false
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur Hugging Face: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as any;
      const responseText = data[0]?.generated_text || data[0]?.text || '';
      
      if (!responseText) {
        throw new Error('Aucune réponse reçue de Hugging Face');
      }

      // Nettoyer la réponse pour extraire le JSON
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Format de réponse invalide - JSON attendu');
      }

      const recipes: GeneratedRecipe[] = JSON.parse(jsonMatch[0]);
      
      // Validation basique
      if (!Array.isArray(recipes) || recipes.length !== 7) {
        throw new Error('Nombre de recettes incorrect - 7 recettes attendues');
      }

      return recipes;

    } catch (error) {
      console.error('Erreur lors de la génération de recettes:', error);
      throw new Error(`Erreur lors de la génération de recettes: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }
}

export default OpenAIService; 