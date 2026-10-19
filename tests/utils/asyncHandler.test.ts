import { Request, Response } from "express";
import { asyncHandler } from "../../src/utils/asyncHandler";

describe("asyncHandler", () => {
  const req = {} as Request;
  const res = {} as Response;

  it("repassa o erro para o next quando a promise é rejeitada", async () => {
    const error = new Error("falhou");
    const next = jest.fn();

    asyncHandler(() => Promise.reject(error))(req, res, next);
    await new Promise(process.nextTick);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("não chama o next quando a promise é resolvida", async () => {
    const fn = jest.fn().mockResolvedValue(undefined);
    const next = jest.fn();

    asyncHandler(fn)(req, res, next);
    await new Promise(process.nextTick);

    expect(fn).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });
});
