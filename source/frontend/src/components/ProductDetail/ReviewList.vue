<template>
    <section class="reviews-list">
      <ReviewItem
        v-for="(review, index) in reviews"
        :key="`review-${index}`"
        :review="review"
      />
    </section>
</template>
  
<script>
    import ReviewItem from './ReviewItem.vue';
    
    export default {
        name: 'ReviewList',
        components: {
        ReviewItem
        },
        data() {
        return {
            reviews: [
            {
                avatar: 'https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/9c21ecc8fd12f4309a9c06c3afa851e5571e1b4b?placeholderIfAbsent=true',
                name: 'Ann D.',
                date: '2 days ago',
                rating: 4,
                content: 'Tò mò đặt thử, đọc thử, phát hiện bản thân bị cuốn vào những câu chuyện ở trong sách khi nào không hay. Nội dung rất thú vị, tuy nhiên không phải câu chuyện nào cũng hiểu được, có lẽ do kiến thức bản thân không đủ, hoặc có lẽ chưa đủ sâu trong ý thức, suy nghĩ. Mọi người có thể tham khảo những bài review trên mạng để rõ hơn về nội dung sách. Màu giấy ngả ngà, đọc lâu không nhức mắt, chất lượng giấy cũng như mực in ổn áp. Tuy nhiên, mình có chút góp ý nho nhỏ về một số lỗi hình thức mình nhận thấy: thiếu chấm câu, thiếu dấu hay thiếu chữ cái. Hy vọng nhà xuất bản để ý ....',
                likes: 35,
                dislikes: 2
            },
            {
                avatar: 'https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/9c21ecc8fd12f4309a9c06c3afa851e5571e1b4b?placeholderIfAbsent=true',
                name: 'Ann D.',
                date: '2 days ago',
                rating: 4,
                content: 'Tò mò đặt thử, đọc thử, phát hiện bản thân bị cuốn vào những câu chuyện ở trong sách khi nào không hay. Nội dung rất thú vị, tuy nhiên không phải câu chuyện nào cũng hiểu được, có lẽ do kiến thức bản thân không đủ, hoặc có lẽ chưa đủ sâu trong ý thức, suy nghĩ. Mọi người có thể tham khảo những bài review trên mạng để rõ hơn về nội dung sách. Màu giấy ngả ngà, đọc lâu không nhức mắt, chất lượng giấy cũng như mực in ổn áp. Tuy nhiên, mình có chút góp ý nho nhỏ về một số lỗi hình thức mình nhận thấy: thiếu chấm câu, thiếu dấu hay thiếu chữ cái. Hy vọng nhà xuất bản để ý ....',
                likes: 35,
                dislikes: 2
            }
            ]
        };
        }
    };
</script>
  
<style scoped>
    .reviews-list {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
</style>