import { connect } from '../config/db/connectMySql.js';

class WarriorModel {
    static async create({ name, life, intelligence, energy, photo, breed_fk, magic_fk, typeWarrior_fk }) {
        try {
            const sqlQuery = "INSERT INTO warrior (name, life, intelligence, energy, photo, breed_fk, magic_fk, typeWarrior_fk) VALUES (?,?,?,?,?,?,?,?);";
            const [result] = await connect.query(sqlQuery, [name, life, intelligence, energy, photo, breed_fk, magic_fk, typeWarrior_fk]);

            return { insertId: result.insertId };
        } catch (error) {
            console.error('Error in WarriorModel.create:', error);
            throw error;
        }
    }

    static async show() {
        try {
            const sqlQuery = "CALL sp_show_warrior()";
            const [result] = await connect.query(sqlQuery);

            return result[0];
        } catch (error) {
            console.log('Error in WarriorModel.show:', error);
            throw error;
        }
    }

    static async update(id, { name, life, intelligence, energy, photo, breed_fk, magic_fk, typeWarrior_fk }) {
        try {
            const sqlQuery = "UPDATE warrior SET name = ?, life = ?, intelligence = ?, energy = ?, photo = ?, breed_fk = ?, magic_fk = ?, typeWarrior_fk = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [name, life, intelligence, energy, photo, breed_fk, magic_fk, typeWarrior_fk, id]);

            if (result.affectedRows === 0) return null;

            return await this.findById(id);
        } catch (error) {
            console.log('Error in WarriorModel.update:', error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            const sqlQuery = "DELETE FROM warrior WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [id]);

            if (result.affectedRows === 0) return null;

            return { message: 'Warrior deleted successfully', deletedId: id };
        } catch (error) {
            console.log('Error in WarriorModel.delete:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const sqlQuery = "SELECT * FROM warrior WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [id]);

            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.log('Error in WarriorModel.findById:', error);
            throw error;
        }
    }

    static async findByName(name) {
        try {
            const sqlQuery = "SELECT * FROM warrior WHERE name = ?";
            const [result] = await connect.query(sqlQuery, [name]);

            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.log('Error in WarriorModel.findByName:', error);
            throw error;
        }
    }
}

export default WarriorModel;