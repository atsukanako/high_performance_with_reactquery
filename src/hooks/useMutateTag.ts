import axios from 'axios'
import { useAppDispatch } from '../app/hooks'
import { resetEditedTag } from '../slices/todoSlice'
import { useQueryClient, useMutation } from 'react-query'
import { Tag } from '../types/types'

export const useMutateTag = () => {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  const createTagMutation = useMutation(
    (tag: Omit<Tag, 'id'>) =>
      axios.post<Tag>('http://127.0.0.1:8000/api/tags/', tag),
    {
      onSuccess: (res) => {
        const previousTags = queryClient.getQueryData<Tag[]>('tags')
        if (previousTags) {
          queryClient.setQueryData<Tag[]>('tags', [...previousTags, res.data])
        }
        dispatch(resetEditedTag())
      },
    }
  )
  const updateTagMutation = useMutation(
    (tag: Tag) =>
      axios.put<Tag>(`http://127.0.0.1:8000/api/tags/${tag.id}/`, tag),
    {
      onSuccess: (res, variables) => {
        const previousTags = queryClient.getQueryData<Tag[]>('tags')
        if (previousTags) {
          queryClient.setQueryData<Tag[]>(
            'tags',
            previousTags.map((tag) =>
              tag.id === variables.id ? res.data : tag
            )
          )
        }
        dispatch(resetEditedTag())
      },
    }
  )
  const deleteTagMutation = useMutation(
    (id: number) => axios.delete(`http://127.0.0.1:8000/api/tags/${id}/`),
    {
      onSuccess: (res, variables) => {
        const previousTags = queryClient.getQueryData<Tag[]>('tags')
        if (previousTags) {
          queryClient.setQueryData<Tag[]>(
            'tags',
            previousTags.filter((tag) => tag.id !== variables)
          )
        }
        dispatch(resetEditedTag())
      },
    }
  )
  return { deleteTagMutation, createTagMutation, updateTagMutation }
}
