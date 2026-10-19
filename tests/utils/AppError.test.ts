import { AppError } from "../../src/utils/AppError";

describe("AppError", () => {
  it("usa status 400 por padrão", () => {
    const error = new AppError("Requisição inválida");

    expect(error.message).toBe("Requisição inválida");
    expect(error.statusCode).toBe(400);
  });

  it("aceita um status customizado", () => {
    const error = new AppError("Usuário não encontrado", 404);

    expect(error.statusCode).toBe(404);
  });
});
