<template>
    <a
        href="#"
        :class="[
            'adress-item',
            {
                active: isActive,
                disabled:
                    $store.getters.getShowOnlyFastOrder && !item.fastOrder,
            },
        ]"
        @click="handleBalloon"
    >
        <div>
            <span> {{ item.address }} </span>
        </div>
        <div class="d-flex flex-jcsb">
            <div class="text-gray">
                <span> {{ item.schedule }} </span>
            </div>

            <div class="adress-item-images">
                <div>
                    <img src="../../images/icons/case.svg" alt="image" />
                </div>
                <div>
                    <img src="../../images/icons/batery.svg" alt="image" />
                </div>
                <div>
                    <img src="../../images/icons/rotate.svg" alt="image" />
                </div>
            </div>
        </div>
    </a>
</template>

<script>
export default {
    name: "AdressItem",
    props: {
        item: {
            id: Number,
            title: String,
            schedule: String,
            phone: String,
            email: String,
            address: String,
        },
        showOnlyFastOrder: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        handleBalloon() {
            this.$store.dispatch("setSelectedAddress", {
                lat: this.item.lat,
                lng: this.item.lng,
                title: this.item.title,
                schedule: this.item.schedule,
                phone: this.item.phone,
                address: this.item.address,
            });
        },
        handleClick(e) {
            if (this.showOnlyFastOrder && !this.item.fastOrder) {
                e.preventDefault();
                return;
            }
            this.handleBalloon();
        },
    },
    computed: {
        isActive() {
            return (
                this.$store.getters.getSelectedAddress?.address ===
                this.item.address
            );
        },
    },
};
</script>
