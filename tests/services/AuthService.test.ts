import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthService } from "../../src/services/AuthService";

const mockRepo = {
  findByEmailWithPassword: jest.fn(),
};

jest.mock("../../src/repositories/UserRepository", () => ({
  UserRepository: jest.fn().mockImplementation(() => mockRepo),
}));
jest.mock("bcrypt");

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const SECRET = "segredo_de_teste";

const storedUser = {
  id: 1,
  name: "Admin",
  email: "admin@email.com",
  password: "hash",
  role: "admin",
  created_at: new Date("2025-01-01"),
};

describe("AuthService", () => {
  let service: AuthService;

  beforeAll(() => {
    process.env.JWT_SECRET = SECRET;
  });

  beforeEach(() => {
    service = new AuthService();
  });

  it.each([
    { email: "", password: "senha" },
    { email: "admin@email.com", password: "" },
  ])("lança 400 quando falta e-mail ou senha (%o)", async (dto) => {
    await expect(service.login(dto)).rejects.toMatchObject({
      statusCode: 400,
      message: "E-mail e senha são obrigatórios",
    });
    expect(mockRepo.findByEmailWithPassword).not.toHaveBeenCalled();
  });

  it("lança 401 quando o e-mail não está cadastrado", async () => {
    mockRepo.findByEmailWithPassword.mockResolvedValue(null);

    await expect(
      service.login({ email: "x@email.com", password: "senha" })
    ).rejects.toMatchObject({ statusCode: 401, message: "Credenciais inválidas" });
  });

  it("lança 401 quando a senha não confere", async () => {
    mockRepo.findByEmailWithPassword.mockResolvedValue(storedUser);
    mockedBcrypt.compare.mockResolvedValue(false as never);

    await expect(
      service.login({ email: "admin@email.com", password: "errada" })
    ).rejects.toMatchObject({ statusCode: 401, message: "Credenciais inválidas" });
    expect(mockedBcrypt.compare).toHaveBeenCalledWith("errada", "hash");
  });

  it("retorna o usuário sem senha e um token com id e role", async () => {
    mockRepo.findByEmailWithPassword.mockResolvedValue(storedUser);
    mockedBcrypt.compare.mockResolvedValue(true as never);

    const result = await service.login({ email: "admin@email.com", password: "certa" });

    expect(mockRepo.findByEmailWithPassword).toHaveBeenCalledWith("admin@email.com");
    expect(result.user).not.toHaveProperty("password");
    expect(result.user).toMatchObject({ id: 1, email: "admin@email.com", role: "admin" });

    const payload = jwt.verify(result.token, SECRET) as jwt.JwtPayload;
    expect(payload).toMatchObject({ id: 1, role: "admin" });
    expect(payload.exp).toBeDefined();
  });
});
