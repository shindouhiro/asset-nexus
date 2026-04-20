<script setup lang="ts">
const password = ref('')
const error = ref('')
const loading = ref(false)

const { fetch: refreshSession } = useUserSession()

async function handleLogin() {
  if (!password.value) {
    error.value = '请输入密码'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { password: password.value },
    })
    
    await refreshSession()
    await navigateTo('/admin')
  } catch (e: any) {
    error.value = e.data?.message || '登录失败，请检查密码'
  } finally {
    loading.value = false
  }
}

definePageMeta({
  layout: false
})
</script>

<template>
  <div class="min-h-screen bg-slate-950 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- Logo/Brand -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_30px_rgba(34,211,238,0.3)] mb-6">
          <div class="i-carbon-nexus text-4xl text-white" />
        </div>
        <h1 class="text-3xl font-bold text-white tracking-tight">
          Asset Nexus
        </h1>
        <p class="text-slate-400 mt-2">
          管理后台身份验证
        </p>
      </div>

      <!-- Login Card -->
      <div class="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <!-- Decoration -->
        <div class="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <form class="space-y-6 relative z-10" @submit.prevent="handleLogin">
          <div>
            <label for="password" class="block text-sm font-medium text-slate-400 mb-2 ml-1">
              内部管理密码
            </label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-500 transition-colors">
                <div class="i-carbon-password" />
              </div>
              <input
                id="password"
                v-model="password"
                type="password"
                placeholder="••••••••"
                required
                class="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                :disabled="loading"
              >
            </div>
            <p v-if="error" class="text-rose-500 text-xs mt-2 ml-1 flex items-center gap-1">
              <div class="i-carbon-error" />
              {{ error }}
            </p>
          </div>

          <button
            type="submit"
            class="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold shadow-lg shadow-cyan-900/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
            :disabled="loading"
          >
            <div v-if="loading" class="i-carbon-progress-bar-round animate-spin text-xl" />
            <div v-else class="i-carbon-login text-xl" />
            {{ loading ? '验证中...' : '进入后台' }}
          </button>
        </form>

        <div class="mt-8 pt-6 border-t border-slate-800 text-center">
          <NuxtLink to="/" class="text-sm text-slate-500 hover:text-cyan-400 transition-colors inline-flex items-center gap-1">
            <div class="i-carbon-arrow-left" />
            返回首页
          </NuxtLink>
        </div>
      </div>

      <!-- Footer Message -->
      <p class="text-center text-slate-600 text-xs mt-8">
        &copy; 2024 Asset Nexus. 安全管理系统.
      </p>
    </div>
  </div>
</template>
