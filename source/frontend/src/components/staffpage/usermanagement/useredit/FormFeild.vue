<template>
  <div class="form-field">
    <label class="field-label">{{ label }}</label>
    <div class="field-input-container">
      <input
        :type="type"
        :value="value"
        @input="updateValue($event.target.value)"
        class="field-input"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormField',
  props: {
    label: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'text'
    },
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    updateValue(value) {
      this.$emit('update:value', value);
    }
  }
};
</script>

<style scoped>
.form-field {
  display: flex;
  align-items: center;
  padding: 20px 42px;
  gap: 20px;
}

.field-label {
  color: #4d2900;
  font-family: Montserrat, sans-serif;
  font-size: 18px;
  font-weight: 900;
  min-width: 127px;
}

.field-input-container {
  flex: 1;
}

.field-input {
  width: 100%;
  height: 48px;
  border: 1px solid #ccc9c9;
  padding: 13px 21px;
  font-family: Montserrat, sans-serif;
  font-size: 18px;
}

@media (max-width: 640px) {
  .form-field {
    flex-direction: column;
    align-items: flex-start;
  }

  .field-input-container {
    width: 100%;
  }
}
</style>
