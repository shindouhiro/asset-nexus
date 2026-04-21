import { defineEventHandler, getQuery, sendProxy } from 'h3'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const url = query.url as string

  if (!url) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing url parameter',
    })
  }

  // 只允许代理您自己的七牛云域名，防止被当成通用代理工具
  if (!url.includes('tdtxvlodu.hn-bkt.clouddn.com')) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Invalid target domain',
    })
  }

  // 将协议强制修正为 http 去请求七牛云
  const targetUrl = url.replace('https://', 'http://')

  return sendProxy(event, targetUrl, {
    sendStream: true,
  })
})
