<template>

  <section class="rooms-section spad py-5">
  <!-- Rooms Section Begin -->
  <div class="container">
    <div class="row">
      <div class="col-lg-6 col-md-4">
        <div class="room-item">
          <img src="/img/room/room-1.jpg" alt="">
          <div class="ri-text">
            <h4>Помещение на курчатова</h4>
            <table>
              <tbody>
              <tr>
                <td class="r-o">Размер:</td>
                <td>30 м²</td>
              </tr>
              <tr>
                <td class="r-o">Вместимость:</td>
                <td>40 человек</td>
              </tr>
              <tr>
                <td class="r-o">Сервисы:</td>
                <td>Wifi, Экран, Тулает, ...</td>
              </tr>
              </tbody>
            </table>
            <a href="" class="primary-btn">Подробнее</a>
          </div>
        </div>
      </div>

      <div class="col-lg-6 col-md-4">
        <div class="room-item">
          <img src="/img/room/room-1.jpg" alt="">
          <div class="ri-text">
            <h4>Помещение на курчатова</h4>
            <table>
              <tbody>
              <tr>
                <td class="r-o">Размер:</td>
                <td>30 м²</td>
              </tr>
              <tr>
                <td class="r-o">Вместимость:</td>
                <td>40 человек</td>
              </tr>
              <tr>
                <td class="r-o">Сервисы:</td>
                <td>Wifi, Экран, Тулает, ...</td>
              </tr>
              </tbody>
            </table>
            <a href="" class="primary-btn">Подробнее</a>
          </div>
        </div>
      </div>

      <div class="col-lg-6 col-md-4">
        <div class="room-item">
          <img src="/img/room/room-1.jpg" alt="">
          <div class="ri-text">
            <h4>Помещение на курчатова</h4>
            <table>
              <tbody>
              <tr>
                <td class="r-o">Размер:</td>
                <td>30 м²</td>
              </tr>
              <tr>
                <td class="r-o">Вместимость:</td>
                <td>40 человек</td>
              </tr>
              <tr>
                <td class="r-o">Сервисы:</td>
                <td>Wifi, Экран, Тулает, ...</td>
              </tr>
              </tbody>
            </table>
            <a href="" class="primary-btn">Подробнее</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  </section>
  <!-- Rooms Section End -->
</template>

<script>
export default {
  name: "MyRooms"
}
</script>

<style scoped>
.rooms-section {
  padding-top: 100px;
  margin-top: 40px;
  padding-bottom: 80px;
}
.room-item {
  margin-bottom: 30px;
}
.room-item img {
  min-width: 100%;
}
.room-item .ri-text {
  border: 1px solid #ebebeb;
  border-top: none;
  padding: 24px 24px 30px 28px;
}
.room-item .ri-text h4 {
  color: #19191a;
  margin-bottom: 17px;
}
.room-item .ri-text h3 {
  color: #216DDF;
  font-weight: 700;
  margin-bottom: 14px;
}
.room-item .ri-text h3 span {
  font-family: "Cabin", sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #19191a;
}
.room-item .ri-text table {
  margin-bottom: 18px;
}
.room-item .ri-text table tbody tr td {
  font-size: 16px;
  color: #707079;
  line-height: 36px;
}
.room-item .ri-text table tbody tr td.r-o {
  width: 125px;
}
.room-item .ri-text .primary-btn {
  color: #19191a;
}
.room-pagination {
  text-align: center;
  padding-top: 20px;
}
.room-pagination a {
  font-size: 16px;
  color: #707079;
  border: 1px solid #EFD4B9;
  border-radius: 2px;
  padding: 7px 13px 5px;
  margin-right: 7px;
  display: inline-block;
  -webkit-transition: all 0.3s;
  -o-transition: all 0.3s;
  transition: all 0.3s;
}
.room-pagination a:last-child {
  margin-right: 0;
}
.room-pagination a:hover {
  background: #216DDF;
  color: #ffffff;
}
</style>