import WarriorModel from '../models/warrior.model.js';

class WarriorController {
    async register(req, res) {
        try {
            const DEFAULT_PHOTO = 'backend/data/uploads/imagen_default.png';

            const { name, life, intelligence, energy, breed_fk, magic_fk, typeWarrior_fk } = req.body;

            if (!name || !life || !intelligence || !energy || !breed_fk || !magic_fk || !typeWarrior_fk) {
                console.log(name, life, intelligence, energy, breed_fk, magic_fk, typeWarrior_fk);
                return res.status(400).json({ error: 'Required fields are missing' });
            }

            const photo = req.file ? `backend/data/uploads/${req.file.filename}` : DEFAULT_PHOTO;

            const existingWarrior = await WarriorModel.findByName(name);
            if (existingWarrior) {
                return res.status(409).json({ error: 'There is already a warrior with that name' });
            }

            const { insertId } = await WarriorModel.create({ name, life, intelligence, energy, photo, breed_fk, magic_fk, typeWarrior_fk });

            return res.status(201).json({
                message: 'Warrior Created Successfully',
                data: {
                    id: insertId,
                    name,
                    life,
                    intelligence,
                    energy,
                    photo,
                    breed_fk,
                    magic_fk,
                    typeWarrior_fk
                }
            });
        } catch (error) {
            console.log('Error in WarriorController.register:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async show(req, res) {
        try {
            const existingWarriors = await WarriorModel.show();
            if (existingWarriors.length === 0) {
                return res.status(400).json({ error: 'No warriors found' })
            }

            return res.status(200).json({
                message: 'Warriors obtained Successfully',
                data: existingWarriors
            })
        } catch (error) {
            console.log('Error in WarriorController.show:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async update(req, res) {
        try {
            const { name, life, intelligence, energy, breed_fk, magic_fk, typeWarrior_fk } = req.body;
            const id = req.params.id;

            if (!name || !life || !intelligence || !energy || !breed_fk || !magic_fk || !typeWarrior_fk || !id || isNaN(id)) {
                return res.status(400).json({ error: 'Required fields are missing' });
            }

            const existingWarrior = await WarriorModel.findById(id);
            if (!existingWarrior) {
                return res.status(409).json({ error: 'Warrior not found' });
            }
            const photo = req.file ? `backend/data/uploads/${req.file.filename}` : existingWarrior.photo;

            const existingWarriorName = await WarriorModel.findByName(name);
            if (existingWarriorName && existingWarriorName.id !== parseInt(id)) {
                return res.status(400).json({ error: 'There is already a warrior with that name' });
            }

            if (existingWarrior.name === name && existingWarrior.life === Number(life) && existingWarrior.intelligence === Number(intelligence) && existingWarrior.energy === Number(energy) && existingWarrior.photo === photo && existingWarrior.breed_fk === Number(breed_fk) && existingWarrior.magic_fk === Number(magic_fk) && existingWarrior.typeWarrior_fk === Number(typeWarrior_fk)) {
                return res.status(200).json({
                    message: 'No changes detected',
                    data: existingWarrior
                });
            }

            const updatedWarrior = await WarriorModel.update(id, { name, life, intelligence, energy, photo, breed_fk, magic_fk, typeWarrior_fk });

            return res.status(200).json({
                message: 'Warrior updated successfully',
                data: updatedWarrior
            });
        } catch (error) {
            console.log('Error in WarriorController.update:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async delete(req, res) {
        try {
            const id = req.params.id;

            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'The ID parameter is required and must be a number' });
            }

            const existingWarrior = await WarriorModel.findById(id);
            if (!existingWarrior) {
                return res.status(409).json({ error: 'Warrior not found' });
            }

            const deleteWarrior = await WarriorModel.delete(id);

            return res.status(200).json(deleteWarrior);
        } catch (error) {
            console.log('Error in WarriorController.delete:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async findById(req, res) {
        try {
            const id = req.params.id;

            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'The ID parameter is required and must be a number' });
            }

            const existingWarrior = await WarriorModel.findById(id);
            if (!existingWarrior) {
                return res.status(409).json({ error: 'Warrior not found' });
            }

            return res.status(200).json({
                message: 'Warrior found successfully',
                data: existingWarrior
            });
        } catch (error) {
            console.log('Error in WarriorController.findById:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default new WarriorController();