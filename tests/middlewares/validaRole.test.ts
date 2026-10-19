import { Response } from "express";
import { validaRole } from "../../src/middlewares/validaRole";
import { AuthRequest } from "../../src/middlewares/validaToken";
import { UserRole } from "../../src/entities/User";

describe("validaRole", () => {
  const res = {} as Response;

  it("lança 401 quando não há usuário autenticado", () => {
    const next = jest.fn();
    const req = {} as AuthRequest;

    expect(() => validaRole(UserRole.ADMIN)(req, res, next)).toThrow(
      expect.objectContaining({ statusCode: 401 })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("lança 403 quando o perfil não tem permissão", () => {
    const next = jest.fn();
    const req = { user: { id: 1, role: UserRole.USER } } as AuthRequest;

    expect(() => validaRole(UserRole.ADMIN, UserRole.ATTENDANT)(req, res, next)).toThrow(
      expect.objectContaining({ statusCode: 403 })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("chama o next quando o perfil tem permissão", () => {
    const next = jest.fn();
    const req = { user: { id: 1, role: UserRole.ATTENDANT } } as AuthRequest;

    validaRole(UserRole.ADMIN, UserRole.ATTENDANT)(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
