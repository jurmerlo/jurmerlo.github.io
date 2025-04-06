// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightBlog from "starlight-blog";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      plugins: [
        starlightBlog({
          title: "Blog",
          prevNextLinksOrder: "chronological",
        }),
      ],
      title: "Jurmerlo",
      social: {
        github: "https://github.com/jurmerlo",
      },
      sidebar: [
        {
          label: "Projects",
          // Each item here is one entry in the navigation menu.
          autogenerate: { directory: "projects" },
        },
        {
          label: "About Me",
          link: "about",
        },
      ],
    }),
  ],
  site: "https://jurmerlo.github.io",
  outDir: "./docs",
});
