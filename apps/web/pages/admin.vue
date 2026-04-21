<script setup lang="ts">
import { type Coupon, getCoverUrl } from '@platform/utils'

const { data: coupons, refresh } = await useFetch<Coupon[]>('/api/coupons')

const editingCoupon = ref<Partial<Coupon>>({
  title: '',
  image: '',
  description: '',
})

const isEditing = ref(false)

// Custom Confirmation Modal State
const showConfirmModal = ref(false)
const confirmData = ref({
  title: '',
  message: '',
  onConfirm: () => {},
})

function confirm(title: string, message: string, onConfirm: () => void) {
  confirmData.value = { title, message, onConfirm }
  showConfirmModal.value = true
}

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

async function handleDelete(id: string) {
  confirm('确定删除吗？', '删除后此优惠券将永久消失，无法撤销。', async () => {
    await $fetch('/api/coupons', {
      method: 'DELETE',
      query: { id },
    })
    await refresh()
    showConfirmModal.value = false
  })
}

const { clear } = useUserSession()
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

async function handleLogout() {
  await clear()
  await navigateTo('/login')
}

function addNew() {
  editingCoupon.value = { title: '', image: '', description: '', link: '' }
  isEditing.value = true
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-300 p-4 sm:p-8 transition-colors duration-500">
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Top Header -->
      <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-transparent pb-6 border-b border-zinc-200 dark:border-zinc-800 gap-6">
        <div class="flex items-center gap-5">
          <img src="/logo.png" alt="Logo" class="w-10 h-10 sm:w-12 sm:h-12 object-contain">
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
              Asset Nexus 管理台
            </h1>
            <p class="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              管理和配置前端展示的优惠券数据
            </p>
          </div>
        </div>
        <div class="flex items-center gap-6 w-full sm:w-auto">
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

          <NuxtLink to="/" class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors font-medium text-sm">
            <span class="i-carbon-view text-lg" />
            <span class="hidden xs:inline">预览前台</span>
          </NuxtLink>
          <button class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-md font-medium transition-colors text-sm" @click="addNew">
            <span class="i-carbon-add text-lg" />
            <span>新增</span>
          </button>
          <button class="flex items-center justify-center w-9 h-9 border border-zinc-200 dark:border-zinc-800 rounded-md text-red-500 hover:text-white hover:bg-red-500 hover:border-red-500 transition-colors shrink-0" title="退出登录" @click="handleLogout">
            <span class="i-carbon-logout text-lg" />
          </button>
        </div>
      </header>

      <!-- Data Table -->
      <main class="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs tracking-wider uppercase font-medium">
                <th class="p-4 pl-6 w-20 hidden sm:table-cell">
                  ID
                </th>
                <th class="p-4 w-24 sm:w-32">
                  预览
                </th>
                <th class="p-4">
                  信息
                </th>
                <th class="p-4 hidden md:table-cell">
                  说明
                </th>
                <th class="p-4 pr-6 text-right w-24 sm:w-32">
                  操作
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              <tr
                v-for="(coupon, index) in coupons" :key="coupon.id"
                class="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
              >
                <!-- ID -->
                <td class="p-4 pl-6 text-zinc-400 dark:text-zinc-500 font-mono text-sm hidden sm:table-cell">
                  #{{ index + 1 }}
                </td>

                <!-- Image -->
                <td class="p-4">
                  <div class="w-16 h-12 sm:w-20 sm:h-14 rounded-md overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
                    <img 
                      :src="getCoverUrl(coupon.image)" 
                      :alt="coupon.title" 
                      class="w-full h-full object-cover transition-transform duration-500"
                      @error="(e) => (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Preview+Error'"
                    >
                  </div>
                </td>

                <!-- Info -->
                <td class="p-4">
                  <div class="font-medium text-zinc-900 dark:text-zinc-100 mb-1 text-sm sm:text-base">
                    {{ coupon.title }}
                  </div>
                  <a :href="coupon.link" target="_blank" class="text-[10px] sm:text-xs text-cyan-600 dark:text-cyan-400 hover:underline font-mono flex items-center gap-1 max-w-[120px] sm:max-w-[200px] truncate">
                    <span class="i-carbon-link shrink-0" />
                    {{ coupon.link }}
                  </a>
                </td>

                <!-- Description -->
                <td class="p-4 hidden md:table-cell text-sm text-zinc-500 dark:text-zinc-400 py-4 max-w-xs">
                  <div class="line-clamp-2" :title="coupon.description">
                    {{ coupon.description }}
                  </div>
                </td>

                <!-- Actions -->
                <td class="p-4 pr-6 text-right">
                  <div class="inline-flex items-center gap-2">
                    <button
                      class="tooltip-trigger flex items-center justify-center w-8 h-8 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
                      data-tooltip="编辑"
                      @click="editCoupon(coupon)"
                    >
                      <span class="i-carbon-edit text-base" />
                    </button>
                    <button
                      class="tooltip-trigger flex items-center justify-center w-8 h-8 text-zinc-500 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                      data-tooltip="删除"
                      @click="handleDelete(coupon.id)"
                    >
                      <span class="i-carbon-trash-can text-base" />
                    </button>
                  </div>
                </td>
              </tr>
              <!-- Empty State -->
              <tr v-if="!coupons?.length">
                <td colspan="5" class="p-12 text-center text-slate-500">
                  <span class="i-carbon-document-blank text-4xl mx-auto mb-3 opacity-50" />
                  <p>暂无优惠券数据</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>

      <!-- Edit Modal -->
      <div v-if="isEditing" class="fixed inset-0 bg-zinc-900/40 dark:bg-black/60 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl p-0 rounded-xl w-full max-w-lg overflow-hidden flex flex-col">
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
            <h2 class="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <span class="i-carbon-edit text-cyan-500" />
              {{ editingCoupon.id ? '编辑优惠券' : '新增优惠券' }}
            </h2>
            <button class="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10" @click="isEditing = false">
              <span class="i-carbon-close text-xl" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
            <div>
              <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">优惠券标题</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="i-carbon-string-text text-zinc-400" />
                </div>
                <input
                  v-model="editingCoupon.title" type="text" placeholder="例如: 新人立减50元"
                  class="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-md pl-10 pr-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 dark:focus:border-zinc-500 outline-none transition-shadow shadow-sm"
                >
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">封面图片上传</label>
              <ImageUpload v-model="editingCoupon.image" placeholder="点击或拖拽上传封面图" />
            </div>

            <div>
              <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">使用描述</label>
              <textarea
                v-model="editingCoupon.description" placeholder="详细说明优惠券的使用规则、期限等..."
                class="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-md px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 dark:focus:border-zinc-500 outline-none transition-shadow min-h-[100px] resize-y shadow-sm"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">领券/跳转链接</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="i-carbon-url text-zinc-400" />
                </div>
                <input
                  v-model="editingCoupon.link" type="text" placeholder="https://..."
                  class="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-md pl-10 pr-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 dark:focus:border-zinc-500 outline-none transition-shadow shadow-sm"
                >
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex gap-3 justify-end mt-auto">
            <button class="flex-1 sm:flex-none px-5 py-2 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-md font-medium transition-colors border border-zinc-300 dark:border-zinc-700 text-sm shadow-sm" @click="isEditing = false">
              取消
            </button>
            <button class="flex-2 sm:flex-none px-6 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-md font-medium transition-colors flex items-center justify-center gap-2 text-sm shadow-sm" @click="handleSave">
              <span class="i-carbon-save" />
              保存
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Custom Confirm Modal -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-zinc-900/40 dark:bg-black/60 flex items-center justify-center p-4 z-[60]">
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl w-full max-w-sm overflow-hidden">
        <div class="p-6 flex flex-col items-center text-center">
          <div class="w-12 h-12 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-4 text-red-600 dark:text-red-500">
            <span class="i-carbon-warning text-2xl" />
          </div>
          <h3 class="text-lg font-bold text-zinc-900 dark:text-white mb-2">{{ confirmData.title }}</h3>
          <p class="text-zinc-500 dark:text-zinc-400 text-sm">{{ confirmData.message }}</p>
        </div>
        <div class="px-6 py-4 bg-zinc-50 dark:bg-zinc-900/50 flex gap-3 border-t border-zinc-200 dark:border-zinc-800">
          <button 
            class="flex-1 px-4 py-2 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-md font-medium transition-colors border border-zinc-300 dark:border-zinc-700 text-sm shadow-sm"
            @click="showConfirmModal = false"
          >
            取消
          </button>
          <button 
            class="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium transition-colors text-sm shadow-sm"
            @click="confirmData.onConfirm"
          >
            确认删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tooltip-trigger {
  position: relative;
}

.tooltip-trigger::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-4px);
  background: #1e293b;
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  z-index: 100;
  pointer-events: none;
  opacity: 0;
  transition: all 0.2s;
  border: 1px solid #334155;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
}

.tooltip-trigger:hover::after {
  opacity: 1;
  transform: translateX(-50%) translateY(-10px);
}

/* Tooltip arrow */
.tooltip-trigger::before {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(2px);
  border: 5px solid transparent;
  border-top-color: #334155;
  z-index: 100;
  pointer-events: none;
  opacity: 0;
  transition: all 0.2s;
}

.tooltip-trigger:hover::before {
  opacity: 1;
  transform: translateX(-50%) translateY(-4px);
}
</style>
