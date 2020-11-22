/**
 * @path /src/components/Modals/CreateProjectModal/CreateProjectModal.js
 * 
 * @project videonote
 * @file CreateProjectModal.js
 * 
 * @author Josh Mu <hello@joshmu.dev>
 * @created Sunday, 20th September 2020
 * @modified Sunday, 22nd November 2020 3:26:33 pm
 * @copyright © 2020 - 2020 MU
 */

import { useState } from 'react'

import ModalPrimaryBtn from '@/components/shared/Modal/ModalBtn'
import { useGlobalContext } from '@/context/globalContext'
import { useNotificationContext } from '@/context/notificationContext'
import ModalContainer from '@/shared/Modal/ModalContainer'
import ModalForm from '@/shared/Modal/ModalForm'
import ModalHeader from '@/shared/Modal/ModalHeader'
import ModalInnerContainer from '@/shared/Modal/ModalInnerContainer'
import ModalInput from '@/shared/Modal/ModalInput'

import { LocalVideoForm } from '../../shared/LocalVideoForm/LocalVideoForm'

export default function CreateProjectModal({ toggle: toggleModal, motionKey }) {
  const { createProject } = useGlobalContext()
  const { addAlert } = useNotificationContext()

  const [project, setProject] = useState({
    title: '',
    src: '',
  })

  const handleCreate = async e => {
    const title = project.title.trim()
    const videoSrc = project.src.trim()

    e.preventDefault()
    if (title.length === 0 || videoSrc.length === 0) {
      if (title.length === 0)
        addAlert({
          type: 'error',
          msg: 'Project title required.',
        })
      if (videoSrc.length === 0)
        addAlert({
          type: 'error',
          msg: 'Video source required.',
        })
      return
    }

    const newProject = { title, src: videoSrc }
    await createProject(newProject)
    toggleModal()
  }

  const handleChange = e => {
    setProject({ ...project, [e.target.id]: e.target.value })
  }

  const handleVideoSrc = url => {
    console.log(url)
    if (typeof url !== 'string' || url.length === 0) return
    setProject({ ...project, src: url })
  }

  return (
    <ModalContainer toggle={toggleModal} motionKey={motionKey}>
      <ModalHeader>
        Create Project {project.title && `- ${project.title}`}
      </ModalHeader>

      <ModalInnerContainer>
        <ModalForm>
          <ModalInput
            title='Project Title'
            id='title'
            type='text'
            value={project.title}
            onChange={handleChange}
          />

          <ModalInput
            title='Video URL'
            placeholder='Dropbox, Youtube, Vimeo...'
            id='src'
            type='text'
            value={project.src}
            onChange={handleChange}
          />

          <LocalVideoForm handleVideoSrc={handleVideoSrc} />

          <div></div>
          <ModalPrimaryBtn handleClick={handleCreate}>Create</ModalPrimaryBtn>
        </ModalForm>
      </ModalInnerContainer>
    </ModalContainer>
  )
}
