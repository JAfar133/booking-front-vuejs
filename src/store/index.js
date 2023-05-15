import { createStore } from 'vuex'
import { personModule } from '@/store/personModule'
import { bookingModule } from '@/store/bookingModule'
export default createStore({

    modules: {
        person: personModule,
        booking: bookingModule
    }
    
})