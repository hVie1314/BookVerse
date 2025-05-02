<template>
  <aside class="checkout-summary">
    <div class="summary-content">
      <div class="summary-details">
        <div class="summary-row">
          <div class="labels">
            <p class="summary-label">Tổng tiền hàng</p>
            <p class="summary-label">Phí vận chuyển</p>
          </div>
          <div class="values">
            <p class="summary-value">$1,362.00</p>
            <p class="summary-value">$0.00</p>
          </div>
        </div>
        <div class="summary-divider"></div>
        <div class="total-row">
          <h3 class="total-label">Tổng thanh toán</h3>
          <p class="total-value">$1,362.00</p>
        </div>
      </div>
      <button class="checkout-button">ĐẶT HÀNG</button>
    </div>
  </aside>
</template>

<script>
export default {
  name: "CheckoutSummary",
};
</script>

<style scoped>
.checkout-summary {
  width: 38%;
  align-self: flex-start;
}

.summary-content {
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  margin-top: 124px;
  width: 100%;
  padding: 32px 22px;
  color: rgba(0, 0, 0, 1);
}

.summary-details {
  margin: 0 9px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-weight: 500;
}

.labels {
  font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 16px;
}

.summary-label + .summary-label {
  margin-top: 25px;
}

.values {
  font-family: "Darker Grotesque", -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 20px;
  text-align: right;
}

.summary-value + .summary-value {
  margin-top: 24px;
}

.summary-divider {
  border-color: rgba(208, 207, 207, 1);
  border-style: solid;
  border-width: 2px;
  margin: 20px 0;
  width: 100%;
  height: 2px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  font-weight: 700;
  margin: 15px 0;
}

.total-label {
  font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
}

.total-value {
  font-family: "Darker Grotesque", -apple-system, Roboto, Helvetica, sans-serif;
}

.checkout-button {
  border-radius: 10px;
  margin-top: 30px;
  padding: 15px;
  font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 22px;
  color: rgba(255, 255, 255, 1);
  font-weight: 600;
  text-align: center;
  letter-spacing: 2px;
  background-color: #4d2900;
  border: none;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease;
}

.checkout-button:hover {
  background-color: #724e4e;
}

@media (max-width: 991px) {
  .checkout-summary {
    width: 100%;
  }

  .summary-content {
    margin-top: 20px;
    padding: 25px 20px;
  }
}
</style>