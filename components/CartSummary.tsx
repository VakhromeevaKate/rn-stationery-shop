import { StyleSheet, Text, View } from 'react-native';

import { selectCartCount, useCartStore } from '../stores/cartStore';



export default function CartSummary() {

  const count = useCartStore(selectCartCount);



  return (

    <View style={styles.wrap}>

      <View style={styles.row}>

        <Text style={styles.label}>Препаратов в заказе</Text>

        <Text style={styles.value}>{count} шт.</Text>

      </View>



      <View style={styles.noteBox}>

        <Text style={styles.note}>

          Цены не указаны в базе данных. Итоговая стоимость не рассчитывается.

        </Text>

      </View>

    </View>

  );

}



const styles = StyleSheet.create({

  wrap: {

    padding: 16,

    backgroundColor: '#fff',

    borderTopLeftRadius: 16,

    borderTopRightRadius: 16,

  },

  row: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginBottom: 12,

  },

  label: {

    fontSize: 14,

    color: '#53665b',

  },

  value: {

    fontSize: 16,

    fontWeight: '700',

    color: '#193b2c',

  },

  noteBox: {

    backgroundColor: '#f0f7f2',

    padding: 12,

    borderRadius: 10,

  },

  note: {

    fontSize: 12,

    lineHeight: 18,

    color: '#617468',

  },

});