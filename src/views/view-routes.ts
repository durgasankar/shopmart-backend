import { Router, Request, Response } from "express";
import axios from "axios";

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

router.get('/dashboard', (req: Request, res: Response) => {
    console.log("Session data:", req.session);
    const user = (req.session as any).user;
    if (!user) {
        return res.redirect('/login');
    }
    res.render('dashboard', { user });
});


export default router;