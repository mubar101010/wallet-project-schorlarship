import React from 'react'
import { FormattedMessage } from 'react-intl'
import { prop } from 'ramda'
import styled from 'styled-components'

import { Banner, Text, TooltipHost, TooltipIcon } from 'blockchain-info-components'
import { media } from 'services/styles'

import {
  Addresses,
  DetailsColumn,
  DetailsRow,
  fromAccountFormatter,
  IconTx,
  Row,
  RowHeader,
  RowValue,
  StatusAndType,
  StyledCoinDisplay,
  StyledFiatDisplay,
  Timestamp,
  toAccountFormatter,
  TxRow,
  TxRowContainer
} from '../components'
import { Props } from '.'
import Confirmations from './Confirmations'
import Description from './Description'
import FiatAtTime from './FiatAtTime'
import Status from './Status'
import TransactionFee from './TransactionFee'

const BannerWrapper = styled.div`
  margin: 0 6px;
  &:not(:first-child) {
    margin-top: 4px;
  }
`
const AddressesColumn = styled.div`
  display: none;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  white-space: nowrap;
  width: 50%;
  ${media.atLeastTabletL`
    display: flex;
  `}
`
const AmountColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 20%;
  align-items: flex-end;
  ${media.mobile`
    min-width: 50%;
  `};
`
const IOAddressText = styled(Text)`
  display: flex;
  align-items: center;
