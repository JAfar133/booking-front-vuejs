<template>
  <transition name="modal">
      <div class="modal-backdrop alert alert-success">
        <div class="modal"
             role="dialog"
        >
          <header
              class="modal-header alert alert-success"
              id="modalTitle"
          >
            <h4>Успешно</h4>
            <button
                type="button"
                class="btn-close"
                @click="close"
            >
            </button>
          </header>
          <section
              class="modal-body"
              id="modalDescription"
          >
          <slot></slot>
          </section>
          <footer class="modal-footer">
            <button
                type="button"
                class="btn btn-success"
                @click="close"
            >
              ОК
            </button>
          </footer>
        </div>
      </div>
  </transition>
</template>

<script>
export default {
  name: "SuccessModal",
  methods: {
    close() {
      this.$emit('close');
    },
  }
}
</script>

<style scoped>
  .modal-backdrop {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    border-radius: 6px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    max-width: 500px;
    height: auto;
    z-index: 7;
    max-height: 80vh;
    left: 50%; /* Позиционируем левую границу на 50% от родителя */
    top:50%;
    transform: translate(-50%, -50%); /* Применяем сдвиг на -50% от размеров модального окна */
  }
  .modal-header,
  .modal-footer {
    padding: 15px;
    display: flex;
  }

  .modal-header {
    border-bottom: 1px solid #eeeeee;
    justify-content: space-between;
  }
  .modal-header h5 {
    margin-right: 15px;
  }

  .modal-footer {
    border-top: 1px solid #eeeeee;
    justify-content: flex-end;
  }

  .modal-body {
    position: relative;
    padding: 20px 20px 40px 20px;
  }
</style>