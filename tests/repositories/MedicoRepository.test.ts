import { MedicoRepository } from "../../src/repositories/MedicoRepository";

const mockQueryBuilder = {
  where: jest.fn().mockReturnThis(),
  getOne: jest.fn(),
};

const mockOrmRepo = {
  find: jest.fn(),
  findOne: jest.fn(),
  count: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(() => mockQueryBuilder),
};

jest.mock("../../src/database/data-source", () => ({
  AppDataSource: { getRepository: () => mockOrmRepo },
}));

describe("MedicoRepository", () => {
  let repository: MedicoRepository;
  const medico = {
    id: 1,
    nome: "Dra. Ana Souza",
    crm: "12345/SC",
    email: "ana@clinica.com",
    telefone: "(48) 99999-0000",
    especialidadeId: 1,
    especialidade: { id: 1, nome: "Cardiologia", descricao: null },
  };

  beforeEach(() => {
    repository = new MedicoRepository();
  });

  it("findAll retorna os médicos com a especialidade, em ordem alfabética", async () => {
    mockOrmRepo.find.mockResolvedValue([medico]);

    await expect(repository.findAll()).resolves.toEqual([medico]);
    expect(mockOrmRepo.find).toHaveBeenCalledWith({
      relations: { especialidade: true },
      order: { nome: "ASC" },
    });
  });

  it("findById busca pelo id carregando a especialidade", async () => {
    mockOrmRepo.findOne.mockResolvedValue(medico);

    await expect(repository.findById(1)).resolves.toBe(medico);
    expect(mockOrmRepo.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: { especialidade: true },
    });
  });

  it("findByCrm compara o CRM sem diferenciar maiúsculas e minúsculas", async () => {
    mockQueryBuilder.getOne.mockResolvedValue(medico);

    await expect(repository.findByCrm("12345/sc")).resolves.toBe(medico);
    expect(mockOrmRepo.createQueryBuilder).toHaveBeenCalledWith("medico");
    expect(mockQueryBuilder.where).toHaveBeenCalledWith("LOWER(medico.crm) = LOWER(:crm)", {
      crm: "12345/sc",
    });
  });

  it("countByEspecialidadeId conta os médicos da especialidade", async () => {
    mockOrmRepo.count.mockResolvedValue(3);

    await expect(repository.countByEspecialidadeId(1)).resolves.toBe(3);
    expect(mockOrmRepo.count).toHaveBeenCalledWith({ where: { especialidadeId: 1 } });
  });

  it("create salva o médico e retorna o registro com a especialidade", async () => {
    const { id, especialidade, ...data } = medico;
    mockOrmRepo.create.mockReturnValue(data);
    mockOrmRepo.save.mockResolvedValue({ ...data, id: 1 });
    mockOrmRepo.findOne.mockResolvedValue(medico);

    await expect(repository.create(data)).resolves.toBe(medico);
    expect(mockOrmRepo.create).toHaveBeenCalledWith(data);
    expect(mockOrmRepo.save).toHaveBeenCalledWith(data);
    expect(mockOrmRepo.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: { especialidade: true },
    });
  });

  it("update atualiza e retorna o médico buscado novamente", async () => {
    mockOrmRepo.findOne.mockResolvedValue(medico);

    await expect(repository.update(1, { telefone: "123" })).resolves.toBe(medico);
    expect(mockOrmRepo.update).toHaveBeenCalledWith(1, { telefone: "123" });
    expect(mockOrmRepo.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: { especialidade: true },
    });
  });

  it("delete remove pelo id", async () => {
    await repository.delete(1);

    expect(mockOrmRepo.delete).toHaveBeenCalledWith(1);
  });
});
