import { connect } from '../config/db/connectMySql.js';

class TypeWarriorModel {
    static async create({ name, description }) {
        try {
            const sqlQuery = "INSERT INTO type_warrior (name, description) VALUES (?,?);";
            const [result] = await connect.query(sqlQuery, [name, description]);

            return { insertId: result.insertId };
        } catch (error) {
            console.log('Error in TypeWarriorModel.create:', error);
            throw error;
        }
    }

    static async show() {
        try {
            const sqlQuery = "SELECT * FROM type_warrior ORDER BY id";
            const [result] = await connect.query(sqlQuery);

            return result;
        } catch (error) {
            console.log('Error in TypeWarriorModel.show:', error);
            throw error;
        }
    }

    static async update(id, { name, description }) {
        try {
            const sqlQuery = "UPDATE type_warrior SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [name, description, id]);

            if (result.affectedRows === 0) return null;

            return await this.findById(id);
        } catch (error) {
            console.log('Error in TypeWarriorModel.update:', error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            const sqlQuery = "DELETE FROM type_warrior WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [id]);

            if (result.affectedRows === 0) return null;

            return { message: 'TypeWarrior Deleted Successfully', deletedId: id };
        } catch (error) {
            console.log('Error in TypeWarriorModel.delete:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const sqlQuery = "SELECT * FROM type_warrior WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [id]);

            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.log('Error in TypeWarriorModel.findById:', error);
            throw error;
        }
    }

    static async findByName(name) {
        try {
            const sqlQuery = "SELECT * FROM type_warrior WHERE name = ?";
            const [result] = await connect.query(sqlQuery, [name]);

            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.log('Error in TypeWarriorModel.findByName:', error);
            throw error;
        }
    }
}

export default TypeWarriorModel;
