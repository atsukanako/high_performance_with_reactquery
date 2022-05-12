import axios from 'axios'
import { useAppDispatch } from '../app/hooks'
import { resetEditedTask } from '../slices/todoSlice'
import { useQueryClient, useMutation } from 'react-query'
import { Task, EditTask } from '../types/types'

export const useMutateTask = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  const createTaskMutation = useMutation(
    (task: Omit<EditTask, 'id'>) =>
      axios.post<Task>('http://127.0.0.1:8000/api/tasks/', task),
    {
      onSuccess: (res) => {
        const previousTodos = queryClient.getQueryData<Task[]>('tasks')
        if (previousTodos) {
          queryClient.setQueryData<Task[]>('tasks', [
            ...previousTodos,
            res.data,
          ])
        }
        dispatch(resetEditedTask())
      },
    }
  )
  const updateTaskMutation = useMutation(
    (task: EditTask) =>
      axios.put<Task>(`http://127.0.0.1:8000/api/tasks/${task.id}/`, task),
    {
      onSuccess: (res, variables) => {
        const previousTodos = queryClient.getQueryData<Task[]>('tasks')
        if (previousTodos) {
          queryClient.setQueryData<Task[]>(
            'tasks',
            previousTodos.map((task) =>
              task.id === variables.id ? res.data : task
            )
          )
        }
        dispatch(resetEditedTask())
      },
    }
  )
  const deleteTaskMutation = useMutation(
    (id: number) => axios.delete(`http://127.0.0.1:8000/api/tasks/${id}/`),
    {
      onSuccess: (res, variables) => {
        const previousTodos = queryClient.getQueryData<Task[]>('tasks')
        if (previousTodos) {
          queryClient.setQueryData<Task[]>(
            'tasks',
            previousTodos.filter((task) => task.id !== variables)
          )
        }
        dispatch(resetEditedTask())
      },
    }
  )
  return { deleteTaskMutation, createTaskMutation, updateTaskMutation }
}
