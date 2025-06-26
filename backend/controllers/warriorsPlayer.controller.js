import WarriorPlayerModel from '../models/warriorsPlayer.model.js';

class WarriorsPlayerController {
    async register(req, res) {
        try {
            const { game_player_fk, warrior_fk } = req.body;

            if (!game_player_fk || !warrior_fk) {
                console.log(game_player_fk, warrior_fk);
                return res.status(400).json({ error: 'Required fields are missing' });
            }

            const existingWarriorPlayer = await WarriorPlayerModel.findByWarriorAndPlayer(game_player_fk, warrior_fk);
            if(existingWarriorPlayer) {
                return res.status(409).json({error : 'This WarriorsPlayer already has that power assigned'})
            }

            const { insertId } = await WarriorPlayerModel.create({ game_player_fk, warrior_fk });

            return res.status(201).json({
                message: 'WarriorsPlayer Created Successfully',
                data: {
                    id: insertId,
                    game_player_fk,
                    warrior_fk
                }
            });
        } catch (error) {
            console.log('Error in WarriorsPlayerController.register:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async show(req, res) {
        try {
            const existingWarriorPlayer = await WarriorPlayerModel.show();
            if (existingWarriorPlayer.length === 0) {
                return res.status(400).json({ error: 'No WarriorsPlayer found' })
            }

            return res.status(200).json({
                message: 'WarriorsPlayer obtained Successfully',
                data: existingWarriorPlayer
            })
        } catch (error) {
            console.log('Error in WarriorsPlayerController.show:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async update(req, res) {
        try {
            const { game_player_fk, warrior_fk } = req.body;
            const id = req.params.id;

            if (!game_player_fk || !warrior_fk || !id || isNaN(id)) {
                return res.status(400).json({ error: 'Required fields are missing' });
            }

            const existingWarriorPlayer = await WarriorPlayerModel.findById(id);
            if (!existingWarriorPlayer) {
                return res.status(409).json({ error: 'WarriorsPlayer not found' });
            }

            const existingWarriorAndPlayer = await WarriorPlayerModel.findByWarriorAndPlayer(game_player_fk, warrior_fk);
            if(existingWarriorAndPlayer && existingWarriorAndPlayer.id !== id) {
                return res.status(409).json({error : 'This player already has that warrior assigned'})
            }

            if (existingWarriorPlayer.warrior_fk === game_player_fk && existingWarriorPlayer.power_fk === warrior_fk) {
                return res.status(200).json({
                    message: 'No changes detected',
                    data: existingWarriorPlayer
                });
            }

            const updatedWarriorPlayer = await WarriorPlayerModel.update(id, { game_player_fk, warrior_fk });

            return res.status(200).json({
                message: 'WarriorsPlayer updated successfully',
                data: updatedWarriorPlayer
            });
        } catch (error) {
            console.log('Error in WarriorsPlayerController.update:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async delete(req, res) {
        try {
            const id = req.params.id;

            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'The ID parameter is required and must be a number' });
            }

            const existingWarriorPlayer = await WarriorPlayerModel.findById(id);
            if (!existingWarriorPlayer) {
                return res.status(409).json({ error: 'WarriorsPlayer not found' });
            }

            const deleteWarriorPlayer = await WarriorPlayerModel.delete(id);

            return res.status(200).json(deleteWarriorPlayer);
        } catch (error) {
            console.log('Error in WarriorsPlayerController.delete:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async findById(req, res) {
        try {
            const id = req.params.id;

            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'The ID parameter is required and must be a number' });
            }

            const existingWarriorPlayer = await WarriorPlayerModel.findById(id);
            if (!existingWarriorPlayer) {
                return res.status(409).json({ error: 'WarriorsPlayer not found' });
            }

            return res.status(200).json({
                message: 'WarriorsPlayer found successfully',
                data: existingWarriorPlayer
            });
        } catch (error) {
            console.log('Error in WarriorsPlayerController.findById:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default new WarriorsPlayerController();