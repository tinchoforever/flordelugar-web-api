function click(el) {
  var element = O.Core.getElement(el);
  var t = O.Trigger();
  element.onclick = function() {
    t.trigger();
  }
  return t;
}

O.Template({
  init: function() {
    var seq = O.Triggers.Sequential();

    var baseurl = this.baseurl = 'http://{s}.api.cartocdn.com/base-light/{z}/{x}/{y}.png';
    var map = this.map = L.map('map').setView([0, 0.0], 4);
    var basemap = this.basemap = L.tileLayer(baseurl, {
      attribution: 'data OSM - map CartoDB'
    }).addTo(map);

    // enable keys to move
    O.Keys().on('map').left().then(seq.prev, seq)
    O.Keys().on('map').right().then(seq.next, seq)

    click(document.getElementsByClassName('next')).then(seq.next, seq)
    click(document.getElementsByClassName('prev')).then(seq.prev, seq)

    var slides = O.Actions.Slides('slides');
    var story = O.Story()

    this.story = story;
    this.seq = seq;
    this.slides = slides;
    this.progress = O.UI.DotProgress('dots').count(0);
  },

  update: function(actions) {
    if (!actions.length) return;
    this.story.clear();

    // update footer title and author
    var title_ = actions.global.title === undefined ? '' : actions.global.title,
        author_ = actions.global.author === undefined ? 'Using' : 'By '+actions.global.author+' using';

    document.getElementById('title').innerHTML = title_;
    document.getElementById('author').innerHTML = author_;
    document.title = title_ + " | " + author_ +' Odyssey.js';

    var sl = actions;

    document.getElementById('slides').innerHTML = ''
    this.progress.count(sl.length);

    // create new story
    for(var i = 0; i < sl.length; ++i) {
      var slide = sl[i];
      var tmpl = "&lt;div class='slide' style='diplay:none'&gt;"
      tmpl += slide.html();
      tmpl += "&lt;/div&gt;";
      document.getElementById('slides').innerHTML += tmpl;

      this.progress.step(i).then(this.seq.step(i), this.seq)

      var actions = O.Parallel(
        this.slides.activate(i),
        slide(this),
        this.progress.activate(i)
      );

      this.story.addState(
        this.seq.step(i),
        actions
      )
    }
    this.story.go(this.seq.current());
  },

  changeSlide: function(n) {
    this.seq.current(n);
  }
});
