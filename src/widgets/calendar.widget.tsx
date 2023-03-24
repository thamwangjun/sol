import {Key} from 'components/Key'
import {solNative} from 'lib/SolNative'
import {DateTime} from 'luxon'
import {observer} from 'mobx-react-lite'
import React, {FC, useEffect} from 'react'
import {Text, TouchableOpacity, View, ViewStyle} from 'react-native'
import {useStore} from 'store'
import {Widget} from 'stores/ui.store'

interface Props {
  style?: ViewStyle
}

export const CalendarWidget: FC<Props> = observer(() => {
  const store = useStore()
  const focused = store.ui.focusedWidget === Widget.CALENDAR

  useEffect(() => {
    if (focused) {
      solNative.turnOnHorizontalArrowsListeners()
    } else {
      solNative.turnOffHorizontalArrowsListeners()
    }
  }, [focused])

  if (store.ui.calendarAuthorizationStatus === 'notDetermined') {
    return (
      <TouchableOpacity
        onPress={() => {
          solNative.requestCalendarAccess().then(() => {
            store.ui.getCalendarAccess()
          })
        }}>
        <View className="py-2 px-3">
          <Text className="text-xs">Click to grant calendar access</Text>
        </View>
      </TouchableOpacity>
    )
  }

  if (!store.calendar.upcomingEvent) {
    return null
  }

  let lStart = DateTime.fromISO(store.calendar.upcomingEvent.date)
  let diff = Math.floor(lStart.diffNow().as('minutes'))

  return (
    <View className="px-4 py-2 flex-row items-center gap-1">
      <View
        className="h-1.5 w-1.5 rounded-full"
        style={{
          backgroundColor: store.calendar.upcomingEvent.color,
        }}
      />
      <Text className="text-sm dark:text-neutral-400">Event</Text>
      <Text className="font-semibold text-sm">
        {store.calendar.upcomingEvent.title?.trim()}
      </Text>
      {diff > 0 ? (
        <>
          <Text className="text-sm dark:text-neutral-400">in</Text>
          <Text className="text-sm font-semibold">{diff}</Text>
          <Text className="text-sm dark:text-neutral-400">minutes</Text>
        </>
      ) : (
        <Text className="text-sm dark:text-neutral-400">has started</Text>
      )}
      <View className="flex-1" />
      <Text className="text-sm font-semibold">Join</Text>
      <Key title="⏎" primary className="w-8" />
    </View>
  )
})
