<template>
    <button
      :class="['nav-arrow', `nav-arrow-${direction}`]"
      :aria-label="direction === 'left' ? 'Previous books' : 'Next books'"
    >
      <svg
        :width="21"
        :height="41"
        viewBox="0 0 23 43"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          :d="direction === 'left' ? 'M22 1L1 21.5L22 42' : 'M1 1L22 21.5L1 42'"
          stroke="#4D2900"
        />
      </svg>
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
    },
  };
  </script>
  
  <style scoped>
  .nav-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }
  
  .nav-arrow-left {
    left: 0;
  }
  
  .nav-arrow-right {
    right: 0;
  }
  
  .nav-arrow svg {
    width: 21px;
    height: 41px;
    stroke: #4d2900;
  }
  </style>
  