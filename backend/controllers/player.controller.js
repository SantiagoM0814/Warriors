import PlayerModel from "../models/player.model.js";

class PlayerController {
    async register(req, res) {
        try {
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({ error: 'Required fields are missing' });
            }

            const existingPlayer = await PlayerModel.findByName(name);
            if (existingPlayer) {
                return res.status(409).json({ error: 'There is already a player with that name' });
            }

            const { insertId } = await PlayerModel.create({ name });

            return res.status(201).json({
                message: 'Player Created Successfully',
                data: {
                    id: insertId,
                    name
                }
            });
        } catch (error) {
            console.log('Error in PlayerController.register:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async show(req, res) {
        try {
            const existingPlayers = await PlayerModel.show();
            if (existingPlayers.length === 0) {
                return res.status(400).json({ error: 'No Players found' });
            }

            return res.status(200).json({
                message: 'Players Obtained Successfully',
                data: existingPlayers
            });
        } catch (error) {
            console.log('Error in PlayerController.show:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async update(req, res) {
        try {
            const { name } = req.body;
            const id = req.params.id;

            if (!name || !id || isNaN(id)) {
                return res.status(400).json({ error: 'Required Fields Are Missing' });
            }

            const existingPlayer = await PlayerModel.findById(id);
            if (!existingPlayer) {
                return res.status(404).json({ error: 'Player Not Found' });
            }

            const existingPlayerName = await PlayerModel.findByName(name);
            if (existingPlayerName && existingPlayerName.id !== parseInt(id)) {
                return res.status(400).json({ error: 'There is already a player with that name' });
            }

            if (existingPlayer.name === name) {
                return res.status(200).json({
                    message: 'No Changes Detected',
                    data: existingPlayer
                });
            }

            const updatedPlayer = await PlayerModel.update(id, { name });

            return res.status(200).json({
                message: 'Player Updated Successfully',
                data: updatedPlayer
            })
        } catch (error) {
            console.log('Error in PlayerController.update:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async delete(req, res) {
        try {
            const id = req.params.id;

            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'The ID parameter is required and must be a number' });
            }

            const existingPlayer = await PlayerModel.findById(id);
            if (!existingPlayer) {
                return res.status(409).json({ error: 'Player not found' });
            }

            const deletedId = await PlayerModel.delete(id);

            return res.status(200).json( deletedId );
        } catch (error) {
            console.log('Error in PlayerController.delete:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async findById(req, res) {
        try {
            const id = req.params.id;

            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'The ID is parameter required and must be a number' });
            }

            const existingPlayer = await PlayerModel.findById(id);
            if (!existingPlayer) {
                return res.status(404).json({ error: 'Player not found' });
            }

            return res.status(200).json({
                message: 'Player Found Successfully',
                data: existingPlayer
            })
        } catch (error) {
            console.log('Error in PlayerController.findById:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default new PlayerController();