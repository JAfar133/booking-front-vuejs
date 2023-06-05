<template>
  <v-app id="inspire">
    <NavBar></NavBar>
    <v-main>
      <v-container
          class="py-8 px-6"
          fluid
      >
        <v-table>
          <thead>
            <tr>
              <th v-for="(th,idx) in thead" :key="idx">
                {{ th }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(person, idx) in persons" :key="person.id">
              <td> {{ person.role }}</td>
              <td>{{ person.lastName?person.lastName:'' }} {{ person.firstName? person.firstName[0]+'.': '' }}{{ person.middleName? person.middleName[0]+'.': '' }}</td>
              <td>{{ person.phoneNumber }}</td>
              <td>{{ person.email }}</td>
              <td>{{ person.post }}</td>
              <td>{{ person.structure }}</td>
              <td>{{ person.institute }}</td>
              <td>{{ person.course!==0?person.course:'' }}</td>
              <td>
                <v-btn variant="outlined" color="danger" style="margin-right: 10px" @click="deletePerson(person, idx)">Удалить</v-btn>
                <v-btn variant="outlined" color="warning" @click="makeAdmin(person, idx)">Сделать админом</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>

      </v-container>
    </v-main>
  </v-app>
</template>
<script>
import {defineComponent} from 'vue'
import {deletePerson, getPersons, makeAdmin} from "@/api/adminApi";
import NavBar from "@/pages/admin_page/NavBar.vue";

export default defineComponent({
  name: "PersonTablePage",
  components: {NavBar},
  data(){
    return {
      persons: [],
      thead: ['Роль','ФИО','Телефон','Почта','Должность','Структура','Институт','Курс','Действие']
    }
  },
  methods: {
    getPersons(){
      getPersons()
          .then(persons=>{
            this.persons = persons
          })
          .catch(error=>{
            console.log(error)
          })
    },
    deletePerson(person,idx){
      deletePerson(person)
          .then(response=>{
            console.log(response)
            this.persons.splice(idx,1)
          })
          .catch(error=>{
            console.log(error)
          })
    },
    makeAdmin(person, idx){
      makeAdmin(person)
          .catch(responsePerson=>{
            this.persons[idx] = responsePerson
          })
          .catch(error=>
              console.log(error)
          )
    }
  },
  created() {
    this.getPersons()
  }
})
</script>


<style scoped>

</style>