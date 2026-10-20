import { EspecialidadeService } from "../../src/services/EspecialidadeService";
import { Especialidade } from "../../src/entities/Especialidade";

const mockEspecialidadeRepo = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByNome: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockMedicoRepo = {
  countByEspecialidadeId: jest.fn(),
};

jest.mock("../../src/repositories/EspecialidadeRepository", () => ({
  EspecialidadeRepository: jest.fn().mockImplementation(() => mockEspecialidadeRepo),
}));
jest.mock("../../src/repositories/MedicoRepository", () => ({
  MedicoRepository: jest.fn().mockImplementation(() => mockMedicoRepo),
}));

function makeEspecialidade(overrides: Partial<Especialidade> = {}): Especialidade {
  return {
    id: 1,
    nome: "Cardiologia",
    descricao: "Doenças do coração",
    ...overrides,
  } as Especialidade;
}

describe("EspecialidadeService", () => {
  let service: EspecialidadeService;

  beforeEach(() => {
    service = new EspecialidadeService();
  });

  describe("findAll", () => {
    it("retorna todas as especialidades", async () => {
      const especialidades = [makeEspecialidade(), makeEspecialidade({ id: 2, nome: "Pediatria" })];
      mockEspecialidadeRepo.findAll.mockResolvedValue(especialidades);

      await expect(service.findAll()).resolves.toEqual(especialidades);
    });
  });

  describe("findById", () => {
    it("retorna a especialidade encontrada", async () => {
      const especialidade = makeEspecialidade();
      mockEspecialidadeRepo.findById.mockResolvedValue(especialidade);

      await expect(service.findById(1)).resolves.toBe(especialidade);
      expect(mockEspecialidadeRepo.findById).toHaveBeenCalledWith(1);
    });

    it("lança 404 quando a especialidade não existe", async () => {
      mockEspecialidadeRepo.findById.mockResolvedValue(null);

      await expect(service.findById(99)).rejects.toMatchObject({
        statusCode: 404,
        message: "Especialidade não encontrada",
      });
    });
  });

  describe("create", () => {
    it.each([undefined, "", "   "])("lança 400 quando o nome não é informado (%p)", async (nome) => {
      await expect(service.create({ nome: nome as string })).rejects.toMatchObject({
        statusCode: 400,
        message: "O nome da especialidade é obrigatório",
      });
      expect(mockEspecialidadeRepo.create).not.toHaveBeenCalled();
    });

    it("lança 409 quando já existe uma especialidade com o mesmo nome", async () => {
      mockEspecialidadeRepo.findByNome.mockResolvedValue(makeEspecialidade());

      await expect(service.create({ nome: "cardiologia" })).rejects.toMatchObject({
        statusCode: 409,
        message: "Já existe uma especialidade com esse nome",
      });
      expect(mockEspecialidadeRepo.findByNome).toHaveBeenCalledWith("cardiologia");
      expect(mockEspecialidadeRepo.create).not.toHaveBeenCalled();
    });

    it("cria a especialidade com o nome sem espaços nas pontas", async () => {
      const criada = makeEspecialidade({ id: 3, nome: "Dermatologia", descricao: "Pele" });
      mockEspecialidadeRepo.findByNome.mockResolvedValue(null);
      mockEspecialidadeRepo.create.mockResolvedValue(criada);

      const result = await service.create({ nome: "  Dermatologia ", descricao: "Pele" });

      expect(mockEspecialidadeRepo.findByNome).toHaveBeenCalledWith("Dermatologia");
      expect(mockEspecialidadeRepo.create).toHaveBeenCalledWith({
        nome: "Dermatologia",
        descricao: "Pele",
      });
      expect(result).toBe(criada);
    });
  });

  describe("update", () => {
    it("lança 404 quando a especialidade não existe", async () => {
      mockEspecialidadeRepo.findById.mockResolvedValue(null);

      await expect(service.update(99, { nome: "X" })).rejects.toMatchObject({ statusCode: 404 });
      expect(mockEspecialidadeRepo.update).not.toHaveBeenCalled();
    });

    it("lança 400 quando nenhum campo é enviado", async () => {
      mockEspecialidadeRepo.findById.mockResolvedValue(makeEspecialidade());

      await expect(service.update(1, {})).rejects.toMatchObject({
        statusCode: 400,
        message: "Nenhum campo para atualizar",
      });
      expect(mockEspecialidadeRepo.update).not.toHaveBeenCalled();
    });

    it("lança 400 quando o nome enviado está vazio", async () => {
      mockEspecialidadeRepo.findById.mockResolvedValue(makeEspecialidade());

      await expect(service.update(1, { nome: "  " })).rejects.toMatchObject({
        statusCode: 400,
        message: "O nome da especialidade é obrigatório",
      });
    });

    it("lança 409 quando o nome já pertence a outra especialidade", async () => {
      mockEspecialidadeRepo.findById.mockResolvedValue(makeEspecialidade());
      mockEspecialidadeRepo.findByNome.mockResolvedValue(
        makeEspecialidade({ id: 2, nome: "Pediatria" })
      );

      await expect(service.update(1, { nome: "PEDIATRIA" })).rejects.toMatchObject({
        statusCode: 409,
        message: "Já existe uma especialidade com esse nome",
      });
      expect(mockEspecialidadeRepo.update).not.toHaveBeenCalled();
    });

    it("permite manter o próprio nome", async () => {
      const especialidade = makeEspecialidade();
      mockEspecialidadeRepo.findById.mockResolvedValue(especialidade);
      mockEspecialidadeRepo.findByNome.mockResolvedValue(especialidade);
      mockEspecialidadeRepo.update.mockResolvedValue(especialidade);

      await expect(service.update(1, { nome: "Cardiologia" })).resolves.toBe(especialidade);
      expect(mockEspecialidadeRepo.update).toHaveBeenCalledWith(1, { nome: "Cardiologia" });
    });

    it("atualiza apenas a descrição sem verificar o nome", async () => {
      const atualizada = makeEspecialidade({ descricao: "Nova descrição" });
      mockEspecialidadeRepo.findById.mockResolvedValue(makeEspecialidade());
      mockEspecialidadeRepo.update.mockResolvedValue(atualizada);

      await expect(service.update(1, { descricao: "Nova descrição" })).resolves.toBe(atualizada);
      expect(mockEspecialidadeRepo.findByNome).not.toHaveBeenCalled();
      expect(mockEspecialidadeRepo.update).toHaveBeenCalledWith(1, { descricao: "Nova descrição" });
    });

    it("atualiza nome e descrição, removendo espaços do nome", async () => {
      const atualizada = makeEspecialidade({ nome: "Cardiologia Clínica", descricao: "Nova" });
      mockEspecialidadeRepo.findById.mockResolvedValue(makeEspecialidade());
      mockEspecialidadeRepo.findByNome.mockResolvedValue(null);
      mockEspecialidadeRepo.update.mockResolvedValue(atualizada);

      await service.update(1, { nome: " Cardiologia Clínica ", descricao: "Nova" });

      expect(mockEspecialidadeRepo.findByNome).toHaveBeenCalledWith("Cardiologia Clínica");
      expect(mockEspecialidadeRepo.update).toHaveBeenCalledWith(1, {
        nome: "Cardiologia Clínica",
        descricao: "Nova",
      });
    });
  });

  describe("delete", () => {
    it("lança 404 quando a especialidade não existe", async () => {
      mockEspecialidadeRepo.findById.mockResolvedValue(null);

      await expect(service.delete(99)).rejects.toMatchObject({ statusCode: 404 });
      expect(mockEspecialidadeRepo.delete).not.toHaveBeenCalled();
    });

    it("lança 409 quando há médicos vinculados à especialidade", async () => {
      mockEspecialidadeRepo.findById.mockResolvedValue(makeEspecialidade());
      mockMedicoRepo.countByEspecialidadeId.mockResolvedValue(1);

      await expect(service.delete(1)).rejects.toMatchObject({
        statusCode: 409,
        message: "Não é possível remover uma especialidade com médicos vinculados",
      });
      expect(mockMedicoRepo.countByEspecialidadeId).toHaveBeenCalledWith(1);
      expect(mockEspecialidadeRepo.delete).not.toHaveBeenCalled();
    });

    it("remove a especialidade quando não há médicos vinculados", async () => {
      mockEspecialidadeRepo.findById.mockResolvedValue(makeEspecialidade());
      mockMedicoRepo.countByEspecialidadeId.mockResolvedValue(0);

      await service.delete(1);

      expect(mockEspecialidadeRepo.delete).toHaveBeenCalledWith(1);
    });
  });
});
