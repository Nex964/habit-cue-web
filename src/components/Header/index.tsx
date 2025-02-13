import { useTranslations } from 'next-intl';

export default function Header () {
  const t = useTranslations('common')

  return (
    <p className='font-semibold leading-4 text-2xl m-12 dark:text-white'>
      {t('app_name')}
    </p>
  )
}