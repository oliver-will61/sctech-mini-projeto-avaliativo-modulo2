import { UserRepository } from "../../src/repositories/UserRepository";

const mockQueryBuilder = {
  addSelect: jest.fn().mockReturnThis(),
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

describe("UserRepository", () => {
  let repository: UserRepository;
  const user = { id: 1, name: "João", email: "joao@email.com", role: "user" };

  beforeEach(() => {
    repository = new UserRepository();
  });

  it("findAll retorna todos os usuários", async () => {
    mockOrmRepo.find.mockResolvedValue([user]);

    await expect(repository.findAll()).resolves.toEqual([user]);
    expect(mockOrmRepo.find).toHaveBeenCalled();
  });

  it("findById busca pelo id", async () => {
    mockOrmRepo.findOneBy.mockResolvedValue(user);

    await expect(repository.findById(1)).resolves.toBe(user);
    expect(mockOrmRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it("findByEmail busca pelo e-mail", async () => {
    mockOrmRepo.findOneBy.mockResolvedValue(null);

    await expect(repository.findByEmail("x@email.com")).resolves.toBeNull();
    expect(mockOrmRepo.findOneBy).toHaveBeenCalledWith({ email: "x@email.com" });
  });

  it("findByEmailWithPassword seleciona a senha explicitamente", async () => {
    const withPassword = { ...user, password: "hash" };
    mockQueryBuilder.getOne.mockResolvedValue(withPassword);

    await expect(repository.findByEmailWithPassword("joao@email.com")).resolves.toBe(
      withPassword
    );
    expect(mockOrmRepo.createQueryBuilder).toHaveBeenCalledWith("user");
    expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith("user.password");
    expect(mockQueryBuilder.where).toHaveBeenCalledWith("user.email = :email", {
      email: "joao@email.com",
    });
  });

  it("create cria a entidade e salva no banco", async () => {
    const data = { name: "Maria", email: "maria@email.com", password: "hash" };
    const entity = { ...data };
    mockOrmRepo.create.mockReturnValue(entity);
    mockOrmRepo.save.mockResolvedValue({ ...entity, id: 2 });

    await expect(repository.create(data)).resolves.toMatchObject({ id: 2 });
    expect(mockOrmRepo.create).toHaveBeenCalledWith(data);
    expect(mockOrmRepo.save).toHaveBeenCalledWith(entity);
  });

  it("update atualiza e retorna o usuário buscado novamente", async () => {
    const updated = { ...user, name: "João Atualizado" };
    mockOrmRepo.update.mockResolvedValue(undefined);
    mockOrmRepo.findOneBy.mockResolvedValue(updated);

    await expect(repository.update(1, { name: "João Atualizado" })).resolves.toBe(updated);
    expect(mockOrmRepo.update).toHaveBeenCalledWith(1, { name: "João Atualizado" });
    expect(mockOrmRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it("delete remove pelo id", async () => {
    mockOrmRepo.delete.mockResolvedValue(undefined);

    await repository.delete(1);

    expect(mockOrmRepo.delete).toHaveBeenCalledWith(1);
  });
});
