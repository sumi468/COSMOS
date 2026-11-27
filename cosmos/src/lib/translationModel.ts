import { createHash } from "node:crypto";

const ATTACHMENTS = "https://firefox-settings-attachments.cdn.mozilla.net/main-workspace/translations-models/";

// Firefox Translations English → Japanese model, release 2.3.
// https://mozilla.github.io/translations/firefox-models/
export const TRANSLATION_MODEL_VERSION = "firefox-en-ja-2.3";

const files = {
  model: {
    name: "4e19636e-4644-4072-8a05-9ef695d4a3ae.bin",
    bytes: 43_849_787,
    sha256: "59ae659f9bb63e4f81f474fe3c03d3f4499434b5f9e779fab7c12a45f31fd562"
  },
  shortlist: {
    name: "87258444-8fac-4d3c-a175-9275e9d10ffa.bin",
    bytes: 4_128_360,
    sha256: "edfb7eb47b98a2689b804ab3614c31b24f1257aa54b1154da3d85e1ae8152d9f"
  },
  sourceVocab: {
    name: "cdea5422-fe0d-4941-a653-ca090423e8f8.spm",
    bytes: 796_275,
    sha256: "970c98d174fc01e0339fbabbf45af36a4be3f26f819ec1a5ea1189f71e091889"
  },
  targetVocab: {
    name: "5c1a663f-5736-4100-b681-c6737fe79cb5.spm",
    bytes: 827_144,
    sha256: "3b3d9f8f3a034d98d0a476f1794fa79c01e4e98a967ceb6777a66ba2d03ec1e1"
  }
};

async function getFile(file: (typeof files)[keyof typeof files]): Promise<ArrayBuffer> {
  const response = await fetch(ATTACHMENTS + file.name, {
    cache: "no-store",
    signal: AbortSignal.timeout(15_000)
  });
  if (!response.ok) throw new Error("Could not download the translation model.");
  const buffer = await response.arrayBuffer();
  if (buffer.byteLength !== file.bytes || createHash("sha256").update(new Uint8Array(buffer)).digest("hex") !== file.sha256) {
    throw new Error("A translation model file failed its integrity check.");
  }
  return buffer;
}

export async function loadTranslationModel() {
  const [model, shortlist, sourceVocab, targetVocab] = await Promise.all([
    getFile(files.model), getFile(files.shortlist), getFile(files.sourceVocab), getFile(files.targetVocab)
  ]);
  return { model, shortlist, vocabs: [sourceVocab, targetVocab] };
}
