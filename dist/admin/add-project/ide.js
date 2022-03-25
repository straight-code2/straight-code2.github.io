// --- Inline editor

function InlineEditor(id, options) {
  this.options = options || {};
  
  this.element = (typeof id === 'string') ? document.getElementById(id) : id;
  this.events = new Events(this);
  if (this.options.events) this.events.adds(this.options.events);
  
  this.binds = {
    keyboardHandler: this.keyboardHandler.bind(this)
  }
  
  this.value = '';
  
  this.attach();
  this.events.fire('create');
}

InlineEditor.prototype.attach = function() {
  this.inlineEditor = document.createElement('div');
  this.inlineEditor.className = 'inline-editor';
  
  this.editor = document.createElement('input');
  this.editor.type = 'text';
  this.editor.placeholder = 'Enter file name';
  this.editor.value = this.value;
  this.inlineEditor.appendChild(this.editor);
  
  this.saveBtn = document.createElement('span');
  this.saveBtn.className = 'btn btn-save';
  this.inlineEditor.appendChild(this.saveBtn);

  this.cancelBtn = document.createElement('span');
  this.cancelBtn.className = 'btn btn-cancel';
  this.inlineEditor.appendChild(this.cancelBtn);

  this.element.appendChild(this.inlineEditor);
  
  // Add keyboard handlers (Enter, Esc)
  this.editor.addEventListener('keydown', this.binds.keyboardHandler);
}

InlineEditor.prototype.detach = function() {
  this.editor.removeEventListener('keydown', this.binds.keyboardHandler);
  
  this.inlineEditor.parentNode.removeChild(this.inlineEditor);
  
  // TODO: Detach buttons events
  this.cancelBtn = null;
  this.saveBtn = null;
  this.editor = null;
  
  this.inlineEditor = null;
}

InlineEditor.prototype.destroy = function() {
  this.events.fire('destroy');
  
  this.detach();
  this.events = null;
  this.element = null;
}

InlineEditor.prototype.keyboardHandler = function(event) {
  var stop = false;
  var code = (event.which || event.keyCode);
  switch(code) {
    case 13:
      this.events.fire('ok', this.getValue());
      stop = true;
      break;
      
    case 27:
      this.events.fire('cancel');
      stop = true;
      break;
  }

  if (stop && event && event.stopPropagation) {
    event.preventDefault();
    event.stopPropagation();
  }
}

InlineEditor.prototype.getValue = function() {
  return this.editor.value;
}

InlineEditor.prototype.setValue = function(value) {
  this.value = value;
  if (this.editor) {
    this.editor.value = this.value;
  }
}

InlineEditor.prototype.focus = function() {
  try {
    if (this.editor) this.editor.focus();
  } catch(e) {}
}

// --- Editor files

function EditorFiles(id, options) {
  this.element = (typeof id === 'string') ? document.getElementById(id) : id;
  
  this.events = new Events(this);
  
  this.options = Object.merge({
    offset: 2,
    margin: 10,
    suffix: this.element.getAttribute('data-editor-files-suffix')
  }, options);
  
  this.binds = {
    keyboardHandler: this.keyboardHandler.bind(this)
  }

  var editorId = this.element.getAttribute('data-editor-files');
  var menuId = this.element.getAttribute('data-editor-files-menu');
  var filenameId = this.element.getAttribute('data-editor-files-filename');
  this.ui = {
    editor: document.getElementById(editorId),
    menu: document.getElementById(menuId),
    filename: document.getElementById(filenameId),
    files: this.getElements(this.element, 'textarea'),
  };
  
  this.attach();
}

EditorFiles.prototype.keyboardHandler = function(event) {
  var code = (event.which || event.keyCode);
  switch(code) {
    case 27:
      this.hideMenu();
      break;
  }
}

