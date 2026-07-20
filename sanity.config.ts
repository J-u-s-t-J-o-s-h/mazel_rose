"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/env";
import { schemaTypes, SINGLETON_TYPES } from "@/sanity/schemaTypes";
import { structure } from "@/sanity/structure";
import { resolve } from "@/sanity/presentation/resolve";
const singletonActions = new Set(["publish", "discardChanges", "restore"]);

const previewOrigin =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

export default defineConfig({
  name: "mazel-rose",
  title: "mazel.rose",
  projectId,
  dataset,
  basePath: studioUrl,
  plugins: [
    structureTool({ structure }),
    presentationTool({
      resolve,
      previewUrl: {
        origin: previewOrigin,
        preview: "/",
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(
        (template) =>
          !SINGLETON_TYPES.includes(
            template.schemaType as (typeof SINGLETON_TYPES)[number],
          ),
      ),
  },
  document: {
    actions: (input, context) =>
      SINGLETON_TYPES.includes(
        context.schemaType as (typeof SINGLETON_TYPES)[number],
      )
        ? input.filter(
            ({ action }) => action && singletonActions.has(action),
          )
        : input,
  },
});
