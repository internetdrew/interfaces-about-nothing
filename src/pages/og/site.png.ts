import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { APIRoute } from "astro";
import { ImageResponse } from "@vercel/og";
import { createElement as h } from "react";
import { title, description } from "../../constants";

export const prerender = true;

export const GET: APIRoute = async () => {
  const [hostGrotesk, inter] = await Promise.all([
    readFile(resolve("src/assets/fonts/host-grotesk-latin-600-normal.ttf")),
    readFile(resolve("src/assets/fonts/inter-latin-500-normal.ttf")),
  ]);

  return new ImageResponse(
    h(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: 80,
          // sRGB equivalents of the site's Tailwind stone-300 and stone-600.
          backgroundColor: "#d6d3d1",
          color: "#000000",
        },
      },
      h(
        "svg",
        { width: 80, height: 40, viewBox: "0 0 96 48" },
        h("circle", { cx: 24, cy: 24, r: 24, fill: "#f7cc05" }),
        h("circle", { cx: 48, cy: 24, r: 24, fill: "#ee182d" }),
        h("circle", { cx: 72, cy: 24, r: 24, fill: "#1c4b9c" }),
      ),
      h(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            marginTop: 106,
          },
        },
        h(
          "div",
          {
            style: {
              fontFamily: "Host Grotesk",
              fontWeight: 600,
              fontSize: 68,
              lineHeight: 1.1,
              letterSpacing: -2,
            },
          },
          title,
        ),
        h(
          "div",
          {
            style: {
              maxWidth: 960,
              marginTop: 24,
              fontFamily: "Inter",
              fontWeight: 500,
              fontSize: 32,
              lineHeight: 1.45,
              color: "#57534e",
            },
          },
          description,
        ),
      ),
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Host Grotesk",
          data: hostGrotesk,
          weight: 600,
          style: "normal",
        },
        { name: "Inter", data: inter, weight: 500, style: "normal" },
      ],
    },
  );
};
