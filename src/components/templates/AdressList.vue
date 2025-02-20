<template>
    <div class="adress-list">
        <adress-item v-for="item in data" :key="item.id" :item="item">
        </adress-item>
    </div>
</template>
<script>
import AdressItem from "./AdressItem.vue";
export default {
    name: "AdressList",
    components: {
        AdressItem,
    },
    props: {
        data: {
            type: Array,
            default: () => [],
        },
    },
};
</script>
