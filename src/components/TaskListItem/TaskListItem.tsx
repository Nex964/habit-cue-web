import React from 'react'


function TaskListItem({task}: {task: any}) {

  return (
    <div className='
      dark:text-white dark:bg-zinc-900 
      text-black bg-zinc-100 
      border-zinc-300 dark:border-zinc-700 border 
      rounded-sm
      w-64 h-16 p-4 my-1'
    >

      {task.title}
    </div>
  )
}

export default TaskListItem