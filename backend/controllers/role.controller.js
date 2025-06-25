import RoleModel from "../models/role.model.js";

class RoleController {
    async register(req, res) {
        try {
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({ error: 'Required fields are missing' });
            }

            const existingRole = await RoleModel.findByName(name);
            if (existingRole) {
                return res.status(409).json({ error: 'There is already a role with that name' });
            }

            const { insertId } = await RoleModel.create({ name });

            return res.status(201).json({
                message: 'Role Created Successfully',
                data: {
                    id: insertId,
                    name
                }
            });
        } catch (error) {
            console.log('Error in RoleController.register:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async show(req, res) {
        try {
            const existingRoles = await RoleModel.show();
            if (existingRoles.length === 0) {
                return res.status(400).json({ error: 'No roles found' });
            }

            return res.status(200).json({
                message: 'Roles Obtained Successfully',
                data: existingRoles
            });
        } catch (error) {
            console.log('Error in RoleController.show:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async update(req, res) {
        try {
            const { name } = req.body;
            const id = req.params.id;

            if (!name || !id || isNaN(id)) {
                return res.status(400).json({ error: 'Required Fields Are Missing' });
            }

            const existingRole = await RoleModel.findById(id);
            if (!existingRole) {
                return res.status(404).json({ error: 'Role Not Found' });
            }

            const existingRoleName = await RoleModel.findByName(name);
            if (existingRoleName && existingRoleName.id !== parseInt(id)) {
                return res.status(400).json({ error: 'There is already a role with that name' });
            }

            if (existingRole.name === name) {
                return res.status(200).json({
                    message: 'No Changes Detected',
                    data: existingRole
                });
            }

            const updatedRole = await RoleModel.update(id, { name });

            return res.status(200).json({
                message: 'Role Updated Successfully',
                data: updatedRole
            })
        } catch (error) {
            console.log('Error in RoleController.update:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async delete(req, res) {
        try {
            const id = req.params.id;

            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'The ID parameter is required and must be a number' });
            }

            const existingRole = await RoleModel.findById(id);
            if (!existingRole) {
                return res.status(409).json({ error: 'Role not found' });
            }

            const deletedId = await RoleModel.delete(id);

            return res.status(200).json( deletedId );
        } catch (error) {
            console.log('Error in RoleController.delete:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async findById(req, res) {
        try {
            const id = req.params.id;

            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'The ID is parameter required and must be a number' });
            }

            const existingRole = await RoleModel.findById(id);
            if (!existingRole) {
                return res.status(404).json({ error: 'Role not found' });
            }

            return res.status(200).json({
                message: 'Role Found Successfully',
                data: existingRole
            })
        } catch (error) {
            console.log('Error in RoleController.findById:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default new RoleController();