import TypeWarriorModel from "../models/typeWarrior.model.js";

class TypeWarriorController {
    async register(req, res) {
        try {
            const { name, description } = req.body;

            if (!name || !description) {
                return res.status(400).json({ error: 'Required fields are missing' });
            }

            const existingTypeWarrior = await TypeWarriorModel.findByName(name);
            if (existingTypeWarrior) {
                return res.status(409).json({ error: 'There is already a TypeWarrior with that name' });
            }

            const { insertId } = await TypeWarriorModel.create({ name, description });

            return res.status(201).json({
                message: 'TypeWarrior Created Successfully',
                data: {
                    id: insertId,
                    name,
                    description
                }
            });
        } catch (error) {
            console.log('Error in TypeWarriorController.register:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async show(req, res) {
        try {
            const existingTypeWarriors = await TypeWarriorModel.show();
            if (existingTypeWarriors.length === 0) {
                return res.status(400).json({ error: 'No TypeWarriors found' });
            }

            return res.status(200).json({
                message: 'TypeWarriors Obtained Successfully',
                data: existingTypeWarriors
            });
        } catch (error) {
            console.log('Error in TypeWarriorController.show:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async update(req, res) {
        try {
            const { name, description } = req.body;
            const id = req.params.id;

            if (!name || !description || !id || isNaN(id)) {
                return res.status(400).json({ error: 'Required Fields Are Missing' });
            }

            const existingTypeWarrior = await TypeWarriorModel.findById(id);
            if (!existingTypeWarrior) {
                return res.status(404).json({ error: 'TypeWarrior Not Found' });
            }

            const existingTypeWarriorName = await TypeWarriorModel.findByName(name);
            if (existingTypeWarriorName && existingTypeWarriorName.id !== parseInt(id)) {
                return res.status(400).json({ error: 'There is already a TypeWarrior with that name' });
            }

            if (existingTypeWarrior.name === name && existingTypeWarrior.description === description) {
                return res.status(200).json({
                    message: 'No Changes Detected',
                    data: existingTypeWarrior
                });
            }

            const updatedTypeWarrior = await TypeWarriorModel.update(id, { name, description });

            return res.status(200).json({
                message: 'TypeWarrior Updated Successfully',
                data: updatedTypeWarrior
            })
        } catch (error) {
            console.log('Error in TypeWarriorController.update:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async delete(req, res) {
        try {
            const id = req.params.id;

            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'The ID parameter is required and must be a number' });
            }

            const existingTypeWarrior = await TypeWarriorModel.findById(id);
            if (!existingTypeWarrior) {
                return res.status(409).json({ error: 'TypeWarrior not found' });
            }

            const deletedId = await TypeWarriorModel.delete(id);

            return res.status(200).json( deletedId );
        } catch (error) {
            console.log('Error in TypeWarriorController.delete:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async findById(req, res) {
        try {
            const id = req.params.id;

            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'The ID is parameter required and must be a number' });
            }

            const existingTypeWarrior = await TypeWarriorModel.findById(id);
            if (!existingTypeWarrior) {
                return res.status(404).json({ error: 'Type Warrior not found' });
            }

            return res.status(200).json({
                message: 'TypeWarrior Found Successfully',
                data: existingTypeWarrior
            })
        } catch (error) {
            console.log('Error in TypeWarriorController.findById:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default new TypeWarriorController();