EditorFiles.prototype.attach = function() {
  if (!this.ui.editor || !this.ui.menu || !this.ui.filename || this.ui.files.length == 0) return;
  
  this.active = -1;
  this.setActive(0);
  this.focus();
  
  this.ui.menu.addEventListener('click', this.toggleMenu.bind(this));
  this.ui.menu.addEventListener('mouseover', this.preShowMenu.bind(this));
}

EditorFiles.prototype.focus = function() {
  if (this.ui && this.ui.editor && this.ui.editor.ace) this.ui.editor.ace.focus();
}

EditorFiles.prototype.setActive = function(index) {
  if (this.active == index) return;
  
  // Turn off previous handler
  if (this.saveHandler) {
    this.ui.editor.ace.getSession().off('change', this.saveHandler);
  }
  
  var file = this.ui.files[index];
  var filename = file.getAttribute('data-filename');
  
  this.saveHandler = function(event, editor) {
    file.value = editor.getValue();
  };
  
  this.ui.filename.innerHTML = '(' + filename + ')';
  this.ui.editor.ace.getSession().setValue(file.value);
  this.ui.editor.ace.getSession().on('change', this.saveHandler);
  
  if (this.filesMenuItems) {
    this.filesMenuItems.forEach(function(item, idx) {
      if (idx == index) {
        item.classList.add('item-selected');
      } else {
        item.classList.remove('item-selected');
      }
    });
  }
  
  this.active = index;
}

EditorFiles.prototype.isMenuVisible = function() {
  return !(!this.menu || this.menu.style.display != 'block');
}

EditorFiles.prototype.toggleMenu = function(event) {
  if (event && event.stopPropagation) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  if (!this.isMenuVisible()) {
    this.showMenu();
  } else {
    this.hideMenu();
  }
}

EditorFiles.prototype.addFileMenuItem = function(file, idx) {
  var filename = file.getAttribute('data-filename');

  
  var item = document.createElement('div');
  item.className = 'item';
  item.innerHTML = filename;
  item.addEventListener('click', function() {
    this.setActive(idx);
    this.hideMenu();
    this.events.fire('change', idx);
  }.bind(this));
 

  var item = document.createElement('div');
  item.className = 'item';
  
  var text = document.createElement('div');
  text.className = 'text';
  text.innerHTML = filename;
  text.title = filename;
  text.addEventListener('click', function() {
    this.setActive(idx);
    this.hideMenu();
    this.events.fire('change', idx);
  }.bind(this));
  
  var removeAction = document.createElement('div');
  removeAction.className = 'remove-action fa fa-times';
  removeAction.addEventListener('click', function() {
    // TODO: Remove file with confirmation
    this.hideMenu();
  }.bind(this));
  
  item.appendChild(removeAction);
  item.appendChild(text);

  if (this.active == idx) {
    item.classList.add('item-selected');
  }
  
  this.filesList.appendChild(item);
  
  return item;
}

EditorFiles.prototype.preShowMenu = function() {
  if (!this.isMenuVisible()) {
    this.isFocused = this.ui.editor.ace.isFocused();
  }
}

EditorFiles.prototype.showMenu = function() {
  // Create menu if needed
  if (!this.menu) {
    this.menu = document.createElement('div');
    this.menu.className = 'popover-menu';
    
    this.filesList = document.createElement('div');
    this.filesMenuItems = this.ui.files.map(this.addFileMenuItem.bind(this), this);
    this.menu.appendChild(this.filesList);
    
    // Add 'new file' item
    var newFileItem = document.createElement('div');
    newFileItem.className = 'item item-special';
    newFileItem.innerHTML = 'New file';
    newFileItem.addEventListener('click', this.newFile.bind(this));
    this.menu.appendChild(newFileItem);
    this.newFileItem = newFileItem;
    
    document.body.appendChild(this.menu);
  }
  
  // Show menu
  var bounds = this.ui.menu.parentNode.getBoundingClientRect();
  this.menu.style.top = (bounds.top + bounds.height + this.options.offset) + 'px';
  this.menu.style.left = (bounds.left + this.options.margin) + 'px';
  this.menu.style.width = (bounds.width - this.options.margin * 2) + 'px';
  this.menu.style.display = 'block';
  
  // Show mask
  if (!this.mask) {
    this.mask = document.createElement('div');
    this.mask.style.position = 'fixed';
    this.mask.style.top = '0px';
    this.mask.style.bottom = '0px';
    this.mask.style.left = '0px';
    this.mask.style.right = '0px';
    this.mask.style.zIndex = this.getComputedStyle(this.menu, 'z-index') - 1;
    this.mask.addEventListener('click', this.hideMenu.bind(this));
    document.body.appendChild(this.mask);
  } else {
    this.mask.style.display = 'block';
  }

  window.addEventListener('keydown', this.binds.keyboardHandler);
}

