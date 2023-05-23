<template>
  <footer class="footer-section">
    <div class="container">
      <div class="footer-text">
        <div class="row">
          <div class="col-lg-4">
            <div class="ft-about">
              <div class="logo">
                <a href="#">
                  <img src="/img/logo-sevgu-footer.svg" alt="">
                </a>
              </div>
              <p>Предоставляем лучшую систему бронирования помещений в севастополе</p>
              <div class="fa-social">
                <a href="#"><i class="fa fa-calendar"></i></a>
                <a href="#"><i class="fa fa-youtube-play"></i></a>
              </div>
            </div>
          </div>
          <div class="col-lg-3 offset-lg-1">
            <div class="ft-contact">
              <h6>Наши контакты</h6>
              <ul>
                <li>+7 (978) 130 0282</li>
                <li>info.wolve@gmail.com</li>
                <li>Россия, Севастополь, Университетская улица, 33</li>
              </ul>
            </div>
          </div>
          <div class="col-lg-3 offset-lg-1">
            <div class="ft-newslatter">
              <h6>Новое</h6>
              <p>Получайте последние обновления и предложения.</p>
              <form action="#" class="fn-form">
                <input type="text" placeholder="Email">
                <button type="submit"><i class="fa fa-send"></i></button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "MyFooter"
}
</script>

<style scoped>
/*---------------------
  Footer Section
-----------------------*/

.footer-section {
  background: #222736;
}
.footer-section .footer-text {
  padding: 80px 0 30px;
}
.footer-section .footer-text .ft-about {
  margin-bottom: 30px;
}
.footer-section .footer-text .ft-about .logo {
  margin-bottom: 20px;
}
.footer-section .footer-text .ft-about .logo a {
  display: inline-block;
}
.footer-section .footer-text .ft-about p {
  color: #aaaab3;
  margin-bottom: 20px;
}
.footer-section .footer-text .ft-about .fa-social a {
  display: inline-block;
  height: 40px;
  width: 40px;
  font-size: 16px;
  line-height: 40px;
  text-align: center;
  color: #ffffff;
  border: 1px solid #5A4D48;
  border-radius: 50%;
  -webkit-transition: all 0.3s;
  -o-transition: all 0.3s;
  transition: all 0.3s;
  margin-right: 7px;
}
.footer-section .footer-text .ft-about .fa-social a:hover {
  background: #216DDF;
  border-color: #216DDF;
}
.footer-section .footer-text .ft-contact {
  margin-bottom: 30px;
}
.footer-section .footer-text .ft-contact h6 {
  font-size: 14px;
  color: #216DDF;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 3px;
  font-family: "Cabin", sans-serif;
  margin-bottom: 20px;
}
.footer-section .footer-text .ft-contact ul li {
  font-size: 16px;
  color: #aaaab3;
  line-height: 32px;
  list-style: none;
}
.footer-section .footer-text .ft-newslatter h6 {
  font-size: 14px;
  color: #216DDF;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 3px;
  font-family: "Cabin", sans-serif;
  margin-bottom: 20px;
}
.footer-section .footer-text .ft-newslatter p {
  color: #aaaab3;
  margin-bottom: 20px;
}
.footer-section .footer-text .ft-newslatter .fn-form {
  position: relative;
}
.footer-section .footer-text .ft-newslatter .fn-form input {
  width: 100%;
  height: 50px;
  border-radius: 2px;
  background: #393D4A;
  border: none;
  padding-left: 20px;
  font-size: 16px;
  color: #707079;
}
.footer-section .footer-text .ft-newslatter .fn-form button {
  position: absolute;
  right: 0;
  top: 0;
  font-size: 16px;
  background: #216DDF;
  color: #ffffff;
  padding: 0 16px;
  height: 50px;
  border: none;
  border-radius: 0 2px 2px 0;
}

.footer-section .copyright-option ul li {
  list-style: none;
  display: inline-block;
  margin-right: 34px;
}
.footer-section .copyright-option ul li:last-child {
  margin-right: 0;
}
.footer-section .copyright-option ul li a {
  font-size: 16px;
  color: #aaaab3;
}

</style>