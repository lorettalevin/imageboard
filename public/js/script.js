//CLIENT SIDE... all logs showing up in browser console

Vue.component('modal-component', {
    template: "#modal-template",
    props: ['selectedImageID'],
    data: function() {
        return {
            id: '',
            image: '',
            username: '',
            title: '',
            description: '',
            comment: []
        };
    },
    methods: {
        postComment: function(e) {
            e.preventDefault();
            var that = this;
            axios.post("/comments", {
                comment: this.comment.comment,
                username: this.comment.username,
                id: this.selectedImageID
            }).then(function(results) {
                that.comment.unshift(results.data.results);
                that.comment.comment = '',
                that.comment.username = '',
                that.comment.selectedImageID = '';
            });
        },
        closeModal: function() {
            this.$emit("close");
        }
    },
    mounted: function() {
        var self = this; //when we go inside functions and use "this" it never works so we need to save it in a variable named "self"
        axios.get("/modal/" + this.selectedImageID).then(function(resp) {
            const {id, image, username, title, description} = resp.data.results[0];
            self.id = id;
            self.image = image;
            self.username = username;
            self.title = title;
            self.description = description;
            self.comment = resp.data.data;
        });
    }
});

new Vue({
    el: "#main", //where our app will load
    data: {
        images: [],
        formStuff: {
            username: '',
            description: '',
            title: '',
            file: void 0
        },
        selectedImageID: null
        // selectedImageID: location.hash.slice(1) || null
    },
    methods: {
        handleChange: function(e) {
            this.formStuff.file = e.target.files[0]; //same as var file = $('input[type="file"]').get(0).files[0];
            // console.log("handleChange ran", this) --> "this" gives you the whole instance
        },
        handleSubmit: function(e) {
            e.preventDefault();
            const formData = new FormData();
            formData.append('file', this.formStuff.file);
            formData.append('title', this.formStuff.title);
            formData.append('description', this.formStuff.description);
            formData.append('username', this.formStuff.username);
            axios.post('/upload', formData).then(results => {
                document.querySelector('input[type="file"]').value = '';
                this.formStuff.title = '';
                this.formStuff.description = '';
                this.formStuff.username = '';
                this.images.unshift(results.data.images);
                //res.json (server file) back the info about the new image... the image data will be in results.data.images (res.json adds everything to a property called data)... then you want to unshift(array method for adding to the beginning of array --> newer images should go at the top) the new image into this.images
            });
        },
        showImage: function(selectedImageID) {
            this.selectedImageID = selectedImageID;
        },
        modalShut: function() {
            this.selectedImageID = null;
        },
        morePics: function() {
            var these = this;
            let lastImageID = this.images[this.images.length - 1].id;
            axios.get("/scroll/" + lastImageID).then(function(results) {
                for (var item = 0; item < results.data.results.length; item++) {
                    these.images.push(results.data.results[item]);
                }
            });
        }
    },
    mounted: function() { //mounted = "life cycle methods"
        var app = this;
        // window.addEventListener('scroll', function() {
        //     document.body.scrollTop
        // });
        axios.get("/images").then(function(images) {
            //every axios request will have corresponding app request in the server
            app.images = images.data.images; // same as: this.images = results.data.images;
            //create a v-for, loop thru images & display (in HTML)
        });
    }
});