EditorFiles.prototype.hideMenu = function() {
  if (!this.menu) return;

  window.removeEventListener('keydown', this.binds.keyboardHandler);

  if (this.editor) {
    this.editor.destroy();
    this.editor = null;
  }
  
  if (this.isFocused) {
    this.ui.editor.ace.focus();
  }
  
  this.menu.style.display = 'none';
  this.mask.style.display = 'none';
}

EditorFiles.prototype.newFile = function() {
  if (this.newFileItem.classList.contains('item-editing')) return;
  
  var self = this;
  this.editor = new InlineEditor(this.newFileItem, {
    events: {
      create: function() {
        self.newFileItem.classList.add('item-editing');
        this.focus();
      },
      destroy: function() {
        self.newFileItem.classList.remove('item-editing');
      },
      ok: function(value) {
        var that = this;
        that.inlineEditor.classList.remove('input-invalid');
        if (value == '') {
          setTimeout(function() {
            that.inlineEditor.classList.add('input-invalid');
          }, 1);
          return;
        }
        
        self.editor.destroy();
        self.editor = null;
        
        // TODO: Add new file
        setTimeout(function() {
          self.addFile(value);
        }, 1);
        
        self.hideMenu();
      },
      cancel: function() {
        self.editor.destroy();
        self.editor = null;
      }
    }
  });
}

EditorFiles.prototype.addFile = function(value) {
  if (value == '') return;
  if (this.options.suffix) {
    if (value.indexOf('.') == -1) {
      value += '.' + this.options.suffix;
    }
  }
  
  var textarea = document.createElement('textarea');
  textarea.setAttribute('data-filename', value);
  
  var container = this.ui.files[this.ui.files.length - 1].parentNode;
  container.appendChild(textarea);
  this.ui.files.push(textarea);
  
  this.filesMenuItems.push(
    this.addFileMenuItem(textarea, this.ui.files.length - 1)
  );
  this.setActive(this.ui.files.length - 1);
  this.focus();
}

EditorFiles.prototype.getElements = function(el, selector) {
  return [].slice.call(el.querySelectorAll(selector));
}

EditorFiles.prototype.getComputedStyle = function(elem, prop) {
  if (elem.currentStyle) {
    return elem.currentStyle[prop];
  } else if (window.getComputedStyle) {
    return window.getComputedStyle(elem, null).getPropertyValue(prop);
  }
}

// --- Tabs

function Tabs(id) {
  this.element = (typeof id === 'string') ? document.getElementById(id) : id;
  this.events = new Events(this);
  this.attach();
}

Tabs.prototype.attach = function() {
  this.tabs = this.getElements(this.element, '[data-tab]');
  this.pages = this.getElements(this.element, '[data-page]');
  
  this.tabs.forEach(function(tab, idx) {
    tab.addEventListener('click', this.select.bind(this, idx));
  }, this);
}