`

const NonCustodialTx = ({
  blockHeight,
  coin,
  coinTicker,
  currency,
  handleEditDescription,
  handleRetrySendEth,
  handleToggle,
  isToggled,
  transaction
}: Props & ParentClassProps) => {
  const conf = blockHeight - Number(transaction.blockHeight) + 1
  const confirmations = conf > 0 && transaction.blockHeight ? conf : 0
  const { coinfig } = window.coins[coin]
  const { parentChain = coin } = coinfig.type
  const { minimumOnChainConfirmations = 3 } = window.coins[parentChain].coinfig.type
  const isConfirmed = confirmations >= minimumOnChainConfirmations

  return (
    <TxRowContainer className={isToggled ? 'active' : ''} data-e2e='transactionRow'>
      <TxRow onClick={() => handleToggle()}>
        <Row data-e2e='transactionDateColumn' width='30%'>
          <IconTx coin={coin} type={transaction.type} />
          <StatusAndType data-e2e='transactionListItemStatus'>
            <Status
              isRBF={'rbf' in transaction && transaction.rbf && !isConfirmed}
              type={transaction.type}
              coinTicker={coinTicker}
            />
            <Timestamp time={Number(transaction.time) * 1000} />
          </StatusAndType>
          {'rbf' in transaction && transaction.rbf && (
            <BannerWrapper>
              <Banner label='true' size='10px' type='informational'>
                <FormattedMessage id='components.txlistitem.rbf' defaultMessage='Replace-By-Fee' />
              </Banner>
            </BannerWrapper>
          )}
          <div>
            {'erc20' in transaction && transaction.erc20 && (
              <BannerWrapper>
                <Banner label='true' size='10px' type='informational'>
                  <FormattedMessage
                    id='components.txlistitem.erc20fee'
                    defaultMessage='ERC20 Fee'
                  />
                </Banner>
              </BannerWrapper>
            )}
            {'state' in transaction &&
              transaction.state === 'PENDING' &&
              transaction.type === 'sent' && (
                <TooltipHost id='transaction.pending.eth' data-place='right'>
                  <BannerWrapper
                    onClick={(e) => handleRetrySendEth(e, transaction.hash, transaction.erc20)}
                  >
                    <Banner label='true' size='11px'>
                      <FormattedMessage
                        id='components.txlistitem.retrytx'
                        defaultMessage='Resend Transaction'
                      />
                    </Banner>
                  </BannerWrapper>
                </TooltipHost>
              )}
          </div>
        </Row>
        <AddressesColumn data-e2e='transactionAddressesColumn'>
          <Addresses
            to={toAccountFormatter(transaction)}
            from={fromAccountFormatter(transaction)}
          />
        </AddressesColumn>
        <AmountColumn data-e2e='transactionAmountColumn'>
          <StyledCoinDisplay coin={coin}>{transaction.amount}</StyledCoinDisplay>
          <StyledFiatDisplay coin={coin} size='14px' weight={500} color='grey600'>
            {transaction.amount}
          </StyledFiatDisplay>
        </AmountColumn>
      </TxRow>
      {isToggled && (
        <DetailsRow data-e2e='expandedTransactionRow'>
          <DetailsColumn data-e2e='descriptionTransactionColumn'>
            {'rbf' in transaction && transaction.rbf && !isConfirmed && (
              <>
                <RowHeader>
                  <FormattedMessage id='components.txlistitem.info' defaultMessage='Info' />
                </RowHeader>
                <RowValue>
                  <div style={{ maxWidth: '240px' }}>
                    <FormattedMessage
                      id='components.txlistitem.info.rbf'
                      defaultMessage='RBF (Replace-By-Fee) transactions can be replaced or reversed by the sender until they are confirmed.'
                    />
                  </div>
                </RowValue>
              </>
            )}
            <RowHeader>
              <FormattedMessage
                id='components.txlistitem.description'
                defaultMessage='Description'
              />
            </RowHeader>
            {handleEditDescription && (
              <Description
                description={transaction.description}
                handleEditDescription={handleEditDescription}
              />
            )}
            {coin === 'BTC' && (
              <>
                <RowHeader>
                  <FormattedMessage
                    id='components.txlistitem.valueattime'
                    defaultMessage='Value When {type}'
                    values={{ type: transaction.type }}
                  />
                </RowHeader>
                <RowValue data-e2e='valueAtTimeOfTransaction'>
                  <FiatAtTime
                    amount={Number(transaction.amount)}
                    hash={transaction.hash}
                    time={Number(transaction.time)}
                    currency={currency}
                  />
                </RowValue>
              </>
            )}
            {'memo' in transaction && (
              <>
                <RowHeader>
                  <FormattedMessage id='components.txlistitem.memo' defaultMessage='Memo' />
                  &nbsp;
                  {transaction.memoType}
                </RowHeader>
                <RowValue size='14px' capitalize weight={400} data-e2e='xlmTransactionMemo'>
                  {transaction.memo}
                </RowValue>
              </>
            )}
          </DetailsColumn>
          {'inputs' in transaction && transaction.inputs && transaction.outputs && (
            <DetailsColumn data-e2e='sentFromTransactionColumn'>
              <RowHeader>
                <FormattedMessage id='components.txlistitem.sentfrom' defaultMessage='Sent From' />
              </RowHeader>
              {prop('inputs', transaction).map((input) => (
                <RowValue key={input.address} size='13px'>
                  {input.address}
                </RowValue>
              ))}
              <RowHeader>
                <FormattedMessage
                  id='components.txlistitem.receivedby'
                  defaultMessage='Received By'
                />
              </RowHeader>
              {prop('outputs', transaction).map((output) => (
                <IOAddressText key={output.address} size='14px' weight={400}>
                  <RowValue size='13px'>{output.address}</RowValue>
                  {output.change && (
                    <RowValue>
                      <TooltipHost id='txlist.change.tooltip'>
                        <TooltipIcon name='info' size='12px' />
                      </TooltipHost>
                    </RowValue>
                  )}
                </IOAddressText>
              ))}
            </DetailsColumn>
          )}
          <DetailsColumn data-e2e='statusTransactionColumn'>
            <RowHeader>
              <FormattedMessage id='components.txlistitem.status' defaultMessage='Status' />
            </RowHeader>
            <Confirmations
              coin={coin}
              hash={transaction.hash}
              confirmations={confirmations}
              isConfirmed={isConfirmed}
            />
            {transaction.type !== 'received' && 'fee' in transaction && (
              <TransactionFee coin={coin} feeR={transaction.fee} hash={transaction.hash} />
            )}
          </DetailsColumn>
        </DetailsRow>
      )}
    </TxRowContainer>
  )
}

type ParentClassProps = {
  handleEditDescription: (value: any) => void
  handleRetrySendEth: (e: any, txHash: string, isErc20: boolean) => void
  handleToggle: () => void
  isToggled: boolean
}

export default NonCustodialTx
