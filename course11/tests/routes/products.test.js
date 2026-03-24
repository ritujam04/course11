const request = require("supertest");
const app = require("../../src/app");
const { createProducts } = require("../support/product_helpers");
const { ProductFactory } = require("../factories");

const BASE_URL = "/products";

test("should get a single product", async () => {
  const products = await createProducts(1);
  const testProduct = products[0];

  const response = await request(app).get(`${BASE_URL}/${testProduct.id}`).expect(200);

  expect(response.body.name).toBe(testProduct.name);
});

describe("UPDATE Product", () => {
  test("should update a product", async () => {
    const products = await createProducts(1);
    const productToUpdate = products[0];
    const updatePayload = {
      name: "Updated Name",
      description: "Updated Description",
      price: "123.45",
      category: productToUpdate.category,
      available: !productToUpdate.available,
    };

    const response = await request(app)
      .put(`${BASE_URL}/${productToUpdate.id}`)
      .send(updatePayload)
      .expect(200);

    expect(response.body.id).toBe(productToUpdate.id);
    expect(response.body.name).toBe(updatePayload.name);
    expect(response.body.price).toBe(parseFloat(updatePayload.price));
    expect(response.body.available).toBe(updatePayload.available);
  });
});

describe("DELETE Product", () => {
  test("should delete a product", async () => {
    const products = await createProducts(1);
    const product = products[0];

    await request(app)
      .delete(`${BASE_URL}/${product.id}`)
      .expect(204);

    await request(app)
      .get(`${BASE_URL}/${product.id}`)
      .expect(404);
  });
});

describe("LIST Products", () => {
  test("should list all products", async () => {
    await createProducts(5);
    const response = await request(app)
      .get(BASE_URL)
      .expect(200);

    expect(response.body.length).toBe(5);
  });
});

test("should filter products by name", async () => {
  await createProducts(2);
  const productData = ProductFactory.build({ name: "My Special Laptop" });
  await request(app).post(BASE_URL).send(productData).expect(201);
  await createProducts(2);

  const response = await request(app)
    .get(`${BASE_URL}?name=Special%20Laptop`)
    .expect(200);

  expect(response.body.length).toBe(1);
  expect(response.body[0].name).toBe("My Special Laptop");
});

test("should filter products by category", async () => {
  const defaultCategoryProduct = ProductFactory.build({ category: "FOOD" });
  const specialCategoryProduct = ProductFactory.build({ category: "TOOLS" });
  await request(app).post(BASE_URL).send(defaultCategoryProduct).expect(201);
  await request(app).post(BASE_URL).send(specialCategoryProduct).expect(201);

  const response = await request(app)
    .get(`${BASE_URL}?category=TOOLS`)
    .expect(200);

  expect(response.body.length).toBe(1);
  expect(response.body[0].category).toBe("TOOLS");
});

test("should filter products by availability", async () => {
  const availableProduct = ProductFactory.build({ available: true });
  const unavailableProduct = ProductFactory.build({ available: false });

  await request(app).post(BASE_URL).send(availableProduct).expect(201);
  await request(app).post(BASE_URL).send(unavailableProduct).expect(201);

  const response = await request(app)
    .get(`${BASE_URL}?availability=true`)
    .expect(200);

  expect(response.body.length).toBe(1);
  expect(response.body[0].available).toBe(true);
});
