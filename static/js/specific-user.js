Vue.component('v-select', VueSelect.VueSelect);
// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};

// Given an empty app object, initializes it filling its attributes,
// creates a Vue instance, and then initializes the Vue instance.
let init = (app) => {

    // This is the Vue data.
    app.data = {
        user_email: user_email,
        username: username,
        icon_url: set_icon_url,
        master: {},
        current_user: {},
        options: [],
        roles: ["Admin", "Approved", "Unapproved"],
        is_pending: false,
        error: false,
        success: false,
        id: id,
        selected: "",
        isAdmin: admin == "True",

        // Complete.
    };
    // Use this function to reindex the posts, when you get them, and when
    // you add / delete one of them.
    app.reindex = (a) => {
        let idx = 0;
        for (p of a) {
            p._idx = idx++;
        }
        return a;
    };

    app.goback = (destination) => {
        window.location.href = "../users";
    };

    app.resetCurrent = () => {
        app.data.current_user = {...app.data.master};
    };


    app.updateCurrent = () => {
        let user = app.data.current_user;

        if(user !== false) {
            app.data.is_pending = true;
            axios.post(edit_user_url, { bio : user.bio,
                                        role : app.data.selected,
                                        tags_list : user.tags_list,
                                        full_name : user.full_name,
                                        id : user.id })
            .then((response) => {
                app.data.current_user.role = app.data.selected;
                app.data.master = {...app.data.current_user};
                app.data.is_pending = false;
                app.show_value(1);
            }).catch((error) => {
                console.log(error);
                app.show_value(0);
            });
        }
    };


    app.sleep = (ms) => {
            return function (x) {
                return new Promise(resolve => setTimeout(() => resolve(x), ms));
            };
        };

    app.show_value = (flag) => {
        // Flashes an error if an error occurred.

        if(flag === 0) {
            app.data.error = true;
            app.data.success = false;
        }
        else if(flag == 1) {
            app.data.error = false;
            app.data.success = true;
        }
        else {
            app.data.error = false;
        }
        app.data.is_pending = false;
        app.sleep(1000)()
            .then(() => {
                app.data.error = false;
                app.data.success = false;
            });
    };

    app.checkUser = () => {
        return app.data.user_email === app.data.current_user.user_email;
    };

    app.checkAdmin = () => {
        return app.data.isAdmin;
    };

    app.upload_image = () => {
        axios.get(get_icon_url, {params: {"id": app.data.current_user.id}})
            .then((result) => {
                // Puts the image URL.
                // See https://vuejs.org/v2/guide/reactivity.html#For-Objects
                Vue.set(app.data.current_user, 'url', result.data.imgbytes);
                app.data.master = {...app.data.current_user};
        });
    };

    // We form the dictionary of all methods, so we can assign them
    // to the Vue app in a single blow.
    app.methods = {
        goback: app.goback,
        updateCurrent: app.updateCurrent,
        resetCurrent: app.resetCurrent,
        checkUser: app.checkUser,
        checkAdmin: app.checkAdmin,
        upload_image: app.upload_image,
    };

    // This creates the Vue instance.
    app.vue = new Vue({
        el: "#vue-user",
        data: app.data,
        methods: app.methods
    });

  app.init = () => {
        axios.get(show_user_url, {params: {"id": id}}).then((result) => {
            app.data.current_user = result.data.user;
            app.data.options = result.data.tags;
            app.data.selected = app.data.current_user.role;
            axios.get(get_icon_url, {params: {"id": app.data.current_user.id}})
                .then((result) => {
                    // Puts the image URL.
                    // See https://vuejs.org/v2/guide/reactivity.html#For-Objects
                    Vue.set(app.data.current_user, 'url', result.data.imgbytes);
                    app.data.master = {...app.data.current_user};
            });


        });
    };




    // Call to the initializer.
    app.init();
};

// This takes the (empty) app object, and initializes it,
// putting all the code i
init(app);
