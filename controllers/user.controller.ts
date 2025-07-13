import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const SECRET = process.env.JWT_SECRET || 'secret';

export const register = async (req: Request, res: Response) => {
  const { nom_complet, email, motdepasse } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email déjà utilisé' });
    const hash = await bcrypt.hash(motdepasse, 10);
    const user = await User.create({ nom_complet, email, motdepasse: hash });
    console.log(user);
    res.status(201).json({ message: 'Utilisateur créé', user: { nom_complet, email, date_de_creation: user.date_de_creation } });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, motdepasse } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Email ou mot de passe invalide' });
    const valid = await bcrypt.compare(motdepasse, user.motdepasse);
    if (!valid) return res.status(400).json({ error: 'Email ou mot de passe invalide' });
    const token = jwt.sign({ id: user._id, email: user.email }, SECRET, { expiresIn: '7d' });
    res.json({ token, nom_complet: user.nom_complet });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const profile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select('-motdepasse');
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}; 