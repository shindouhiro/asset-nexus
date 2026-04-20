import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  // 暂时关闭 formatters 以解决编辑器保存时的 Code Actions 阻塞问题
  formatters: false,
  pnpm: true
})
