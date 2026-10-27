// The PDF viewer (file-lightbox) needs pdfjs' CMaps, standard fonts and wasm decoders served by the app, so PDFs with
// Asian or non-embedded fonts render offline. Copied from node_modules after every install (git-ignored).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const from = path.join(root, "node_modules", "pdfjs-dist");
if (fs.existsSync(from)) {
  for (const dir of ["cmaps", "standard_fonts", "wasm"]) {
    const src = path.join(from, dir);
    if (fs.existsSync(src))
      fs.cpSync(src, path.join(root, "public", "pdfjs", dir), {
        recursive: true,
      });
  }
}
