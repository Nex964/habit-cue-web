"use client";

import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import TaskListItem from '../TaskListItem/TaskListItem';
import Tiptap from '../Tiptap';
import { Add, Close } from '@mui/icons-material'
import {DndContext, PointerSensor, useSensor} from '@dnd-kit/core';
import { Droppable } from '@/libs/dnd/Droppable';
import { ENTER_KEY_CODE } from '@/utils/constants';
import { createTask } from '@/utils/helper';


const fetchAllTasks = async () => {
  return (await axios.get('https://habit-cue.glitch.me/habit-task'))?.data
}

const updateTasks = async (tasks: any) => {
  return (await axios.post('https://habit-cue.glitch.me/habit-task', { tasks: [tasks], syncCode: 11 }))?.data
}


// Main Component
function TaskList() {

  const createInputRef = useRef<HTMLInputElement>();

  const [showCreateInput, setShowCreateInput] = useState(false);
  const [selectedTask, setSelectedTask] = useState();

  const [todoList, setTodoList] = useState([]);
  const [completedList, setCompletedList] = useState([]);

  const sensors = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5
    }
  });

  const result = useQuery({ queryKey: ['todos'], queryFn: fetchAllTasks })

  const taskMutation = useMutation({
    mutationFn: (newTask) => {
      return updateTasks(newTask);
    },
    onSuccess: () => {
      console.log("Refetching")
      result.refetch();
    }
  })

  useEffect(() => {
    setTodoList(result?.data?.filter?.((task: any) => !task.isCompleted))
    setCompletedList(result?.data?.filter?.((task: any) => task.isCompleted))
  }, [result.data])

  useEffect(() => {
    createInputRef.current?.focus();
  }, [showCreateInput])

  const handleOnDragEnd = (event) => {
    const {over, active} = event;

    const item = result.data.filter(task => active.id === task._id)[0];
    
    console.log("Stats", item, item.isCompleted, over.id)
    // ignore default cases
    if(item.isCompleted && over.id === "completed") return;
    if(!item.isCompleted && over.id === "todo") return;

    if(item.isCompleted){
      setCompletedList(completedList.filter(task => active.id !== task._id));
      setTodoList([...todoList, item]);
    }
    else{
      setTodoList(todoList.filter(task => active.id !== task._id));
      setCompletedList([item, ...completedList]);
    }

    item.isCompleted = !item.isCompleted;

  }

  const onEditorClose = () => {
    setSelectedTask(undefined)
  }

  const handleCreateButtonClick = () => {
    setShowCreateInput(true);
  }

  const handleCreateKeyDown = (event: any) => {
    if(event.keyCode === ENTER_KEY_CODE){
      setShowCreateInput(false);
      if(createInputRef?.current?.value){
        const newTaskObj = createTask(createInputRef.current?.value);
        taskMutation.mutate(newTaskObj);
      }
    }
  }

  return (
    <div className='dark:text-white mt-4'>
      {result.isLoading && <p>Loading</p>}
      {result.isError && <p>{result?.error.message}</p>}
      {result.isSuccess && (
        <DndContext sensors={[sensors]} onDragEnd={handleOnDragEnd}>
          <div className='flex flex-row items-start'>
            <div className='flex flex-col dark:bg-zinc-800 bg-zinc-200 rounded-md p-2'>
              <Droppable id="todo">
              <p className='p-2 text-sm font-medium text-zinc-500 uppercase'>To do {todoList?.length}</p>
              {todoList?.map((task: any)=> {
                return <TaskListItem onClick={setSelectedTask} task={task}/>
              })}
              </Droppable>

              {!showCreateInput && (
                <button onClick={handleCreateButtonClick} className='flex flex-row items-center text-gray-300 text-sm active:bg-zinc-600 hover:bg-zinc-700 rounded-sm' > 
                  <Add className='m-2' fontSize='small'/> Create new task
                </button>
              )}

              {showCreateInput && (
                <input 
                  ref={createInputRef} 
                  onBlur={() => setShowCreateInput(false)} 
                  placeholder='What needs to be done?' 
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

            <div className='flex flex-col dark:bg-zinc-800 bg-zinc-200 rounded-md p-2 ml-4'>
              <Droppable id="completed">
              <p className='p-2 text-sm font-medium text-zinc-500 uppercase'>Completed {completedList?.length}</p>
              {completedList?.map((task: any)=> {
                return <TaskListItem onClick={setSelectedTask} task={task}/>
              })}
              </Droppable>
            </div>

            {selectedTask !== undefined && (
              <div className='flex flex-col w-full ml-4 h-full bg-zinc-800 text-gray-300 rounded-md'>
                
                <div className='flex flex-row w-full items-center justify-between'>
                  <h3 className='ml-3 font-semibold text-zinc-300 text-2xl'>{selectedTask?.title}</h3>
                  <h3 className='ml-3 font-semibold text-zinc-300 text-sm'>{selectedTask?._id}</h3>
                  <h3 className='ml-3 font-semibold text-zinc-300 text-sm'>{selectedTask?.createdBy}</h3>
                  <Close onClick={onEditorClose} className='m-2 text-white p-1 cursor-pointer rounded-md hover:bg-zinc-700 active:bg-zinc-400' fontSize='large'/>
                </div>

                <Tiptap 
                  loading={taskMutation.isPending}
                  onSave={(newNotes) => taskMutation.mutate({id: selectedTask._id, notes: newNotes})} 
                  content={selectedTask?.notes || ""}/>
              </div>
            )}
          </div>
        </DndContext>
      )}
    </div>
  )
}

export default TaskList