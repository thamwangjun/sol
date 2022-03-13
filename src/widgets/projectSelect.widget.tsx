import {DateTime} from 'luxon'
import {observer} from 'mobx-react-lite'
import React, {FC} from 'react'
import {FlatList, StyleProp, Text, View, ViewStyle} from 'react-native'
import {useStore} from 'store'
import tw from 'tailwind'
import {useDeviceContext} from 'twrnc'

interface IProps {
  style?: StyleProp<ViewStyle>
}

export const ProjectSelectWidget: FC<IProps> = observer(({style}) => {
  useDeviceContext(tw)
  const store = useStore()

  const selectedIndex = store.ui.selectedIndex

  return (
    <View
      style={tw.style(
        `flex-1 p-6`,
        //@ts-ignore
        style,
      )}>
      <Text style={tw`font-medium text-gray-500`}>Track work time</Text>
      <FlatList
        style={tw`flex-1 w-full mt-4`}
        data={store.ui.projects.slice()}
        ListEmptyComponent={() => {
          return <Text style={tw`text-gray-500`}>No projects</Text>
        }}
        renderItem={({item, index}) => {
          const selected = index === selectedIndex

          let todayTime = 0
          let monthTime = 0
          const todayStart = DateTime.now().startOf('day').valueOf()
          const monthStart = DateTime.now().startOf('month').valueOf()
          item.periods.forEach(({start, end}) => {
            const lStart = DateTime.fromMillis(start)
            const lEnd = end ? DateTime.fromMillis(end) : null

            if (lStart.startOf('day').valueOf() === todayStart) {
              if (lEnd) {
                todayTime += lEnd.diff(lStart, 'minutes').minutes
              } else {
                todayTime += DateTime.now().diff(lStart, 'minutes').minutes
              }
            }

            if (lStart.startOf('month').valueOf() === monthStart) {
              if (lEnd) {
                monthTime += lEnd.diff(lStart, 'minutes').minutes
              } else {
                monthTime += DateTime.now().diff(lStart, 'minutes').minutes
              }
            }
          })

          const aggregation = item.periods.reduce((acc, p) => {
            const lDay = DateTime.fromMillis(p.start).startOf('day')
            const startDayMillis = lDay.toMillis()
            if (DateTime.now().diff(lDay, 'days').days > 10) {
              return acc
            }

            const lStart = DateTime.fromMillis(p.start)
            const lEnd = p.end ? DateTime.fromMillis(p.end) : DateTime.now()

            if (!acc[startDayMillis]) {
              acc[startDayMillis] = {
                date: lDay,
                time: 0,
              }
            }

            acc[startDayMillis].time += lEnd.diff(lStart, 'minutes').minutes
            return acc
          }, {} as Record<string, {date: DateTime; time: number}>)

          return (
            <View
              style={tw.style(
                `px-3 py-2 rounded w-full border border-transparent`,
                {
                  'bg-highlight bg-opacity-50 dark:bg-gray-500 dark:bg-opacity-20 border-buttonBorder dark:border-darkBorder':
                    selectedIndex === index,
                },
              )}>
              <View style={tw`flex-row items-center`}>
                <Text style={tw`flex-1`}>{item.name}</Text>
                <Text style={tw`font-medium text-sm w-20`}>
                  {Math.ceil(todayTime / 60)}h{' '}
                  <Text style={tw`font-normal text-sm text-gray-500`}>
                    today
                  </Text>
                </Text>

                <Text style={tw`font-medium text-sm pl-4 w-24`}>
                  {Math.ceil(monthTime / 60)}h{' '}
                  <Text style={tw`font-normal text-sm text-gray-500`}>
                    month
                  </Text>
                </Text>
              </View>
              {selected && (
                <View style={tw`h-32 flex-row mt-4`}>
                  <View
                    style={tw`pr-2 border-r dark:border-gray-600 border-gray-400 justify-between mt-4`}>
                    <Text style={tw`text-xs dark:text-gray-600 text-gray-500 `}>
                      10
                    </Text>
                    <Text style={tw`text-xs dark:text-gray-600 text-gray-500 `}>
                      8
                    </Text>
                    <Text style={tw`text-xs dark:text-gray-600 text-gray-500 `}>
                      6
                    </Text>
                    <Text style={tw`text-xs dark:text-gray-600 text-gray-500 `}>
                      4
                    </Text>
                    <Text style={tw`text-xs dark:text-gray-600 text-gray-500 `}>
                      2
                    </Text>
                    <Text style={tw`text-xs dark:text-gray-600 text-gray-500 `}>
                      0
                    </Text>
                  </View>
                  <View
                    style={tw`border-b border-gray-400 dark:border-gray-600 flex-1 flex-row px-3`}>
                    {Object.values(aggregation).map(
                      (entry: {date: DateTime; time: number}) => {
                        return (
                          <View style={tw`h-full`} key={entry.date.toISO()}>
                            <Text style={tw`text-xs dark:text-gray-400`}>
                              {entry.date.toFormat('LLL dd')}
                            </Text>
                            <View style={tw`flex-1`} />
                            <View
                              style={tw.style(
                                `w-10 border-gray-600 dark:bg-white bg-black bg-opacity-50`,
                                {
                                  height: Math.ceil(entry.time / 60) * 7,
                                },
                              )}
                            />
                          </View>
                        )
                      },
                    )}
                  </View>
                </View>
              )}
            </View>
          )
        }}
      />
    </View>
  )
})