import dotenv from 'dotenv';
import express from 'express';
import { Router } from 'express';
import app from './src/app.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start the server.');
        process.exit(1); // stopping alll processes
    }
}

startServer();