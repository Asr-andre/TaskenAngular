import { environment } from '../../../environments/environment';

/** Resolve a pasta base da app (respeita <base href> em sub-aplicações IIS). */
function baseHrefForFetch(): string {
  const base = document.querySelector('base')?.href;
  if (base) {
    return base.endsWith('/') ? base : `${base}/`;
  }
  return `${window.location.origin}/`;
}

function normalizarApiUrl(linha: string): string {
  return linha.trim().replace(/\/+$/, '');
}

const NOME_FICHEIRO_CONFIG = 'conf.txt';

/**
 * Lê `conf.txt` na raiz da publicação (texto simples; evita `.url` no Windows = atalho da Internet).
 * Falhas mantêm o `apiUrl` do build (`environment.*`).
 */
export function carregarApiUrlEmRuntime(): () => Promise<void> {
  return () =>
    fetch(new URL(NOME_FICHEIRO_CONFIG, baseHrefForFetch()).href, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) {
          console.warn(
            `[${NOME_FICHEIRO_CONFIG}] HTTP ${res.status}; a usar apiUrl do environment (${environment.apiUrl}).`
          );
          return undefined;
        }
        return res.text();
      })
      .then((text) => {
        if (text === undefined) {
          return;
        }
        const linha = text
          .split(/\r?\n/)
          .map((l) => l.trim())
          .find((l) => l.length > 0 && !l.startsWith('#'));
        if (!linha) {
          console.warn(`[${NOME_FICHEIRO_CONFIG}] sem URL valida; a usar apiUrl do environment.`);
          return;
        }
        environment.apiUrl = normalizarApiUrl(linha);
      })
      .catch((err) => {
        console.warn(`[${NOME_FICHEIRO_CONFIG}] nao lido; a usar apiUrl do environment.`, err);
      });
}
