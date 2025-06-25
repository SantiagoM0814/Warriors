import WarriorPowerModel from '../models/warriorPower.model.js';

class WarriorPowerController {
    async register(req, res) {
        try {
            const { warrior_fk, power_fk } = req.body;

            if (!warrior_fk || !power_fk) {
                console.log(warrior_fk, power_fk);
                return res.status(400).json({ error: 'Required fields are missing' });
            }

            const existingWarriorPower = await WarriorPowerModel.findByWarriorAndPower(warrior_fk, power_fk);
            if(existingWarriorPower) {
                return res.status(409).json({error : 'This warrior already has that power assigned'})
            }

            const { insertId } = await WarriorPowerModel.create({ warrior_fk, power_fk });

            return res.status(201).json({
                message: 'WarriorPower Created Successfully',
                data: {
                    id: insertId,
                    warrior_fk,
                    power_fk
                }
            });
        } catch (error) {
            console.log('Error in WarriorPowerController.register:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async show(req, res) {
        try {
            const existingWarriorPowers = await WarriorPowerModel.show();
            if (existingWarriorPowers.length === 0) {
                return res.status(400).json({ error: 'No WarriorsPowers found' })
            }

            return res.status(200).json({
                message: 'WarriorsPowers obtained Successfully',
                data: existingWarriorPowers
            })
        } catch (error) {
            console.log('Error in WarriorPowerController.show:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async update(req, res) {
        try {
            const { warrior_fk, power_fk } = req.body;
            const id = req.params.id;

            if (!warrior_fk || !power_fk || !id || isNaN(id)) {
                return res.status(400).json({ error: 'Required fields are missing' });
            }

            const existingWarriorPower = await WarriorPowerModel.findById(id);
            if (!existingWarriorPower) {
                return res.status(409).json({ error: 'WarriorPower not found' });
            }

            const existingWarriorAndPower = await WarriorPowerModel.findByWarriorAndPower(warrior_fk, power_fk);
            if(existingWarriorAndPower && existingWarriorAndPower.id !== id) {
                return res.status(409).json({error : 'This warrior already has that power assigned'})
            }

            if (existingWarriorPower.warrior_fk === warrior_fk && existingWarriorPower.power_fk === power_fk) {
                return res.status(200).json({
                    message: 'No changes detected',
                    data: existingWarriorPower
                });
            }

            const updatedWarriorPower = await WarriorPowerModel.update(id, { warrior_fk, power_fk });

            return res.status(200).json({
                message: 'WarriorPower updated successfully',
                data: updatedWarriorPower
            });
        } catch (error) {
            console.log('Error in WarriorPowerController.update:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async delete(req, res) {
        try {
            const id = req.params.id;

            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'The ID parameter is required and must be a number' });
            }

            const existingWarriorPower = await WarriorPowerModel.findById(id);
            if (!existingWarriorPower) {
                return res.status(409).json({ error: 'WarriorPower not found' });
            }

            const deleteWarriorPower = await WarriorPowerModel.delete(id);

            return res.status(200).json(deleteWarriorPower);
        } catch (error) {
            console.log('Error in WarriorPowerController.delete:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async findById(req, res) {
        try {
            const id = req.params.id;

            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'The ID parameter is required and must be a number' });
            }

            const existingWarriorPower = await WarriorPowerModel.findById(id);
            if (!existingWarriorPower) {
                return res.status(409).json({ error: 'WarriorPower not found' });
            }

            return res.status(200).json({
                message: 'WarriorPower found successfully',
                data: existingWarriorPower
            });
        } catch (error) {
            console.log('Error in WarriorPowerController.findById:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default new WarriorPowerController();