// Shim de reexport para manter compatibilidade com imports antigos
// Permite usar: import { uploadBrandLogo, removeBrandLogo, ensureBrandAssetsBucket } from '@/lib/brand-logo-upload'
// Implementação real está em 'src/lib/utils/brand-logo-upload.ts'

export { uploadBrandLogo, removeBrandLogo, ensureBrandAssetsBucket } from './utils/brand-logo-upload';
