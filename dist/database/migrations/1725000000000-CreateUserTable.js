"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserTable1725000000000 = void 0;
class CreateUserTable1725000000000 {
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TYPE user_role AS ENUM ('admin', 'user', 'moderator');

      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role user_role NOT NULL DEFAULT 'user',
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE users;`);
        await queryRunner.query(`DROP TYPE user_role;`);
    }
}
exports.CreateUserTable1725000000000 = CreateUserTable1725000000000;
//# sourceMappingURL=1725000000000-CreateUserTable.js.map