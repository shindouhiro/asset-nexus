<script setup lang="ts">
import type { Coupon } from '@platform/utils'

const { data: coupons, refresh } = await useFetch<Coupon[]>('/api/coupons')

const editingCoupon = ref<Partial<Coupon>>({
  title: '',
  image: '',
  description: '',
  link: '',
})

const isEditing = ref(false)

async function handleSave() {
  await $fetch('/api/coupons', {
    method: 'POST',
    body: editingCoupon.value,
  })
  isEditing.value = false
  editingCoupon.value = { title: '', image: '', description: '', link: '' }
  await refresh()
}

function editCoupon(coupon: Coupon) {
  editingCoupon.value = { ...coupon }
  isEditing.value = true
}

function addNew() {
  editingCoupon.value = { title: '', image: '', description: '', link: '' }
  isEditing.value = true
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-300 p-8">
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Top Header -->
      <header class="flex justify-between items-center bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            <div class="i-carbon-ticket text-2xl text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-white tracking-wide">
              优惠券管理台
            </h1>
            <p class="text-sm text-slate-400 mt-1">
              管理和配置前端展示的优惠券数据
            </p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <NuxtLink to="/" class="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all font-medium">
            <div class="i-carbon-view text-lg" />
            预览前台
          </NuxtLink>
          <button class="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold shadow-[0_0_10px_rgba(8,145,178,0.5)] transition-all" @click="addNew">
            <div class="i-carbon-add text-lg" />
            新增优惠券
          </button>
        </div>
      </header>

      <!-- Data Table -->
      <main class="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-800/50 border-b border-slate-800 text-slate-400 text-sm tracking-wider uppercase">
                <th class="p-4 pl-6 font-medium w-24">
                  ID
                </th>
                <th class="p-4 font-medium w-32">
                  封面图
                </th>
                <th class="p-4 font-medium">
                  基本信息
                </th>
                <th class="p-4 font-medium hidden md:table-cell">
                  详细描述
                </th>
                <th class="p-4 pr-6 font-medium text-right w-32">
                  操作
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/50">
              <tr
                v-for="(coupon, index) in coupons" :key="coupon.id"
                class="hover:bg-slate-800/30 transition-colors group"
              >
                <!-- ID -->
                <td class="p-4 pl-6 text-slate-500 font-mono text-sm">
                  #{{ index + 1 }}
                </td>

                <!-- Image -->
                <td class="p-4">
                  <div class="w-20 h-14 rounded-lg overflow-hidden border border-slate-700 bg-slate-800">
                    <img :src="coupon.image" :alt="coupon.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                  </div>
                </td>

                <!-- Info -->
                <td class="p-4">
                  <div class="font-bold text-white mb-1">
                    {{ coupon.title }}
                  </div>
                  <a :href="coupon.link" target="_blank" class="text-xs text-cyan-500 hover:text-cyan-400 font-mono flex items-center gap-1 max-w-[200px] truncate">
                    <div class="i-carbon-link shrink-0" />
                    {{ coupon.link }}
                  </a>
                </td>

                <!-- Description -->
                <td class="p-4 hidden md:table-cell text-sm text-slate-400 py-4 max-w-xs">
                  <div class="line-clamp-2" :title="coupon.description">
                    {{ coupon.description }}
                  </div>
                </td>

                <!-- Actions -->
                <td class="p-4 pr-6 text-right">
                  <button
                    class="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 rounded-md text-sm font-medium transition-colors border border-slate-700"
                    @click="editCoupon(coupon)"
                  >
                    <div class="i-carbon-edit" />
                    编辑
                  </button>
                </td>
              </tr>
              <!-- Empty State -->
              <tr v-if="!coupons?.length">
                <td colspan="5" class="p-12 text-center text-slate-500">
                  <div class="i-carbon-document-blank text-4xl mx-auto mb-3 opacity-50" />
                  <p>暂无优惠券数据</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>

      <!-- Edit Modal -->
      <div v-if="isEditing" class="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-4 z-50 backdrop-blur-md">
        <div class="bg-slate-900 border border-slate-700 shadow-2xl p-0 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col">
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
            <h2 class="text-xl font-bold text-white flex items-center gap-2">
              <div class="i-carbon-edit text-cyan-500" />
              {{ editingCoupon.id ? '编辑优惠券配置' : '新增优惠券' }}
            </h2>
            <button class="text-slate-400 hover:text-white transition-colors p-1" @click="isEditing = false">
              <div class="i-carbon-close text-xl" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
            <div>
              <label class="block text-sm font-medium text-slate-400 mb-1.5 ml-1">优惠券标题</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <div class="i-carbon-string-text text-slate-500" />
                </div>
                <input
                  v-model="editingCoupon.title" type="text" placeholder="例如: 新人立减50元"
                  class="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                >
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-400 mb-1.5 ml-1">封面图片视图</label>
              <div class="flex gap-4 items-start">
                <div class="w-16 h-16 rounded-lg bg-slate-950 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                  <img v-if="editingCoupon.image" :src="editingCoupon.image" class="w-full h-full object-cover">
                  <div v-else class="i-carbon-image text-2xl text-slate-600" />
                </div>
                <div class="flex-1 min-w-0 relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <div class="i-carbon-link" />
                  </div>
                  <input
                    v-model="editingCoupon.image" type="text" placeholder="https://..."
                    class="w-full h-10 bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 text-white placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all mb-2"
                  >
                  <p class="text-xs text-slate-500">
                    建议尺寸: 800x450px
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-400 mb-1.5 ml-1">使用描述</label>
              <textarea
                v-model="editingCoupon.description" placeholder="详细说明优惠券的使用规则、期限等..."
                class="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all min-h-[100px] resize-y"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-400 mb-1.5 ml-1">领券/跳转链接</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <div class="i-carbon-url text-slate-500" />
                </div>
                <input
                  v-model="editingCoupon.link" type="text" placeholder="https://..."
                  class="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                >
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="px-6 py-4 border-t border-slate-800 bg-slate-800/30 flex gap-3 justify-end">
            <button class="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors border border-slate-700" @click="isEditing = false">
              取消
            </button>
            <button class="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold shadow-[0_0_10px_rgba(8,145,178,0.4)] transition-all flex items-center gap-2" @click="handleSave">
              <div class="i-carbon-save" />
              保存设置
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
