import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

import { useGlobalContext } from '@/context/globalContext'
import { useVideoContext } from '@/context/videoContext'

import AboutModal from './AboutModal/AboutModal'
import ConfirmModal from './ConfirmModal/ConfirmModal'
import CreateProjectModal from './CreateProjectModal/CreateProjectModal'
import CurrentProjectModal from './CurrentProjectModal/CurrentProjectModal'
import HelpModal from './HelpModal/HelpModal'
import ProjectsModal from './ProjectsModal/ProjectsModal'
import SettingsModal from './SettingsModal/SettingsModal'
import UserAccountModal from './UserAccountModal/UserAccountModal'
import WelcomeModal from './WelcomeModal/WelcomeModal'

export default function Modals() {
  const {
    modalsOpen,
    toggleModalOpen,
    promptState,
    promptCancel,
  } = useGlobalContext()
  const { toggleSmartControls } = useVideoContext()

  useEffect(() => {
    const enableSmartControls = !modalsOpen
    toggleSmartControls(enableSmartControls)
  }, [modalsOpen])

  const checkModalOpen = modalId => modalsOpen.includes(modalId)

  return (
    <AnimatePresence>
      {checkModalOpen('current') && (
        <CurrentProjectModal
          toggle={toggleModalOpen}
          motionKey='currentProjectModal'
          key='currentProjectModal'
        />
      )}
      {checkModalOpen('create') && (
        <CreateProjectModal
          toggle={toggleModalOpen}
          motionKey='createProjectModal'
          key='currentProjectModal'
        />
      )}
      {checkModalOpen('projects') && (
        <ProjectsModal
          toggle={toggleModalOpen}
          motionKey='projectsModal'
          key='projectsModal'
        />
      )}
      {checkModalOpen('settings') && (
        <SettingsModal
          toggle={toggleModalOpen}
          motionKey='settingsModal'
          key='settingsModal'
        />
      )}
      {checkModalOpen('user') && (
        <UserAccountModal
          toggle={toggleModalOpen}
          motionKey='userAccountModal'
          key='userAccountModal'
        />
      )}
      {checkModalOpen('help') && (
        <HelpModal
          toggle={toggleModalOpen}
          motionKey='helpModal'
          key='helpModal'
        />
      )}
      {checkModalOpen('about') && (
        <AboutModal
          toggle={toggleModalOpen}
          motionKey='aboutModal'
          key='aboutModal'
        />
      )}
      {checkModalOpen('welcome') && (
        <WelcomeModal
          toggle={toggleModalOpen}
          motionKey='aboutModal'
          key='aboutModal'
        />
      )}
      {promptState.isOpen && (
        <ConfirmModal
          toggle={promptCancel}
          motionKey='confirmModal'
          key='confirmModal'
        />
      )}
    </AnimatePresence>
  )
}
