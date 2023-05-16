export const getImage = (imageUrl) => {
  if (!imageUrl) return ''
  return imageUrl.startsWith('htt') ? imageUrl : 'http://localhost:4444/' + imageUrl
}
