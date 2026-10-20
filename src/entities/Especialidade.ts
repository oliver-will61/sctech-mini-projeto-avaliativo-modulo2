// Entidade que representa a tabela "especialidades" no banco de dados
// Uma especialidade pode ter vários médicos vinculados (relação 1:N)

import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

// Mapeia esta classe para a tabela "especialidades" no banco
@Entity("especialidades")
export class Especialidade {
  // ID numérico gerado automaticamente (auto-increment)
  @PrimaryGeneratedColumn()
  id!: number;

  // Nome da especialidade (deve ser único no banco)
  @Column({ type: "varchar", length: 100, unique: true })
  nome!: string;

  // Descrição opcional da especialidade
  @Column({ type: "text", nullable: true })
  descricao!: string | null;

  // Relação 1:N com médicos — será adicionada quando a entidade Medico for criada:
  // @OneToMany(() => Medico, (medico) => medico.especialidade)
  // medicos!: Medico[];
}
