
const express = require('express');
const router = express.Router();

const user = require('../models/user');

const bcrypt = require('bcryptjs');
const transporter = require('../config/email');
const jwt = require('jsonwebtoken');


// get the users

router.get('/', async (req, res) => {
    try {

        const users = await user.find();

        res.json(users);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});


// register the user

router.post('/register', async (req, res) => {
    try {

        const {
            name,
            email,
            password,
        
        } = req.body;


        const existingUser = await user.findOne({
            email: email
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'Email already registered'
            });
        }


        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        const newUser = new user({
            name,
            email,
            password: hashedPassword,
            role: 'customer'

        });


        const savedUser = await newUser.save();

        res.status(201).json(savedUser);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
});



// register service center
router.post('/service-center/register', async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const existingUser = await user.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: 'Email already registered'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new user({
            name,
            email,
            password: hashedPassword,
            role: 'serviceCenter'
        });

        const savedUser = await newUser.save();

        res.status(201).json({
            message: 'Service center account created successfully',
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role
            }
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
});

//register the admin

router.post('/admin/register',async (req,res) => {
    try{

        const{
            name,
            email,
            password,
            
        }=req.body;

        const existingUser = await user.findOne({
            email: email
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'Email already registered'
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const newAdmin = new user({
            name,
            email,
            password: hashedPassword,
            role: 'admin'
        });

        const savedAdmin = await newAdmin.save();

        res.status(201).json({
            message: 'Admin created successfully',
            admin:{
                id: savedAdmin._id,
                name:savedAdmin.name,
                email:savedAdmin.email,
                role:savedAdmin.role
            }
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
})



// login the user

router.post('/login', async (req, res) => {
    try {

        const {
            email,
            password
        } = req.body;


        // check customer / admin

        const existingUser = await user.findOne({
            email: email
        });


        if (!existingUser) {
            return res.status(400).json({
                message: 'Invalid email or password'

            })
        }

            const passwordMatch = await bcrypt.compare(
                password,
                existingUser.password
            );


            if (!passwordMatch) {
                return res.status(400).json({
                    message: 'Invalid email or password'
                });
            }

            const token = jwt.sign( 
                { 
                    id: existingUser._id,
                     role: existingUser.role
                     },
                      process.env.JWT_SECRET,
                      { 
                        expiresIn: '1d'
                     }
                    );


             res.json({

                message: 'Login successful',

                token: token,

                user: {
                    id: existingUser._id,
                    name: existingUser.name,
                    email:existingUser.email,
                    role: existingUser.role
                }

            });

        }catch(error) {
            res.status(500).json({
            message: error.message

            });
        
    }
});

router.post('/forgot-password', async (req, res) => {

    try {

        const { email } = req.body;

        const existingUser = await user.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({
                message: 'Email not found'
            });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        // OTP expires after 5 minutes
       existingUser.resetOTP = otp;
existingUser.resetOTPExpire = new Date(
    Date.now() + 5 * 60 * 1000
);

await existingUser.save();

await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: existingUser.email,
    subject: 'CarVault - Password Reset OTP',
    html: `
        <h2>CarVault Password Reset</h2>
        <p>Hello ${existingUser.name},</p>
        <p>Your password reset OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
        <p>Regards,<br>CarVault Team</p>
    `
});
        res.json({
            message: 'OTP sent to your email'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }
});

router.post('/verify-otp', async (req, res) => {

    try {

        const { email, otp } = req.body;

       const existingUser = await user.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

       if (!existingUser.resetOTP) {
    return res.status(400).json({
        message: 'OTP not found'
    });
}

if (existingUser.resetOTPExpire < new Date()) {
    return res.status(400).json({
        message: 'OTP expired'
    });
}

if (existingUser.resetOTP !== otp) {
    return res.status(400).json({
        message: 'Invalid OTP'
    });
}
        res.json({
            message: 'OTP verified successfully'
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});

router.post('/reset-password', async (req, res) => {

    try {

        const {
            email,
            otp,
            newPassword
        } = req.body;

        const existingUser = await user.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Check OTP
        if (existingUser.resetOTP !== otp) {
            return res.status(400).json({
                message: 'Invalid OTP'
            });
        }

        // Check OTP expiry
        if (existingUser.resetOTPExpire < new Date()) {
            return res.status(400).json({
                message: 'OTP expired'
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        existingUser.password = hashedPassword;

        // Clear OTP
        existingUser.resetOTP = null;
        existingUser.resetOTPExpire = null;

        await existingUser.save();

        res.json({
            message: 'Password reset successfully'
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});

// put the user

router.put('/:id', async (req, res) => {
    try {

        const updateUser = await user.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                returnDocument: 'after',
                runValidators: true
            }
        );


        if (!updateUser) {
            return res.status(404).json({
                message: 'user not found'
            });
        }


        res.json(updateUser);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
});


// delete the user

router.delete('/:id', async (req, res) => {
    try {

        const deleteUser = await user.findByIdAndDelete(
            req.params.id
        );


        if (!deleteUser) {
            return res.status(404).json({
                message: 'user not found'
            });
        }


        res.json({
            message: 'user deleted successfully'
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
});


module.exports = router;

