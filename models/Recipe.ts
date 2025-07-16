import mongoose, { Document, Schema, Types } from 'mongoose';

// Interface TypeScript pour Recipe
export interface IRecipe extends Document {
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
  dateGeneration: Date;
  utilisateurId: string | Types.ObjectId;
}

// Schéma Mongoose pour Recipe
const RecipeSchema = new Schema<IRecipe>({
  titre: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
    maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    trim: true,
    maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
  },
  origine: {
    type: String,
    required: [true, 'L\'origine est requise'],
    trim: true,
    maxlength: [50, 'L\'origine ne peut pas dépasser 50 caractères']
  },
  tempsPreparation: {
    type: Number,
    required: [true, 'Le temps de préparation est requis'],
    min: [1, 'Le temps de préparation doit être d\'au moins 1 minute'],
    max: [1440, 'Le temps de préparation ne peut pas dépasser 24 heures']
  },
  criteresSante: [{
    type: String,
    trim: true,
    enum: {
      values: [
        'vegetarien',
        'vegan',
        'sansGluten',
        'sansLactose',
        'faibleCalories',
        'richeEnProteines',
        'sansSucre',
        'bio',
        'sansAllergenes'
      ],
      message: 'Critère de santé invalide'
    },
    required: false
  }],
  allergenes: [{
    type: String,
    trim: true,
    enum: {
      values: [
        'gluten',
        'lactose',
        'oeufs',
        'arachides',
        'noix',
        'soja',
        'poissons',
        'crustaces',
        'mollusques',
        'celeri',
        'moutarde',
        'grainesSesame',
        'sulfites',
        'lupin'
      ],
      message: 'Allergène invalide'
    },
    required: false
  }],
  ingredientsPrincipaux: [{
    type: String,
    required: [true, 'Au moins un ingrédient principal est requis'],
    trim: true,
    maxlength: [100, 'Un ingrédient ne peut pas dépasser 100 caractères']
  }],
  nutritionParPortion: {
    kcal: {
      type: Number,
      required: [true, 'Les calories sont requises'],
      min: [0, 'Les calories ne peuvent pas être négatives'],
      max: [2000, 'Les calories ne peuvent pas dépasser 2000 par portion']
    },
    proteines: {
      type: Number,
      required: [true, 'Les protéines sont requises'],
      min: [0, 'Les protéines ne peuvent pas être négatives'],
      max: [100, 'Les protéines ne peuvent pas dépasser 100g par portion']
    },
    glucides: {
      type: Number,
      required: [true, 'Les glucides sont requis'],
      min: [0, 'Les glucides ne peuvent pas être négatifs'],
      max: [300, 'Les glucides ne peuvent pas dépasser 300g par portion']
    },
    lipides: {
      type: Number,
      required: [true, 'Les lipides sont requis'],
      min: [0, 'Les lipides ne peuvent pas être négatifs'],
      max: [100, 'Les lipides ne peuvent pas dépasser 100g par portion']
    }
  },
  imageUrl: {
    type: String,
    required: [true, 'L\'URL de l\'image est requise'],
    trim: true,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'L\'URL de l\'image doit être une URL valide'
    }
  },
  instructions: {
    type: String,
    required: [true, 'Les instructions sont requises'],
    trim: true,
    maxlength: [2000, 'Les instructions ne peuvent pas dépasser 2000 caractères']
  },
  genereeParIA: {
    type: Boolean,
    default: false
  },
  dateGeneration: {
    type: Date,
    default: Date.now
  },
  utilisateurId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'ID de l\'utilisateur est requis']
  }
}, {
  timestamps: true, // Ajoute automatiquement createdAt et updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour améliorer les performances des requêtes
RecipeSchema.index({ titre: 'text', description: 'text' });
RecipeSchema.index({ utilisateurId: 1 });
RecipeSchema.index({ dateGeneration: -1 });
RecipeSchema.index({ criteresSante: 1 });
RecipeSchema.index({ allergenes: 1 });

// Méthodes virtuelles
RecipeSchema.virtual('tempsPreparationMinutes').get(function(this: any) {
  return this.tempsPreparation;
});

RecipeSchema.virtual('tempsPreparationHeures').get(function(this: any) {
  return Math.floor(this.tempsPreparation / 60);
});

// Méthodes statiques
RecipeSchema.statics.findByCriteresSante = function(criteres: string[]) {
  return this.find({ criteresSante: { $in: criteres } });
};

RecipeSchema.statics.findSansAllergenes = function(allergenes: string[]) {
  return this.find({ allergenes: { $nin: allergenes } });
};

// Méthodes d'instance
RecipeSchema.methods.getNutritionTotale = function() {
  return {
    kcal: this.nutritionParPortion.kcal,
    proteines: this.nutritionParPortion.proteines,
    glucides: this.nutritionParPortion.glucides,
    lipides: this.nutritionParPortion.lipides
  };
};

// Middleware pre-save pour validation supplémentaire
RecipeSchema.pre('save', function(this: any, next) {
  // Vérifier que les critères de santé et allergènes ne sont pas vides si fournis
  if (this.criteresSante && this.criteresSante.length === 0) {
    this.criteresSante = undefined;
  }
  if (this.allergenes && this.allergenes.length === 0) {
    this.allergenes = undefined;
  }
  next();
});

// Export du modèle
export const Recipe = mongoose.model<IRecipe>('Recipe', RecipeSchema);

export default Recipe; 