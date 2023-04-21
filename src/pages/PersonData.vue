<template>
  <MyHeader/>
  <div class="persondata container">
    <div class="row">
      <div class="col-lg-6 mb-5">
        <label class="fa fa-phone mx-2"></label>
        <label for="phone_number" :class="{ 'text-danger' : clientError.phoneNumber }">Номер телефона:</label>
        <button class="btn btn-link" @click="changePhoneNumber=true">Изменить</button>
        <PhoneNumberInput
            v-model="phoneNumber"
            @input="validatePhoneNumber"
            :disabled="!changePhoneNumber"
            class="phone"
            :class="{ 'is-invalid border-danger text-danger' : clientError.phoneNumber,
                      'is-valid border-success' : !clientError.phoneNumber && phoneNumber }"
        />
        <button class="btn btn-outline-primary mt-3 saveButton"
                v-if="changePhoneNumber"
                @click="updateNumber">
          Сохранить
        </button>

      </div>
      <div class="col-lg-6">
            <label for="last_name" :class="{ 'text-danger' : clientError.lastName || !person.lastName}">Фамилия:</label>
            <input type="text"
                   id="last_name"
                   v-model="person.lastName"
                   required
                   class="form-control"
                   @input="validateLastName"
                   :class="{ 'is-invalid border-danger text-danger' : clientError.lastName || !person.lastName,
                             'is-valid border-success' : !clientError.lastName && person.lastName }"
            />
            <p v-if="clientError.lastName" class="text-danger">{{ clientError.lastName }}</p>

            <label for="first_name" :class="{ 'text-danger' : clientError.firstName || !person.firstName}">Имя:</label>
            <input type="text"
                   id="first_name"
                   v-model="person.firstName"
                   required
                   class="form-control"
                   @input="validateFirstName"
                   :class="{
                         'is-invalid border-danger text-danger' : clientError.firstName || !person.firstName,
                         'is-valid border-success' : !clientError.firstName && person.firstName
                       }"
            />
            <p v-if="clientError.firstName" class="text-danger">{{ clientError.firstName }}</p>

            <label for="middle_name" :class="{ 'text-danger' : clientError.middleName || !person.middleName}">Отчество:</label>
            <input type="text"
                   id="middle_name"
                   v-model="person.middleName"
                   required
                   class="form-control "
                   @input="validateMiddleName"
                   :class="{
                         'is-invalid border-danger text-danger' : clientError.middleName || !person.middleName,
                         'is-valid border-success' : !clientError.middleName && person.middleName
                         }"
            />
            <p v-if="clientError.middleName" class="text-danger">{{ clientError.middleName }}</p>


            <label for="post" :class="{ 'text-danger' : clientError.post || !person.post }">Должность:</label>
            <vue-select
                id="post"
                v-model="person.post"
                :options="['Студент','Работник']"
                placeholder="Выберите должность"
                required
                @change="validatePost"
                :class="{
                        'select-invalid is-invalid border-danger' : clientError.post || !person.post,
                        'select-valid is-valid border-success' : !clientError.post && person.post
                      }"
            />
            <p v-if="clientError.post" class="text-danger">{{ clientError.post }}</p>

        <div v-if="person.post=='Студент'">
          <label for="institute" :class="{ 'text-danger' : clientError.institute || !person.institute}">Институт:</label>
          <input
              type="text"
              id="institute"
              class="form-control"
              v-model="person.institute"
              @input="validateInstitute"
              :class="{
                      'is-invalid border-danger text-danger' : clientError.institute || !person.institute,
                      'is-valid border-success' : !clientError.institute && person.institute
                      }"
          />
          <p v-if="clientError.institute " class="text-danger">{{ clientError.institute }}</p>

          <label for="course" :class="{ 'text-danger' : clientError.course || !person.course}">Курс:</label>
          <vue-select
              id="course"
              v-model="person.course"
              :options="[1,2,3,4,5]"
              placeholder="Выберите Курс"
              :class="{
                        'select-invalid is-invalid border-danger' : clientError.course || !person.course,
                        'select-valid is-valid border-success' : !clientError.course && person.course
                      }"
          />
          <p v-if="clientError.course " class="text-danger">{{ clientError.course }}</p>

        </div>
        <div v-else-if="person.post=='Работник'" :class="{ 'text-danger' : clientError.structure || !person.structure}">
          <label for="structure">Структура:</label>
          <input
              type="text"
              id="structure"
              v-model="person.structure"
              class="form-control"
              @input="validateStructure"
              :class="{
                      'is-invalid border-danger text-danger' : clientError.structure || !person.structure,
                      'is-valid border-success' : !clientError.structure && person.structure
                    }"
          />
          <p v-if="clientError.structure" class="text-danger">{{ clientError.structure }}</p>
        </div>
        <button class="btn btn-outline-primary float-end w-100 mt-5"
          @click="saveChange"
        >
          Сохранить
        </button>
      </div>
    </div>
  </div>
  <my-footer/>
