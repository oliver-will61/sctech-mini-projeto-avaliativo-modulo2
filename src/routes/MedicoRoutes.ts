// Rotas do CRUD de médicos
// Todas as rotas exigem autenticação (validaToken)
// RBAC: leitura permitida para Admin e Atendente; escrita/exclusão apenas para Admin

import { Router } from "express";
import { MedicoController } from "../controllers/MedicoController";
import { validaToken } from "../middlewares/validaToken";
import { validaRole } from "../middlewares/validaRole";
import { UserRole } from "../entities/User";
import { asyncHandler } from "../utils/asyncHandler";

const medicoRoutes = Router();
const medicoController = new MedicoController();

// GET /medicos — lista todos os médicos
medicoRoutes.get(
  "/medicos",
  validaToken,
  validaRole(UserRole.ADMIN, UserRole.ATTENDANT),
  asyncHandler((req, res) => medicoController.index(req, res))
);

// GET /medicos/:id — busca um médico pelo ID
medicoRoutes.get(
  "/medicos/:id",
  validaToken,
  validaRole(UserRole.ADMIN, UserRole.ATTENDANT),
  asyncHandler((req, res) => medicoController.show(req, res))
);

// POST /medicos — cadastra um novo médico (CRM único e especialidade existente)
medicoRoutes.post(
  "/medicos",
  validaToken,
  validaRole(UserRole.ADMIN),
  asyncHandler((req, res) => medicoController.store(req, res))
);

// PUT /medicos/:id — atualiza um médico
medicoRoutes.put(
  "/medicos/:id",
  validaToken,
  validaRole(UserRole.ADMIN),
  asyncHandler((req, res) => medicoController.update(req, res))
);

// DELETE /medicos/:id — remove um médico
medicoRoutes.delete(
  "/medicos/:id",
  validaToken,
  validaRole(UserRole.ADMIN),
  asyncHandler((req, res) => medicoController.delete(req, res))
);

export { medicoRoutes };
