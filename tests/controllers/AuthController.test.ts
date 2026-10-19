import { Request, Response } from "express";
import { AuthController } from "../../src/controllers/AuthController";

const mockAuthService = {
  login: jest.fn(),
};

jest.mock("../../src/services/AuthService", () => ({
  AuthService: jest.fn().mockImplementation(() => mockAuthService),
}));

describe("AuthController", () => {
  it("login repassa e-mail e senha ao service e retorna o resultado", async () => {
    const result = { user: { id: 1 }, token: "token" };
    mockAuthService.login.mockResolvedValue(result);
    const req = {
      body: { email: "admin@email.com", password: "senha", extra: "x" },
    } as Request;
    const res = { json: jest.fn() } as unknown as Response;

    await new AuthController().login(req, res);

    expect(mockAuthService.login).toHaveBeenCalledWith({
      email: "admin@email.com",
      password: "senha",
    });
    expect(res.json).toHaveBeenCalledWith(result);
  });
});
