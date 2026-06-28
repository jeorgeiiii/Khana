import React from 'react';
import { useParams, Link } from 'react-router-dom';

/*
 * ONE component for ALL footer/info pages.
 * To add a new page: add an entry to PAGES below and link to /page/<key>.
 * No new files, no new routes needed.
 */

const PAGES = {
    // ---------- ABOUT ZOMORO ----------
    'about': {
        title: 'Who We Are',
        subtitle: 'Bringing great food from neighbourhood restaurants to your door.',
        sections: [
            { heading: 'Our Story', body: 'Zomoro started with a simple idea: make it effortless for people to discover and order food they love. What began as a small restaurant-listing project has grown into a full delivery platform connecting hungry customers with local kitchens.' },
            { heading: 'Our Mission', body: 'To deliver good food to more people, more reliably — while helping local restaurants reach customers they could never reach alone.' },
            { heading: 'By The Numbers', body: 'Thousands of dishes, hundreds of partner restaurants, and a growing fleet of delivery partners working to get your order to you hot and on time.' }
        ]
    },
    'blog': {
        title: 'Zomoro Blog',
        subtitle: 'Food stories, product updates, and life behind the scenes.',
        sections: [
            { heading: 'Latest Posts', body: 'We write about the restaurants we love, the cities we serve, and how we build the technology that powers your orders. Check back regularly for new stories.' },
            { heading: 'Featured: Building Real-Time Delivery Tracking', body: 'A behind-the-scenes look at how we use live location updates so you can watch your order travel from the kitchen to your doorstep.' },
            { heading: 'Featured: Supporting Local Kitchens', body: 'How small, family-run restaurants are growing their business through online ordering.' }
        ]
    },
    'work-with-us': {
        title: 'Work With Us',
        subtitle: 'Join a team that loves food and solving hard problems.',
        sections: [
            { heading: 'Why Zomoro', body: 'We are a small, fast-moving team where your work has real impact. Engineers, designers, operations, and support all work closely together.' },
            { heading: 'Open Roles', body: 'We hire across engineering, product, design, marketing, and city operations. If you care about food and customers, we want to hear from you.' },
            { heading: 'How To Apply', body: 'Send your resume and a short note about why you want to join to careers@zomoro.example. We read every application.' }
        ]
    },
    'investor-relations': {
        title: 'Investor Relations',
        subtitle: 'Information for current and prospective investors.',
        sections: [
            { heading: 'Overview', body: 'Zomoro is focused on sustainable growth in the online food-delivery space, balancing customer experience, restaurant partnerships, and delivery efficiency.' },
            { heading: 'Reports & Filings', body: 'Quarterly and annual reports, along with key announcements, are published here for transparency.' },
            { heading: 'Contact', body: 'For investor enquiries, reach out to investors@zomoro.example.' }
        ]
    },

    // ---------- ZOMAVERSE ----------
    'zomato': {
        title: 'Zomoro',
        subtitle: 'Restaurant discovery and food delivery.',
        sections: [
            { heading: 'What It Is', body: 'The core Zomoro experience: discover restaurants near you, browse menus, read reviews, and order food for delivery — all in one place.' }
        ]
    },
    'blinkit': {
        title: 'Quick Commerce',
        subtitle: 'Groceries and essentials, delivered in minutes.',
        sections: [
            { heading: 'Coming Soon', body: 'Our quick-commerce arm will deliver everyday essentials to your door in minutes. This is a planned part of the Zomoro ecosystem.' }
        ]
    },
    'feeding-india': {
        title: 'Feeding Communities',
        subtitle: 'Our initiative to reduce hunger and food waste.',
        sections: [
            { heading: 'Our Commitment', body: 'We partner with restaurants and volunteers to redirect surplus food to people who need it most, working toward a future where no meal goes to waste.' }
        ]
    },
    'hyperpure': {
        title: 'Supplies For Restaurants',
        subtitle: 'Fresh ingredients sourced directly for our partner kitchens.',
        sections: [
            { heading: 'For Partners', body: 'We help restaurants source quality ingredients reliably, so they can focus on cooking great food while we handle the supply chain.' }
        ]
    },

    // ---------- FOR RESTAURANTS ----------
    'partner-with-us': {
        title: 'Partner With Us',
        subtitle: 'List your restaurant and reach more customers.',
        sections: [
            { heading: 'Grow Your Business', body: 'Join Zomoro to put your restaurant in front of thousands of nearby customers searching for their next meal. Manage your menu, prices, and availability from one dashboard.' },
            { heading: 'How It Works', body: 'Sign up, add your menu and details, and start receiving orders. We handle discovery, payments, and delivery logistics.' },
            { heading: 'Get Started', body: 'Create an account and choose the restaurant option, or email partners@zomoro.example to onboard your restaurant.' }
        ]
    },
    'apps-for-you': {
        title: 'Apps For You',
        subtitle: 'Zomoro on every device.',
        sections: [
            { heading: 'Customer App', body: 'Order food, track deliveries live, and save your favourite restaurants — all from your phone.' },
            { heading: 'Restaurant App', body: 'Manage incoming orders, update your menu, and track performance on the go.' },
            { heading: 'Delivery Partner App', body: 'Accept deliveries, navigate to customers, and track your earnings.' }
        ]
    },

    // ---------- LEARN MORE ----------
    'privacy': {
        title: 'Privacy Policy',
        subtitle: 'How we collect, use, and protect your information.',
        sections: [
            { heading: 'Information We Collect', body: 'We collect information you provide (such as your name, email, phone, and delivery address) and information about how you use the app, to fulfil your orders and improve our service.' },
            { heading: 'How We Use It', body: 'Your information is used to process orders, enable delivery, provide support, and personalise your experience. We do not sell your personal data.' },
            { heading: 'Your Choices', body: 'You can update your details, manage notification preferences, and request deletion of your account at any time.' }
        ]
    },
    'security': {
        title: 'Security',
        subtitle: 'Keeping your data and payments safe.',
        sections: [
            { heading: 'Account Security', body: 'Passwords are hashed, and access tokens expire regularly. We recommend using a strong, unique password for your account.' },
            { heading: 'Payment Security', body: 'Payments are processed through trusted, PCI-compliant providers. We never store your full card details on our servers.' },
            { heading: 'Reporting Issues', body: 'Found a vulnerability? Email security@zomoro.example and we will investigate promptly.' }
        ]
    },
    'terms': {
        title: 'Terms of Service',
        subtitle: 'The rules for using Zomoro.',
        sections: [
            { heading: 'Using Zomoro', body: 'By using our platform you agree to provide accurate information, use the service lawfully, and respect our restaurant and delivery partners.' },
            { heading: 'Orders & Payments', body: 'Prices, availability, and delivery times are shown at checkout. Orders are subject to restaurant acceptance.' },
            { heading: 'Changes', body: 'We may update these terms from time to time. Continued use of the service means you accept the latest version.' }
        ]
    }
};

