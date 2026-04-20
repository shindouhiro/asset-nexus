export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()

  // 这里的鉴权逻辑可以根据需要调整
  // 如果是前往 /admin 页面但没有登录，则重定向到 /login
  if (to.path.startsWith('/admin') && !loggedIn.value) {
    return navigateTo('/login')
  }

  // 如果已经登录，尝试访问登录页，则重定向到 /admin
  if (to.path === '/login' && loggedIn.value) {
    return navigateTo('/admin')
  }
})
