import { RecipeGenerationRequest, GeneratedRecipe } from './openai.service';

export class MockRecipeService {
  static async generateRecipes(request: RecipeGenerationRequest): Promise<GeneratedRecipe[]> {
    const { ingredients, healthCriteria, allergies, userId } = request;
    
    // Générer 7 recettes fictives basées sur les ingrédients
    const recipes: GeneratedRecipe[] = [];
    
    for (let i = 1; i <= 7; i++) {
      const recipe: GeneratedRecipe = {
        id: `mock-${Date.now()}-${i}`,
        titre: `${this.generateTitle(ingredients, i)}`,
        description: `Un délicieux plat préparé avec ${ingredients.join(', ')}`,
        origine: this.getRandomOrigin(),
        tempsPreparation: Math.floor(Math.random() * 60) + 20, // 20-80 minutes
        criteresSante: healthCriteria.length > 0 ? healthCriteria : ['equilibre'],
        allergenes: allergies.length > 0 ? allergies : [],
        ingredientsPrincipaux: ingredients,
        nutritionParPortion: {
          kcal: Math.floor(Math.random() * 400) + 200, // 200-600 kcal
          proteines: Math.floor(Math.random() * 30) + 10, // 10-40g
          glucides: Math.floor(Math.random() * 60) + 20, // 20-80g
          lipides: Math.floor(Math.random() * 20) + 5, // 5-25g
        },
        imageUrl: this.generateImageUrl(ingredients[0], i),
        instructions: this.generateInstructions(ingredients, i),
        genereeParIA: true,
        dateGeneration: new Date().toISOString(),
        utilisateurId: userId
      };
      
      recipes.push(recipe);
    }
    
    return recipes;
  }
  
  private static generateTitle(ingredients: string[], index: number): string {
    const titles = [
      `${ingredients[0]} rôti aux herbes`,
      `${ingredients[0]} et ${ingredients[1]} à la méditerranéenne`,
      `${ingredients[0]} poêlé avec ${ingredients.slice(1, 3).join(' et ')}`,
      `${ingredients[0]} en sauce avec ${ingredients[1]}`,
      `${ingredients[0]} et ${ingredients[1]} du chef`,
      `${ingredients[0]} mijoté aux légumes`,
      `${ingredients[0]} et ${ingredients[1]} exotiques`
    ];
    
    return titles[index - 1] || titles[0];
  }
  
  private static getRandomOrigin(): string {
    const origins = ['française', 'italienne', 'asiatique', 'méditerranéenne', 'mexicaine', 'indienne', 'thai'];
    return origins[Math.floor(Math.random() * origins.length)];
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

    const searchTerm = ingredientMap[mainIngredient] || 'food';
    
    // Utiliser Unsplash pour des images gratuites et de qualité
    const imageUrls = [
      `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop&crop=center&q=80`,
      `https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&crop=center&q=80`,
      `https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop&crop=center&q=80`,
      `https://images.unsplash.com/photo-1504674900244-3d25b3b4d6c7?w=800&h=600&fit=crop&crop=center&q=80`,
      `https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop&crop=center&q=80`,
      `https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&h=600&fit=crop&crop=center&q=80`,
      `https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop&crop=center&q=80`
    ];

    // Retourner une image différente pour chaque recette
    return imageUrls[index - 1] || imageUrls[0];
  }

  private static generateInstructions(ingredients: string[], index: number): string {
    const baseInstructions = [
      `1. Préchauffer le four à 180°C.\n2. Préparer les ${ingredients[0]} et les assaisonner.\n3. Faire cuire les ${ingredients[1]} à la poêle.\n4. Assembler tous les ingrédients et servir chaud.`,
      
      `1. Faire revenir les ${ingredients[0]} dans l'huile d'olive.\n2. Ajouter les ${ingredients.slice(1, 3).join(' et ')} et faire mijoter.\n3. Assaisonner selon vos goûts.\n4. Laisser reposer 5 minutes avant de servir.`,
      
      `1. Couper les ${ingredients[0]} en morceaux.\n2. Faire cuire les ${ingredients[1]} séparément.\n3. Mélanger tous les ingrédients dans un wok.\n4. Ajouter les épices et servir immédiatement.`,
      
      `1. Mariner les ${ingredients[0]} avec les épices.\n2. Faire griller les ${ingredients[1]} au barbecue.\n3. Préparer une sauce avec les ${ingredients.slice(2).join(', ')}.\n4. Assembler et déguster.`,
      
      `1. Faire bouillir les ${ingredients[1]} dans de l'eau salée.\n2. Pendant ce temps, préparer les ${ingredients[0]}.\n3. Mélanger tous les ingrédients.\n4. Ajouter les herbes fraîches et servir.`,
      
      `1. Préparer une marinade pour les ${ingredients[0]}.\n2. Faire cuire les ${ingredients[1]} à la vapeur.\n3. Assembler avec les ${ingredients.slice(2).join(', ')}.\n4. Garnir et servir chaud.`,
      
      `1. Faire revenir les ${ingredients[0]} avec l'ail.\n2. Ajouter les ${ingredients.slice(1).join(', ')} progressivement.\n3. Laisser mijoter à feu doux.\n4. Rectifier l'assaisonnement et servir.`
    ];
    
    return baseInstructions[index - 1] || baseInstructions[0];
  }
}

export default MockRecipeService; 