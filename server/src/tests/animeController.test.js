const request = require("supertest");
const app = require("../index");

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("Anime Controller", () => {
  it("should fetch general anime recommendations successfully", async () => {
    const response = await request(app).get("/animes");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.data[0].entry[0]).toHaveProperty("title");
  });

  it("should search for anime successfully", async () => {
    const response = await request(app).get("/animes?q=Naruto");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data[0]).toHaveProperty("title", "Naruto");
  });

  it("should fetch anime details successfully", async () => {
    await delay(2000);
    const response = await request(app).get("/animes/1");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("title");
    expect(response.body).toHaveProperty("mal_id", 1);
  });

  it("should return 404 for non-existent anime details", async () => {
    await delay(2000);
    const response = await request(app).get("/animes/999999");
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
  });
});
