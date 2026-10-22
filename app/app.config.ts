export default defineAppConfig({
  ui: {
    colors: {
      primary: 'teal',
      neutral: 'neutral'
    },
    prose: {
      p: {
        base: 'mb-6 text-[1.125rem] leading-[1.7] text-pretty text-default'
      },
      li: {
        base: 'my-2 ps-1 text-[1.125rem] leading-[1.7] [&>ul]:my-0 [&>ol]:my-0'
      },
      ul: {
        base: 'my-6 list-disc ps-6 marker:text-primary/70'
      },
      ol: {
        base: 'my-6 list-decimal ps-6 marker:text-muted'
      }
    }
  }
})
