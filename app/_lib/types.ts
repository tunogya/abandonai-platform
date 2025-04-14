export type Series = {
  id: string,
  owner: string,
  name: string,
  description?: string,
  image?: string,
  unit_amount: number,
  boxes: Box[],
  items: Item[],
  createdAt: string,
  updatedAt: string,
}

export type CreateSeriesForm = {
  owner: string,
  name: string,
  description?: string,
  image?: string,
  unit_amount: number,
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
  name: string,
  description?: string,
  image?: string,
  supply: number,
  available: number,
  createdAt: string,
  updatedAt: string,
}

export type Item = {
  id: string,
  name: string,
  description?: string,
  image?: string,
  shared: boolean,
  createdAt: string
}