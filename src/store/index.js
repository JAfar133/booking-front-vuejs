import { createStore } from 'vuex'
import { personModule } from '@/store/personModule'
export default createStore({

    modules: {
        person: personModule
    }
})