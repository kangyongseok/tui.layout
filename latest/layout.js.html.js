ne.util.defineNamespace("fedoc.content", {});
fedoc.content["layout.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n* @fileoverview Layout component\n* @dependency code-snippet.js jquery.1.8.3\n* @author NHN entertainment FE dev team Jein Yi(jein.yi@nhnent.com)\n*/\nne.util.defineNamespace('ne.component');\n\n/**\n * Layout class(ne.component.Layout) make layout element(JQueryObject) and include groups, control item move and set events.\n * @constructor\n */\nne.component.Layout = ne.util.defineClass(/**@lends ne.component.Layout.prototype */{\n\t/**\n\t * Initialize layout\n\t * @param {object} opitons\n\t * \t@param {array} options.grouplist The list of group options\n\t * @param {JQueryObject} $element\n\t */\n\tinit: function(opitons, $element) {\n\t\tthis.$element = $element;\n\t\tthis._makeGroup(opitons.grouplist);\n\t\tthis._makeGuide(opitons.guideHTML);\n\t\tthis._setEvents();\n\t},\n\n\t/**\n\t * Make group\n\t * @param {array} grouplist The list of group options\n\t * @private\n\t */\n\t_makeGroup: function(grouplist) {\n\t\tvar group;\n\t\tthis.groups = {};\n\n\t\tne.util.forEach(grouplist, function(item) {\n\t\t\tgroup = this.groups[item.id] = new ne.component.Layout.Group(item);\n\t\t\tthis.$element.append(group.$element);\n\t\t}, this);\n\t},\n\n\t/**\n\t * Get group item\n\t * @param {(string|object)} group The item ID or information to find group\n\t * @returns {*}\n\t * @private\n\t */\n\t_getGroup: function(group) {\n\t\tif (ne.util.isObject(group)) {\n\t\t\tif (group.attr('data-group')) {\n\t\t\t\tgroup = group.attr('data-group');\n\t\t\t} else {\n\t\t\t\tgroup = group.parent().attr('data-group');\n\t\t\t}\n\t\t}\n\t\treturn this.groups[group];\n\t},\n\n\t/**\n\t * Make guide object\n\t * @param {string} [guideHTML] guide The html will be usded to make guide element\n\t * @private\n\t */\n\t_makeGuide: function(guideHTML) {\n\t\tthis._guide = new ne.component.Layout.Guide({\n\t\t\tguideHTML: guideHTML\n\t\t});\n\t},\n\n\t/**\n\t * Set Events\n\t * @private\n\t */\n\t_setEvents: function() {\n\t\tthis.onMouseDown = $.proxy(this._onMouseDown, this);\n\t\tthis.onMouseMove = $.proxy(this._onMouseMove, this);\n\t\tthis.onMouseUp = $.proxy(this._onMouseUp, this);\n\t\t$('.drag-item-move').on('mousedown', this.onMouseDown);\n\t},\n\n\t/**\n\t * Mouse down event handler\n\t * @param e\n\t * @private\n\t */\n\t_onMouseDown: function(e) {\n\t\tvar $doc = $(document);\n\t\tthis.height($doc.height());\n\t\tthis._setGuide(e.target, e.clientX, e.clientY);\n\t\t$doc.on('mousemove', this.onMouseMove);\n\t\t$doc.on('mouseup', this.onMouseUp);\n\t},\n\n\t/**\n\t * Set guide\n\t * @param {object} target The target to set guide's move-statement element\n\t * @param {number} pointX The position x to set guide element left.\n\t * @param {number} pointY The position y to set guide element top.\n\t * @private\n\t */\n\t_setGuide: function(target, pointX, pointY) {\n\t\tvar $doc = $(document),\n\t\t\tinitPos = {\n\t\t\t\tx: pointX + $doc.scrollLeft() + 10,\n\t\t\t\ty: pointY + $doc.scrollTop() + 10\n\t\t\t},\n\t\t\titemId = $(target).attr('data-item'),\n\t\t\t$moveEl = $('#' + itemId);\n\n\t\tthis._guide.ready(initPos, $moveEl);\n\t\tthis._guide.setMoveElement($moveEl);\n\t\tthis.$temp = $moveEl;\n\t\tthis._lockTemp();\n\t},\n\n\t/**\n\t * It make item element seems to be locked.\n\t * @private\n\t */\n\t_lockTemp: function() {\n\t\tvar group = this._getGroup(this.$temp),\n\t\t\titem = group.list[this.$temp.attr('data-index')];\n\t\tthis.$temp.css('opacity', '0.2');\n\t\tthis.$temp.find('#' + item.contentId).css('visibility', 'hidden');\n\t},\n\n\t/**\n\t * It make item element seems to be unlocked.\n\t * @private\n\t */\n\t_unlockTemp: function() {\n\t\tvar group = this._getGroup(this.$temp),\n\t\t\titem = group.list[this.$temp.attr('data-index')];\n\t\tthis.$temp.css('opacity', '1');\n\t\tthis.$temp.find('#' + item.contentId).css('visibility', 'visible');\n\t},\n\n\t/**\n\t * Mouse move handler\n\t * @param {JqueryEvent} e JqueryEvent object\n\t * @private\n\t */\n\t_onMouseMove: function(e) {\n\n\t\tvar parent, $doc, pointX, pointY, group;\n\n\t\tparent = $(e.target).parent();\n\t\t$doc = $(document);\n\t\tpointX = e.clientX + $doc.scrollLeft();\n\t\tpointY = e.clientY + $doc.scrollTop();\n\t\tgroup = parent.attr('data-group');\n\n\t\tthis._setScrollState(pointX, pointY);\n\t\tthis._moveGuide(pointX, pointY);\n\n\t\tif (group) {\n\t\t\tthis._detectMove(parent, pointX, pointY);\n\t\t}\n\t},\n\n\t/**\n\t * If element move over area, scroll move to show element\n\t * @private\n\t */\n\t_setScrollState: function(x, y) {\n\t\tvar $doc = $(document),\n\t\t\t$win = $(window),\n\t\t\tdocHeight = this.height(),\n\t\t\theight = $win.height(),\n\t\t\ttop = $doc.scrollTop(),\n\t\t\tlimit = docHeight - height;\n\n\t\tif (height + top &lt; y) {\n\t\t\t$doc.scrollTop(Math.min(top + (y - height + top), limit));\n\t\t}\n\t},\n\n\t/**\n\t * Save document height or return height\n\t * @param {number} [height] The height value to save _height feild\n\t */\n\theight: function(height) {\n\t\tif (ne.util.isUndefined(height)) {\n\t\t\treturn this._height;\n\t\t} else {\n\t\t\tthis._height = height;\n\t\t}\n\t},\n\t/**\n\t * Detect move with group\n\t * @param {object} item compare position with\n\t * @param {number} pointX The position x will be detect which element selected.\n\t * @param {number} pointY The position y will be detect which element selected.\n\t * @private\n\t */\n\t_detectMove: function(item, pointX, pointY) {\n\t\tvar $doc = $(document),\n\t\t\tgroupInst = this._getGroup(item),\n\t\t\tgroup = item.attr('data-group'),\n\t\t\t$before,\n\t\t\ttop = $doc.scrollTop(),\n\t\t\tleft = $doc.scrollLeft();\n\n\t\tif (ne.util.isEmpty(groupInst.list)) {\n\t\t\titem.append(this.$temp);\n\t\t\tthis.height($doc.height());\n\t\t\tthis.$temp.way = 'after';\n\t\t\tthis.$temp.index = 0;\n\t\t} else {\n\t\t\t$before = this._detectTargetByPosition({\n\t\t\t\tx: pointX + left,\n\t\t\t\ty: pointY + top\n\t\t\t}, groupInst);\n\n\t\t\tif ($before &amp;&amp; $before.way) {\n\t\t\t\t$before[$before.way](this.$temp);\n\t\t\t\tthis.height($doc.height());\n\t\t\t\tthis.$temp.way = $before.way;\n\t\t\t\tthis.$temp.index = $before.attr('data-index');\n\t\t\t}\n\t\t}\n\t},\n\n\t/**\n\t * Move helper object\n\t * @param {number} x move position x\n\t * @param {number} y move position y\n\t * @private\n\t */\n\t_moveGuide: function(x, y) {\n\t\tthis._guide.moveTo({\n\t\t\tx: x + 10 + 'px',\n\t\t\ty: y + 10 + 'px'\n\t\t});\n\t},\n\n\t/**\n\t * Detect target by move element position\n\t * @param {object} pos The position to detect\n\t * @param {object} group The group that has child items\n\t * @returns {string|*}\n\t * @private\n\t */\n\t_detectTargetByPosition: function(pos, group) {\n\t\tvar target;\n\n\t\tne.util.forEach(group.list, function(item) {\n\t\t\tif (!this._isValidItem(item)) {\n\t\t\t\treturn;\n\t\t\t}\n\t\t\ttarget = this._getTarget(item, pos, group) || target;\n\t\t}, this);\n\n\t\treturn target;\n\t},\n\n\t/**\n\t * Get target element\n\t * @param {object} item The item to compare with pos\n\t * @param {object} pos The pos to figure whether target or not\n\t * @param {object} group The group has item\n\t * @private\n\t */\n\t_getTarget: function(item, pos, group) {\n\t\tvar bound = item.$element.offset(),\n\t\t\tbottom = this._getBottom(item, group),\n\t\t\theight = item.$element.height(),\n\t\t\ttop = $(document).scrollTop() + bound.top,\n\t\t\t$target;\n\t\tif (pos.y > top &amp;&amp; pos.y &lt;= top + (height / 2)) {\n\t\t\t$target = item.$element;\n\t\t\t$target.way = 'before';\n\t\t} else if (pos.y > top + (height / 2) &amp;&amp; pos.y &lt; bottom) {\n\t\t\t$target = item.$element;\n\t\t\t$target.way = 'after';\n\t\t}\n\n\t\treturn $target;\n\t},\n\n\t/**\n\t * Check whether Vaild item or not\n\t * @param {param} item The item To be compared with temp.\n\t * @returns {boolean}\n\t * @private\n\t */\n\t_isValidItem: function(item) {\n\t\treturn (item.$element[0] !== this.$temp[0]);\n\t},\n\n\t/**\n\t * If next element exist, set bottom next element's top position, else set bottom limit(group element's bottom position) position\n\t * @param {object} item The object to figure bottom position\n\t * @param {object} group The group to figure bottom position\n\t * @returns {*}\n\t * @private\n\t */\n\t_getBottom: function(item, group) {\n\t\tvar $next = item.$element.next(),\n\t\t\tbottom,\n\t\t\t$doc = $(document),\n\t\t\tgbound = group.$element.offset(),\n\t\t\tlimit = $doc.scrollTop() + gbound.top + group.$element.height();\n\t\tif ($next.hasClass(DIMMED_LAYER_CLASS)) {\n\t\t\tbottom = limit;\n\t\t} else {\n\t\t\tbottom = $doc.scrollTop() + $next.offset().top;\n\t\t}\n\t\treturn bottom;\n\t},\n\n\t/**\n\t * Get add index by $temp, $temp.way\n\t * @returns {Number}\n\t * @private\n\t */\n\t_getAddIndex: function() {\n\t\tvar temp = this.$temp,\n\t\t\tindex = parseInt(temp.index, 10);\n\t\tif (temp.way === 'after') {\n\t\t\tindex += 1;\n\t\t}\n\t\treturn index;\n\t},\n\n\t/**\n\t * Mouse up handler\n\t * @param {JqueryEvent} e A event object\n\t * @private\n\t */\n\t_onMouseUp: function(e) {\n\t\tvar drag = this._guide,\n\t\t\t$doc = $(document),\n\t\t\tgroup = this._getGroup(this.$temp.attr('data-groupInfo')),\n\t\t\t$target = this._detectTargetByPosition({\n\t\t\t\tx: e.clientX + $doc.scrollLeft(),\n\t\t\t\ty: e.clientY + $doc.scrollTop()\n\t\t\t}, group);\n\n\t\tthis._update();\n\t\tthis._unlockTemp();\n\t\tdrag.finish();\n\n\t\t$doc.off('mousemove', this.onMouseMove);\n\t\t$doc.off('mouseup', this.onMouseUp);\n\t},\n\n\t/**\n\t * Update groups\n\t * @private\n\t */\n\t_update: function() {\n\t\tvar temp = this.$temp,\n\t\t\toldGroup = this._getGroup(temp.attr('data-groupInfo')),\n\t\t\ttargetGroup = this._getGroup(temp.parent()),\n\t\t\tremoveIndex = parseInt(temp.attr('data-index'), 10),\n\t\t\taddIndex = this._getAddIndex(),\n\t\t\titem = oldGroup.list[removeIndex];\n\n\t\tif (!isNaN(addIndex)) {\n\t\t\toldGroup.storePool();\n\t\t\ttargetGroup.storePool();\n\t\t\toldGroup.remove(removeIndex);\n\t\t\ttargetGroup.add(item, addIndex);\n\t\t\ttargetGroup.render();\n\t\t\toldGroup.render();\n\t\t}\n\t}\n});</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"