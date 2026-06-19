const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // From auth middleware
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            name: user.fullName,
            email: user.email,
            phone: user.mobile,
            address: user.address || ''
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email, phone, address } = req.body;

        // Find user and update
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields
        if (name) user.fullName = name;
        if (email) user.email = email;
        if (phone) user.mobile = phone;
        if (address) user.address = address;

        await user.save();

        // Return updated user without password
        res.json({
            name: user.fullName,
            email: user.email,
            phone: user.mobile,
            address: user.address || ''
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email or phone number already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
