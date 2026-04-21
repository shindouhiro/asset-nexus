<script setup lang="ts">
import { type Coupon, getCoverUrl } from '@platform/utils'

const { data: coupons } = await useFetch<Coupon[]>('/api/coupons', {
  default: () => [],
})

useHead({
  title: '专享优惠券平台',
  meta: [
    { name: 'description', content: '查看最新最全的专享优惠券' },
  ],
})
const colorMode = useColorMode()

function toggleTheme(event: MouseEvent) {
  const isAppearanceTransition = (document as any).startViewTransition
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!isAppearanceTransition) {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
    return
  }

  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  )

  document.documentElement.classList.add('view-transitioning')

  const transition = (document as any).startViewTransition(async () => {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
    await nextTick()
  })

  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ]
    const isDark = colorMode.value === 'dark'
    document.documentElement.animate(
      {
        clipPath: isDark ? [...clipPath].reverse() : clipPath,
      },
      {
        duration: 300,
        easing: 'ease-in',
        pseudoElement: `::view-transition-${isDark ? 'old' : 'new'}(root)`,
      },
    )
  })

  transition.finished.finally(() => {
    document.documentElement.classList.remove('view-transitioning')
  })
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-300 font-sans p-4 sm:p-8 transition-colors duration-500">
    <header class="max-w-6xl mx-auto mb-10 sm:mb-16 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
      <div class="flex items-center gap-5">
        <img src="/logo.png" alt="Logo" class="w-10 h-10 sm:w-12 sm:h-12 object-contain">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Asset Nexus
          </h1>
          <p class="text-zinc-500 dark:text-zinc-400 mt-1 text-sm font-medium">
            发现精选优惠，开启省钱之旅
          </p>
        </div>
      </div>
      <div class="flex items-center gap-6">
        <!-- UnoCSS Official Style Switch -->
        <button 
          class="relative inline-flex h-5.5 w-10 flex-shrink-0 cursor-pointer items-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 transition-colors duration-300 outline-none"
          title="切换主题"
          @click="(e) => toggleTheme(e)"
        >
          <div 
            class="pointer-events-none relative flex h-4.5 w-4.5 items-center justify-center rounded-full bg-white dark:bg-zinc-700 shadow-sm transition-transform duration-300 ease-in-out translate-x-0.5 dark:translate-x-4.5"
          >
            <span class="i-carbon-sun absolute text-[10px] text-zinc-500 opacity-100 transition-opacity dark:opacity-0" />
            <span class="i-carbon-moon absolute text-[10px] text-zinc-300 opacity-0 transition-opacity dark:opacity-100" />
          </div>
        </button>

        <NuxtLink to="/admin" class="px-4 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-sm font-medium text-zinc-600 dark:text-zinc-300">
          管理后台
        </NuxtLink>
      </div>
    </header>

    <main class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      <div
        v-for="coupon in coupons" :key="coupon.id"
        class="group relative bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:border-cyan-500/50 dark:hover:border-cyan-500/50 transition-colors duration-300"
      >
        <div class="aspect-[16/9] relative overflow-hidden bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <img 
            :src="getCoverUrl(coupon.image)" 
            :alt="coupon.title" 
            class="w-full h-full object-cover transition-transform duration-500"
            @error="(e) => (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Image+Error'"
          >
        </div>

        <div class="p-5 sm:p-6 flex flex-col h-[180px]">
          <h2 class="text-lg font-semibold mb-2 text-zinc-900 dark:text-zinc-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1">
            {{ coupon.title }}
          </h2>
          <p class="text-zinc-500 dark:text-zinc-400 text-sm line-clamp-2 leading-relaxed flex-1">
            {{ coupon.description }}
          </p>

          <a
            :href="coupon.link" target="_blank"
            class="mt-4 block w-full text-center py-2.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors text-sm"
          >
            立即领取
          </a>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
body {
  margin: 0;
  -webkit-font-smoothing: antialiased;
}
</style>
