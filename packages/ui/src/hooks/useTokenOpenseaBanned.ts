import { isOpenSeaBanned } from '@reservoir0x/reservoir-sdk'
import { useEffect, useState } from 'react'

export default function (
  contract?: string,
  tokenId?: number | string,
  chainId?: number
) {
  const [isBanned, setIsBanned] = useState<boolean>(false)

  useEffect(() => {
    if (contract && tokenId) {
      const token = `${contract}:${tokenId}`
      isOpenSeaBanned([token], chainId)
        .then((statuses) => {
          setIsBanned(statuses[token])
        })
        .catch((e) => {
          console.error(e)
          setIsBanned(false)
        })
    } else {
      setIsBanned(false)
    }
  }, [contract, tokenId])

  return isBanned
}
