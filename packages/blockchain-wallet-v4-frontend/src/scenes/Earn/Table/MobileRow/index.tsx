import React, { ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'

import { CoinType } from '@core/types'
import { Icon, Text, TooltipHost } from 'blockchain-info-components'
import { RoundedBadge } from 'components/Badge'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'

import { Props as ParentProps, SuccessStateType } from '..'
import { RewardsTextContainer, StakingTextContainer, Tag } from '../Table.model'
import { AmountContainer, CoinContainer, RightContainer, Row, Wrapper } from './MobileRow.model'

const MobileRow = ({
  coin,
  earnTab,
  handleClick,
  interestAccountBalance,
  interestEligible,
  interestRates,
  isGoldTier,
  product,
  searchValue,
  showAvailableAssets,
  stakingAccountBalance,
  stakingEligible,
  walletCurrency
}: Props): ReactElement | null => {
  switch (earnTab) {
    case 'All':
      break
    case 'Rewards':
      if (product !== earnTab) return null
      break
    case 'Staking':
      if (product !== earnTab) return null
      break

    default:
      break
  }

  const isStaking = product === 'Staking'
  const account = isStaking
    ? stakingAccountBalance && stakingAccountBalance[coin]
    : interestAccountBalance && interestAccountBalance[coin]
  const accountBalanceBase = account ? account.balance : 0
  const hasAccountBalance = accountBalanceBase > 0

  if (showAvailableAssets && !hasAccountBalance) return null

  const { coinfig } = window.coins[coin] || {}
  const { displaySymbol, name: displayName, symbol } = coinfig

  const containsSearchValue = [displaySymbol, displayName, symbol].some((value) =>
    value.toLowerCase().includes(searchValue.toLowerCase())
  )

  if (!containsSearchValue) return null

  const isInterestCoinEligible = interestEligible[coin] && interestEligible[coin]?.eligible
  const isStakingCoinEligible = stakingEligible[coin] && stakingEligible[coin]?.eligible
  const isCoinEligible = isStaking ? !isStakingCoinEligible : !isInterestCoinEligible
  return (
    <Wrapper
      onClick={() => handleClick(coin, isStaking)}
      disabled={!isGoldTier || (!hasAccountBalance && isCoinEligible)}
    >
      <Icon name={coin} color={coin} size='32px' />
      <RightContainer>
        <CoinContainer>
          <Row>
            <Text color='grey900' size='16px' weight={600}>
              {displayName}
            </Text>
            {isStaking && (
              <RoundedBadge>
                <FormattedMessage defaultMessage='New' id='copy.new' />
              </RoundedBadge>
            )}
          </Row>
          <Row>
            {hasAccountBalance ? (
              <Tag>
                <FormattedMessage
                  defaultMessage='Earning {earnRate}%'
                  id='scene.earn.earnrate'
                  values={{ earnRate: interestRates[coin] }}
                />
              </Tag>
            ) : (
              <Text color='grey700' size='14px' weight={500}>
                <FormattedMessage
                  defaultMessage='Earn {interestRate}%'
                  id='scenes.interest.Table.mobilerow.earn'
                  values={{
                    interestRate: interestRates[coin]
                  }}
                />
              </Text>
            )}
            {isStaking ? (
              <TooltipHost id='Table.staking.tooltip'>
                <StakingTextContainer>
                  <Text color='grey900' size='12px' weight={600}>
                    {product}
                  </Text>
                </StakingTextContainer>
              </TooltipHost>
            ) : (
              <TooltipHost id='Table.rewards.tooltip'>
                <RewardsTextContainer>
                  <Text color='grey600' size='12px' weight={600}>
                    {product}
                  </Text>
                </RewardsTextContainer>
              </TooltipHost>
            )}
          </Row>
        </CoinContainer>
        <AmountContainer>
          <FiatDisplay
            color='grey900'
            coin={coin}
            currency={walletCurrency}
            loadingHeight='24px'
            size='16px'
            style={{ lineHeight: '21px' }}
            weight={600}
          >
            {accountBalanceBase}
          </FiatDisplay>
          <CoinDisplay
            coin={coin}
            size='14px'
            color='grey700'
            cursor='inherit'
            weight={500}
            data-e2e={`${displaySymbol}Balance`}
          >
            {accountBalanceBase}
          </CoinDisplay>
        </AmountContainer>
      </RightContainer>
    </Wrapper>
  )
}

type OwnPropsType = {
  coin: CoinType
  handleClick: (coin: CoinType, isStaking: boolean) => void
  product: 'Staking' | 'Rewards'
}

type Props = ParentProps & SuccessStateType & OwnPropsType

export default MobileRow
