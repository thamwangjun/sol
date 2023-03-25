import clsx from 'clsx'
import {solNative} from 'lib/SolNative'
import {observer} from 'mobx-react-lite'
import React, {useEffect, useState} from 'react'
import {Linking, Text, TouchableOpacity, View} from 'react-native'
import {useStore} from 'store'
import {Widget} from 'stores/ui.store'
import {CalendarWidget} from 'widgets/calendar.widget'
import {ClipboardWidget} from 'widgets/clipboard.widget'
import {CreateItemWidget} from 'widgets/createItem.widget'
import {EmojisWidget} from 'widgets/emojis.widget'
import {GoogleMapWidget} from 'widgets/googleMap.widget'
import {OnboardingWidget} from 'widgets/onboarding.widget'
import {ScratchpadWidget} from 'widgets/scratchpad.widget'
import {SearchWidget} from 'widgets/search.widget'
import {SettingsWidget} from 'widgets/settings.widget'
import {TranslationWidget} from 'widgets/translation.widget'

export let RootContainer = observer(() => {
  let store = useStore()
  let widget = store.ui.focusedWidget
  let [minizedHeight, setMinizedHeight] = useState(0)

  useEffect(() => {
    return () => {
      store.ui.cleanUp()
    }
  }, [])

  useEffect(() => {
    if (!!store.ui.query) {
      solNative.setWindowHeight(500)
    } else {
      solNative.setWindowHeight(minizedHeight)
    }
  }, [store.ui.query, minizedHeight])

  if (widget === Widget.CLIPBOARD) {
    return <ClipboardWidget className="bg-white dark:bg-dark" />
  }

  // if (widget === Widget.GIFS) {
  //   return <GifsWidget className="bg-white dark:bg-dark" />
  // }

  if (widget === Widget.EMOJIS) {
    return <EmojisWidget className="bg-white dark:bg-dark" />
  }

  if (widget === Widget.SCRATCHPAD) {
    return <ScratchpadWidget className="bg-white dark:bg-dark" />
  }

  if (widget === Widget.GOOGLE_MAP) {
    return <GoogleMapWidget />
  }

  if (widget === Widget.CREATE_ITEM) {
    return <CreateItemWidget className="bg-white dark:bg-dark" />
  }

  if (widget === Widget.ONBOARDING) {
    return <OnboardingWidget className="bg-white dark:bg-dark" />
  }

  if (widget === Widget.TRANSLATION) {
    return <TranslationWidget className="bg-white dark:bg-dark" />
  }

  if (widget === Widget.SETTINGS) {
    return <SettingsWidget />
  }

  return (
    <View
      className={clsx('bg-white dark:bg-dark', {
        'h-[105]': !store.ui.query,
        'h-[500]': !!store.ui.query,
      })}
      onLayout={e => {
        setMinizedHeight(e.nativeEvent.layout.height)
      }}>
      <SearchWidget />

      {!store.ui.query && <CalendarWidget />}

      {!store.ui.isAccessibilityTrusted && (
        <>
          <View className="w-full border-lightBorder dark:border-darkBorder border-t" />
          <TouchableOpacity
            onPress={() => {
              solNative.requestAccessibilityAccess()
              solNative.hideWindow()
            }}>
            <Text className="text-xs px-3 py-2">
              Click to grant accessibility access
            </Text>
          </TouchableOpacity>
        </>
      )}
      {!store.ui.hasFullDiskAccess && (
        <>
          <View className="w-full border-lightBorder dark:border-darkBorder border-t" />
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(
                'x-apple.systempreferences:com.apple.preference.security?Privacy_AllFiles',
              )
              solNative.hideWindow()
            }}>
            <Text className="text-xs px-3 py-2">
              Click to grant full disk access{' '}
              <Text className="text-xs dark:text-neutral-500">
                (needed to read Safari bookmarks)
              </Text>
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  )
})
