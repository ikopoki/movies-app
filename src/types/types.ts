export type Items = {
    key: string
    label: string
    children: React.JSX.Element
}

export type MovieData = {
    id: string
    poster_path: string
    title: string
    overview: string
    release_date: string
    genre_ids: number[]
    vote_average: number
}

export type MovieDataList = {
    img: string
    title: string
    overview: string
    date: string
    genreId: number[]
    vote: number
    idForRate: string
    onRate: Function
}

export type Genre = {
    id: number
    name: string
}
