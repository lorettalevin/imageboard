//CLIENT SIDE... all logs showing up in browser console

new Vue({
    el: "#main", //where our app will load
    data: {
        images: [],
        formStuff: {
            username: '',
            description: '',
            title: '',
            file: void 0
        }
    },
    methods: {
        handleChange: function(e) {
            this.formStuff.file = e.target.files[0]; //same as var file = $('input[type="file"]').get(0).files[0];
            // console.log("handleChange ran", this); //"this" gives you the whole instance
        },
        handleSubmit: function(e) {
            e.preventDefault();
            const formData = new FormData();
            formData.append('file', this.formStuff.file);
            formData.append('title', this.formStuff.title);
            formData.append('description', this.formStuff.description);
            formData.append('username', this.formStuff.username);
            axios.post('/upload', formData).then(results => {
                // console.log("RESULTS AGAIN!", results);
                document.querySelector('input[type="file"]').value = '';
                this.formStuff.title = '';
                this.formStuff.description = '';
                this.formStuff.username = '';
                this.images.unshift(results.data.images);
                //res.json (server file) back the info about the new image... the image data will be in results.data.images (res.json adds everything to a property called data)... then you want to unshift(array method for adding to the beginning of array --> newer images should go at the top) the new image into this.images
            });
        }
    },
    mounted: function() { //mounted = "life cycle methods"
        var app = this;
        axios.get("/images").then(images => { //every axios request will have corresponding app request in the server
            app.images = images.data.images; // same as: this.images = results.data.images;
            //create a v-for, loop thru images & display (in HTML)
        });
    }
});
