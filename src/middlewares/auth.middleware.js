const jwt = require('jsonwebtoken');
const db = require('../models');

const verifyToken = async (req, res, next) => {
    try {
        let token = req.headers['authorization'];
        if (!token) {
            return res.status(403).json({ message: 'No token provided!' });
        }

        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        const user = await db.User.findByPk(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        req.user = user;
        
        // Optionally attach access records
        const access = await db.User_access.findAll({ where: { user_id: user.id } });
        req.userAccess = access;

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized!', error: error.message });
    }
};

const requireRole = (rolesArray) => {
    return (req, res, next) => {
        // This middleware assumes that req.business_id or req.outlet_id is provided,
        // or checks if the user has this role in ANY of their accesses.
        // Adjust logic depending on your multi-tenant strategy.
        
        const accessParams = {
            business_id: req.params.business_id || req.body.business_id || req.query.business_id,
            outlet_id: req.params.outlet_id || req.body.outlet_id || req.query.outlet_id
        };

        if (req.userAccess && req.userAccess.length > 0) {
            let hasRole = false;
            
            // If checking within a specific context
            if (accessParams.business_id || accessParams.outlet_id) {
                hasRole = req.userAccess.some(acc => {
                    let matchesContext = true;
                    if (accessParams.business_id) matchesContext = matchesContext && acc.business_id == accessParams.business_id;
                    if (accessParams.outlet_id) matchesContext = matchesContext && acc.outlet_id == accessParams.outlet_id;
                    return matchesContext && rolesArray.includes(acc.role);
                });
            } else {
                // Check if they have the role anywhere
                hasRole = req.userAccess.some(acc => rolesArray.includes(acc.role));
            }

            if (hasRole) {
                return next();
            }
        }

        return res.status(403).json({ message: 'Require Admin/Role Privilege!' });
    };
};

module.exports = {
    verifyToken,
    requireRole
};
