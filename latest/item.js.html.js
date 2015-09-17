ne.util.defineNamespace("fedoc.content", {});
fedoc.content["item.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview layout item. contain original items.\n * @dependency code-snippet, jquery1.8.3, layout.js\n * @author NHN entertainment FE dev team Jein Yi(jein.yi@nhnent.com)\n */\nne.util.defineNamespace('ne.component.Layout');\n\n/**\n * Item class(ne.component.Layout.Item) is manage item state and title.\n * @constructor\n */\nne.component.Layout.Item = ne.util.defineClass(/** @lends ne.component.Layout.Item.prototype */{\n\t/**\n\t * Initialize meember filed and state\n\t * @param {object} options\n\t * \t@param {string} options.groupInfo group that has item name\n\t * \t@param {string} options.contentId content element id\n\t * \t@param {boolean} options.isClose content close or not\n\t * \t@param {boolean} options.isDraggable drag helper element use or not\n\t * \t@param {number} options.index index of content in group\n\t *  @param {string} [options.moveButtonHTML] move button HTML\n\t *  @param {string} [options.elementHTML] item element HTML\n\t *  @param {string} [options.titleHTML] item title element HTML\n\t */\n\tinit : function(options) {\n\n\t\tif (!options) {\n\t\t\tthrow new Error(ERROR.OPTIONS_NOT_DEFINED);\n\t\t}\n\n\t\t// html set\n\t\tne.util.extend(options, {\n\t\t\telementHTML: options.elementHTML || HTML.ELEMENT,\n\t\t\tmoveButtonHTML: options.moveButtonHTML || HTML.MOVEBUTTON,\n\t\t\ttitleHTML: options.titleHTML || HTML.TITLE,\n\t\t\ttoggleButtonHTML: options.toggleButtonHTML || HTML.TOGGLEBUTTON,\n\t\t\ttitle: options.title || TEXT.DEFAULT_TITLE\n\t\t});\n\t\tne.util.extend(this, options);\n\n\t\tthis._makeElement();\n\t\t\n\t\t// title used, and fix title (no hide)\n\t\tif (!ne.util.isBoolean(this.isClose)) {\n\t\t\tthis.fixTitle();\n\t\t}\n\t\n\t\t// close body(I don't like this code, are there any ways to fix it.)\n\t\tif (this.isClose) {\n\t\t\tthis.close();\n\t\t} else {\n\t\t\tthis.open();\n\t\t}\n\n\t\tthis.$content.append($('#' + this.contentId));\n\t\tthis.$element.attr('id', 'item_id_' + this.contentId);\n\t\tthis._setEvents();\n\t},\n\n\t/**\n\t * Get Index\n\t */\n\tgetIndex: function() {\n\t\treturn this.index;\n\t},\n\n\t/**\n\t * Make item root element\n\t * @private\n\t */\n\t_makeElement: function() {\n\t\tvar wrapperClass = this.wrapperClass || DEFAULT_WRPPER_CLASS,\n\t\t\telementHTML = this._getHtml(this.elementHTML, {\n\t\t\t\tnumber : this.index,\n\t\t\t\twrapper: wrapperClass\n\t\t\t});\n\n\t\tthis.$element = $(elementHTML);\n\t\tthis.$element.css('position', 'relative');\n\t\tthis.$content = this.$element.find('.' + wrapperClass);\n\n\t\tthis.isDraggable = !!this.isDraggable;\n\t\tthis._makeTitle();\n\t},\n\n\t/**\n\t * Make title element and elements belong to title\n\t * @private\n\t */\n\t_makeTitle: function() {\n\n\t\tthis.$titleElement = $(this.titleHTML);\n\t\tthis.$titleElement.html(this.title);\n\n\t\tif (this.isDraggable) {\n\t\t\tthis._makeDragButton(this.moveButtonHTML);\n\t\t}\n\n\t\tthis.$content.before(this.$titleElement);\n\t\tthis._makeToggleButton(this.toggleButtonHTML);\n\t},\n\n\t/**\n\t * Make markup with template\n\t * @param {string} html A item element html\n\t * @param {object} map The map to change html string\n\t * @returns {string}\n\t * @private\n\t */\n\t_getHtml: function(html, map) {\n\t\thtml = html.replace(/\\{\\{([^\\}]+)\\}\\}/g, function(mstr, name) {\n\t\t\treturn map[name];\n\t\t});\n\t\treturn html;\n\t},\n\n\t/**\n\t * Make drag button in title\n\t * @param {string} html button html\n\t * @private\n\t */\n\t_makeDragButton: function(html) {\n\t\thtml = this._getHtml(html, {\n\t\t\t'item-id': 'item_id_' + this.contentId\n\t\t});\n\t\tthis.$titleElement.append($(html));\n\t},\n\n\t/**\n\t * Make Toggle button in title\n\t * @param {string} toggleHTML\n\t * @private\n\t */\n\t_makeToggleButton: function(toggleHTML) {\n\t\tthis.$toggleButton = $(toggleHTML);\n\t\tthis.$titleElement.append(this.$toggleButton);\n\t},\n\n\t/**\n\t * Close item element\n\t */\n\tclose: function() {\n\t\tthis.$toggleButton.addClass(\"open\");\n\t\tthis.$content.hide();\n\t},\n\n\t/**\n\t * Open item element\n\t */\n\topen: function() {\n\t\tthis.$toggleButton.removeClass(\"open\");\n\t\tthis.$content.show();\n\t},\n\n\t/**\n\t * Fix title to do not hide. After fixTitle called, hideTitle do not work.\n\t */\n\tfixTitle: function() {\n\t\tthis.showTitle();\n\t\tthis.isTitleFix = true;\n\t},\n\n\t/**\n\t * Show title\n\t */\n\tshowTitle: function() {\n\t\tthis.$titleElement.show();\n\t},\n\n\t/**\n\t * Hide title\n\t */\n\thideTitle: function() {\n\t\tif (!this.isTitleFix) {\n\t\t\tthis.$titleElement.hide();\n\t\t}\n\t},\n\n\t/**\n\t * Toggle open/close\n\t */\n\ttoggle: function() {\n\t\tif (this.$toggleButton.hasClass('open')) {\n\t\t\tthis.open();\n\t\t} else {\n\t\t\tthis.close();\n\t\t}\n\t},\n\n\t/**\n\t * Set all event about item\n\t * @private\n\t */\n\t_setEvents: function() {\n\t\tthis.$toggleButton.on('click', $.proxy(this.toggle, this));\n\t}\n});</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"