import { Request, Response } from "express";
import { PacienteController } from "../../src/controllers/PacienteController";

const mockPacienteService = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

jest.mock("../../src/services/PacienteService", () => ({
  PacienteService: jest.fn().mockImplementation(() => mockPacienteService),
}));

function mockResponse() {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

describe("PacienteController", () => {
  let controller: PacienteController;
  const paciente = {
    id: 1,
    nome: "João da Silva",
    cpf: "52998224725",
    email: "joao@email.com",
    dataNascimento: "1990-05-20",
  };

  beforeEach(() => {
    controller = new PacienteController();
  });

  it("index retorna a lista de pacientes", async () => {
    mockPacienteService.findAll.mockResolvedValue([paciente]);
    const res = mockResponse();

    await controller.index({} as Request, res);

    expect(res.json).toHaveBeenCalledWith([paciente]);
  });

  it("show converte o id da URL para número", async () => {
    mockPacienteService.findById.mockResolvedValue(paciente);
    const req = { params: { id: "1" } } as unknown as Request;
    const res = mockResponse();

    await controller.show(req, res);

    expect(mockPacienteService.findById).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(paciente);
  });

  it("store cria o paciente apenas com os campos do DTO e responde 201", async () => {
    mockPacienteService.create.mockResolvedValue(paciente);
    const { id, ...dados } = paciente;
    const req = { body: { ...dados, id: 50, extra: "x" } } as Request;
    const res = mockResponse();

    await controller.store(req, res);

    expect(mockPacienteService.create).toHaveBeenCalledWith(dados);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(paciente);
  });

  it("update repassa o id numérico e apenas os campos do DTO", async () => {
    mockPacienteService.update.mockResolvedValue(paciente);
    const req = {
      params: { id: "1" },
      body: { email: "novo@email.com", id: 50 },
    } as unknown as Request;
    const res = mockResponse();

    await controller.update(req, res);

    expect(mockPacienteService.update).toHaveBeenCalledWith(1, {
      nome: undefined,
      cpf: undefined,
      email: "novo@email.com",
      dataNascimento: undefined,
    });
    expect(res.json).toHaveBeenCalledWith(paciente);
  });

  it("delete remove o paciente e responde 204 sem conteúdo", async () => {
    mockPacienteService.delete.mockResolvedValue(undefined);
    const req = { params: { id: "1" } } as unknown as Request;
    const res = mockResponse();

    await controller.delete(req, res);

    expect(mockPacienteService.delete).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it("propaga os erros do service", async () => {
    const error = new Error("falhou");
    mockPacienteService.findAll.mockRejectedValue(error);

    await expect(controller.index({} as Request, mockResponse())).rejects.toBe(error);
  });
});
