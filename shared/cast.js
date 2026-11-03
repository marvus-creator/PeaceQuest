export const CAST = {
  amani: { name: 'Amani', skin: '#8D5A3B', hair: 'short', hairColor: '#1E1A17', shirt: '#2F9C95' },
  keza: { name: 'Keza', skin: '#6B4229', hair: 'puffs', hairColor: '#1E1A17', shirt: '#F2836B' },
  leo: { name: 'Leo', skin: '#F1C7A3', hair: 'messy', hairColor: '#B5651D', shirt: '#7EC4E6' },
  zara: { name: 'Zara', skin: '#C68B59', hair: 'long', hairColor: '#2B1B12', shirt: '#9C8FD6' },
  kofi: { name: 'Kofi', skin: '#5C3A24', hair: 'buzz', hairColor: '#141010', shirt: '#F5C451' },
  mei: { name: 'Mei', skin: '#F3D2B3', hair: 'bob', hairColor: '#1A1A1A', shirt: '#6BAF6B' },
  tomas: { name: 'Tomás', skin: '#D9A577', hair: 'curly', hairColor: '#3B2414', shirt: '#E9A23B' },
  nia: { name: 'Nia', skin: '#7A4A2E', hair: 'braids', hairColor: '#1A120C', shirt: '#E57A9A' },
  sam: { name: 'Sam', skin: '#E8B98F', hair: 'short', hairColor: '#D9A441', shirt: '#5B8DEF' },
  ira: { name: 'Ira', skin: '#A86B45', hair: 'bun', hairColor: '#2A1A10', shirt: '#4FB0A5' },
  jabari: { name: 'Jabari', skin: '#4E3020', hair: 'buzz', hairColor: '#0F0B08', shirt: '#7C6A9E', tall: true },
  uwase: { name: 'Ms. Uwase', skin: '#7A4A2E', hair: 'bun', hairColor: '#1A120C', shirt: '#455A8A', glasses: true, adult: true },
  daniel: { name: 'Coach Daniel', skin: '#9A6440', hair: 'buzz', hairColor: '#1A120C', shirt: '#D9534F', adult: true, whistle: true },
}

export const AVATAR_OPTIONS = {
  skin: ['#F3D2B3', '#E8B98F', '#D9A577', '#C68B59', '#A86B45', '#8D5A3B', '#6B4229', '#4E3020'],
  hair: ['short', 'curly', 'puffs', 'long', 'braids', 'bob', 'bun', 'messy', 'buzz'],
  hairColor: ['#1A120C', '#3B2414', '#6B3E1F', '#B5651D', '#D9A441', '#8C8C8C', '#2E4A7A', '#A04A6C'],
  shirt: ['#2F9C95', '#F2836B', '#F5C451', '#9C8FD6', '#6BAF6B', '#7EC4E6', '#E57A9A', '#5B8DEF'],
  extra: ['none', 'glasses', 'cap', 'headband', 'freckles'],
}

export const DEFAULT_AVATAR = { skin: '#C68B59', hair: 'curly', hairColor: '#1A120C', shirt: '#2F9C95', extra: 'none' }

export function castMember(id, avatar) {
  if (id === 'you') return { name: 'You', ...(avatar || DEFAULT_AVATAR) }
  return CAST[id] || { name: id, ...DEFAULT_AVATAR }
}
