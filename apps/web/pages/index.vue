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
</script>

<template>
  <div class="min-h-screen bg-slate-900 text-white font-sans p-4 sm:p-8">
    <header class="max-w-6xl mx-auto mb-8 sm:mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
      <div class="flex items-center gap-4">
        <img src="/logo.png" alt="Logo" class="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.2)]">
        <div>
          <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Asset Nexus
          </h1>
          <p class="text-slate-400 mt-1 text-sm sm:text-base">
            发现精选优惠，开启省钱之旅
          </p>
        </div>
      </div>
      <NuxtLink to="/admin" class="px-5 py-2 sm:px-6 sm:py-2 rounded-full border border-slate-700 hover:bg-slate-800 transition-colors text-sm sm:text-base">
        管理后台
      </NuxtLink>
    </header>

    <main class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="coupon in coupons" :key="coupon.id"
        class="group relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300"
      >
        <div class="aspect-video relative overflow-hidden">
          <img 
            :src="getCoverUrl(coupon.image)" 
            :alt="coupon.title" 
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            @error="(e) => (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Image+Error'"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60" />
          <div class="absolute bottom-4 left-4">
            <!-- <span class="px-3 py-1 bg-cyan-500 text-xs font-bold rounded-lg uppercase tracking-wider">限时抢购</span> -->
          </div>
        </div>

        <div class="p-6">
          <h2 class="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
            {{ coupon.title }}
          </h2>
          <p class="text-slate-400 text-sm mb-6 line-clamp-2">
            {{ coupon.description }}
          </p>

          <a
            :href="coupon.link" target="_blank"
            class="block w-full text-center py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all"
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
