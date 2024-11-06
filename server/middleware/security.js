const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss');
const hpp = require('hpp');

// Rate limiting to prevent DDoS attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// XSS Protection middleware
const xssProtection = (req, res, next) => {
  try {
    const sanitizeValue = (value) => {
      if (typeof value === 'string') {
        return xss(value);
      }
      if (typeof value === 'object' && value !== null) {
        const sanitizedObj = {};
        for (const key in value) {
          sanitizedObj[key] = sanitizeValue(value[key]);
        }
        return sanitizedObj;
      }
      return value;
    };

    if (req.body) {
      // Skip password fields
      const sanitizedBody = { ...req.body };
      for (const key in sanitizedBody) {
        if (key !== 'password' && key !== 'confirmPassword') {
          sanitizedBody[key] = sanitizeValue(sanitizedBody[key]);
        }
      }
      req.body = sanitizedBody;
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Command Injection Protection
const commandInjectionProtection = (req, res, next) => {
  try {
    const dangerousChars = /[;&|`$]/;
    
    const checkValue = (value) => {
      if (typeof value === 'string' && dangerousChars.test(value)) {
        throw new Error('Potential command injection detected');
      }
    };

    if (req.body && typeof req.body === 'object') {
      Object.values(req.body).forEach(checkValue);
    }
    next();
  } catch (error) {
    next(error);
  }
};

// SQL Injection Protection
const sqlInjectionProtection = (req, res, next) => {
  try {
    const sqlPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION)\b)/i;
    
    const checkValue = (value) => {
      if (typeof value === 'string' && sqlPattern.test(value)) {
        throw new Error('Potential SQL injection detected');
      }
    };

    if (req.body && typeof req.body === 'object') {
      Object.values(req.body).forEach(checkValue);
    }
    next();
  } catch (error) {
    next(error);
  }
};

// Request Validation middleware
const validateRequest = (req, res, next) => {
  try {
    if (req.headers['content-length'] > 10000) {
      console.warn('Large payload detected:', {
        ip: req.ip,
        size: req.headers['content-length'],
        path: req.path
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

// Security Headers middleware (MITM protection)
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'js.stripe.com'],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'api.stripe.com', 'localhost:*'],
      frameSrc: ["'self'", 'js.stripe.com'],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
});

module.exports = {
  limiter,
  xssProtection,
  commandInjectionProtection,
  sqlInjectionProtection,
  validateRequest,
  securityHeaders,
  hpp
}; 