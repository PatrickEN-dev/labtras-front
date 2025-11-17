/**
 * Utilitários para trabalhar com DOM de forma segura em SSR
 */

// Utilitário para verificar se estamos no cliente (browser)
export const isClient = typeof window !== "undefined" && typeof document !== "undefined";

// Utilitário seguro para acessar document
export const safeDocument = isClient ? document : undefined;

// Utilitário seguro para acessar window
export const safeWindow = isClient ? window : undefined;
