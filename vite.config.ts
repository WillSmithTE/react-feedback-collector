import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { OutputBundle } from "rollup";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    minifyCSSStrings() as any,
    visualizer({
      open: true,
      filename: "bundle-analysis.html",
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "ReactFeedbackCollector",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "esm" : "cjs"}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "React",
        },
        manualChunks: undefined,
      },
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
    },
    outDir: "dist",
    emptyOutDir: true,
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
    target: "es2017",
    sourcemap: false,
  },
});

// Simple CSS minifier plugin
function minifyCSSStrings() {
  return {
    name: "minify-css-strings",
    generateBundle(_: any, bundle: OutputBundle) {
      Object.keys(bundle).forEach((fileName) => {
        const chunk = bundle[fileName];
        if (chunk.type === "chunk" && chunk.code) {
          // Find and minify CSS template literals
          chunk.code = chunk.code.replace(
            /const FEEDBACK_CSS = `([^`]+)`/g,
            (match, css) => {
              // Basic CSS minification
              const minified = css
                .replace(/\/\*[\s\S]*?\*\//g, "") // Remove comments
                .replace(/\s+/g, " ") // Collapse whitespace
                .replace(/\s*{\s*/g, "{") // Remove spaces around {
                .replace(/\s*}\s*/g, "}") // Remove spaces around }
                .replace(/\s*;\s*/g, ";") // Remove spaces around ;
                .replace(/\s*:\s*/g, ":") // Remove spaces around :
                .replace(/\s*,\s*/g, ",") // Remove spaces around ,
                .trim();
              return `const FEEDBACK_CSS = \`${minified}\``;
            }
          );
        }
      });
    },
  };
}
