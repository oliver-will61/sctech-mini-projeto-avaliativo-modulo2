// Rotas do CRUD de especialidades
// Todas as rotas exigem autenticação (validaToken)
// RBAC: leitura permitida para Admin e Atendente; escrita/exclusão apenas para Admin

import { Router } from "express";
import { EspecialidadeController } from "../controllers/EspecialidadeController";
import { validaToken } from "../middlewares/validaToken";
import { validaRole } from "../middlewares/validaRole";
import { UserRole } from "../entities/User";
import { asyncHandler } from "../utils/asyncHandler";

const especialidadeRoutes = Router();
const especialidadeController = new EspecialidadeController();

// GET /especialidades — lista todas as especialidades
especialidadeRoutes.get(
  "/especialidades",
  validaToken,
  validaRole(UserRole.ADMIN, UserRole.ATTENDANT),
  asyncHandler((req, res) => especialidadeController.index(req, res))
);

// GET /especialidades/:id — busca uma especialidade pelo ID
especialidadeRoutes.get(
  "/especialidades/:id",
  validaToken,
  validaRole(UserRole.ADMIN, UserRole.ATTENDANT),
  asyncHandler((req, res) => especialidadeController.show(req, res))
);

// POST /especialidades — cadastra uma nova especialidade
especialidadeRoutes.post(
  "/especialidades",
  validaToken,
  validaRole(UserRole.ADMIN),
  asyncHandler((req, res) => especialidadeController.store(req, res))
);

// PUT /especialidades/:id — atualiza uma especialidade
especialidadeRoutes.put(
  "/especialidades/:id",
  validaToken,
  validaRole(UserRole.ADMIN),
  asyncHandler((req, res) => especialidadeController.update(req, res))
);

// DELETE /especialidades/:id — remove uma especialidade (bloqueado se houver médicos vinculados)
especialidadeRoutes.delete(
  "/especialidades/:id",
  validaToken,
  validaRole(UserRole.ADMIN),
  asyncHandler((req, res) => especialidadeController.delete(req, res))
);

export { especialidadeRoutes };
