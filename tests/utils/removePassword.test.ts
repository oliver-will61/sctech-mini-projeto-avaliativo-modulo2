import { User } from "../../src/entities/User";
import { removePassword } from "../../src/utils/removePassword";

describe("removePassword", () => {
  it("remove o campo password e mantém os demais", () => {
    const createdAt = new Date();
    const user = {
      id: 1,
      name: "João",
      email: "joao@email.com",
      password: "hash",
      role: "user",
      created_at: createdAt,
    } as User;

    const result = removePassword(user);

    expect(result).toEqual({
      id: 1,
      name: "João",
      email: "joao@email.com",
      role: "user",
      created_at: createdAt,
    });
    expect(result).not.toHaveProperty("password");
  });
});
