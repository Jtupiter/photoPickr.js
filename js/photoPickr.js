var PhotoPickr = function(options) {

  this.getCanvas = function() {

  };
  
  var filePickr = function() {

  };

  var cameraPickr = function() {

  };

  var initialize = function(options) {
    var pickr;
    if (options.type === "file") {
      pickr = new filePickr();
    } else if (options.type === "camera") {
      pickr = new cameraPickr();
    }
    pickr.el.appendTo(options.el);
  };

  initialize(options);

});