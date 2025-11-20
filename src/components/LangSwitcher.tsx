// 'use client'

// import { usePathname, useRouter } from 'next/navigation'
// import { Button } from '@heroui/react'
// import { Globe } from 'lucide-react'
// import { useLocale } from 'next-intl'

// export function LangSwitcher() {
//   const locale = useLocale()
//   const router = useRouter()
//   const pathname = usePathname()

//   const switchLocale = (newLocale) => {
//     const path = pathname.replace(`/${locale}`, `/${newLocale}`)
//     router.push(path)
//   }

//   const otherLocale = locale === 'th' ? 'en' : 'th'
//   const localeLabel = otherLocale === 'th' ? 'ไทย' : 'EN'

//   return (
//     <Button
//       onPress={() => switchLocale(otherLocale)}
//       variant="ghost"
//       size="sm"
//       startContent={<Globe size={16} />}
//     >
//       {localeLabel}
//     </Button>
//   )
// }
