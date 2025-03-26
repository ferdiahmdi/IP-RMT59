const request = require("supertest");
const app = require("../index");

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("Manga Controller", () => {
  it("should fetch general manga recommendations successfully", async () => {
    const response = await request(app).get("/mangas");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].entry[0]).toHaveProperty("title");
  });

  it("should search for manga successfully", async () => {
    const response = await request(app).get("/mangas?q=Naruto");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty("title", "Naruto");
  });

  it("should fetch manga details successfully", async () => {
    await delay(2000);
    const response = await request(app).get("/mangas/1");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("title");
    expect(response.body).toHaveProperty("mal_id", 1);
  });

  it("should return 404 for non-existent manga details", async () => {
    await delay(2000);
    const response = await request(app).get("/mangas/999999");
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
  });
});
