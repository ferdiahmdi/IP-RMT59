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

describe("Anime Controller", () => {
  it("should fetch general anime recommendations successfully", async () => {
    const response = await request(app)
      .get("/animes")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("should search for anime successfully", async () => {
    const response = await request(app)
      .get("/animes?q=Naruto")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.data[0]).toHaveProperty("title", "Naruto");
  });

  it("should fetch anime details successfully", async () => {
    const response = await request(app).get("/animes/1");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("title");
  });
});
