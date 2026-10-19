import bcrypt from "bcrypt";
import { UserService } from "../../src/services/UserService";
import { User } from "../../src/entities/User";

const mockRepo = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findByEmailWithPassword: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

jest.mock("../../src/repositories/UserRepository", () => ({
  UserRepository: jest.fn().mockImplementation(() => mockRepo),
}));
jest.mock("bcrypt");

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    name: "João",
    email: "joao@email.com",
    password: "hash_antigo",
    role: "user",
    created_at: new Date("2025-01-01"),
    ...overrides,
  };
}

describe("UserService", () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  describe("findAll", () => {
    it("retorna os usuários sem a senha", async () => {
      mockRepo.findAll.mockResolvedValue([makeUser(), makeUser({ id: 2 })]);

      const users = await service.findAll();

      expect(users).toHaveLength(2);
      users.forEach((user) => expect(user).not.toHaveProperty("password"));
    });
  });

  describe("findById", () => {
    it("retorna o usuário sem a senha", async () => {
      mockRepo.findById.mockResolvedValue(makeUser());

      const user = await service.findById(1);

      expect(mockRepo.findById).toHaveBeenCalledWith(1);
      expect(user).toMatchObject({ id: 1, email: "joao@email.com" });
      expect(user).not.toHaveProperty("password");
    });

    it("lança 404 quando o usuário não existe", async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(service.findById(99)).rejects.toMatchObject({
        statusCode: 404,
        message: "Usuário não encontrado",
      });
    });
  });

  describe("findByEmail", () => {
    it("delega a busca ao repositório", async () => {
      const user = makeUser();
      mockRepo.findByEmail.mockResolvedValue(user);

      await expect(service.findByEmail("joao@email.com")).resolves.toBe(user);
      expect(mockRepo.findByEmail).toHaveBeenCalledWith("joao@email.com");
    });
  });

  describe("create", () => {
    const dto = {
      name: "Maria",
      email: "maria@email.com",
      password: "senha123",
      role: "admin",
    };

    it("lança 409 quando o e-mail já está cadastrado", async () => {
      mockRepo.findByEmail.mockResolvedValue(makeUser());

      await expect(service.create(dto)).rejects.toMatchObject({
        statusCode: 409,
        message: "E-mail já cadastrado",
      });
      expect(mockRepo.create).not.toHaveBeenCalled();
    });

    it("salva a senha com hash e retorna o usuário sem a senha", async () => {
      mockRepo.findByEmail.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue("hash_gerado" as never);
      mockRepo.create.mockImplementation(async (data) =>
        makeUser({ ...data, id: 2 })
      );

      const user = await service.create(dto);

      expect(mockedBcrypt.hash).toHaveBeenCalledWith("senha123", 10);
      expect(mockRepo.create).toHaveBeenCalledWith({
        name: "Maria",
        email: "maria@email.com",
        password: "hash_gerado",
        role: "admin",
      });
      expect(user).toMatchObject({ id: 2, name: "Maria", role: "admin" });
      expect(user).not.toHaveProperty("password");
    });
  });

  describe("update", () => {
    it("lança 404 quando o usuário não existe", async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(service.update(99, { name: "X" })).rejects.toMatchObject({
        statusCode: 404,
      });
      expect(mockRepo.update).not.toHaveBeenCalled();
    });

    it("atualiza sem gerar hash quando a senha não é enviada", async () => {
      mockRepo.findById.mockResolvedValue(makeUser());
      mockRepo.update.mockResolvedValue(makeUser({ name: "João Atualizado" }));

      const user = await service.update(1, { name: "João Atualizado" });

      expect(mockedBcrypt.hash).not.toHaveBeenCalled();
      expect(mockRepo.update).toHaveBeenCalledWith(1, { name: "João Atualizado" });
      expect(user).toMatchObject({ name: "João Atualizado" });
      expect(user).not.toHaveProperty("password");
    });

    it("gera hash da nova senha antes de salvar", async () => {
      mockRepo.findById.mockResolvedValue(makeUser());
      mockedBcrypt.hash.mockResolvedValue("novo_hash" as never);
      mockRepo.update.mockResolvedValue(makeUser({ password: "novo_hash" }));

      const user = await service.update(1, { password: "nova_senha" });

      expect(mockedBcrypt.hash).toHaveBeenCalledWith("nova_senha", 10);
      expect(mockRepo.update).toHaveBeenCalledWith(1, { password: "novo_hash" });
      expect(user).not.toHaveProperty("password");
    });
  });

  describe("delete", () => {
    it("lança 404 quando o usuário não existe", async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(service.delete(99)).rejects.toMatchObject({ statusCode: 404 });
      expect(mockRepo.delete).not.toHaveBeenCalled();
    });

    it("remove o usuário quando ele existe", async () => {
      mockRepo.findById.mockResolvedValue(makeUser());

      await service.delete(1);

      expect(mockRepo.delete).toHaveBeenCalledWith(1);
    });
  });
});
