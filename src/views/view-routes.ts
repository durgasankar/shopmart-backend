import { Router, Request, Response } from "express";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import { upload } from "../middlewares/upload";

const router = Router();

// Home page
router.get('/', (req: Request, res: Response) => {
    res.render('index');
});

// Register page
router.get('/register', (req: Request, res: Response) => {
    res.render('register');
});

// Login page
router.get('/login', (req: Request, res: Response) => {
    res.render('login');
});

// Handle register form
router.post('/register', async (req: Request, res: Response) => {
    try {
        const response = await axios.post('http://localhost:5000/api/user/register', req.body);
        res.render('result', { data: response.data });
    } catch (error: any) {
        res.render('result', { data: error.response?.data || error.message });
    }
});

// Handle login form
router.post('/login', async (req: Request, res: Response) => {
    try {
        const response = await axios.post('http://localhost:5000/api/user/login', {
            email: req.body.email,
            password: req.body.password
        });
        (req.session as any).user = response.data.data;
        req.session.save((err) => {
            if (err) {
                console.log(err);
                return res.redirect('/login');
            }
            res.redirect('/dashboard');
        });
    } catch (error: any) {
        res.render('login', {
            error: error.response?.data || error.message
        });
    }
});
``

router.get('/logout', (req: Request, res: Response) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

router.get('/dashboard', async (req: Request, res: Response) => {
    try {
        const user = (req.session as any).user;
        if (!user) return res.redirect('/login');
        const response = await axios.get(
            'http://localhost:5000/api/product/all',
            {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
        );
        const products = response.data.data || [];
        const success = req.query.success;
        const error = req.query.error;
        res.render('dashboard', {
            user,
            products,
            success,
            error
        });
    } catch (error: any) {
        console.error(error.message);
        res.render('dashboard', {
            user: (req.session as any).user,
            products: [],
            error: "Failed to load products"
        });
    }
});

router.post(
    '/add-product',
    upload.single('image'),
    async (req: Request, res: Response) => {
        try {
            const user = (req.session as any).user;
            if (!user) return res.redirect('/login');

            const formData = new FormData();
            formData.append('name', req.body.name);
            formData.append('category', req.body.category);
            formData.append('price', req.body.price);
            formData.append('quantity', req.body.quantity);
            if (req.file) {
                formData.append('image', req.file.buffer, {
                    filename: req.file.originalname,
                    contentType: req.file.mimetype
                });
            }
            const response = await axios.post(
                'http://localhost:5000/api/product/add',
                formData,
                {
                    headers: {
                        ...formData.getHeaders(),
                        Authorization: `Bearer ${user.token}`
                    }
                }
            );
            const message = response.data.message || "Product added successfully";
            res.redirect(`/dashboard?success=${encodeURIComponent(message)}`);
        } catch (error: any) {
            const errMsg =
                error.response?.data?.message || error.message || "Failed to add product";
            res.redirect(`/dashboard?error=${encodeURIComponent(errMsg)}`);
        }
    }
);

router.post('/add-to-cart', (req: Request, res: Response) => {
    const { productId } = req.body;
    console.log("Added to cart:", productId);
    res.redirect('/dashboard?success=Product added to cart');
});
``


export default router;