// Entidade que representa a tabela "users" no banco de dados
// Cada propriedade decorada mapeia para uma coluna da tabela

import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

// Enum que define os perfis de acesso permitidos no sistema
// Admin possui acesso completo; Atendente possui acesso operacional restrito
export enum UserRole {
  ADMIN = "admin",
  ATTENDANT = "atendente",
  USER = "user",
  MODERATOR = "moderator",
}

// Mapeia esta classe para a tabela "users" no banco
@Entity("users")
export class User {
  // ID numérico gerado automaticamente (auto-increment)
  @PrimaryGeneratedColumn()
  id!: number;

  // Nome completo do usuário
  @Column()
  name!: string;

  // E-mail do usuário (deve ser único no banco)
  @Column({ unique: true })
  email!: string;

  // Senha armazenada com hash (select: false impede que seja retornada nas queries por padrão)
  @Column({ select: false })
  password!: string;

  // Perfil de acesso (string), padrão é "user"
  @Column({ type: "varchar", length: 50, default: "user" })
  role!: string;

  // Data de criação do registro (preenchida automaticamente pelo TypeORM)
  @CreateDateColumn()
  created_at!: Date;
}
