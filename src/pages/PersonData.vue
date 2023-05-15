<template>
  <div class="row py-5">
<!--    <div class="menu col mt-5">-->
<!--      <ul class="mt-5">-->
<!--        <li>Личная информация</li>-->
<!--        <li>Мои бронирования</li>-->
<!--      </ul>-->
<!--    </div>-->
    <div class="persondata container col">
      <div class="title text-center">
        <h3 class="">Личная информация</h3>
        <p>Сведения о вас и ваших контактных данных <br>
          Чтобы совершать бронирования, пожалуйста заполните все данные</p>
      </div>
        <div class="main-info card mt-5">
          <form action=""
                method="post"
                @submit.prevent="saveChange"
          >
            <h4>Основная информация</h4>
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


                <label for="post" :class="{ 'text-danger' : !person.post }">Должность:</label>
                <vue-select
                    id="post"
                    v-model="person.post"
                    :options="['Студент','Работник']"
                    placeholder="Выберите должность"
                    required
                    :class="{
                            'select-invalid is-invalid border-danger' : !person.post,
                            'select-valid is-valid border-success' : person.post
                          }"
                />
                <p v-if="!person.post" class="text-danger">{{ clientError.post }}</p>

            <div v-if="person.post=='Студент'">
              <label for="institute" :class="{ 'text-danger' : clientError.institute || !person.institute}">Институт:</label>
              <input
                  type="text"
                  id="institute"
                  class="form-control"
                  v-model="person.institute"
                  @input="validateInstitute"
                  required
                  :class="{
                          'is-invalid border-danger text-danger' : clientError.institute || !person.institute,
                          'is-valid border-success' : !clientError.institute && person.institute
                          }"
              />
              <p v-if="clientError.institute " class="text-danger">{{ clientError.institute }}</p>

              <label for="course" :class="{ 'text-danger' : !person.course}">Курс:</label>
              <vue-select
                  id="course"
                  v-model="person.course"
                  :options="[1,2,3,4,5]"
                  placeholder="Выберите Курс"
                  :class="{
                            'select-invalid is-invalid border-danger' : !person.course,
                            'select-valid is-valid border-success' :  person.course
                          }"
              />
              <p v-if="!person.course" class="text-danger">{{ clientError.course }}</p>

            </div>
            <div v-else-if="person.post=='Работник'" >
              <label for="structure" :class="{ 'text-danger' : clientError.structure || !person.structure}">Структура:</label>
              <input
                  type="text"
                  id="structure"
                  v-model="person.structure"
                  required
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
                    style="height: 50px"
                    type="submit"
            >
              Сохранить
            </button>
          </form>
        </div>
        <div class="contact-info card mt-5">
          <h4>Контактная информация</h4>
          <div style="display: flex" >
            <label class="fa fa-phone mx-2" :class="{ 'text-danger' : clientError.phoneNumber || !person.phoneNumber || !person.phoneNumber_confirmed}"></label>
            <label for="phone_number" :class="{ 'text-danger' : clientError.phoneNumber || !person.phoneNumber || !person.phoneNumber_confirmed}">Номер телефона:</label>
          </div>
          <div style="display: flex; ">
            <PhoneNumberInput
                v-model="person.phoneNumber"
                @input="validatePhoneNumber"
                :disabled="person.phoneNumber_confirmed"
                class="phone"
                :class="{ 'is-invalid border-danger text-danger' : clientError.phoneNumber || !person.phoneNumber || !person.phoneNumber_confirmed,
                                'is-valid border-success' : !clientError.phoneNumber && person.phoneNumber }"
            />
            <button class="btn btn-link"
                    v-if="!person.phoneNumber_confirmed"
                    @click="changePhoneNumber=true"
            >Подтвердить
            </button>
            <button class="btn btn-link"
                    v-else
                    @click="changePhoneNumber=true"
            ><i class="fa fa-edit">&nbsp;Изменить</i>
            </button>

          </div>
          <p v-if="!person.phoneNumber" class="text-danger">Данные обязательные для заполнения</p>
          <p v-if="!person.phoneNumber_confirmed && person.phoneNumber && !clientError.phoneNumber" class="text-danger">Номер телефона не подтвержден</p>

          <div style="display: flex" >
            <label class="fa fa-envelope mx-2" :class="{ 'text-danger' : clientError.email || !person.email }"></label>
            <label for="phone_number" :class="{ 'text-danger' : clientError.email || !person.email }">Почта:</label>
          </div>
          <div style="display: flex; ">
            <input type="text"
                   name="email"
                   id="email"
                   class="form-control"
                   :disabled="person.provider"
                   v-model="person.email"
                   :class="{ 'is-invalid border-danger text-danger' : clientError.email || !person.email ,
                             'is-valid border-success' : !clientError.email && person.email }"
            >
            <button v-if="!person.provider"
                    class="btn btn-link mx-2"
                    @click="changeEmail"
            >
              Сохранить
            </button>
          </div>
        </div>
    </div>
  </div>
  <change-phone-modal
      v-show="changePhoneNumber"
      @close="changePhoneNumber=false"
  />
