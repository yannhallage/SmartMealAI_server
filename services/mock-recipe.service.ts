import { RecipeGenerationRequest, GeneratedRecipe } from './openai.service';

export class MockRecipeService {
  static async generateRecipes(request: RecipeGenerationRequest): Promise<GeneratedRecipe[]> {
    const { ingredients, healthCriteria, allergies, userId } = request;
    
    // Générer 7 recettes fictives basées sur les ingrédients
    const recipes: GeneratedRecipe[] = [];
    
    for (let i = 1; i <= 7; i++) {
      const recipe: GeneratedRecipe = {
        id: `mock-${Date.now()}-${i}`,
        titre: `${this.generateRandomTitle(ingredients)}`,
        description: `${this.generateRandomDescription(ingredients)}`,
        origine: this.getRandomOrigin(),
        tempsPreparation: Math.floor(Math.random() * 60) + 20, // 20-80 minutes
        criteresSante: healthCriteria.length > 0 ? this.shuffleArray(healthCriteria).slice(0, Math.max(1, Math.floor(Math.random() * healthCriteria.length))) : [this.getRandomHealthCriteria()],
        allergenes: allergies.length > 0 ? this.shuffleArray(allergies).slice(0, Math.floor(Math.random() * allergies.length)) : [],
        ingredientsPrincipaux: this.shuffleArray(ingredients).slice(0, Math.max(2, Math.floor(Math.random() * ingredients.length) + 1)),
        nutritionParPortion: {
          kcal: Math.floor(Math.random() * 400) + 200, // 200-600 kcal
          proteines: Math.floor(Math.random() * 30) + 10, // 10-40g
          glucides: Math.floor(Math.random() * 60) + 20, // 20-80g
          lipides: Math.floor(Math.random() * 20) + 5, // 5-25g
        },
        imageUrl: this.generateImageUrl(ingredients[0], i),
        instructions: this.generateRandomInstructions(ingredients),
        genereeParIA: true,
        dateGeneration: new Date().toISOString(),
        utilisateurId: userId
      };
      
      recipes.push(recipe);
    }
    
    return recipes;
  }
  
  // Génère un titre aléatoire et varié à partir de fragments
  private static generateRandomTitle(ingredients: string[]): string {
    const styles = ['Délice', 'Saveur', 'Mijoté', 'Poêlée', 'Création', 'Fusion', 'Spécialité', 'Plat signature', 'Gourmandise', 'Inspiration'];
    const forms = ['du chef', 'maison', 'exotique', 'traditionnelle', 'moderne', 'express', 'raffinée', 'familiale', 'originale', 'surprise'];
    const main = ingredients.length > 0 ? ingredients[Math.floor(Math.random() * ingredients.length)] : 'Légumes';
    // Ajout d'un mot d'action ou d'un adjectif pour plus de variété
    const actions = ['croustillant', 'fondant', 'épicé', 'crémeux', 'coloré', 'parfumé', 'généreux', 'léger', 'festif', 'rustique'];
    return `${styles[Math.floor(Math.random() * styles.length)]} ${actions[Math.floor(Math.random() * actions.length)]} de ${main} ${forms[Math.floor(Math.random() * forms.length)]}`;
  }

  // Génère une description dynamique à partir de fragments
  private static generateRandomDescription(ingredients: string[]): string {
    const intro = [
      'Découvrez',
      'Savourez',
      'Laissez-vous tenter par',
      'Essayez',
      'Appréciez',
      'Goûtez à',
      'Succombez à',
      'Préparez',
      'Réalisez',
      'Testez'
    ];
    const qualite = [
      'une recette originale',
      'un plat équilibré',
      'une création gourmande',
      'une spécialité maison',
      'un mélange surprenant',
      'une alliance de saveurs',
      'une explosion de goûts',
      'un classique revisité',
      'une expérience culinaire',
      'un festin coloré'
    ];
    const fin = [
      `autour de ${ingredients.join(', ')}`,
      `avec une touche de ${ingredients[Math.floor(Math.random() * ingredients.length)] || 'créativité'}`,
      `pour éveiller vos papilles`,
      `qui ravira toute la famille`,
      `à partager entre amis`,
      `pour un repas convivial`,
      `à déguster sans modération`,
      `pour un plaisir sain et gourmand`,
      `qui met à l'honneur les produits frais`,
      `à savourer en toute saison`
    ];
    return `${intro[Math.floor(Math.random() * intro.length)]} ${qualite[Math.floor(Math.random() * qualite.length)]} ${fin[Math.floor(Math.random() * fin.length)]}.`;
  }

