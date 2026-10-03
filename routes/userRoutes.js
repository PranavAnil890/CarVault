
const express = require('express');
const router = express.Router();

const user = require('../models/user');
const serviceCenter = require('../models/serviceCenter')

const bcrypt = require('bcryptjs');
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


        if (existingUser) {

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


            return res.json({

                message: 'Login successful',

                token: token,

                user: {
                    id: existingUser._id,
                    name: existingUser.name,
                    role: existingUser.role
                }

            });

        }


        // check the service center

        const existingServiceCenter =
            await serviceCenter.findOne({
                email: email
            });


        if (existingServiceCenter) {

            const passwordMatch = await bcrypt.compare(
                password,
                existingServiceCenter.password
            );


            if (!passwordMatch) {
                return res.status(400).json({
                    message: 'Invalid email or password'
                });
            }

            const token = jwt.sign( 
                { 
                    id: existingServiceCenter._id,
                     role: 'serviceCenter'
                     }, 
                     process.env.JWT_SECRET, 
                     { 
                        expiresIn: '1d' 
                    }
                 );


            return res.json({

                message: 'Login successful',

                token: token,

                user: {
                    id: existingServiceCenter._id,
                    name: existingServiceCenter.name,
                    role: 'serviceCenter'
                }

            });

        }

        return res.status(400).json({
            message: 'Invalid email or password'
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

