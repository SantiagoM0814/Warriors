import { connect } from '../config/db/connectMySql.js';

class PlayerModel {
    static async create({ name }) {
        try {
            const sqlQuery = "INSERT INTO player (name) VALUES (?);";
            const [result] = await connect.query(sqlQuery, [name]);

            return { insertId: result.insertId };
        } catch (error) {
            console.log('Error in PlayerModel.create:', error);
            throw error;
        }
    }

    static async show() {
        try {
            const sqlQuery = "SELECT * FROM player ORDER BY id";
            const [result] = await connect.query(sqlQuery);

            return result;
        } catch (error) {
            console.log('Error in PlayerModel.show:', error);
            throw error;
        }
    }

    static async update(id, { name }) {
        try {
            const sqlQuery = "UPDATE player SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [name, id]);

            if (result.affectedRows === 0) return null;

            return await this.findById(id);
        } catch (error) {
            console.log('Error in PlayerModel.update:', error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            const sqlQuery = "DELETE FROM player WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [id]);

            if (result.affectedRows === 0) return null;

            return { message: 'Player Deleted Successfully', deletedId: id };
        } catch (error) {
            console.log('Error in PlayerModel.delete:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const sqlQuery = "SELECT * FROM player WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [id]);

            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.log('Error in PlayerModel.findById:', error);
            throw error;
        }
    }

    static async findByName(name) {
        try {
            const sqlQuery = "SELECT * FROM player WHERE name = ?";
            const [result] = await connect.query(sqlQuery, [name]);

            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.log('Error in PlayerModel.findByName:', error);
            throw error;
        }
    }
}

export default PlayerModel;
