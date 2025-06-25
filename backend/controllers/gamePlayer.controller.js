import GamePlayerModel from '../models/gamePlayer.model.js';

class GamePlayerController {
    async register (req, res) {
        try {
            const { winner, game_fk, player_fk } = req.body;

            if (!winner || !game_fk || !player_fk) {
                return res.status(400).json({ error: 'Required fields are missing' });
            }

            const { insertId } = await GamePlayerModel.create({winner, game_fk, player_fk});

            return res.status(201).json({
                message: 'GamePlayer Created Successfully',
                data: {
                    id: insertId,
                    winner,
                    game_fk,
                    player_fk
                }
            });
        } catch (error) {
            console.log('Error in GamePlayerController.register:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async show (req, res) {
        try {
            const existingGamePlayers = await GamePlayerModel.show();
            if (existingGamePlayers.length === 0) {
                return res.status(400).json({ error: 'No GamePlayer found'})
            }

            return res.status(200).json({
                message: 'GamePlayer obtained Successfully',
                data: existingGamePlayers
            })
        } catch (error) {
            console.log('Error in GamePlayerController.show:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async update (req, res) {
        try {
            const { winner, game_fk, player_fk } = req.body;
            const id = req.params.id;

            if (!winner || !game_fk || !player_fk || !id || isNaN(id)) {
                return res.status(400).json({ error: 'Required fields are missing' });
            }

            const existingGamePlayer = await GamePlayerModel.findById(id);
            if (!existingGamePlayer) {
                return res.status(409).json({ error: 'There is not GamePlayer'});
            }

            if (existingGamePlayer.winner === winner && existingGamePlayer.game_fk === game_fk && existingGamePlayer.player_fk === player_fk) {
                return res.status(200).json({
                    message: 'No changes detected',
                    data: existingGamePlayer
                });
            }
            
            const updatedGamePlayer = await GamePlayerModel.update(id, { winner, game_fk, player_fk});

            return res.status(200).json({
                message: 'GamePlayer updated successfully',
                data: updatedGamePlayer
            });
        } catch (error) {
            console.log('Error in GamePlayerController.update:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async delete (req, res) {
        try {
            const id = req.params.id;

            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'The ID parameter is required and must be a number' });
            }

            const existingGamePlayer = await GamePlayerModel.findById(id);
            if (!existingGamePlayer) {
                return res.status(409).json({ error: 'GamePlayer not found' });
            }

            const deletedGamePlayer = await GamePlayerModel.delete(id);

            return res.status(200).json(deletedGamePlayer);
        } catch (error) {
            console.log('Error in GamePlayerController.delete:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async findById (req, res) {
        try {
            const id = req.params.id;

            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'The ID parameter is required and must be a number'});
            }

            const existingGamePlayer = await GamePlayerModel.findById(id);
            if (!existingGamePlayer) {
                return res.status(409).json({ error: 'GamePlayer not found' });
            }

            return res.status(200).json({
                message: 'GamePlayer found successfully',
                data: existingGamePlayer
            });
        } catch (error) {
            console.log('Error in GamePlayerController.findById:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default new GamePlayerController();