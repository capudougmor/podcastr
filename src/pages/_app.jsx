import { useState } from 'react'

import '../styles/global.scss'
import styles from '../styles/app.module.scss'

import {PlayerContext} from '../contexts/PlayerContext'
import { Header } from '../component/Header/Index'
import { Player } from '../component/Player/Index'

function MyApp({ Component, pageProps }) {
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setcurrentEpisodeIndex] = useState()

  function play(episode) {
    setEpisodeList([episode])
    setcurrentEpisodeIndex(0)
  }

  return (
    <PlayerContext.Provider value={{ episodeList, currentEpisodeIndex, play }}>
      <div className={styles.wrapper} >
        <main>
          <Header />
          <Component {...pageProps} /> 
        </main>

        <Player />
      </div>
    </PlayerContext.Provider>
  )
}

export default MyApp
