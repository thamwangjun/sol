import clsx from 'clsx'
import React, {FC} from 'react'
import {Text, View, ViewStyle} from 'react-native'

interface IProps {
  title: string
  symbol?: string
  primary?: boolean
  style?: ViewStyle
  brRounded?: boolean
  className?: string
}

export const Key: FC<IProps> = ({title, primary = false, style, symbol}) => {
  return (
    <View
      className={clsx(`px-3 py-1 min-w-5 rounded items-center justify-center`, {
        'bg-keyBg dark:bg-proGray-900': !primary,
        'bg-accent': primary,
      })}
      style={style}>
      <Text
        className={clsx('text-xs text-center', {
          'text-neutral-600 dark:text-neutral-300': !primary,
          'text-white': primary,
        })}>
        {title.trim()}
        {!!symbol && (
          <Text
            className={clsx('text-xs text-center', {
              'text-neutral-600 dark:text-neutral-300': !primary,
              'text-neutral-200': primary,
            })}
            style={{
              color: primary ? '#FFFFFFAA' : undefined,
            }}>
            {' '}
            {symbol}
          </Text>
        )}
      </Text>
    </View>
  )
}
