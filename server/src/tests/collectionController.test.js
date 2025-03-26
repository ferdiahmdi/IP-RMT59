const request = require("supertest");
const app = require("../index");
const { sequelize, User } = require("../../models");

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await User.create({
    email: "test@example.com",
    name: "Test User",
    googleId: "test-google-id"
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Collection Controller", () => {
  it("should create a new collection successfully", async () => {
    const response = await request(app).post("/collections").send({
      name: "Test Collection",
      userId: 1
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("name", "Test Collection");
    expect(response.body).toHaveProperty("userId", 1);
  });

  it("should fail to create a collection with an invalid userId", async () => {
    const response = await request(app).post("/collections").send({
      name: "Invalid Collection",
      userId: 999
    });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "User not found");
  });

  it("should fetch all collections for a user successfully", async () => {
    const response = await request(app).get("/collections/1");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should fail to fetch collections for a non-existent user", async () => {
    const response = await request(app).get("/collections/999");
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "User not found");
  });
});
