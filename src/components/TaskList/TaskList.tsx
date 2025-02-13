"use client";

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'
import TaskListItem from '../TaskListItem/TaskListItem';


const fetchAllTasks = async () => {
  return (await axios.get('https://habit-cue.glitch.me/habit-task'))?.data
}

function TaskList() {

  const result = useQuery({ queryKey: ['todos'], queryFn: fetchAllTasks })

  return (
    <div className='dark:text-white mt-4'>
      {result.isLoading && <p>Loading</p>}
      {result.isError && <p>{result?.error.message}</p>}
      {result.isSuccess && (
        <div className='flex flex-row'>
          <div className='flex flex-col dark:bg-zinc-800 bg-zinc-200 rounded-md p-2'>
            <p className='p-2 text-sm font-medium text-zinc-500 uppercase'>To do {result?.data?.filter?.(task => !task.isCompleted)?.length}</p>
            {result?.data?.filter?.(task => !task.isCompleted).map((task: any)=> {
              return <TaskListItem task={task}/>
            })}
          </div>

          <div className='flex flex-col dark:bg-zinc-800 bg-zinc-200 rounded-md p-2 ml-4'>
            <p className='p-2 text-sm font-medium text-zinc-500 uppercase'>Completed {result?.data?.filter?.(task => task.isCompleted)?.length}</p>
            {result?.data?.filter?.(task => task.isCompleted).map((task: any)=> {
              return <TaskListItem task={task}/>
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskList