const express = require('express');
const swaggerUi = require('swagger-ui-express');
const indexController = require('../controllers/index');
const authDoc = require('../docs/auth-doc.json');

const swaggerOptions = {};

const router = express.Router();

router.use(
  '/api-docs-auth',
  swaggerUi.serveFiles(authDoc, swaggerOptions),
  swaggerUi.setup(authDoc)
);
router.get('/', indexController.getHomePage);
router.get('/docs', indexController.getDocumentation);

module.exports = router;
