// Implementação PROVISÓRIA do repositório de médico
// A entidade Medico ainda não existe, então nenhuma especialidade possui médicos vinculados
// Quando a entidade Medico for criada, substituir por uma consulta real, por exemplo:
//   private repository = AppDataSource.getRepository(Medico);
//   return this.repository.count({ where: { especialidade: { id: especialidadeId } } });

import { IMedicoRepository } from "./IMedicoRepository";

export class MedicoRepository implements IMedicoRepository {
  // Retorna a quantidade de médicos vinculados à especialidade (sempre 0 por enquanto)
  async countByEspecialidadeId(_especialidadeId: number): Promise<number> {
    return 0;
  }
}
