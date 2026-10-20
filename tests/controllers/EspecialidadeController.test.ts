import { Request, Response } from "express";
import { EspecialidadeController } from "../../src/controllers/EspecialidadeController";

const mockEspecialidadeService = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

jest.mock("../../src/services/EspecialidadeService", () => ({
  EspecialidadeService: jest.fn().mockImplementation(() => mockEspecialidadeService),
}));

function mockResponse() {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

describe("EspecialidadeController", () => {
  let controller: EspecialidadeController;
  const especialidade = { id: 1, nome: "Cardiologia", descricao: "Coração" };

  beforeEach(() => {
    controller = new EspecialidadeController();
  });

  it("index retorna a lista de especialidades", async () => {
    mockEspecialidadeService.findAll.mockResolvedValue([especialidade]);
    const res = mockResponse();

    await controller.index({} as Request, res);

    expect(res.json).toHaveBeenCalledWith([especialidade]);
  });

  it("show converte o id da URL para número", async () => {
    mockEspecialidadeService.findById.mockResolvedValue(especialidade);
    const req = { params: { id: "1" } } as unknown as Request;
    const res = mockResponse();

    await controller.show(req, res);

    expect(mockEspecialidadeService.findById).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(especialidade);
  });

  it("store cria a especialidade apenas com os campos do DTO e responde 201", async () => {
    mockEspecialidadeService.create.mockResolvedValue(especialidade);
    const req = {
      body: { nome: "Cardiologia", descricao: "Coração", id: 50 },
    } as Request;
    const res = mockResponse();

    await controller.store(req, res);

    expect(mockEspecialidadeService.create).toHaveBeenCalledWith({
      nome: "Cardiologia",
      descricao: "Coração",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(especialidade);
  });

  it("update repassa o id numérico e apenas os campos do DTO", async () => {
    mockEspecialidadeService.update.mockResolvedValue(especialidade);
    const req = {
      params: { id: "1" },
      body: { descricao: "Coração", id: 50 },
    } as unknown as Request;
    const res = mockResponse();

    await controller.update(req, res);

    expect(mockEspecialidadeService.update).toHaveBeenCalledWith(1, {
      nome: undefined,
      descricao: "Coração",
    });
    expect(res.json).toHaveBeenCalledWith(especialidade);
  });

  it("delete remove a especialidade e responde 204 sem conteúdo", async () => {
    mockEspecialidadeService.delete.mockResolvedValue(undefined);
    const req = { params: { id: "1" } } as unknown as Request;
    const res = mockResponse();

    await controller.delete(req, res);

    expect(mockEspecialidadeService.delete).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it("propaga os erros do service", async () => {
    const error = new Error("falhou");
    mockEspecialidadeService.findAll.mockRejectedValue(error);

    await expect(controller.index({} as Request, mockResponse())).rejects.toBe(error);
  });
});