</template>

<script>
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
import VueSelect from 'vue-select';
import PhoneNumberInput from "@/components/UI/PhoneNumberInput.vue";
import axios from "axios";
import ChangePhoneModal from "@/components/ChangePhoneModal.vue";
import validate from "@/validation";
export default {
  name: "PersonData",
  components: {ChangePhoneModal, VueSelect, PhoneNumberInput},
  data(){
    return {
      clientError: {
        lastName: null,
        firstName: null,
        middleName: null,
        phoneNumber: null,
        email: null,
        post: null,
        institute: null,
        course: null,
        structure:null
      },
      changePhoneNumber: false,
    }
  },
  methods: {
    ...mapMutations({
      setCustomer: 'setPerson',
      setPersonId: 'setPersonId',
      setPhoneNumber: 'setPhoneNumber'
    }),
    ...mapActions({
      deletePersonFromCookie: 'deletePersonFromCookie',
    }),
    ...mapGetters({
      getPerson: 'phoneNumber_confirmed'
    }),
    hasError() {
        for (const key in this.clientError) {
            if (this.clientError[key] !== null && this.clientError[key] !== undefined) {
                return true;
            }
        }
        return false;
    },
    ...validate,
    validateFirstName(){
        this.clientError.firstName = this.getNameError(this.person.firstName)
    },
    validateLastName(){
        this.clientError.lastName = this.getNameError(this.person.lastName)
    },
    validateMiddleName(){
        this.clientError.middleName = this.getNameError(this.person.middleName)
    },
    validatePhoneNumber() {
        this.clientError.phoneNumber = this.getPhoneError(this.person.phoneNumber)
    },
    validateInstitute(){
        this.clientError.institute = this.getInstituteError(this.person)
    },
    validateStructure(){
        this.clientError.structure = this.getStructureError(this.person)

    },
    validatePost(){
        this.clientError.post = this.getPostError(this.person.post)
    },
    validateCourse(){
        this.clientError.course = this.getCourseError(this.person)
    },
    validateAll(){
        this.validateFirstName();
        this.validateLastName();
        this.validateMiddleName();
        this.validatePhoneNumber();
        this.validateInstitute();
        this.validateStructure();
        this.validatePost();
        this.validateCourse();
    },
    saveChange(){
      this.validateAll();
      if (this.hasError()) {
        return;
      }
      axios.patch(`http://localhost:8080/person`,this.person,
          {
            headers: {
              'Authorization': 'Bearer ' + this.access_token
            }
          }
      )
          .then(()=>{
            alert("Данные сохранены")
          })
          .catch((error)=>{
            console.log(error)
          })
    },
  },
  watch: {

  },
  computed: {
    ...mapState({
      personId: state => state.person.personId,
      person: state => state.person.person,
      access_token: state => state.person.access_token,
    })
  },
  mounted() {

  },

}
</script>

<style scoped>
 .persondata {
   margin-top: 100px;
   min-height: 100vh;
   max-width: 800px;
 }
 .main-info{
   padding: 20px;
 }
 .contact-info{
   padding: 20px;
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
   font-size: 14px;
   color: #707079;
   display: block;
   margin-bottom: 5px;
   margin-top: 15px;
 }

 .phone {
 }
 .saveButton {
   width: 300px
 }
 .menu {
   max-width: 300px;
 }
 .menu li{
   color: #707079;
   text-decoration: none;
   padding: 14px;
   list-style: none;
   margin-top: 2px;
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