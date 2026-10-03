// Svelte publishes no type declarations for its internal client runtime, but the
// playground links the compiler's output against it, so declare it as untyped.
declare module 'svelte/internal/client';
declare module 'svelte/internal/disclose-version';
