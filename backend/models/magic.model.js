import { connect } from '../config/db/connectMySql.js';

class MagicModel {
    static async create({ name, description }) {
        try {
            const sqlQuery = "INSERT INTO magic (name, description) VALUES (?,?);";
            const [result] = await connect.query(sqlQuery, [name, description]);

            return { insertId: result.insertId };
        } catch (error) {
            console.log('Error in MagicModel.create:', error);
            throw error;
        }
    }

    static async show() {
        try {
            const sqlQuery = "SELECT * FROM magic ORDER BY id";
            const [result] = await connect.query(sqlQuery);

            return result;
        } catch (error) {
            console.log('Error in MagicModel.show:', error);
            throw error;
        }
    }

    static async update(id, { name, description }) {
        try {
            const sqlQuery = "UPDATE magic SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [name, description, id]);

            if(result.affectedRows === 0) return null;

            return await this.findById(id);
        } catch (error) {
            console.log('Error in MagicModel.update:', error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            const sqlQuery = "DELETE FROM magic WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [id]);

            if (result.affectedRows === 0) return null;

            return { message: 'Magic deleted successfully', deletedId: id };
        } catch (error) {
            console.log('Error in MagicModel.delete:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const sqlQuery = "SELECT * FROM magic WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [id]);

            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.log('Error in MagicModel.findById:', error);
            throw error;
        }
    }

    static async findByName(name) {
        try {
            const sqlQuery = "SELECT * FROM magic WHERE name = ?";
            const [result] = await connect.query(sqlQuery, [name]);

            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.log('Error in MagicModel.findByName:', error);
            throw error;
        }
    }
}

export default MagicModel;