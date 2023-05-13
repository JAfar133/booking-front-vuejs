function checkAlphabetic(input) {
    const letters = /^[a-zA-Zа-яА-Я ]+(?:-[a-zA-Zа-яА-Я ]+)*$/;
    return letters.test(input)
}
function getNameError(value){
    let error = null
    if (!value) {
        error = 'обязательно для заполнения';
    } else if (value.length < 2) {
        error = 'недопустимая длина';
    } else if(!checkAlphabetic(value)){
        error = 'недопустимые символы';
    }
    return error
}
function getPhoneError(phone) {
    let error = null
    const regex = /^(\+7|7|8)?[\s-]?\(?[3489][0-9]{2}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/;
    if (!regex.test(phone)) {
        error = 'Номер телефона введен неправильно'
    }
    return error
}
function getInstituteError(person){
    let error = null
    if (person.post==='Студент' && !person.institute) {
        error = 'обязательно для заполнения';
    }
    return error
}
function getStructureError(person){
    let error = null
    if (person.post==='Работник' && !person.structure) {
        error = 'Поле обязательно для заполнения';
    }
    return error
}
function getPostError(post){
    let error = null
    if (!post) {
        error = 'Поле обязательно для заполнения';
    }
    return error
}
function getCourseError(course){
    let error = null
    if (!course) {
        error = 'Поле обязательно для заполнения';
    }
    return error
}
export default {
    getNameError,
    getCourseError,
    getPhoneError,
    getPostError,
    getStructureError,
    getInstituteError
}