import { connect } from '../config/db/connectMySql.js';

class GameModel {
    static async create({ token, user_fk, status_fk }) {
        try {
            const expirationTime = new Date(Date.now() + 5 * 60 * 1000); // ahora + 5 minutos
            const sqlQuery = "INSERT INTO game (token, user_fk, status_fk, expires_at) VALUES (?,?,?,?);";
            const [result] = await connect.query(sqlQuery, [token, user_fk, status_fk, expirationTime]);

            return { insertId: result.insertId };
        } catch (error) {
            console.error('Error in GameModel.create:', error);
            throw error;
        }
    }

    static async show() {
        try {
            const sqlQuery = "CALL sp_show_game();";
            const [result] = await connect.query(sqlQuery);

            return result[0];
        } catch (error) {
            console.log('Error in GameModel.show:', error);
            throw error;
        }
    }

    static async update(id, { status_fk }) {
        try {
            const sqlQuery = "UPDATE game SET status_fk = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [status_fk, id]);

            if (result.affectedRows === 0) return null;

            return await this.findById(id);
        } catch (error) {
            console.log('Error in GameModel.update:', error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            const sqlQuery = "DELETE FROM game WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [id]);

            if (result.affectedRows === 0) return null;

            return { message: 'Game deleted successfully', deletedId: id };
        } catch (error) {
            console.log('Error in GameModel.delete:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const sqlQuery = "SELECT * FROM game WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [id]);

            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.log('Error in GameModel.findById:', error);
            throw error;
        }
    }

    static async findByToken(token) {
        try {
            const sqlQuery = "SELECT * FROM game WHERE token = ?";
            const [result] = await connect.query(sqlQuery, [token]);

            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.log('Error in GameModel.findByToken:', error);
            throw error;
        }
    }
}

export default GameModel;