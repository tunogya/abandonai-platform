export type SeriesInputForm = {
  id: string,
  name: string,
  owner: string,
  price: number,
  createdAt: string,
  updatedAt: string,
}

export type Series = {
  id: string,
  owner: string,
  name: string,
  description?: string,
  image?: string,
  unit_amount: number,
  boxes: [],
  items: [],
  createdAt: string,
  updatedAt: string,
}

export type SeriesPublic = {
  id: string,
  owner: string,
  name: string,
  description?: string,
  image?: string,
  unit_amount: number,
  totalAvailable: number,
  totalSupply: number,
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