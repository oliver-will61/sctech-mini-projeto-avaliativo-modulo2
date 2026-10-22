import { MedicoService } from "../../src/services/MedicoService";
import { Medico } from "../../src/entities/Medico";

const mockMedicoRepo = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByCrm: jest.fn(),
  countByEspecialidadeId: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockEspecialidadeRepo = {
  findById: jest.fn(),
};

jest.mock("../../src/repositories/MedicoRepository", () => ({
  MedicoRepository: jest.fn().mockImplementation(() => mockMedicoRepo),
}));
jest.mock("../../src/repositories/EspecialidadeRepository", () => ({
  EspecialidadeRepository: jest.fn().mockImplementation(() => mockEspecialidadeRepo),
}));

const especialidade = { id: 1, nome: "Cardiologia", descricao: null };

function makeMedico(overrides: Partial<Medico> = {}): Medico {
  return {
    id: 1,
    nome: "Dra. Ana Souza",
    crm: "12345/SC",
    email: "ana@clinica.com",
    telefone: "(48) 99999-0000",
    especialidadeId: 1,
    especialidade,
    ...overrides,
  } as Medico;
}

const dadosValidos = {
  nome: "Dra. Ana Souza",
  crm: "12345/SC",
  email: "ana@clinica.com",
  telefone: "(48) 99999-0000",
  especialidadeId: 1,
};

