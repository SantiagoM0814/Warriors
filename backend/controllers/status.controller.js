import StatusModel from "../models/status.model.js";

class StatusController {
    async register(req, res) {
        try {
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({ error: 'Required fields are missing' });
            }

            const existingStatus = await StatusModel.findByName(name);
            if (existingStatus) {
                return res.status(409).json({ error: 'There is already a status with that name' });
            }

            const { insertId } = await StatusModel.create({ name });

            return res.status(201).json({
                message: 'Status Created Successfully',
                data: {
                    id: insertId,
                    name
                }
            });
        } catch (error) {
            console.log('Error in StatusController.register:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async show(req, res) {
        try {
            const existingStatus = await StatusModel.show();
            if (existingStatus.length === 0) {
                return res.status(400).json({ error: 'No status found' });
            }

            return res.status(200).json({
                message: 'Status Obtained Successfully',
                data: existingStatus
            });
        } catch (error) {
            console.log('Error in StatusController.show:', error);
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

            const existingStatus = await StatusModel.findById(id);
            if (!existingStatus) {
                return res.status(404).json({ error: 'Status Not Found' });
            }

            const existingStatusName = await StatusModel.findByName(name);
            if (existingStatusName && existingStatusName.id !== parseInt(id)) {
                return res.status(400).json({ error: 'There is already a status with that name' });
            }

            if (existingStatus.name === name) {
                return res.status(200).json({
                    message: 'No Changes Detected',
                    data: existingStatus
                });
            }

            const updatedStatus = await StatusModel.update(id, { name });

            return res.status(200).json({
                message: 'status Updated Successfully',
                data: updatedStatus
            })
        } catch (error) {
            console.log('Error in StatusController.update:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async delete(req, res) {
        try {
            const id = req.params.id;

            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'The ID parameter is required and must be a number' });
            }

            const existingStatus = await StatusModel.findById(id);
            if (!existingStatus) {
                return res.status(409).json({ error: 'Status not found' });
            }

            const deletedId = await StatusModel.delete(id);

            return res.status(200).json( deletedId );
        } catch (error) {
            console.log('Error in StatusController.delete:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async findById(req, res) {
        try {
            const id = req.params.id;

            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'The ID is parameter required and must be a number' });
            }

            const existingStatus = await StatusModel.findById(id);
            if (!existingStatus) {
                return res.status(404).json({ error: 'Status not found' });
            }

            return res.status(200).json({
                message: 'Status Found Successfully',
                data: existingStatus
            })
        } catch (error) {
            console.log('Error in StatusController.findById:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default new StatusController();