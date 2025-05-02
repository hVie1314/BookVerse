<template>
    <div class="page-container">
      <Nav />
      <main class="shopping-cart">
        <div class="shopping-cart-container">
          <CartHeader />
          <section class="cart-content">
            <ProductList />
            <CheckoutSummary />
          </section>
        </div>
      </main>
      <footer-form />
    </div>
  </template>
    
  <script>
  import Nav from "../navbar/Nav.vue";
  import CartHeader from "./CartHeader.vue";
  import ProductList from "./ProductList.vue";
  import CheckoutSummary from "./CheckoutSummary.vue";
  import FooterForm from "../footer/footer.vue";
  
  export default {
    name: "ShoppingCart",
    components: {
      Nav,
      CartHeader,
      ProductList,
      CheckoutSummary,
      FooterForm
    },
  };
  </script>
    
  <style scoped>
  .page-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* min-height: 100vh; */
  }
  
  .shopping-cart {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 50px 0;
  }
  
  .shopping-cart-container {
    width: 82%;
  }
  
  .cart-content {
    display: flex;
    justify-content: flex-start;
    gap: 30px;
    margin-top: 20px;
    width: 100%;
  }
  
  @media (max-width: 991px) {
    .container {
      width: 95%;
    }
    
    .shopping-cart {
      padding: 30px 0;
    }
    
    .cart-content {
      flex-direction: column;
      gap: 20px;
    }
  }
  </style>