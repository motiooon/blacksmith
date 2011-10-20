var docs     = require('../docs'),
    weld     = require('weld').weld,
    markdown = require('github-flavored-markdown'),
    findit   = require('findit'),
    fs       = require('fs'),
    fs2      = require('../fs2'),
    path     = require('path'),
    helpers  = require('../helpers');

var errors = exports;


errors.weld = function(dom, errs) {

  var $ = docs.window.$;

  Object.keys(errs).forEach(function(err) {

    //start with our theme
    dom.innerHTML = docs.content.theme['./theme/error.html'].toString();

    //
    // In order to build a ToC for the errors view, we need to load the
    // articles. These lines are copypasted from articles.js.
    // This needs to be dealt with in a better way.
    //

    var p = helpers.unresolve(path.resolve(__dirname + "/../.."), docs.src);

    var _articles = findit.sync(p);

    //
    // Filter out all non-markdown files
    //
    _articles = _articles.filter(function(a){
      a = path.resolve(a);
      if(a.match(/\./)){
        return false;
      } else {
        return true;
      }
    });

    // Here, we build up the table of contents.
    var toc = fs2.filesToTree(_articles);
        toc = helpers.treeToHTML(toc);

    //set up the data
    var data = {
      status: errs[err].status,
      message: errs[err].message,
      toc: toc
    };

    //weld it!
    weld(dom, data, {
      map: function(parent, element, key, val) {

        if ($(element).attr("id") === "toc") {
          element.innerHTML = val;
          return false;
        }

        return true;

      }
    });

    //Attach the results to errs
    errs[err].content = dom.innerHTML;
  });
  
  return dom;

};


errors.generate = function(output, errs) {

  //
  // Generate the error view
  //
  Object.keys(errs).forEach(function(err){
    var newPath =  path.normalize("./public/" + errs[err].status + '.html');
    fs2.writeFile(newPath, errs[err].content, function(){});
  });

  return errs;
};

errors.load = function() {
  // TODO: Think about what I *really* want to return.
  return { 404: { status: 404,
           message: "File not found" }};
};