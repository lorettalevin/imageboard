//CLIENT SIDE... all logs showing up in browser console

new Vue({
    el: "#main", //where our app will load
    data: {
        images: []
    },
    mounted: function() { //mounted = "life cycle methods"
        var app = this;
        axios.get("/images").then((images) => { //every axios request will have corresponding app request in the server
            app.images = images.data.images; // same as: this.images = results.data.images;
            //create a v-for, loop thru images & display (in HTML)
        });
    }
});
