const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendMail } = require('../utils/mailer');
const { Op } = require('sequelize');

const User = db.User;

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const register = async (req, res) => {
    try {
        const { username, email, password, phone_number } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();
        const verifyExpires = new Date(Date.now() + 10 * 60000); // 10 minutes

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            phone_number,
            is_verified: false,
            verify_token: otp,
            verify_expires: verifyExpires,
            auth_provider: 'local'
        });

        // Send OTP
        await sendMail(
            email,
            'Kasir Cepat - Verify Account',
            `Your OTP is: ${otp}`,
            `<b>Your OTP is: ${otp}</b>`
        ).catch(err => console.log('Mail failed but user created:', err.message));

        res.status(201).json({ message: 'User registered successfully! Please verify your OTP.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user || user.auth_provider !== 'local') {
            return res.status(404).json({ message: 'User not found or using different login provider.' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid Password!' });
        }

        if (!user.is_verified) {
            return res.status(401).json({ message: 'Please verify your email first!' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret_key', {
            expiresIn: 86400 // 24 hours
        });

        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            accessToken: token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found!' });

        if (user.verify_token !== otp) {
            return res.status(400).json({ message: 'Invalid OTP!' });
        }

        if (new Date() > new Date(user.verify_expires)) {
            return res.status(400).json({ message: 'OTP has expired!' });
        }

        user.is_verified = true;
        user.verify_token = null;
        user.verify_expires = null;
        await user.save();

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret_key', {
            expiresIn: 86400
        });

        res.status(200).json({ message: 'User verified successfully!', accessToken: token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        
        if (!user) return res.status(404).json({ message: 'User not found!' });
        if (user.is_verified) return res.status(400).json({ message: 'User is already verified!' });

        const otp = generateOTP();
        user.verify_token = otp;
        user.verify_expires = new Date(Date.now() + 2 * 60000); // 2 mins
        await user.save();

        await sendMail(
            email,
            'Kasir Cepat - Verify Account (Resend)',
            `Your new OTP is: ${otp}`,
            `<b>Your new OTP is: ${otp}</b>`
        );

        res.status(200).json({ message: 'New OTP sent to email.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        
        if (!user) return res.status(404).json({ message: 'User not found!' });

        const otp = generateOTP();
        user.verify_token = otp;
        user.verify_expires = new Date(Date.now() + 2 * 60000);
        await user.save();

        await sendMail(
            email,
            'Kasir Cepat - Forgot Password',
            `Your password reset OTP is: ${otp}`,
            `<b>Your password reset OTP is: ${otp}</b>`
        );

        res.status(200).json({ message: 'Password reset OTP sent to email.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, otp, new_password } = req.body;
        const user = await User.findOne({ where: { email } });
        
        if (!user) return res.status(404).json({ message: 'User not found!' });

        if (user.verify_token !== otp) return res.status(400).json({ message: 'Invalid OTP!' });
        if (new Date() > new Date(user.verify_expires)) return res.status(400).json({ message: 'OTP has expired!' });

        const hashedPassword = await bcrypt.hash(new_password, 10);
        user.password = hashedPassword;
        user.verify_token = null;
        user.verify_expires = null;
        await user.save();

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret_key', {
            expiresIn: 86400
        });

        res.status(200).json({ message: 'Password reset successfully!', accessToken: token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, phone_number } = req.body;

        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: 'User not found!' });

        if (username) user.username = username;
        if (phone_number) user.phone_number = phone_number;
        await user.save();

        res.status(200).json({
            message: 'Profile updated successfully!',
            user: { id: user.id, username: user.username, phone_number: user.phone_number }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const googleCallback = async (req, res) => {
    // Handling google callback after passport processing
    try {
        const user = req.user; // Passport attaches user here
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret_key', {
            expiresIn: 86400
        });
        
        // normally redirect to frontend with token
        res.status(200).json({ message: 'Google login successful!', accessToken: token });
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
};

module.exports = {
    register,
    login,
    verifyOTP,
    resendOTP,
    forgotPassword,
    resetPassword,
    updateProfile,
    googleCallback
};
