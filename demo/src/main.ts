import { createApp } from 'vue'
import TextEditor from "./editors/TextEditor.vue";
import CodeEditor from "./editors/CodeEditor.vue";
import App from './App.vue'
import 'bulma/css/bulma.min.css';

const app = createApp(App)

app.component('TextEditor', TextEditor);
app.component('CodeEditor', CodeEditor);

app.mount('#app')