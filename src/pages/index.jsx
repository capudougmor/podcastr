import { useEffect } from "react"
import Image from 'next/image'
import api from '../services/api'
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { convertDurationToString } from "../utils/convertDurationToString"

import styles from './home.module.scss'

// SPA
// export default function Home() {

//   useEffect(() => {
//     fetch('http://localhost:3333/episodes')
//       .then(response => response.json())
//       .then(data => console.log(data))
//   }, [])
//   return (
//     <>
//       <h1>index</h1>
//     </>
//   )
// }

//SSR
// export default function Home(props) {

//   return (
//     <>
//       <h1>index</h1>
//       <p>{JSON.stringify(props.episodes) }</p>
//     </>
//   )
// }

// export async function getServerSideProps() {
//   const response = await fetch('http://localhost:3333/episodes')
//   const data = await response.json()

//   return {
//     props: {
//       episodes: data,
//     }
//   }
// }

//SSG
export default function Home({ latestEpisodes, allEpisodes }) {

  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Ultimos lançamentos</h2>

        <ul>
          {latestEpisodes.map(episode => {
            return (
              <li key={episode.id}>
                <Image
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"
                />

                <div className={styles.episodeDetails}>
                  <a href="">{episode.title} </a>
                  <p>{episode.members} </p>
                  <span>{episode.publishedAt} </span>
                  <span>{episode.durationAsString} </span>
                </div>

                <button type="button">
                  <img src="/play-green.svg" alt="Tocar episódio" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <th></th>
            <th>Podcast</th>
            <th>Integrantes</th>
            <th>Data</th>
            <th>Dutação</th>
            <th></th>
          </thead>

          <tbody>
            {allEpisodes.map(episode => {
              return (
                <tr hey={episode.id}>
                  <td>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectfit="cover"
                    />
                  </td>
                  <td>
                    <a href="">{episode.title} </a>
                  </td>
                  <td>{episode.members} </td>
                  <td>{episode.publishedAt} </td>
                  <td>{episode.durationAsString} </td>
                  <td>
                    <button>
                      <img src="/play-green.svg" alt="Tocar episódio"/>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export async function getStaticProps() {
  const { data } = await api.get('/episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })
  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMMM yy', { locale: ptBR }),
      duration: episode.file.duration,
      durationAsString: convertDurationToString(episode.file.duration),
      description: episode.description,
      url: episode.file.url,

    }
  })

  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8,
  }
}
