import { defineContentConfig, defineCollection, z } from '@nuxt/content'
import { asSitemapCollection } from '@nuxtjs/sitemap/content'
import { asSchemaOrgCollection } from 'nuxt-schema-org/content'

export default defineContentConfig({
  collections: {
    index: defineCollection(asSchemaOrgCollection(asSitemapCollection({
      type: 'page',
      source: 'index.yml',
      schema: z.object({
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
          title: z.string(),
          description: z.string(),
          link: z.string(),
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
    }))),
    blog: defineCollection(asSchemaOrgCollection(asSitemapCollection({
      type: 'page',
      source: 'blog.yml'
    }))),
    posts: defineCollection(asSchemaOrgCollection(asSitemapCollection({
      type: 'page',
      source: 'blog/**/*',
      schema: z.object({
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
    }))),
  }
})
