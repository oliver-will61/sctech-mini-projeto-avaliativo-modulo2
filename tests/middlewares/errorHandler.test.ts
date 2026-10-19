import { Request, Response } from "express";
import { errorHandler } from "../../src/middlewares/errorHandler";
import { AppError } from "../../src/utils/AppError";

function mockResponse() {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("errorHandler", () => {
  const req = {} as Request;
  const next = jest.fn();

  it("retorna o status e a mensagem de um AppError", () => {
    const res = mockResponse();

    errorHandler(new AppError("E-mail já cadastrado", 409) as unknown as Error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ error: "E-mail já cadastrado" });
  });

  it("retorna 500 para erros inesperados", () => {
    const res = mockResponse();
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    errorHandler(new Error("boom"), req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro interno do servidor" });
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
