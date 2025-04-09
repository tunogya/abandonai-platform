export type Series = {
  id: string,
  name: string,
  owner: string,
  price: number,
  createdAt: string,
  updatedAt: string,
}

export type Box = {
  id: string,
  seriesId: string,
  name: string,
  description: string,
  image: string,
  owner: string,
  price: number,
  externalLink: string,
  createdAt: string,
  updatedAt: string,
}