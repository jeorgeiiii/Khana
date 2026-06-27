/**
 * Role-Based Access Control middleware.
 *
 * Usage:
 *   const { allowRoles, ownsResourceOrAdmin } = require('../middlewares/rbac');
 *
 *   // Only admins:
 *   router.delete('/users/:id', authMiddleware, allowRoles('Admin'), handler);
 *
 *   // Vendor OR admin:
 *   router.post('/restaurants', authMiddleware, allowRoles('Vendor', 'Admin'), handler);
 *
 *   // Only the owner of THIS specific resource (or admin):
 *   router.put('/restaurants/:id',
 *       authMiddleware,
 *       allowRoles('Vendor', 'Admin'),
 *       ownsResourceOrAdmin(async (req) => {
 *           const r = await Restaurant.findById(req.params.id).select('ownerId');
 *           return r?.ownerId;
 *       }),
 *       handler
 *   );
 */

const allowRoles = (...allowed) => {
    return (req, res, next) => {
        const userType = req.user?.usertype;

        if (!userType) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!allowed.includes(userType)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role: ${allowed.join(' or ')}`
            });
        }

        next();
    };
};

/**
 * Check that the requesting user OWNS the resource, or is Admin.
 * @param {Function} getOwnerIdFromRequest  async (req) => ownerId
 */
const ownsResourceOrAdmin = (getOwnerIdFromRequest) => {
    return async (req, res, next) => {
        try {
            if (req.user?.usertype === 'Admin') return next();

            const ownerId = await getOwnerIdFromRequest(req);
            if (!ownerId) {
                return res.status(404).json({
                    success: false,
                    message: 'Resource not found'
                });
            }

            if (String(ownerId) !== String(req.user.id)) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not own this resource'
                });
            }

            next();
        } catch (err) {
            console.error('Ownership check error:', err);
            res.status(500).json({
                success: false,
                message: 'Permission check failed'
            });
        }
    };
};

module.exports = { allowRoles, ownsResourceOrAdmin };