</template>

<script>
import MyHeader from "@/components/MyHeader.vue";
import {mapActions, mapMutations, mapState} from "vuex";
import VueSelect from 'vue-select';
import PhoneNumberInput from "@/components/UI/PhoneNumberInput.vue";
import axios from "axios";
import MyFooter from "@/components/MyFooter.vue";
export default {
  name: "PersonData",
  components: {MyFooter, MyHeader, VueSelect, PhoneNumberInput},
  data(){
    return {
      clientError: {
        lastName: null,
        firstName: null,
        middleName: null,
        phoneNumber: null,
        post: null,
        institute: null,
        course: null,
        structure:null
      },
      phoneNumber: null,
      changePhoneNumber: false,
    }
  },
  methods: {
    ...mapMutations({
      setCustomer: 'setPerson',
      setPersonId: 'setPersonId',
      setPhoneNUmber: 'setPhoneNumber'
    }),
    ...mapActions({
      deletePersonFromCookie: 'deletePersonFromCookie',
    }),
    validateFirstName(){
      if (!this.person.firstName) {
        this.clientError.firstName = 'Имя обязательно для заполнения';
      } else if (this.person.firstName.length < 3) {
        this.clientError.firstName = 'Имя должно содержать не менее 2 символов';
      } else {
        this.clientError.firstName = null;
      }
    },
    validateLastName(){
      if (!this.person.lastName) {
        this.clientError.lastName = 'Фамилия обязательно для заполнения';
      } else if (this.person.lastName.length < 2) {
        this.clientError.lastName = 'Фамилия должно содержать не менее 1 символов';
      } else {
        this.clientError.lastName = null;
      }
    },
    validateMiddleName(){
      if (!this.person.middleName) {
        this.clientError.middleName = 'Отчество обязательно для заполнения';
      } else if (this.person.middleName.length < 3) {
        this.clientError.middleName = 'Отчество должно содержать не менее 2 символов';
      } else {
        this.clientError.middleName = null;
      }
    },
    validatePhoneNumber() {
      const regex = /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
      if (!regex.test(this.person.phoneNumber)) {
        this.clientError.phoneNumber = 'Номер телефона введен неправильно'
      } else {
        this.clientError.phoneNumber = null
      }
    },
    validateInstitute(){
      if (this.person.post==='Студент' && !this.person.institute) {
        this.clientError.institute = 'Поле обязательно для заполнения';
      } else {
        this.person.structure = null
        this.clientError.institute = null;
      }
    },
    validateStructure(){
      if (this.person.post==='Работник' && !this.person.structure) {
        this.clientError.structure = 'Поле обязательно для заполнения';
      } else {
        this.person.institute = null;
        this.person.course = null;
        this.clientError.structure = null;
      }
    },
    validatePost(){
      console.log("WTF?")
      if (!this.person.post) {
        this.clientError.post = 'Поле обязательно для заполнения';
      } else {
        this.clientError.post = null;
      }
    },
    saveChange(){
      axios.patch(`http://localhost:8080/person/${this.personId}`,this.person)
          .then(()=>{
            alert("Данные сохранены")
          })
          .catch((error)=>{
            console.log(error)
          })
    },
    updateNumber(){
      axios.patch(`http://localhost:8080/person/${this.personId}`, { phoneNumber: this.phoneNumber } )
          .then((response)=>{
            console.log(response.data)
            this.setPhoneNUmber(response.data.phoneNumber)
            this.changePhoneNumber = false
          })
          .catch((error)=> {
            console.log(error)
          })
    }
  },
  watch: {

  },
  computed: {
    ...mapState({
      personId: state => state.person.personId,
      person: state => state.person.person
    })
  },
  mounted() {
    setTimeout(()=>{
      this.phoneNumber = this.person.phoneNumber
    },100)
  },

}
</script>

<style scoped>
 .persondata {
   margin-top: 100px;
   min-height: 100vh;
 }
 >>> {
   --vs-controls-color: #ebebeb;
   --vs-border-color: #ebebeb;
   --vs-line-height: 33px;
   --vs-dropdown-option-padding: 12px;
   --vs-search-input-placeholder-color: #707079;
 }
 .select-invalid {
   --vs-border-color: red;
 }
 .select-valid {
   --vs-border-color: green;
 }
 input[type="text"] {
   position: relative;
   display: block;
   width:100%;
   height: 45px;
   border: 1px solid #ebebeb;
   border-radius: 2px;
   font-size: 16px;
   color: #19191a;
   font-weight: 500;
   padding-left: 20px;
 }
 label {
   margin-top: 15px;
 }
 .phone {
   max-width: 300px;
 }
 .saveButton {
   width: 300px
 }

 @media only screen and (max-width: 991px) {
   .phone {
     max-width: 100%;
   }
   .saveButton {
     width: 100%;
   }

 }
</style>