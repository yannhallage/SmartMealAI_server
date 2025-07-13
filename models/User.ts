import mongoose, { Document, Schema } from 'mongoose';

export interface IUtilisateur extends Document {
  nom_complet: string;
  email: string;
  motdepasse: string;
  date_de_creation: Date;
}

const UtilisateurSchema: Schema = new Schema({
  nom_complet: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  motdepasse: { type: String, required: true },
  date_de_creation: { type: Date, default: Date.now }
});

export default mongoose.model<IUtilisateur>('smartmealai', UtilisateurSchema); 