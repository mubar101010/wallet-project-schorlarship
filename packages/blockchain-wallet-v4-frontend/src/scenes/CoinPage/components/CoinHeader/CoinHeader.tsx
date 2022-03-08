import React from 'react'

import { Text } from 'blockchain-info-components'

import { Flex } from '../../../../components/Flex'
import { CoinIamge } from './styles'
import { CoinHeaderComponent } from './types'

export const CoinHeader: CoinHeaderComponent = ({ coinCode, coinDescription, coinName }) => {
  return (
    <Flex gap={16}>
      <CoinIamge name='btc' />

      <Flex flexDirection='column' gap={4} justifyContent='center'>
        <Flex gap={4}>
          <Text color='grey900' weight={600} size='20px'>
            {coinName}
          </Text>

          <Text color='grey600' weight={600} size='20px'>
            {coinCode}
          </Text>
        </Flex>

        <Text color='grey900' weight={500} size='16px'>
          {coinDescription}
        </Text>
      </Flex>
    </Flex>
  )
}