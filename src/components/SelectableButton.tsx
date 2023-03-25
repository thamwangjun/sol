import clsx from 'clsx'
import {useBoolean} from 'hooks'
import React, {FC} from 'react'
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native'
import colors from '../colors'

interface SelectableButtonProps extends TouchableOpacityProps {
  selected: boolean
  title: string
  style?: ViewStyle
  className?: string
}

export const SelectableButton: FC<SelectableButtonProps> = ({
  selected,
  title,
  style,
  ...props
}) => {
  const [hovered, hoverOn, hoverOff] = useBoolean()
  return (
    <TouchableOpacity
      onMouseEnter={hoverOn}
      onMouseLeave={hoverOff}
      {...props}
      // @ts-ignore
      enableFocusRing={false}
      className="px-2 py-3 w-full border-l-2"
      style={[
        {
          borderLeftColor: selected ? colors.accent : 'transparent',
          backgroundColor: selected
            ? colors.accentBg
            : hovered
            ? colors.accentBg
            : undefined,
        },
        style,
      ]}>
      <Text
        className={clsx(`pl-4 text-sm text-neutral-600 dark:text-white`, {
          'text-black dark:text-white': selected || hovered,
        })}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}
