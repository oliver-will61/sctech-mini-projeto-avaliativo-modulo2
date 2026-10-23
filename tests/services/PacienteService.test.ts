import { PacienteService } from "../../src/services/PacienteService";
import { Paciente } from "../../src/entities/Paciente";

const mockPacienteRepo = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByCpf: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

jest.mock("../../src/repositories/PacienteRepository", () => ({
  PacienteRepository: jest.fn().mockImplementation(() => mockPacienteRepo),
}));

function makePaciente(overrides: Partial<Paciente> = {}): Paciente {
  return {
    id: 1,
    nome: "João da Silva",
    cpf: "52998224725",
    email: "joao@email.com",
    dataNascimento: "1990-05-20",
    ...overrides,
  } as Paciente;
}

const dadosValidos = {
  nome: "João da Silva",
  cpf: "529.982.247-25",
  email: "joao@email.com",
  dataNascimento: "1990-05-20",
};

describe("PacienteService", () => {
  let service: PacienteService;

  beforeEach(() => {
    service = new PacienteService();
  });

  describe("findAll", () => {
    it("retorna todos os pacientes", async () => {
      const pacientes = [makePaciente(), makePaciente({ id: 2, cpf: "11144477735" })];
      mockPacienteRepo.findAll.mockResolvedValue(pacientes);

      await expect(service.findAll()).resolves.toEqual(pacientes);
    });
  });

  describe("findById", () => {
    it("retorna o paciente encontrado", async () => {
      const paciente = makePaciente();
      mockPacienteRepo.findById.mockResolvedValue(paciente);

      await expect(service.findById(1)).resolves.toBe(paciente);
      expect(mockPacienteRepo.findById).toHaveBeenCalledWith(1);
    });

    it("lança 404 quando o paciente não existe", async () => {
      mockPacienteRepo.findById.mockResolvedValue(null);

      await expect(service.findById(99)).rejects.toMatchObject({
        statusCode: 404,
        message: "Paciente não encontrado",
      });
    });
  });

  describe("create", () => {
    it.each(["nome", "cpf", "email", "dataNascimento"])(
      "lança 400 quando o campo %s não é informado",
      async (campo) => {
        const dados = { ...dadosValidos, [campo]: "  " };

        await expect(service.create(dados)).rejects.toMatchObject({
          statusCode: 400,
          message: `O campo ${campo} é obrigatório`,
        });
        expect(mockPacienteRepo.create).not.toHaveBeenCalled();
      }
    );

    it("lança 400 quando um campo obrigatório não é enviado", async () => {
      const { email, ...semEmail } = dadosValidos;

      await expect(service.create(semEmail as typeof dadosValidos)).rejects.toMatchObject({
        statusCode: 400,
        message: "O campo email é obrigatório",
      });
    });

    it("lança 400 quando o CPF é inválido", async () => {
      await expect(
        service.create({ ...dadosValidos, cpf: "111.111.111-11" })
      ).rejects.toMatchObject({ statusCode: 400, message: "CPF inválido" });
      expect(mockPacienteRepo.create).not.toHaveBeenCalled();
    });

    it("lança 400 quando o e-mail é inválido", async () => {
      await expect(
        service.create({ ...dadosValidos, email: "joao@email" })
      ).rejects.toMatchObject({ statusCode: 400, message: "E-mail inválido" });
    });

    it("lança 400 quando a data de nascimento tem formato inválido", async () => {
      await expect(
        service.create({ ...dadosValidos, dataNascimento: "20/05/1990" })
      ).rejects.toMatchObject({
        statusCode: 400,
        message: "Data de nascimento inválida (use o formato AAAA-MM-DD)",
      });
    });

    it("lança 400 quando a data de nascimento está no futuro", async () => {
      await expect(
        service.create({ ...dadosValidos, dataNascimento: "3000-01-01" })
      ).rejects.toMatchObject({
        statusCode: 400,
        message: "A data de nascimento não pode ser no futuro",
      });
    });

    it("lança 409 quando já existe um paciente com o mesmo CPF", async () => {
      mockPacienteRepo.findByCpf.mockResolvedValue(makePaciente({ id: 5 }));

      await expect(service.create(dadosValidos)).rejects.toMatchObject({
        statusCode: 409,
        message: "Já existe um paciente com esse CPF",
      });
      expect(mockPacienteRepo.findByCpf).toHaveBeenCalledWith("52998224725");
      expect(mockPacienteRepo.create).not.toHaveBeenCalled();
    });

    it("cria o paciente com CPF só com números e e-mail em minúsculas", async () => {
      const criado = makePaciente();
      mockPacienteRepo.findByCpf.mockResolvedValue(null);
      mockPacienteRepo.create.mockResolvedValue(criado);

      const result = await service.create({
        nome: " João da Silva ",
        cpf: " 529.982.247-25 ",
        email: " Joao@Email.com ",
        dataNascimento: " 1990-05-20 ",
      });

      expect(mockPacienteRepo.create).toHaveBeenCalledWith({
        nome: "João da Silva",
        cpf: "52998224725",
        email: "joao@email.com",
        dataNascimento: "1990-05-20",
      });
      expect(result).toBe(criado);
    });
  });

  describe("update", () => {
    it("lança 404 quando o paciente não existe", async () => {
      mockPacienteRepo.findById.mockResolvedValue(null);

      await expect(service.update(99, { nome: "X" })).rejects.toMatchObject({ statusCode: 404 });
      expect(mockPacienteRepo.update).not.toHaveBeenCalled();
    });

    it("lança 400 quando nenhum campo é enviado", async () => {
      mockPacienteRepo.findById.mockResolvedValue(makePaciente());

      await expect(service.update(1, {})).rejects.toMatchObject({
        statusCode: 400,
        message: "Nenhum campo para atualizar",
      });
      expect(mockPacienteRepo.update).not.toHaveBeenCalled();
    });

    it("lança 400 quando um campo enviado está vazio", async () => {
      mockPacienteRepo.findById.mockResolvedValue(makePaciente());

      await expect(service.update(1, { nome: "" })).rejects.toMatchObject({
        statusCode: 400,
        message: "O campo nome é obrigatório",
      });
    });

    it.each([
      [{ cpf: "123.456.789-00" }, "CPF inválido"],
      [{ email: "invalido" }, "E-mail inválido"],
      [{ dataNascimento: "1990-02-30" }, "Data de nascimento inválida (use o formato AAAA-MM-DD)"],
      [{ dataNascimento: "3000-01-01" }, "A data de nascimento não pode ser no futuro"],
    ])("lança 400 quando o dado enviado é inválido (%o)", async (dados, mensagem) => {
      mockPacienteRepo.findById.mockResolvedValue(makePaciente());

      await expect(service.update(1, dados)).rejects.toMatchObject({
        statusCode: 400,
        message: mensagem,
      });
      expect(mockPacienteRepo.update).not.toHaveBeenCalled();
    });

    it("lança 409 quando o CPF já pertence a outro paciente", async () => {
      mockPacienteRepo.findById.mockResolvedValue(makePaciente());
      mockPacienteRepo.findByCpf.mockResolvedValue(makePaciente({ id: 2, cpf: "11144477735" }));

      await expect(service.update(1, { cpf: "111.444.777-35" })).rejects.toMatchObject({
        statusCode: 409,
        message: "Já existe um paciente com esse CPF",
      });
      expect(mockPacienteRepo.findByCpf).toHaveBeenCalledWith("11144477735");
      expect(mockPacienteRepo.update).not.toHaveBeenCalled();
    });

    it("permite manter o próprio CPF", async () => {
      const paciente = makePaciente();
      mockPacienteRepo.findById.mockResolvedValue(paciente);
      mockPacienteRepo.findByCpf.mockResolvedValue(paciente);
      mockPacienteRepo.update.mockResolvedValue(paciente);

      await expect(service.update(1, { cpf: "529.982.247-25" })).resolves.toBe(paciente);
      expect(mockPacienteRepo.update).toHaveBeenCalledWith(1, { cpf: "52998224725" });
    });

    it("atualiza apenas os campos enviados, sem consultar o CPF", async () => {
      const atualizado = makePaciente({ email: "novo@email.com" });
      mockPacienteRepo.findById.mockResolvedValue(makePaciente());
      mockPacienteRepo.update.mockResolvedValue(atualizado);

      await expect(
        service.update(1, { email: " Novo@Email.com ", dataNascimento: "1991-01-10" })
      ).resolves.toBe(atualizado);
      expect(mockPacienteRepo.findByCpf).not.toHaveBeenCalled();
      expect(mockPacienteRepo.update).toHaveBeenCalledWith(1, {
        email: "novo@email.com",
        dataNascimento: "1991-01-10",
      });
    });
  });

  describe("delete", () => {
    it("lança 404 quando o paciente não existe", async () => {
      mockPacienteRepo.findById.mockResolvedValue(null);

      await expect(service.delete(99)).rejects.toMatchObject({ statusCode: 404 });
      expect(mockPacienteRepo.delete).not.toHaveBeenCalled();
    });

    it("remove o paciente quando ele existe", async () => {
      mockPacienteRepo.findById.mockResolvedValue(makePaciente());

      await service.delete(1);

      expect(mockPacienteRepo.delete).toHaveBeenCalledWith(1);
    });
  });
});
