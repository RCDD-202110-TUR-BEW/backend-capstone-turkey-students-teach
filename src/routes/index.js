const express = require('express');
const swaggerUi = require('swagger-ui-express');
const indexController = require('../controllers/index');
const documentation = require('../docs/documentation.json');

const swaggerOptions = {};

const router = express.Router();

router.use(
  '/api-docs-auth',
  //  swaggerUi.serveFiles(authDoc, swaggerOptions),
  swaggerUi.serveFiles(documentation, swaggerOptions),
  swaggerUi.setup(documentation)
);
router.get('/', indexController.getHomePage);
router.get('/docs', indexController.getDocumentation);

module.exports = router;
