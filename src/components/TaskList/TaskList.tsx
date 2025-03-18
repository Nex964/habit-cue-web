"use client";

import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import TaskListItem from '../TaskListItem/TaskListItem';
import Tiptap from '../Tiptap';
import { Add, Close, Delete } from '@mui/icons-material'
import { DndContext, PointerSensor, useSensor, type DragEndEvent } from '@dnd-kit/core';
import { Droppable } from '@/libs/dnd/Droppable';
import { ENTER_KEY_CODE } from '@/utils/constants';
import { createTask } from '@/utils/helper';
import { useTranslations } from 'next-intl';


const fetchAllTasks = async () => {
  return (await axios.get('https://habit-cue.glitch.me/habit-task/tasks?id=' + localStorage.getItem('userId')))?.data
  //  return (await axios.get('https://habit-cue.glitch.me/habit-task/tasks'))?.data
}

const updateTasks = async (tasks: any) => {
  return (await axios.post('https://habit-cue.glitch.me/habit-task', { tasks: [tasks], syncCode: 11 }))?.data
}

const deleteTasks = async (ids: any) => {
  return (await axios.post('https://habit-cue.glitch.me/habit-task/delete-tasks', { taskIds: ids }))?.data
}

const Shimmer = () => {
  return (
    <div className="flex text-white h-70">
      {/* Left Sidebar */}
      <div className="w-72 bg-zinc-800 p-2 rounded-lg mr-4">
        <div className="h-6 w-24 bg-zinc-700 rounded animate-pulse mb-4"></div>
        <div className="space-y-3">
          <div className="h-12 w-full bg-zinc-700 rounded animate-pulse"></div>
          <div className="h-12 w-full bg-zinc-700 rounded animate-pulse"></div>
        </div>
        <div className="mt-6 space-y-3">
          <div className="h-10 w-3/4 bg-zinc-700 rounded animate-pulse"></div>
          <div className="h-10 w-3/4 bg-zinc-700 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-72 bg-zinc-800 p-2 rounded-lg ">
        <div className="h-6 w-24 bg-zinc-700 rounded animate-pulse mb-4"></div>
        <div className="h-16 w-full bg-zinc-700 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

// export default Shimmer;

// Main Component
function TaskList() {

  const t = useTranslations('common')
  
  const createInputRef = useRef<HTMLInputElement>(null);

  const [showCreateInput, setShowCreateInput] = useState(0);
  const [selectedTask, setSelectedTask] = useState<HabitTaskItem | undefined>(undefined);

  const [project, setProject] = useState<HabitTaskItem | undefined>();

  const [todoList, setTodoList] = useState<HabitTaskItem[]>([]);
  const [completedList, setCompletedList] = useState<HabitTaskItem[]>([]);

  const sensors = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5
    }
  });

  const result = useQuery({ queryKey: ['todos'], queryFn: fetchAllTasks })

  const taskMutation = useMutation<any, Error, Partial<HabitTaskItem>>({
    mutationFn: (newTask) => {
      return updateTasks(newTask);
    },
    onSuccess: () => {
      console.log("Refetching")
      result.refetch();
    }
  })

  const taskDeleteMutation = useMutation<any, Error, string[]>({
    mutationFn: (ids) => {
      return deleteTasks(ids);
    },
    onSuccess: () => {
      console.log("Refetching")
      setSelectedTask(undefined);
      result.refetch();
    }
  })

  const projectFilter = (isCompleted: boolean) => (task: any) => {
    return project === undefined ?
      task.isCompleted == isCompleted && task.parent === null : 
      task.isCompleted == isCompleted && project?._id === task.parent;
  }

  useEffect(() => {
    setTodoList(result?.data?.filter(projectFilter(false)))
    setCompletedList(result?.data?.filter(projectFilter(true)))
  }, [result.data, project])

  useEffect(() => {
    createInputRef.current?.focus();
  }, [showCreateInput])

  const handleOnDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;

    const item = result.data.filter((task: HabitTaskItem) => active.id === task._id)[0];

    // ignore default cases
    if (item.isCompleted && over?.id === "completed") return;
    if (!item.isCompleted && over?.id === "todo") return;

    if (item.isCompleted) {
      setCompletedList(completedList.filter((task: HabitTaskItem) => active.id !== task._id));
      setTodoList([...todoList, item]);
    }
    else {
      setTodoList(todoList.filter(task => active.id !== task._id));
      setCompletedList([item, ...completedList]);
    }
    item.isCompleted = !item.isCompleted;

    taskMutation.mutate({ id: item._id, isCompleted: item.isCompleted })
  }

  const onEditorClose = () => {
    setSelectedTask(undefined)
  }

  const handleCreateButtonClick = (val: number) => () => {
    setShowCreateInput(val);
  }

  const handleCreateKeyDown = (event: any) => {
    if (event.keyCode === ENTER_KEY_CODE) {
      const type = showCreateInput === 1 ? 'task' : 'project';
      setShowCreateInput(0);
      if (createInputRef?.current?.value) {
        const newTaskObj = createTask(createInputRef.current?.value, type, project?._id || null);
        taskMutation.mutate(newTaskObj);
      }
    }
  }

  const handleDeleteTask = (taskId: string) => {
    if (confirm("Are you sure ?")) {
      taskDeleteMutation.mutate([taskId])
    }
  }

  const handleOnItemClick = (task: any) => {
    if(task.type === 'project')
      setProject(task);

    setSelectedTask(task)
  }

  return (
    <div className='dark:text-white '>
      <p className='text-neutral-600 dark:text-neutral-300 font-semibold text-xl mb-4'>
        {t('task_list_title')}
        
        {project && (
          <span className='font-normal text-neutral-500 dark:text-neutral-500'>
            {project === undefined ? '' : ' for ' + project.title}
            <Close onClick={() => {
                setProject(undefined) 
                setSelectedTask(undefined)
              }} 
              className=' text-white p-1 cursor-pointer rounded-md hover:bg-zinc-700 active:bg-zinc-400' fontSize='large' />
          </span>
        )}
      </p>

      {/* {result.isLoading && <p>Loading</p>} */}
      {result.isLoading && <Shimmer/>}
       {/* <Shimmer/> */}
      {result.isError && <p>{result?.error.message}</p>}
      {result.isSuccess && (
        <DndContext sensors={[sensors]} onDragEnd={handleOnDragEnd}>
          <div className='flex flex-row items-start'>
            <div className='min-w-72 flex flex-col dark:bg-zinc-800 bg-zinc-200 rounded-md p-2'>
              <Droppable id="todo">
                <p className='p-2 text-sm font-medium text-zinc-500 uppercase'>To do {todoList?.length}</p>
                {todoList?.map((task: any) => {
                  return <TaskListItem onClick={handleOnItemClick} task={task} />
                })}
              </Droppable>

              {!showCreateInput && (
                <button onClick={handleCreateButtonClick(1)} className='flex flex-row items-center pr-2 text-gray-300 text-sm active:bg-zinc-600 hover:bg-zinc-700 rounded-sm' >
                  <Add className='m-2' fontSize='small' /> Create new Task
                </button>
              )}

              {!showCreateInput && project === undefined && (
                <button onClick={handleCreateButtonClick(2)} className='flex flex-row items-center pr-2 text-gray-300 text-sm active:bg-zinc-600 hover:bg-zinc-700 rounded-sm' >
                  <Add className='m-2' fontSize='small' /> Create new Project
                </button>
              )}

              {showCreateInput > 0 && (
                <input
                  ref={createInputRef}
                  onBlur={() => setShowCreateInput(0)}
                  placeholder={showCreateInput === 1 ? 'What needs to be done?' : 'Name your project'}
                  onKeyDown={handleCreateKeyDown}
                  className='
                    dark:text-gray-400 dark:bg-zinc-900 
                    text-gray-600 bg-zinc-100 
                    placeholder:text-gray-500
                    border-zinc-300 dark:border-blue-400 border 
                    rounded-sm
                    text-sm
                    w-64 h-16 p-4 my-1'
                />
              )}

            </div>

            <div className='min-w-72 flex flex-col dark:bg-zinc-800 bg-zinc-200 rounded-md p-2 ml-4'>
              <Droppable id="completed">
                <p className='p-2 text-sm font-medium text-zinc-500 uppercase'>Completed {completedList?.length}</p>
                {completedList?.map((task: any) => {
                  return <TaskListItem onClick={handleOnItemClick} task={task} />
                })}
              </Droppable>
            </div>

            {selectedTask !== undefined && (
              <div className='flex flex-col w-full ml-4 h-full bg-zinc-800 text-gray-300 rounded-md'>

                <div className='flex flex-row w-full items-center justify-between'>

                  <h3 className='ml-3 font-semibold text-zinc-300 text-2xl flex flex-row items-center'>
                    {selectedTask?.title}

                    <Delete onClick={() => {
                      if(selectedTask._id !== undefined)
                        handleDeleteTask(selectedTask._id);
                    }} fontSize='large' className='m-2 p-2 cursor-pointer rounded-md hover:bg-zinc-700 active:bg-zinc-400' />
                  </h3>
                  {/* <h3 className='ml-3 font-semibold text-zinc-300 text-sm'>{selectedTask?._id}</h3>
                  <h3 className='ml-3 font-semibold text-zinc-300 text-sm'>{selectedTask?.createdBy}</h3> */}

                  <Close onClick={onEditorClose} className='m-2 text-white p-1 cursor-pointer rounded-md hover:bg-zinc-700 active:bg-zinc-400' fontSize='large' />
                </div>

                <Tiptap
                  loading={taskMutation.isPending}
                  onSave={(newNotes: string) => taskMutation.mutate({ id: selectedTask._id, notes: newNotes })}
                  content={selectedTask?.notes || ""} />
              </div>
            )}
          </div>
        </DndContext>
      )}
    </div>
  )
}

export default TaskList