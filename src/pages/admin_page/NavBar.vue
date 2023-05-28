<template>
  <v-system-bar>
    <v-spacer></v-spacer>

    <v-icon>mdi-square</v-icon>

    <v-icon>mdi-circle</v-icon>

    <v-icon @click="$router.push('/')">mdi-triangle</v-icon>
  </v-system-bar>

  <v-navigation-drawer v-model="drawer">
    <v-sheet
        color="grey-lighten-4"
        class="pa-4"
    >
      <v-avatar
          class="mb-4"
          color="grey-darken-1"
          size="64"
      ></v-avatar>

      <div>{{ person.email }}</div>
    </v-sheet>

    <v-list>
      <v-list-item
          v-for="[icon, text, link] in links"
          :key="icon"
          link
      >
        <template v-slot:prepend>
          <v-icon>{{ icon }}</v-icon>
        </template>

        <v-list-item-title @click="$router.push(link)">{{ text }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import {defineComponent} from 'vue'
import {mapState} from "vuex";

export default defineComponent({
  name: "NavBar",
  data(){
    return {
      drawer: null,
      links: [
        ['mdi-calendar-question', 'Бронирования', '/admin'],
        ['mdi-account-group', 'Пользователи', '/admin/users'],
        ['mdi-calendar-check', 'Подтвержденные', '/admin/confirmed'],
        ['mdi-delete', 'Отказы', '/admin/rejected'],
      ],
    }
  },
  computed:{
    ...mapState({
      person: state => state.person.person
    })
  }
})
</script>


<style scoped>

</style>