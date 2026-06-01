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

        // Fetch products
        const productResponse = await axios.get('http://localhost:5000/api/product/all', {
            headers: { Authorization: `Bearer ${user.token}` }
        });

        // Fetch cart
        let cart = { items: [], totalAmount: 0 };
        try {
            const cartResponse = await axios.get('http://localhost:5000/api/cart/all', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            cart = cartResponse.data.data || { items: [], totalAmount: 0 };
        } catch(cErr) {
            console.error("Cart API failed, falling back to empty cart");
        }

        res.render('dashboard', {
            user,
            products: productResponse.data.data || [],
            cart: cart, // <-- CRITICAL: MUST BE PASSED HERE TO FEED INITIAL HYDRATION
            success: req.query.success || null,
            error: req.query.error || null
        });
    } catch (error: any) {
        res.render('login', { error: "Session expired or backend unreachable" });
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


// src/views/view-routes.ts
router.post('/add-to-cart', async (req: Request, res: Response) => {
    try {
        const user = (req.session as any).user;
        if (!user) return res.redirect('/login');
        
        await axios.post(
            'http://localhost:5000/api/cart/add',
            {
                productId: Number(req.body.productId)
            },
            {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
        );
        res.redirect('/dashboard?success=Added to cart');
    } catch (err: any) {
        const errorMsg = err.response?.data?.message || err.message;
        res.redirect(`/dashboard?error=${encodeURIComponent(errorMsg)}`);
    }
});

router.post('/cart-update', async (req: Request, res: Response) => {
    try {
        const user = (req.session as any).user;
        await axios.post(
            'http://localhost:5000/api/cart/update',
            {
                productId: req.body.productId,
                action: req.body.action
            },
            {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
        );
        res.redirect('/dashboard');
    } catch (err: any) {
        res.redirect('/dashboard?error=Update failed');
    }
});

router.post('/cart-remove', async (req: Request, res: Response) => {
    try {
        const user = (req.session as any).user;
        await axios.post(
            'http://localhost:5000/api/cart/remove',
            {
                productId: req.body.productId
            },
            {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
        );
        res.redirect('/dashboard');
    } catch (err: any) {
        res.redirect('/dashboard?error=Remove failed');
    }
});



export default router;