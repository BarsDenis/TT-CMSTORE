import { createStore } from "vuex";

const store = createStore({
    state() {
        return {
            selectedAddress: null,
            selectedCoords: null,
            showOnlyFastOrder: false,

        };
    },
    mutations: {
        setSelectedAddress(state, coords) {
            state.selectedAddress = coords;
        },
        setCoords(state, address) {
            state.selectedCoords = address;
        },
        setShowOnlyFastOrder(state, value) {
            state.showOnlyFastOrder = value;
            console.log(state.showOnlyFastOrder);
        }
    },
    getters: {
        getSelectedAddress: (state) => state.selectedAddress,
        getSelectedCoords: (state) => state.selectedCoords,
        getShowOnlyFastOrder: state => state.showOnlyFastOrder
    },
    actions: {
        setSelectedAddress({ commit }, coords) {
            commit('setSelectedAddress', coords);
        },
        setCoords({ commit }, address) {
            commit('setCoords', address);
        },
        setShowOnlyFastOrder({ commit }, value) {
            commit('setShowOnlyFastOrder', value);
        },
      

    },
});

export default store;
