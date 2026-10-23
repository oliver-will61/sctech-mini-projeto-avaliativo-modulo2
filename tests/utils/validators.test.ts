import {
  normalizarCpf,
  cpfValido,
  emailValido,
  dataValida,
  dataNoFuturo,
} from "../../src/utils/validators";

describe("validators", () => {
  describe("normalizarCpf", () => {
    it("remove pontos, traço e espaços", () => {
      expect(normalizarCpf(" 529.982.247-25 ")).toBe("52998224725");
    });
  });

  describe("cpfValido", () => {
    it.each(["529.982.247-25", "52998224725", "111.444.777-35"])(
      "aceita CPF válido (%s)",
      (cpf) => {
        expect(cpfValido(cpf)).toBe(true);
      }
    );

    it.each([
      ["dígito verificador errado", "529.982.247-26"],
      ["segundo dígito errado", "529.982.247-24"],
      ["todos os dígitos iguais", "111.111.111-11"],
      ["poucos dígitos", "5299822472"],
      ["dígitos demais", "529982247251"],
      ["máscara incompleta", "529.982.24725"],
      ["letras", "529.982.247-2a"],
      ["vazio", ""],
    ])("rejeita CPF inválido: %s (%s)", (_motivo, cpf) => {
      expect(cpfValido(cpf)).toBe(false);
    });
  });

  describe("emailValido", () => {
    it.each(["joao@email.com", "maria.silva+teste@clinica.com.br"])("aceita %s", (email) => {
      expect(emailValido(email)).toBe(true);
    });

    it.each(["joao", "joao@", "@email.com", "joao@email", "joao silva@email.com", ""])(
      "rejeita %p",
      (email) => {
        expect(emailValido(email)).toBe(false);
      }
    );
  });

  describe("dataValida", () => {
    it.each(["1990-05-20", "2000-02-29", "2024-12-31"])("aceita %s", (data) => {
      expect(dataValida(data)).toBe(true);
    });

    it.each([
      ["formato brasileiro", "20/05/1990"],
      ["sem zeros à esquerda", "1990-5-20"],
      ["mês inexistente", "1990-13-01"],
      ["dia inexistente", "2023-02-29"],
      ["dia 31 em mês de 30", "2024-04-31"],
      ["texto", "ontem"],
      ["vazio", ""],
    ])("rejeita %s (%s)", (_motivo, data) => {
      expect(dataValida(data)).toBe(false);
    });
  });

  describe("dataNoFuturo", () => {
    function formatar(data: Date): string {
      const mes = String(data.getMonth() + 1).padStart(2, "0");
      const dia = String(data.getDate()).padStart(2, "0");
      return `${data.getFullYear()}-${mes}-${dia}`;
    }

    it("retorna true para amanhã", () => {
      const amanha = new Date();
      amanha.setDate(amanha.getDate() + 1);

      expect(dataNoFuturo(formatar(amanha))).toBe(true);
    });

    it("retorna false para hoje e para datas passadas", () => {
      expect(dataNoFuturo(formatar(new Date()))).toBe(false);
      expect(dataNoFuturo("1990-05-20")).toBe(false);
    });
  });
});
