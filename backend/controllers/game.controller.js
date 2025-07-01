import GameModel from '../models/game.model.js';
import jwt from 'jsonwebtoken';

class GameController {
    async register(req, res) {
        try {
            const { user_fk, status_fk } = req.body;

            if (!user_fk || !status_fk) {
                return res.status(400).json({ error: 'Required fields are missing' });
            }

            const token = jwt.sign({ user_fk }, process.env.JWT_SECRET, {
                expiresIn: "5m",
                algorithm: "HS256"
            });

            const { insertId } = await GameModel.create({ token, user_fk, status_fk });

            return res.status(201).json({
                message: 'Game Created Successfully',
                data: {
                    id: insertId,
                    token,
                    user_fk,
                    status_fk
                }
            });
        } catch (error) {
            console.log('Error in GameController.register:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async show(req, res) {
        try {
            const existingGames = await GameModel.show();
            if (existingGames.length === 0) {
                return res.status(400).json({ error: 'No games found' })
            }

            return res.status(200).json({
                message: 'Games obtained Successfully',
                data: existingGames
            })
        } catch (error) {
            console.log('Error in GameController.show:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async update(req, res) {
        try {
            const { status_fk } = req.body;
            const id = req.params.id;

            if (!status_fk || !id || isNaN(id)) {
                return res.status(400).json({ error: 'Required fields are missing' });
            }

            const existingGame = await GameModel.findById(id);
            if (!existingGame) {
                return res.status(409).json({ error: 'There is not game' });
            }

            if (existingGame.status_fk === status_fk) {
                return res.status(200).json({
                    message: 'No changes detected',
                    data: existingGame
                });
            }

            const updatedGame = await GameModel.update(id, { status_fk });

            return res.status(200).json({
                message: 'Game updated successfully',
                data: updatedGame
            });
        } catch (error) {
            console.log('Error in GameController.update:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async delete(req, res) {
        try {
            const id = req.params.id;

            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'The ID parameter is required and must be a number' });
            }

            const existingGame = await GameModel.findById(id);
            if (!existingGame) {
                return res.status(409).json({ error: 'Game not found' });
            }

            const deletedGame = await GameModel.delete(id);

            return res.status(200).json(deletedGame);
        } catch (error) {
            console.log('Error in GameController.delete:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async findById(req, res) {
        try {
            const id = req.params.id;

            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'The ID parameter is required and must be a number' });
            }

            const existingGame = await GameModel.findById(id);
            if (!existingGame) {
                return res.status(409).json({ error: 'Game not found' });
            }

            return res.status(200).json({
                message: 'Game found successfully',
                data: existingGame
            });
        } catch (error) {
            console.log('Error in GameController.findById:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async validateToken(req, res) {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }

        const game = await GameModel.findByToken(token);
        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }

        if (game.status_fk !== 1) {
            return res.status(403).json({ error: 'El estado del juego no es activo' });
        }

        const now = new Date();
        const expiresAt = new Date(game.expires_at);

        if (now > expiresAt) {
            return res.status(403).json({ error: 'Game token has expired' });
        }

        return res.status(200).json({
            message: 'Token is valid',
            data: game
        });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }
        console.log('Error in GameController.validateToken:', error);
        return res.status(500).json({ error: 'Invalid token or internal error' });
    }
}
}

export default new GameController();