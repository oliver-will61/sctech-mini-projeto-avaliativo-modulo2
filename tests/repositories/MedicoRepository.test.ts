import { MedicoRepository } from "../../src/repositories/MedicoRepository";

describe("MedicoRepository (implementação provisória)", () => {
  it("retorna 0 médicos vinculados enquanto a entidade Medico não existe", async () => {
    await expect(new MedicoRepository().countByEspecialidadeId(1)).resolves.toBe(0);
  });
});
