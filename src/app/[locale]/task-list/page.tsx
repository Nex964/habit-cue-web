import TaskList from '@/components/TaskList/TaskList';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'meta',
  });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function Index() {
  const t = useTranslations('common')

  return (
    <>
    <div>
      <p className='text-neutral-600 dark:text-neutral-300 font-semibold text-xl'>
        {t('task_list_title')}
      </p>

      <TaskList />

    </div>
    </>
  )
}