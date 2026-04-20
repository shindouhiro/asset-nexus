export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('error', (error, context) => {
    console.error('[Nitro Error Hook]', error)
    if (error instanceof Error) {
      console.error('[Nitro Error Stack]', error.stack)
    }
    if (context?.event) {
      console.error('[Nitro Error URL]', context.event.path)
    }
  })
})
