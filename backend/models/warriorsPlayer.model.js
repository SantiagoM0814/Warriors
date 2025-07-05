import { connect } from '../config/db/connectMySql.js';

class WarriorsPlayerModel {
    static async create({ game_player_fk, warrior_fk }) {
        try {
            const sqlQuery = "INSERT INTO warriors_player (game_player_fk, warrior_fk) VALUES (?,?);";
            const [result] = await connect.query(sqlQuery, [game_player_fk, warrior_fk]);

            return { insertId: result.insertId };
        } catch (error) {
            console.error('Error in WarriorsPlayerModel.create:', error);
            throw error;
        }
    }

    static async show() {
        try {
            const sqlQuery = "CALL sp_show_warriorPlayer();";
            const [result] = await connect.query(sqlQuery);

            return result[0];
        } catch (error) {
            console.log('Error in WarriorsPlayerModel.show:', error);
            throw error;
        }
    }

    static async update(id, { game_player_fk, warrior_fk }) {
        try {
            const sqlQuery = "UPDATE warriors_player SET game_player_fk = ?, warrior_fk = ? WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [game_player_fk, warrior_fk, id]);

            if (result.affectedRows === 0) return null;

            return await this.findById(id);
        } catch (error) {
            console.log('Error in WarriorsPlayerModel.update:', error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            const sqlQuery = "DELETE FROM warriors_player WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [id]);

            if (result.affectedRows === 0) return null;

            return { message: 'WarriorsPlayer deleted successfully', deletedId: id };
        } catch (error) {
            console.log('Error in WarriorsPlayerModel.delete:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const sqlQuery = "SELECT * FROM warriors_player WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [id]);

            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.log('Error in WarriorsPlayerModel.findById:', error);
            throw error;
        }
    }

    static async findByWarriorAndPlayer(game_fk, warrior_fk) {
        try {
            const sqlQuery = "SELECT * FROM warriors_player WHERE game_player_fk = ? AND warrior_fk = ?";
            const [result] = await connect.query(sqlQuery, [game_fk, warrior_fk]);

            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.log('Error in WarriorsPlayerModel.findByIdWarrior:', error);
            throw error;
        }
    }
}

export default WarriorsPlayerModel;