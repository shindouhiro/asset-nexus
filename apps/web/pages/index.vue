<script setup lang="ts">
import type { Coupon } from '@platform/utils'

// const { data: coupons } = await useFetch<Coupon[]>('/api/coupons')
const coupons = ref<Coupon[]>([])

useHead({
  title: '专享优惠券平台',
  meta: [
    { name: 'description', content: '查看最新最全的专享优惠券' },
  ],
})
</script>

<template>
  <div class="min-h-screen bg-slate-900 text-white font-sans p-8">
    <header class="max-w-6xl mx-auto mb-12 flex justify-between items-center">
      <div>
        <h1 class="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          专享优惠券
        </h1>
        <p class="text-slate-400 mt-2">
          发现精选优惠，开启省钱之旅
        </p>
      </div>
      <NuxtLink to="/admin" class="px-6 py-2 rounded-full border border-slate-700 hover:bg-slate-800 transition-colors">
        管理后台
      </NuxtLink>
    </header>

    <main class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="coupon in coupons" :key="coupon.id"
        class="group relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300"
      >
        <div class="aspect-video relative overflow-hidden">
          <img :src="coupon.image" :alt="coupon.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
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
