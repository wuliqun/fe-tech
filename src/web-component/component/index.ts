import { defineCustomElement } from "vue";
import myButton from "./my-button.ce.vue";

// Vue generates a new HTML element class from the component definition.
const MyButton = defineCustomElement(myButton);

customElements.define("my-button", MyButton);
