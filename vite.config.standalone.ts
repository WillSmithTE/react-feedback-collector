import { resolve } from "path";
import { OutputBundle } from "rollup";
import { defineConfig } from "vite";

/**
 * Standalone build config.
 *
 * Aliases react/react-dom → preact/compat so the entire widget
 * ships as a single file with zero external dependencies (~10kb gzipped).
 */
export default defineConfig({
  resolve: {
    alias: {
      react: "preact/compat",
      "react-dom/client": "preact/compat",
      "react-dom": "preact/compat",
      "react/jsx-runtime": "preact/jsx-runtime",
    },
  },
  // Preact uses class-based components with process.env checks in compat
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/standalone.ts"),
      name: "FeedbackCollector",
      formats: ["es", "umd"],
      fileName: (format) =>
        `standalone.${format === "es" ? "esm" : "umd"}.js`,
    },
    // No externals — bundle everything including Preact
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
    },
    outDir: "dist",
    emptyOutDir: false, // Don't wipe the main build output
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info", "console.debug"],
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false,
      },
    },
    target: "es2020",
    sourcemap: false,
  },
  plugins: [minifyCSSStrings() as any],
});

// Simple CSS minifier plugin (same as main build)
function minifyCSSStrings() {
  return {
    name: "minify-css-strings",
    generateBundle(_: any, bundle: OutputBundle) {
      Object.keys(bundle).forEach((fileName) => {
        const chunk = bundle[fileName];
        if (chunk.type === "chunk" && chunk.code) {
          chunk.code = chunk.code.replace(
            /const FEEDBACK_CSS = `([^`]+)`/g,
            (_match: string, css: string) => {
              const minified = css
                .replace(/\/\*[\s\S]*?\*\//g, "")
                .replace(/\s+/g, " ")
                .replace(/\s*{\s*/g, "{")
                .replace(/\s*}\s*/g, "}")
                .replace(/\s*;\s*/g, ";")
                .replace(/\s*:\s*/g, ":")
                .replace(/\s*,\s*/g, ",")
                .trim();
              return `const FEEDBACK_CSS = \`${minified}\``;
            }
          );
        }
      });
    },
  };
}
