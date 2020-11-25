/**
 * @path /src/components/Sidebar/SidebarFooter/RemoveNotes/RemoveNotes.tsx
 *
 * @project videonote
 * @file RemoveNotes.tsx
 *
 * @author Josh Mu <hello@joshmu.dev>
 * @created Monday, 12th October 2020
 * @modified Wednesday, 25th November 2020 8:44:59 pm
 * @copyright © 2020 - 2020 MU
 */

import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import { ImBin2 as TrashIcon } from 'react-icons/im'

import { useGlobalContext } from '@/context/globalContext'
import { useNoteContext } from '@/context/noteContext'

export const RemoveNotes = () => {
  const { createPrompt, project } = useGlobalContext()
  const { removeCompleted, notes } = useNoteContext()

  const handleRemoveCompleted = () => {
    const noteCompletedCount = notes.filter(note => note.done).length
    createPrompt({
      msg: (
        <span>
          Are you sure you want to remove your{' '}
          <span className='text-themeAccent'>{noteCompletedCount}</span>{' '}
          completed note{noteCompletedCount > 1 && 's'} for project:{' '}
          <span className='text-themeAccent'>{project.title}</span>?
        </span>
      ),
      action: () => {
        removeCompleted()
      },
    })
  }

  return (
    <AnimatePresence>
      {notes.filter(note => note.done).length > 0 && (
        <div
          onClick={handleRemoveCompleted}
          className='duration-300 ease-in-out cursor-pointer text-themeText2 hover:text-themeAccent transtion-colors'
        >
          <motion.div
            key='removeNotesIcon'
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <TrashIcon className='stroke-current' />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}