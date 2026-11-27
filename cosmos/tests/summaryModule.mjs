import { readFile } from "node:fs/promises";
import ts from "typescript";

function moduleUrl(source) {
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }
  });
  return "data:text/javascript;base64," + Buffer.from(outputText).toString("base64");
}

const imports = await Promise.all(
  ["language", "summaryCopy"].map(async (name) => {
    const source = await readFile(new URL("../src/lib/" + name + ".ts", import.meta.url), "utf8");
    return ['"@/lib/' + name + '"', JSON.stringify(moduleUrl(source))];
  })
);

export async function summaryModule(file, mock = (source) => source) {
  const original = await readFile(new URL("../src/" + file, import.meta.url), "utf8");
  let source = mock(original);
  for (const [specifier, url] of imports) {
    source = source.replaceAll(specifier, url);
  }
  return moduleUrl(source);
}
