(function() {
    let comment = {
        props: {'get_url': String,
                'add_url': String,
                'edit_url': String,
                'delete_url': String,
                'ticket_id': String},
        data: null,
        methods: {}
    };

    comment.data = function () {
        let data = {
            new_comment: "",
            comments: [],
            edit: false,
            show_settings: false,
            get_url: this.get_url,
            add_url: this.add_url,
            edit_url: this.edit_url,
            delete_url: this.delete_url,
        };

        data = comment.methods.load(data);
        return data;
    };

    comment.methods.reindex = function(comments) {
        let _idx = 0;
        for(let c of comments) {
            c._idx = _idx++;
            c.show_settings = false;
        }
        return comments;
    };

    comment.methods.load = function(data) {
        // dynamically attach comment information
        axios.get(data.get_url).then((result) => {
            data.comments = result.data.comments;
            data.comments = comment.methods.reindex(data.comments);
        });
        return data;
    };

    comment.methods.cancel = function() {
        // clears the new comment text area
        this.new_comment = "";
        this.edit = false;
    };

    comment.methods.click = function() {
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    };

    comment.methods.submit = function() {
        // submit the newly added comment to the backend, then add to the comments list
        if (!this.new_comment || this.new_comment.length === 0)
            // TODO: switch control to an error view
            return;

        axios.post(this.add_url, {
            content: this.new_comment,
            ticket_id: this.ticket_id
        }).then((result) => {
            this.comments.push({
                content: this.new_comment,
                id: result.data.id
            });
            this.comments = comment.methods.reindex(this.comments);
            this.new_comment = "";
        });
        this.edit = false;
    };

    comment.methods.edit_comment = function(idx) {
        // prepare the comment for editing, if necessary
        // gotta set the edit flag for the currently selected ticket, maybe the submit functionality will be separate
        // after all
        this.comments[idx].show_settings = false;
    };

    comment.methods.delete_comment = function(idx) {
        // delete the comment
        this.comments[idx].show_settings = false;
    };

    utils.register_vue_component('comment', 'components/comment/comment.html',
        function(template) {
            comment.template = template.data;
            return comment;
        });

})();