const InfoPage = () => {
    const { slug } = useParams();
    const page = PAGES[slug];

    const wrap = {
        maxWidth: '760px',
        margin: '0 auto',
        padding: '40px 20px 80px'
    };

    // Unknown slug → simple not-found state
    if (!page) {
        return (
            <div style={wrap}>
                <h1 style={{ color: '#e23744' }}>Page not found</h1>
                <p style={{ color: '#555' }}>We couldn't find the page you were looking for.</p>
                <Link to="/home" style={{ color: '#e23744', fontWeight: 600 }}>← Back to home</Link>
            </div>
        );
    }

    return (
        <div style={wrap}>
            <Link to="/home" style={{ color: '#e23744', fontWeight: 600, textDecoration: 'none', fontSize: '14px' }}>
                ← Back to home
            </Link>

            <h1 style={{ fontSize: '34px', margin: '20px 0 8px', color: '#1c1c1c' }}>{page.title}</h1>
            <p style={{ fontSize: '17px', color: '#666', marginBottom: '32px' }}>{page.subtitle}</p>

            {page.sections.map((sec, i) => (
                <div key={i} style={{ marginBottom: '28px' }}>
                    <h2 style={{ fontSize: '20px', color: '#e23744', marginBottom: '8px' }}>{sec.heading}</h2>
                    <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#3a3a3a' }}>{sec.body}</p>
                </div>
            ))}
        </div>
    );
};

export default InfoPage;
