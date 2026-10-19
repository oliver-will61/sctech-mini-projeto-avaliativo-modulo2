import { Response } from "express";
import { UserController } from "../../src/controllers/UserController";
import { AuthRequest } from "../../src/middlewares/validaToken";

const mockUserService = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

jest.mock("../../src/services/UserService", () => ({
  UserService: jest.fn().mockImplementation(() => mockUserService),
}));

function mockResponse() {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

describe("UserController", () => {
  let controller: UserController;
  const user = { id: 1, name: "João", email: "joao@email.com", role: "user" };

  beforeEach(() => {
    controller = new UserController();
  });

  it("me busca o usuário pelo id do token", async () => {
    mockUserService.findById.mockResolvedValue(user);
    const req = { user: { id: 1, role: "user" } } as AuthRequest;
    const res = mockResponse();

    await controller.me(req, res);

    expect(mockUserService.findById).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(user);
  });

  it("index retorna a lista de usuários", async () => {
    mockUserService.findAll.mockResolvedValue([user]);
    const res = mockResponse();

    await controller.index({} as AuthRequest, res);

    expect(res.json).toHaveBeenCalledWith([user]);
  });

  it("show converte o id da URL para número", async () => {
    mockUserService.findById.mockResolvedValue(user);
    const req = { params: { id: "1" } } as unknown as AuthRequest;
    const res = mockResponse();

    await controller.show(req, res);

    expect(mockUserService.findById).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(user);
  });

  it("store cria o usuário apenas com os campos do DTO e responde 201", async () => {
    mockUserService.create.mockResolvedValue(user);
    const req = {
      body: { name: "João", email: "joao@email.com", password: "senha", role: "user", extra: "x" },
    } as AuthRequest;
    const res = mockResponse();

    await controller.store(req, res);

    expect(mockUserService.create).toHaveBeenCalledWith({
      name: "João",
      email: "joao@email.com",
      password: "senha",
      role: "user",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(user);
  });

  it("update repassa o id numérico e o body", async () => {
    mockUserService.update.mockResolvedValue({ ...user, name: "Novo" });
    const req = { params: { id: "1" }, body: { name: "Novo" } } as unknown as AuthRequest;
    const res = mockResponse();

    await controller.update(req, res);

    expect(mockUserService.update).toHaveBeenCalledWith(1, { name: "Novo" });
    expect(res.json).toHaveBeenCalledWith({ ...user, name: "Novo" });
  });

  it("delete remove o usuário e responde 204 sem conteúdo", async () => {
    mockUserService.delete.mockResolvedValue(undefined);
    const req = { params: { id: "1" } } as unknown as AuthRequest;
    const res = mockResponse();

    await controller.delete(req, res);

    expect(mockUserService.delete).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it("propaga os erros do service", async () => {
    const error = new Error("falhou");
    mockUserService.findAll.mockRejectedValue(error);

    await expect(controller.index({} as AuthRequest, mockResponse())).rejects.toBe(error);
  });
});
