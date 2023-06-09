import { curry } from 'ramda'

import { utils } from '@core'
import { ADDRESS_TYPES } from '@core/redux/payment/btc/utils'
import { model, selectors } from 'data'

const isSubmitting = selectors.form.isSubmitting(model.components.sendXlm.FORM)

const xlmFromLabel = curry((payment, state) => {
  const { from } = payment
  switch (from.type) {
    case ADDRESS_TYPES.ACCOUNT:
      return selectors.core.kvStore.xlm.getAccountLabel(state, from.address).getOrElse(from.address)
    case ADDRESS_TYPES.CUSTODIAL:
      return from.address
    default:
      return from.address
  }
})

export const getData = (state) => {
  const paymentR = selectors.components.sendXlm.getPayment(state)

  const transform = (payment) => {
    const fromLabel = xlmFromLabel(payment, state)
    const toLabel = payment.to.label || payment.to.address

    return {
      amount: payment.amount,
      description: payment.description,
      fee: payment.fee,
      fromAddress: fromLabel,
      isCustodial: payment.from.type === ADDRESS_TYPES.CUSTODIAL,
      memo: payment.memo,
      memoType: payment.memoType,
      submitting: isSubmitting(state),
      toAddress: toLabel,
      total: utils.xlm.calculateTransactionAmount(payment.amount, payment.fee)
    }
  }

  return paymentR.map(transform)
}
