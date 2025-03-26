const request = require("supertest");
const app = require("../index");
const { sequelize, User, Collection } = require("../../models");
require("dotenv").config();

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await User.create({
    email: "test@example.com",
    name: "Test User",
    googleId: "test-google-id"
  });
  await Collection.create({ name: "Test Collection", userId: 1 });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Entry Controller", () => {
  it("should create a new entry successfully", async () => {
    const response = await request(app).post("/entries").send({
      type: "anime",
      collectionId: 1,
      jikanId: 1
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("title");
    expect(response.body).toHaveProperty("type", "anime");
    expect(response.body).toHaveProperty("progress", 0);
    expect(response.body).toHaveProperty("completed", false);
    expect(response.body).toHaveProperty("collectionId", 1);
    expect(response.body).toHaveProperty("jikanId", 1);
  });

  it("should fail to create an entry with an invalid collectionId", async () => {
    const response = await request(app).post("/entries").send({
      type: "anime",
      collectionId: 999,
      jikanId: 1
    });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Collection not found");
  });

  it("should fetch all entries for a collection successfully", async () => {
    const response = await request(app).get("/collections/1/1");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should fail to fetch entries for a non-existent collection", async () => {
    const response = await request(app).get("/collections/1/999");
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Collection not found");
  });

  it("should fetch recommendations for a collection successfully", async () => {
    const response = await request(app).get("/collections/1/1/recommendations");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("result");
    expect(Array.isArray(response.body.result)).toBe(true);
  });

  it("should fail to fetch recommendations for a collection with no entries", async () => {
    const response = await request(app).get(
      "/collections/1/999/recommendations"
    );
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Collection not found");
  });
});
