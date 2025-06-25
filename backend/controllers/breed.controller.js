import BreedModel from '../models/breed.model.js';

class BreedController {
    async register (req, res) {
        try {
            const { name, description, resistance } = req.body;

            if (!name || !description || !resistance) {
                return res.status(400).json({ error: 'Required fields are missing' });
            }

            const existingBreed = await BreedModel.findByName(name);
            if (existingBreed) {
                return res.status(409).json({ error: 'There is already a breed with that name' });
            }

            const { insertId } = await BreedModel.create({name, description, resistance});

            return res.status(201).json({
                message: 'Breed Created Successfully',
                data: {
                    id: insertId,
                    name,
                    description,
                    resistance
                }
            });
        } catch (error) {
            console.log('Error in BreedController.register:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async show (req, res) {
        try {
            const existingBreeds = await BreedModel.show();
            if (existingBreeds.length === 0) {
                return res.status(400).json({ error: 'No breeds found'})
            }

            return res.status(200).json({
                message: 'Breeds obtained Successfully',
                data: existingBreeds
            })
        } catch (error) {
            console.log('Error in BreedController.show:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async update (req, res) {
        try {
            const { name, description, resistance } = req.body;
            const id = req.params.id;

            if (!name || !description || !resistance || !id || isNaN(id)) {
                return res.status(400).json({ error: 'Required fields are missing' });
            }

            const existingBreed = await BreedModel.findById(id);
            if (!existingBreed) {
                return res.status(409).json({ error: 'There is not breed'});
            }

            const existingBreedName = await BreedModel.findByName(name);
            if (existingBreedName && existingBreedName.id !== parseInt(id)) {
                return res.status(400).json({ error: 'There is already a breed with that name'});
            }

            if (existingBreed.name === name && existingBreed.description === description && existingBreed.resistance === resistance) {
                return res.status(200).json({
                    message: 'No changes detected',
                    data: existingBreed
                });
            }
            
            const updateBreed = await BreedModel.update(id, {name, description, resistance});

            return res.status(200).json({
                message: 'Breed updated successfully',
                data: updateBreed
            });
        } catch (error) {
            console.log('Error in BreedController.update:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async delete (req, res) {
        try {
            const id = req.params.id;

            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'The ID parameter is required and must be a number' });
            }

            const existingBreed = await BreedModel.findById(id);
            if (!existingBreed) {
                return res.status(409).json({ error: 'Breed not found' });
            }

            const deleteBreed = await BreedModel.delete(id);

            return res.status(200).json(deleteBreed);
        } catch (error) {
            console.log('Error in BreedController.delete:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async findById (req, res) {
        try {
            const id = req.params.id;

            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'The ID parameter is required and must be a number'});
            }

            const existingBreed = await BreedModel.findById(id);
            if (!existingBreed) {
                return res.status(409).json({ error: 'Breed not found' });
            }

            return res.status(200).json({
                message: 'Breed found successfully',
                data: existingBreed
            });
        } catch (error) {
            console.log('Error in BreedController.findById:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default new BreedController();