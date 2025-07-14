import { Request, Response } from 'express';
import { OpenAIService, RecipeGenerationRequest } from '../services/openai.service';
import { MockRecipeService } from '../services/mock-recipe.service';
import { Recipe } from '../models/Recipe';

export class RecipeController {
  static async generateRecipes(req: Request, res: Response) {
    try {
      console.log('Body reçu:', JSON.stringify(req.body, null, 2));
      const { ingredients, userId } = req.body;

      // Validation des données d'entrée
      if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Les ingrédients sont requis et doivent être un tableau non vide'
        });
      }

      if (!userId || userId === 'anonymous') {
        return res.status(400).json({
          success: false,
          message: 'Un utilisateur valide est requis'
        });
      }

      // Rendre les autres champs optionnels avec des valeurs par défaut
      const healthCriteria = req.body.healthCriteria || [];
      const allergies = req.body.allergies || [];
      const timestamp = req.body.timestamp || new Date().toISOString();

      // Préparer la requête pour OpenAI
      const request: RecipeGenerationRequest = {
        ingredients: ingredients,
        healthCriteria: healthCriteria,
        allergies: allergies,
        userId: userId
      };

      // Générer les recettes avec le service mock (temporaire)
      const generatedRecipes = await MockRecipeService.generateRecipes(request);

      return res.status(200).json({
        success: true,
        message: `${generatedRecipes.length} recettes générées avec succès`,
        data: {
          recipes: generatedRecipes,
          totalGenerated: generatedRecipes.length
        }
      });

    } catch (error) {
      console.error('Erreur dans generateRecipes:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la génération des recettes',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

  static async getAllRecipes(req: Request, res: Response) {
    try {
      const recipes = await Recipe.find().sort({ dateGeneration: -1 });
      
      return res.status(200).json({
        success: true,
        data: recipes
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des recettes:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des recettes'
      });
    }
  }

  static async getRecipesByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      
      if (!userId || userId === 'anonymous') {
        return res.status(400).json({
          success: false,
          message: 'ID utilisateur valide requis'
        });
      }

      const recipes = await Recipe.find({ utilisateurId: userId }).sort({ dateGeneration: -1 });
      
      return res.status(200).json({
        success: true,
        data: recipes
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des recettes utilisateur:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des recettes'
      });
    }
  }

  static async getRecipeById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const recipe = await Recipe.findById(id);
      
      if (!recipe) {
        return res.status(404).json({
          success: false,
          message: 'Recette non trouvée'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: recipe
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de la recette:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de la recette'
      });
    }
  }
}

export default RecipeController; 