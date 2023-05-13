<template>
  <!-- About Us Section Begin -->
  <section class="aboutus-section spad">
    <div class="container">
      <div class="row">
        <div class="col-lg-6">
          <div class="about-text">
            <div class="section-title">
              <span>О нас</span>
              <h2>Цирковые волки</h2>
            </div>
            <p class="f-para">Команда даунов.</p>
            <p class="s-para">Мы реально все дебилы полные.</p>
            <a href="#" class="primary-btn about-btn">Подробнее</a>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="about-pic">
            <div class="row">
              <div class="col-sm-6">
                <img src="img/about/about-1.jpg" alt="">
              </div>
              <div class="col-sm-6">
                <img src="img/about/about-2.jpg" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- About Us Section End -->
</template>

<script>
export default {
  name: "AboutUsSection"
}
</script>

<style scoped>
/*---------------------
  About US
-----------------------*/

.about-text {
  text-align: center;
  padding: 0 35px;
}
.about-text p {
  color: #595960;
  font-weight: 500;
}
.about-text p.f-para {
  margin-bottom: 10px;
}
.about-text p.s-para {
  margin-bottom: 35px;
}
.about-text .about-btn {
  color: #19191a;
}
.about-pic img {
  min-width: 100%;
}
/*---------------------
  Service Section
-----------------------*/
/*---------------------
  Helper CSS
-----------------------*/
.free-date-helper {
  width: 200px;
}
.section-title {
  text-align: center;
  margin-bottom: 22px;
}
.section-title span {
  font-size: 14px;
  color: #216DDF;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
}
.section-title h2 {
  font-size: 44px;
  color: #19191a;
  line-height: 58px;
  margin-top: 10px;
}
.set-bg {
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top center;
}
.spad {
  padding-top: 100px;
  padding-bottom: 100px;
}
.spad-2 {
  padding-top: 50px;
  padding-bottom: 70px;
}
.text-white h1, .text-white h2, .text-white h3, .text-white h4, .text-white h5, .text-white h6, .text-white p, .text-white span, .text-white li, .text-white a {
  color: #fff;
}
/* buttons */

.primary-btn {
  display: inline-block;
  font-size: 13px;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
  position: relative;
}
.primary-btn:after {
  position: absolute;
  left: 0;
  bottom: -5px;
  width: 100%;
  height: 2px;
  background: #216DDF;
  content: "";
}
</style>