describe("MedicoService", () => {
  let service: MedicoService;

  beforeEach(() => {
    service = new MedicoService();
  });

  describe("findAll", () => {
    it("retorna todos os médicos", async () => {
      const medicos = [makeMedico(), makeMedico({ id: 2, crm: "999/SC" })];
      mockMedicoRepo.findAll.mockResolvedValue(medicos);

      await expect(service.findAll()).resolves.toEqual(medicos);
    });
  });

  describe("findById", () => {
    it("retorna o médico encontrado", async () => {
      const medico = makeMedico();
      mockMedicoRepo.findById.mockResolvedValue(medico);

      await expect(service.findById(1)).resolves.toBe(medico);
      expect(mockMedicoRepo.findById).toHaveBeenCalledWith(1);
    });

    it("lança 404 quando o médico não existe", async () => {
      mockMedicoRepo.findById.mockResolvedValue(null);

      await expect(service.findById(99)).rejects.toMatchObject({
        statusCode: 404,
        message: "Médico não encontrado",
      });
    });
  });

  describe("create", () => {
    it.each(["nome", "crm", "email", "telefone"])(
      "lança 400 quando o campo %s não é informado",
      async (campo) => {
        const dados = { ...dadosValidos, [campo]: "  " };

        await expect(service.create(dados)).rejects.toMatchObject({
          statusCode: 400,
          message: `O campo ${campo} é obrigatório`,
        });
        expect(mockMedicoRepo.create).not.toHaveBeenCalled();
      }
    );

    it("lança 400 quando um campo obrigatório não é enviado", async () => {
      const { nome, ...semNome } = dadosValidos;

      await expect(service.create(semNome as typeof dadosValidos)).rejects.toMatchObject({
        statusCode: 400,
        message: "O campo nome é obrigatório",
      });
    });

    it.each([undefined, null, 0, -1, 1.5, "abc"])(
      "lança 400 quando o especialidadeId é inválido (%p)",
      async (especialidadeId) => {
        const dados = { ...dadosValidos, especialidadeId: especialidadeId as unknown as number };

        await expect(service.create(dados)).rejects.toMatchObject({
          statusCode: 400,
          message: "Informe uma especialidade válida (especialidadeId)",
        });
        expect(mockMedicoRepo.create).not.toHaveBeenCalled();
      }
    );

    it("lança 409 quando já existe um médico com o mesmo CRM", async () => {
      mockMedicoRepo.findByCrm.mockResolvedValue(makeMedico({ id: 5 }));

      await expect(service.create({ ...dadosValidos, crm: "12345/sc" })).rejects.toMatchObject({
        statusCode: 409,
        message: "Já existe um médico com esse CRM",
      });
      expect(mockMedicoRepo.findByCrm).toHaveBeenCalledWith("12345/sc");
      expect(mockMedicoRepo.create).not.toHaveBeenCalled();
    });

    it("lança 400 quando a especialidade informada não existe", async () => {
      mockMedicoRepo.findByCrm.mockResolvedValue(null);
      mockEspecialidadeRepo.findById.mockResolvedValue(null);

      await expect(service.create({ ...dadosValidos, especialidadeId: 99 })).rejects.toMatchObject({
        statusCode: 400,
        message: "A especialidade informada não existe",
      });
      expect(mockEspecialidadeRepo.findById).toHaveBeenCalledWith(99);
      expect(mockMedicoRepo.create).not.toHaveBeenCalled();
    });

    it("cria o médico com os campos sem espaços nas pontas", async () => {
      const criado = makeMedico();
      mockMedicoRepo.findByCrm.mockResolvedValue(null);
      mockEspecialidadeRepo.findById.mockResolvedValue(especialidade);
      mockMedicoRepo.create.mockResolvedValue(criado);

      const result = await service.create({
        nome: " Dra. Ana Souza ",
        crm: " 12345/SC ",
        email: " ana@clinica.com ",
        telefone: " (48) 99999-0000 ",
        especialidadeId: "1" as unknown as number,
      });

      expect(mockMedicoRepo.findByCrm).toHaveBeenCalledWith("12345/SC");
      expect(mockMedicoRepo.create).toHaveBeenCalledWith(dadosValidos);
      expect(result).toBe(criado);
    });
  });

  describe("update", () => {
    it("lança 404 quando o médico não existe", async () => {
      mockMedicoRepo.findById.mockResolvedValue(null);

      await expect(service.update(99, { nome: "X" })).rejects.toMatchObject({ statusCode: 404 });
      expect(mockMedicoRepo.update).not.toHaveBeenCalled();
    });

    it("lança 400 quando nenhum campo é enviado", async () => {
      mockMedicoRepo.findById.mockResolvedValue(makeMedico());

      await expect(service.update(1, {})).rejects.toMatchObject({
        statusCode: 400,
        message: "Nenhum campo para atualizar",
      });
      expect(mockMedicoRepo.update).not.toHaveBeenCalled();
    });

    it("lança 400 quando um campo enviado está vazio", async () => {
      mockMedicoRepo.findById.mockResolvedValue(makeMedico());

      await expect(service.update(1, { email: "" })).rejects.toMatchObject({
        statusCode: 400,
        message: "O campo email é obrigatório",
      });
    });

    it("lança 409 quando o CRM já pertence a outro médico", async () => {
      mockMedicoRepo.findById.mockResolvedValue(makeMedico());
      mockMedicoRepo.findByCrm.mockResolvedValue(makeMedico({ id: 2, crm: "999/SC" }));

      await expect(service.update(1, { crm: "999/SC" })).rejects.toMatchObject({
        statusCode: 409,
        message: "Já existe um médico com esse CRM",
      });
      expect(mockMedicoRepo.update).not.toHaveBeenCalled();
    });

    it("permite manter o próprio CRM", async () => {
      const medico = makeMedico();
      mockMedicoRepo.findById.mockResolvedValue(medico);
      mockMedicoRepo.findByCrm.mockResolvedValue(medico);
      mockMedicoRepo.update.mockResolvedValue(medico);

      await expect(service.update(1, { crm: "12345/SC" })).resolves.toBe(medico);
      expect(mockMedicoRepo.update).toHaveBeenCalledWith(1, { crm: "12345/SC" });
    });

    it("lança 400 quando o especialidadeId enviado é inválido", async () => {
      mockMedicoRepo.findById.mockResolvedValue(makeMedico());

      await expect(service.update(1, { especialidadeId: 0 })).rejects.toMatchObject({
        statusCode: 400,
        message: "Informe uma especialidade válida (especialidadeId)",
      });
    });

    it("lança 400 quando a nova especialidade não existe", async () => {
      mockMedicoRepo.findById.mockResolvedValue(makeMedico());
      mockEspecialidadeRepo.findById.mockResolvedValue(null);

      await expect(service.update(1, { especialidadeId: 99 })).rejects.toMatchObject({
        statusCode: 400,
        message: "A especialidade informada não existe",
      });
      expect(mockMedicoRepo.update).not.toHaveBeenCalled();
    });

    it("troca a especialidade quando ela existe", async () => {
      const atualizado = makeMedico({ especialidadeId: 2 });
      mockMedicoRepo.findById.mockResolvedValue(makeMedico());
      mockEspecialidadeRepo.findById.mockResolvedValue({ id: 2, nome: "Pediatria" });
      mockMedicoRepo.update.mockResolvedValue(atualizado);

      await expect(service.update(1, { especialidadeId: 2 })).resolves.toBe(atualizado);
      expect(mockMedicoRepo.update).toHaveBeenCalledWith(1, { especialidadeId: 2 });
    });

    it("atualiza apenas os campos enviados, sem consultar CRM nem especialidade", async () => {
      const atualizado = makeMedico({ telefone: "(48) 3333-0000" });
      mockMedicoRepo.findById.mockResolvedValue(makeMedico());
      mockMedicoRepo.update.mockResolvedValue(atualizado);

      await service.update(1, { telefone: " (48) 3333-0000 ", nome: "Dra. Ana" });

      expect(mockMedicoRepo.findByCrm).not.toHaveBeenCalled();
      expect(mockEspecialidadeRepo.findById).not.toHaveBeenCalled();
      expect(mockMedicoRepo.update).toHaveBeenCalledWith(1, {
        nome: "Dra. Ana",
        telefone: "(48) 3333-0000",
      });
    });
  });

  describe("delete", () => {
    it("lança 404 quando o médico não existe", async () => {
      mockMedicoRepo.findById.mockResolvedValue(null);

      await expect(service.delete(99)).rejects.toMatchObject({ statusCode: 404 });
      expect(mockMedicoRepo.delete).not.toHaveBeenCalled();
    });

    it("remove o médico quando ele existe", async () => {
      mockMedicoRepo.findById.mockResolvedValue(makeMedico());

      await service.delete(1);

      expect(mockMedicoRepo.delete).toHaveBeenCalledWith(1);
    });
  });
});
