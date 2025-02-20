<template>
    <div class="row design-block">
        <div class="col basis-40">
            <adress-list :data="data"></adress-list>
        </div>
        <div class="col">
            <map-item :points="data"></map-item>
        </div>
    </div>
</template>

<script>
import AdressList from "./AdressList.vue";
import MapItem from "./MapItem.vue";
import test from "../../api/test.json";
import markerIcon from "../../images/icons/marker.svg";

export default {
    name: "AdressWrapper",
    components: {
        AdressList,
        MapItem,
    },
    data() {
        return {
            data: test,
            markerIcon,
        };
    },
    methods: {
        baloonCorList() {
            this.cordList = this.data.map((item) => {
                return {
                    lat: Number(item.lat),
                    lng: Number(item.lng),
                };
            });

            this.$store.dispatch("setCoords", this.cordList);
        },
    },
    mounted() {
        this.baloonCorList();
    },
};
</script>
