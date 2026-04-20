# AssetNexus Project Plan (Nuxt 3 + UnoCSS)

本项目已按照要求调整为基于 Nuxt 3 + UnoCSS 的高性能架构。

## 核心架构

- **技术栈**: Nuxt 3, UnoCSS, Vue 3, TypeScript.
- **代码规范**: `@antfu/eslint-config`.
- **依赖管理**: 使用 `pnpm catalogs` 统一管理版本。

## 业务功能

- **前台展示**: 优惠券网格显示 (UnoCSS 响应式布局 + 玻璃拟态设计)。
- **后台管理**: 优惠券全生命周期操作 (标题、图片、描述、链接)。

## 当前进度

- [x] 初始化 pnpm 工作区及全局 `catalogs`
- [x] 基于 `nuxi` 初始化 `apps/web`
- [x] 集成 `@unocss/nuxt` 及配置
- [x] 实现 `/api/coupons` 服务端接口
- [x] 完成前台优惠券展示页面 (`/`)
- [x] 完成后台优惠券管理面板 (`/admin`)

## 快速开始

```bash
pnpm install
pnpm --filter web dev
```
