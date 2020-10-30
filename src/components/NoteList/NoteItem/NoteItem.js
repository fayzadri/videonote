import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import Select from '@/components/shared/Select/Select'
import { useControlsContext } from '@/context/controlsContext'
import { useNoteContext } from '@/context/noteContext'
import { useVideoContext } from '@/context/videoContext'
import { useIsMount } from '@/hooks/useIsMount'
import TimeDisplay from '@/shared/TimeDisplay/TimeDisplay'

const NoteItem = ({ note, closestProximity, childVariants }) => {
  const { seekTo } = useVideoContext()
  const { toggleSmartControls } = useControlsContext()
  const { updateNote } = useNoteContext()

  const [isEditing, setIsEditing] = useState(false)
  const [state, setState] = useState(note)

  const isMount = useIsMount()

  // no smart controls whilst editing
  useEffect(() => {
    const enableSmartControls = !isEditing
    toggleSmartControls(enableSmartControls)
  }, [isEditing])

  // update note whenever their is a change
  useEffect(() => {
    // do not update on initial load
    if (isMount) return
    // do not update whilst editing content
    if (isEditing) return
    // do not update if state has not been modified from the initially loaded note
    if (Object.entries(state).every(([key, val]) => note[key] === val)) return

    updateNote(state)
  }, [isEditing, state, isMount])

  const handleTimeClick = () => {
    const updatedNote = { ...state, done: !state.done }
    setState(updatedNote)
  }

  const handleNoteClick = () => {
    seekTo(state.time)
  }
  const toggleEdit = (willEdit = undefined) => {
    setIsEditing(current => {
      const newState = willEdit === undefined ? !current : willEdit
      return newState
    })
  }
  const handleEdit = e => {
    const updatedState = { ...state, content: e.target.value }
    setState(updatedState)
  }
  const handleEditKeys = e => {
    if (e.key === 'Enter') {
      setIsEditing(false)
      return
    }
  }

  return (
    <motion.div
      key={state._id}
      // * childVariants used so we don't pass 'initial', 'animate' etc
      variants={childVariants}
      className={`${
        closestProximity ? 'bg-opacity-25' : ' bg-opacity-0'
      } relative border-b cursor-pointer border-themeText2 bg-themeSelectOpacity transition-colors duration-200 ease-out`}
    >
      <Select padding='p-0'>
        <div className='relative flex items-center justify-start w-full h-full text-base'>
          <div
            onClick={handleTimeClick}
            className={`${
              state.done && 'line-through'
            } text-xs transition-colors duration-300 ease-in-out text-themeText2`}
          >
            <div className='px-2'>
              <TimeDisplay seconds={state.time} lock={closestProximity} />
            </div>
          </div>

          <div
            onClick={handleNoteClick}
            className={`${
              state.done && 'text-themeText2'
            } w-full h-full py-2 pl-2`}
          >
            {/* {category && (
              <div className='text-sm leading-5 capitalize'>{category}</div>
            )} */}
            {isEditing ? (
              <input
                type='text'
                value={state.content}
                onChange={handleEdit}
                onKeyDown={handleEditKeys}
                onDoubleClick={() => toggleEdit(false)}
                onBlur={() => toggleEdit(false)}
                className='placeholder-themeText text-themeText bg-themeBg focus:outline-none '
                autoFocus
              />
            ) : (
              <div
                onDoubleClick={() => toggleEdit(true)}
                className='text-sm leading-5'
              >
                {state.content}
              </div>
            )}
          </div>
        </div>
      </Select>
    </motion.div>
  )
}

export default NoteItem
