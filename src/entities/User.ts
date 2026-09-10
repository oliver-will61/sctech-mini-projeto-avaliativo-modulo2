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
export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  MODERATOR = "moderator",
}

// Mapeia esta classe para a tabela "users" no banco
@Entity("users")
export class User {
  // UUID gerado automaticamente como identificador único
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // Nome completo do usuário
  @Column()
  name!: string;

  // E-mail do usuário (deve ser único no banco)
  @Column({ unique: true })
  email!: string;

  // Senha armazenada com hash (select: false impede que seja retornada nas queries por padrão)
  @Column({ select: false })
  password!: string;

  // Perfil de acesso (enum), padrão é "user"
  @Column({ type: "simple-enum", enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  // Data de criação do registro (preenchida automaticamente pelo TypeORM)
  @CreateDateColumn()
  created_at!: Date;
}
