// Entidade que representa a tabela "medicos" no banco de dados
// Todo médico pertence a uma especialidade (relação N:1)

import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Especialidade } from "./Especialidade";

// Mapeia esta classe para a tabela "medicos" no banco
@Entity("medicos")
export class Medico {
  // ID numérico gerado automaticamente (auto-increment)
  @PrimaryGeneratedColumn()
  id!: number;

  // Nome completo do médico
  @Column({ type: "varchar", length: 255 })
  nome!: string;

  // CRM do médico (deve ser único no banco)
  @Column({ type: "varchar", length: 20, unique: true })
  crm!: string;

  // E-mail de contato do médico
  @Column({ type: "varchar", length: 255 })
  email!: string;

  // Telefone de contato do médico
  @Column({ type: "varchar", length: 20 })
  telefone!: string;

  // Chave estrangeira para a especialidade (coluna "especialidade_id")
  @Column({ name: "especialidade_id" })
  especialidadeId!: number;

  // Especialidade do médico
  // onDelete RESTRICT: o banco também impede remover uma especialidade com médicos vinculados
  @ManyToOne(() => Especialidade, (especialidade) => especialidade.medicos, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "especialidade_id" })
  especialidade!: Especialidade;
}
