import { NextPage } from 'next'
import { BidModal } from '@reservoir0x/reservoir-kit-ui'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import ThemeSwitcher from 'components/ThemeSwitcher'
import { ComponentPropsWithoutRef, useState } from 'react'
import DeeplinkCheckbox from 'components/DeeplinkCheckbox'
import { useRouter } from 'next/router'

const DEFAULT_COLLECTION_ID =
  process.env.NEXT_PUBLIC_DEFAULT_COLLECTION_ID ||
  '0xe14fa5fba1b55946f2fa78ea3bd20b952fa5f34e'
const DEFAULT_TOKEN_ID = process.env.NEXT_PUBLIC_DEFAULT_TOKEN_ID || '39'
const NORMALIZE_ROYALTIES = process.env.NEXT_PUBLIC_NORMALIZE_ROYALTIES
  ? process.env.NEXT_PUBLIC_NORMALIZE_ROYALTIES === 'true'
  : false
const chainId: number = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 1)

let wrappedSymbol = 'WETH'
let wrappedContract = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'

switch (chainId) {
  case 1:
  case 5: {
    wrappedSymbol = 'WETH'
    wrappedContract = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'
    break
  }
  case 137: {
    wrappedSymbol = 'WMATIC'
    wrappedContract = '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'
    break
  }
}

const BidPage: NextPage = () => {
  const router = useRouter()
  const [collectionId, setCollectionId] = useState(DEFAULT_COLLECTION_ID)
  const [tokenId, setTokenId] = useState(DEFAULT_TOKEN_ID)
  const [attributeKey, setAttributeKey] = useState('')
  const [attributeValue, setAttributeValue] = useState('')
  const [currencies, setCurrencies] = useState<
    { contract: string; symbol: string; decimals?: number }[] | undefined
  >([
    {
      contract: wrappedContract,
      symbol: wrappedSymbol,
    },
    {
      contract: '0x2f3A40A3db8a7e3D09B0adfEfbCe4f6F81927557',
      symbol: 'USDC',
      decimals: 6,
    },
  ])
  const [attribute, setAttribute] =
    useState<ComponentPropsWithoutRef<typeof BidModal>['attribute']>(undefined)
  const deeplinkOpenState = useState(true)
  const hasDeeplink = router.query.deeplink !== undefined
  const [normalizeRoyalties, setNormalizeRoyalties] =
    useState(NORMALIZE_ROYALTIES)
  const [oracleEnabled, setOracleEnabled] = useState(false)

  const computeAttribute = () => {
    {
      if (attributeKey.length > 0 && attributeValue.length > 0) {
        setAttribute({
          key: attributeKey,
          value: attributeValue,
        })
      } else {
        setAttribute(undefined)
      }
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        height: 50,
        width: '100%',
        gap: 12,
        padding: 24,
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 150,
      }}
    >
      <ConnectButton />

      <div>
        <label>Collection Id: </label>
        <input
          type="text"
          value={collectionId}
          onChange={(e) => setCollectionId(e.target.value)}
        />
      </div>
      <div>
        <label>Token Id: </label>
        <input
          type="text"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
        />
      </div>
      <div>
        <label>Attribute Key: </label>
        <input
          type="text"
          value={attributeKey}
          onChange={(e) => setAttributeKey(e.target.value)}
          onBlur={computeAttribute}
        />
      </div>
      <div>
        <label>Attribute Value: </label>
        <input
          type="text"
          value={attributeValue}
          onChange={(e) => setAttributeValue(e.target.value)}
          onBlur={computeAttribute}
        />
      </div>
      <div>
        <label>Currencies: </label>
        <textarea
          onChange={() => {}}
          defaultValue={JSON.stringify(currencies)}
          onFocus={(e) => {
            e.target.value = JSON.stringify(currencies)
          }}
          onBlur={(e) => {
            if (e.target.value && e.target.value.length > 0) {
              try {
                setCurrencies(JSON.parse(e.target.value))
              } catch (e) {
                setCurrencies(undefined)
              }
            } else {
              setCurrencies(undefined)
            }
          }}
        />
      </div>
      <DeeplinkCheckbox />
      <div>
        <label>Normalize Royalties: </label>
        <input
          type="checkbox"
          checked={normalizeRoyalties}
          onChange={(e) => {
            setNormalizeRoyalties(e.target.checked)
          }}
        />
      </div>
      <div>
        <label>Oracle Enabled: </label>
        <input
          type="checkbox"
          checked={oracleEnabled}
          onChange={(e) => {
            setOracleEnabled(e.target.checked)
          }}
        />
      </div>

      <BidModal
        trigger={
          <button
            style={{
              marginTop: 50,
              padding: 24,
              background: 'blue',
              color: 'white',
              fontSize: 18,
              border: '1px solid #ffffff',
              borderRadius: 8,
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Place Bid
          </button>
        }
        collectionId={collectionId}
        tokenId={tokenId}
        currencies={currencies}
        attribute={attribute}
        normalizeRoyalties={normalizeRoyalties}
        oracleEnabled={oracleEnabled}
        openState={hasDeeplink ? deeplinkOpenState : undefined}
        onBidComplete={(data) => {
          console.log('Bid Complete', data)
        }}
        onBidError={(error, data) => {
          console.log('Bid Transaction Error', error, data)
        }}
        onClose={() => {
          console.log('BidModal Closed')
        }}
        onViewOffers={() => {
          console.log('On View offers clicked')
        }}
      />
      <ThemeSwitcher />
    </div>
  )
}

export default BidPage
