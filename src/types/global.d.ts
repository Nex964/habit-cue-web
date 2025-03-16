/* eslint-disable @typescript-eslint/consistent-type-imports */
// Use type safe message keys with `next-intl`
type Messages = typeof import('../locales/en.json');
declare interface IntlMessages extends Messages {}


type HabitTaskItem = {
  _id?: string
  id?: string
  title?: string,
  notes?: string,
  createdAt?: string,
  updatedAt?: string,
  createdBy?: string | undefined
  isCompleted?: boolean
  parent?: string | null
  childs?: string[] | null | undefined
  type?: TaskType
  extraData?: {
    count?: number
    unit?: string
    weight?: number
    weightUnit?: string
  }
  notificationData?: NotificationData
  notificationIds?: string[]
  groupId?: string;
  isCopy?: boolean;
  syncStatus?: number // 0 need to upload // 1 uploaded 
}

type TaskType = "task" | "timed" | "count" | "group" | "log" | "workout" | "workout-log" | "project"