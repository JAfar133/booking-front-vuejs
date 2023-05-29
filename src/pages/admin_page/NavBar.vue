<template>
  <v-system-bar window>
    <v-spacer></v-spacer>
    <v-btn icon="mdi-close" variant="text" class="ms-2" @click="goHome"></v-btn>
  </v-system-bar>

  <v-navigation-drawer v-model="drawer">
    <v-sheet color="grey-lighten-4" class="pa-4">
      <v-avatar class="mb-4" color="grey-darken-1" size="64"></v-avatar>

      <div>{{ person.email }}</div>
    </v-sheet>

    <v-list>
      <v-list-item v-for="link in links" :key="link.icon" link :class="{
        'current_link_dark': isCurrentPage(link.link) && theme.global.name.value==='dark',
        'current_link_light': isCurrentPage(link.link) && theme.global.name.value==='light'
        }">
        <template v-slot:prepend>
          <v-icon>{{ link.icon }}</v-icon>
        </template>

        <v-list-item-title @click="goToLink(link.link)">
          {{ link.text }}
        </v-list-item-title>
      </v-list-item>
      <v-btn class="mt-5" @click="toggleTheme">Сменить тему</v-btn>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { defineComponent, computed, ref } from 'vue';
import { useStore } from 'vuex';
import router from "@/router/router";
import {useTheme} from "vuetify";
import {useRoute} from "vue-router";

export default defineComponent({
  name: 'NavBar',
  setup() {
    const store = useStore();
    const drawer = ref(null);
    const theme = useTheme();
    const route = useRoute();
    const links = [
      { icon: 'mdi-calendar-question', text: 'Все', link: '/admin' },
      { icon: 'mdi-calendar-check', text: 'Подтвержденные', link: '/admin/confirmed' },
      { icon: 'mdi-calendar-alert', text: 'Не подтвержденные', link: '/admin/unconfirmed' },
      { icon: 'mdi-delete', text: 'Отклоненные', link: '/admin/rejected' },
      { icon: 'mdi-account-group', text: 'Пользователи', link: '/admin/users' },
      { icon: 'mdi-logout-variant', text: 'Выйти из панели', link: '/' },
    ];

    const person = computed(() => store.state.person.person);

    const toggleTheme = () => theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
    const isCurrentPage = (link)=> {
      return route.path === link;
    }
    const goHome = () => {
      router.push('/');
    };

    const goToLink = (link) => {
      router.push(link);
    };

    return {
      drawer,
      links,
      person,
      toggleTheme,
      goHome,
      goToLink,
      isCurrentPage,
      theme
    };
  },
});
</script>

<style scoped>
.current_link_dark{
  background: #4d4d4d;
}
.current_link_light{
  background: #EDEDED;
}
</style>
