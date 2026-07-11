import { defineContentConfig, defineCollection, z } from '@nuxt/content'
import { defineSitemapSchema } from '@nuxtjs/sitemap/content'
import { defineSchemaOrgSchema } from 'nuxt-schema-org/content'

export default defineContentConfig({
  collections: {
    index: defineCollection({
      type: 'page',
      source: 'index.yml',
      schema: z.object({
        sitemap: defineSitemapSchema(),
        schemaOrg: defineSchemaOrgSchema(),
        title: z.string(),
        hero: z.object({
          intro: z.string(),
          title: z.string(),
          location: z.string(),
          links: z.array(z.object({
            icon: z.string(),
            url: z.string()
          }))
        }),
        techstack: z.array(z.object({
          icon: z.string(),
          title: z.string()
        })),
        experiences: z.array(z.object({
          timeframe: z.string(),
          title: z.string(),
          company: z.string(),
          domainName: z.string().optional(),
          url: z.string().optional(),
          jobtype: z.string()
        })),
        projects: z.array(z.object({
          slug: z.string(),
          title: z.string(),
          description: z.string(),
          link: z.string().optional(),
          image: z.string(),
          techstack: z.array(z.object({
            icon: z.string(),
            title: z.string()
          })),
          features: z.array(z.object({
            icon: z.string(),
            title: z.string()
          }))
        })),
        contact: z.object({
          email: z.string(),
          links: z.array(z.object({
            title: z.string(),
            icon: z.string(),
            url: z.string()
          }))
        })
      })
    }),
    blog: defineCollection({
      type: 'page',
      source: 'blog.yml',
      schema: z.object({
        sitemap: defineSitemapSchema(),
        schemaOrg: defineSchemaOrgSchema(),
      })
    }),
    posts: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        sitemap: defineSitemapSchema(),
        schemaOrg: defineSchemaOrgSchema(),
        image: z.object({ src: z.string().nonempty().editor({ input: 'media' }) }),
        authors: z.array(
          z.object({
            name: z.string().nonempty(),
            to: z.string().nonempty(),
            avatar: z.object({ src: z.string().nonempty().editor({ input: 'media' }) })
          })
        ),
        date: z.date(),
        badge: z.object({ label: z.string().nonempty() })
      })
    }),
    about: defineCollection({
      type: 'page',
      source: 'about.yml',
      schema: z.object({
        sitemap: defineSitemapSchema(),
        schemaOrg: defineSchemaOrgSchema(),
        personal: z.object({
          name: z.string(),
          title: z.object({ en: z.string(), id: z.string() }),
          bio: z.object({ en: z.string(), id: z.string() }),
          image: z.string(),
          location: z.object({ en: z.string(), id: z.string() }),
          links: z.array(z.object({ icon: z.string(), url: z.string() }))
        }),
        values: z.array(z.object({
          icon: z.string(),
          title: z.object({ en: z.string(), id: z.string() }),
          description: z.object({ en: z.string(), id: z.string() })
        })),
      })
    }),
    services: defineCollection({
      type: 'page',
      source: 'services.yml',
      schema: z.object({
        sitemap: defineSitemapSchema(),
        schemaOrg: defineSchemaOrgSchema(),
        title: z.object({ en: z.string(), id: z.string() }),
        description: z.object({ en: z.string(), id: z.string() }),
        items: z.array(z.object({
          icon: z.string(),
          title: z.object({ en: z.string(), id: z.string() }),
          description: z.object({ en: z.string(), id: z.string() }),
          deliverables: z.array(z.object({ en: z.string(), id: z.string() }))
        })),
        process: z.array(z.object({
          step: z.number(),
          icon: z.string(),
          title: z.object({ en: z.string(), id: z.string() }),
          description: z.object({ en: z.string(), id: z.string() })
        }))
      })
    }),
    projectsDetail: defineCollection({
      type: 'page',
      source: 'projects/*.yml',
      schema: z.object({
        sitemap: defineSitemapSchema(),
        schemaOrg: defineSchemaOrgSchema(),
        slug: z.string(),
        title: z.string(),
        client: z.string().optional(),
        description: z.string(),
        longDescription: z.object({ en: z.string(), id: z.string() }).optional(),
        image: z.string(),
        link: z.string().optional(),
        techstack: z.array(z.object({ icon: z.string(), title: z.string() })),
        features: z.array(z.object({ icon: z.string(), title: z.string() })),
        problem: z.object({ en: z.string(), id: z.string() }).optional(),
        solution: z.object({ en: z.string(), id: z.string() }).optional(),
        results: z.object({ en: z.string(), id: z.string() }).optional(),
      })
    }),
  }
})
