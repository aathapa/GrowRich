import React from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';

import Modal from 'react-native-modal'
import IonIcons from 'react-native-vector-icons/Ionicons'

import { Icons } from 'globalData'
import styles from './styles';

export function YearMonthModal({
  isVisible,
  onBackdropPress,
  onArrowBackPressed,
  onArrowForwardPressed,
  isMonthActive,
  currentYear,
  onMonthPressed,
  data
}) {
  return (
    <Modal
      isVisible={isVisible}
      style={{ justifyContent: 'flex-end', margin: 0 }}
      animationInTiming={50}
      onBackdropPress={onBackdropPress}
      backdropOpacity={0.8}
    >
      <View style={styles.modalMainView}>
        <View>
          <View>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => onArrowBackPressed('-')}>
                <IonIcons name={Icons.IonIcons.arrowBack} size={20} color="#fff" />
              </TouchableOpacity>
              <View style={{ flex: 3, alignItems: 'center' }}>
                <Text style={{ color: '#fff' }}>{currentYear}</Text>
              </View>
              <TouchableOpacity
                style={{ flex: 1, alignItems: 'flex-end' }}
                onPress={() => onArrowForwardPressed('+')}
              >
                <IonIcons name={Icons.IonIcons.arrowForward} size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            {data.map(({ fullMonth, abbr, num }, i) => {
              return (
                <TouchableOpacity
                  onPress={() => onMonthPressed(num, fullMonth)}
                  key={abbr}
                  style={styles.dateModalMonthview}
                >
                  <View style={[styles.dateModalView, isMonthActive(num) ? styles.selectedDateModalView : null]}>
                    <Text style={[{ fontSize: 17, color: '#fff' }, isMonthActive(num) ? styles.selectedDateModalViewText : null]}>{abbr}</Text>
                  </View>

                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      </View>

    </Modal>
  )
}