Tabs.prototype.select = function(idx, event) {
  if (idx < 0 || idx >= this.tabs.length) return;
  var tab = this.tabs[idx];
  var id = tab.getAttribute('data-tab');
  
  this.tabs.forEach(function(_tab) {
    if (_tab == tab) {
      _tab.classList.add('tab-active');
    } else {
      _tab.classList.remove('tab-active');
    }
  }, this);
  
  this.pages.forEach(function(page) {
    var pageId = page.getAttribute('data-page');
    if (pageId == id) {
      page.classList.add('page-active');
    } else {
      page.classList.remove('page-active');
    }
  }, this);
  
  this.events.fire('change', idx);
}

Tabs.prototype.getElements = function(el, selector) {
  return [].slice.call(el.querySelectorAll(selector));
}

// --- Splitter

function Splitter(id, options) {
  this.element = (typeof id === 'string') ? document.getElementById(id) : id;
  this.options = options || {};
  
  if (!this.options.cookieKey) this.options.cookieKey = null;
  if (!this.options.minWidth) this.options.minWidth = 0;
  
  this.binds = {
    start: this.start.bind(this),
    move: this.move.bind(this),
    end: this.end.bind(this)
  };
  
  this.attach();
}

Splitter.prototype.attach = function() {
  this.left = this.element.previousElementSibling;
  this.right = this.element.nextElementSibling;
  
  // TODO: load from cookie?
  
  this.dragging = false;
  
  this.element.addEventListener('mousedown', this.binds.start);
}

Splitter.prototype.start = function(event) {
  var isLeftButton = (event.which ? (event.which == 1) : false) || 
                      (event.button ? (event.button == 1) : false);
  if (!isLeftButton) return;
  
  event.stopPropagation();
  event.preventDefault();
  
  this.startPos = this.eventPosition(event);

  // Add transparent cover to avoid IFRAMEs
  if (!this.cover) {
    this.cover = document.createElement('div');
    this.cover.style.position = 'fixed';
    this.cover.style.top = '0px';
    this.cover.style.bottom = '0px';
    this.cover.style.left = '0px';
    this.cover.style.right = '0px';
    this.cover.style.cursor = this.getComputedStyle(this.element, 'cursor');
    document.body.appendChild(this.cover);
  } else {
    this.cover.style.display = 'block';
  }
  
  document.body.addEventListener('mousemove', this.binds.move);
  document.body.addEventListener('mouseup', this.binds.end);
  this.dragging = true;
}

Splitter.prototype.move = function(event) {
  if (!this.dragging) return;
  
  event.stopPropagation();
  event.preventDefault();
  
  var pos = this.eventPosition(event);
  
  // TODO: resize
  var delta = pos.x - this.startPos.x;
  this.startPos = pos;
  
  //console.log(delta);
  
  var leftWidth = this.left.offsetWidth;
  var rightWidth = this.right.offsetWidth;
  
  //console.log(leftWidth, rightWidth);
  
  if (delta < 0) {
    if ((leftWidth + delta) < this.options.minWidth) delta -= this.options.minWidth - (leftWidth + delta);
  } else {
    if ((rightWidth - delta) < this.options.minWidth) delta -= this.options.minWidth - (rightWidth - delta);
  }
  
  this.left.style.width = (leftWidth + delta) + 'px';
  this.right.style.width = (rightWidth - delta) + 'px';
}

Splitter.prototype.end = function(event) {
  if (!this.dragging) return;

  event.stopPropagation();
  event.preventDefault();
  
  this.cover.style.display = 'none';
  
  var pos = this.eventPosition(event);
  
  // TODO: end dragging, fix new sizes
  
  // TODO: save to cookie?

  document.body.removeEventListener('mousemove', this.binds.move);
  document.body.removeEventListener('mouseup', this.binds.end);
  this.dragging = false;
}

