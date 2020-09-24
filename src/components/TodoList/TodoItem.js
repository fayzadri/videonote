import { useVideoContext } from '../../context/videoContext'
import TimeDisplay from '../TimeDisplay/TimeDisplay'
import { useTodoContext } from '../../context/todoContext'
import Animate from '../shared/Animate'

export default function TodoItem({ todo }) {
  const { id, msg, person = null, time, done = false } = todo
  const { seekTo } = useVideoContext()
  const { updateTodo, removeTodo } = useTodoContext()

  const handleTimeClick = () => {
    const updatedTodo = { ...todo, done: !todo.done }
    updateTodo(updatedTodo)
  }
  const handleTimeRightClick = e => {
    e.preventDefault()
    removeTodo(id)
  }
  const handleMsgClick = () => {
    seekTo(time)
  }

  return (
    <Animate
      motionKey={id}
      className={`${
        done && 'text-gray-400'
      } relative text-gray-700 py-1 transition-all duration-200 ease-in-out bg-white border-b cursor-pointer hover:bg-highlight-100`}
    >
      <div className='flex items-center justify-start w-full h-full text-base'>
        <div
          onClick={handleTimeClick}
          onContextMenu={handleTimeRightClick}
          className='pl-5 pr-3 text-sm'
        >
          <div className={`${done && 'line-through'}`}>
            <TimeDisplay seconds={time} />
          </div>
        </div>

        <div className='px-2 py-2'>
          {person && (
            <div className='font-medium leading-5 capitalize'>{person}</div>
          )}
          <div onClick={handleMsgClick} className='leading-5'>
            {msg}
          </div>
        </div>
      </div>
    </Animate>
  )
}