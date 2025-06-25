import { encryptPassword, comparePassword } from '../library/appBcrypt.js';
import UserModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';

class UserController {
    async register(req, res) {
        try {
            const { username, password, role_fk } = req.body;

            if (!username || !password || !role_fk) {
                return res.status(400).json({ error: 'Required fields are missing' });
            }

            if (password.length < 8) {
                return res.status(400).json({ error: 'The password must be at least 8 characters long.' });
            }

            const existingUser = await UserModel.findByName(username);
            if (existingUser) {
                return res.status(409).json({ error: 'There is already a user with that name' });
            }

            const passwordHash = await encryptPassword(password);

            const { insertId } = await UserModel.create({ username, password: passwordHash, role_fk });

            return res.status(201).json({
                message: 'User Created Successfully',
                data: {
                    id: insertId,
                    username,
                    role_fk
                }
            });
        } catch (error) {
            console.log('Error in UserController.register:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async show(req, res) {
        try {
            const existingUsers = await UserModel.show();
            if (existingUsers.length === 0) {
                return res.status(400).json({ error: 'No users found' })
            }

            return res.status(200).json({
                message: 'Users obtained Successfully',
                data: existingUsers
            })
        } catch (error) {
            console.log('Error in UserController.show:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async update(req, res) {
        try {
            const { username, role_fk } = req.body;
            const id = req.params.id;

            if (!username || !role_fk || !id || isNaN(id)) {
                return res.status(400).json({ error: 'Required fields are missing' });
            }

            const existingUser = await UserModel.findById(id);
            if (!existingUser) {
                return res.status(409).json({ error: 'There is not user' });
            }

            const existingUserName = await UserModel.findByName(username);
            if (existingUserName && existingUserName.id !== parseInt(id)) {
                return res.status(400).json({ error: 'There is already a user with that name' });
            }

            if (existingUser.username === username && existingUser.role_fk === role_fk) {
                return res.status(200).json({
                    message: 'No changes detected',
                    data: existingUser
                });
            }

            const updatedUser = await UserModel.update(id, { username, role_fk });

            return res.status(200).json({
                message: 'User updated successfully',
                data: updatedUser
            });
        } catch (error) {
            console.log('Error in UserController.update:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async delete(req, res) {
        try {
            const id = req.params.id;

            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'The ID parameter is required and must be a number' });
            }

            const existingUser = await UserModel.findById(id);
            if (!existingUser) {
                return res.status(409).json({ error: 'User not found' });
            }

            const deletedUser = await UserModel.delete(id);

            return res.status(200).json(deletedUser);
        } catch (error) {
            console.log('Error in UserController.delete:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async findById(req, res) {
        try {
            const id = req.params.id;

            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'The ID parameter is required and must be a number' });
            }

            const existingUser = await UserModel.findById(id);
            if (!existingUser) {
                return res.status(409).json({ error: 'User not found' });
            }

            return res.status(200).json({
                message: 'User found successfully',
                data: existingUser
            });
        } catch (error) {
            console.log('Error in UserController.findById:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ error: 'Required fields are missing' });
            }

            const existingUser = await UserModel.findByName(username);
            if (existingUser) {
                const passwordHash = await comparePassword(password, existingUser.password);
                if (!passwordHash) {
                    return res.status(401).json({ error: 'Invalid username or password' });
                } else {
                    const updateLogin = await UserModel.updateLogin(existingUser.id);
                    if (!updateLogin) {
                        return res.status(500).json({ error: 'Failed to update login time' });
                    }
                    const token = jwt.sign({ id: existingUser.id, role_fk: existingUser.role_fk }, process.env.JWT_SECRET, {
                        expiresIn: "1h",
                        algorithm: "HS256"
                    })
                    res.status(200).json({
                        message: 'Login successfully',
                        user: {
                            id: existingUser.id,
                            username: existingUser.username,
                            role_fk: existingUser.role_fk,
                            token: token
                        }
                    });
                }
            } else {
                return res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            console.error('Error in UserControllerLogin:', error);
            res.status(500).json({ error: 'Internal server Error' });
        }
    }
}

export default new UserController();