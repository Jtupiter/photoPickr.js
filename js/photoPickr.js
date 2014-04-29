var PhotoPickr = function(options) {
  var pickr;
  this.getCanvas = function() {

  };

  var template = function (name) {
    return PhotoPickrTemplates['templates/' + name + ".html"];
  };
  
  var FilePickr = function() {
    this.open = function() {

    };
  };

  var CameraPickr = function() {
    this.template = template("take-photo")();
  };

  var initialize = function(options) {
    if (options.type === "file") {
      pickr = new FilePickr();
    } else if (options.type === "camera") {
      pickr = new CameraPickr();
      options.el.append(pickr.template);
    }
    pickr.open();
  };

  initialize(options);

};

var photoPickr = new PhotoPickr({ 
  type: "file",
});

/*thisModule.SendMessageView = Backbone.Marionette.ItemView.extend({
      el: "#send-message-view",
      events: {
        "submit": "formSubmitted",
        "click .upload-photo": "sendPhoto",
        "click #take-photo": "takePhoto"
      },
      ui: {
        text: "#message-text"
      },
      initialize: function() {
        this.delegateEvents();
        this.bindUIElements();
        ImagePicker.initialize();
        // If WebRTC is not supported, do not give them the option to get a webcam snapshot.
        if (Modernizr.getusermedia){
          $('.send-photo').popover({
            html : true,
            placement: "top",
            content: function() {
              return $('#picture-message-popover').html();
            }
          });
          // Must remove bootstrap popover element, they are still clickable after being hidden.
          $(".send-photo").on('hidden.bs.popover', function () {
            $(this).next().remove();
          })
        }
        else {
          $(".send-photo").addClass("upload-photo");
        }
      },
      focus: function() {
        this.ui.text.focus();
      },
      formSubmitted: function(e) {
        e.preventDefault();
        var text = this.ui.text.val();
        var conversation = app.conversations.getSelected();
        this.ui.text.val('');
        if (text && conversation) {
          var message = {
            contact: conversation.get('contact'),
            parts: [text]
          };
          app.api.post('/api/users/' + localStorage.userId + "/messages", message).then(function(result) {
            app.conversations.handleNewMessages([result]); // Add message instantly (don't wait for polling) for responsiveness.
          });
        }
      },
      sendPhoto: function() {
        $('.send-photo').popover('hide');
        ImagePicker.pick(function() {
          var view = new thisModule.SendPhotoView();
          app.showDialog(view);
          view.render();
        });
      },
      takePhoto: function() {
        $('.send-photo').popover('hide');
        var view = new thisModule.TakePhotoView();
        app.showDialog(view);
        view.render();
      }
    });

    thisModule.SendPhotoView = Backbone.Marionette.ItemView.extend({
      className: "send-photo-view section",
      template: TMJST['user/client/templates/send-photo.html'],
      initialize: function () {
        app.vent.on("escape", this.close, this);
      },
      cleanup: function () {
        app.vent.off("escape");
      },
      close: function (e) {
        if (e) {
          e.preventDefault();
        }
        this.emit('close');
        this.remove();
      },
      ui: {
        container: ".canvas-container"
      },
      onRender: function () {
        ImagePicker.setMaxEdge(1024);
        ImagePicker.render();
        this.ui.container.append(ImagePicker.canvas());
      },
      serializeData: function () {
        return {};
      },
      events: {
        "click .send": "send",
        "click .close": "close"
      },
      send: function () {
        var that = this;
        var conversation = app.conversations.getSelected();
        ImagePicker.canvas().toBlob(function (blob) {
          var message = new FormData();
          var options = {
            processData: false,
            contentType: false
          };
          message.append("parts[]", blob);
          message.append("contact", conversation.get('contact'));
          app.api.post('/api/users/' + localStorage.userId + "/messages", message, options).then(function(result) {
            app.conversations.handleNewMessages([result]); // Add message instantly (don't wait for polling) for responsiveness.
          });
          that.close();
        }, "image/jpeg", 0.6);
      }
    });

    thisModule.TakePhotoView = Backbone.Marionette.ItemView.extend({
      className: "take-photo-view section",
      template: TMJST['user/client/templates/take-photo.html'],
      initialize: function () {
        app.vent.on("escape", this.close, this);
        this.localMediaStream = null;
      },
      cleanup: function () {
        app.vent.off("escape");
      },
      close: function (e) {
        if (e) {
          e.preventDefault();
        }
        app.hideDialog();
        this.remove();
      },
      ui: {
        container: ".canvas-container"
      },
      onRender: function () {
        var video = this.$el.find('video')[0];
        var canvas = this.$el.find('canvas')[0];
        var img = this.$el.find('img')[0];
        var that = this;
        var videoConstraints = {
          video: {
            maxHeight: video.height,
            maxWidth: video.width
          }
        };
        var gUM = Modernizr.prefixed('getUserMedia', navigator);
        gUM({video:true}, function(stream) {
          video.src = window.URL.createObjectURL(stream);
          that.localMediaStream = stream;
          setTimeout(function() {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            img.height = video.videoHeight;
            img.width = video.videoWidth;
          }, 100);
        }, function(err) { console.log(err); });
      },
      serializeData: function () {
        return {};
      },
      events: {
        "click .capture": "capture",
        "click .retake-photo": "retake",
        "click .use-photo": "usePhoto",
        "click .close": "close"
      },
      capture: function() {
        var video = this.$el.find('video');
        var canvas = this.$el.find('.webcam-canvas')[0];
        var img = this.$el.find('img');
        var ctx = canvas.getContext('2d');
        if (this.localMediaStream) {
          ctx.drawImage(video[0], 0, 0);
          // "image/webp" works in Chrome.
          // Other browsers will fall back to image/png.
          img[0].src = canvas.toDataURL('image/webp');
          video.hide();
          img.show();
          this.$el.find(".capture").hide();
          this.$el.find(".retake-photo").show();
          this.$el.find(".use-photo").show();
        }
      },
      retake: function() {
        this.$el.find('img').hide();
        this.$el.find(".retake-photo").hide();
        this.$el.find(".use-photo").hide();
        this.$el.find(".capture").show();
        this.$el.find('video').show();
      },
      usePhoto: function () {
        var that = this;
        var conversation = app.conversations.getSelected();
        var canvas = this.$el.find('.webcam-canvas')[0];
        canvas.toBlob(function (blob) {
          var message = new FormData();
          var options = {
            processData: false,
            contentType: false
          };
          message.append("parts[]", blob);
          message.append("contact", conversation.get('contact'));
          app.api.post('/api/users/' + localStorage.userId + "/messages", message, options).then(function(result) {
            app.conversations.handleNewMessages([result]); // Add message instantly (don't wait for polling) for responsiveness.
          });
          that.close();
        }, "image/jpeg", 0.6);
      }
    });*/