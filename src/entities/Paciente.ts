// Entidade que representa a tabela "pacientes" no banco de dados
// Cada propriedade decorada mapeia para uma coluna da tabela

import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

// Mapeia esta classe para a tabela "pacientes" no banco
@Entity("pacientes")
export class Paciente {
  // ID numérico gerado automaticamente (auto-increment)
  @PrimaryGeneratedColumn()
  id!: number;

  // Nome completo do paciente
  @Column({ type: "varchar", length: 255 })
  nome!: string;

  // CPF armazenado apenas com os 11 números (deve ser único no banco)
  @Column({ type: "char", length: 11, unique: true })
  cpf!: string;

  // E-mail do paciente (armazenado em minúsculas)
  @Column({ type: "varchar", length: 255 })
  email!: string;

  // Data de nascimento no formato AAAA-MM-DD (coluna "data_nascimento")
  @Column({ name: "data_nascimento", type: "date" })
  dataNascimento!: string;
}
