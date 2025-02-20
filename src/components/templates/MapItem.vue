<template>
    <div class="map-container">
        <div v-if="isLoading" class="map-loading">Loading...</div>
        <div id="map" class="map-element"></div>
        <div class="fast-order">
            <p>Только при наличии</p>
            <input
                type="checkbox"
                @change="handleCheckboxChange"
                v-model="showOnlyFastOrder"
            />
        </div>
    </div>
</template>

<script>
import { getYMap } from "../../api/getYmap";
import { mapGetters } from "vuex";
import markerIcon from "../../images/icons/marker.svg";
import caseIcon from "../../images/icons/case.svg";
import bateryIcon from "../../images/icons/batery.svg";
import rotateIcon from "../../images/icons/rotate.svg";

export default {
    name: "MapItem",
    props: {
        points: {
            type: Array,
            default: () => ({}),
        },
    },

    data() {
        return {
            showOnlyFastOrder: false,
            isLoading: true,
            currentPlacemark: {},
            currentCoords: [],
            markerIcon,
            caseIcon,
            bateryIcon,
            rotateIcon,
            centerPos: [45.04028, 38.976623],
            ymaps: {},
            placemark: {},
            placemarkList: [],
            isOpen: false,
        };
    },

    computed: {
        ...mapGetters({
            getSelectedAddress: "getSelectedAddress",
            getSelectedCoords: "getSelectedCoords",
        }),
    },

    methods: {
        async initMap() {
            this.isLoading = true;
            try {
                this.ymaps = await getYMap();
                await new Promise((resolve) => this.ymaps.ready(resolve));

                window.myMap = new ymaps.Map("map", {
                    center: this.centerPos,
                    zoom: 12,
                });

                this.isLoading = false;
                this.makePlacemark();
            } catch (error) {
                console.error("Map initialization error:", error);
                this.isLoading = false;
            }
        },

        makePlacemark() {
            if (!this.points || !this.points.length) return;

            if (myMap) {
                myMap.geoObjects.removeAll();
            }

            const pointsToShow = this.showOnlyFastOrder
                ? this.points.filter((point) => point.fastOrder === true)
                : this.points;

            pointsToShow.forEach((point) => {
                const customBodyLayout = `<div class="baloon-schedule text-gray">${point.schedule}</div>
            <div class="adress-item-images mb-1">
               <div>
                <img src="${this.caseIcon}" alt="image" />
                </div>
                <div>
                    <img src="${this.bateryIcon}" alt="image" />
                </div>
                <div>
                    <img src="${this.rotateIcon}" alt="image" />
                </div>
             </div>
             <div>
                <a href="#" class="btn btn-black-dimm">
                    ПОДРОБНЕЕ
                </a>
             </div>
        `;

                const customHeaderLayout = `
            <div class="h4-style bold baloon-header">${point.title}</div>
        `;

                const MyBalloonContentLayoutClass =
                    ymaps.templateLayoutFactory.createClass(
                        `<div class="p-1 baloon">
                ${customHeaderLayout}
                ${customBodyLayout}
            </div>`
                    );

                const placemark = new this.ymaps.Placemark(
                    [point.lat, point.lng],
                    {
                        balloonContentBody: customBodyLayout,
                        balloonContentHeader: customHeaderLayout,
                    },
                    {
                        iconLayout: "default#image",
                        iconImageHref: this.markerIcon,
                        iconImageSize: [30, 40],
                        iconImageOffset: [-5, -60],
                        balloonPanelMaxMapArea: 0,
                        hideIconOnBalloonOpen: false,
                        balloonContentLayout: MyBalloonContentLayoutClass,
                    }
                );

                placemark.events.add("click", () => {
                    this.$store.dispatch("setSelectedAddress", point);
                    this.currentPlacemark = placemark;
                    const placemarkCoords = placemark.geometry.getCoordinates();

                    myMap.setCenter(placemarkCoords, 12, {
                        duration: 500,
                    });
                });

                myMap.geoObjects.add(placemark);
            });
        },
        centerAndOpenBalloon(newCoords) {
            if (!myMap || !newCoords) return;
            const coords = [newCoords.lat, newCoords.lng];

            myMap.setCenter(coords, 12, {
                flying: true,
                duration: 500,
            });
        },

        updateCurrentPlacemark(newCoords) {
            this.currentPlacemark = newCoords;
            console.log(this.currentPlacemark);
        },
        handleCheckboxChange(event) {
            this.$store.dispatch("setShowOnlyFastOrder", event.target.checked);
            this.makePlacemark();
        },
    },

    async mounted() {
        await this.initMap();
        setTimeout(() => {
            this.makePlacemark();
        }, 100);
    },

    beforeUnmount() {
        if (myMap) {
            try {
                myMap.destroy();
            } catch (error) {
                console.error("Error while destroying the map:", error);
            }
        }
    },

    watch: {
        showOnlyFastOrder() {
            this.makePlacemark();
        },
        getSelectedCoords: {
            handler() {
                this.currentCoords = this.getSelectedCoords;
            },
            deep: true,
        },
        getSelectedAddress: {
            handler(newCoords) {
                if (newCoords) {
                    this.centerAndOpenBalloon(newCoords);
                    this.updateCurrentPlacemark(newCoords);
                }
            },
            deep: true,
        },
    },
};
</script>

<style scoped>
.map-container {
    position: relative;
    width: 100%;
    height: 100%;
}
.map-element {
    width: 100%;
    height: 100%;
}
.map-loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
    z-index: 1;
}
</style>
