// Interface que define o contrato para repositórios de médico
// Por enquanto contém apenas o necessário para a regra de remoção de especialidades

export interface IMedicoRepository {
  // Retorna quantos médicos estão vinculados a uma especialidade
  countByEspecialidadeId(especialidadeId: number): Promise<number>;
}
