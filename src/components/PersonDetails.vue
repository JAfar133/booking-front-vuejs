<template>
        <section
            class="modal-body"
            id="modalDescription"
        >
          <div class="checkout-section contact-data">
            <div class="title">
                <i class="fa fa-user-o" ></i>
                <div>Контакты</div>
            </div>
              <div v-if="isContactFill" class="form-section contact-form">
                  <h3>{{ formattedPhoneNumber }}</h3>
                  <div>{{ person.lastName }} {{ person.firstName }} {{ person.middleName }}</div>
                  <button @click="isContactFill=false" class="btn btn-link">Изменить</button>
              </div>
            <div v-else class="form-section contact-form">
                <div v-if="!isAuthorized">
                    <input type="button" class="btn btn-link" @click="showLoginForm" value="Войти"/>
                </div>
                <div class="form-input">
                  <label for="last_name" :class="{ 'text-danger' : clientError.lastName }">Фамилия <i class="text-danger">*</i></label>
                  <input type="text"
                         id="last_name"
                         v-model="person.lastName"
                         required
                         class="form-control"
                         @input="validateLastName"
                         :class="{
                       'is-invalid border-danger text-danger' : clientError.lastName ,
                      'is-valid border-success' : !clientError.lastName && person.lastName
                     }"
                  />
                  <span v-if="clientError.lastName" class="text-danger">{{ clientError.lastName }}</span>
                </div>
                <div class="form-input">
                  <label for="first_name" :class="{ 'text-danger' : clientError.firstName }">Имя <i class="text-danger">*</i></label>
                  <input type="text"
                         id="first_name"
                         v-model="person.firstName"
                         required
                         class="form-control"
                         @input="validateFirstName"
                         :class="{
                       'is-invalid border-danger text-danger' : clientError.firstName ,
                       'is-valid border-success' : !clientError.firstName && person.firstName
                     }"
                  />
                  <span v-if="clientError.firstName" class="text-danger">{{ clientError.firstName }}</span>
                </div>
                <div class="form-input">
                  <label for="middle_name" :class="{ 'text-danger' : clientError.middleName }">Отчество <i class="text-danger">*</i></label>
                  <input type="text"
                         id="middle_name"
                         v-model="person.middleName"
                         required
                         class="form-control "
                         @input="validateMiddleName"
                         :class="{
                       'is-invalid border-danger text-danger' : clientError.middleName ,
                       'is-valid border-success' : !clientError.middleName && person.middleName
                       }"
                  />
                  <span v-if="clientError.middleName" class="text-danger">{{ clientError.middleName }}</span>
                </div>
                <div class="form-input" :class="{ 'text-danger' : clientError.phoneNumber }">
                    <label for="phone_number" >
                        <i v-if="!person.phoneNumber_confirmed
                    && !clientError.phoneNumber
                    && person.phoneNumber"
                           class="fa fa-warning text-danger"
                           title="Номер телефона не подтвержден"></i>
                        Номер телефона <i class="text-danger">*</i>
                    </label>
                    <PhoneNumberInput
                            v-model="person.phoneNumber"
                            @input="validatePhoneNumber"
                            :disabled="person.phoneNumber_confirmed"
                            :class="{
                     'is-invalid border-danger text-danger' : clientError.phoneNumber ,
                    'is-valid border-success' : !clientError.phoneNumber && person.phoneNumber
                   }"
                    />
                    <span v-if="clientError.phoneNumber" class="text-danger">{{ clientError.phoneNumber }}</span>
                </div>
            </div>
          </div>
          <div class="checkout-section additional-data">
              <div class="title">
                  <i class="fa fa-id-card-o"></i>
                  <div>Дополнительная информация</div>
              </div>
              <div class="form-section additional-form">
                  <div class="form-input">
                      <label for="post" :class="{ 'text-danger' : clientError.post }">Должность <i class="text-danger">*</i></label>
                      <vue-select
                              id="post"
                              v-model="person.post"
                              :options="['Студент','Работник']"
                              placeholder="Выберите должность"
                              required
                              @change="validatePost"
                              :class="{
                                'select-invalid is-invalid border-danger' : clientError.post ,
                                'select-valid is-valid border-success' : !clientError.post && person.post
                              }"
                      />
                      <span v-if="clientError.post" class="text-danger">{{ clientError.post }}</span>
                  </div>
                  <div v-if="person.post=='Студент'">
                      <label for="institute" :class="{ 'text-danger' : clientError.institute || !person.institute}">Институт <i class="text-danger">*</i></label>
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
                      <p v-if="clientError.institute" class="text-danger">{{ clientError.institute }}</p>

                      <label for="course" :class="{ 'text-danger' : clientError.course || !person.course}">Курс <i class="text-danger">*</i></label>
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
                      <span v-if="clientError.course " class="text-danger">{{ clientError.course }}</span>
                  </div>
                  <div v-else-if="person.post=='Работник'" :class="{ 'text-danger' : clientError.structure || !person.structure}">
                      <label for="structure">Структура <i class="text-danger">*</i></label>
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
                      <span v-if="clientError.structure " class="text-danger">{{ clientError.structure }}</span>

                  </div>
                  <label for="comment">Комментарий:</label>
                  <textarea id="comment" v-model="booking.comment"/>
              </div>
          </div>



        </section>
