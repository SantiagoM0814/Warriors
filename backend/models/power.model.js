import { connect } from "../config/db/connectMySql.js";

class PowerModel {
    static async create({ name, damage, energy, effect }) {
        try {
            const sqlQuery = "INSERT INTO power (name, damage, energy, effect) VALUES (?,?,?,?);";
            const [result] = await connect.query(sqlQuery, [name, damage, energy, effect]);

            return { insertId: result.insertId };
        } catch (error) {
            console.error('Error in PowerModel.create:', error);
            throw error;
        }
    }

    static async show() {
        try {
            const sqlQuery = "SELECT * FROM power ORDER BY id";
            const [result] = await connect.query(sqlQuery);
            return result;
        } catch (error) {
            console.error('Error in PowerModel.show:', error);
            throw error;
        }
    }

    static async update(id, { name, damage, energy, effect }) {
        try {
            const sqlQuery = "UPDATE power SET  name = ?, damage = ?, energy = ?, effect = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [name, damage, energy, effect, id]);

            if (result.affectedRows === 0) return null;

            return await this.findById(id);
        } catch (error) {
            console.error('Error in UserModel.update:', error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            const sqlQuery = "DELETE FROM power WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [id]);

            if (result.affectedRows === 0) return null;

            return { message: 'Power deleted successfully', deletedId: id };
        } catch (error) {
            console.log('Error in PowerModel.delete:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const sqlQuery = "SELECT * FROM power WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [id]);

            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.log('Error in PowerModel.findById:', error);
            throw error;
        }
    }

    static async findByName(name) {
        try {
            const sqlQuery = "SELECT * FROM power WHERE name = ?";
            const [result] = await connect.query(sqlQuery, [name]);

            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.log('Error in PowerModel.findByName:', error);
            throw error;
        }
    }
}

export default PowerModel;