import { createContext, useContext, useEffect, useRef, useState } from 'react'

import { useAnounceAction } from '../hooks/useAnounceAction'
import { useGlobalContext } from './globalContext'
import { useNotificationContext } from './notificationContext'

const videoContext = createContext({
  ready: false,
  playing: false,
  volume: 0.75,
  setVolume: a => {},
  playbackRate: 0.75,
  setPlaybackRate: a => {},
  duration: null,
  setDuration: a => {},
  handleDuration: a => {},
  progress: { playedSeconds: 0, played: 0, loadedSeconds: 0, loaded: 0 },
  handleReady: a => {},
  url: '',
  togglePlay: (a = 0) => {},
  changeVolume: a => {},
  handleProgress: () => {},
  seekTo: (a, { offset = true } = {}) => {},
  playerRef: {},
  handlePlayerError: a => {},
})

export function VideoProvider(props) {
  const {
    project,
    updateProject,
    settings,
    toggleSidebar,
    toggleModalOpen,
    admin,
    toggleMenuOpen,
  } = useGlobalContext()
  const { addAlert } = useNotificationContext()
  const playerRef = useRef(null)
  const [url, setUrl] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.75)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [duration, setDuration] = useState(null)
  const [progress, setProgress] = useState({})

  const [action, setAction] = useAnounceAction('')

  // on initial load alert user if project is available however no src is specified
  // * this could be due to a local video src thus being reset to an empty string when cannot be found
  useEffect(() => {
    if (project && project.src.length === 0 && admin) {
      addAlert({
        type: 'warning',
        msg: (
          <span>
            Please provide video source for project:{' '}
            <span className='text-themeAccent'>{project.title}</span>
          </span>
        ),
        duration: 12000,
      })

      toggleModalOpen('current')
    }
  }, [project, admin])

  useEffect(() => {
    if (project !== null && project.src !== null) {
      if (project.src !== url) {
        console.log('project changed, setting url')
        setUrl(project.src)
      }
    } else {
      setUrl(null)
    }
  }, [project])

  const handleReady = reactPlayer => {
    // assign react player
    playerRef.current = reactPlayer
  }

  const togglePlay = () => {
    setPlaying(playing => {
      const updatedPlayState = !playing
      // console.log({ playing, newState })
      setAction(updatedPlayState ? 'play' : 'pause')
      return updatedPlayState
    })
  }

  const changeVolume = increment => {
    // validate
    if (Number(increment) === NaN) return

    // increment
    let newVolume = volume + Number(increment)
    // limit between 0 - 1
    newVolume = newVolume < 0 ? 0 : newVolume > 1 ? 1 : newVolume
    setVolume(newVolume)

    setAction(increment > 0 ? 'volumeUp' : 'volumeDown')
  }

  const handleProgress = e => {
    // * config progress interval via -> progressInterval prop
    // {playedSeconds: 8.362433858856201, played: 0.03743574367943649, loadedSeconds: 38.721, loaded: 0.17334061536119902}
    setProgress(e)
  }

  const seekTo = (secs, { offset = true } = {}) => {
    // validate
    if (Number(secs) === NaN || playerRef === null) return

    // settings offset
    const playPosition = secs + (offset ? settings.playOffset : 0)

    playerRef.current.seekTo(playPosition, 'seconds')
  }

  const jumpBack = () => {
    const destination = progress.playedSeconds - settings.seekJump
    seekTo(destination > 0 ? destination : 0)

    setAction('seekBack')
  }

  const jumpForward = () => {
    const destination = progress.playedSeconds + settings.seekJump
    seekTo(destination)

    setAction('seekForward')
  }

  const handlePlayerError = error => {
    console.log('vn player error', error)

    if (error.target && error.target.error.message.includes('Format error')) {
      addAlert({
        type: 'warning',
        msg: 'Please re-locate your video, via project settings.',
        duration: 12000,
      })

      updateProject({ src: '' })
      toggleModalOpen('current')
      // requestLocalVideo()

      return
    }

    addAlert({ type: 'error', msg: 'Player unable to load video.' })
  }

  // todo: remove automatic pop up and replace with a button alternative ( or better > auto pop up current project settings modal)
  const requestLocalVideo = () => {
    console.log('reqesting local video')
    var input = document.createElement('input')
    input.type = 'file'

    input.onchange = e => {
      const file = e.target.files[0]
      const url = URL.createObjectURL(file)
      console.log(url)
      if (typeof url !== 'string' || url.length === 0) return

      // if we have a src url we will update the project information and reset the React Player URL
      const updatedProject = { ...project, src: url }
      updateProject(updatedProject)
      setUrl(url)
    }

    input.click()
  }

  const handleDuration = data => {
    setDuration(data)
  }

  const value = {
    handleReady,
    url,
    playing,
    togglePlay,
    volume,
    setVolume,
    playbackRate,
    setPlaybackRate,
    duration,
    setDuration,
    handleDuration,
    changeVolume,
    handleProgress,
    progress,
    seekTo,
    playerRef,
    handlePlayerError,
    action,
    jumpForward,
    jumpBack,
  }

  return <videoContext.Provider value={value} {...props} />
}

export function useVideoContext() {
  return useContext(videoContext)
}
