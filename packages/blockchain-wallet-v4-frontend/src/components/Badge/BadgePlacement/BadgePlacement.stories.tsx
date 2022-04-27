import React, { FC } from 'react'
import { Icon } from '@blockchain-com/constellation'
import { IconActivity } from '@blockchain-com/icons'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { IconBadge } from '../IconBadge'
import { BadgePlacement, BadgePlacementComponent } from '.'

export default {
  argTypes: {
    placement: {
      defaultValue: 'end'
    },
    shape: {
      defaultValue: 'square'
    }
  },
  component: BadgePlacement,
  title: 'Components/Badge/BadgePlacement'
} as ComponentMeta<BadgePlacementComponent>

const BoxContent: FC = () => (
  <div style={{ background: 'grey', display: 'inline-block', height: 64, width: 64 }} />
)
const CircleContent: FC = () => (
  <div
    style={{ background: 'grey', borderRadius: 32, display: 'inline-block', height: 64, width: 64 }}
  />
)

const Template: ComponentStory<BadgePlacementComponent> = (args) => <BadgePlacement {...args} />

export const Squared = Template.bind({})
Squared.args = {
  badge: (
    <IconBadge backgroundColor='orange'>
      <Icon label='' size='sm' color='orange600'>
        <IconActivity />
      </Icon>
    </IconBadge>
  ),
  children: <BoxContent />
}

export const Circle = Template.bind({})
Circle.args = {
  badge: (
    <IconBadge backgroundColor='orange'>
      <Icon label='' size='sm' color='orange600'>
        <IconActivity />
      </Icon>
    </IconBadge>
  ),
  children: <CircleContent />,
  shape: 'circle'
}
