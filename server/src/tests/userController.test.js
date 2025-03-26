const request = require("supertest");
const app = require("../index");
const { sequelize } = require("../../models");

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("User Controller", () => {
  it("should create a new user successfully", async () => {
    const response = await request(app).post("/add-user").send({
      email: "test@example.com",
      name: "Test User",
      googleId: "test-google-id"
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("email", "test@example.com");
  });

  it("should fail to create a user with missing fields", async () => {
    const response = await request(app).post("/add-user").send({
      email: "test@example.com"
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should fail to create a user with an existing email", async () => {
    const response = await request(app).post("/add-user").send({
      email: "test@example.com",
      name: "Test User",
      googleId: "test-google-id"
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      expect.stringMatching("Email already exists")
    );
  });
});
