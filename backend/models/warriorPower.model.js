import { connect } from '../config/db/connectMySql.js';

class WarriorPowerModel {
    static async create({ warrior_fk, power_fk }) {
        try {
            const sqlQuery = "INSERT INTO warrior_power (warrior_fk, power_fk) VALUES (?,?);";
            const [result] = await connect.query(sqlQuery, [warrior_fk, power_fk]);

            return { insertId: result.insertId };
        } catch (error) {
            console.error('Error in WarriorPowerModel.create:', error);
            throw error;
        }
    }

    static async show() {
        try {
            const sqlQuery = "CALL sp_show_warriorPower()";
            const [result] = await connect.query(sqlQuery);

            return result[0];
        } catch (error) {
            console.log('Error in WarriorPowerModel.show:', error);
            throw error;
        }
    }

    static async update(id, { warrior_fk, power_fk }) {
        try {
            const sqlQuery = "UPDATE warrior_power SET warrior_fk = ?, power_fk = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [warrior_fk, power_fk, id]);

            if (result.affectedRows === 0) return null;

            return await this.findById(id);
        } catch (error) {
            console.log('Error in WarriorPowerModel.update:', error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            const sqlQuery = "DELETE FROM warrior_power WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [id]);

            if (result.affectedRows === 0) return null;

            return { message: 'WarriorPower deleted successfully', deletedId: id };
        } catch (error) {
            console.log('Error in WarriorPowerModel.delete:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const sqlQuery = "SELECT * FROM warrior_power WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [id]);

            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.log('Error in WarriorPowerModel.findById:', error);
            throw error;
        }
    }

    static async findByWarriorAndPower(warriorId, powerId) {
        try {
            const sqlQuery = "SELECT * FROM warrior_power WHERE warrior_fk = ? AND power_fk = ?";
            const [result] = await connect.query(sqlQuery, [warriorId, powerId]);

            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.log('Error in WarriorPowerModel.findByIdWarrior:', error);
            throw error;
        }
    }
}

export default WarriorPowerModel;