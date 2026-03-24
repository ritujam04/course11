const axios = require("axios");

const API_URL = process.env.API_URL || "http://localhost:3000/products";

async function loadBackgroundData(dataTable) {
  const products = dataTable.hashes();
  for (const product of products) {
    const payload = {
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      available: product.available.toLowerCase() === "true",
      category: product.category.toUpperCase(),
    };
    try {
      await axios.post(API_URL, payload);
    } catch (error) {
      console.error(
        `Failed to create product ${product.name}:`,
        error.response ? error.response.data : error.message
      );
      throw new Error(`Failed to create product ${product.name} via API`);
    }
  }
}

module.exports = { loadBackgroundData };
