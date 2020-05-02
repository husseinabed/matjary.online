<template>
    <v-card >
        <v-card-title class="pa-0">
            <v-toolbar dense class="transparent" flat >
                <v-icon class="mx-2">mdi-comment-question-outline</v-icon>

                <v-toolbar-title>שלח בירור</v-toolbar-title>

                <v-spacer></v-spacer>
                <v-btn @click="close" icon>
                    <v-icon>
                        mdi-close
                    </v-icon>
                </v-btn>
                
            
            </v-toolbar>
        </v-card-title>
        <v-card-text class="pt-5 " @click="focus">
            <editor-content class="editor__content"  :editor="editor" />
        </v-card-text>
        <v-card-actions>
        <v-btn @click="editor.commands.bold" icon><v-icon>mdi-format-bold</v-icon></b></v-btn>
        <v-btn @click="editor.commands.italic" icon><v-icon>mdi-format-italic</v-icon></b></v-btn>
        <v-btn @click="editor.commands.underline" icon><v-icon>mdi-format-underline</v-icon></b></v-btn>
        <v-btn @click="editor.commands.strike" icon><v-icon>mdi-format-strikethrough</v-icon></b></v-btn>
        <v-btn @click="editor.commands.bullet_list" icon><v-icon>mdi-format-list-bulleted</v-icon></b></v-btn>
        <v-btn @click="editor.commands.ordered_list" icon><v-icon>mdi-format-list-numbered</v-icon></b></v-btn>
    

        <v-spacer />
        <v-btn class="success" @click="send">שלח</b></v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import { Editor, EditorContent, Doc } from 'tiptap'
import { 
    Placeholder,
    OrderedList,
    BulletList,
    ListItem,
    Bold,
    Italic,
    Strike,
    Underline,
 } from 'tiptap-extensions'
export default {
    name: 'inquery',
    components: {
        EditorContent
    },
    props:{
        vendor: Number
    },
    data() {
        const self = this
        return {
            message: '',
            editor: new Editor({
                autoFocus: true,
                onUpdate (state) {
                    self.message = state.getHTML()
                },
                extensions: [
                new Placeholder({
                    emptyEditorClass: 'is-editor-empty',
                    emptyNodeClass: 'is-empty',
                    emptyNodeText: 'כתוב שאלה או בירור…',
                    showOnlyWhenEditable: true,
                    showOnlyCurrent: true,
                }),
                new OrderedList(),
                new BulletList(),
                new ListItem(),
                new Bold(),
                new Italic(),
                new Strike(),
                new Underline()
                ],
            }),
        }
    },
    methods: {
        ...mapActions({
            sendEnquery: 'io/api/sendEnquery',
            followVendor: 'io/api/followVendor',
            getUser: 'io/auth/currentUser',
            close: 'dialog/close',

        }),
        ...mapMutations({
            error: 'io/error'
        }),
        focus () {
            this.editor.focus()
            console.log(this.editor)
            this.error('hello')
        },
        async send () {
            const { vendor, message } = this
          
            if (message.length < 1) {
                this.error('please enter your question')
                this.editor.focus()
                return 
            }
            const res = await this.sendEnquery({ vendor, message, product: 0 })
            console.log(res)
        }
    },
    beforeDestroy() {
        this.editor.destroy()
    }
}
</script>

<style>
[contenteditable="true"]:focus {
    outline: none;
}
.v-application [contenteditable="true"] p{
    margin-bottom: 0;
}
.editor__content p.is-editor-empty:first-child::before {
  content: attr(data-empty-text);
  color: #aaa;
  pointer-events: none;
  height: 0;
  font-style: italic;
}
</style>
