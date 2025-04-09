require("dotenv").config();
const request = require("supertest");
const app = require("../index");
const { sequelize, User, Collection } = require("../../models");
const { generateToken } = require("../middlewares/authMiddleware");

let token;

beforeAll(async () => {
  await sequelize.sync({ force: true });
  const user = await User.create({
    email: "test@example.com",
    name: "Test User",
    googleId: "test-google-id"
  });
  await Collection.create({ name: "Test Collection", userId: user.id });

  // Generate a valid token for the user
  token = generateToken({ id: user.id });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Entry Controller", () => {
  it("should create a new entry successfully", async () => {
    const response = await request(app)
      .post("/entries")
      .set("Authorization", `Bearer ${token}`)
      .send({
        type: "anime",
        collectionId: 1,
        jikanId: 1
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("title");
    expect(response.body).toHaveProperty("type", "anime");
    expect(response.body).toHaveProperty("progress", 0);
    expect(response.body).toHaveProperty("completed", false);
  });

  it("should fetch all entries for a collection", async () => {
    const response = await request(app)
      .get("/collections/1/1")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should update an entry successfully", async () => {
    const response = await request(app)
      .put("/entries/1/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        progress: 5,
        completed: true
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("progress", 5);
    expect(response.body).toHaveProperty("completed", true);
  });

  it("should delete an entry successfully", async () => {
    const response = await request(app)
      .delete("/entries/1/1")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Entry deleted");
  });

  it("should fetch recommendations for a collection", async () => {
    const response = await request(app).get("/collections/1/1/recommendations");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("result");
    expect(Array.isArray(response.body.result)).toBe(true);
  });
});
