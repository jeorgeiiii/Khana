// middlewares/requireRole.js
//
// A reusable role guard. Pass it one or more allowed usertypes and it lets
// the request through only if req.user.usertype is one of them.
// Must run AFTER authMiddleware (which sets req.user from the verified JWT).
//
// Usage in a routes file:
//   const authMiddleware = require('../middlewares/authMiddleware');
//   const requireRole = require('../middlewares/requireRole');
//
//   // Admin only:
//   router.post('/create', authMiddleware, requireRole('Admin'), createCtrl);
//
//   // Driver only:
//   router.put('/accept/:id', authMiddleware, requireRole('Driver'), acceptCtrl);
//
//   // Admin OR Vendor:
//   router.put('/update/:id', authMiddleware, requireRole('Admin', 'Vendor'), updateCtrl);
//
// Your valid usertypes (from the User schema enum): Client, Admin, Vendor, Driver

const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated'
            });
        }

        if (!allowedRoles.includes(req.user.usertype)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Requires: ${allowedRoles.join(' or ')}`
            });
        }

        next();
    };
};

module.exports = requireRole;
