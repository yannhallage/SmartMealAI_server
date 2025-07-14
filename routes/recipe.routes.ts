import { Router } from 'express';
import { RecipeController } from '../controllers/recipe.controller';

const router = Router();

// Route pour générer des recettes avec OpenAI
router.post('/generate', RecipeController.generateRecipes);

// Route pour récupérer toutes les recettes
router.get('/', RecipeController.getAllRecipes);

// Route pour récupérer les recettes d'un utilisateur spécifique
router.get('/user/:userId', RecipeController.getRecipesByUser);

// Route pour récupérer une recette par son ID
router.get('/:id', RecipeController.getRecipeById);

export default router; 