import MagicModel from "../models/magic.model.js";

class MagicController {
    async register (req, res) {
        try {
            const { name, description } = req.body;

            if (!name || !description) {
                return res.status(400).json({ error: 'Required fields are missing' });
            }

            const existingMagic = await MagicModel.findByName(name);
            if (existingMagic) {
                return res.status(409).json({ error: 'There is already a magic with that name' });
            }

            const { insertId } = await MagicModel.create({name, description});

            return res.status(201).json({
                message: 'Magic Created Successfully',
                data: {
                    id: insertId,
                    name,
                    description
                }
            })
        } catch (error) {
            console.log('Error in MagicController.register:', error);
            return res.status(500).json({ error: 'Internal Server Error'})
        }
    }

    async show (req, res) {
        try {
            const existingMagics = await MagicModel.show();
            if (existingMagics.length === 0) {
                return res.status(200).json({ error: 'No magics found' });
            }

            return res.status(200).json({
                message: 'Magics Obtained Successfully',
                data: existingMagics
            });
        } catch (error) {
            console.log('Error in MagicController.show:', error);
            return res.status(500).json({ error: 'Internal Server Error'});
        }
    }

    async update (req, res) {
        try {
            const { name, description } = req.body;
            const id = req.params.id;

            if (!name || !description || !id || isNaN(id)) {
                return res.status(400).json({ error: 'Required fields are missing' });
            }

            const existingMagic = await MagicModel.findById(id);
            if (!existingMagic) {
                return res.status(404).json({ error: 'Magic not found' });
            }

            const existingMagicName = await MagicModel.findByName(name);
            if (existingMagicName && existingMagicName.id !== parseInt(id)) {
                return res.status(400).json({ error: 'There is already a magic with that name'});
            }

            if (existingMagic.name === name && existingMagic.description === description) {
                return res.status(200).json({
                    message: 'No changes detected',
                    data: existingMagic
                });
            }

            const updatedMagic = await MagicModel.update(id, {name, description});
            
            return res.status(200).json({
                message: 'Magic Updated Successfully',
                data: updatedMagic
            });
        } catch (error) {
            console.log('Error in MagicController.update:', error);
            return res.status(500).json({ error: 'Internal Server Error'});
        }
    }

    async delete (req, res) {
        try {
            const id = req.params.id;

            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'The ID parameter is required and must be a number'});
            }

            const existingMagic = await MagicModel.findById(id);
            if (!existingMagic) {
                return res.status(404).json({ error: 'Magic not found'});
            }

            const deletedId = await MagicModel.delete(id);

            return res.status(200).json(deletedId);
        } catch (error) {
            console.log('Error in MagicController.delete:', error);
            return res.status(500).json({ error: 'Internal Server Error'});
        }
    }

    async findById (req, res) {
        try {
            const id = req.params.id;

            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'The ID parameter is required and must be a number'});
            }

            const existingMagic = await MagicModel.findById(id);
            if (!existingMagic) {
                return res.status(409).json({ error: 'Magic not found'});
            }

            return res.status(200).json({
                message: 'Magic Found Successfully',
                data: existingMagic
            });
        } catch (error) {
            console.log('Error in MagicController.findById:', error);
            return res.status(500).json({ error: 'Internal Server Error'});
        }
    }
}

export default new MagicController();