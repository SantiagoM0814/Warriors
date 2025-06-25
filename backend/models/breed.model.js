import { connect } from '../config/db/connectMySql.js';

class BreedModel {
    static async create({ name, description, resistance }) {
        try {
            const sqlQuery = "INSERT INTO breed (name, description, resistance) VALUES (?,?,?);";
            const [result] = await connect.query(sqlQuery, [name, description, resistance]);

            return { insertId: result.insertId };
        } catch (error) {
            console.error('Error in BreedModel.create:', error);
            throw error;
        }
    }

    static async show() {
        try {
            const sqlQuery = "SELECT * FROM breed ORDER BY id";
            const [result] = await connect.query(sqlQuery);

            return result;
        } catch (error) {
            console.log('Error in BreedModel.show:', error);
            throw error;
        }
    }

    static async update(id, { name, description, resistance }) {
        try {
            const sqlQuery = "UPDATE breed SET name = ?, description = ?, resistance = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [name, description, resistance, id]);

            if (result.affectedRows === 0) return null;

            return await this.findById(id);
        } catch (error) {
            console.log('Error in BreedModel.update:', error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            const sqlQuery = "DELETE FROM breed WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [id]);

            if (result.affectedRows === 0) return null;

            return { message: 'Breed deleted successfully', deletedId: id };
        } catch (error) {
            console.log('Error in BreedModel.delete:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const sqlQuery = "SELECT * FROM breed WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [id]);

            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.log('Error in BreedModel.findById:', error);
            throw error;
        }
    }

    static async findByName(name) {
        try {
            const sqlQuery = "SELECT * FROM breed WHERE name = ?";
            const [result] = await connect.query(sqlQuery, [name]);

            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.log('Error in BreedModel.findByName:', error);
            throw error;
        }
    }
}

export default BreedModel;