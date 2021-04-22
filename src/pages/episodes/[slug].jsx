import { useRouter } from 'next/router'
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import Image from 'next/image'
import Link from 'next/link'

import api from '../../services/api'
import { convertDurationToString } from '../../utils/convertDurationToString'
import styles from './episode.module.scss'

export default function Episode({ episode }) {

  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
        />
          <button type="button">
            <img src="/play.svg" alt="Tocar episodio" />
          </button>
      </div>

      <header>
        <h1>{episode.title} </h1>
        <span>{episode.members} </span>
        <span>{episode.publishedAt} </span>
        <span>{episode.durationAsString} </span>
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  )
}

export async function getStaticPaths() {
  return {
    paths: [
    ],
    fallback: 'blocking'
  }
}

export const getStaticProps = async (ctx) => {
  const { slug } = ctx.params
  const { data } = await api.get(`/episodes/${slug}`)

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMMM yy', { locale: ptBR }),
    duration: data.file.duration,
    durationAsString: convertDurationToString(data.file.duration),
    description: data.description,
    url: data.file.url,
  }

  return {
    props: {
      episode
    },
    revalidate: 60 * 60 * 24
  }
}