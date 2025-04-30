<template>
    <section class="overview" :space="220">
        <div class="overview-container">
            <div class="content-column">
                <TextContent />
            </div>
            <div class="image-column">
                <ImageSection />
            </div>
        </div>
    </section>
</template>
  
<script>
import TextContent from "./TextContent.vue";
import ImageSection from "./ImageSection.vue";

export default {
name: "Overview_form",
components: {
    TextContent,
    ImageSection,
},
};
</script>
  
<style scoped>
.overview {
    display: flex;
    width: 100%;
    justify-content: center;
}

.overview-container {
    width: 85%;
    gap: 20px;
    display: flex;
    justify-content: space-between;
}
  
@media (max-width: 991px) {
.overview-container {
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
}
}

.content-column {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    line-height: normal;
    width: 40%; /* Điều chỉnh từ 35% lên 40% */
    margin-left: 0;
}

@media (max-width: 991px) {
    .content-column {
        width: 100%;
    }
}

.image-column {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    line-height: normal;
    width: 60%;
    margin-left: 20px;
}

@media (max-width: 991px) {
    .image-column {
        width: 100%;
    }
}
</style>
  