new Vue({
    el: '#editor',
    data: {
        input: '# Hello World!'
    },
    filters: {
        marked: marked
    }
})