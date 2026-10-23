import { PacienteRepository } from "../../src/repositories/PacienteRepository";

const mockOrmRepo = {
  find: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

jest.mock("../../src/database/data-source", () => ({
  AppDataSource: { getRepository: () => mockOrmRepo },
}));

describe("PacienteRepository", () => {
  let repository: PacienteRepository;
  const paciente = {
    id: 1,
    nome: "João da Silva",
    cpf: "52998224725",
    email: "joao@email.com",
    dataNascimento: "1990-05-20",
  };

  beforeEach(() => {
    repository = new PacienteRepository();
  });

  it("findAll retorna os pacientes em ordem alfabética", async () => {
    mockOrmRepo.find.mockResolvedValue([paciente]);

    await expect(repository.findAll()).resolves.toEqual([paciente]);
    expect(mockOrmRepo.find).toHaveBeenCalledWith({ order: { nome: "ASC" } });
  });

  it("findById busca pelo id", async () => {
    mockOrmRepo.findOneBy.mockResolvedValue(paciente);

    await expect(repository.findById(1)).resolves.toBe(paciente);
    expect(mockOrmRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it("findByCpf busca pelo CPF", async () => {
    mockOrmRepo.findOneBy.mockResolvedValue(null);

    await expect(repository.findByCpf("52998224725")).resolves.toBeNull();
    expect(mockOrmRepo.findOneBy).toHaveBeenCalledWith({ cpf: "52998224725" });
  });

  it("create cria a entidade e salva no banco", async () => {
    const { id, ...data } = paciente;
    mockOrmRepo.create.mockReturnValue(data);
    mockOrmRepo.save.mockResolvedValue(paciente);

    await expect(repository.create(data)).resolves.toBe(paciente);
    expect(mockOrmRepo.create).toHaveBeenCalledWith(data);
    expect(mockOrmRepo.save).toHaveBeenCalledWith(data);
  });

  it("update atualiza e retorna o paciente buscado novamente", async () => {
    mockOrmRepo.findOneBy.mockResolvedValue(paciente);

    await expect(repository.update(1, { nome: "João" })).resolves.toBe(paciente);
    expect(mockOrmRepo.update).toHaveBeenCalledWith(1, { nome: "João" });
    expect(mockOrmRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it("delete remove pelo id", async () => {
    await repository.delete(1);

    expect(mockOrmRepo.delete).toHaveBeenCalledWith(1);
  });
});
