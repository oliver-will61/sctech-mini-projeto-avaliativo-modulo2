// Rotas do CRUD de pacientes
// Todas as rotas exigem autenticação (validaToken)
// RBAC: Admin e Atendente podem listar, cadastrar e editar; apenas Admin pode remover

import { Router } from "express";
import { PacienteController } from "../controllers/PacienteController";
import { validaToken } from "../middlewares/validaToken";
import { validaRole } from "../middlewares/validaRole";
import { UserRole } from "../entities/User";
import { asyncHandler } from "../utils/asyncHandler";

const pacienteRoutes = Router();
const pacienteController = new PacienteController();

// GET /pacientes — lista todos os pacientes
pacienteRoutes.get(
  "/pacientes",
  validaToken,
  validaRole(UserRole.ADMIN, UserRole.ATTENDANT),
  asyncHandler((req, res) => pacienteController.index(req, res))
);

// GET /pacientes/:id — busca um paciente pelo ID
pacienteRoutes.get(
  "/pacientes/:id",
  validaToken,
  validaRole(UserRole.ADMIN, UserRole.ATTENDANT),
  asyncHandler((req, res) => pacienteController.show(req, res))
);

// POST /pacientes — cadastra um novo paciente (CPF único e dados em formato válido)
pacienteRoutes.post(
  "/pacientes",
  validaToken,
  validaRole(UserRole.ADMIN, UserRole.ATTENDANT),
  asyncHandler((req, res) => pacienteController.store(req, res))
);

// PUT /pacientes/:id — atualiza um paciente
pacienteRoutes.put(
  "/pacientes/:id",
  validaToken,
  validaRole(UserRole.ADMIN, UserRole.ATTENDANT),
  asyncHandler((req, res) => pacienteController.update(req, res))
);

// DELETE /pacientes/:id — remove um paciente (apenas admin)
pacienteRoutes.delete(
  "/pacientes/:id",
  validaToken,
  validaRole(UserRole.ADMIN),
  asyncHandler((req, res) => pacienteController.delete(req, res))
);

export { pacienteRoutes };
