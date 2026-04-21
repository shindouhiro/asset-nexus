<script setup lang="ts">
import * as qiniu from 'qiniu-js'

const props = defineProps<{
  modelValue?: string
  placeholder?: string
}>()

const emit = defineEmits(['update:modelValue'])

const config = useRuntimeConfig()
const domain = config.public.qiniu.domain

interface ImageItem {
  url: string
  isCover: boolean
}

const isUploading = ref(false)
const progress = ref(0)
const images = ref<ImageItem[]>([])
const currentPreviewUrl = ref('')

// Initialize images from modelValue
watch(() => props.modelValue, (val) => {
  if (!val) {
    images.value = []
    return
  }
  try {
    const parsed = JSON.parse(val)
    if (Array.isArray(parsed)) {
      images.value = parsed.map(item => typeof item === 'string' ? { url: item, isCover: false } : item)
    } else if (typeof parsed === 'object' && parsed.list) {
      // Handle legacy object format if any
      images.value = (parsed.list as string[]).map(url => ({ url, isCover: url === parsed.cover }))
    } else {
       images.value = [{ url: val, isCover: true }]
    }
  } catch (e) {
    // Legacy single URL string
    images.value = [{ url: val, isCover: true }]
  }
}, { immediate: true })

function updateModel() {
  if (images.value.length === 0) {
    emit('update:modelValue', '')
    return
  }
  emit('update:modelValue', JSON.stringify(images.value))
}

async function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files || files.length === 0) return

  for (let i = 0; i < files.length; i++) {
    await uploadFile(files[i])
  }
  target.value = '' // reset input
}

async function uploadFile(file: File) {
  isUploading.value = true
  progress.value = 0

  try {
    const { token } = await $fetch<{ token: string }>('/api/qiniu/token')
    
    const key = `uploads/${Date.now()}-${file.name}`
    const qiniuRegion = config.public.qiniu.region as keyof typeof qiniu.region
    const qiniuConfig = {
      useCdnDomain: true,
      region: qiniu.region[qiniuRegion] || qiniu.region.z0
    }
    const putExtra = {}

    const observable = qiniu.upload(file, key, token, putExtra, qiniuConfig)

    return new Promise((resolve, reject) => {
      observable.subscribe({
        next(res) {
          progress.value = Math.floor(res.total.percent)
        },
        error(err) {
          console.error('Upload error:', err)
          isUploading.value = false
          reject(err)
        },
        complete(res) {
          const url = `${domain}/${res.key}`
          images.value.push({ url, isCover: false })
          updateModel()
          isUploading.value = false
          resolve(url)
        }
      })
    })
  } catch (error) {
    console.error('Failed to get upload token:', error)
    isUploading.value = false
  }
}

function setAsCover(index: number) {
  images.value.forEach((img, i) => {
    img.isCover = i === index
  })
  updateModel()
}

function removeImage(index: number) {
  images.value.splice(index, 1)
  updateModel()
}

const fileInput = ref<HTMLInputElement | null>(null)

function triggerUpload() {
  fileInput.value?.click()
}
</script>

<template>
  <div class="space-y-4">
    <!-- Image List -->
    <div v-if="images.length > 0" class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <div 
        v-for="(img, index) in images" 
        :key="index"
        class="group relative aspect-video rounded-xl border border-slate-700 bg-slate-950 overflow-hidden"
      >
        <img :src="img.url" class="h-full w-full object-cover" />
        
        <!-- Cover Badge -->
        <div 
          v-if="img.isCover || (index === 0 && !images.some(i => i.isCover))"
          class="absolute top-2 left-2 px-2 py-0.5 bg-cyan-500 text-[10px] font-bold text-white rounded-md shadow-lg z-10"
        >
          封面
        </div>

        <!-- Hover Actions -->
        <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button 
            type="button" 
            class="p-1.5 bg-white/10 hover:bg-white/30 rounded-lg text-white backdrop-blur-sm transition-all"
            title="放大预览"
            @click.stop="currentPreviewUrl = img.url"
          >
            <div class="i-carbon-view text-sm" />
          </button>
          <button 
            v-if="!img.isCover && !(index === 0 && !images.some(i => i.isCover))"
            type="button" 
            class="p-1.5 bg-white/10 hover:bg-cyan-500/80 rounded-lg text-white backdrop-blur-sm transition-all text-xs"
            title="设为封面"
            @click.stop="setAsCover(index)"
          >
            设为封面
          </button>
          <button 
            type="button" 
            class="p-1.5 bg-red-500/20 hover:bg-red-500/60 rounded-lg text-white backdrop-blur-sm transition-all"
            title="删除"
            @click.stop="removeImage(index)"
          >
            <div class="i-carbon-trash-can text-sm" />
          </button>
        </div>
      </div>

      <!-- Add More Button -->
      <button 
        type="button"
        class="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/50 hover:bg-slate-800/50 hover:border-slate-500 transition-all text-slate-500 group"
        @click="triggerUpload"
      >
        <div class="i-carbon-add text-2xl group-hover:scale-110 transition-transform" />
        <span class="text-[10px] mt-1">添加图片</span>
      </button>
    </div>

    <!-- Empty State -->
    <div 
      v-else
      class="group relative flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/50 p-8 transition-all hover:border-cyan-500/50 hover:bg-slate-800/50 cursor-pointer min-h-40"
      @click="triggerUpload"
    >
      <div v-if="!isUploading" class="flex flex-col items-center gap-2 text-slate-500">
        <div class="i-carbon-cloud-upload text-4xl" />
        <p class="text-sm font-medium">{{ placeholder || '点击或拖拽上传多张图片' }}</p>
        <p class="text-xs text-slate-600">支持 JPG, PNG, WEBP (默认首图为封面)</p>
      </div>

      <!-- Uploading State (Single file progress during sequence) -->
      <div v-if="isUploading" class="flex flex-col items-center justify-center w-full max-w-xs">
        <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div 
            class="h-full bg-cyan-500 transition-all duration-300"
            :style="{ width: `${progress}%` }"
          />
        </div>
        <span class="mt-2 text-[10px] font-semibold text-cyan-500">{{ progress }}% 上传中...</span>
      </div>
    </div>

    <input 
      ref="fileInput"
      type="file" 
      accept="image/*" 
      multiple
      class="hidden" 
      @change="handleFileChange"
    />

    <!-- Large Preview Modal -->
    <Teleport to="body">
      <div 
        v-if="currentPreviewUrl" 
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 cursor-zoom-out"
        @click="currentPreviewUrl = ''"
      >
        <div class="relative max-w-5xl max-h-full">
          <img :src="currentPreviewUrl" class="max-w-full max-h-[90vh] rounded-lg shadow-2xl" />
          <button 
            class="absolute -top-12 right-0 p-2 text-white hover:text-cyan-400 transition-colors"
            @click.stop="currentPreviewUrl = ''"
          >
            <div class="i-carbon-close text-3xl" />
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>
