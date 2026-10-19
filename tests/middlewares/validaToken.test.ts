import { Response } from "express";
import jwt from "jsonwebtoken";
import { validaToken, AuthRequest } from "../../src/middlewares/validaToken";

const SECRET = "segredo_de_teste";

function requestWithAuth(authorization?: string): AuthRequest {
  return { headers: { authorization } } as AuthRequest;
}

describe("validaToken", () => {
  const res = {} as Response;

  beforeAll(() => {
    process.env.JWT_SECRET = SECRET;
  });

  it("lança 401 quando o header Authorization não é enviado", () => {
    const next = jest.fn();

    expect(() => validaToken(requestWithAuth(), res, next)).toThrow(
      expect.objectContaining({ statusCode: 401, message: "Token não fornecido" })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("lança 401 quando o header não começa com Bearer", () => {
    const token = jwt.sign({ id: 1, role: "admin" }, SECRET);
    const next = jest.fn();

    expect(() => validaToken(requestWithAuth(`Token ${token}`), res, next)).toThrow(
      expect.objectContaining({ statusCode: 401, message: "Token não fornecido" })
    );
  });

  it("lança 401 quando o token é inválido", () => {
    const next = jest.fn();

    expect(() => validaToken(requestWithAuth("Bearer abc.def.ghi"), res, next)).toThrow(
      expect.objectContaining({ statusCode: 401, message: "Token invalido ou expirado" })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("lança 401 quando o token foi assinado com outro segredo", () => {
    const token = jwt.sign({ id: 1, role: "admin" }, "outro_segredo");
    const next = jest.fn();

    expect(() => validaToken(requestWithAuth(`Bearer ${token}`), res, next)).toThrow(
      expect.objectContaining({ statusCode: 401 })
    );
  });

  it("lança 401 quando o token está expirado", () => {
    const token = jwt.sign(
      { id: 1, role: "admin", exp: Math.floor(Date.now() / 1000) - 60 },
      SECRET
    );
    const next = jest.fn();

    expect(() => validaToken(requestWithAuth(`Bearer ${token}`), res, next)).toThrow(
      expect.objectContaining({ statusCode: 401 })
    );
  });

  it("preenche req.user e chama o next quando o token é válido", () => {
    const token = jwt.sign({ id: 7, role: "atendente" }, SECRET);
    const req = requestWithAuth(`Bearer ${token}`);
    const next = jest.fn();

    validaToken(req, res, next);

    expect(req.user).toEqual({ id: 7, role: "atendente" });
    expect(next).toHaveBeenCalledTimes(1);
  });
});
