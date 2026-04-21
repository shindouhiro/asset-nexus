import qiniu from 'qiniu'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const { accessKey, secretKey, bucket } = config.qiniu

  if (!accessKey || !secretKey || !bucket) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Qiniu configuration is missing',
    })
  }

  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
  const putPolicy = new qiniu.rs.PutPolicy({
    scope: bucket,
    expires: 7200,
  })
  const uploadToken = putPolicy.uploadToken(mac)

  return {
    token: uploadToken,
  }
})
