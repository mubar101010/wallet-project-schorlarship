import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { CoinType, FiatType, ProcessedTxType } from '@core/types'
import { actions } from 'data'

import { getBlockHeight } from './selectors'
import NonCustodialTx from './template'

class NonCustodialTxListItem extends React.PureComponent<Props, { isToggled: boolean }> {
  constructor(props) {
    super(props)
    this.state = { isToggled: false }
  }

  handleToggle = () => {
    this.setState((prevState) => ({ isToggled: !prevState.isToggled }))
  }

  handleEditDescription = (value) => {
    const { coin, transaction } = this.props
    const { coinfig } = window.coins[coin]
    switch (true) {
      case coin === 'ETH': {
        this.props.ethActions.setTxNotesEth(transaction.hash, value)
        break
      }
      case coin === 'BTC': {
        this.props.walletActions.setTransactionNote(transaction.hash, value)
        break
      }
      case coin === 'BCH': {
        this.props.bchActions.setTxNotesBch(transaction.hash, value)
        break
      }
      case coin === 'XLM': {
        this.props.xlmActions.setTxNotesXlm(transaction.hash, value)
        break
      }
      case !!coinfig.type.erc20Address: {
        // TODO: erc20 phase 2, set tx notes?
        this.props.ethActions.setTxNotesErc20(coin, transaction.hash, value)
        break
      }
      default: {
        this.props.logActions.logErrorMessage(
          'components/NonCustodialTx',
          'handleEditDescription',
          'Unsupported Coin Code'
        )
      }
    }
  }

  handleRetrySendEth = (e, txHash, isErc20) => {
    e.stopPropagation()
    this.props.sendEthActions.retrySendEth(txHash, isErc20)
  }

  render() {
    return (
      <NonCustodialTx
        {...this.props}
        handleEditDescription={this.handleEditDescription}
        handleRetrySendEth={this.handleRetrySendEth}
        handleToggle={this.handleToggle}
        isToggled={this.state.isToggled}
      />
    )
  }
}

const mapStateToProps = (state, ownProps: OwnProps) => ({
  blockHeight: getBlockHeight(state, ownProps.coin)
})

const mapDispatchToProps = (dispatch) => ({
  bchActions: bindActionCreators(actions.core.kvStore.bch, dispatch),
  ethActions: bindActionCreators(actions.core.kvStore.eth, dispatch),
  ethTxActions: bindActionCreators(actions.core.data.eth, dispatch),
  logActions: bindActionCreators(actions.logs, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch),
  sendEthActions: bindActionCreators(actions.components.sendEth, dispatch),
  walletActions: bindActionCreators(actions.core.wallet, dispatch),
  xlmActions: bindActionCreators(actions.core.kvStore.xlm, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  coin: CoinType
  coinTicker: string
  currency: FiatType
  transaction: ProcessedTxType
}

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(NonCustodialTxListItem)
