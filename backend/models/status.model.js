import { connect } from '../config/db/connectMySql.js';

class StatusModel {
    static async create({ name }) {
        try {
            const sqlQuery = "INSERT INTO status (name) VALUES (?);";
            const [result] = await connect.query(sqlQuery, [name]);

            return { insertId: result.insertId };
        } catch (error) {
            console.log('Error in StatusModel.create:', error);
            throw error;
        }
    }

    static async show() {
        try {
            const sqlQuery = "SELECT * FROM status ORDER BY id";
            const [result] = await connect.query(sqlQuery);

            return result;
        } catch (error) {
            console.log('Error in StatusModel.show:', error);
            throw error;
        }
    }

    static async update(id, { name }) {
        try {
            const sqlQuery = "UPDATE status SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [name, id]);

            if (result.affectedRows === 0) return null;

            return await this.findById(id);
        } catch (error) {
            console.log('Error in StatusModel.update:', error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            const sqlQuery = "DELETE FROM status WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [id]);

            if (result.affectedRows === 0) return null;

            return { message: 'Status Deleted Successfully', deletedId: id };
        } catch (error) {
            console.log('Error in StatusModel.delete:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const sqlQuery = "SELECT * FROM status WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [id]);

            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.log('Error in StatusModel.findById:', error);
            throw error;
        }
    }

    static async findByName(name) {
        try {
            const sqlQuery = "SELECT * FROM status WHERE name = ?";
            const [result] = await connect.query(sqlQuery, [name]);

            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.log('Error in StatusModel.findByName:', error);
            throw error;
        }
    }
}

export default StatusModel;