Splitter.prototype.eventPosition = function(event) {
  var pageX = event.pageX;
  var pageY = event.pageY;
  if (pageX === undefined) {
    pageX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    pageY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
  return {
    x: pageX,
    y: pageY
  };
}

Splitter.prototype.getComputedStyle = function(elem, prop) {
  if (elem.currentStyle) {
    return elem.currentStyle[prop];
  } else if (window.getComputedStyle) {
    return window.getComputedStyle(elem, null).getPropertyValue(prop);
  }
}

// --- Create Editor

function createEditor(id, mode, options) {
  options = options || {};
  
  var editor = ace.edit(id);
  //editor.setTheme("ace/theme/ambiance");
  editor.setTheme("ace/theme/twilight");
  editor.getSession().setMode("ace/mode/" + mode);
  editor.setFontSize(16);
  // enable autocompletion and snippets
  editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: false
  });
  
  if (options.onchange) {
    editor.getSession().on('change', options.onchange);
  }
  
  if (mode == 'html') {
    // Filter out doctype lint error
    var session = editor.getSession();
    session.on("changeAnnotation", function() {
      var annotations = session.getAnnotations()||[], i = len = annotations.length;
      while (i--) {
        if(/doctype first\. Expected/.test(annotations[i].text)) {
          annotations.splice(i, 1);
        }
      }
      if(len>annotations.length) {
        session.setAnnotations(annotations);
      }
    });
  }  
  
  var el = document.getElementById(id);
  el.ace = editor;
  
  return editor;
}

// ---

window.addEventListener('DOMContentLoaded', function() {
  
  var splitterEl = document.querySelector('[data-splitter]');
  new Splitter(splitterEl/*, {minWidth: 200}*/);
  
  var tabsEl = document.querySelector('[data-tabs]');
  var tabs = new Tabs(tabsEl);
  
  var saveBtn = document.getElementById('save-btn');
  var markChanges = function() {
    saveBtn.classList.add('highlight');
  };
  
  var htmlEditor = createEditor('html-editor', 'html', {onchange: markChanges});
  var cssEditor = createEditor('css-editor', 'css', {onchange: markChanges});
  var jsEditor = createEditor('js-editor', 'javascript', {onchange: markChanges});

  var pages = [].slice.call(document.querySelectorAll('[data-editor-files]'));
  pages = pages.map(function(files, idx) {
    var f = new EditorFiles(files);
    f.events.add('change', function(newIndex) {
      tabs.select(idx);
    });
    return f;
  });
  tabs.events.add('change', function(idx) {
    pages[idx].focus();
  });
  
  if (window == window.top) {
    pages[0].focus();
  }
  
});

// --- Polyfills & utils

if (typeof Object.forEach != 'function') {
  Object.forEach = function(object, fn, bind) {
	  for (var key in object) {
  		if (Object.prototype.hasOwnProperty.call(object, key)) fn.call(bind, object[key], key, object);
  	}
  }
}

if (typeof Object.merge != 'function') {
  Object.merge = function() {
    'use strict';
    var target = Object({});
    for (var index = 0; index < arguments.length; index++) {
      var source = arguments[index];
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };
}

// === Events

var Events = function(context) {
  this.context = context || null;
  this.events = {};
}

Events.prototype.add = function(event, listener) {
  if (typeof this.events[event] !== 'object') {
    this.events[event] = [];
  }

  this.events[event].push(listener);
}

Events.prototype.adds = function(events) {
  Object.forEach(events, function(listener, event) {
    this.add(event, listener);
  }, this);
}

Events.prototype.remove = function(event, listener) {
  var idx;

  if (typeof this.events[event] === 'object') {
    idx = this.events[event].indexOf(listener);

    if (idx > -1) {
      this.events[event].splice(idx, 1);
    }
  }
}

Events.prototype.fire = function(event) {
  var i, listeners, length, args = [].slice.call(arguments, 1);

  if (typeof this.events[event] === 'object') {
    listeners = this.events[event].slice();
    length = listeners.length;

    for (i = 0; i < length; i++) {
      listeners[i].apply(this.context, args);
    }
  }
}

Events.prototype.fireOnce = function(event, listener) {
  this.add(event, function g () {
    this.remove(event, g);
    listener.apply(this.context, arguments);
  });
}
