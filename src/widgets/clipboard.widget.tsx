import clsx from 'clsx'
import {Key} from 'components/Key'
import {LoadingBar} from 'components/LoadingBar'
import {StyledFlatList} from 'components/StyledFlatList'
import {useFullSize} from 'hooks/useFullSize'
import {solNative} from 'lib/SolNative'
import {observer} from 'mobx-react-lite'
import React, {FC, useEffect, useRef} from 'react'
import {FlatList, Text, TextInput, View, ViewStyle} from 'react-native'
import {useStore} from 'store'
import tw from 'tailwind'
import {useDeviceContext} from 'twrnc'

interface Props {
  style?: ViewStyle
  className?: string
}

export const ClipboardWidget: FC<Props> = observer(({style}) => {
  useDeviceContext(tw)
  useFullSize()

  const store = useStore()
  const data = store.clipboard.clipboardItems
  const selectedIndex = store.ui.selectedIndex
  const listRef = useRef<FlatList | null>(null)

  useEffect(() => {
    if (data.length > 0) {
      listRef.current?.scrollToIndex({
        index: store.ui.selectedIndex,
        viewOffset: 80,
      })
    }
  }, [selectedIndex])

  return (
    <View className="flex-1 bg-light dark:bg-dark" style={style}>
      <TextInput
        autoFocus
        // @ts-expect-error
        enableFocusRing={false}
        value={store.ui.query}
        onChangeText={store.ui.setQuery}
        selectionColor={solNative.accentColor}
        placeholderTextColor={tw.color(
          'dark:text-neutral-400 text-neutral-500',
        )}
        className="text-xl my-5 px-4"
        placeholder="Search clipboard history..."
      />
      <LoadingBar />
      <StyledFlatList
        data={data}
        className="flex-1"
        contentContainerStyle="flex-grow"
        ref={listRef}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center">
            <Text className="dark:text-neutral-700 text-sm text-neutral-500">
              No items
            </Text>
          </View>
        }
        renderItem={({item, index}: any) => {
          const isSelected = index === selectedIndex
          return (
            <View
              className="flex-row items-center"
              style={{
                backgroundColor: isSelected
                  ? `${solNative.accentColor}22`
                  : undefined,
              }}>
              <View
                className={clsx('w-[2px] bg-transparent h-full', {
                  'bg-accent': isSelected,
                })}
              />

              <Text
                className={clsx(
                  'text-sm flex-1 text-neutral-500 dark:text-neutral-400 p-4',
                  {
                    'text-black dark:text-white': isSelected,
                  },
                )}>
                {item.substring(0, 256)}
              </Text>
            </View>
          )
        }}
      />
    </View>
  )
})
