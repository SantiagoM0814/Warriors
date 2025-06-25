import PowerModel from '../models/power.model.js';

class PowerController {
    
    async register (req, res) {
        try {
            const { name, damage, energy, effect } = req.body;

            if (!name || !damage || !energy || !effect) {
                return res.status(400).json({ error: 'Required fields are missing' });
            }

            const existingPower = await PowerModel.findByName(name);
            if (existingPower) {
                return res.status(409).json({ error: 'There is already a power with that name' });
            }

            const { insertId } = await PowerModel.create({ name, damage, energy, effect });

            return res.status(201).json({
                message: 'Power created succesfully',
                data: {
                    id: insertId,
                    name,
                    damage,
                    energy,
                    effect
                }
            });
        } catch (error) {
            console.log('Error in PowerController.register:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async show (req, res) {
        try {
            const existingPowers = await PowerModel.show();
            if (existingPowers.length === 0) {
                return res.status(400).json({ error: 'No powers found'})
            }

            return res.status(200).json({
                message: 'Powers obtained Successfully',
                data: existingPowers
            });
        } catch (error) { 
            console.log('Error in PowerController.show:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async update (req, res) {
        try {
            const { name, damage, energy, effect } = req.body;
            const id = req.params.id;

            if  (!name || !damage || !energy || !effect || !id || isNaN(id)) {
                return res.status(400).json({ error: 'Required fields are missing' });
            }

            const existingPower = await PowerModel.findById(id);
            if (!existingPower) {
                return res.status(404).json({ error: 'Power not found'});
            }

            const existingPowerName = await PowerModel.findByName(name);
            if (existingPowerName && existingPowerName.id !== parseInt(id)) {
                return res.status(400).json({ error: 'There is already a power with that name' });
            }

            if (existingPower.name === name && existingPower.damage === damage && existingPower.energy === energy && existingPower.effect === effect) {
                return res.status(200).json({
                    message: 'No changes detected',
                    data: existingPower
                });
            }

            const updatePower = await PowerModel.update(id, {name, damage, energy, effect});

            return res.status(200).json({
                message: 'Power updated succesfully',
                data: updatePower
            });
        } catch (error) {
            console.log('Error in PowerController.update:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async delete (req, res) {
        try {
            const id = req.params.id;

            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'The ID parameter is required and must be a number' });
            }

            const existingPower = await PowerModel.findById(id);
            if (!existingPower) {
                return res.status(404).json({ error: 'Power not found' });
            }

            const deletePower = await PowerModel.delete(id);
            return res.status(200).json(deletePower);
        } catch (error) {
            console.error('Error in PowerController.delete:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async findById (req, res) {
        try {
            const id = req.params.id;

            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'The ID parameter is required and must be a number' });
            }

            const existingPower = await PowerModel.findById(id);

            if (!existingPower) {
                return res.status(404).json({ error: 'Power not found' });
            }

            return res.status(200).json({
                message: 'Power found successfully',
                data: existingPower
            })
        } catch (error) {
            console.error('Error in PowerController.findById:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default new PowerController();