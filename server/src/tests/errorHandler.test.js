const errorHandler = require("../middlewares/errorHandler");

describe("Error Handler", () => {
  it("should return a 500 error for generic errors", () => {
    const err = new Error("Test Error");
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Test Error" });
  });

  it("should return a specific error for SequelizeValidationError", () => {
    const err = {
      name: "SequelizeValidationError",
      errors: [{ message: "Validation Error" }]
    };
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Validation Error" });
  });
});
