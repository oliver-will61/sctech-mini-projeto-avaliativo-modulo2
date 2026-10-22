import { Request, Response } from "express";
import { MedicoController } from "../../src/controllers/MedicoController";

const mockMedicoService = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

jest.mock("../../src/services/MedicoService", () => ({
  MedicoService: jest.fn().mockImplementation(() => mockMedicoService),
}));

function mockResponse() {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

describe("MedicoController", () => {
  let controller: MedicoController;
  const medico = {
    id: 1,
    nome: "Dra. Ana Souza",
    crm: "12345/SC",
    email: "ana@clinica.com",
    telefone: "(48) 99999-0000",
    especialidadeId: 1,
  };

  beforeEach(() => {
    controller = new MedicoController();
  });

  it("index retorna a lista de médicos", async () => {
    mockMedicoService.findAll.mockResolvedValue([medico]);
    const res = mockResponse();

    await controller.index({} as Request, res);

    expect(res.json).toHaveBeenCalledWith([medico]);
  });

  it("show converte o id da URL para número", async () => {
    mockMedicoService.findById.mockResolvedValue(medico);
    const req = { params: { id: "1" } } as unknown as Request;
    const res = mockResponse();

    await controller.show(req, res);

    expect(mockMedicoService.findById).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(medico);
  });

  it("store cria o médico apenas com os campos do DTO e responde 201", async () => {
    mockMedicoService.create.mockResolvedValue(medico);
    const { id, ...dados } = medico;
    const req = { body: { ...dados, id: 50, extra: "x" } } as Request;
    const res = mockResponse();

    await controller.store(req, res);

    expect(mockMedicoService.create).toHaveBeenCalledWith(dados);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(medico);
  });

  it("update repassa o id numérico e apenas os campos do DTO", async () => {
    mockMedicoService.update.mockResolvedValue(medico);
    const req = {
      params: { id: "1" },
      body: { telefone: "(48) 3333-0000", id: 50 },
    } as unknown as Request;
    const res = mockResponse();

    await controller.update(req, res);

    expect(mockMedicoService.update).toHaveBeenCalledWith(1, {
      nome: undefined,
      crm: undefined,
      email: undefined,
      telefone: "(48) 3333-0000",
      especialidadeId: undefined,
    });
    expect(res.json).toHaveBeenCalledWith(medico);
  });

  it("delete remove o médico e responde 204 sem conteúdo", async () => {
    mockMedicoService.delete.mockResolvedValue(undefined);
    const req = { params: { id: "1" } } as unknown as Request;
    const res = mockResponse();

    await controller.delete(req, res);

    expect(mockMedicoService.delete).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it("propaga os erros do service", async () => {
    const error = new Error("falhou");
    mockMedicoService.findAll.mockRejectedValue(error);

    await expect(controller.index({} as Request, mockResponse())).rejects.toBe(error);
  });
});
