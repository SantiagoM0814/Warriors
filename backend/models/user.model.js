import { connect } from '../config/db/connectMySql.js';

class UserModel {
    static async create({ username, password, role_fk }) {
        try {
            const sqlQuery = "INSERT INTO user (username, password, role_fk) VALUES (?,?,?);";
            const [result] = await connect.query(sqlQuery, [username, password, role_fk]);

            return { insertId: result.insertId };
        } catch (error) {
            console.error('Error in UserModel.create:', error);
            throw error;
        }
    }

    static async show() {
        try {
            const sqlQuery = "SELECT * FROM user ORDER BY id";
            const [result] = await connect.query(sqlQuery);

            return result;
        } catch (error) {
            console.log('Error in UserModel.show:', error);
            throw error;
        }
    }

    static async update(id, { username, role_fk }) {
        try {
            const sqlQuery = "UPDATE user SET username = ?, role_fk = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [username, role_fk, id]);

            if (result.affectedRows === 0) return null;

            return await this.findById(id);
        } catch (error) {
            console.log('Error in UserModel.update:', error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            const sqlQuery = "DELETE FROM user WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [id]);

            if (result.affectedRows === 0) return null;

            return { message: 'User deleted successfully', deletedId: id };
        } catch (error) {
            console.log('Error in UserModel.delete:', error);
            throw error;
        }
    }

    static async updateLogin(id) {
        try {
            const sqlQuery = "UPDATE user SET last_login = CURRENT_TIMESTAMP WHERE id = ?"
            const [result] = await connect.query(sqlQuery, [id]);

            return result.affectedRows > 0 ? this.findById(id) : null;
        } catch (error) {
            console.log('Error in UserModel.updateLogin:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const sqlQuery = "SELECT * FROM user WHERE id = ?";
            const [result] = await connect.query(sqlQuery, [id]);

            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.log('Error in UserModel.findById:', error);
            throw error;
        }
    }

    static async findByName(username) {
        try {
            const sqlQuery = "SELECT * FROM user WHERE username = ?";
            const [result] = await connect.query(sqlQuery, [username]);

            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.log('Error in UserModel.findByName:', error);
            throw error;
        }
    }
}

export default UserModel;