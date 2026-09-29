/**
 * Builds the public hanging-sloth models from the Meshy exports.
 * Source files are read only:
 *   assets/Meshy_AI_model.glb
 *   assets/Meshy_AI_Animation_Jump_and_Hang_on_Bar_withSkin.glb
 *
 * Run: node scripts/optimize-hanging-sloth.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { NodeIO } from "@gltf-transform/core";
import { compressTexture, dedup, prune } from "@gltf-transform/functions";
import sharp from "sharp";

const sources = {
  tree: "assets/Meshy_AI_model.glb",
  sloth: "assets/Meshy_AI_Animation_Jump_and_Hang_on_Bar_withSkin.glb",
};

const outputs = {
  tree: "public/models/tree.glb",
  sloth: "public/models/sloth-hang.glb",
};

function calmMaterials(document) {
  for (const material of document.getRoot().listMaterials()) {
    material.setMetallicFactor(0);
    material.setRoughnessFactor(Math.max(material.getRoughnessFactor(), 0.82));
    material.setEmissiveFactor([0, 0, 0]);
    material.setEmissiveTexture(null);
    // Meshy marks the sloth fully emissive and over-bright in specular.
    // Drop those extensions so the cartoon paint stays matte.
    material.setExtension("KHR_materials_specular", null);
    material.setExtension("KHR_materials_ior", null);
    material.setExtension("KHR_materials_emissive_strength", null);
  }
}

async function optimize(source, destination) {
  const io = new NodeIO();
  const document = await io.read(source);
  calmMaterials(document);

  for (const texture of document.getRoot().listTextures()) {
    const name = texture.getName() ?? "";
    const metallic = /metallic|roughness/i.test(name);
    await compressTexture(texture, {
      encoder: sharp,
      targetFormat: "webp",
      resize: metallic ? [512, 512] : [1024, 1024],
      quality: metallic ? 70 : 78,
      effort: 5,
    });
  }

  await document.transform(dedup(), prune());
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  await io.write(destination, document);
  const bytes = fs.statSync(destination).size;
  console.log(`${destination} ${(bytes / 1024 / 1024).toFixed(2)} MB`);
}

await optimize(sources.tree, outputs.tree);
await optimize(sources.sloth, outputs.sloth);
