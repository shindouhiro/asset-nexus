export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  
  // 保护所有以 /api/admin 开头的路由 (如果有的话)
  // 或者保护 coupons, registries, repositories 的写操作
  const protectedPaths = ['/api/coupons', '/api/registries', '/api/repositories', '/api/users']
  const isProtectedPath = protectedPaths.some(path => url.pathname.startsWith(path))
  const isSensitiveApi = url.pathname.startsWith('/api/users')
  const isWriteOperation = event.method !== 'GET'

  if ((isProtectedPath && isWriteOperation) || isSensitiveApi) {
    const session = await getUserSession(event)
    if (!session.user) {
      throw createError({
        statusCode: 401,
        message: '未授权，请先登录',
      })
    }
  }
})
