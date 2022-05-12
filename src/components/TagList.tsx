import { FC, memo } from 'react'
import { TagItemMemo } from './TagItem'
import { useQueryTags } from '../hooks/useQueryTags'
import { useQueryClient } from 'react-query'
import { Tag } from '../types/types'

const TagList: FC = () => {
  const { status, data } = useQueryTags()
  // const queryClient = useQueryClient()
  // const data = queryClient.getQueryData<Tag[]>('tags')

  console.log('rendered TagList')
  if (status === 'loading') return <div>{'Loading...'}</div>
  if (status === 'error') return <div>{'Error'}</div>
  return (
    <div>
      <ul>
        {data?.map((tag) => (
          <TagItemMemo key={tag.id} tag={tag} />
        ))}
      </ul>
    </div>
  )
}
export const TagListMemo = memo(TagList)
