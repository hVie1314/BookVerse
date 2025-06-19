<template>
    <button
        v-if="shouldShow"
        :class="[
            'carousel-control-prev',
            { 'carousel-control-next': direction === 'right' }
        ]"
        @click="$emit('navigate')"
        type="button"
    >
        <span :class="[
            'carousel-control-prev-icon', 
            { 'carousel-control-next-icon': direction === 'right' }
        ]" aria-hidden="true"></span>
        <span class="visually-hidden">{{ direction === 'left' ? 'Previous' : 'Next' }}</span>
    </button>
</template>

<script>
export default {
    name: "NavigationArrow",
    props: {
        direction: {
            type: String,
            required: true,
            validator: (value) => ["left", "right"].includes(value),
        },
        isFirstPage: {
            type: Boolean,
            default: false
        },
        isLastPage: {
            type: Boolean,
            default: false
        },
        shouldShowArrows: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        shouldShow() {
            if (!this.shouldShowArrows) return false;
      
            if (this.direction === 'left') {
                return !this.isFirstPage;
            } else {
                return !this.isLastPage;
            }
        }
    },
    emits: ['navigate']
};
</script>

<style scoped>
.carousel-control-prev,
.carousel-control-next {
    width: 35px;
    height: 35px;
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 50%;
    top: 50%;
    opacity: 0.8;
    transition: all 0.3s ease;
    position: absolute;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
}

.carousel-control-prev {
    left: 0;
    transform: translateX(-50%) translateY(-50%);
}

.carousel-control-next {
    right: 0;
    transform: translateX(50%) translateY(-50%);
}

.carousel-control-prev:hover,
.carousel-control-next:hover {
    background-color: rgba(255, 255, 255, 0.95);
    opacity: 1;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}

.carousel-control-prev:hover {
    transform: translateX(-50%) translateY(-50%) scale(1.15);
}

.carousel-control-next:hover {
    transform: translateX(50%) translateY(-50%) scale(1.15);
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
    background-color: #000;
    width: 18px;
    height: 18px;
    filter: invert(1); /* Làm cho icon màu đen */
    opacity: 0.7;
}
</style>