</template>

<script>
import VueSelect from 'vue-select';
import {mapGetters, mapMutations, mapState} from "vuex";
import PhoneNumberInput from "@/components/UI/PhoneNumberInput.vue";
import validate from '@/validation'
export default {
  components: {
    PhoneNumberInput,
    VueSelect,
  },
  props: {
    bookingError: {
      type: String,
    },
  },
  data(){
    return {
      comment: null,
      clientError: {
          lastName: null,
          firstName: null,
          middleName: null,
          phoneNumber: null,
          post: null,
          institute: null,
          course: null,
          structure: null,
      },
      isContactFill: false
    }
  },
  name: "PersonDetailsModal",
  methods: {
    ...mapMutations({
      setCustomer: 'setPerson',
      setPersonId: 'setPersonId',
      setIsAuthorized: 'setIsAuthorized',
      setLoginFormShow: 'setLoginFormShow'
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
    showLoginForm(){
      this.setLoginFormShow(true)
      document.body.classList.add('modal-open');
    },
    personDetailsIsValid(){
      this.validateAll();
        console.log(this.hasError())
      return !this.hasError();

    },
    handleLoad(){
      if(this.person.lastName
          && this.person.firstName
          && this.person.middleName
          && this.person.phoneNumber){
          console.log(this.person)
          this.isContactFill = true;
      }
    }
  },
  computed: {
    ...mapState({
        personId: state => state.person.personId,
        person: state => state.person.person,
        isAuthorized: state => state.person.isAuthorized,
        loginFormShow: state => state.person.loginFormShow,
        booking: state => state.booking.booking
      }),
    ...mapGetters({
        getPhoneNumber: 'phoneNumber'
    }),
    formattedPhoneNumber() {
        // Извлекаем только цифры из номера телефона
        const phoneNumberDigits = this.person.phoneNumber.replace(/\D/g, '');

        // Форматирование номера телефона в соответствии с требуемым форматом
        const phoneNumberFormatted = `+${phoneNumberDigits.slice(0, 1)} (${phoneNumberDigits.slice(1, 4)}) ${phoneNumberDigits.slice(4, 7)}-${phoneNumberDigits.slice(7, 9)}-${phoneNumberDigits.slice(9)}`;

        return phoneNumberFormatted;
    },

  },
  mounted() {
    this.$nextTick(function(){
        this.handleLoad()
    })
  },
  watch: {
    'person.post': function (){
      this.validatePost()
    },
    'person.course': function (){
      this.validateCourse()
    },
  },
  created() {
      window.addEventListener('load', this.handleLoad);
  },
  unmounted() {
      window.removeEventListener('load', this.handleLoad);
  },
}
</script>

<style scoped>
  label {
    margin-top: 15px;
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
  textarea {
    width: 100%;
    height: 100px;
    border: 1px solid #ebebeb;
    border-radius: 2px;
    font-size: 16px;
    color: #19191a;
    font-weight: 500;
    padding-left: 20px;
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
  .checkout-section{
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-bottom: 40px;
  }
  .title {
      display: flex;
      justify-content: space-between;
      width: 100px;
      margin-bottom: 10px;
      margin-right: 15px;
      font-size: 20px;
  }
  .title i {
      margin-right: 16px;
      margin-top: 6px;
  }
  .form-section {
      background: #fff;
      padding: 25px;
      width:600px;
      position: relative;
  }
  .form-section button {
      position: absolute;
      right: 0;
      bottom: 7px;
  }
  @media only screen and (max-width: 991px) {
      .title {
          width: 100%;
          justify-content: start;
      }
  }

</style>