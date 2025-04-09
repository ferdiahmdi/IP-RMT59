require("dotenv").config();
const request = require("supertest");
const app = require("../index");
const { sequelize, User } = require("../../models");
const { generateToken } = require("../middlewares/authMiddleware");

let token;

beforeAll(async () => {
  await sequelize.sync({ force: true });
  const user = await User.create({
    email: "test@example.com",
    name: "Test User",
    googleId: "test-google-id"
  });

  // Generate a valid token for the user
  token = generateToken({ id: user.id });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Collection Controller", () => {
  it("should create a new collection successfully", async () => {
    const response = await request(app)
      .post("/collections")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Collection",
        userId: 1
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("name", "Test Collection");
  });

  it("should fetch all collections for a user", async () => {
    const response = await request(app)
      .get("/collections/1")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should fail to create a collection with an invalid userId", async () => {
    const response = await request(app)
      .post("/collections")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Invalid Collection",
        userId: 999
      });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "User not found");
  });
});
