import { Draggable } from '@/libs/dnd/Draggable'
import React from 'react'


function TaskListItem({task, onClick}: {task: any, onClick: (content: string) => {} }) {

  return (
    <Draggable id={task._id}>
      <div 
      onClick={() => onClick(task)}
      className={`
        dark:text-gray-400 dark:bg-zinc-900 
        text-gray-600 bg-zinc-100 
        ${task.type === 'project' ? 'border-orange-300 dark:border-orange-400' : 'border-zinc-300 dark:border-zinc-700'}
         border 
        rounded-sm
        text-sm
        w-64 h-16 p-4 my-1`}
      >
        {task.type === 'project' ? '⦿ ': ''}
        {task.title}
      </div>
    </Draggable>
  )
}

export default TaskListItem