  // Génère des instructions dynamiques à partir de fragments
  private static generateRandomInstructions(ingredients: string[]): string {
    const etapes = [
      (ings: string[]) => `Préchauffez votre four à 180°C pour une cuisson parfaite.`,
      (ings: string[]) => `Émincez finement les ${ings[0] || 'légumes'} pour plus de saveur.`,
      (ings: string[]) => `Faites revenir les ${ings[1] || 'ingrédients'} dans un filet d'huile d'olive.`,
      (ings: string[]) => `Ajoutez ${ings[2] || 'vos épices préférées'} et laissez mijoter doucement.`,
      (ings: string[]) => `Mélangez délicatement tous les ingrédients pour une texture homogène.`,
      (ings: string[]) => `Rectifiez l'assaisonnement selon votre goût avant de servir.`,
      (ings: string[]) => `Servez chaud, décoré de quelques herbes fraîches.`,
      (ings: string[]) => `Laissez reposer quelques minutes avant dégustation.`,
      (ings: string[]) => `Disposez joliment dans l'assiette pour un effet visuel réussi.`,
      (ings: string[]) => `Accompagnez ce plat d'une salade de saison pour plus de fraîcheur.`
    ];
    // Sélectionner 4 à 6 étapes différentes et les assembler
    const nbEtapes = Math.floor(Math.random() * 3) + 4;
    const shuffled = this.shuffleArray(etapes).slice(0, nbEtapes);
    return shuffled.map((fn, idx) => `${idx + 1}. ${fn(ingredients)}`).join('\n');
  }

  // Ajoute l'origine africaine
  private static getRandomOrigin(): string {
    const origins = ['française', 'italienne', 'asiatique', 'méditerranéenne', 'mexicaine', 'indienne', 'thai', 'africaine'];
    return origins[Math.floor(Math.random() * origins.length)];
  }

  // Critères santé variés par défaut
  private static getRandomHealthCriteria(): string {
    const criteres = ['équilibre', 'riche en fibres', 'pauvre en sel', 'sans gluten', 'faible en sucre', 'végétarien', 'protéiné', 'léger'];
    return criteres[Math.floor(Math.random() * criteres.length)];
  }

  // Mélange un tableau (Fisher-Yates)
  private static shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  
  private static generateImageUrl(mainIngredient: string, index: number): string {
    // Mapping des ingrédients vers des termes de recherche pour les images
    const ingredientMap: { [key: string]: string } = {
      'Poulet': 'chicken',
      'Riz': 'rice',
      'Oignons': 'onion',
      'Tomates': 'tomato',
      'Carottes': 'carrot',
      'Pommes de terre': 'potato',
      'Ail': 'garlic',
      'Poivrons': 'bell pepper',
      'Aubergines': 'eggplant',
      'Lentilles': 'lentils',
      'Quinoa': 'quinoa',
      'Épinards': 'spinach',
      'Brocoli': 'broccoli',
      'Saumon': 'salmon',
      'Pâtes': 'pasta',
      'Basilic': 'basil',
      'Huile d\'olive': 'olive oil',
      'Parmesan': 'parmesan'
    };

    const searchTerm = ingredientMap[mainIngredient] || '';
    const imageUrls = [
      `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop&crop=center&q=80`,
      `https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&crop=center&q=80`,
      `https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop&crop=center&q=80`,
      `https://images.unsplash.com/photo-1504674900244-3d25b3b4d6c7?w=800&h=600&fit=crop&crop=center&q=80`,
      `https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop&crop=center&q=80`,
      `https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&h=600&fit=crop&crop=center&q=80`,
      `https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop&crop=center&q=80`
    ];

    // Si aucun ingrédient ou pas de correspondance, retourner une image par défaut différente selon l'index
    if (!mainIngredient || !searchTerm) {
      return imageUrls[(index - 1) % imageUrls.length];
    }

    // Sinon, retourner une image correspondant à l'index (pour la variété)
    return imageUrls[(index - 1) % imageUrls.length];
  }
}

export default MockRecipeService; 