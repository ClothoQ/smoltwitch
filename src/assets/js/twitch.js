const axios = require('axios');

const API = (request) => new Promise((res, rej) => axios({
    method:'GET',
    url:'https://api.twitch.tv/' + request,
    headers: {
       'Accept': 'application/vnd.twitchtv.v5+json',
       'Client-ID': 'lw2agrjofn4jpfjunxnv87p1v3fwcc'
    }
  }).then(response => res(response.data)).catch(error => rej(0))
)

export const getUserID = (username) => new Promise((res, rej) => {
  const tmpName = username.replace(/\s/g, '')
  if (!tmpName) rej(3)
  API('/helix/users?login=' + tmpName).then((data) => {
    if (data.data.length > 0) res(data)
    else rej(1)
  }).catch((err) => {
    rej(err)
  })
})

export const getFollowers = (id) => new Promise((res, rej) => {
  API('/kraken/users/' + id + '/follows/channels').then((data) => {
    if (!(data._total == 0)) res(data)
    else rej(2)
  }).catch((err) => {
    rej(err)
  })
})

export const streamerStatus = (id) => new Promise((res, rej) => {
  API('/kraken/streams/' + id).then((data) => {
    if (!(data._total == 0)) res(data)
    else rej(2)
  }).catch((err) => {
    rej(err)
  })
})

export const debug = (errID) => new Promise((res, rej) => {
  res({
    0: 'Check your net connection',
    1: 'User not found!',
    2: 'User does not follow anyone!',
    3: 'Empty field'
  }[errID] || '¯\_(ツ)_/¯')
  rej('¯\_(ツ)_/¯ x2')
})
