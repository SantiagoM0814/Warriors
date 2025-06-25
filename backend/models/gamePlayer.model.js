import { connect } from '../config/db/connectMySql.js';

class GamePlayerModel {
    static async create({ winner, game_fk, player_fk }) {
        try {
            const sqlQuery = "INSERT INTO game_player (gamePlayer_winner, game_fk, player_fk) VALUES (?,?,?);";
            const [result] = await connect.query(sqlQuery, [winner, game_fk, player_fk]);

            return { insertId: result.insertId };
        } catch (error) {
            console.error('Error in GamePlayerModel.create:', error);
            throw error;
        }
    }

    static async show() {
        try {
            const sqlQuery = "SELECT * FROM game_player ORDER BY id";
            const [result] = await connect.query(sqlQuery);

            return result;
        } catch (error) {
            console.log('Error in GamePlayerModel.show:', error);
            throw error;
        }
    }

    static async update(id, { winner, game_fk, player_fk }) {
        try {
            const sqlQuery = "UPDATE game_player SET gamePlayer_winner = ? game_player = ?, player_fk = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [winner, game_fk, player_fk, id]);

            if (result.affectedRows === 0) return null;

            return await this.findById(id);
        } catch (error) {
            console.log('Error in GamePlayerModel.update:', error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            const sqlQuery = "DELETE FROM game_player WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [id]);

            if (result.affectedRows === 0) return null;

            return { message: 'GamePlayer deleted successfully', deletedId: id };
        } catch (error) {
            console.log('Error in GamePlayerModel.delete:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const sqlQuery = "SELECT * FROM game_player WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [id]);

            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.log('Error in GamePlayerModel.findById:', error);
            throw error;
        }
    }

    static async findByPlayer(player) {
        try {
            const sqlQuery = "SELECT * FROM game_player WHERE player_fk = ?";
            const [result] = await connect.query(sqlQuery, [player]);

            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.log('Error in GamePlayerModel.findByPlayer:', error);
            throw error;
        }
    }
}

export default GamePlayerModel;