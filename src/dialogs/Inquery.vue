<template>
    <v-card>
        <v-toolbar dense flat>
            <v-icon class="mx-2">mdi-comment-question-outline</v-icon>

            <v-toolbar-title>שלח שאלה או בירור</v-toolbar-title>

            <v-spacer></v-spacer>

        
        </v-toolbar>
        <v-card-text>
          <v-textarea placeholder="כתוב שאלה או בירור" auto-grow auto-focus outlined/>
        </v-card-text>
        <v-card-actions>
        <v-btn class="success" > שלח ל- <b>{{ vendor }}</b></v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>

export default {
    name: 'inquery',
    props:{
        vendor: String
    } 
}
</script>

<style>

</style>
