import { EspecialidadeRepository } from "../../src/repositories/EspecialidadeRepository";

const mockQueryBuilder = {
  where: jest.fn().mockReturnThis(),
  getOne: jest.fn(),
};

const mockOrmRepo = {
  find: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(() => mockQueryBuilder),
};

jest.mock("../../src/database/data-source", () => ({
  AppDataSource: { getRepository: () => mockOrmRepo },
}));

describe("EspecialidadeRepository", () => {
  let repository: EspecialidadeRepository;
  const especialidade = { id: 1, nome: "Cardiologia", descricao: "Coração" };

  beforeEach(() => {
    repository = new EspecialidadeRepository();
  });

  it("findAll retorna as especialidades ordenadas por nome", async () => {
    mockOrmRepo.find.mockResolvedValue([especialidade]);

    await expect(repository.findAll()).resolves.toEqual([especialidade]);
    expect(mockOrmRepo.find).toHaveBeenCalledWith({ order: { nome: "ASC" } });
  });

  it("findById busca pelo id", async () => {
    mockOrmRepo.findOneBy.mockResolvedValue(especialidade);

    await expect(repository.findById(1)).resolves.toBe(especialidade);
    expect(mockOrmRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it("findByNome compara o nome sem diferenciar maiúsculas e minúsculas", async () => {
    mockQueryBuilder.getOne.mockResolvedValue(especialidade);

    await expect(repository.findByNome("CARDIOLOGIA")).resolves.toBe(especialidade);
    expect(mockOrmRepo.createQueryBuilder).toHaveBeenCalledWith("especialidade");
    expect(mockQueryBuilder.where).toHaveBeenCalledWith(
      "LOWER(especialidade.nome) = LOWER(:nome)",
      { nome: "CARDIOLOGIA" }
    );
  });

  it("create cria a entidade e salva no banco", async () => {
    const data = { nome: "Pediatria", descricao: "Crianças" };
    mockOrmRepo.create.mockReturnValue(data);
    mockOrmRepo.save.mockResolvedValue({ ...data, id: 2 });

    await expect(repository.create(data)).resolves.toMatchObject({ id: 2 });
    expect(mockOrmRepo.create).toHaveBeenCalledWith(data);
    expect(mockOrmRepo.save).toHaveBeenCalledWith(data);
  });

  it("update atualiza e retorna a especialidade buscada novamente", async () => {
    const atualizada = { ...especialidade, descricao: "Nova" };
    mockOrmRepo.findOneBy.mockResolvedValue(atualizada);

    await expect(repository.update(1, { descricao: "Nova" })).resolves.toBe(atualizada);
    expect(mockOrmRepo.update).toHaveBeenCalledWith(1, { descricao: "Nova" });
    expect(mockOrmRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it("delete remove pelo id", async () => {
    await repository.delete(1);

    expect(mockOrmRepo.delete).toHaveBeenCalledWith(1);
  });
});
