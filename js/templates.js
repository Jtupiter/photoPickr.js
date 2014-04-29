this["PhotoPickrTemplates"] = this["PhotoPickrTemplates"] || {};

this["PhotoPickrTemplates"]["templates/take-photo.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div id="take-photo-container">\n  <video autoplay class="webcam-stream"></video>\n  <img class="webcam-capture">\n  <canvas class="webcam-canvas" style="display:none;"></canvas>\n  <button class="btn close">Close</button>\n  <button class="btn retake-photo" style="display:none;">Retake</button>\n  <button class="btn use-photo" style="display:none;">Use Photo</button>\n  <button class="btn capture main_action">Capture</button>\n</div>\n';

}
return __p
};