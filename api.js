const autoCatch = require('./lib/auto-catch')
const path = require('path')
const Products = require('./products')
 
/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
*/
function handleRoot (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
  }

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
*/
async function listProducts (req, res) {
 
    const { offset = 0, limit = 25, tag } = req.query

    try {
        // Pass the limit and offset to the Products service
        res.json(await Products.list({
          offset: Number(offset),
          limit: Number(limit),
          tag
        }))
      } catch (err) {
        res.status(500).json({ error: err.message })
      }
    }
  


  /**
 * Get a single product
 * @param {object} req
 * @param {object} res
 */
async function getProduct (req, res, next) {

  const { id } = req.params

  try {
    const product = await Products.get(id)
    if (!product) {
      // next() is a callback that will pass the request to the next available route in the stack
      return next()
    }

    return res.json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
/**
 * Create a new product
 * @param {object} req
 * @param {object} res
 */
async function createProduct (req, res) {
  console.log('request body:', req.body)
  res.json(req.body)
}

/**
 * Delete a product
 * @param {object} req
 * @param {object} res
 */
async function deleteProduct(req, res) {
  const { id } = req.params;
  console.log(`Product with ID ${id} deleted`);
  res.status(202).json({ message: `Product with ID ${id} deleted` });
}

/**
 * Update a product
 * @param {object} req
 * @param {object} res
 */
async function updateProduct(req, res) {
  const { id } = req.params;
  console.log(`Product with ID ${id} updated:`, req.body);
  res.status(200).json({ message: `Product with ID ${id} updated`, updatedData: req.body });
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  deleteProduct, // Export DELETE method
  updateProduct, // Export PUT method
});
