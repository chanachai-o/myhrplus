

var OrgChart = function (element, config) {
    var that = this;

    if ((typeof element === 'string' || element instanceof String)){
        element = document.querySelector(element);
    }
    this.element = element;
    this.config = OrgChart.mergeDeep(OrgChart._defaultConfig(config), config);

    this._layoutConfigs = {
        base: {
            orientation: this.config.orientation,
            levelSeparation: this.config.levelSeparation,
            mixedHierarchyNodesSeparation: this.config.mixedHierarchyNodesSeparation,
            assistantSeparation: this.config.assistantSeparation,
            subtreeSeparation: this.config.subtreeSeparation,
            siblingSeparation: this.config.siblingSeparation,
            layout: this.config.layout,
            columns: this.config.columns,
            collapse: this.config.collapse,
            partnerNodeSeparation: this.config.partnerNodeSeparation
        }
    };

    if (this.config.tags){
        for(var tagName in this.config.tags){
            var tag = this.config.tags[tagName];
            if (tag.subTreeConfig != undefined){
                    this._layoutConfigs[tagName] = {
                        orientation: tag.subTreeConfig.orientation != undefined ? tag.subTreeConfig.orientation : this.config.orientation,
                        levelSeparation: tag.subTreeConfig.levelSeparation != undefined ? tag.subTreeConfig.levelSeparation : this.config.levelSeparation,
                        mixedHierarchyNodesSeparation: tag.subTreeConfig.mixedHierarchyNodesSeparation != undefined ? tag.subTreeConfig.mixedHierarchyNodesSeparation : this.config.mixedHierarchyNodesSeparation,
                        assistantSeparation: tag.subTreeConfig.assistantSeparation != undefined ? tag.subTreeConfig.assistantSeparation : this.config.assistantSeparation,
                        subtreeSeparation: tag.subTreeConfig.subtreeSeparation != undefined ? tag.subTreeConfig.subtreeSeparation : this.config.subtreeSeparation,
                        siblingSeparation: tag.subTreeConfig.siblingSeparation != undefined ? tag.subTreeConfig.siblingSeparation : this.config.siblingSeparation,
                        layout: tag.subTreeConfig.layout != undefined ? tag.subTreeConfig.layout : this.config.layout,
                        columns: tag.subTreeConfig.columns != undefined ? tag.subTreeConfig.columns : this.config.columns,
                        collapse: tag.subTreeConfig.collapse != undefined ? tag.subTreeConfig.collapse : this.config.collapse,
                        partnerNodeSeparation: tag.subTreeConfig.partnerNodeSeparation != undefined ? tag.subTreeConfig.partnerNodeSeparation : this.config.partnerNodeSeparation,
                    }
                }
        }
    }

    this._event_id = OrgChart._guid();


    if (!this.config.searchFields.length){
        if (this.config.nodeBinding){
            for(var name in this.config.nodeBinding){
                if (name.indexOf('img')  == -1 && typeof(this.config.nodeBinding[name]) != 'function'){
                    this.config.searchFields.push(this.config.nodeBinding[name]);
                }
            }
        }
    }

    if (!OrgChart._validateConfig(this.config)) {
        return;
    }

    this._vScroll = {};

    if (!this.config.ui) {
        this.ui = OrgChart.ui;
    }

    if (!this.config.editUI) {
        this.editUI = new OrgChart.editUI();
    }
    else {
        this.editUI = this.config.editUI;
    }
    this.editUI.init(this);

    if (!this.config.filterUI) {
        this.filterUI = new OrgChart.filterUI();
    }
    else {
        this.filterUI = this.config.filterUI;
    }
    this.filterUI.init(this);


    this.manager = new OrgChart.manager(this);


    if (!this.config.searchUI) {
        this.searchUI = new OrgChart.searchUI();
    }
    else {
        this.searchUI = this.config.searchUI;
    }

    if (!this.config.nodeMenuUI) {
        this.nodeMenuUI = new OrgChart.menuUI();
    }
    else {
        this.nodeMenuUI = this.config.nodeMenuUI;
    }
    this.nodeMenuUI.init(this, this.config.nodeMenu);

    if (!this.config.nodeCircleMenuUI) {
        this.nodeCircleMenuUI = new OrgChart.circleMenuUI();
    }
    else {
        this.nodeCircleMenuUI = this.config.nodeCircleMenuUI;
    }
    this.nodeCircleMenuUI.init(this, this.config.nodeCircleMenu);

    if (!this.config.nodeContextMenuUI) {
        this.nodeContextMenuUI = new OrgChart.menuUI();
    }
    else {
        this.nodeContextMenuUI = this.config.nodeContextMenuUI;
    }
    this.nodeContextMenuUI.init(this, this.config.nodeContextMenu);


    if (!this.config.toolbarUI) {
        this.toolbarUI = new OrgChart.toolbarUI();
    }
    else {
        this.toolbarUI = this.config.toolbarUI;
    }


    if (!this.config.notifierUI) {
        this.notifierUI = new OrgChart.notifierUI();
    }
    else {
        this.notifierUI = this.config.notifierUI;
    }
    this.notifierUI.init(this);


    if (!this.config.menuUI) {
        this.menuUI = new OrgChart.menuUI();
    }
    else {
        this.menuUI = this.config.menuUI;
    }
    this.menuUI.init(this, this.config.menu);

    if (!this.config.xScrollUI) {
        this.xScrollUI = new OrgChart.xScrollUI(this.element, this.config, function () {
            return {
                boundary: that.response.boundary,
                scale: that.getScale(),
                viewBox: that.getViewBox(),
                padding: that.config.padding
            }
        }, function (viewBox) {
                that.setViewBox(viewBox);
            }, function () {
                that._draw(true, OrgChart.action.xScroll);
            });
    }

    if (!this.config.yScrollUI) {
        this.yScrollUI = new OrgChart.yScrollUI(this.element, this.config, function () {
            return {
                boundary: that.response.boundary,
                scale: that.getScale(),
                viewBox: that.getViewBox(),
                padding: that.config.padding
            }
        }, function (viewBox) {
            that.setViewBox(viewBox);
        }, function () {
            that._draw(true, OrgChart.action.xScroll);
        });
    }
    this.element.classList.add("boc-" + this.config.mode);

    this._gragStartedId = null;
    this._timeout = null;
    this._touch = null;
    this._initialized = false;
    this._loaded = false;
    this._moveInterval = null;
    this._movePosition = null;
    this.response = null;
    this.nodes = null;
    this.isVisible = null;


    OrgChart._intersectionObserver(this.element, function(visible){
        that.isVisible = visible;
        var result = OrgChart.events.publish('visibility-change', [that]);
        if (result === false){
            return;
        }

        if (OrgChart.LAZY_LOADING && that.isVisible){
            if (!that._loaded){
                that._setInitialSizeIfNotSet();
                that._draw(false, OrgChart.action.init);
            }
            else{
                that._draw(false, OrgChart.action.update);
            }
        }
    });

    // if (this.config.nodes.length > 0){
    //     this._draw(false, OrgChart.action.init);
    // }
};

OrgChart._defaultConfig = function(config){
    return {
        interactive: true,
        mode: 'light',
        lazyLoading: true,
        enableDragDrop: false,
        enableSearch: true,
        enableTouch: false,
        enableKeyNavigation: false,
        miniMap: false,
        nodeMenu: null,
        nodeCircleMenu: null,
        nodeContextMenu: null,
        menu: null,
        toolbar: false,
        sticky: true,
        nodeMouseClick: OrgChart.action.details,
        nodeMouseDbClick: OrgChart.none,
        mouseScrool: OrgChart.action.zoom,
        showXScroll: OrgChart.none,
        showYScroll: OrgChart.none,
        template: "ana",
        tags: {},
        min: false,
        nodeBinding: {},
        linkBinding: {},
        searchFields: [],
        searchDisplayField: null,
        searchFieldsWeight: null,
        nodes: [],
        clinks: [],
        slinks: [],
        levelSeparation: 60,
        siblingSeparation: 20,
        subtreeSeparation: 40,
        mixedHierarchyNodesSeparation: 15,
        assistantSeparation: 100,
        minPartnerSeparation: 50,
        partnerChildrenSplitSeparation: 20,
        partnerNodeSeparation: 15,
        columns: 10,
        padding: 30,
        orientation: OrgChart.orientation.top,
        layout: OrgChart.normal,
        scaleInitial: 1,
        scaleMin: 0.1,
        scaleMax: 5,
        orderBy: null,
        editUI: null,
        filterUI: null,
        searchUI: null,
        xScrollUI: null,
        yScrollUI: null,
        nodeMenuUI: null,
        nodeCircleMenuUI: null,
        nodeContextMenuUI: null,
        toolbarUI: null,
        notifierUI: null,
        menuUI: null,
        exportUrl: "https://balkan.app/export",
        collapse: {},
        expand: {},
        align: OrgChart.CENTER,
        UI: null,
        anim: {
            func: OrgChart.anim.outPow,
            duration: 200
        },
        zoom: {
            speed: 120,
            smooth: 12
        },
        roots: null,
        state: null,
        editForm: {
            readOnly: false,
            titleBinding: 'name',
            photoBinding: 'img',
            addMore: 'Add more fileds',
            addMoreBtn: 'Add',
            addMoreFieldName: 'Field name',
            saveAndCloseBtn: 'Save and close',
            cancelBtn: 'Cancel',
            generateElementsFromFields: true,
            focusBinding: null,
            buttons:  {
                edit: {
                    icon: OrgChart.icon.edit(24,24,'#fff'),
                    text: 'Edit',
                    hideIfEditMode: true,
                    hideIfDetailsMode: false
                },
                share: {
                    icon: OrgChart.icon.share(24,24,'#fff'),
                    text: 'Share'
                },
                pdf: {
                    icon: OrgChart.icon.pdf(24,24,'#fff'),
                    text: 'Save as PDF'
                },
                remove: {
                    icon: OrgChart.icon.remove(24,24,'#fff'),
                    text: 'Remove',
                    hideIfDetailsMode: true
                }
            },
            // elementBinding: {
            //     name: { type: 'textbox', label: 'Full Name' },

            //     group: {
            //         "phone": {}
            //     }
            // },
            elements: []
            // elements: [
            //     { type: 'textbox', label: 'Full Name', binding: 'name'},
            //     { type: 'textbox', label: 'Job Title', binding: 'title'},
            //     { type: 'textbox', label: 'Email Address', binding: 'email', vlidators: {required: 'Is required', email: 'Invalid email'}},
            //     [
            //         { type: 'textbox', label: 'Phone', binding: 'phone'},
            //         { type: 'date', label: 'Satrted On', binding: 'sdate' }
            //     ],
            //     [
            //         { type: 'select', options: [{value: 'bg', text: 'Bulgaria'},{value: 'ru', text: 'Russia'},{value: 'gr', text: 'Greece'}], label: 'Country', binding: 'country' },
            //         { type: 'textbox', label: 'City', binding: 'city' },
            //     ],
            //     { type: 'textbox', label: 'Photo', binding: 'photo', btn: 'Upload' }
            // ]
        }
    };
};


OrgChart.prototype.load = function(data){
    this.config.nodes = data;
    this._draw(false, OrgChart.action.init);
    return this;
};

OrgChart.prototype.loadXML = function (xml) {
    var nodes = OrgChart._xml2json(xml);
    return this.load(nodes);
};

OrgChart.prototype.getXML = function () {
    return OrgChart._json2xml(this.config.nodes);
};

OrgChart.prototype.on = function(type, callback){
    OrgChart.events.on(type, callback, this._event_id);
    return this;
};

OrgChart.prototype.draw = function (action, actionParams, callback) {
    if (action == undefined) {
        action = OrgChart.action.update;
    }
    this._draw(false, action, actionParams, callback)
};


OrgChart.prototype._draw = function (readFromCache, action, actionParams, callback) {
    var that = this;
    if (OrgChart.LAZY_LOADING && !this.isVisible){
        return;
    }
    else if (!OrgChart.LAZY_LOADING && !this._initialized){
        this._setInitialSizeIfNotSet();

        if (this.width() == 0 || this.height() == 0){
            console.error('Cannot load the chart with size 0! If you are using the OrgChart within tabs set OrgChart.LAZY_LOADING to true! ');
            return;
        }
    }
    this._hideBeforeAnimationCompleted = false;
    var vb = (action == OrgChart.action.init) ? null : this.getViewBox();
    this.manager.read(readFromCache, this.width(), this.height(), vb, action, actionParams, function(response){
        if (that.notifierUI.show(response.notif)){
            return;
        }

        if (action != OrgChart.action.exporting){
            that.nodes = response.nodes;
            that.visibleNodeIds = response.visibleNodeIds;
            that.roots = response.roots;
        }

        that.editUI.fields = response.allFields;
        var args = {
            defs: ''
        }
        OrgChart.events.publish('renderdefs', [that, args]);

        var content = that.ui.defs(args.defs);
        var newScale = that.getScale(response.viewBox);
        content += that.ui.pointer(that.config, action, newScale);


        var prevViewBox = that.getViewBox();
        var viewBox = response.viewBox;

        // if (!that._initialized) {
        //     that.element.innerHTML = '<div id="boc-tests"></div>';
        // }

        var args = {content: content, res: response};
        OrgChart.events.publish('prerender', [that, args]);
        content = args.content;

        for (var i = 0; i < response.visibleNodeIds.length; i++) {
            var node = response.nodes[response.visibleNodeIds[i]];
            var data = that._get(node.id);

            if (OrgChart.RENDER_LINKS_BEFORE_NODES){
                content += that.ui.link(node, that, newScale, response.bordersByRootIdAndLevel, response.nodes, action);
            }

            content += that.ui.node(node, data, response.animations, that.config, undefined, undefined, undefined, action, newScale, that);
        }

        for (var i = 0; i < response.visibleNodeIds.length; i++) {
            var node = response.nodes[response.visibleNodeIds[i]];

            if (!OrgChart.RENDER_LINKS_BEFORE_NODES){
                content += that.ui.link(node, that, newScale, response.bordersByRootIdAndLevel, response.nodes, action);
            }
            content += that.ui.expandCollapseBtn(that, node, that._layoutConfigs, action, newScale);
        }



        var args = {content: content, res: response};
        OrgChart.events.publish('render', [that, args]);
        content = args.content;
        response = args.res;

        content += that.ui.lonely(that.config);

        if (action === OrgChart.action.exporting){
            var b = response.boundary;
            var w = b.maxX - (b.minX);
            var h = b.maxY - (b.minY);
            var html = that.ui.svg(w, h, [b.minX, b.minY, w, h], that.config, content, newScale);
            callback(html);
            return;
        }

        if ((action === OrgChart.action.centerNode) || (action === OrgChart.action.insert) || (action === OrgChart.action.expand) || (action === OrgChart.action.collapse) || (action === OrgChart.action.update)){
            viewBox = prevViewBox;
        }

        if (action === OrgChart.action.init && prevViewBox != null) {
            viewBox = prevViewBox;
        }

        that.response = response;

        var html = that.ui.svg(that.width(), that.height(), viewBox, that.config, content);

        if (!that._initialized) {
            that.element.innerHTML = that.ui.css() +  html + that.ui.menuButton(that.config);
            that._attachInitEventHandlers();
            that._attachEventHandlers();

            that.xScrollUI.create(that.width(), that.config.padding);
            that.xScrollUI.setPosition();
            that.xScrollUI.addListener(that.getSvg());

            that.yScrollUI.create(that.height(), that.config.padding);
            that.yScrollUI.setPosition();
            that.yScrollUI.addListener(that.getSvg());

            if (that.config.enableSearch) {
                that.searchUI.init(that);
            }

            that.toolbarUI.init(that, that.config.toolbar);

            // var div = document.createElement("div");
            // div.setAttribute("id", "boc-tests");
            // that.element.appendChild(div);
        }
        else {
            var svg = that.getSvg();
            var parentNode = svg.parentNode;
            parentNode.removeChild(svg);
            parentNode.insertAdjacentHTML("afterbegin", html);

            that._attachEventHandlers();
            that.xScrollUI.addListener(that.getSvg());
            that.yScrollUI.addListener(that.getSvg());
            that.xScrollUI.setPosition();
            that.yScrollUI.setPosition();
        }

        var callbackCalled = false;



        var anims = that.response.animations;
        if (anims[0].length > 0) {//should animation
            that._hideBeforeAnimation(anims[0].length);
            for (var i = 0; i < anims[0].length; i++) {
                anims[0][i] = that.getNodeElement(anims[0][i]);
            }

            OrgChart.animate(anims[0], anims[1], anims[2], that.config.anim.duration, that.config.anim.func, function () {

                if (!callbackCalled) {
                    if (callback) {
                        callback();
                    }
                    OrgChart.events.publish('redraw', [that]);
                    that._showAfterAnimation();
                    callbackCalled = true;
                }
            });
        }
        if (action === OrgChart.action.centerNode) {
            OrgChart.animate(that.getSvg(),
                { viewbox: prevViewBox },
                { viewbox: that.response.viewBox },
                that.config.anim.duration,
                that.config.anim.func, function () {
                    that.ripple(actionParams.options.rippleId);
                    if (!callbackCalled) {
                        if (callback) {
                            callback();
                        }
                        OrgChart.events.publish('redraw', [that]);
                        that._showAfterAnimation();
                        callbackCalled = true;
                    }
                }, function () {
                    that.xScrollUI.setPosition();
                    that.yScrollUI.setPosition();
                });
        }
        else if (prevViewBox && that.response && (prevViewBox[0] != that.response.viewBox[0] || prevViewBox[1] != that.response.viewBox[1] || prevViewBox[2] != that.response.viewBox[2] || prevViewBox[3] != that.response.viewBox[3]) && (action === OrgChart.action.insert || action === OrgChart.action.expand || action === OrgChart.action.collapse || action === OrgChart.action.update || action === OrgChart.action.init)) {

            OrgChart.animate(that.getSvg(),
                { viewbox: prevViewBox },
                { viewbox: that.response.viewBox },
                that.config.anim.duration * 2,
                that.config.anim.func, function () {
                    that.xScrollUI.setPosition();
                    that.yScrollUI.setPosition();
                    if (!callbackCalled) {
                        if (callback) {
                            callback();
                        }
                        OrgChart.events.publish('redraw', [that]);
                        callbackCalled = true;
                    }
                });
        }
        else if (anims[0].length == 0) {
            if (!callbackCalled) {
                if (callback) {
                    callback();
                }
                OrgChart.events.publish('redraw', [that]);
                callbackCalled = true;
            }
        }

        if (!that._initialized){
            that._initialized = true;
            that.filterUI.update();
            OrgChart.events.publish('init', [that]);
        }

        if (!that._loaded && response && response.nodes && Object.keys(response.nodes).length ){
            that._loaded = true;
        }

    }, function(tree){
        OrgChart.events.publish('ready', [that, tree]);
    });
};

OrgChart.prototype._setInitialSizeIfNotSet = function () {
    this.element.style.overflow = "hidden";
    this.element.style.position = "relative";

    if (this.element.offsetHeight == 0) {
        this.element.style.height = "100%";
        if (this.element.offsetHeight == 0) {
            this.element.style.height = "700px";
        }
    }

    if (this.element.offsetWidth == 0) {
        this.element.style.width = "100%";
        if (this.element.offsetWidth == 0) {
            this.element.style.width = "700px";
        }
    }
};


OrgChart.prototype.width = function () {
    return this.element.offsetWidth;
};

OrgChart.prototype.height = function () {
    return this.element.offsetHeight;
};


OrgChart.prototype.getViewBox = function () {
    var svg = this.getSvg();
    return OrgChart._getViewBox(svg);
};

OrgChart.prototype.setViewBox = function (viewBox) {
    this.getSvg().setAttribute("viewBox", viewBox.toString());
};


OrgChart.prototype.getScale = function (viewBox) {
    if (!viewBox) {
        viewBox = this.getViewBox();
    }

    return OrgChart.getScale(viewBox, this.width(), this.height(), this.config.scaleInitial, this.config.scaleMax, this.config.scaleMin);
};

OrgChart.prototype.ripple = function (id, clientX, clientY) {
    var node = this.getNode(id);
    if (node == null) {
        return;
    }
    var nodeElement = this.getNodeElement(id);
    if (nodeElement == null) {
        return;
    }

    var scale = this.getScale();

    var x = node.w / 2;
    var y = node.h / 2;

    if (clientX !== undefined && clientY !== undefined) {
        var rect = nodeElement.getBoundingClientRect();
        x = clientX / scale - (rect.left) / scale;
        y = clientY / scale - (rect.top) / scale;
    }

    var w = node.w;
    var h = node.h;

    var dx = (w - x) > x ? (w - x) : x;
    var dy = (h - y) > y ? (h - y) : y;

    dx = dx;
    dy = dy;
    var radius = dx > dy ? dx : dy;

    var rGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    var rClipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
    var rRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    var rCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

    var rId = OrgChart.randomId();
    rClipPath.setAttribute("id", rId);

    var t = OrgChart.t(node.templateName, node.min, this.getScale());
    var args = {
        ripple: t.ripple,
        node: node
    };
    OrgChart.events.publish('ripple', [this, args]);

    rRect.setAttribute("x", args.ripple.rect ? args.ripple.rect.x : 0);
    rRect.setAttribute("y", args.ripple.rect ? args.ripple.rect.y : 0);
    rRect.setAttribute("width", args.ripple.rect ? args.ripple.rect.width : node.w);
    rRect.setAttribute("height", args.ripple.rect ? args.ripple.rect.height : node.h);
    rRect.setAttribute("rx", args.ripple.radius);
    rRect.setAttribute("ry", args.ripple.radius);

    rCircle.setAttribute("clip-path", "url(#" + rId + ")");
    rCircle.setAttribute("cx", x);
    rCircle.setAttribute("cy", y);
    rCircle.setAttribute("r", 0);
    rCircle.setAttribute("fill", args.ripple.color);
    rCircle.setAttribute("class", "boc-ripple");

    rClipPath.appendChild(rRect);
    rGroup.appendChild(rClipPath);
    rGroup.appendChild(rCircle);

    nodeElement.appendChild(rGroup);

    OrgChart.animate(rCircle,
        { r: 0, opacity: 1 },
        { r: radius, opacity: 0 },
        500,
        OrgChart.anim.outPow, function () {
            nodeElement.removeChild(rGroup);
        });
};

OrgChart.prototype.center = function (nodeId, options, callback) {
    var parentState;
    var childrenState;
    var rippleId = nodeId;
    var vertical = true;
    var horizontal = true;

    if (options && options.parentState != undefined){
        parentState = options.parentState;
    }

    if (options && options.childrenState != undefined){
        childrenState = options.childrenState;
    }

    if (options && options.rippleId != undefined){
        rippleId = options.rippleId;
    }

    if (options && options.vertical != undefined){
        vertical = options.vertical;
    }

    if (options && options.horizontal != undefined){
        horizontal = options.horizontal;
    }
    var opt = {
        parentState: parentState,
        childrenState: childrenState,
        rippleId: rippleId,
        vertical: vertical,
        horizontal: horizontal
    }
    this._draw(false, OrgChart.action.centerNode, { id: nodeId, options: opt}, callback)
};

OrgChart.prototype.fit = function (callback) {
    this.config.scaleInitial = OrgChart.match.boundary;
    this._draw(true, OrgChart.action.init, {method: 'fit'}, callback);
};

OrgChart.prototype.toggleFullScreen = function () {
    var fullBtnElement = document.querySelector("[" + OrgChart.attr.tlbr + "r='fullScreen']");
    if (document.fullscreenElement == this.element || /* Standard syntax */
        document.webkitFullscreenElement == this.element || /* Chrome, Safari and Opera syntax */
        document.mozFullScreenElement == this.element ||/* Firefox syntax */
        document.msFullscreenElement == this.element /* IE/Edge syntax */) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        else if (document.mozCancelFullScreen) { /* Firefox */
            document.mozCancelFullScreen();
        }
        else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
            document.webkitExitFullscreen();
        }
        else if (document.msExitFullscreen) { /* IE/Edge */
            document.msExitFullscreen();
        }

        if (fullBtnElement){
            fullBtnElement.innerHTML = OrgChart.toolbarUI.openFullScreenIcon;
        }
    }
    else {
        if (this.element.requestFullscreen) {
            this.element.requestFullscreen();
        }
        else if (this.element.mozRequestFullScreen) { /* Firefox */
            this.element.mozRequestFullScreen();
        }
        else if (this.element.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            this.element.webkitRequestFullscreen();
        }
        else if (this.element.msRequestFullscreen) { /* IE/Edge */
            this.element.msRequestFullscreen();
        }

        if (fullBtnElement){
            fullBtnElement.innerHTML = OrgChart.toolbarUI.closeFullScreenIcon;
        }
    }
};

OrgChart.prototype.getNode = function (nodeId) {
    return this.nodes[nodeId];
};


OrgChart.prototype.setLayout = function (layout, lcn) {
    if (!lcn){
        lcn = "base";
    }
    this._layoutConfigs[lcn].layout = layout;
    this._draw(false, OrgChart.action.update);
};

OrgChart.prototype.setOrientation = function (orientation, lcn) {
    if (!lcn){
        lcn = "base";
    }
    this._layoutConfigs[lcn].orientation = orientation;
    this._draw(false, OrgChart.action.update);
};

OrgChart.prototype.search = function (value, searchInFileds, retrieveFields) {
    if (OrgChart.isNEU(searchInFileds)){
        searchInFileds = this.config.searchFields;
    }
    if (OrgChart.isNEU(retrieveFields)){
        retrieveFields = searchInFileds;
    }

    return OrgChart._search.search(
        this.config.nodes,
        value,
        searchInFileds,
        retrieveFields,
        this.config.searchDisplayField,
        this.config.searchFieldsWeight
    );
};


OrgChart.prototype._hideBeforeAnimation = function (animLength) {
    if (this._hideBeforeAnimationCompleted == true) {
        return;
    }

    if (animLength && animLength < OrgChart.ANIM_THRESHOLD) {
        return;
    }

    var texts = this.element.getElementsByTagName("text");
    if (texts.length > OrgChart.TEXT_THRESHOLD) {
        for (var i = 0; i < texts.length; i++) {
            texts[i].style.display = "none";
        }
    }

    var images = this.element.getElementsByTagName("image");
    if (images.length > OrgChart.IMAGES_THRESHOLD) {
        for (var i = 0; i < images.length; i++) {
            images[i].style.display = "none";
        }
    }

    var links = this.element.querySelectorAll("[" + OrgChart.attr.link_id + "]");
    if (links.length > OrgChart.LINKS_THRESHOLD) {
        for (var i = 0; i < links.length; i++) {
            links[i].style.display = "none";
        }
    }

    var expcoll = this.element.querySelectorAll("[" + OrgChart.attr.control_expcoll_id + "]");
    if (expcoll.length > OrgChart.BUTTONS_THRESHOLD) {
        for (var i = 0; i < expcoll.length; i++) {
            expcoll[i].style.display = "none";
        }
    }

    var up = this.element.querySelectorAll("[" + OrgChart.attr.control_up_id + "]");
    if (up.length > OrgChart.BUTTONS_THRESHOLD) {
        for (var i = 0; i < up.length; i++) {
            up[i].style.display = "none";
        }
    }


    this._hideBeforeAnimationCompleted = true;
};


OrgChart.prototype._showAfterAnimation = function () {
    var texts = this.element.getElementsByTagName("text");
    for (var i = 0; i < texts.length; i++) {
        texts[i].style.display = "";
    }

    var images = this.element.getElementsByTagName("image");
    for (var i = 0; i < images.length; i++) {
        images[i].style.display = "";
    }

    var links = this.element.querySelectorAll("[" + OrgChart.attr.link_id + "]");
    for (var i = 0; i < links.length; i++) {
        links[i].style.display = "";
    }

    var expcoll = this.element.querySelectorAll("[" + OrgChart.attr.control_expcoll_id + "]");
    for (var i = 0; i < expcoll.length; i++) {
        expcoll[i].style.display = "";
    }

    var up = this.element.querySelectorAll("[" + OrgChart.attr.control_up_id + "]");
    for (var i = 0; i < up.length; i++) {
        up[i].style.display = "";
    }

    this._hideBeforeAnimationCompleted = false;
};

OrgChart.prototype.isChild = function (id, pid){
    var node = this.getNode(pid);

    while(node){
        if (node.id == id){
            return true;
        }
        if (node.parent){
            node = node.parent;
        }
        else{
            node = node.stParent;
        }
    }

    return false;
};



OrgChart.prototype.getCollapsedIds = function (node) {
    var collapsedChildrenIds = [];
    for(var i = 0; i <  node.childrenIds.length; i++){
        var cnode = this.getNode(node.childrenIds[i]);
        if (cnode.collapsed == true){
            collapsedChildrenIds.push(cnode.id);
        }
    }
    return collapsedChildrenIds;
};

OrgChart.prototype.stateToUrl = function () {
    if (this.manager.state){
        var state = {};
        state.exp = this.manager.state.exp.join('*'),
        state.min = this.manager.state.min.join('*'),
        state.adjustify = this.manager.state.adjustify.x + '*' + this.manager.state.adjustify.y;
        state.scale = this.manager.state.scale;
        state.y = this.manager.state.x;
        state.x = this.manager.state.y;

        return new URLSearchParams(state).toString();
    }
    return "";
};

OrgChart.prototype.generateId = function (){
    while (true) {
        var uid = '_' + ("0000" + ((Math.random() * Math.pow(36, 4)) | 0).toString(36)).slice(-4);
        if (!this.nodes.hasOwnProperty(uid)) {
            //this.nodes[uid] = {id: uid};
            return uid;
        }
    }
};

OrgChart.prototype._nodeHasHiddenParent = function (node) {
	return !node.parent && !OrgChart.isNEU(node.pid) && this.getNode(node.pid);
};

OrgChart.prototype.destroy = function (){
    this._removeEvent(window, "resize");
    OrgChart.events.removeForEventId(this._event_id);
    this.element.innerHTML = null;
};






OrgChart.sessionStorage = {};

OrgChart.sessionStorage.getItem = function (name) {
    var to_date = sessionStorage.getItem('to_date');
    if (!to_date){
        to_date = new Date();
        to_date.setDate(to_date.getDate() + 5);
        to_date = to_date.toISOString();
        sessionStorage.setItem('to_date', to_date);
    }
    else{
        to_date = new Date(to_date);
        if (to_date < new Date()){
            for (var i = 0, len = sessionStorage.length; i < len; ++i) {
                var key = sessionStorage.key(i);

                if (key && key.startsWith && key.startsWith('{"n"')) {
                    sessionStorage.removeItem(key);
                }
            }
            sessionStorage.removeItem('to_date');
        }
    }

    return sessionStorage.getItem(name);
};

OrgChart.sessionStorage.setItem = function (name, val) {
    try {
        sessionStorage.setItem(name, val);
    }
    catch (e) {
        if (e.code == e.QUOTA_EXCEEDED_ERR) {
            console.warn('Local storage quota exceeded')
            sessionStorage.clear();
        }
        else {
            console.error('Local storage error code:' + e.code);
            console.error(e);
        }
    }
};


OrgChart.prototype.canUpdateLink = function (id, pid) {
    if (pid == undefined || pid == null) {
        return false;
    }

    if (id == undefined || id == null) {
        return false;
    }

    if (id == pid) {
        return false;
    }

    var pnode = this.getNode(pid);
    var node = this.getNode(id);
    if (pnode && node){
        if (pnode.isPartner
            || (pnode.hasPartners && node.isAssistant)
            || (pnode.hasAssistants && node.isPartner)){
            return false;
        }
    }

    var isChild = this.isChild(id, pid);
    return !isChild;
};

OrgChart.prototype._canUpdateLink = OrgChart.prototype.canUpdateLink;

OrgChart.prototype.updateNode = function (data, callback, fireEvent) {
    var that = this;

    var oldData = this.get(data.id);

    if (fireEvent === true) {
        var result = OrgChart.events.publish('update', [this, oldData, data]);
        if (result === false) {
            return false;
        }
    }

    this.update(data);


    var node = this.getNode(data.id);
    //#275 we nned pid of the node not pid of the data, in some cases they are different, see #275 for  more use cases
    var pid = node.pid;
    if (pid == null) {
        pid = node.stpid;
    }

    this._draw(false, OrgChart.action.update, { id: pid }, function () {
        that.ripple(data.id);
        if (callback){
            callback();
        };
        OrgChart.events.publish('updated', [that, oldData, data]);
        that.filterUI.update();
    });
};

OrgChart.prototype.update = function (newData) {
    for (var i = 0; i < this.config.nodes.length; i++) {
        if (this.config.nodes[i].id == newData.id) {
            this.config.nodes[i] = newData;
            break;
        }
    }
    return this;
};


OrgChart.prototype.removeNode = function (id, callback, fireEvent) {
    var that = this;
    if (!this.canRemove(id)){
        return false;
    }

    var newPidsAndStpidsForIds = this._getNewPidsAndStpidsForIds(id);

    if (fireEvent === true) {
        var result = OrgChart.events.publish('remove', [this, id, newPidsAndStpidsForIds]);
        if (result === false) {
            return false;
        }
    }

    this.remove(id);

    this._draw(false, OrgChart.action.update, null, function () {
        if (that.config.sticky){
            OrgChart._moveToBoundaryArea(that.getSvg(), that.getViewBox(), that.response.boundary);
        }
        if (callback){
            callback();
        }
        OrgChart.events.publish('removed', [that, id, newPidsAndStpidsForIds]);
        that.filterUI.update();
    });

    return true;
};

OrgChart.prototype.remove = function (id) {
    var data = this.get(id);

    if (data){
        for (var i = this.config.nodes.length - 1; i >= 0; i--) {
            if (this.config.nodes[i].pid == id || this.config.nodes[i].stpid == id){
                this.config.nodes[i].pid = data.pid;
                this.config.nodes[i].stpid = data.stpid;
            }
            if (this.config.nodes[i].id == id) {
                this.config.nodes.splice(i, 1);
            }
        }
    }

    return this;
};


OrgChart.prototype._getNewPidsAndStpidsForIds = function (id) {
    var data = this.get(id);

    var newPidsForIds = {};
    var newStpidsForIds = {};
    if (data){
        for (var i = this.config.nodes.length - 1; i >= 0; i--) {
            if (this.config.nodes[i].pid == id){
                newPidsForIds[this.config.nodes[i].id] = data.pid;
            }
            else if (this.config.nodes[i].stpid == id){
                newStpidsForIds[this.config.nodes[i].id] = data.stpid;
            }
        }
    }

    return {
        newPidsForIds: newPidsForIds,
        newStpidsForIds: newStpidsForIds
    };
};

OrgChart.prototype.addNode = function (data, callback, fireEvent) {
    var that = this;
    if (fireEvent === true) {
        var result = OrgChart.events.publish('add', [this, data]);
        if (result === false) {
            return false;
        }
    }

    this.add(data);

    that._draw(false, OrgChart.action.insert, { id: data.pid, insertedNodeId: data.id }, function(){
        that.ripple(data.id);
        if (callback){
            callback();
        }
        OrgChart.events.publish('added', [that, data.id]);
        that.filterUI.update();
    });
    OrgChart.events.publish('adding', [that, data.id]);

};

OrgChart.prototype.add = function (data) {
    if (data.id == undefined) {
        console.error("Call addNode without id");
    }

    this.config.nodes.push(data);

    return this;
};

OrgChart.prototype._get = function (id) {
    for (var i = 0; i < this.config.nodes.length; i++) {
        if (this.config.nodes[i].id == id) {
            return this.config.nodes[i];
        }
    }

    return null;
};

OrgChart.prototype.get = function (id) {
    for (var i = 0; i < this.config.nodes.length; i++) {
        if (this.config.nodes[i].id == id) {
            return JSON.parse(JSON.stringify(this.config.nodes[i]));
        }
    }

    return null;
};

OrgChart.prototype.canRemove = function (id) {
    var node = this.getNode(id);
    if (!node){
        return false;
    }

    if (node.hasPartners){
        return false;
    }


    if (node.hasAssistants){
        return false;
    }
    return true;
}
﻿if (typeof(OrgChart) == "undefined") {
    OrgChart = {};
}


OrgChart._ajax = function (url, verb, data, resType, callback) {
    if (resType == undefined){
        resType = "arraybuffer";
    }
    var xhr = new XMLHttpRequest();

    xhr.onload = function (evt) {
        //if (xhr.readyState == XMLHttpRequest.DONE) {
        if (xhr.readyState == 4) {
            if (this.status === 200) {
                if (evt.target == undefined){
                    callback(this.response);
                }
                else callback(evt.target.response);
            }
        }
    }

    xhr.onerror = function (error) {
        callback({error: error});
    }

    xhr.open(verb, url);
    xhr.responseType = resType;
    //xhr.withCredentials = true;
    xhr.setRequestHeader("Content-Type", "application/json");
    if (data == null) {
        xhr.send();
    }
    else {
        xhr.send(data);
    }
}

if (typeof(OrgChart) == "undefined") {
    OrgChart = {};
}

OrgChart.animate = function (_elements, attrStart, attrEnd, duration, func, callback, tick) {
    var delay = 10;
    var increment = 1;
    var repetitions = 1;
    var limit = duration / delay + 1;
    var timer;

    var g = document.getElementsByTagName("g");

    if (!Array.isArray(_elements)) {//check if it is not an array
        _elements = [_elements];
    }
    if (!Array.isArray(attrStart)) {//check if it is not an array
        attrStart = [attrStart];
    }
    if (!Array.isArray(attrEnd)) {//check if it is not an array
        attrEnd = [attrEnd];
    }

    function doAction() {
        for (var z3 = 0; z3 < _elements.length; z3++) {
            for (var n in attrEnd[z3]) {
                var pxFixDoctype = OrgChart._arrayContains(["top", "left", "right", "bottom", "width", "height"], n.toLowerCase()) ? "px" : "";
                switch (n.toLowerCase()) {
                    case "d":
                        var xVal = func(((repetitions * delay) - delay) / duration) * (attrEnd[z3][n][0] - attrStart[z3][n][0]) + attrStart[z3][n][0];
                        var yVal = func(((repetitions * delay) - delay) / duration) * (attrEnd[z3][n][1] - attrStart[z3][n][1]) + attrStart[z3][n][1];

                        _elements[z3].setAttribute("d", _elements[z3].getAttribute("d") + " L" + xVal + " " + yVal);
                        break;

                    case "r":
                        var val = func(((repetitions * delay) - delay) / duration) * (attrEnd[z3][n] - attrStart[z3][n]) + attrStart[z3][n];
                        _elements[z3].setAttribute("r", val);
                        break;

                    case "x1":
                        var val = func(((repetitions * delay) - delay) / duration) * (attrEnd[z3][n] - attrStart[z3][n]) + attrStart[z3][n];
                        _elements[z3].setAttribute("x1", val);
                        break;
                    case "x2":
                        var val = func(((repetitions * delay) - delay) / duration) * (attrEnd[z3][n] - attrStart[z3][n]) + attrStart[z3][n];
                        _elements[z3].setAttribute("x2", val);
                        break;
                    case "y1":
                        var val = func(((repetitions * delay) - delay) / duration) * (attrEnd[z3][n] - attrStart[z3][n]) + attrStart[z3][n];
                        _elements[z3].setAttribute("y1", val);
                        break;
                    case "y2":
                        var val = func(((repetitions * delay) - delay) / duration) * (attrEnd[z3][n] - attrStart[z3][n]) + attrStart[z3][n];
                        _elements[z3].setAttribute("y2", val);
                        break;

                    case "rotate3d":
                        if (attrEnd[z3][n]) {
                            var matrixStart = attrStart[z3][n];
                            var matrixEnd = attrEnd[z3][n];
                            var matrixTemp = [0, 0, 0, 0];
                            for (var i in matrixStart) {
                                matrixTemp[i] = func(((repetitions * delay) - delay) / duration) * (matrixEnd[i] - matrixStart[i]) + matrixStart[i];
                            }
                            _elements[z3].style.transform = 'rotate3d(' + matrixTemp.toString() + 'deg)';
                        }
                        break;

                    case "transform":
                        if (attrEnd[z3][n]) {
                            var matrixStart = attrStart[z3][n];
                            var matrixEnd = attrEnd[z3][n];
                            var matrixTemp = [0, 0, 0, 0, 0, 0];
                            for (var i in matrixStart) {
                                matrixTemp[i] = func(((repetitions * delay) - delay) / duration) * (matrixEnd[i] - matrixStart[i]) + matrixStart[i];
                            }

                            if (_elements[z3].hasAttribute('transform')){
                                _elements[z3].setAttribute("transform", "matrix(" + matrixTemp.toString() + ")");
                            }
                            else{
                                _elements[z3].style.transform = "matrix(" + matrixTemp.toString() + ")";
                            }
                        }
                        break;
                    case "viewbox":
                        if (attrEnd[z3][n]) {
                            var matrixStart = attrStart[z3][n];
                            var matrixEnd = attrEnd[z3][n];
                            var matrixTemp = [0, 0, 0, 0];
                            for (var i in matrixStart) {
                                matrixTemp[i] = func(((repetitions * delay) - delay) / duration) * (matrixEnd[i] - matrixStart[i]) + matrixStart[i];
                            }

                            //for (var z4 = 0; z4 < _elements.length; z4++) {
                            _elements[z3].setAttribute("viewBox", matrixTemp.toString());
                            //}
                        }
                        break;
                    case "margin":
                        if (attrEnd[z3][n]) {
                            var matrixStart = attrStart[z3][n];
                            var matrixEnd = attrEnd[z3][n];
                            var matrixTemp = [0, 0, 0, 0];

                            for (var i in matrixStart)
                                matrixTemp[i] = func(((repetitions * delay) - delay) / duration) * (matrixEnd[i] - matrixStart[i]) + matrixStart[i];

                            var margin = "";
                            for (var i = 0; i < matrixTemp.length; i++)
                                margin += parseInt(matrixTemp[i]) + "px ";


                            //for (var z5 = 0; z5 < _elements.length; z5++) {
                            if (_elements[z3] && _elements[z3].style) {
                                _elements[z3].style[n] = margin;
                                }
                            //}
                        }
                        break;
                    case "scrolly":
                            var val = func(((repetitions * delay) - delay) / duration) * (attrEnd[z3][n] - attrStart[z3][n]) + attrStart[z3][n];
                            _elements[z3].scrollTo(0, val);
                            break;
                    default:
                        var val = func(((repetitions * delay) - delay) / duration) * (attrEnd[z3][n] - attrStart[z3][n]) + attrStart[z3][n];
                        //for (var z6 = 0; z6 < _elements.length; z6++) {
                        if (_elements[z3] && _elements[z3].style) {
                            _elements[z3].style[n] = val + pxFixDoctype;
                            }
                        //}
                        break;
                }
            }
        }


        if (tick) {
            tick();
        }
        repetitions = repetitions + increment;
        if (repetitions > limit + 1) {
            clearInterval(timer);
            if (callback)
                callback(_elements);
        }
    }

    timer = setInterval(doAction, delay);
    return timer;
};

OrgChart.anim = {};

OrgChart.anim.inPow = function (x) {
    var p = 2;
    if (x < 0) return 0;
    if (x > 1) return 1;
    return Math.pow(x, p);
};

OrgChart.anim.outPow = function (x) {
    var p = 2;
    if (x < 0) return 0;
    if (x > 1) return 1;
    var sign = p % 2 === 0 ? -1 : 1;
    return (sign * (Math.pow(x - 1, p) + sign));
};

OrgChart.anim.inOutPow = function (x) {
    var p = 2;
    if (x < 0) return 0;
    if (x > 1) return 1;
    x *= 2;
    if (x < 1) return OrgChart.anim.inPow(x, p) / 2;
    var sign = p % 2 === 0 ? -1 : 1;
    return (sign / 2 * (Math.pow(x - 2, p) + sign * 2));
};

OrgChart.anim.inSin = function (x) {
    if (x < 0) return 0;
    if (x > 1) return 1;
    return -Math.cos(x * (Math.PI / 2)) + 1;
};

OrgChart.anim.outSin = function (x) {
    if (x < 0) return 0;
    if (x > 1) return 1;
    return Math.sin(x * (Math.PI / 2));
};

OrgChart.anim.inOutSin = function (x) {
    if (x < 0) return 0;
    if (x > 1) return 1;
    return -0.5 * (Math.cos(Math.PI * x) - 1);
};

OrgChart.anim.inExp = function (x) {
    if (x < 0) return 0;
    if (x > 1) return 1;
    return Math.pow(2, 10 * (x - 1));
};

OrgChart.anim.outExp = function (x) {
    if (x < 0) return 0;
    if (x > 1) return 1;
    return -Math.pow(2, -10 * x) + 1;
};

OrgChart.anim.inOutExp = function (x) {
    if (x < 0) return 0;
    if (x > 1) return 1;
    return x < 0.5 ? 0.5 * Math.pow(2, 10 * (2 * x - 1)) : 0.5 * (-Math.pow(2, 10 * (-2 * x + 1)) + 2);
};

OrgChart.anim.inCirc = function (x) {
    if (x < 0) return 0;
    if (x > 1) return 1;
    return -(Math.sqrt(1 - x * x) - 1);
};

OrgChart.anim.outCirc = function (x) {
    if (x < 0) return 0;
    if (x > 1) return 1;
    return Math.sqrt(1 - (x - 1) * (x - 1));
};

OrgChart.anim.inOutCirc = function (x) {
    if (x < 0) return 0;
    if (x > 1) return 1;
    return x < 1 ? -0.5 * (Math.sqrt(1 - x * x) - 1) : 0.5 * (Math.sqrt(1 - ((2 * x) - 2) * ((2 * x) - 2)) + 1);
};

OrgChart.anim.rebound = function (x) {
    if (x < 0) return 0;
    if (x > 1) return 1;
    if (x < (1 / 2.75)) return 1 - 7.5625 * x * x;
    else if (x < (2 / 2.75)) return 1 - (7.5625 * (x - 1.5 / 2.75) * (x - 1.5 / 2.75) + 0.75);
    else if (x < (2.5 / 2.75)) return 1 - (7.5625 * (x - 2.25 / 2.75) * (x - 2.25 / 2.75) + 0.9375);
    else return 1 - (7.5625 * (x - 2.625 / 2.75) * (x - 2.625 / 2.75) + 0.984375);
};

OrgChart.anim.inBack = function (x) {
    if (x < 0) return 0;
    if (x > 1) return 1;
    return x * x * ((1.70158 + 1) * x - 1.70158);
};

OrgChart.anim.outBack = function (x) {
    if (x < 0) return 0;
    if (x > 1) return 1;
    return (x - 1) * (x - 1) * ((1.70158 + 1) * (x - 1) + 1.70158) + 1;
};

OrgChart.anim.inOutBack = function (x) {
    if (x < 0) return 0;
    if (x > 1) return 1;
    return x < 0.5 ? 0.5 * (4 * x * x * ((2.5949 + 1) * 2 * x - 2.5949)) : 0.5 * ((2 * x - 2) * (2 * x - 2) * ((2.5949 + 1) * (2 * x - 2) + 2.5949) + 2);
};

OrgChart.anim.impulse = function (x) {
    var k = 2;
    var h = k * x;
    return h * Math.exp(1 - h);
};

OrgChart.anim.expPulse = function (x) {
    var k = 2;
    var n = 2;
    return Math.exp(-k * Math.pow(x, n));
};

if (typeof(OrgChart) == "undefined") {
    OrgChart = {};
}

OrgChart.prototype._attachInitEventHandlers = function (svg) {
    //resize
    this._addEvent(window, "resize", this._resizeHandler);
}

OrgChart.prototype._attachEventHandlers = function (svg) {
    if (this.config.interactive){
        var svg = this.getSvg();

        //var isIOS = /iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

        if (this.config.enableTouch || OrgChart.isMobile()) {
            this._addEvent(svg, "touchstart", this._globalMouseDownHandler);
            this._addEvent(svg, "touchend", this._globalClickHandler);
        }
        else {
            this._addEvent(svg, "mousedown", this._globalMouseDownHandler);
            this._addEvent(svg, "click", this._globalClickHandler);
            this._addEvent(svg, "contextmenu", this._globalContextHandler);
            this._addEvent(svg, "dblclick", this._globalDbClickHandler);
            //zoom
            if (this.config.mouseScrool == OrgChart.action.zoom || this.config.mouseScrool == OrgChart.action.ctrlZoom) {
                this._addEvent(svg, "DOMMouseScroll", this._mouseScrollHandler);
                this._addEvent(svg, "mousewheel", this._mouseScrollHandler);
            }
        }

        var menuButton = this.getMenuButton();
        if (menuButton) {
            this._addEvent(menuButton, "click", this._menuClickHandler);
        }
    }
};

// add event cross browser
OrgChart.prototype._addEvent = function (elem, event, fn, id) {
    // avoid memory overhead of new anonymous functions for every event handler that's installed
    // by using local functions

    if (!id) {
        id = "";
    }

    if (!elem.getListenerList) {
        elem.getListenerList = {};
    }


    if (elem.getListenerList[event + id]) {
        //already registered for that event
        return;
    }

    function runHandlerInContextOf(context, handler) {
        return function () {
            if (handler)
                return handler.apply(context, [this, arguments[0]]);
        }
    }
    fn = runHandlerInContextOf(this, fn);

    function listenHandler(e) {
        var ret = fn.apply(this, arguments);
        if (ret === false) {
            e.stopPropagation();
            e.preventDefault();
        }
        return (ret);
    }

    function attachHandler() {
        // set the this pointer same as addEventListener when fn is called
        // and make sure the event is passed to the fn also so that works the same too
        var ret = fn.call(elem, window.event);
        if (ret === false) {
            window.event.returnValue = false;
            window.event.cancelBubble = true;
        }
        return (ret);
    }

    if (elem.addEventListener) {
        if (event == "mousewheel"){ //#358 fix
            elem.addEventListener(event, listenHandler, {passive: false});
        }
        else{
            elem.addEventListener(event, listenHandler, false);
        }
    } else {
        elem.attachEvent("on" + event, attachHandler);
    }


    elem.getListenerList[event + id] = listenHandler;
};

OrgChart.prototype._removeEvent = function (elem, event) {
    if (elem.getListenerList[event]) {
        var listener = elem.getListenerList[event];
        elem.removeEventListener(event, listener, false);
        delete elem.getListenerList[event];
    }
};




if (typeof (OrgChart) == "undefined") {
    OrgChart = {};
}
OrgChart.VERSION = "8.03.08";



OrgChart.orientation = {};

OrgChart.orientation.top = 0;
OrgChart.orientation.bottom = 1;
OrgChart.orientation.right = 2;
OrgChart.orientation.left = 3;
OrgChart.orientation.top_left = 4;
OrgChart.orientation.bottom_left = 5;
OrgChart.orientation.right_top = 6;
OrgChart.orientation.left_top = 7;
OrgChart.align = {};
OrgChart.align.center = OrgChart.CENTER = 8;
OrgChart.align.orientation = OrgChart.ORIENTATION = 9;


OrgChart.attr = {};
OrgChart.attr.l = 'data-l';
OrgChart.attr.id = 'data-id';
OrgChart.attr.sl = 'data-sl';
OrgChart.attr.lbl = 'data-lbl';
OrgChart.attr.val = 'data-val';
OrgChart.attr.tlbr = 'data-tlbr';
OrgChart.attr.item = 'data-item';
OrgChart.attr.layout = 'data-layout';
OrgChart.attr.node_id = 'data-n-id';
OrgChart.attr.link_id = 'data-l-id';
OrgChart.attr.field_name = 'data-f-name';
OrgChart.attr.c_link_to = 'data-c-l-to';
OrgChart.attr.c_link_from = 'data-c-l-from';
OrgChart.attr.s_link_to = 'data-s-l-to';
OrgChart.attr.s_link_from = 'data-s-l-from';
OrgChart.attr.control_add = 'data-ctrl-add';
OrgChart.attr.control_expcoll_id = 'data-ctrl-ec-id';
OrgChart.attr.control_up_id = 'data-ctrl-up-id';
OrgChart.attr.control_export_menu = 'data-ctrl-menu';
OrgChart.attr.control_node_menu_id = 'data-ctrl-n-menu-id';
OrgChart.attr.control_node_circle_menu_id = 'data-ctrl-n-c-menu-id';
OrgChart.attr.control_node_circle_menu_name = 'data-ctrl-n-c-menu-name';
OrgChart.attr.control_node_circle_menu_wrraper_id = 'data-ctrl-n-c-menu-wrapper-id';
OrgChart.attr.width = 'data-width';
OrgChart.attr.text_overflow = 'data-text-overflow';


OrgChart.ID = "id";
OrgChart.PID = "pid";
OrgChart.STPID = "stpid";
OrgChart.TAGS = "tags";
OrgChart.NODES = "nodes";
OrgChart.ELASTIC = "elastic";
OrgChart.ASSISTANT = 'Assistant';


OrgChart.action = {};
OrgChart.action.expand = 0;
OrgChart.action.collapse = 1;
OrgChart.action.maximize = 101;
OrgChart.action.minimize = 102;
OrgChart.action.expandCollapse = 501;
OrgChart.action.edit = 1;
OrgChart.action.zoom = 2;
OrgChart.action.ctrlZoom = 22;
OrgChart.action.scroll = 41;
OrgChart.action.xScroll = 3;
OrgChart.action.yScroll = 4;
OrgChart.action.none = 5;
OrgChart.action.init = 6;
OrgChart.action.update = 7;
OrgChart.action.pan = 8;
OrgChart.action.centerNode = 9;
OrgChart.action.resize = 10;
OrgChart.action.insert = 11;
OrgChart.action.insertfirst = 12;
OrgChart.action.details = 13;
OrgChart.action.exporting = 14;
OrgChart.none = 400001;
OrgChart.scroll = {};
OrgChart.scroll.visible = true;
OrgChart.scroll.smooth = 12;
OrgChart.scroll.speed = 120;
OrgChart.scroll.safari = {
    smooth: 12,
    speed: 250
};

OrgChart.match = {};
OrgChart.match.height = 100001;
OrgChart.match.width = 100002;
OrgChart.match.boundary = 100003;


OrgChart.layout = {};

OrgChart.layout.normal = OrgChart.normal = 0;
OrgChart.layout.mixed = OrgChart.mixed = 1;
OrgChart.layout.tree = OrgChart.tree = 2;
OrgChart.layout.treeLeftOffset = OrgChart.treeLeftOffset = 3;
OrgChart.layout.treeRightOffset = OrgChart.treeRightOffset = 4;

OrgChart.nodeOpenTag = '<g ' + OrgChart.attr.node_id + '="{id}" style="opacity: {opacity}" transform="matrix(1,0,0,1,{x},{y})" class="{class}" ' + OrgChart.attr.sl + '="{sl}" ' + OrgChart.attr.l + '={level} {lcn}>';
OrgChart.linkOpenTag = '<g ' + OrgChart.attr.link_id + '="[{id}][{child-id}]" class="{class}">';
OrgChart.expcollOpenTag = '<g '+ OrgChart.attr.control_expcoll_id + '="{id}" transform="matrix(1,0,0,1,{x},{y})"  style="cursor:pointer;">';
OrgChart.upOpenTag = '<g '+ OrgChart.attr.control_up_id + '="{id}" transform="matrix(1,0,0,1,{x},{y})" style="cursor:pointer;">';
OrgChart.linkFieldsOpenTag = '<g transform="matrix(1,0,0,1,{x},{y}) rotate({rotate})">';
OrgChart.grCloseTag = '</g>';




OrgChart.A5w = 420;
OrgChart.A5h = 595;
OrgChart.A4w = 595;
OrgChart.A4h = 842;
OrgChart.A3w = 842;
OrgChart.A3h = 1191;
OrgChart.A2w = 1191;
OrgChart.A2h = 1684;
OrgChart.A1w = 1684;
OrgChart.A1h = 2384;
OrgChart.Letterw = 612;
OrgChart.Letterh = 791;
OrgChart.Legalw = 612;
OrgChart.Legalh = 1009;


OrgChart.COLLAPSE_PARENT_NEIGHBORS = 1;
OrgChart.COLLAPSE_SUB_CHILDRENS = 2;
OrgChart.COLLAPSE_PARENT_SUB_CHILDREN_EXCEPT_CLICKED = 3;
OrgChart.TEXT_THRESHOLD = 400;
OrgChart.IMAGES_THRESHOLD = 100;
OrgChart.LINKS_THRESHOLD = 200;
OrgChart.BUTTONS_THRESHOLD = 70;
OrgChart.ANIM_THRESHOLD = 50;
OrgChart.IT_IS_LONELY_HERE = '<g transform="translate(-100, 0)" style="cursor:pointer;"  ' + OrgChart.attr.control_add + '="control-add"><text fill="#039be5">{link}</text></g>';
OrgChart.RES = {};
OrgChart.RES.IT_IS_LONELY_HERE_LINK = "It's lonely here, add your first node";
OrgChart.FIRE_DRAG_NOT_CLICK_IF_MOVE = 3;
OrgChart.STRING_TAGS = false;
OrgChart.MAX_NODES_MESS = "The trial has expired or 200 nodes limit was reached! <br /><a style='color: #039BE5;' target='_blank' href='https://balkan.app/OrgChartJS/Docs/Evaluation'>See more</a>";
OrgChart.OFFLINE_MESS = "The evaluation version requires internet connection! <br /><a style='color: #039BE5;' target='_blank' href='https://balkan.app/OrgChartJS/Docs/Evaluation'>See more</a>";
OrgChart.SEARCH_PLACEHOLDER = 'Search';
OrgChart.IMPORT_MESSAGE = "Choose the columns (fields) in your data file that contain the required information.";
OrgChart.FIXED_POSITION_ON_CLICK = false;
OrgChart.RENDER_LINKS_BEFORE_NODES = false;
OrgChart.MIXED_LAYOUT_ALL_NODES = true;
OrgChart.MIXED_LAYOUT_FOR_NODES_WITH_COLLAPSED_CHILDREN = false;
OrgChart.LINK_ROUNDED_CORNERS = 5;
OrgChart.MOVE_STEP = 5;
OrgChart.MOVE_INTERVAL = 25;
OrgChart.CLINK_CURVE = 1;
OrgChart.SEARCH_RESULT_LIMIT = 10;
OrgChart.MAX_DEPTH = 200;
OrgChart.SCALE_FACTOR = 1.44;
OrgChart.LAZY_LOADING_FACTOR = 500;
OrgChart.HIDE_EDIT_FORM_ON_PAN = true;
OrgChart.LAZY_LOADING = true;


if (typeof(module) != "undefined"){
    module.exports = OrgChart;
}
OrgChart._intersects = function (n1, point, config) {
    var a = n1.x - config.siblingSeparation / 4;
    var b = n1.y;
    var c = n1.x + n1.w + config.siblingSeparation / 4;
    var d = n1.y;

    switch (config.orientation) {
        case OrgChart.orientation.right:
        case OrgChart.orientation.right_top:
        case OrgChart.orientation.left:
        case OrgChart.orientation.left_top:
            a = n1.x;
            b = n1.y - config.siblingSeparation / 4;
            c = n1.x ;
            d = n1.y + n1.h + config.siblingSeparation / 4;
            break;
    }

    var p = point.p;
    var q = point.q;
    var r = point.r;
    var s = point.s;

    var det, gamma, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
        return false;
    } else {
        lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
        gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
        return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
};

OrgChart._addPoint = function (node, path, config, point, align) {
    switch (config.orientation) {
        case OrgChart.orientation.top:
        case OrgChart.orientation.top_left:
            return OrgChart._addPointTop(node, path, config, point, align);
        case OrgChart.orientation.bottom:
        case OrgChart.orientation.bottom_left:
            return OrgChart._addPointBottom(node, path, config, point, align);
        case OrgChart.orientation.left:
        case OrgChart.orientation.left_top:
            return OrgChart._addPointLeft(node, path, config, point, align);
        case OrgChart.orientation.right:
        case OrgChart.orientation.right_top:
            return OrgChart._addPointRight(node, path, config, point, align);
    }
};

OrgChart._addPointTop = function (node, path, config, point, align) {
    var p;
    var q;
    var r;


    if (align == "left") {
        if (node.leftNeighbor) {
            p = node.x + (node.leftNeighbor.x + node.leftNeighbor.w - (node.x)) / 2;
        }
        else {
            p = node.x - config.siblingSeparation / 2;
        }
    }
    else if (align == "right") {
        if (node.rightNeighbor) {
            p = node.x + node.w + (node.rightNeighbor.x - (node.x + node.w)) / 2;
        }
        else {
            p = node.x + node.w + config.siblingSeparation / 2;
        }
    }

    path.push([p, path[path.length - 1][1]]);
    path.push([p, node.y - config.levelSeparation / 3]);

    q = path[path.length - 1][1];
    r = p;

    point.p = p;
    point.q = q;
    point.r = r;

    return point;
};


OrgChart._addPointBottom = function (node, path, config, point, align) {
    var p;
    var q;
    var r;

    if (align == "left") {
        if (node.leftNeighbor) {
            p = node.x + (node.leftNeighbor.x + node.leftNeighbor.w - (node.x)) / 2;
        }
        else {
            p = node.x - config.siblingSeparation / 2;
        }
    }
    else if (align == "right") {
        if (node.rightNeighbor) {
            p = node.x + node.w + (node.rightNeighbor.x - (node.x + node.w)) / 2;
        }
        else {
            p = node.x + node.w + config.siblingSeparation / 2;
        }
    }

    path.push([p, path[path.length - 1][1]]);
    path.push([p, node.y + node.h + config.levelSeparation / 3]);

    q = path[path.length - 1][1];
    r = p;

    point.p = p;
    point.q = q;
    point.r = r;



    return point;
};


OrgChart._addPointLeft = function (node, path, config, point, align) {
    var p = path[path.length - 1][0];;
    var q;
    var r;

    if (align == "bottom") {
        if (node.rightNeighbor) {
            q = node.y + node.h + (node.rightNeighbor.y - (node.y + node.h)) / 2;
        }
        else {
            q = node.y + node.h + config.siblingSeparation / 2;
        }

    }
    else if (align == "top") {
        if (node.leftNeighbor) {
            q = node.y + (node.leftNeighbor.y + node.leftNeighbor.h - (node.y)) / 2;
        }
        else {
            q = node.y - config.siblingSeparation / 2;
        }
    }

    path.push([path[path.length - 1][0], q]);
    path.push([node.x - config.levelSeparation / 3, q]);

    p = path[path.length - 1][0];
    s = q;

    point.p = p;
    point.q = q;
    point.s = s;

    return point;
};



OrgChart._addPointRight = function (node, path, config, point, align) {
    var p = path[path.length - 1][0];;
    var q;
    var r;

    if (align == "bottom") {
        if (node.rightNeighbor) {
            q = node.y + node.h + (node.rightNeighbor.y - (node.y + node.h)) / 2;
        }
        else {
            q = node.y + node.h + config.siblingSeparation / 2;
        }

    }
    else if (align == "top") {
        if (node.leftNeighbor) {
            q = node.y + (node.leftNeighbor.y + node.leftNeighbor.h - (node.y)) / 2;
        }
        else {
            q = node.y - config.siblingSeparation / 2;
        }
    }

    path.push([path[path.length - 1][0], q]);
    path.push([node.x + node.w + config.levelSeparation / 3, q]);

    p = path[path.length - 1][0];
    s = q;

    point.p = p;
    point.q = q;
    point.s = s;

    return point;
};


OrgChart.editUI = function () {
};

OrgChart.editUI.prototype.init = function (obj) {
    this.obj = obj;
    this.fields = null;
    this._event_id = OrgChart._guid();
};

OrgChart.editUI.prototype.on = function(type, callback){
    OrgChart.events.on(type, callback, this._event_id);
    return this;
};

OrgChart.editUI.prototype.show = function (id, detailsMode, dontAnim) {
    this.hide();
    var result = OrgChart.events.publish('show', [this, id]);
    if (result === false) {
        return false;
    }

    var that = this;

    var content = this.content(id, detailsMode, dontAnim);
    this.obj.element.appendChild(content.element);
    OrgChart.input.init(this.obj.element);

    if (!dontAnim){
        this.interval = OrgChart.animate(content.element,
            { right: -20, opacity: 0 },
            { right: 0, opacity: 1 },
            300,
            OrgChart.anim.outSin, function () {
                if (!detailsMode){
                    that._focusElement(content.focusId);
                }
            }
        );
    }
    else if (!detailsMode){
        this._focusElement(content.focusId);
    }

    this.obj.element.querySelector('[data-edit-from-close]').addEventListener('click', function (e) {
        e.preventDefault();

        var result = OrgChart.events.publish('cancel', [that, {id: id}]);
        if (result === false) {
            return;
        }
        that.hide();
    });

    this.obj.element.querySelector('[data-edit-from-cancel]').addEventListener('click', function (e) {
        e.preventDefault();

        var result = OrgChart.events.publish('cancel', [that, {id: id}]);
        if (result === false) {
            return;
        }
        that.hide();
    });

    this.obj.element.querySelector('[data-edit-from-save]').addEventListener('click', function (e) {
        e.preventDefault();
        var editData = OrgChart.input.validateAndGetData(content.element);
        if (editData !== false){ // if data is valid acording to the validaion attributes
            var data = that.obj.get(id);
            var newData = OrgChart.mergeDeep(data, editData);//merge second override

            var args = {
                data: newData
            };

            var result = OrgChart.events.publish('save', [that, args]);
            if (result === false) {
                return;
            }
            that.obj.updateNode(args.data, null, true);
            that.hide();
        }
    });

    var inputBtns = this.obj.element.querySelectorAll('[boc-input-btn]');

    for(var i = 0; i < inputBtns.length; i++){
        var inputBtn = inputBtns[i];
        inputBtn.addEventListener('click', function (e) {

            OrgChart.events.publish('element-btn-click', [that, {
                input: this.parentNode.querySelector('input'),
                nodeId: id
            }]);
        })
    }

    this.obj.element.querySelector('[data-add-more-fields-btn]').addEventListener('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var addMoreLink = this;
        var txtAddMoreField = OrgChart.elements.textbox({}, { type: 'textbox', label: that.obj.config.editForm.addMoreFieldName, btn: that.obj.config.editForm.addMoreBtn}, '280px');
        addMoreLink.parentNode.insertAdjacentHTML('beforebegin',  txtAddMoreField.html);
        addMoreLink.style.display = 'none';
        OrgChart.input.init(addMoreLink.parentNode.previousSibling);
        var textbox = document.getElementById(txtAddMoreField.id);
        textbox.focus();
        textbox.nextElementSibling.addEventListener('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            var elementExist = that.obj.element.querySelector('[data-binding="' + textbox.value + '"]');
            if (!OrgChart.isNEU(textbox.value) && !elementExist){
                var newField = OrgChart.elements.textbox({}, { type: 'textbox', label: textbox.value, binding: textbox.value}, '280px');
                textbox.parentNode.parentNode.parentNode.removeChild(textbox.parentNode.parentNode);
                addMoreLink.parentNode.insertAdjacentHTML('beforebegin',  newField.html);
                addMoreLink.style.display = '';
                OrgChart.input.init(addMoreLink.parentNode.previousSibling);
                document.getElementById(newField.id).focus();
            }
            else{
                textbox.focus();
            }
        });
    });

    this.obj.element.querySelector('[data-boc-edit-from-btns]').addEventListener('click', function (e) {
        var target = e.target;
        while(target && target.hasAttribute && !target.hasAttribute('data-edit-from-btn')){
            target = target.parentNode;
        }

        if (target && target.hasAttribute){
            var name = target.getAttribute('data-edit-from-btn');

            var args = {
                button: that.obj.config.editForm.buttons[name],
                name: name,
                nodeId: id,
                event: e
            };
            var result = OrgChart.events.publish('button-click', [that, args]);

            if (result === false) {
                return false;
            }

            switch (name){
                case 'edit':{
                    that.obj.editUI.show(id, false, true);
                    break;
                }
                case 'pdf':{
                    that.obj.exportPDFProfile({id: id, filename: content.title});
                    that.hide();
                    break;
                }
                case 'png':{
                    that.obj.exportPNGProfile({id: id, filename: content.title});
                    that.hide();
                    break;
                }
                case 'share':{
                    that.obj.shareProfile(id);
                    break;
                }
                case 'remove':{
                    that.obj.removeNode(id, null, true);
                    that.hide();
                    break;
                }
            }
        }
    });
};

OrgChart.editUI.prototype._focusElement = function (focusId) {
    var focusElement = null;
    if (!OrgChart.isNEU(this.obj.config.editForm.focusBinding)){
        focusElement = this.obj.element.querySelector('[data-binding="' + this.obj.config.editForm.focusBinding + '"]');
    }
    else if (!OrgChart.isNEU(focusId)){
        focusElement = document.getElementById(focusId);
    }

    if(focusElement){
        focusElement.focus();
        if (focusElement.value && focusElement.value.length){
            focusElement.selectionStart = focusElement.selectionEnd = focusElement.value.length;
        }
    }
};

OrgChart.editUI.prototype.setAvatar = function (avatarUrl) {
    var bocAvatarElement = this.obj.element.querySelector('#boc-avatar');
    if (OrgChart.isNEU(avatarUrl)){
        bocAvatarElement.innerHTML = OrgChart.icon.user(150,150,'#8C8C8C',0,0);
    }
    else{
        bocAvatarElement.innerHTML = `<img style="width: 100%;height:100%;border-radius: 50%;" src="${avatarUrl}"></img>`;
    }
};

OrgChart.editUI.prototype.content = function (id, detailsMode, dontAnim, width, dontRenderButtons) {
    var readOnly = this.obj.config.editForm.readOnly;
    var editFormElements = JSON.parse(JSON.stringify(this.obj.config.editForm.elements));
    var editFormAddMore = this.obj.config.editForm.addMore;
    var editFormSaveAndCloseBtn = this.obj.config.editForm.saveAndCloseBtn;
    var editFormCancelBtn = this.obj.config.editForm.cancelBtn;
    var editFormButtons = this.obj.config.editForm.buttons;
    var editFormTitleBinding = this.obj.config.editForm.titleBinding;
    var editFormPhotoBinding = this.obj.config.editForm.photoBinding;
    var node = this.obj.getNode(id);
    var data = this.obj._get(id);
    var t = OrgChart.t(node.templateName, node.min, this.obj.getScale());
    var title = data[editFormTitleBinding];
    var photo = data[editFormPhotoBinding];

    if (this.obj.config.editForm.generateElementsFromFields){

        for(var i = 0; i < this.fields.length; i++){
            var f_name = this.fields[i];
            if (f_name == 'tags'){
                continue;
            }
            var exist = false;

            for (var j = 0; j < editFormElements.length; j++){
                if (Array.isArray(editFormElements[j])){
                    for(var k = 0; k < editFormElements[j].length; k++){
                        if (f_name == editFormElements[j][k].binding){
                            exist = true;
                            break;
                        }
                    }
                }
                else{
                    if (f_name == editFormElements[j].binding){
                        exist = true;
                        break;
                    }
                }
                if (exist){
                    break;
                }
            }
            if (!exist){
                editFormElements.push({ type: 'textbox', label: f_name, binding: f_name})
            }
        }
    }
    if (OrgChart.isNEU(title)){
        title = '';
    }
    if (OrgChart.isNEU(photo)){
        photo = OrgChart.icon.user(150,150,'#8C8C8C',0,0);
    }
    else{
        photo = `<img style="width: 100%;height:100%;border-radius: 50%;" src="${photo}"></img>`;
    }


    var focusId;
    var editMode = !detailsMode;
    var displayNoneButtonsAttribute = detailsMode ? 'display:none;' : '';
    var displayNoneAddMoreAttribute = detailsMode || !editFormAddMore ? 'display:none;' : '';
    var bgColorAttribute = t.editFormHeaderColor ? `style="background-color:${t.editFormHeaderColor};"` : '';
    var form = document.createElement('form');
    form.setAttribute('data-boc-edit-form', '');
    form.classList.add('boc-edit-form');
    form.classList.add(this.obj.config.mode);
    form.classList.add(node.templateName);
    form.classList.add(OrgChart.ui._defsIds[node.templateName]);
    if (Array.isArray(node.tags) && node.tags.length){
        for(var i = 0; i < node.tags.length; i++){
            form.classList.add(node.tags[i]);
        }
    }

    form.style.display = 'flex';
    form.style.opacity = dontAnim ? 1 : 0;
    form.style.right = dontAnim ? 0 : '-20px';
    if (width){
        form.style.width = width;
    }
    var shareText = [];
    var closeElement = dontRenderButtons ? '' : '<svg data-edit-from-close class="boc-edit-form-close"><path style="fill:#ffffff;" d="M21.205,5.007c-0.429-0.444-1.143-0.444-1.587,0c-0.429,0.429-0.429,1.143,0,1.571l8.047,8.047H1.111 C0.492,14.626,0,15.118,0,15.737c0,0.619,0.492,1.127,1.111,1.127h26.554l-8.047,8.032c-0.429,0.444-0.429,1.159,0,1.587 c0.444,0.444,1.159,0.444,1.587,0l9.952-9.952c0.444-0.429,0.444-1.143,0-1.571L21.205,5.007z"></path></svg>';
    form.innerHTML = `<div>
                        <div class="boc-edit-form-header" ${bgColorAttribute}>
                            ${closeElement}
                            <h1 class="boc-edit-form-title">${title}</h1>
                            <div id="boc-avatar" class="boc-edit-form-avatar">${photo}</div>
                        </div>
                        <div data-boc-edit-from-btns class="boc-edit-form-instruments">
                        ${(function () {
                            if (dontRenderButtons){
                                return '';
                            }
                            var htmlBittons = '';
                            for(var name in editFormButtons){
                                var editFormButton = editFormButtons[name];
                                if (OrgChart.isNEU(editFormButton)){
                                    continue;
                                }
                                else if (editMode && editFormButton.hideIfEditMode) {
                                    continue;
                                }
                                else if (detailsMode && editFormButton.hideIfDetailsMode){
                                    continue;
                                }
                            //   else if (readOnly && editFormButton.hideIfDetailsMode){
                                else if (readOnly && editFormButton.text == "Edit"){

                                    continue;
                                }
                                htmlBittons += `<div data-edit-from-btn='${name}' class="boc-img-button" ${bgColorAttribute} title="${editFormButton.text}">${editFormButton.icon}</div>`;
                            }
                            return htmlBittons;
                        })()}
                        </div>
                    </div>
                    <div class="boc-edit-form-fields">
                        <div class="boc-edit-form-fields-inner">
                            <div class="boc-form-fieldset">
                                ${(function () {
                                    var htmlElements = '';

                                    for(var i = 0; i < editFormElements.length; i++){
                                        var editElement = editFormElements[i];
                                        if (Array.isArray(editElement)){
                                            htmlElements += '<div class="boc-form-field-100 boc-form-fieldset">';
                                            for(var j = 0; j < editElement.length; j++){
                                                var editElement2 = editElement[j];
                                                var element = OrgChart.elements[editElement2.type](data, editElement2, 'unset', detailsMode);
                                                if (!OrgChart.isNEU(element.id) && OrgChart.isNEU(focusId) && OrgChart.isNEU(element.value)){
                                                    focusId = element.id;
                                                }
                                                if (!OrgChart.isNEU(element.value)){
                                                    shareText.push(`${editElement2.label}: ${element.value}`);
                                                }
                                                htmlElements += element.html;
                                            }
                                            htmlElements += '</div>';
                                        }
                                        else {
                                            var element = OrgChart.elements[editElement.type](data, editElement, '280px', detailsMode);
                                            if (!OrgChart.isNEU(element.id) && OrgChart.isNEU(focusId) && OrgChart.isNEU(element.value)){
                                                focusId = element.id;
                                            }
                                            if (!OrgChart.isNEU(element.value)){
                                                shareText.push(`${editElement.label}: ${element.value}`);
                                            }
                                            htmlElements += element.html;
                                        }
                                    }

                                    return htmlElements;
                                })()}

                                <div class="boc-form-field" style="min-width: 280px; text-align:center; ${displayNoneAddMoreAttribute}">
                                    <a data-add-more-fields-btn href="#" class="boc-link">${editFormAddMore}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="boc-form-fieldset" style="padding: 14px 10px; ${displayNoneButtonsAttribute}">
                        <div class="boc-form-field" style="min-width: initial;">
                            <button data-edit-from-cancel type="button" class="boc-button transparent">${editFormCancelBtn}</button>
                        </div>
                        <div class="boc-form-field" style="min-width: initial;">
                            <button type="submit" data-edit-from-save type="button" class="boc-button">${editFormSaveAndCloseBtn}</button>
                        </div>
                    </div>`;
    return { element: form, focusId: focusId, title: title, shareText: shareText.join('\n')};
};

OrgChart.editUI.prototype.hide = function () {
    var result = OrgChart.events.publish('hide', [this]);
    if (result === false) {
        return false;
    }
    if (OrgChart.isNEU(this.interval)){
        clearInterval(this.interval);
        this.interval = null;
    }

    var editFormElement = this.obj.element.querySelector('[data-boc-edit-form]');
    if (editFormElement && editFormElement.parentNode){
        editFormElement.parentNode.removeChild(editFormElement);
    }
};



OrgChart.prototype.getSvg = function () {
    var svgElements = this.element.getElementsByTagName("svg");
    if (svgElements && svgElements.length) {
        return svgElements[0];
    }
    return null;
};

OrgChart.prototype.getPointerElement = function () {
    return this.element.querySelector("g[data-pointer]");
};

OrgChart.prototype.getNodeElement = function (id) {
    return this.element.querySelector("g[" + OrgChart.attr.node_id + "='" + id + "']");
};

OrgChart.prototype.getMenuButton = function () {
    return this.element.querySelector("[" + OrgChart.attr.control_export_menu + "]");
};




OrgChart.menuUI = function () {
};

OrgChart.menuUI.prototype.init = function (obj, menu) {
    this.obj = obj;
    this.wrapper = null;
    this.menu = menu;
    this._event_id = OrgChart._guid();
};


OrgChart.menuUI.prototype.showStickIn = function (stickToElement, firstNodeId, secondNodeId, menu) {
    this._show(stickToElement, null, firstNodeId, secondNodeId, menu);
};

OrgChart.menuUI.prototype.show = function (x, y, firstNodeId, secondNodeId, menu) {
    this._show(x, y, firstNodeId, secondNodeId, menu);
};

OrgChart.menuUI.prototype._show = function (x, y, firstNodeId, secondNodeId, menu) {
    var that = this;
    this.hide();
    var html = "";

    if (!menu) {
        menu = this.menu;
    }

    var args = {
        firstNodeId: firstNodeId,
        secondNodeId: secondNodeId,
        menu: menu
    };

    var result = OrgChart.events.publish('show', [this, args]);

    if (result === false) {
        return false;
    }

    menu = args.menu;

    for (var item in menu) {
        var icon = menu[item].icon;
        var text = menu[item].text;

        if (icon === undefined) {
            icon = OrgChart.icon[item](24, 24, "#7A7A7A");
        }

        if (typeof(text) == 'function'){
            text = text();
        }

        if (typeof(icon) == 'function'){
            icon = icon();
        }

        html += '<div ' + OrgChart.attr.item + '="' + item + '">' + icon + '<span>&nbsp;&nbsp;' + text + '</span></div>';
    }

    if (html != "") {
        this.wrapper = document.createElement("div");

        this.wrapper.className = "boc-chart-menu";


        this.wrapper.style.left = "-99999px";
        this.wrapper.style.top  = "-99999px";

        this.wrapper.innerHTML = html;
        this.obj.element.appendChild(this.wrapper);

        if (y == undefined){
            var position = OrgChart._menuPosition(x, this.wrapper, this.obj.getSvg());
            x = position.x;
            y = position.y;
        }


        var startLeft = x + 45;

        this.wrapper.style.left = startLeft + "px";
        this.wrapper.style.top = y + "px";

        this.wrapper.style.left = startLeft - this.wrapper.offsetWidth + "px";
        var endLeft = x - this.wrapper.offsetWidth;

        OrgChart.animate(
            this.wrapper,
            { opacity: 0, left: startLeft - this.wrapper.offsetWidth },
            { opacity: 1, left: endLeft },
            300, OrgChart.anim.inOutPow);

        var items = this.wrapper.getElementsByTagName("div");

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.addEventListener("click", function (e) {
                var item = this.getAttribute(OrgChart.attr.item);
                var onClick = menu[item].onClick;
                var result;
                if (onClick === undefined) {
                    if (item === "add") {
                        var data = { id: that.obj.generateId(), pid: firstNodeId };
                        that.obj.addNode(data, null, true);
                    }
                    else if (item === "edit") {
                        var node = that.obj.getNode(firstNodeId);
                        that.obj.editUI.show(node.id);
                    }
                    else if (item === "details") {
                        var node = that.obj.getNode(firstNodeId);
                        that.obj.editUI.show(node.id, true);
                    }
                    else if (item === "remove") {
                        that.obj.removeNode(firstNodeId, null, true);
                    }
                    else if (item === "svg") {
                        that.obj.exportSVG({
                            filename: "OrgChart.svg",
                            expandChildren: false,
                            nodeId: firstNodeId
                        });
                    }
                    else if (item === "pdf") {
                        that.obj.exportPDF({
                            filename: "OrgChart.pdf",
                            expandChildren: false,
                            nodeId: firstNodeId
                        });
                    }
                    else if (item === "png") {
                        that.obj.exportPNG({
                            filename: "OrgChart.png",
                            expandChildren: false,
                            nodeId: firstNodeId
                        });
                    }
                    else if (item === "csv") {
                        that.obj.exportCSV();
                    }
                    else if (item === "xml") {
                        that.obj.exportXML();
                    }
                }
                else {
                    result = menu[item].onClick.call(that.obj, firstNodeId, secondNodeId);
                }
                if (result != false){
                    that.hide();
                }
            });
        }
    }
};

OrgChart.menuUI.prototype.hide = function () {
    if (this.wrapper != null) {
        this.obj.element.removeChild(this.wrapper);
        this.wrapper = null;
    }
};

OrgChart.menuUI.prototype.on = function(type, callback){
    OrgChart.events.on(type, callback, this._event_id);
    return this;
};


OrgChart.circleMenuUI = function () {
};


OrgChart.circleMenuUI.prototype.init = function (obj, menu) {
    this.obj = obj;
    this.menu = menu;
    this._menu = null;
    this._buttonsInterval = [];
    this._linesInterval = [];
    this._event_id = OrgChart._guid();
};


OrgChart.circleMenuUI.prototype.show = function (nodeId, menu) {
    this._show(nodeId, menu);
};

OrgChart.circleMenuUI.prototype._show = function (nodeId, menu) {
    var that = this;
    var node = this.obj.getNode(nodeId);
    var t = OrgChart.t(node.templateName, node.min, this.obj.getScale());
    if (OrgChart.isNEU(t.nodeCircleMenuButton)){
        return;
    }
    var svg = this.obj.getSvg();
    var controlNodeCircleMenu = this.obj.element.querySelector('[' + OrgChart.attr.control_node_circle_menu_id + '="' + nodeId + '"]');
    var nodeElement = this.obj.getNodeElement(nodeId);
    var transformControlNodeCircleMenu = OrgChart._getTransform(controlNodeCircleMenu);
    var transformNodeElement = OrgChart._getTransform(nodeElement);
    var cxAdjust = transformControlNodeCircleMenu[4] + transformNodeElement[4];
    var cyAdjust = transformControlNodeCircleMenu[5] + transformNodeElement[5];
    var lines = controlNodeCircleMenu.querySelectorAll('line');
    var group = this.obj.element.querySelector('[' + OrgChart.attr.control_node_circle_menu_wrraper_id + ']');


    if (!OrgChart.isNEU(group) && group.getAttribute(OrgChart.attr.control_node_circle_menu_wrraper_id) == nodeId){
        this.hide();
        return;
    }
    else{
        this.hide();
    }

    if (!menu) {
        menu = this.menu;
    }

    var args = {
        nodeId: nodeId,
        menu: menu
    };

    var result = OrgChart.events.publish('show', [this, args]);
    this._menu = menu;

    if (result === false) {
        return false;
    }


    var index = 0;
    var length = Object.keys(args.menu).length;

    var radiusToButtons = t.nodeCircleMenuButton.radius * 2 + 4;
    var circumference = 2 * Math.PI * radiusToButtons;
    var acceptedRadius = circumference / length - (t.nodeCircleMenuButton.radius * 2 + 2);

    while(acceptedRadius < 0){
        radiusToButtons = radiusToButtons + 8;
        circumference = 2 * Math.PI * radiusToButtons;
        acceptedRadius = circumference / length - (t.nodeCircleMenuButton.radius * 2 + 2);
    }

    group = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
    );
    group.setAttribute(OrgChart.attr.control_node_circle_menu_wrraper_id, nodeId);
    group.setAttribute('transform', 'matrix(1,0,0,1,' + cxAdjust + ',' + cyAdjust + ')');

    svg.appendChild(group);

    for (var menuItemName in args.menu) {
        var icon = args.menu[menuItemName].icon;
        var color = args.menu[menuItemName].color;
        var text = args.menu[menuItemName].text;

        if (typeof(icon) == 'function'){
            icon = icon();
        }

        if (typeof(color) == 'function'){
            color = color();
        }

        if (typeof(text) == 'function'){
            text = text();
        }

        var g = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
        );

        g.setAttribute('transform', 'matrix(1,0,0,1,0,0)');
        g.setAttribute(OrgChart.attr.control_node_circle_menu_name, menuItemName);
        g.style.cursor = 'pointer';

        var title = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "title"
        );

        if (!OrgChart.isNEU(text)){
            title.innerHTML = text;
        }

        var circle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );

        circle.setAttribute('cx', 0);
        circle.setAttribute('cy', 0);
        circle.setAttribute('r', t.nodeCircleMenuButton.radius);
        circle.setAttribute('fill', color);
        circle.setAttribute('stroke-width', '1');
        circle.setAttribute('stroke', t.nodeCircleMenuButton.stroke);

        g.appendChild(circle);
        g.appendChild(title);

        g.innerHTML += icon;

        group.appendChild(g);

        var iconSvg = g.getElementsByTagName('svg')[0];
        iconSvg.setAttribute('pointer-events', 'none');

        if (iconSvg){
            var width = parseInt(iconSvg.getAttribute('width'));
            var height = parseInt(iconSvg.getAttribute('height'));
            iconSvg.setAttribute('x', -(width / 2));
            iconSvg.setAttribute('y', -(height / 2));
        }

        var angle = index * Math.PI / (length / 2);
        index++;

        var cx = Math.cos(angle) * radiusToButtons;
        var cy = Math.sin(angle) * radiusToButtons;

        this._buttonsInterval.push(OrgChart.animate(g,
            { transform: [1,0,0,1,0,0] },
            { transform: [1,0,0,1,cx,cy] },
            250,
            OrgChart.anim.outBack, function(elements){
                var menuItemName = elements[0].getAttribute(OrgChart.attr.control_node_circle_menu_name);
                var id = elements[0].parentNode.getAttribute(OrgChart.attr.control_node_circle_menu_wrraper_id);
                elements[0].addEventListener('mouseenter', function(e){
                    OrgChart.events.publish('mouseenter', [that, {
                        from: id,
                        menuItem: args.menu[menuItemName],
                        menuItemName: menuItemName,
                        event: e
                    }]);
                });

                elements[0].addEventListener('mouseout', function(e){
                    OrgChart.events.publish('mouseout', [that, {
                        from: id,
                        menuItem: args.menu[menuItemName],
                        menuItemName: menuItemName,
                        event: e
                    }]);
                });

            }
        ));
    }

    this._linesInterval.push(OrgChart.animate(lines[0],
        { x1: -(t.nodeCircleMenuButton.radius / 2), y1: -6, x2: t.nodeCircleMenuButton.radius / 2, y2: -6 },
        { x1: -7, y1: -7, x2: 7, y2: 7 },
        500,
        OrgChart.anim.inOutSin
    ));
    this._linesInterval.push(OrgChart.animate(lines[1],
        { x1: -(t.nodeCircleMenuButton.radius / 2), y1: 0, x2: t.nodeCircleMenuButton.radius / 2, y2: 0 },
        { x1: 0, y1: 0, x2: 0, y2: 0 },
        500,
        OrgChart.anim.inOutSin
    ));
    this._linesInterval.push(OrgChart.animate(lines[2],
        { x1: -(t.nodeCircleMenuButton.radius / 2), y1: 6, x2: t.nodeCircleMenuButton.radius / 2, y2: 6 },
        { x1: -7, y1: 7, x2: 7, y2: -7 },
        500,
        OrgChart.anim.inOutSin
    ));
};

OrgChart.circleMenuUI.prototype.hide = function () {
    for(var i = this._buttonsInterval.length - 1; i >= 0; i--){
        clearInterval(this._buttonsInterval[i]);
        this._buttonsInterval.splice(i, 1)
    }
    this._buttonsInterval = [];

    for(var i = this._linesInterval.length - 1; i >= 0; i--){
        clearInterval(this._linesInterval[i]);
        this._linesInterval.splice(i, 1)
    }
    this._linesInterval = [];


    var group = this.obj.element.querySelector('[' + OrgChart.attr.control_node_circle_menu_wrraper_id + ']');
    if (group != null) {
        var nodeId = group.getAttribute(OrgChart.attr.control_node_circle_menu_wrraper_id);
        var node = this.obj.getNode(nodeId);
        var t = OrgChart.t(node.templateName, node.min, this.obj.getScale());

        var controlNodeCircleMenu = this.obj.element.querySelector('[' + OrgChart.attr.control_node_circle_menu_id + '="' + nodeId + '"]');
        var lines = controlNodeCircleMenu.querySelectorAll('line');

        lines[0].setAttribute('x1', -(t.nodeCircleMenuButton.radius / 2));
        lines[0].setAttribute('x2', t.nodeCircleMenuButton.radius / 2);
        lines[0].setAttribute('y1', -6);
        lines[0].setAttribute('y2', -6);

        lines[1].setAttribute('x1', -(t.nodeCircleMenuButton.radius / 2));
        lines[1].setAttribute('x2', t.nodeCircleMenuButton.radius / 2);
        lines[1].setAttribute('y1', 0);
        lines[1].setAttribute('y2', 0);

        lines[2].setAttribute('x1', -(t.nodeCircleMenuButton.radius / 2));
        lines[2].setAttribute('x2', t.nodeCircleMenuButton.radius / 2);
        lines[2].setAttribute('y1', 6);
        lines[2].setAttribute('y2', 6);

        group.parentElement.removeChild(group);
        group = null;
    }
};

OrgChart.circleMenuUI.prototype.on = function(type, callback){
    OrgChart.events.on(type, callback, this._event_id);
    return this;
};






if (typeof (OrgChart) == "undefined") {
    OrgChart = {};
}

OrgChart.idb = {
    version: 1,
    dbName: "BALKAN",
    tableName: "orgchart-js",
    keyPath: "id"
};

//window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

OrgChart.idb.db = null;

OrgChart.idb._open = function(callback){
    if (OrgChart._browser().msie) {
        if (callback) callback(false);
        return;
    }

    if (navigator.userAgent.toLowerCase().indexOf("safari") > 0 || navigator.userAgent.toLowerCase().indexOf("firefox") > 0) {
        if (window.location !== window.parent.location) {
            if (callback) callback(false);
            return;
        }
    }

    if (!window.indexedDB) {
        console.error("Your browser doesn't support a stable version of IndexedDB.");
        if (callback) callback(false);
        return;
    }

    if (OrgChart.idb.db != null){
        if (callback) callback(true);
        return;
    }

    var req = indexedDB.open(OrgChart.idb.dbName, OrgChart.idb.version);

    req.onerror = function (event) {
        console.error("Cannot open database!");
        if (callback) callback(false);
    };

    req.onsuccess = function (event) {
        OrgChart.idb.db = event.target.result;
        if (callback) callback(true);
    };

    req.onupgradeneeded = function (event) {
        var db = event.target.result;

        if (db.objectStoreNames.contains(OrgChart.idb.tableName)) {
            db.deleteObjectStore(OrgChart.idb.tableName)
        }
        var objectStore = db.createObjectStore(OrgChart.idb.tableName, { keyPath: OrgChart.idb.keyPath });
    }
}

OrgChart.idb.read = function(id, callback){
    OrgChart.idb._open(function(success){
        if (success){
            var transaction = OrgChart.idb.db.transaction([OrgChart.idb.tableName]);
            var objectStore = transaction.objectStore(OrgChart.idb.tableName);
            var req = objectStore.get(id);

            req.onerror = function (event) {
                console.error("Unable to retrieve data from database!");
                if (callback) callback(false);
            };

            req.onsuccess = function (event) {
                if (req.result) {
                    if (callback) callback(true, req.result);
                }
                else {
                    if (callback) callback(null);
                }
            };
        }
        else{
            if (callback) callback(false);
        }
    });
};


OrgChart.idb.write = function(row, callback){
    OrgChart.idb.read(row.id, function(success){
        if (success == null){
            var transaction = OrgChart.idb.db.transaction([OrgChart.idb.tableName], "readwrite");
            var objectStore = transaction.objectStore(OrgChart.idb.tableName);
            var req = objectStore.add(row);

            req.onerror = function (event) {
                console.error("Unable to add data to database!");
                if (callback) callback(false);
            };

            req.onsuccess = function (event) {
                if (callback) callback(true);
            };
        }
        else {
            if (callback) callback(success);
        }
    });
};

OrgChart.idb.put = function(row, callback){
    OrgChart.idb._open(function(success){
        if (success){
            var transaction = OrgChart.idb.db.transaction([OrgChart.idb.tableName], "readwrite");
            var objectStore = transaction.objectStore(OrgChart.idb.tableName);
            var req = objectStore.put(row);

            req.onerror = function (event) {
                console.error("Unable to put data to database!");
                if (callback) callback(false);
            };


            req.onsuccess = function (event) {
                if (callback) callback(true);
            };
        }
        else{
            if (callback) callback(false);
        }
    });
};


OrgChart.idb.delete = function(id, callback){
    OrgChart.idb._open(function(success){
        if (success){
            var transaction = OrgChart.idb.db.transaction([OrgChart.idb.tableName], "readwrite");
            var objectStore = transaction.objectStore(OrgChart.idb.tableName);
            var req = objectStore.delete(id);

            req.onerror = function (event) {
                console.error("Unable to retrieve data from database!");
                if (callback) callback(false);
            };

            req.onsuccess = function (event) {
                if (!req.error) {
                    if (callback) callback(true);
                }
                else {
                    if (callback) callback(false);
                }
            };
        }
        else{
            if (callback) callback(false);
        }
    });
};



OrgChart.toolbarUI = function () {
};

OrgChart.toolbarUI.expandAllIcon = '<svg style="margin-bottom:7px;box-shadow: 0px 1px 4px rgba(0,0,0,0.3); border: 1px solid #cacaca;background-color: #f9f9f9;display: block;cursor: pointer;" width="32px" height="32px"><marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#757575" /></marker><line x1="11" y1="11" x2="6" y2="6" stroke="#757575" stroke-width="2" marker-end="url(#arrow)" /><line x1="21" y1="11" x2="26" y2="6" stroke="#757575" stroke-width="2" marker-end="url(#arrow)" /><line x1="21" y1="21" x2="26" y2="26" stroke="#757575" stroke-width="2" marker-end="url(#arrow)" /><line x1="11" y1="21" x2="6" y2="26" stroke="#757575" stroke-width="2" marker-end="url(#arrow)" /><rect x="12" y="12" width="8" height="8" fill="#757575"></rect></svg>';
OrgChart.toolbarUI.fitIcon = '<svg  style="margin-bottom:7px;box-shadow: 0px 1px 4px rgba(0,0,0,0.3); border: 1px solid #cacaca;background-color: #f9f9f9;display: block;cursor: pointer;" width="32px" height="32px"><path stroke-width="3" fill="none" stroke="#757575" d="M4,11 L4,4 L11,4"></path><path stroke-width="3" fill="none" stroke="#757575" d="M28,11 L28,4 L21,4"></path><path stroke-width="3" fill="none" stroke="#757575" d="M28,21 L28,28 L21,28"></path><path stroke-width="3" fill="none" stroke="#757575" d="M4,21 L4,28 L11,28"></path><circle cx="16" cy="16" r="5" fill="#757575"></circle></svg>';
OrgChart.toolbarUI.openFullScreenIcon = '<svg  style="margin-bottom:7px;box-shadow: 0px 1px 4px rgba(0,0,0,0.3); border: 1px solid #cacaca;background-color: #f9f9f9;display: block;cursor: pointer;" width="32px" height="32px"><path stroke-width="3" fill="none" stroke="#757575" d="M4,11 L4,4 L11,4"></path><path stroke-width="3" fill="none" stroke="#757575" d="M28,11 L28,4 L21,4"></path><path stroke-width="3" fill="none" stroke="#757575" d="M28,21 L28,28 L21,28"></path><path stroke-width="3" fill="none" stroke="#757575" d="M4,21 L4,28 L11,28"></path><line x1="5" y1="5" x2="27" y2="27" stroke-width="3" stroke="#757575"></line><line x1="5" y1="27" x2="27" y2="5" stroke-width="3" stroke="#757575"></line></svg>';
OrgChart.toolbarUI.closeFullScreenIcon = '<svg  style="margin-bottom:7px;box-shadow: 0px 1px 4px rgba(0,0,0,0.3); border: 1px solid #cacaca;background-color: #f9f9f9;display: block;cursor: pointer;" width="32px" height="32px"><path stroke-width="3" fill="none" stroke="#757575" d="M4,11 L4,4 L11,4"></path><path stroke-width="3" fill="none" stroke="#757575" d="M28,11 L28,4 L21,4"></path><path stroke-width="3" fill="none" stroke="#757575" d="M28,21 L28,28 L21,28"></path><path stroke-width="3" fill="none" stroke="#757575" d="M4,21 L4,28 L11,28"></path><rect x="11" y="11" width="10" height="10" stroke-width="3" fill="none" stroke="#757575" ></rect></svg>';
OrgChart.toolbarUI.zoomInIcon = '<svg style="box-shadow: 0px 1px 4px rgba(0,0,0,0.3); border-left: 1px solid #cacaca; border-right: 1px solid #cacaca; border-top: 1px solid #cacaca; background-color: #f9f9f9;display: block; cursor: pointer;" width="32px" height="32px" ><g><rect fill="#f9f9f9" x="0" y="0" width="32" height="32" ></rect><line x1="8" y1="16" x2="24" y2="16" stroke-width="3" stroke="#757575"></line><line x1="16" y1="8" x2="16" y2="24" stroke-width="3" stroke="#757575"></line></g><line x1="4" y1="32" x2="28" y2="32" stroke-width="1" stroke="#cacaca"></line></svg>';
OrgChart.toolbarUI.zoomOutIcon = '<svg style="box-shadow: 0px 1px 4px rgba(0,0,0,0.3); margin-bottom:7px; border-left: 1px solid #cacaca; border-right: 1px solid #cacaca; border-bottom: 1px solid #cacaca; background-color: #f9f9f9;display: block; cursor: pointer;" width="32px" height="32px" ><g><rect fill="#f9f9f9" x="0" y="0" width="32" height="32" ></rect><line x1="8" y1="16" x2="24" y2="16" stroke-width="3" stroke="#757575"></line></g></svg>';
OrgChart.toolbarUI.layoutIcon = '<svg ' + OrgChart.attr.tlbr + '="layout" style="box-shadow: 0px 1px 4px rgba(0,0,0,0.3); border: 1px solid #cacaca;background-color: #f9f9f9;display: block;cursor: pointer;" width="32px" height="32px"><path stroke-width="3" fill="none" stroke="#757575" d="M8,24 L16,14 L24,24"></path><path stroke-width="3" fill="none" stroke="#757575" d="M8,16 L16,8 L24,16"></path></svg>';

OrgChart.toolbarUI.prototype.init = function (obj, toolbar) {
    if (!toolbar){
        return;
    }
    this.obj = obj;
    this.toolbar = toolbar;

    this._visible = false;
    this.div = document.createElement("div");
    this.div.classList.add('boc-toolbar-container');
    Object.assign(this.div.style, {
        position: "absolute", padding: "3px", right: (this.obj.config.padding - 10) + "px", bottom: (this.obj.config.padding - 10) + "px"
    });

    if (toolbar.expandAll){
        this.div.innerHTML += '<div ' + OrgChart.attr.tlbr + '="expand">' + OrgChart.toolbarUI.expandAllIcon + '</div>';
    }
    if (toolbar.fit){
        this.div.innerHTML += '<div ' + OrgChart.attr.tlbr + '="fit">' + OrgChart.toolbarUI.fitIcon + '</div>';
    }
    if (toolbar.zoom){
        this.div.innerHTML += '<div ' + OrgChart.attr.tlbr + '="plus">' + OrgChart.toolbarUI.zoomInIcon + '</div>';
        this.div.innerHTML += '<div ' + OrgChart.attr.tlbr + '="minus">' + OrgChart.toolbarUI.zoomOutIcon + '</div>';
    }
    if (toolbar.layout){
        this.div.innerHTML += '<div ' + OrgChart.attr.tlbr + '="layout">' + OrgChart.toolbarUI.layoutIcon + '</div>';

        this.layouts = document.createElement("div");


        this.layouts.innerHTML =
            '<svg ' + OrgChart.attr.layout + '="normal" style="cursor: pointer;" width="110" height="100"><rect fill="#039BE5" x="35" y="0" width="50" height="27"></rect><rect fill="#F57C00" x="7" y="41" width="50" height="27"></rect><rect fill="#F57C00" x="63" y="41" width="50" height="27"></rect><line stroke="#000000" x1="60" x2="60" y1="27" y2="35" stroke-width="1"></line><line stroke="#000000" x1="32" x2="88" y1="35" y2="35" stroke-width="1"></line><line stroke="#000000" x1="32" x2="32" y1="35" y2="41" stroke-width="1"></line><line stroke="#000000" x1="88" x2="88" y1="35" y2="41" stroke-width="1"></line></svg>'
            + '<svg ' + OrgChart.attr.layout + '="treeRightOffset" style="cursor: pointer;" width="110" height="100"><rect fill="#039BE5" x="35" y="0" width="50" height="27"></rect><rect fill="#F57C00" x="40" y="41" width="50" height="27"></rect><rect fill="#F57C00" x="40" y="73" width="50" height="27"></rect><line stroke="#000000" x1="60" x2="60" y1="27" y2="35" stroke-width="1"></line><line stroke="#000000" x1="60" x2="35" y1="35" y2="35" stroke-width="1"></line><line stroke="#000000" x1="35" x2="35" y1="35" y2="86" stroke-width="1"></line><line stroke="#000000" x1="35" x2="40" y1="86" y2="86" stroke-width="1"></line><line stroke="#000000" x1="35" x2="40" y1="54" y2="54" stroke-width="1"></line></svg>'
            + '<svg ' + OrgChart.attr.layout + '="treeLeftOffset" style="cursor: pointer;" width="110" height="100"><rect fill="#039BE5" x="35" y="0" width="50" height="27"></rect><rect fill="#F57C00" x="30" y="41" width="50" height="27"></rect><rect fill="#F57C00" x="30" y="73" width="50" height="27"></rect><line stroke="#000000" x1="60" x2="60" y1="27" y2="35" stroke-width="1"></line><line stroke="#000000" x1="60" x2="85" y1="35" y2="35" stroke-width="1"></line><line stroke="#000000" x1="85" x2="85" y1="35" y2="86" stroke-width="1"></line><line stroke="#000000" x1="80" x2="85" y1="86" y2="86" stroke-width="1"></line><line stroke="#000000" x1="80" x2="85" y1="54" y2="54" stroke-width="1"></line></svg>'
            + '<svg ' + OrgChart.attr.layout + '="mixed" style="cursor: pointer;" width="110" height="100"><rect fill="#039BE5" x="35" y="0" width="50" height="27"></rect><rect fill="#F57C00" x="35" y="41" width="50" height="27"></rect><rect fill="#F57C00" x="35" y="73" width="50" height="27"></rect><line stroke="#000000" x1="60" x2="60" y1="27" y2="41" stroke-width="1"></line><line stroke="#000000" x1="60" x2="60" y1="68" y2="73" stroke-width="1"></line></svg>'
            + '<svg ' + OrgChart.attr.layout + '="tree" style="cursor: pointer;" width="110" height="100"><rect fill="#039BE5" x="35" y="0" width="50" height="27"></rect><rect fill="#F57C00" x="7" y="41" width="50" height="27"></rect><rect fill="#F57C00" x="7" y="73" width="50" height="27"></rect><rect fill="#F57C00" x="63" y="41" width="50" height="27"></rect><rect fill="#F57C00" x="63" y="73" width="50" height="27"></rect><line stroke="#000000" x1="60" x2="60" y1="27" y2="86" stroke-width="1"></line><line stroke="#000000" x1="57" x2="63" y1="54" y2="54" stroke-width="1"></line><line stroke="#000000" x1="57" x2="63" y1="86" y2="86" stroke-width="1"></line></svg>';
        this.obj.element.appendChild(this.layouts);
        Object.assign(this.layouts.style, {
            position: "absolute", width: "100%", left: "0", bottom: "-145px", "box-shadow": "0px 1px 4px rgba(0,0,0,0.3)", "background-color": "#f9f9f9", height: "123px", "padding-top": "20px", "border-top": "1px solid #cacaca"
        });
    }
    if (toolbar.fullScreen){
        this.div.innerHTML += '<div ' + OrgChart.attr.tlbr + '="fullScreen">' + OrgChart.toolbarUI.openFullScreenIcon + '</div>';
    }

    this.obj.element.appendChild(this.div);

    this.layoutBtn = this.div.querySelector('[' + OrgChart.attr.tlbr + '="layout"]');
    var plusBtn = this.div.querySelector('[' + OrgChart.attr.tlbr + '="plus"]');
    var minusBtn = this.div.querySelector('[' + OrgChart.attr.tlbr + '="minus"]');
    var fitBtn = this.div.querySelector('[' + OrgChart.attr.tlbr + '="fit"]');
    var fullScreenBtn = this.div.querySelector('[' + OrgChart.attr.tlbr + '="fullScreen"]');
    var expandBtn = this.div.querySelector('[' + OrgChart.attr.tlbr + '="expand"]');


    var that = this;
    if (plusBtn){
        plusBtn.addEventListener("click", function () {
            that.obj.zoom(true, null, true);
        });
    }

    if (minusBtn){
        minusBtn.addEventListener("click", function () {
            that.obj.zoom(false, null, true);
        });
    }

    if (fitBtn){
        fitBtn.addEventListener("click", function () {
            that.obj.fit();
        });
    }

    if (fullScreenBtn){
        fullScreenBtn.addEventListener("click", function () {
            that.obj.toggleFullScreen();
        });
    }


    if (expandBtn){
        expandBtn.addEventListener("click", function () {
            that.obj.expand(null, "all");
        });
    }


    if (this.layoutBtn){
        this.layoutBtn.addEventListener("click", function () {
            if (that._visible) {
                that.hideLayout();
            }
            else {
                that.showLayout();
            }
        });
    }


    if (this.layouts){
        this.layouts.addEventListener("click", function (e) {
            var l = e.target;


            while (l) {
                if (l.hasAttribute && l.hasAttribute(OrgChart.attr.layout)) {
                    l = l.getAttribute(OrgChart.attr.layout);
                    that.obj.setLayout(OrgChart[l]);
                    break;
                }
                l = l.parentNode;
            }
        });
    }
};

OrgChart.toolbarUI.prototype.showLayout = function () {
    this._visible = true;


    this.layoutBtn.style.transform = "rotate(180deg) translateX(0px) translateY(0px)";

    OrgChart.animate(this.div,
        { bottom: this.obj.config.padding - 10 },
        { bottom: this.obj.config.padding + 135 },
        this.obj.config.anim.duration,
        this.obj.config.anim.func
    );

    OrgChart.animate(this.layouts,
        { bottom: -145 },
        { bottom: 0 },
        this.obj.config.anim.duration,
        this.obj.config.anim.func
    );
};

OrgChart.toolbarUI.prototype.hideLayout = function () {
    this._visible = false;
    this.layoutBtn.style.transform = "rotate(0deg) translateX(0px) translateY(0px)";

    OrgChart.animate(this.div,
        { bottom: this.obj.config.padding + 135},
        { bottom: this.obj.config.padding - 10 },
        this.obj.config.anim.duration,
        this.obj.config.anim.func
    );

    OrgChart.animate(this.layouts,
        { bottom: 0},
        { bottom: -145  },
        this.obj.config.anim.duration,
        this.obj.config.anim.func
    );
};


OrgChart.notifierUI = function () {
};

OrgChart.notifierUI.prototype.init = function (obj) {
    this.obj = obj;
};

OrgChart.notifierUI.prototype.show = function (message, color) {
    if (message == undefined){
        return false;
    }
    if (message == 1){
        message = OrgChart.MAX_NODES_MESS;
        color = "#FFCA28";
    }

    if (message == 2){
        message = OrgChart.OFFLINE_MESS;
        color = "#FFCA28";
    }


    var div = document.createElement("div");
    div.innerHTML = message;

    Object.assign(div.style, {
        position: "absolute", "background-color": color, color: "#ffffff", padding: "15px", "border-radius": "40px", opacity: 0, "overflow": "hidden", "white-space": "nowrap", "text-align": "center"
    });

    this.obj.element.appendChild(div);

    var left = ((this.obj.width() / 2) - (div.offsetWidth / 2));
    var top = ((this.obj.height() / 2) - (div.offsetHeight / 2));
    div.style.left = left + "px";
    div.style.top = top + "px";
    var orWidth = div.offsetWidth;
    div.style.width = "20px";
    OrgChart.animate(div, {opacity: 0, width: 10}, {opacity: 1, width: orWidth}, this.obj.config.anim.duration, this.obj.config.anim.func);
    return true;
};




OrgChart.icon = {};

OrgChart.icon.png = function (w, h, c) {
    return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 550.801 550.801">'
        + '<path fill="' + c + '" d="M146.747,276.708c0-13.998-9.711-22.352-26.887-22.352c-6.99,0-11.726,0.675-14.204,1.355v44.927 c2.932,0.676,6.539,0.896,11.52,0.896C135.449,301.546,146.747,292.28,146.747,276.708z"/>'
        + '<path fill="' + c + '" d="M488.426,197.019H475.2v-63.816c0-0.398-0.063-0.799-0.116-1.202c-0.021-2.534-0.827-5.023-2.562-6.995L366.325,3.694 c-0.032-0.031-0.063-0.042-0.085-0.076c-0.633-0.707-1.371-1.295-2.151-1.804c-0.231-0.155-0.464-0.285-0.706-0.419 c-0.676-0.369-1.393-0.675-2.131-0.896c-0.2-0.056-0.38-0.138-0.58-0.19C359.87,0.119,359.037,0,358.193,0H97.2 c-11.918,0-21.6,9.693-21.6,21.601v175.413H62.377c-17.049,0-30.873,13.818-30.873,30.873v160.545 c0,17.043,13.824,30.87,30.873,30.87h13.224V529.2c0,11.907,9.682,21.601,21.6,21.601h356.4c11.907,0,21.6-9.693,21.6-21.601 V419.302h13.226c17.044,0,30.871-13.827,30.871-30.87v-160.54C519.297,210.838,505.47,197.019,488.426,197.019z M97.2,21.605 h250.193v110.513c0,5.967,4.841,10.8,10.8,10.8h95.407v54.108H97.2V21.605z M234.344,335.86v45.831h-31.601V229.524h40.184 l31.611,55.759c9.025,16.031,18.064,34.983,24.825,52.154h0.675c-2.257-20.103-2.933-40.643-2.933-63.44v-44.473h31.614v152.167 h-36.117l-32.516-58.703c-9.049-16.253-18.971-35.892-26.438-53.727l-0.665,0.222C233.906,289.58,234.344,311.027,234.344,335.86z M71.556,381.691V231.56c10.613-1.804,25.516-3.159,46.506-3.159c21.215,0,36.353,4.061,46.509,12.192 c9.698,7.673,16.255,20.313,16.255,35.219c0,14.897-4.959,27.549-13.999,36.123c-11.738,11.063-29.123,16.031-49.441,16.031 c-4.522,0-8.593-0.231-11.736-0.675v54.411H71.556V381.691z M453.601,523.353H97.2V419.302h356.4V523.353z M485.652,374.688 c-10.61,3.607-30.713,8.585-50.805,8.585c-27.759,0-47.872-7.003-61.857-20.545c-13.995-13.1-21.684-32.97-21.452-55.318 c0.222-50.569,37.03-79.463,86.917-79.463c19.644,0,34.783,3.829,42.219,7.446l-7.214,27.543c-8.369-3.617-18.752-6.55-35.458-6.55 c-28.656,0-50.341,16.256-50.341,49.22c0,31.382,19.649,49.892,47.872,49.892c7.895,0,14.218-0.901,16.934-2.257v-31.835h-23.493 v-26.869h56.679V374.688z"/>'
        + '</svg>';
};

OrgChart.icon.pdf = function (w, h, c) {
    return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 550.801 550.801">'
        + '<path fill="' + c + '" d="M160.381,282.225c0-14.832-10.299-23.684-28.474-23.684c-7.414,0-12.437,0.715-15.071,1.432V307.6 c3.114,0.707,6.942,0.949,12.192,0.949C148.419,308.549,160.381,298.74,160.381,282.225z"/>'
        + '<path fill="' + c + '" d="M272.875,259.019c-8.145,0-13.397,0.717-16.519,1.435v105.523c3.116,0.729,8.142,0.729,12.69,0.729 c33.017,0.231,54.554-17.946,54.554-56.474C323.842,276.719,304.215,259.019,272.875,259.019z"/>'
        + '<path fill="' + c + '" d="M488.426,197.019H475.2v-63.816c0-0.398-0.063-0.799-0.116-1.202c-0.021-2.534-0.827-5.023-2.562-6.995L366.325,3.694 c-0.032-0.031-0.063-0.042-0.085-0.076c-0.633-0.707-1.371-1.295-2.151-1.804c-0.231-0.155-0.464-0.285-0.706-0.419 c-0.676-0.369-1.393-0.675-2.131-0.896c-0.2-0.056-0.38-0.138-0.58-0.19C359.87,0.119,359.037,0,358.193,0H97.2 c-11.918,0-21.6,9.693-21.6,21.601v175.413H62.377c-17.049,0-30.873,13.818-30.873,30.873v160.545 c0,17.043,13.824,30.87,30.873,30.87h13.224V529.2c0,11.907,9.682,21.601,21.6,21.601h356.4c11.907,0,21.6-9.693,21.6-21.601 V419.302h13.226c17.044,0,30.871-13.827,30.871-30.87v-160.54C519.297,210.838,505.47,197.019,488.426,197.019z M97.2,21.605 h250.193v110.513c0,5.967,4.841,10.8,10.8,10.8h95.407v54.108H97.2V21.605z M362.359,309.023c0,30.876-11.243,52.165-26.82,65.333 c-16.971,14.117-42.82,20.814-74.396,20.814c-18.9,0-32.297-1.197-41.401-2.389V234.365c13.399-2.149,30.878-3.346,49.304-3.346 c30.612,0,50.478,5.508,66.039,17.226C351.828,260.69,362.359,280.547,362.359,309.023z M80.7,393.499V234.365 c11.241-1.904,27.042-3.346,49.296-3.346c22.491,0,38.527,4.308,49.291,12.928c10.292,8.131,17.215,21.534,17.215,37.328 c0,15.799-5.25,29.198-14.829,38.285c-12.442,11.728-30.865,16.996-52.407,16.996c-4.778,0-9.1-0.243-12.435-0.723v57.67H80.7 V393.499z M453.601,523.353H97.2V419.302h356.4V523.353z M484.898,262.127h-61.989v36.851h57.913v29.674h-57.913v64.848h-36.593 V232.216h98.582V262.127z"/>'
    + '</svg>';
};

OrgChart.icon.svg = function (w, h, c) {
    return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 550.801 550.801">'
        + '<path fill="' + c + '" d="M488.426,197.019H475.2v-63.816c0-0.398-0.063-0.799-0.116-1.202c-0.021-2.534-0.827-5.023-2.562-6.995L366.325,3.694 c-0.032-0.031-0.063-0.042-0.085-0.076c-0.633-0.707-1.371-1.295-2.151-1.804c-0.231-0.155-0.464-0.285-0.706-0.419 c-0.676-0.369-1.393-0.675-2.131-0.896c-0.2-0.056-0.38-0.138-0.58-0.19C359.87,0.119,359.037,0,358.193,0H97.2 c-11.918,0-21.6,9.693-21.6,21.601v175.413H62.377c-17.049,0-30.873,13.818-30.873,30.873v160.545 c0,17.043,13.824,30.87,30.873,30.87h13.224V529.2c0,11.907,9.682,21.601,21.6,21.601h356.4c11.907,0,21.6-9.693,21.6-21.601 V419.302h13.226c17.044,0,30.871-13.827,30.871-30.87v-160.54C519.297,210.838,505.47,197.019,488.426,197.019z M97.2,21.605 h250.193v110.513c0,5.967,4.841,10.8,10.8,10.8h95.407v54.108H97.2V21.605z M338.871,225.672L284.545,386.96h-42.591 l-51.69-161.288h39.967l19.617,68.196c5.508,19.143,10.531,37.567,14.36,57.67h0.717c4.061-19.385,9.089-38.527,14.592-56.953 l20.585-68.918h38.77V225.672z M68.458,379.54l7.415-30.153c9.811,5.021,24.888,10.051,40.439,10.051 c16.751,0,25.607-6.935,25.607-17.465c0-10.052-7.662-15.795-27.05-22.734c-26.8-9.328-44.263-24.168-44.263-47.611 c0-27.524,22.971-48.579,61.014-48.579c18.188,0,31.591,3.823,41.159,8.131l-8.126,29.437c-6.465-3.116-17.945-7.657-33.745-7.657 c-15.791,0-23.454,7.183-23.454,15.552c0,10.296,9.089,14.842,29.917,22.731c28.468,10.536,41.871,25.365,41.871,48.094 c0,27.042-20.812,50.013-65.09,50.013C95.731,389.349,77.538,384.571,68.458,379.54z M453.601,523.353H97.2V419.302h356.4V523.353z M488.911,379.54c-11.243,3.823-32.537,9.103-53.831,9.103c-29.437,0-50.73-7.426-65.57-21.779 c-14.839-13.875-22.971-34.942-22.738-58.625c0.253-53.604,39.255-84.235,92.137-84.235c20.81,0,36.852,4.073,44.74,7.896 l-7.657,29.202c-8.859-3.829-19.849-6.95-37.567-6.95c-30.396,0-53.357,17.233-53.357,52.173c0,33.265,20.81,52.882,50.73,52.882 c8.375,0,15.072-0.96,17.94-2.395v-33.745h-24.875v-28.471h60.049V379.54L488.911,379.54z" />'
        + '</svg>';
};

OrgChart.icon.csv = function (w, h, c) {
    return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 548.29 548.291" >'
     + '<path fill="' + c + '" d="M486.2,196.121h-13.164V132.59c0-0.399-0.064-0.795-0.116-1.2c-0.021-2.52-0.824-5-2.551-6.96L364.656,3.677 c-0.031-0.034-0.064-0.044-0.085-0.075c-0.629-0.707-1.364-1.292-2.141-1.796c-0.231-0.157-0.462-0.286-0.704-0.419 c-0.672-0.365-1.386-0.672-2.121-0.893c-0.199-0.052-0.377-0.134-0.576-0.188C358.229,0.118,357.4,0,356.562,0H96.757 C84.893,0,75.256,9.649,75.256,21.502v174.613H62.093c-16.972,0-30.733,13.756-30.733,30.73v159.81 c0,16.966,13.761,30.736,30.733,30.736h13.163V526.79c0,11.854,9.637,21.501,21.501,21.501h354.777 c11.853,0,21.502-9.647,21.502-21.501V417.392H486.2c16.966,0,30.729-13.764,30.729-30.731v-159.81 C516.93,209.872,503.166,196.121,486.2,196.121z M96.757,21.502h249.053v110.006c0,5.94,4.818,10.751,10.751,10.751h94.973v53.861 H96.757V21.502z M258.618,313.18c-26.68-9.291-44.063-24.053-44.063-47.389c0-27.404,22.861-48.368,60.733-48.368 c18.107,0,31.447,3.811,40.968,8.107l-8.09,29.3c-6.43-3.107-17.862-7.632-33.59-7.632c-15.717,0-23.339,7.149-23.339,15.485 c0,10.247,9.047,14.769,29.78,22.632c28.341,10.479,41.681,25.239,41.681,47.874c0,26.909-20.721,49.786-64.792,49.786 c-18.338,0-36.449-4.776-45.497-9.77l7.38-30.016c9.772,5.014,24.775,10.006,40.264,10.006c16.671,0,25.488-6.908,25.488-17.396 C285.536,325.789,277.909,320.078,258.618,313.18z M69.474,302.692c0-54.781,39.074-85.269,87.654-85.269 c18.822,0,33.113,3.811,39.549,7.149l-7.392,28.816c-7.38-3.084-17.632-5.939-30.491-5.939c-28.822,0-51.206,17.375-51.206,53.099 c0,32.158,19.051,52.4,51.456,52.4c10.947,0,23.097-2.378,30.241-5.238l5.483,28.346c-6.672,3.34-21.674,6.919-41.208,6.919 C98.06,382.976,69.474,348.424,69.474,302.692z M451.534,520.962H96.757v-103.57h354.777V520.962z M427.518,380.583h-42.399 l-51.45-160.536h39.787l19.526,67.894c5.479,19.046,10.479,37.386,14.299,57.397h0.709c4.048-19.298,9.045-38.352,14.526-56.693 l20.487-68.598h38.599L427.518,380.583z" />'
        + '</svg>';
};

OrgChart.icon.excel = function (w, h, c) {
    return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 512 512">'
        + '<path fill="#ECEFF1" d="M496,432.011H272c-8.832,0-16-7.168-16-16s0-311.168,0-320s7.168-16,16-16h224 c8.832,0,16,7.168,16,16v320C512,424.843,504.832,432.011,496,432.011z" />'
        + '<path fill="' + c + '" d="M336,176.011h-64c-8.832,0-16-7.168-16-16s7.168-16,16-16h64c8.832,0,16,7.168,16,16 S344.832,176.011,336,176.011z" />'
        + '<path fill="' + c + '" d="M336,240.011h-64c-8.832,0-16-7.168-16-16s7.168-16,16-16h64c8.832,0,16,7.168,16,16 S344.832,240.011,336,240.011z" />'
        + '<path fill="' + c + '" d="M336,304.011h-64c-8.832,0-16-7.168-16-16s7.168-16,16-16h64c8.832,0,16,7.168,16,16 S344.832,304.011,336,304.011z" />'
        + '<path fill="' + c + '" d="M336,368.011h-64c-8.832,0-16-7.168-16-16s7.168-16,16-16h64c8.832,0,16,7.168,16,16 S344.832,368.011,336,368.011z" />'
        + '<path fill="' + c + '" d="M432,176.011h-32c-8.832,0-16-7.168-16-16s7.168-16,16-16h32c8.832,0,16,7.168,16,16 S440.832,176.011,432,176.011z" />'
        + '<path fill="' + c + '" d="M432,240.011h-32c-8.832,0-16-7.168-16-16s7.168-16,16-16h32c8.832,0,16,7.168,16,16 S440.832,240.011,432,240.011z" />'
        + '<path fill="' + c + '" d="M432,304.011h-32c-8.832,0-16-7.168-16-16s7.168-16,16-16h32c8.832,0,16,7.168,16,16 S440.832,304.011,432,304.011z" />'
        + '<path fill="' + c + '" d="M432,368.011h-32c-8.832,0-16-7.168-16-16s7.168-16,16-16h32c8.832,0,16,7.168,16,16 S440.832,368.011,432,368.011z" />'
        + '<path fill="' + c + '"  d="M282.208,19.691c-3.648-3.04-8.544-4.352-13.152-3.392l-256,48C5.472,65.707,0,72.299,0,80.011v352 c0,7.68,5.472,14.304,13.056,15.712l256,48c0.96,0.192,1.952,0.288,2.944,0.288c3.712,0,7.328-1.28,10.208-3.68 c3.68-3.04,5.792-7.584,5.792-12.32v-448C288,27.243,285.888,22.731,282.208,19.691z" />'
        + '<path fill="#FAFAFA" d="M220.032,309.483l-50.592-57.824l51.168-65.792c5.44-6.976,4.16-17.024-2.784-22.464 c-6.944-5.44-16.992-4.16-22.464,2.784l-47.392,60.928l-39.936-45.632c-5.856-6.72-15.968-7.328-22.56-1.504 c-6.656,5.824-7.328,15.936-1.504,22.56l44,50.304L83.36,310.187c-5.44,6.976-4.16,17.024,2.784,22.464 c2.944,2.272,6.432,3.36,9.856,3.36c4.768,0,9.472-2.112,12.64-6.176l40.8-52.48l46.528,53.152 c3.168,3.648,7.584,5.504,12.032,5.504c3.744,0,7.488-1.312,10.528-3.968C225.184,326.219,225.856,316.107,220.032,309.483z" />'
        + '</svg>';
};


OrgChart.icon.edit = function (w, h, c) {
    return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 528.899 528.899">'
        + '<path fill="' + c + '" d="M328.883,89.125l107.59,107.589l-272.34,272.34L56.604,361.465L328.883,89.125z M518.113,63.177l-47.981-47.981 c-18.543-18.543-48.653-18.543-67.259,0l-45.961,45.961l107.59,107.59l53.611-53.611 C532.495,100.753,532.495,77.559,518.113,63.177z M0.3,512.69c-1.958,8.812,5.998,16.708,14.811,14.565l119.891-29.069 L27.473,390.597L0.3,512.69z" />'
        + '</svg>';
};

OrgChart.icon.details = function (w, h, c) {
    return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 512 512">'
        + '<path fill="' + c + '" d="M447.933,103.629c-0.034-3.076-1.224-6.09-3.485-8.352L352.683,3.511c-0.004-0.004-0.007-0.005-0.011-0.008 C350.505,1.338,347.511,0,344.206,0H89.278C75.361,0,64.04,11.32,64.04,25.237v461.525c0,13.916,11.32,25.237,25.237,25.237 h333.444c13.916,0,25.237-11.32,25.237-25.237V103.753C447.96,103.709,447.937,103.672,447.933,103.629z M356.194,40.931 l50.834,50.834h-49.572c-0.695,0-1.262-0.567-1.262-1.262V40.931z M423.983,486.763c0,0.695-0.566,1.261-1.261,1.261H89.278 c-0.695,0-1.261-0.566-1.261-1.261V25.237c0-0.695,0.566-1.261,1.261-1.261h242.94v66.527c0,13.916,11.322,25.239,25.239,25.239 h66.527V486.763z"/>'
        + '<path fill="' + c + '" d="M362.088,164.014H149.912c-6.62,0-11.988,5.367-11.988,11.988c0,6.62,5.368,11.988,11.988,11.988h212.175 c6.62,0,11.988-5.368,11.988-11.988C374.076,169.381,368.707,164.014,362.088,164.014z"/>'
        + '<path fill="' + c + '" d="M362.088,236.353H149.912c-6.62,0-11.988,5.368-11.988,11.988c0,6.62,5.368,11.988,11.988,11.988h212.175 c6.62,0,11.988-5.368,11.988-11.988C374.076,241.721,368.707,236.353,362.088,236.353z"/>'
        + '<path fill="' + c + '" d="M362.088,308.691H149.912c-6.62,0-11.988,5.368-11.988,11.988c0,6.621,5.368,11.988,11.988,11.988h212.175 c6.62,0,11.988-5.367,11.988-11.988C374.076,314.06,368.707,308.691,362.088,308.691z"/>'
        + '<path fill="' + c + '" d="M256,381.031H149.912c-6.62,0-11.988,5.368-11.988,11.988c0,6.621,5.368,11.988,11.988,11.988H256 c6.62,0,11.988-5.367,11.988-11.988C267.988,386.398,262.62,381.031,256,381.031z"/>'
        + '</svg>';
};

OrgChart.icon.remove = function (w, h, c) {
    return '<svg width="' + w + '" height="' + h + '"  viewBox="0 0 900.5 900.5">'
        + '<path fill="' + c + '" d="M176.415,880.5c0,11.046,8.954,20,20,20h507.67c11.046,0,20-8.954,20-20V232.487h-547.67V880.5L176.415,880.5z M562.75,342.766h75v436.029h-75V342.766z M412.75,342.766h75v436.029h-75V342.766z M262.75,342.766h75v436.029h-75V342.766z"/>'
        + '<path fill="' + c + '" d="M618.825,91.911V20c0-11.046-8.954-20-20-20h-297.15c-11.046,0-20,8.954-20,20v71.911v12.5v12.5H141.874 c-11.046,0-20,8.954-20,20v50.576c0,11.045,8.954,20,20,20h34.541h547.67h34.541c11.046,0,20-8.955,20-20v-50.576 c0-11.046-8.954-20-20-20H618.825v-12.5V91.911z M543.825,112.799h-187.15v-8.389v-12.5V75h187.15v16.911v12.5V112.799z"/>'
        + '</svg>';
};

OrgChart.icon.add = function (w, h, c) {
    return '<svg width="' + w + '" height="' + h + '"   viewBox="0 0 922 922">'
        + '<path fill="' + c + '" d="M922,453V81c0-11.046-8.954-20-20-20H410c-11.045,0-20,8.954-20,20v149h318c24.812,0,45,20.187,45,45v198h149 C913.046,473.001,922,464.046,922,453z" />'
        + '<path fill="' + c + '" d="M557,667.001h151c11.046,0,20-8.954,20-20v-174v-198c0-11.046-8.954-20-20-20H390H216c-11.045,0-20,8.954-20,20v149h194 h122c24.812,0,45,20.187,45,45v4V667.001z" />'
        + '<path fill="' + c + '" d="M0,469v372c0,11.046,8.955,20,20,20h492c11.046,0,20-8.954,20-20V692v-12.501V667V473v-4c0-11.046-8.954-20-20-20H390H196 h-12.5H171H20C8.955,449,0,457.955,0,469z" />'
        + '</svg>';
};


OrgChart.icon.search = function (w, h, c) {
    return '<svg width="' + w + '" height="' + h + '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 485.213 485.213">'
        + '<path fill="' + c + '" d="M471.882,407.567L360.567,296.243c-16.586,25.795-38.536,47.734-64.331,64.321l111.324,111.324 c17.772,17.768,46.587,17.768,64.321,0C489.654,454.149,489.654,425.334,471.882,407.567z" />'
        + '<path fill="' + c + '" d="M363.909,181.955C363.909,81.473,282.44,0,181.956,0C81.474,0,0.001,81.473,0.001,181.955s81.473,181.951,181.955,181.951 C282.44,363.906,363.909,282.437,363.909,181.955z M181.956,318.416c-75.252,0-136.465-61.208-136.465-136.46 c0-75.252,61.213-136.465,136.465-136.465c75.25,0,136.468,61.213,136.468,136.465 C318.424,257.208,257.206,318.416,181.956,318.416z" />'
        + '<path fill="' + c + '" d="M75.817,181.955h30.322c0-41.803,34.014-75.814,75.816-75.814V75.816C123.438,75.816,75.817,123.437,75.817,181.955z" />'
        + '</svg>';
};



OrgChart.icon.xml = function (w, h, c) {
    return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 550.801 550.801"><path fill="' + c + '"  d="M488.426,197.019H475.2v-63.816c0-0.401-0.063-0.799-0.116-1.205c-0.021-2.534-0.827-5.023-2.562-6.992L366.325,3.691 c-0.032-0.031-0.063-0.042-0.085-0.073c-0.633-0.707-1.371-1.298-2.151-1.804c-0.231-0.158-0.464-0.287-0.706-0.422 c-0.676-0.366-1.393-0.675-2.131-0.896c-0.2-0.053-0.38-0.135-0.58-0.19C359.87,0.119,359.037,0,358.193,0H97.2 c-11.918,0-21.6,9.693-21.6,21.601v175.413H62.377c-17.049,0-30.873,13.818-30.873,30.87v160.542 c0,17.044,13.824,30.876,30.873,30.876h13.224V529.2c0,11.907,9.682,21.601,21.6,21.601h356.4c11.907,0,21.6-9.693,21.6-21.601 V419.302h13.226c17.044,0,30.871-13.827,30.871-30.87V227.89C519.297,210.838,505.47,197.019,488.426,197.019z M97.2,21.605 h250.193v110.51c0,5.967,4.841,10.8,10.8,10.8h95.407v54.108H97.2V21.605z M369.531,374.53h-32.058l-2.156-55.519 c-0.644-17.434-1.298-38.518-1.298-59.611h-0.633c-4.514,18.516-10.547,39.166-16.137,56.162l-17.645,56.601h-25.618 l-15.494-56.157c-4.725-16.996-9.671-37.658-13.123-56.6h-0.43c-0.854,19.585-1.508,41.961-2.586,60.038l-2.576,55.086h-30.343 l9.26-145.035h43.677l14.207,48.421c4.517,16.774,9.041,34.847,12.258,51.843h0.654c4.081-16.77,9.038-35.923,13.774-52.064 l15.493-48.199h42.82L369.531,374.53z M69.992,374.53l41.955-73.385l-40.444-71.65h37.655l12.688,26.465 c4.316,8.828,7.533,15.928,10.99,24.092h0.422c3.438-9.242,6.23-15.694,9.893-24.092l12.274-26.465h37.434l-40.89,70.796 l43.044,74.239h-37.866l-13.134-26.257c-5.376-10.108-8.817-17.639-12.909-26.04h-0.433c-3.009,8.401-6.674,15.932-11.19,26.04 l-12.042,26.257H69.992z M453.601,523.353H97.2V419.302h356.4V523.353z M485.325,374.53h-90.608V229.495h32.933v117.497h57.682 v27.538H485.325z"/></svg>';
};

OrgChart.icon.link = function (w, h, c) {
    return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 512.092 512.092"  >'
        + '<path fill="' + c + '" d="M312.453,199.601c-6.066-6.102-12.792-11.511-20.053-16.128c-19.232-12.315-41.59-18.859-64.427-18.859 c-31.697-0.059-62.106,12.535-84.48,34.987L34.949,308.23c-22.336,22.379-34.89,52.7-34.91,84.318 c-0.042,65.98,53.41,119.501,119.39,119.543c31.648,0.11,62.029-12.424,84.395-34.816l89.6-89.6 c1.628-1.614,2.537-3.816,2.524-6.108c-0.027-4.713-3.87-8.511-8.583-8.484h-3.413c-18.72,0.066-37.273-3.529-54.613-10.581 c-3.195-1.315-6.867-0.573-9.301,1.877l-64.427,64.512c-20.006,20.006-52.442,20.006-72.448,0 c-20.006-20.006-20.006-52.442,0-72.448l108.971-108.885c19.99-19.965,52.373-19.965,72.363,0 c13.472,12.679,34.486,12.679,47.957,0c5.796-5.801,9.31-13.495,9.899-21.675C322.976,216.108,319.371,206.535,312.453,199.601z" />'
        + '<path fill="' + c + '" d="M477.061,34.993c-46.657-46.657-122.303-46.657-168.96,0l-89.515,89.429c-2.458,2.47-3.167,6.185-1.792,9.387 c1.359,3.211,4.535,5.272,8.021,5.205h3.157c18.698-0.034,37.221,3.589,54.528,10.667c3.195,1.315,6.867,0.573,9.301-1.877 l64.256-64.171c20.006-20.006,52.442-20.006,72.448,0c20.006,20.006,20.006,52.442,0,72.448l-80.043,79.957l-0.683,0.768 l-27.989,27.819c-19.99,19.965-52.373,19.965-72.363,0c-13.472-12.679-34.486-12.679-47.957,0 c-5.833,5.845-9.35,13.606-9.899,21.845c-0.624,9.775,2.981,19.348,9.899,26.283c9.877,9.919,21.433,18.008,34.133,23.893 c1.792,0.853,3.584,1.536,5.376,2.304c1.792,0.768,3.669,1.365,5.461,2.048c1.792,0.683,3.669,1.28,5.461,1.792l5.035,1.365 c3.413,0.853,6.827,1.536,10.325,2.133c4.214,0.626,8.458,1.025,12.715,1.195h5.973h0.512l5.12-0.597 c1.877-0.085,3.84-0.512,6.059-0.512h2.901l5.888-0.853l2.731-0.512l4.949-1.024h0.939c20.961-5.265,40.101-16.118,55.381-31.403 l108.629-108.629C523.718,157.296,523.718,81.65,477.061,34.993z" />'
    + '</svg>';
};

OrgChart.icon.happy = function (w, h, c) {
    return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 512 512">'
    + '<path fill="' + c + '" d="M256,0C114.615,0,0,114.615,0,256s114.615,256,256,256s256-114.615,256-256S397.385,0,256,0z M256,480 C132.288,480,32,379.712,32,256S132.288,32,256,32s224,100.288,224,224S379.712,480,256,480z"/>'
    + '<path fill="' + c + '" d="M176,176c17.673,0,32,14.327,32,32h32c0-35.346-28.654-64-64-64c-35.346,0-64,28.654-64,64h32 C144,190.327,158.327,176,176,176z"/>'
    + '<path fill="' + c + '" d="M336,144c-35.346,0-64,28.654-64,64h32c0-17.673,14.327-32,32-32c17.673,0,32,14.327,32,32h32 C400,172.654,371.346,144,336,144z"/>'
    + '<path fill="' + c + '" d="M256,368c-53.019,0-96-42.981-96-96h-32c0,70.692,57.308,128,128,128s128-57.308,128-128h-32 C352,325.019,309.019,368,256,368z"/>'
    + '</svg>';
};

OrgChart.icon.sad = function (w, h, c) {
    return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 512 512">'
    + '<path fill="' + c + '" d="M256,0C114.615,0,0,114.615,0,256s114.615,256,256,256s256-114.615,256-256S397.385,0,256,0z M256,480 C132.288,480,32,379.712,32,256S132.288,32,256,32s224,100.288,224,224S379.712,480,256,480z"/>'
    + '<path fill="' + c + '" d="M336,192c-17.673,0-32-14.327-32-32h-32c0,35.346,28.654,64,64,64c35.346,0,64-28.654,64-64h-32 C368,177.673,353.673,192,336,192z"/>'
    + '<path fill="' + c + '" d="M176,224c35.346,0,64-28.654,64-64h-32c0,17.673-14.327,32-32,32s-32-14.327-32-32h-32C112,195.346,140.654,224,176,224z "/>'
    + '<path fill="' + c + '" d="M256,256c-70.692,0-128,57.308-128,128h32c0-53.019,42.981-96,96-96s96,42.981,96,96h32C384,313.308,326.692,256,256,256 z"/>'
    + '</svg>';
};



OrgChart.icon.share = function (w, h, c, x, y) {
    if (OrgChart.isNEU(x)) x = 0;
    if (OrgChart.isNEU(y)) y = 0;
    return `<svg width="${w}" height="${h}" x="${x}" y="${y}" viewBox="0 0 512 512">
                <path fill="${c}" d="M406,332c-29.641,0-55.761,14.581-72.167,36.755L191.99,296.124c2.355-8.027,4.01-16.346,4.01-25.124
                    c0-11.906-2.441-23.225-6.658-33.636l148.445-89.328C354.307,167.424,378.589,180,406,180c49.629,0,90-40.371,90-90
                    c0-49.629-40.371-90-90-90c-49.629,0-90,40.371-90,90c0,11.437,2.355,22.286,6.262,32.358l-148.887,89.59
                    C156.869,193.136,132.937,181,106,181c-49.629,0-90,40.371-90,90c0,49.629,40.371,90,90,90c30.13,0,56.691-15.009,73.035-37.806
                    l141.376,72.395C317.807,403.995,316,412.75,316,422c0,49.629,40.371,90,90,90c49.629,0,90-40.371,90-90
                    C496,372.371,455.629,332,406,332z"/>
                </svg>`;
}

OrgChart.icon.user = function (w, h, c, x, y) {
    if (OrgChart.isNEU(x)) x = 0;
    if (OrgChart.isNEU(y)) y = 0;
    return `<svg width="${w}" height="${h}" x="${x}" y="${y}" viewBox="0 0 24 24">
                <path fill="${c}" d="M12 11.796C14.7189 11.796 16.9231 9.60308 16.9231 6.89801C16.9231 4.19294 14.7189 2.00005 12 2.00005C9.28106 2.00005 7.07692 4.19294 7.07692 6.89801C7.07692 9.60308 9.28106 11.796 12 11.796Z" fill="#030D45"/>
                <path fill="${c}" d="M14.5641 13.8369H9.4359C6.46154 13.8369 4 16.2859 4 19.245C4 19.9593 4.30769 20.5716 4.92308 20.8777C5.84615 21.3879 7.89744 22.0001 12 22.0001C16.1026 22.0001 18.1538 21.3879 19.0769 20.8777C19.5897 20.5716 20 19.9593 20 19.245C20 16.1838 17.5385 13.8369 14.5641 13.8369Z" fill="#030D45"/>
            </svg>`;
};






OrgChart.prototype.exportPDFProfile = function (options, callback) {
    options = this._defaultExportProfileOptions(options, 'pdf');
    this._exportProfile(options, callback);
};

OrgChart.prototype.exportPDFPreview = function (options) {
    OrgChart.pdfPrevUI.show(this, options);
};

OrgChart.prototype.exportPNGProfile = function (options, callback) {
    options = this._defaultExportProfileOptions(options, 'png');
    this._exportProfile(options, callback);
};

OrgChart.prototype.shareProfile = function (id) {
    var content;
    if(typeof id === 'object'){
        content = id;
        id = content.focusId;
    }
    else{
        content = this.editUI.content(id, true, true, '100%', true)
    }

    var url = new URL(window.location.href);
    url.searchParams.append('nodeId', id);

    var shareData = {
        title: content.title,
        text: content.shareText,
        url: url.href
    };

    try {
        navigator.share(shareData)
    }
    catch(err) {
        console.error('error: ' + err);
    }
};

OrgChart.prototype.exportPDF = function (options, callback) {
    options = this._defaultExportOptions(options, 'pdf');
    this._export(options, callback);
};


OrgChart.prototype.exportPNG = function (options, callback) {
    options = this._defaultExportOptions(options, 'png');
    this._export(options, callback);
};

OrgChart.prototype.exportSVG = function (options, callback) {
    options = this._defaultExportOptions(options, 'svg');
    this._export(options, callback);
};

OrgChart.prototype._defaultExportOptions = function (options, type) {
    if (options == undefined) {
        options = {};
    }
    if (type == 'svg') {
        options.ext = "svg";
        options.mime = "image/svg+xml";
    }
    else if (type == 'pdf') {
        options.mime = "application/pdf";
        options.ext = 'pdf';
    }
    else if (type == 'png') {
        options.mime = "image/png";
        options.ext = 'png';
    }
    if (options.margin == undefined) {
        options.margin = [50, 40, 50, 40];
    }
    if (options.padding == undefined) {
        options.padding = 0;
    }
    if (options.landscape == undefined) {
        options.landscape = false;
    }
    if (options.filename == undefined) {
        options.filename = "OrgChart." + options.ext;
    }
    if (options.scale == undefined) {
        options.scale = 'fit';
    }
    if (options.format == undefined) {
        options.format = 'fit';
    }
    if (options.header == undefined) {
        options.header = '';
    }
    if (type == 'pdf' && options.footer == undefined) {
        options.footer = 'Page {current-page} of {total-pages}';
    }
    else if (options.footer == undefined) {
        options.footer = '';
    }
    if (options.openInNewTab == undefined) {
        options.openInNewTab = false;
    }
    if (options.mode == undefined) {
        options.mode = 'boc-' + this.config.mode;
    }

    return options;
};


OrgChart.prototype._export = function (options, callback) {
    var that = this;

    var params = {
        id: options.nodeId,
        expandChildren: options.expandChildren
    };

    if (options.margin && options.margin[0] < 2){
        options.margin[0] = 2;
    }
    if (options.margin && options.margin[1] < 2){
        options.margin[1] = 2;
    }
    if (options.margin && options.margin[2] < 2){
        options.margin[2] = 2;
    }
    if (options.margin && options.margin[3] < 2){
        options.margin[3] = 2;
    }

    this._draw(false, OrgChart.action.exporting, params, function (content) {
        var el = document.createElement('div');
        el.innerHTML = content;

        if (options.padding > 0){
            var svg = el.querySelector('svg');
            var vb = OrgChart._getViewBox(svg);
            vb[0] -= options.padding;
            vb[1] -= options.padding;
            vb[2] += options.padding * 2;
            vb[3] += options.padding * 2;

            svg.setAttribute('viewBox', vb.join());
            svg.setAttribute('width', vb[2]);
            svg.setAttribute('height', vb[3]);
        }

        if (options.ext == "svg") {
            if (!callback) {
                var svg = el.querySelector('svg');
                svg.classList.add('boc-' + that.config.mode);
                var args = { content: el.innerHTML, options: options, styles: '' };
                var result = OrgChart.events.publish('exportstart', [that, args]);
                var baStyles = that.element.querySelector('[data-boc-styles]');
                if (baStyles){
                    args.styles += baStyles.outerHTML;
                }

                if (args.styles){
                    //todo: refactor it
                    el.childNodes[0].insertAdjacentHTML("afterbegin", args.styles);
                    args.content = el.innerHTML;
                }

                if (result === false) {
                    return false;
                }

                result = OrgChart.events.publish('exportend', [that, args]);
                if (result === false) {
                    return false;
                }
                OrgChart._downloadFile(options.mime, args.content, args.options.filename, args.options.openInNewTab);
            }
            else {
                callback(options, el.innerHTML)
            }
        }
        else {
            //OrgChart._imgs2base64(el, "image", "xlink:href", function () {
                that._pages(options, el.querySelector('svg'), function(pages){
                    var content = el.innerHTML;
                    var req = { content: content, options: options, pages: pages, styles: '' };
                    var result = OrgChart.events.publish('exportstart', [that, req]);
                    var baStyles = that.element.querySelector('[data-boc-styles]');
                    if (baStyles){
                        req.styles += baStyles.outerHTML;
                    }
                    if (result === false) {
                        return false;
                    }
                    if (!callback) {
                        OrgChart.loading.show(that);
                    }

                    if (!callback) {
                        req = JSON.stringify(req);
                        OrgChart._ajax(that.config.exportUrl + "/v3", "POST", req, "arraybuffer", function (response) {
                            var result = OrgChart.events.publish('exportend', [that, response]);
                            OrgChart.loading.hide(that);
                            if (result === false) {
                                return false;
                            }


                            OrgChart._downloadFile(options.mime, response, options.filename, options.openInNewTab);
                        });
                    }
                    else {
                        callback(that, req, el.querySelector('svg'));
                    }
                });
            //});
        }
    });
};

OrgChart.prototype.exportCSV = function (filename) {
    if (!filename) {
        filename = "OrgChart.csv";
    }

    var nodes = JSON.parse(JSON.stringify(this.config.nodes));

    var startArgs = {
        ext: "csv",
        filename: filename,
        nodes: nodes
    };
    var result = OrgChart.events.publish('exportstart', [this, startArgs]);

    if (result === false) {
        return false;
    }

    var csv = OrgChart._json2csv(startArgs.nodes);

    var endArgs = {
        ext: startArgs.ext,
        filename: startArgs.filename,
        nodes: startArgs.nodes,
        content: csv
    };

    var result = OrgChart.events.publish('exportend', [this, endArgs]);

    if (result === false) {
        return false;
    }

    OrgChart._downloadFile('text/csv;charset=utf-8;', '\uFEFF' + endArgs.content, endArgs.filename, endArgs.openInNewTab);
};

OrgChart.prototype.exportXML = function (filename) {
    if (!filename) {
        filename = "OrgChart.xml";
    }

    var nodes = JSON.parse(JSON.stringify(this.config.nodes));

    var startArgs = {
        ext: "xml",
        filename: filename,
        nodes: nodes
    };

    var result = OrgChart.events.publish('exportstart', [this, startArgs]);

    if (result === false) {
        return false;
    }

    var xml = OrgChart._json2xml(startArgs.nodes);

    var endArgs = {
        ext: startArgs.ext,
        filename: startArgs.filename,
        nodes: startArgs.nodes,
        content: xml
    };

    var result = OrgChart.events.publish('exportend', [this, endArgs]);

    if (result === false) {
        return false;
    }

    OrgChart._downloadFile('application/xml', endArgs.content, endArgs.filename, endArgs.openInNewTab);
};



OrgChart.prototype._pages = function (opt, svg, callback) {
    if ((opt.format == 'A5' && opt.scale != 'fit')
        || (opt.format == 'A4' && opt.scale != 'fit')
        || (opt.format == 'A3' && opt.scale != 'fit')
        || (opt.format == 'A2' && opt.scale != 'fit')
        || (opt.format == 'A1' && opt.scale != 'fit')
        || (opt.format == 'Letter' && opt.scale != 'fit')
        || (opt.format == 'Legal' && opt.scale != 'fit')) {
        callback(this._pagesA100(opt, svg, opt.scale));
    }
    else if ((opt.format == 'A5' && opt.scale == 'fit')
        || (opt.format == 'A4' && opt.scale == 'fit')
        || (opt.format == 'A3' && opt.scale == 'fit')
        || (opt.format == 'A2' && opt.scale == 'fit')
        || (opt.format == 'A1' && opt.scale == 'fit')
        || (opt.format == 'Letter' && opt.scale == 'fit')
        || (opt.format == 'Legal' && opt.scale == 'fit')) {
        callback(this._pagesAfit(opt, svg));
    }
    else if (opt.format == 'fit') {
        callback(this._pagesFit(opt, svg));
    }
};


OrgChart.prototype._pagesFit = function (opt, svg) {
    var width = svg.getAttribute('width');
    var height = svg.getAttribute('height');

    var vb = OrgChart._getViewBox(svg);


    var innerSize = {
        w: parseFloat(width),
        h: parseFloat(height)
    };

    var size = {
        w: innerSize.w + (opt.margin[1] + opt.margin[3]),
        h: innerSize.h + (opt.margin[0] + opt.margin[2])
    }

    var pages = [{ vb: vb, size: size, innerSize: innerSize }];


    return pages;
}

OrgChart.prototype._pagesAfit = function (opt, svg) {
    var width = svg.getAttribute('width');

    var Aw = 0;
    var Ah = 0;

    switch  (opt.format){
        case 'A5':
                Aw = OrgChart.A5w;
                Ah = OrgChart.A5h;
            break;
        case 'A4':
                Aw = OrgChart.A4w;
                Ah = OrgChart.A4h;
            break;
        case 'A3':
                Aw = OrgChart.A3w;
                Ah = OrgChart.A3h;
                break;
        case 'A2':
                Aw = OrgChart.A2w;
                Ah = OrgChart.A2h;
                break;
        case 'A1':
                Aw = OrgChart.A1w;
                Ah = OrgChart.A1h;
            break;
        case 'Letter':
                Aw = OrgChart.Letterw;
                Ah = OrgChart.Letterh;
            break;
        case 'Legal':
                Aw = OrgChart.Legalw;
                Ah = OrgChart.Legalh;
            break;
    }

    var innerSize = {
        w: opt.landscape ? Ah - (opt.margin[1] + opt.margin[3]) : Aw - (opt.margin[1] + opt.margin[3]),
        h: opt.landscape ? Aw - (opt.margin[0] + opt.margin[2]) : Ah - (opt.margin[0] + opt.margin[2])
    }

    var ratioW = innerSize.w /width ;
    var ratio = ratioW;

    return this._pagesA100(opt, svg, ratio * 100);
}

OrgChart.prototype._pagesA100 = function (opt, svg, scale) {
    var vb = OrgChart._getViewBox(svg);

    var Aw = 0;
    var Ah = 0;

    switch  (opt.format){
        case 'A5':
                Aw = OrgChart.A5w;
                Ah = OrgChart.A5h;
            break;
        case 'A4':
                Aw = OrgChart.A4w;
                Ah = OrgChart.A4h;
            break;
        case 'A3':
                Aw = OrgChart.A3w;
                Ah = OrgChart.A3h;
            break;
        case 'A2':
                Aw = OrgChart.A2w;
                Ah = OrgChart.A2h;
            break;
        case 'A1':
                Aw = OrgChart.A1w;
                Ah = OrgChart.A1h;
            break;
        case 'Letter':
                Aw = OrgChart.Letterw;
                Ah = OrgChart.Letterh;
            break;
        case 'Legal':
                Aw = OrgChart.Legalw;
                Ah = OrgChart.Legalh;
            break;
    }

    var vx = vb[0];
    var vy = vb[1];
    var vw = vb[2];
    var vh = vb[3];

    var innerSize = {
        w: opt.landscape ? Ah - (opt.margin[1] + opt.margin[3]) : Aw - (opt.margin[1] + opt.margin[3]),
        h: opt.landscape ? Aw - (opt.margin[0] + opt.margin[2]) : Ah - (opt.margin[0] + opt.margin[2])
    };
    var size = {
        w: opt.landscape ? Ah : Aw,
        h: opt.landscape ? Aw : Ah
    };
    svg.setAttribute('preserveAspectRatio', 'xMinYMin slice');
    svg.setAttribute('width', innerSize.w);
    svg.setAttribute('height', innerSize.h);


    var vwidth = innerSize.w * (100 / scale);//if change test exp/export.html
    var vheight = innerSize.h * (100 / scale);

    var temp_vx = vx;
    var temp_vy = vy;

    var pages = [];
    while (temp_vx < vw + vx) { //it was temp_vx < vw we need temp_vx < vw - 1 becouse we have rounded numbers
        while (temp_vy < vh + vy) { //it was temp_vy < vh we need temp_vy < vh - 1 becouse we have rounded numbers
            //var xview = temp_vx + vwidth;

            var viewbox = [temp_vx, temp_vy, vwidth, vheight];
            viewbox = viewbox.join();
            pages.push({ vb: viewbox, innerSize: innerSize, size: size });
            temp_vy += vheight; //if change test exp/export.html
        }
        temp_vx += vwidth;
        temp_vy = vy ;
    }

    return pages;
}


OrgChart.prototype._defaultExportProfileOptions = function (options, type) {
    if (OrgChart.isNEU(options) || OrgChart.isNEU(options.id)) {
        console.error('options.id is not defilned');
    }
    if (type == 'svg') {
        options.ext = "svg";
        options.mime = "image/svg+xml";
    }
    else if (type == 'pdf') {
        options.mime = "application/pdf";
        options.ext = 'pdf';
    }
    else if (type == 'png') {
        options.mime = "image/png";
        options.ext = 'png';
    }
    if (options.margin == undefined) {
        options.margin = [50, 40, 50, 40];
    }
    if (options.padding == undefined) {
        options.padding = 0;
    }
    if (options.landscape == undefined) {
        options.landscape = false;
    }
    if (options.filename == undefined) {
        options.filename = "Profile." + options.ext;
    }
    if (options.scale == undefined) {
        options.scale = 'fit';
    }
    if (options.format == undefined) {
        options.format = 'A4';
    }
    if (options.header == undefined) {
        options.header = '';
    }
    if (options.footer == undefined) {
        options.footer = '';
    }
    if (options.openInNewTab == undefined) {
        options.openInNewTab = false;
    }
    if (options.mode == undefined) {
        options.mode = 'boc-' + this.config.mode;
    }

    return options;
};

OrgChart.prototype._exportProfile = function (options, callback) {
    var that = this;
    var Aw = 0;
    var Ah = 0;

    switch  (options.format){
        case 'A5':
                Aw = OrgChart.A5w;
                Ah = OrgChart.A5h;
            break;
        case 'A4':
                Aw = OrgChart.A4w;
                Ah = OrgChart.A4h;
            break;
        case 'A3':
                Aw = OrgChart.A3w;
                Ah = OrgChart.A3h;
                break;
        case 'A2':
                Aw = OrgChart.A2w;
                Ah = OrgChart.A2h;
                break;
        case 'A1':
                Aw = OrgChart.A1w;
                Ah = OrgChart.A1h;
            break;
        case 'Letter':
                Aw = OrgChart.Letterw;
                Ah = OrgChart.Letterh;
            break;
        case 'Legal':
                Aw = OrgChart.Legalw;
                Ah = OrgChart.Legalh;
            break;
    }


    var innerSize = {
        w: options.landscape ? Ah - (options.margin[1] + options.margin[3]) : Aw - (options.margin[1] + options.margin[3]),
        h: options.landscape ? Aw - (options.margin[0] + options.margin[2]) : Ah - (options.margin[0] + options.margin[2])
    };
    var size = {
        w: options.landscape ? Ah : Aw,
        h: options.landscape ? Aw : Ah
    };

    var element = this.editUI.content(options.id, true, true, '100%', true).element;
    //this.element.appendChild(element);
    OrgChart.input.init(element);
    var content = element.outerHTML;
    var pages = [
        {
           vb:'',
           innerSize:innerSize,
           size:size
        }
     ];

    var req = { content: content, options: options, pages: pages, styles: '' };

    if (!callback) {
        var result = OrgChart.events.publish('exportstart', [that, req]);
        if (result === false) {
            return false;
        }
        OrgChart.loading.show(that);
    }
    var baStyles = this.element.querySelector('[data-boc-styles]');
    if (baStyles){
        req.styles += baStyles.outerHTML;
    }
    var svg = this.getSvg();
    var defs = svg.querySelector('defs');
    if (defs){
        for(var i = 0; i < defs.children.length; i++){
            if (defs.children[i].nodeName.toLowerCase() == 'style'){
                req.styles += defs.children[i].outerHTML;
            }
        }
    }

    req = JSON.stringify(req);
    OrgChart._ajax(this.config.exportUrl + "/v3", "POST", req, "arraybuffer", function (response) {
        if (callback) {
            callback(that, response);
        }
        else{
            var result = OrgChart.events.publish('exportend', [that, response]);
            OrgChart.loading.hide(that);
            if (result === false) {
                return false;
            }
            OrgChart._downloadFile(options.mime, response, options.filename, options.openInNewTab);
        }
    });
};

if (typeof (OrgChart) == "undefined") {
    OrgChart = {};
}

OrgChart.events = (function () {
    var topics = {};

    return {
        on: function (topic, listener, event_id) {
            if (!Array.isArray(topics[topic])){
                topics[topic] = [];
            }

            topics[topic].push({
                listener: listener,
                event_id: event_id
            });
        },
        removeAll: function (topic) {
            if (!Array.isArray(topics[topic])){
                topics[topic] = [];
            }

            topics[topic] = [];
        },
        has: function (topic, event_id) {
            if (topics[topic] && Array.isArray(topics[topic]) && topics[topic].length > 0){
                if (OrgChart.isNEU(event_id)){
                    return true;
                }
                else{
                    for (var i = 0; i < topics[topic].length; i++ ){
                        if (topics[topic][i].event_id == event_id){
                            return true;
                        }
                    }
                }
            }

            return false;
        },
        removeForEventId: function (event_id) {
            for (var topic in topics){
                if (Array.isArray(topics[topic])){
                    for (var i = topics[topic].length - 1; i >= 0; i-- ){
                        if (topics[topic][i].event_id == event_id){
                            topics[topic].splice(i, 1);
                        }
                    }
                }
            }
        },
        publish: function (topic, info) {
            if (topics[topic]){
                var listeners = [];
                for(var i = 0; i < topics[topic].length; i++){
                    var item = topics[topic][i];
                    if (item.event_id == undefined || item.event_id == info[0]._event_id){
                        listeners.push(item.listener);
                    }
                }

                if (listeners.length > 0){
                    var result = true;
                    for(var i = 0; i < listeners.length; i++){
                        if (info.length == 1){
                            result = listeners[i](info[0]) && result ;
                        }
                        else if (info.length == 2){
                            result = listeners[i](info[0], info[1]) && result;
                        }
                        else if (info.length == 3){
                            result = listeners[i](info[0], info[1], info[2]) && result;
                        }
                        else if (info.length == 4){
                            result = listeners[i](info[0], info[1], info[2], info[3]) && result;
                        }
                        else if (info.length == 5){
                            result = listeners[i](info[0], info[1], info[2], info[3], info[4]) && result;
                        }
                        if (result === false){
                            break;
                        }
                    }
                    return result;
                }
            }
        }
    };
})();



OrgChart.prototype.importCSV = function () {
    var that = this;
    var fileUpload = document.createElement('INPUT');
    fileUpload.setAttribute('type', 'file');
    fileUpload.setAttribute('accept', '.csv')
    fileUpload.style.display = 'none';
    fileUpload.onchange = function (event) {
        var input = event.target;
        var reader = new FileReader();

        reader.onload = function(){
            var text = reader.result;
            var csv = OrgChart._csvToArray(text, ',');
            var nodes = [];
            var columnNames = csv[0];
            OrgChart._importSetColumnNames(columnNames, function(newColumnNames){

                for(var i = 1; i < csv.length; i++){
                    var node = {};
                    for(var j = 0; j < csv[i].length; j++){
                        var name = newColumnNames[j];
                        var val = csv[i][j];
                        if (name == 'tags' && val != ''){
                            val = val.split(',');
                        }
                        else if (name == 'tags' && val == ''){
                            continue;
                        }
                        node[name] = val;
                    }

                    if (node.id.trim() != ''){
                        nodes.push(node);
                    }
                }

                var args = {
                    nodes: nodes,
                    columnNames: csv[0]
                };

                var result = OrgChart.events.publish('import', [that, args]);
                if (result != false){
                    that.config.nodes = args.nodes;
                    that.draw();
                }
            });
        };
        reader.readAsText(input.files[0]);
    };

    fileUpload.click();
}


OrgChart._importSetColumnNames = function (columnNames, callback){
    if (columnNames.indexOf('id') != -1 && columnNames.indexOf('pid') != -1 ){
        callback(columnNames);
        return;
    }

    var importForm = document.createElement("DIV");
    var formText = document.createElement("P");
    formText.style.padding = "5px";
    formText.style.color = 'rgb(122, 122, 122)';
    formText.innerHTML = OrgChart.IMPORT_MESSAGE;
    importForm.appendChild(formText);

    // initializing dialog: title, close, content
    var container = document.createElement("div");
    var titleContainer = document.createElement("div");
    var contentContainer = document.createElement("div");
    var closeContainer = document.createElement("span");
    container.setAttribute("id", "boc-sampleDialog");
    container.style.height = "260px";
    container.style.width = "400px";
    container.style.background = "white";
    container.style.border = "0.5px solid grey";
    container.style.position = "fixed";
    container.style.overflow = "hidden";
    container.style.zIndex = "99";
    titleContainer.setAttribute("id", "title");
    titleContainer.style.backgroundColor = "#e5e5e5";
    titleContainer.style.fontWeight = "bold";
    titleContainer.style.color = "rgb(122, 122, 122)";
    titleContainer.style.height = "20px";
    titleContainer.style.padding = "3px 0 0 7px";
    closeContainer.setAttribute("id", "close");
    closeContainer.style.cursor = "pointer";
    closeContainer.style.position = "absolute";
    closeContainer.style.color = "rgb(122, 122, 122)";
    closeContainer.style.fontWeight = "bold";
    closeContainer.style.top = "2px";
    closeContainer.style.zIndex = 100;
    contentContainer.setAttribute("id", "content");
    contentContainer.style.padding = "2px";
    titleContainer.innerHTML = "Import Organizational Chart Data";
    closeContainer.innerHTML = "&times;";
    var headerLine = document.createElement('HR');
    headerLine.style.height = '0.1px';
    headerLine.style.backgroundColor = "#aeaeae";
    headerLine.style.border = "none";
    headerLine.style.margin = "0";


    container.appendChild(titleContainer);
    container.appendChild(headerLine);
    contentContainer.appendChild(importForm);
    container.appendChild(contentContainer);
    container.appendChild(closeContainer);

    document.body.appendChild(container);
    // place the container in the center of the browser window
    OrgChart._importCenter(container);
    closeContainer.style.left = (container.offsetWidth - 20) + "px";

    var overlay = document.createElement("div");
    overlay.setAttribute("id", "overlay");
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.left = 0;
    overlay.style.top = 0;
    overlay.style.position = "fixed";
    overlay.style.background = "grey";
    overlay.style.opacity = "0.5";
    overlay.style.zIndex = 98;
    document.body.appendChild(overlay);
    container._overlay = overlay;

    var idLabel = document.createElement("LABEL");
    var txtForId = document.createTextNode("Name:");
    idLabel.setAttribute("for", "boc-id-select");
    idLabel.appendChild(txtForId);
    idLabel.style.fontSize = '16px';
    idLabel.style.color = 'rgb(122, 122, 122)';
    idLabel.style.padding = '5px';
    idLabel.style.margin = '5px';
    idLabel.style.width = "30%";
    idLabel.style.textAlign = "right";
    idLabel.style.display = "inline-block";
    importForm.appendChild(idLabel);

    var selectIdColumn = document.createElement("SELECT");
    selectIdColumn.id = "boc-id-select";
    selectIdColumn.style.fontSize = '16px';
    selectIdColumn.style.color = 'rgb(122, 122, 122)';
    selectIdColumn.style.padding = '5px';
    selectIdColumn.style.margin = '5px';
    selectIdColumn.style.width = '60%';
    selectIdColumn.style.border = "1px solid #aeaeae";
    importForm.appendChild(selectIdColumn);

    var br = document.createElement("BR");
    importForm.appendChild(br);

    for (var i = 0; i<columnNames.length; i++) {
    	var z = document.createElement("option");
    	z.setAttribute("value", columnNames[i]);
    	var t = document.createTextNode(columnNames[i]);
    	z.appendChild(t);
    	selectIdColumn.appendChild(z);

    }
    var pidLabel = document.createElement("LABEL");
    var txtForPid = document.createTextNode("Reports to:");
    pidLabel.setAttribute("for", "pid-select");
    pidLabel.appendChild(txtForPid);
    pidLabel.style.fontSize = '16px';
    pidLabel.style.color = 'rgb(122, 122, 122)';
    pidLabel.style.padding = '5px';
    pidLabel.style.margin = '5px';
    pidLabel.style.width = "30%";
    pidLabel.style.textAlign = "right";
    pidLabel.style.display = "inline-block";
    importForm.appendChild(pidLabel);

    var selectPidColumn = document.createElement("SELECT");
    selectPidColumn.id = "pid-select";
    selectPidColumn.style.fontSize = '16px';
    selectPidColumn.style.color = 'rgb(122, 122, 122)';
    selectPidColumn.style.padding = '5px';
    selectPidColumn.style.margin = '5px';
    selectPidColumn.style.width = '60%';
    selectPidColumn.style.border = "1px solid #aeaeae";
    importForm.appendChild(selectPidColumn);


    for (var i = 0; i<columnNames.length; i++) {
    	var z = document.createElement("option");
    	z.setAttribute("value", columnNames[i]);
    	var t = document.createTextNode(columnNames[i]);
    	z.appendChild(t);
    	selectPidColumn.appendChild(z);

    }

    var btn = document.createElement("BUTTON");
    btn.innerHTML = "Import";
    btn.style.fontSize = '16px';
    btn.style.color = 'rgb(122, 122, 122)';
    btn.style.padding = '5px 20px';
    btn.style.margin = "20px auto";
    btn.style.display = "block";
    btn.onclick = function() {
    	container.style.display = "none";
        if (container._overlay){
            container._overlay.parentNode.removeChild(container._overlay);
        }

        var selectedForId = selectIdColumn.options[selectIdColumn.selectedIndex].value;
        var indexforId = columnNames.indexOf(selectedForId);
        columnNames[indexforId] = "id";

        var selectedForPid = selectPidColumn.options[selectPidColumn.selectedIndex].value;
        var indexforPid = columnNames.indexOf(selectedForPid);
        columnNames[indexforPid] = "pid";

        callback(columnNames);
    }
    // binding mouse events
    var btnDiv = document.createElement("DIV");
    btnDiv.appendChild(btn);
    importForm.appendChild(btnDiv);

    closeContainer.onclick = function(evt){
        if (container._overlay){
            container._overlay.parentNode.removeChild(container._overlay);
        }

        container.parentNode.removeChild(container);
        // calling the callback function to notify the dialog closed
        // if(callback){
        // 	callback.call(container);
        // }
        evt.stopPropagation();
    };

    // start dragging when the mouse clicked in the title area
    titleContainer.onmousedown = function(evt){
        evt = evt || window.event;

        container._dragging = true;
        container._originalLeft = container.offsetLeft;
        container._originalTop = container.offsetTop;
        container._mouseLeft = evt.clientX;
        container._mouseTop = evt.clientY;
    };

    // do the dragging during the mouse move
    document.onmousemove = function(evt){
        evt = evt || window.event;

        if(container._dragging){
            container.style.left =
                (container._originalLeft + evt.clientX - container._mouseLeft) + "px";
            container.style.top =
                (container._originalTop + evt.clientY - container._mouseTop) + "px";
        }
    };

    // finish the dragging when release the mouse button
    document.onmouseup = function(evt){
        evt = evt || window.event;

        if(container._dragging){
            container.style.left =
                (container._originalLeft + evt.clientX - container._mouseLeft) + "px";
            container.style.top =
                (container._originalTop + evt.clientY - container._mouseTop) + "px";

            container._dragging = false;
        }
    };

    return container;
};


/**
 * place the given dom element in the center of the browser window
 * @param {Object} importForm
 */
OrgChart._importCenter = function (importForm) {
    if(importForm){
        importForm.style.left = (window.innerWidth - importForm.offsetWidth) / 2 + "px";
        importForm.style.top = (window.innerHeight - importForm.offsetHeight) / 2 + "px";
    }
}




OrgChart.prototype.importXML = function () {
    var that = this;
    var fileUpload = document.createElement('INPUT');
    fileUpload.setAttribute('type', 'file');
    fileUpload.setAttribute('accept', '.xml')
    fileUpload.style.display = 'none';
    fileUpload.onchange = function (event) {
        var input = event.target;
        var reader = new FileReader();
        reader.onload = function(){
            var text = reader.result;
            var nodes = OrgChart._xml2json(text);
            var result = OrgChart.events.publish('import', [that, nodes]);
            if (result != false){
                that.config.nodes = nodes;
                that.draw();
            }
        };
        reader.readAsText(input.files[0]);
    };
    fileUpload.click();
};



OrgChart.prototype.expand = function (id, ids, callback) {
    var actionParams = { id: id, ids: ids };
    this._draw(false, OrgChart.action.expand, actionParams, callback);
};

OrgChart.prototype.collapse = function (id, ids, callback) {
    var actionParams = { id: id, ids: ids };
    this._draw(false, OrgChart.action.collapse, actionParams, callback);
};

OrgChart.prototype.expandCollapse = function (id, expandIds, collapseIds, callback) {
    if (!Array.isArray(expandIds)){
        expandIds = [];
    }
    if (!Array.isArray(collapseIds)){
        collapseIds = [];
    }
    var actionParams = { id: id, expandIds: expandIds, collapseIds: collapseIds, ids: expandIds.concat(collapseIds) };
    this._draw(false, OrgChart.action.collapse, actionParams, callback);
};

OrgChart.prototype.changeRoots = function (id, roots, callback) {
    this.config.roots = roots;
    var actionParams = { id: id };
    this._draw(false, OrgChart.action.update, actionParams, callback);
};


OrgChart.prototype.expandCollapseToLevel = function (id, collapse, expand, callback) {
    this.config.collapse = collapse;
    if (expand == undefined){
        expand = {};
    }
    this.config.expand = expand;
    var actionParams = { id: id,  method: 'expandCollapseToLevel' };
    this._draw(false, OrgChart.action.collapse, actionParams, callback);
};



OrgChart.prototype.maximize = function (id, horizontalCenter, verticalCenter, callback) {
    var that = this;
    var actionParams = { id: id, options: {} };
    if (OrgChart.isNEU(actionParams.id)){
        actionParams.id = this.roots[0].id;
        actionParams.all = true;
    }

    actionParams.options.horizontal = false;
    actionParams.options.vertical = false;

    if (horizontalCenter){
        actionParams.options.horizontal = horizontalCenter;
    }

    if (verticalCenter){
        actionParams.options.vertical = verticalCenter;
    }

    this._draw(false, OrgChart.action.maximize, actionParams, function(){
        that.ripple(id);
        if (callback){
            callback();
        }
    });
};

OrgChart.prototype.minimize = function (id, callback) {
    var that = this;

    var actionParams = { id: id };
    if (OrgChart.isNEU(actionParams.id)){
        actionParams.id = this.roots[0].id;
        actionParams.all = true;
    }
    this._draw(false, OrgChart.action.minimize, actionParams, function(){
        that.ripple(id);
        if (callback){
            callback();
        }
    });
};

OrgChart.prototype._expCollHandler = function (id) {
    this.nodeMenuUI.hide();
    this.nodeContextMenuUI.hide();
    this.menuUI.hide();
    this.nodeCircleMenuUI.hide();
    var node = this.getNode(id);


    var collapsedChildrenIds = this.getCollapsedIds(node);
    if (collapsedChildrenIds.length) {//check if the node is collapsed or expanded
        var result = OrgChart.events.publish('expcollclick', [this, false, id, collapsedChildrenIds]);
        if (result === false) {
            return false;
        }

        this.expand(id, collapsedChildrenIds, false);
    }
    else {
        var result = OrgChart.events.publish('expcollclick', [this, true, id, node.childrenIds]);
        if (result === false) {
            return false;
        }

        this.collapse(id, node.childrenIds, false);
    }
};

OrgChart.prototype._upHandler = function (id) {
    this.nodeMenuUI.hide();
    this.nodeContextMenuUI.hide();
    this.menuUI.hide();
    this.nodeCircleMenuUI.hide();

    var args = this._upHandlerCreateArgs(id);

    var result = OrgChart.events.publish('up-click', [this, args]);
    if (result === false) {
        return false;
    }

    this.changeRoots(args.id, args.roots, false);
};

OrgChart.prototype._upHandlerCreateArgs = function (id) {
    var node = this.getNode(id);
    var roots = Object.assign([], this.config.roots);
    var pnode = this.getNode(node.pid);
    var rnode; //root node
    if (pnode){
        rnode = pnode;
    }

    if (rnode){
        if (Array.isArray(roots)){
            var index = roots.indexOf(node.id);
            if (index != -1){
                roots.splice(index, 1);
            }
        }
        else{
            roots = [];
        }
        roots.push(rnode.id);
    }

    return {
        id: node.id,
        roots: roots
    };
}






﻿if (!String.prototype.replaceAll){
    String.prototype.replaceAll = function (search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
    };
}

String.prototype.splice = function (idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

String.prototype.insert = function(index, string) {
    if (index > 0) {
      return this.substring(0, index) + string + this.substr(index);
    }

    return string + this;
};

if (!Array.prototype.unique){
    Object.defineProperty(Array.prototype, 'unique',{
        value: function () {
            var a = this.concat();

            for(var i=0; i<a.length; ++i) {
                for(var j=i+1; j<a.length; ++j) {
                    if(a[i] === a[j])
                        a.splice(j--, 1);
                }
            }

            return a;
        },
        writable: true,
        configurable: true,
        enumerable: false
      });
}



Object.defineProperty(Array.prototype, 'has',{
    value: function (t) {
        for (var e = 0; e < this.length; e++)
            if (this[e] == t) return !0;
        return !1;
    },
    writable: true,
    configurable: true,
    enumerable: false
  });

if (typeof Object.assign != 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, "assign", {
        value: function assign(target, varArgs) { // .length of function is 2
            'use strict';
            if (target == null) { // TypeError if undefined or null
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var to = Object(target);

            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];

                if (nextSource != null) { // Skip over if undefined or null
                    for (var nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        },
        writable: true,
        configurable: true
    });
}

if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function (suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}


OrgChart.prototype._globalMouseDownHandler = function (sender, e) {

    var events = {
        move: "mousemove",
        up: "mouseup",
        leave: "mouseleave"
    };

    if (e.type.indexOf("touch") != -1) {
        if (e.touches.length == 1) {
            this._touch = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
        }
        else {
            this._touch = null;
        }
        events = {
            move: "touchmove",
            up: "touchend",
            touchstart: "touchstart"
        };
    }


    if (sender == e.target) {
        e.stopPropagation();
        e.preventDefault();

        this._mouseDownHandler(sender, e, events);
        return;
    }
    else if (this.config.nodeMouseClick == OrgChart.action.pan) {
        var parentEl = e.target;

        while (parentEl != sender && !parentEl.hasAttribute(OrgChart.attr.control_expcoll_id) && !parentEl.hasAttribute(OrgChart.attr.control_up_id)) {
            parentEl = parentEl.parentNode;
        }
        if (!parentEl.hasAttribute(OrgChart.attr.control_expcoll_id) && !parentEl.hasAttribute(OrgChart.attr.control_up_id)){
            e.stopPropagation();
            e.preventDefault();

            this._mouseDownHandler(sender, e, events);
            return;
        }
    }
    var parent = e.target;
    while (parent != sender) {

        if (parent.hasAttribute(OrgChart.attr.node_id)) {
            //e.stopPropagation();
            //if (e.type.indexOf("touch") == -1){ //fix: see mail with subject "Re: I want to purchase your product but I am stuck with the trial" from Santosh Khanal <santosh.khanal55@gmail.com>
                //e.preventDefault();
            //}
            this._nodeMouseDownHandler(parent, e, events);
            return;
        }
        else if (parent.hasAttribute(OrgChart.attr.control_node_circle_menu_name)) {
            e.stopPropagation();
            e.preventDefault();
            this._nodeCircleNodeMenuItemMouseDownHandler(parent, e, events);
            return;
        }
        parent = parent.parentNode;
    }
};

OrgChart.prototype._globalClickHandler = function (sender, e) {
    if (e.type.indexOf("touch") != -1 && this._touch && e.changedTouches.length == 1) {
        if (e.changedTouches.length) {
            var touch = {
                x: e.changedTouches[0].clientX,
                y: e.changedTouches[0].clientY
            };

            var s = OrgChart.t(this.config.template, false, this.getScale()).size;
            var scale = this.getScale();
            var moveX = (Math.abs(touch.x - this._touch.x) / scale);
            var moveY = (Math.abs(touch.y - this._touch.y) / scale);
            this._touch = null;
            if (moveX > s[0] / 10) {
                return;
            }
            if (moveY > s[1] / 10) {
                return;
            }
        }
    }
    else if (e.type.indexOf("touch") != -1 && this._touch == null) {
        return;
    }

    var parent = e.target;
    while (parent != sender) {

        if (parent.hasAttribute(OrgChart.attr.control_expcoll_id)) {
            var id = parent.getAttribute(OrgChart.attr.control_expcoll_id);
            var node = this.getNode(id);
            this._expCollHandler(node.id);
            return;
        }

        if (parent.hasAttribute(OrgChart.attr.node_id)) {
            var id = parent.getAttribute(OrgChart.attr.node_id);
            var node = this.getNode(id); //we need it becouse to get int id instead of string
            this._nodeClickHandler(node.id, e);
            return;
        }

        if (parent.hasAttribute(OrgChart.attr.control_node_menu_id)) {
            e.stopPropagation();
            e.preventDefault();
            var id = parent.getAttribute(OrgChart.attr.control_node_menu_id);
            var node = this.getNode(id);
            this._nodeMenuClickHandler(node.id, parent, e);
            return;
        }

        if (parent.hasAttribute(OrgChart.attr.control_node_circle_menu_id)) {
            e.stopPropagation();
            e.preventDefault();
            var id = parent.getAttribute(OrgChart.attr.control_node_circle_menu_id);
            this._nodeCircleMenuClickHandler(id);
            return;
        }

        if (parent.hasAttribute(OrgChart.attr.control_node_circle_menu_name)) {
            e.stopPropagation();
            e.preventDefault();
            this._nodeCircleMenuItemClickHandler(parent, e);
            return;
        }

        if (parent.hasAttribute(OrgChart.attr.control_add)) {
            this._lonelyButtonHandler();
            return;
        }


        if (parent.hasAttribute(OrgChart.attr.control_up_id)) {
            var id = parent.getAttribute(OrgChart.attr.control_up_id);
            e.stopPropagation();
            e.preventDefault();

            this._upHandler(id);
            return;
        }


        if (parent.hasAttribute(OrgChart.attr.c_link_from)) {
            OrgChart.events.publish('clink-click', [this, {
                from: parent.getAttribute(OrgChart.attr.c_link_from),
                to: parent.getAttribute(OrgChart.attr.c_link_to),
                event: e
            }]);
            return;
        }

        if (parent.hasAttribute(OrgChart.attr.s_link_from)) {
            OrgChart.events.publish('slink-click', [this, {
                from: parent.getAttribute(OrgChart.attr.s_link_from),
                to: parent.getAttribute(OrgChart.attr.s_link_to),
                event: e
            }]);
            return;
        }

        parent = parent.parentNode;
    }
};


OrgChart.prototype._globalContextHandler = function (sender, e) {
    var parent = e.target;
    while (parent != sender) {
        if (parent.hasAttribute(OrgChart.attr.node_id)) {
            var id = parent.getAttribute(OrgChart.attr.node_id);
            var node = this.getNode(id); //we need it becouse to get int id instead of string
            this._nodeContextHandler(node.id, e);
            return;
        }

        parent = parent.parentNode;
    }
};

OrgChart.prototype._nodeContextHandler = function (id, e) {
    e.preventDefault();
    this.searchUI.hide();
    this.nodeMenuUI.hide();
    this.nodeContextMenuUI.hide();
    this.menuUI.hide();
    this.nodeCircleMenuUI.hide();

    var node = this.get(id);



    var menu = null;
    if (node != null && Array.isArray(node.tags)) {
        for (var i = 0; i < node.tags.length; i++) {
            var tag = node.tags[i];
            if (this.config.tags[tag] && this.config.tags[tag].nodeContextMenu) {
                menu = this.config.tags[tag].nodeContextMenu;
            }
        }
    }

    this.nodeContextMenuUI.show(e.pageX, e.pageY, id, null, menu);
};

OrgChart.prototype._globalDbClickHandler = function (sender, e) {
    var parent = e.target;
    while (parent != sender) {
        if (parent.hasAttribute(OrgChart.attr.node_id)) {
            var id = parent.getAttribute(OrgChart.attr.node_id);
            var node = this.getNode(id);//we need it becouse to get int id instead of string
            this._nodeDbClickHandler(node.id, e);
            return;
        }

        parent = parent.parentNode;
    }
};

OrgChart.prototype._mouseScrollHandler = function (sender, e) {
    if (this.config.mouseScrool == OrgChart.action.ctrlZoom && !e.ctrlKey){
        return;
    }

    var that = this;
    var moving = false;

    var speed = this.config.zoom.speed;
    var smooth = this.config.zoom.smooth;
    var pos = 0;
    var scale = this.getScale();;
    var scrollPointInPercent = OrgChart._centerPointInPercent(that.getSvg(), e.pageX, e.pageY);

    function update() {
        moving = true;
        var delta = (pos - scale) / smooth;
        if (delta > 0) {
            delta++;
        }
        else {
            delta--;
        }
        scale += delta;

        that.zoom(1 - (delta / 12) / 50, scrollPointInPercent);

        if (parseInt(scale) == parseInt(pos)) {
            moving = false;
        }
        else {
            requestFrame(update);
        }
    }

    var requestFrame = function () { // requestAnimationFrame cross browser
        return (
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (func) {
                setTimeout(func, 1000 / 50);
            }
        );
    }();

    e.preventDefault(); // disable default scrolling
    var delta = e.delta || e.wheelDelta;

    if (delta === undefined) {
        //we are on firefox
        delta = -e.detail;
    }
    delta = Math.max(-1, Math.min(1, delta)) // cap the delta to [-1,1] for cross browser consistency
    pos += -delta * speed;

    if (!moving) update();
};



OrgChart.prototype._nodeCircleNodeMenuItemMouseDownHandler = function (sender, mde, normalizedEvents) {
    var id = sender.parentNode.getAttribute(OrgChart.attr.control_node_circle_menu_wrraper_id);
    var menuItemName = sender.getAttribute(OrgChart.attr.control_node_circle_menu_name);

    var menuItem = this.nodeCircleMenuUI._menu[menuItemName];

    if (!menuItem.draggable) {
        return;
    }

    var that = this;
    var client = OrgChart._getClientXY(mde);
    var node = this.getNode(id);
    sender._dragEventFired = false;
    var scale = that.getScale();
    var lastHoveredNodeId = null;
    var lastHoveredNode = null;

    this._gragStartedId = id;

    document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';


    var svg = this.getSvg();

    var dragStart = {
        x: client.x,
        y: client.y
    };

    var getCircleNodeMenuPosition = function(element){
        while (element && !element.hasAttribute(OrgChart.attr.control_node_circle_menu_wrraper_id)){
            element = element.parentNode;
        }

        if (!element){
            console.error('cannot find parent' + OrgChart.attr.control_node_circle_menu_wrraper_id);
            return;
        }

        var m = OrgChart._getTransform(element);

        return{
            x: m[4],
            y: m[5]
        }
    }

    var dragElement = sender.cloneNode(true);
    svg.insertBefore(dragElement, svg.firstChild);

    var matrix = OrgChart._getTransform(dragElement);
    var x = matrix[4];
    var y = matrix[5];
    var circleNodeMenuPosition = getCircleNodeMenuPosition(sender);
    dragElement.setAttribute('transform', 'matrix(1,0,0,1,' + (x + circleNodeMenuPosition.x) + ',' + (y + circleNodeMenuPosition.y) +')');

    dragElement.style.opacity = 0.7;

    var removeOpacity = function(lhnid, lhn){
        if (lhnid != null) {
            lhn.classList.remove('boc-drag-over');
            var stParentNodes = OrgChart.getStParentNodes(that.getNode(lastHoveredNodeId));

            for(var i = 0; i < stParentNodes.length; i++){
                var stParentNodeElement = that.getNodeElement(stParentNodes[i].id);
                if (stParentNodeElement){
                    stParentNodeElement.style.opacity = 1;
                }
            }
        }
    }

    var moveHandler = function (e) {
        if (dragStart) {
            var c = OrgChart._getClientXY(e);

            //var p = document.elementFromPoint(c.x, c.y); //fix salesforce does not support elementFromPoint very well
            var p = e.target;
            if (OrgChart.isMobile()){ // drag drop does not work on mobile with e.target;
                p = document.elementFromPoint(c.x, c.y);
            }

            c.x += circleNodeMenuPosition.x * scale;
            c.y += circleNodeMenuPosition.y * scale;

            var client = OrgChart._getOffsetXY(that.element, e);
            var movePosition = {
                left: (that.width() - (client.x + that.config.padding)) < 0,
                right: (client.x - that.config.padding) < 0,
                down: (that.height() - (client.y + that.config.padding)) < 0,
                up: (client.y - that.config.padding) < 0,
            };


            if (movePosition.left || movePosition.right || movePosition.up || movePosition.down){
                if (svg.classList){
                    svg.classList.remove("boc-cursor-grab");
                    svg.classList.add("boc-cursor-move");
                    svg.classList.remove("boc-cursor-nodrop");
                    svg.classList.remove("boc-cursor-copy");
                }

                var mx = matrix[4];
                var my = matrix[5];
                var dx = dragStart.x;
                var dy = dragStart.y;
                var cx = c.x;
                var cy = c.y;
                that.startMove(movePosition, function(go){
                    matrix[4] = mx + go.x;
                    matrix[5] = my + go.y;
                    dragStart.x = dx  - go.xWithoutScale;
                    dragStart.y = dy  - go.yWithoutScale;
                    c.x = cx  - go.xWithoutScale;
                    c.y = cy  - go.yWithoutScale;
                    dragElement.setAttribute("transform", "matrix(" + matrix.toString() + ")");
                });
            }
            else{
                that.stopMove();
                if (svg.classList){
                    svg.classList.add("boc-cursor-grab");
                    svg.classList.remove("boc-cursor-move");
                    svg.classList.remove("boc-cursor-nodrop");
                    svg.classList.remove("boc-cursor-copy");
                }

                removeOpacity(lastHoveredNodeId, lastHoveredNode);
                lastHoveredNodeId = null;
                lastHoveredNode = null;

                while (p != null && p != svg) {
                    if (p.hasAttribute && p.hasAttribute(OrgChart.attr.node_id)) {
                        var id = p.getAttribute(OrgChart.attr.node_id);
                        lastHoveredNodeId = id;
                        lastHoveredNode = p;
                        break;
                    }
                    p = p.parentNode;
                }

                if (lastHoveredNodeId != null) {
                    lastHoveredNode.classList.add('boc-drag-over');
                    var node = that.getNode(lastHoveredNodeId);
                    var stParentNodes = OrgChart.getStParentNodes(node);

                    for(var i = 0; i < stParentNodes.length; i++){
                        var stParentNodeElement = that.getNodeElement(stParentNodes[i].id);
                        if (stParentNodeElement){
                            stParentNodeElement.style.opacity = 0.1;
                        }
                    }
                    svg.classList.remove("boc-cursor-grab");
                    svg.classList.remove("boc-cursor-move");
                    svg.classList.add("boc-cursor-copy");
                    svg.classList.remove("boc-cursor-nodrop");
                }

                var moveX = (c.x - dragStart.x) / scale;
                var moveY = (c.y - dragStart.y) / scale;

                matrix[4] = x + moveX;
                matrix[5] = y + moveY;

                if (!sender._dragEventFired && (Math.abs(c.x - dragStart.x) > OrgChart.FIRE_DRAG_NOT_CLICK_IF_MOVE || Math.abs(c.y - dragStart.y)  > OrgChart.FIRE_DRAG_NOT_CLICK_IF_MOVE)){
                    var resultDrag = OrgChart.events.publish('drag', [that.nodeCircleMenuUI, {
                        from: id,
                        menuItem: menuItem,
                        menuItemName: menuItemName
                    }]);

                    if (resultDrag === false) {
                        leaveHandler();
                    }
                    sender._dragEventFired = true;
                }

                dragElement.setAttribute("transform", "matrix(" + matrix.toString() + ")");
            }
        }
    };

    var leaveHandler = function (e) {
        that.stopMove();
        if (svg.classList){
            svg.classList.remove("boc-cursor-grab");
            svg.classList.remove("boc-cursor-move");
            svg.classList.remove("boc-cursor-nodrop");
            svg.classList.remove("boc-cursor-copy");
        }

        svg.removeEventListener(normalizedEvents.move, moveHandler);
        svg.removeEventListener(normalizedEvents.up, leaveHandler);

        if (normalizedEvents.leave) {
            svg.removeEventListener(normalizedEvents.leave, leaveHandler);
        }


        if ((node.id == lastHoveredNodeId) || (lastHoveredNodeId == null)) {
            svg.removeChild(dragElement);
            that._gragStartedId = null;

            if (sender._dragEventFired){
                OrgChart.events.publish('drop', [that.nodeCircleMenuUI, {
                    from: node.id,
                    menuItemName: menuItemName,
                    menuItem: menuItem
                }]);
            }
            return;
        }

        var toNode = that.getNode(lastHoveredNodeId);

        OrgChart.events.publish('drop', [that.nodeCircleMenuUI,{
            from: node.id,
            to: toNode.id,
            menuItem: menuItem,
            menuItemName: menuItemName
        }]);

        removeOpacity(lastHoveredNodeId, lastHoveredNode);
        svg.removeChild(dragElement);
        that._gragStartedId = null;
    };

    svg.addEventListener(normalizedEvents.move, moveHandler);
    svg.addEventListener(normalizedEvents.up, leaveHandler);
    if (normalizedEvents.leave) {
        svg.addEventListener(normalizedEvents.leave, leaveHandler);
    }
}

OrgChart.prototype._nodeMouseDownHandler = function (sender, mde, normalizedEvents) {
    if (!this.config.enableDragDrop) {
        return;
    }
    var client = OrgChart._getClientXY(mde);

    var id = sender.getAttribute(OrgChart.attr.node_id);
    var draggedNode = this.getNode(id);

    sender._dragEventFired = false;
    var lastHoveredNodeId = null;
    var lastHoveredNode = null;

    this._gragStartedId = id;

    document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';

    var that = this;
    var svg = this.getSvg();

    var dragStart = {
        x: client.x,
        y: client.y
    };

    var matrix = OrgChart._getTransform(sender);
    var x = matrix[4];
    var y = matrix[5];

    var scale = that.getScale();
    var dragNodeElement = sender.cloneNode(true);


    svg.insertBefore(dragNodeElement, svg.firstChild);
    dragNodeElement.style.opacity = 0.7;


    var removeOpacity = function(lhnid, lhn){
        if (lhnid != null) {
            lhn.classList.remove('boc-drag-over');
            var node = that.getNode(lastHoveredNodeId);
            var stParentNodes = OrgChart.getStParentNodes(node);

            for(var i = 0; i < stParentNodes.length; i++){
                var stParentNodeElement = that.getNodeElement(stParentNodes[i].id);
                if (stParentNodeElement){
                    stParentNodeElement.style.opacity = 1;
                }
            }
        }
    }

    var moveHandler = function (e) {
        if (dragStart) {

            var c = OrgChart._getClientXY(e);
            //var p = document.elementFromPoint(c.x, c.y); //fix salesforce does not support elementFromPoint very well
            var p = e.target;
            if (OrgChart.isMobile()){ // drag drop does not work on mobile with e.target;
                p = document.elementFromPoint(c.x, c.y);
            }

            var client = OrgChart._getOffsetXY(that.element, e);
            var movePosition = {
                left: (that.width() - (client.x + that.config.padding)) < 0,
                right: (client.x - that.config.padding) < 0,
                down: (that.height() - (client.y + that.config.padding)) < 0,
                up: (client.y - that.config.padding) < 0,
            };
            if (movePosition.left || movePosition.right || movePosition.up || movePosition.down){
                if (svg.classList){
                    svg.classList.remove("boc-cursor-grab");
                    svg.classList.add("boc-cursor-move");
                    svg.classList.remove("boc-cursor-nodrop");
                    svg.classList.remove("boc-cursor-copy");
                }

                var mx = matrix[4];
                var my = matrix[5];
                var dx = dragStart.x;
                var dy = dragStart.y;
                var cx = c.x;
                var cy = c.y;
                that.startMove(movePosition, function(go){
                    matrix[4] = mx + go.x;
                    matrix[5] = my + go.y;
                    dragStart.x = dx  - go.xWithoutScale;
                    dragStart.y = dy  - go.yWithoutScale;
                    c.x = cx  - go.xWithoutScale;
                    c.y = cy  - go.yWithoutScale;
                    dragNodeElement.setAttribute("transform", "matrix(" + matrix.toString() + ")");
                });
            }
            else{
                that.stopMove();
                if (svg.classList){
                    svg.classList.add("boc-cursor-grab");
                    svg.classList.remove("boc-cursor-move");
                    svg.classList.remove("boc-cursor-nodrop");
                    svg.classList.remove("boc-cursor-copy");
                }


                removeOpacity(lastHoveredNodeId, lastHoveredNode);
                lastHoveredNodeId = null;
                lastHoveredNode = null;


                if (that.config.enableDragDrop) {
                    while (p != null && p != svg) {
                        if (p.hasAttribute && p.hasAttribute(OrgChart.attr.node_id)) {
                            var id = p.getAttribute(OrgChart.attr.node_id);
                            if (that._gragStartedId && id != that._gragStartedId) {
                                lastHoveredNodeId = id;
                                lastHoveredNode = p;
                                break;
                            }
                        }
                        p = p.parentNode;
                    }
                }

                if (lastHoveredNodeId != null) {
                    lastHoveredNode.classList.add('boc-drag-over');
                    var node = that.getNode(lastHoveredNodeId);
                    var stParentNodes = OrgChart.getStParentNodes(node);

                    for(var i = 0; i < stParentNodes.length; i++){
                        var stParentNodeElement = that.getNodeElement(stParentNodes[i].id);
                        if (stParentNodeElement){
                            stParentNodeElement.style.opacity = 0.1;
                        }
                    }
                    if (!that.canUpdateLink(draggedNode.id, lastHoveredNodeId) && svg.classList){
                        svg.classList.remove("boc-cursor-grab");
                        svg.classList.remove("boc-cursor-move");
                        svg.classList.remove("boc-cursor-copy");
                        svg.classList.add("boc-cursor-nodrop");
                    }
                    else if (svg.classList){
                        svg.classList.remove("boc-cursor-grab");
                        svg.classList.remove("boc-cursor-move");
                        svg.classList.add("boc-cursor-copy");
                        svg.classList.remove("boc-cursor-nodrop");
                    }
                }

                var moveX = (c.x - dragStart.x) / scale;
                var moveY = (c.y - dragStart.y) / scale;

                matrix[4] = x + moveX;
                matrix[5] = y + moveY;

                if (!sender._dragEventFired && (Math.abs(c.x - dragStart.x) > OrgChart.FIRE_DRAG_NOT_CLICK_IF_MOVE || Math.abs(c.y - dragStart.y)  > OrgChart.FIRE_DRAG_NOT_CLICK_IF_MOVE)){
                    var resultDrag = OrgChart.events.publish('drag', [that, id, e]);
                    if (resultDrag === false) {
                        leaveHandler();
                    }
                    sender._dragEventFired = true;
                }

                dragNodeElement.setAttribute("transform", "matrix(" + matrix.toString() + ")");
            }
        }
    };

    var leaveHandler = function (e) {
        that.stopMove();
        if (svg.classList){
            svg.classList.remove("boc-cursor-grab");
            svg.classList.remove("boc-cursor-move");
            svg.classList.remove("boc-cursor-nodrop");
            svg.classList.remove("boc-cursor-copy");
        }

        svg.removeEventListener(normalizedEvents.move, moveHandler);
        svg.removeEventListener(normalizedEvents.up, leaveHandler);

        if (normalizedEvents.leave) {
            svg.removeEventListener(normalizedEvents.leave, leaveHandler);
        }

        if ((draggedNode.id == lastHoveredNodeId) || (lastHoveredNodeId == null)) {
            svg.removeChild(dragNodeElement);
            that._gragStartedId = null;



            if (sender._dragEventFired){
                OrgChart.events.publish('drop', [that, draggedNode.id]);
            }
            return;
        }

        var droppedNode = that.getNode(lastHoveredNodeId);


        var result = OrgChart.events.publish('drop', [that, draggedNode.id, droppedNode.id]);
        if (result === false) {
            removeOpacity(lastHoveredNodeId, lastHoveredNode);
            svg.removeChild(dragNodeElement);
            that._gragStartedId = null;

            return;
        }

        if (that.canUpdateLink(draggedNode.id, lastHoveredNodeId)) {
            var data = that.get(draggedNode.id);
            data.pid = lastHoveredNodeId;
            data.stpid = null;
            that.updateNode(data, null, true);
        }
        else {
            svg.removeChild(dragNodeElement);
            removeOpacity(lastHoveredNodeId, lastHoveredNode);
        }

        that._gragStartedId = null;
    };

    svg.addEventListener(normalizedEvents.move, moveHandler);
    svg.addEventListener(normalizedEvents.up, leaveHandler);
    if (normalizedEvents.leave) {
        svg.addEventListener(normalizedEvents.leave, leaveHandler);
    }
};


OrgChart.prototype._resizeHandler = function (sender, e) {
    if (!this.isVisible){
        return;
    }
    var viewBox = this.getViewBox();
    var svg = this.getSvg();
    var w = svg.getAttribute('width');
    var h = svg.getAttribute('height');

    var scaleX = w / viewBox[2];
    var scaleY = h / viewBox[3];
    var scale = scaleX > scaleY ? scaleY : scaleX; //do not use this.getScale as it is using the wrong (old) width/height

    svg.setAttribute('width', this.width());
    svg.setAttribute('height', this.height());

    //viewBox[0] = viewBox[0] / scale;
    //viewBox[1] = viewBox[1] / scale;

    viewBox[2] = this.width() / scale;
    viewBox[3] = this.height() / scale;

    this.setViewBox(viewBox);

    this.xScrollUI.create(this.width());
    this.yScrollUI.create(this.height());

    this._draw(false, OrgChart.action.resize);
};

OrgChart.prototype._nodeDbClickHandler = function (id, e) {
    var result = OrgChart.events.publish('dbclick', [this, this.get(id)]);
    if (result === false) {
        return false;
    }

    this._commonClickHandler(id, e, this.config.nodeMouseDbClick);
};

OrgChart.prototype._nodeClickHandler = function (id, e) {
    var nodeElement = this.getNodeElement(id);
    if (nodeElement && nodeElement._dragEventFired){
        nodeElement._dragEventFired = false;
        return;
    }
    var result = OrgChart.events.publish('click', [this, { node: this.getNode(id), event: e }]);
    if (result === false) {
        return false;
    }


    this._commonClickHandler(id, e, this.config.nodeMouseClick);
};

OrgChart.prototype._nodeCircleMenuItemClickHandler = function (element, e) {
    var nodeId = element.parentNode.getAttribute(OrgChart.attr.control_node_circle_menu_wrraper_id);
    var menuItemName = element.getAttribute(OrgChart.attr.control_node_circle_menu_name);
    var menuItem = this.nodeCircleMenuUI._menu[menuItemName];


    OrgChart.events.publish('click', [this.nodeCircleMenuUI, {
        nodeId: nodeId,
        menuItemName: menuItemName,
        menuItem: menuItem,
        event: e }]);
};


OrgChart.prototype._nodeCircleMenuClickHandler = function (id) {
    this.searchUI.hide();
    this.nodeMenuUI.hide();
    this.nodeContextMenuUI.hide();
    this.menuUI.hide();

    var node = this.getNode(id);

    var menu = null;
    if (Array.isArray(node.tags)) {
        for (var i = 0; i < node.tags.length; i++) {
            var tag = node.tags[i];
            if (this.config.tags[tag] && this.config.tags[tag].nodeCircleMenu) {
                menu = this.config.tags[tag].nodeCircleMenu;
            }
        }
    }
    this.nodeCircleMenuUI.show(id, menu);
};
OrgChart.prototype._commonClickHandler = function (id, e, action) {
    this.searchUI.hide();
    this.nodeMenuUI.hide();
    this.nodeContextMenuUI.hide();
    this.menuUI.hide();
    this.nodeCircleMenuUI.hide();


    if (action == OrgChart.action.expandCollapse) {
        this.toggleExpandCollapse(id, e);
    }

    if (action == OrgChart.action.edit) {
        var node = this.getNode(id);
        if (node){
            this.editUI.show(node.id);
            this.ripple(node.id, e.clientX, e.clientY);
        }
    }
    if (action == OrgChart.action.details) {
        var node = this.getNode(id);
        if (node){
            this.editUI.show(node.id, true);
            this.ripple(node.id, e.clientX, e.clientY);
        }
    }
};


OrgChart.prototype._menuHandlerMouseDownHandler = function (sender, e) {
    e.stopPropagation();
    e.preventDefault();
};


OrgChart.prototype._nodeMenuClickHandler = function (id, el, e) {
    this.searchUI.hide();
    this.nodeMenuUI.hide();
    this.nodeContextMenuUI.hide();
    this.menuUI.hide();
    this.nodeCircleMenuUI.hide();


    var node = this.getNode(id);

    var menu = null;
    if (Array.isArray(node.tags)) {
        for (var i = 0; i < node.tags.length; i++) {
            var tag = node.tags[i];
            if (this.config.tags[tag] && this.config.tags[tag].nodeMenu) {
                menu = this.config.tags[tag].nodeMenu;
            }
        }
    }

    this.nodeMenuUI.showStickIn(el, id, null, menu);
};



OrgChart.prototype._menuClickHandler = function (sender, e) {
    e.stopPropagation();
    e.preventDefault();

    this.nodeMenuUI.hide();
    this.nodeContextMenuUI.hide();
    this.menuUI.show(sender.offsetLeft, sender.offsetTop);
};

OrgChart.prototype._lonelyButtonHandler = function () {
    var node = { id: this.generateId() };
    var result = this.addNode(node, null, true);
    if (result !== false) {
        this.center(node.id);
    }
};

OrgChart.prototype.toggleExpandCollapse = function (id, e) {
    var node = this.getNode(id);
    var collapsedChildrenIds = this.getCollapsedIds(node);
    if (collapsedChildrenIds.length) {//check if the node is collapsed or expanded
        var result = OrgChart.events.publish('expcollclick', [this, false, id, collapsedChildrenIds]);

        if (result === false) {
            return false;
        }

        this.expand(id, collapsedChildrenIds, false);
    }
    else {
        var result = OrgChart.events.publish('expcollclick', [this, true, id, node.childrenIds]);
        if (result === false) {
            return false;
        }
        this.collapse(id, node.childrenIds, false);
    }
    if (e){
        this.ripple(node.id, e.clientX, e.clientY);
    }
};
























OrgChart.prototype._move = function (top, left, viewBox) {
    viewBox[0] = left;
    viewBox[1] = top;
    this.setViewBox(viewBox);

    this.xScrollUI.setPosition();
    this.yScrollUI.setPosition();
};


OrgChart.prototype.startMove = function (movePosition, tick) {
    if (!movePosition){
        console.error("movePosition parameter not defined");
        return;
    }
    this._movePosition = movePosition;
    if (this._moveInterval){
        return;
    }

    var that = this;
    var vb = this.getViewBox().slice(0); //clone;
    var scale = this.getScale();
    var countX = 0;
    var countY = 0;

    this._moveInterval = setInterval(function(){
        var go = {
            x: 0,
            y: 0,
            xWithoutScale: 0,
            yWithoutScale: 0
        };
        if (that._movePosition.left){
            countX ++;
            go.x = ( countX * OrgChart.MOVE_STEP) / scale;
            go.xWithoutScale = (countX * OrgChart.MOVE_STEP);
        }
        if (that._movePosition.right){
            countX ++;
            go.x = -( countX * OrgChart.MOVE_STEP) / scale;
            go.xWithoutScale = -(countX * OrgChart.MOVE_STEP);
        }
        if (that._movePosition.up){
            countY ++;
            go.y = -( countY * OrgChart.MOVE_STEP) / scale;
            go.yWithoutScale = -( countY * OrgChart.MOVE_STEP);
        }
        if (that._movePosition.down){
            countY ++;
            go.y = ( countY * OrgChart.MOVE_STEP) / scale;
            go.yWithoutScale = ( countY * OrgChart.MOVE_STEP);
        }
        that.setViewBox([vb[0] + go.x, vb[1] + go.y, vb[2], vb[3]]);

        that.xScrollUI.setPosition();
        that.yScrollUI.setPosition();

        if (tick){
            tick(go);
        }

    }, OrgChart.MOVE_INTERVAL);
};


OrgChart.prototype.stopMove = function () {
    if (this._moveInterval) {
        clearInterval(this._moveInterval);
        this._moveInterval = null;
        this._movePosition = null;
    }
};


if (typeof (OrgChart) == "undefined") {
    OrgChart = {};
}
OrgChart.node = function (id, pid, tags, templateName) {
    this.templateName = templateName;
    this.id = id;
    this.pid = pid;
    this.children = [];
    this.childrenIds = [];
    this.parent = null;
    this.stpid = null;
    this.stParent = null;
    this.stChildren = [];
    this.stChildrenIds = [];
    this.tags = tags;

    if (!this.tags){
        this.tags = [];
    }

    //this.leftNeighbor = null;
    //this.rightNeighbor = null;
    //this._prelim = 0;
    //this._modifier = 0;
    //this.x = null;
    //this.y = null;
    //this.lcn = undefined; //layout config name
    //this.isAssistant = undefined;
    //this.subLevels = undefined;
    //this.stContainerNodes = undefined; a propety only  for the root []
    //this.w;
    //this.h;
    //this.order
    //this.padding = [10,10,10,10] set only if min = false
    //this.isSplit
    //this._m //mirror
    //this.collapsed = false;
    //this.level = undefined;
    //this.min = false;
    //this.hasPartners = undefined;
    //this.hasAssistants = undefined;
    //this.sl = undefined //structire level;
    //this.isPartner = undefined; 1
    //this.ppid
    //this.partnerSeparation = undefinded;
    //this.parentPartner = undefinded;
};



OrgChart.prototype._mouseDownHandler = function (sender, e, normilizedEvents) {

    var that = this;
    //fix #288
    //document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';

    if (OrgChart.HIDE_EDIT_FORM_ON_PAN){
        this.editUI.hide();
    }
    this.searchUI.hide();
    this.nodeMenuUI.hide();
    this.nodeContextMenuUI.hide();
    this.menuUI.hide();
    this.nodeCircleMenuUI.hide();

    var viewBox = this.getViewBox();
    var scale = this.getScale();



    var client0 = OrgChart._getClientTouchesXY(e, 0);
    var client1 = OrgChart._getClientTouchesXY(e, 1);

    var start = {
        diffX: 0,
        diffY: 0,
        x0: client0.x,
        y0: client0.y,
        type: "pan",
        viewBoxLeft: viewBox[0],
        viewBoxTop: viewBox[1]
    };

    if (e.touches && e.touches.length > 1) {
        start.type = "pinch";
        start.dist = Math.sqrt((client0.x - client1.x) * (client0.x - client1.x) +
            (client0.y - client1.y) * (client0.y - client1.y));
    }

    var pointer = this.getPointerElement();

    if (start.type == "pan") {
        this._hideBeforeAnimation();

        var offset = OrgChart._getOffsetXY(this.element, e);
        var x = offset.x / scale + viewBox[0] - 16 / scale;
        var y = offset.y / scale + viewBox[1] - 16 / scale;

        pointer.style.display = "inherit";
        pointer.setAttribute("transform", "matrix(0,0,0,0," + x + "," + y + ")");

        OrgChart.animate(pointer,
            { transform: [0, 0, 0, 0, x, y], opacity: 0 },
            { transform: [1 / scale, 0, 0, 1 / scale, x, y], opacity: 1 },
            300,
            OrgChart.anim.outBack);
    }


    var moveHandler = function (e) {
        var c0 = OrgChart._getClientTouchesXY(e, 0);

        if (start && start.type == "pan") { //pan
            that._hideBeforeAnimation();
            start.diffX = c0.x - start.x0;
            start.diffY = c0.y - start.y0;

            var top = -(start.diffY / scale) + start.viewBoxTop;
            var left = -(start.diffX / scale) + start.viewBoxLeft;

            that._move(top, left, viewBox);
        }
        else if (start && start.type == "pinch"){ //pinch
            var c1 = OrgChart._getClientTouchesXY(e, 1);


            var dist = Math.sqrt((c0.x - c1.x) * (c0.x - c1.x) +
                (c0.y - c1.y) * (c0.y - c1.y));


            var touchScale = 1 + ((dist - start.dist) / (start.dist / 100)) / 100;
            start.dist = dist;
            var pinchMiddlePointInPercent = OrgChart._pinchMiddlePointInPercent(that.element, that.width(), that.height(), e);
            that.zoom(touchScale, pinchMiddlePointInPercent);
        }
    };

    var leaveHandler = function () {
        if (start.type == "pan" && that.config.sticky) {
            //fix #249 added setTimeout
            setTimeout(function(){
                OrgChart._moveToBoundaryArea(
                    sender,
                    that.getViewBox(),
                    that.response.boundary, function () {
                        that._draw(true, OrgChart.action.pan);
                    });
            }, 0);
        }
        else if (start.type == "pan" && !that.config.sticky){
            that._draw(true, OrgChart.action.pan);
        }

        start = null;

        pointer.style.display = "none";

        sender.removeEventListener(normilizedEvents.move, moveHandler);
        sender.removeEventListener(normilizedEvents.up, leaveHandler);
        if (normilizedEvents.leave) {
            sender.removeEventListener(normilizedEvents.leave, leaveHandler);
        }
        if (normilizedEvents.touchstart) {
            sender.removeEventListener(normilizedEvents.touchstart, leaveHandler);
        }
    };


    sender.addEventListener(normilizedEvents.move, moveHandler);
    sender.addEventListener(normilizedEvents.up, leaveHandler);
    if (normilizedEvents.leave) {
        sender.addEventListener(normilizedEvents.leave, leaveHandler);
    }
    if (normilizedEvents.touchstart) {
        sender.addEventListener(normilizedEvents.touchstart, leaveHandler);
    }
};



OrgChart.searchUI = function () {
};

OrgChart.searchUI.prototype.init = function (obj) {
    this.obj = obj;

    var that = this;

    var div = document.createElement("div");
    div.classList.add('boc-search');
    div.style.right = (this.obj.config.padding - 10) + 'px';
    div.style.top = (this.obj.config.padding - 10) + 'px';
    var searchTxt = OrgChart.elements.textbox({}, {label: OrgChart.SEARCH_PLACEHOLDER}, '320px');
    div.innerHTML += searchTxt.html;
    this.searchTableWrapper = document.createElement("div");
    div.appendChild(this.searchTableWrapper);
    var nextSibling = obj.getSvg().nextSibling;
    this.obj.element.insertBefore(div, nextSibling);
    OrgChart.input.init(div);
    this.input = document.getElementById(searchTxt.id);

    //Start fix : FW: Issues with research and the links between nodes in the organigram
    this.input.addEventListener("keypress", function (e) {
        if (e.key == 'Enter') {//enter
            e.preventDefault();
        }
    });
    //End fix

    this.input.addEventListener("keyup", function (e) {
        if (e.key == 'ArrowDown') {//arrow down
            e.preventDefault();
            searchTableRowDown();
        }
        else if (e.key == 'ArrowUp') {//arrow up
            e.preventDefault();
            e.stopPropagation();
            searchTableRowUp();
        }
        else if (e.key == 'Enter') {//enter
            e.preventDefault();
            searchTableSelectEnter();
        }
        else if (e.key == 'Escape') {//escape
            e.preventDefault();
            that.hide();
        }
        else {
            that._serverSearch(this.value);
        }
    });

    var searchTableRowDown = function () {
        var itemElements = that.obj.element.querySelectorAll("[data-search-item-id]");

        var selectedItem = that.obj.element.querySelector('[data-selected="yes"]')
        if (selectedItem == null && itemElements.length > 0) {
            itemElements[0].setAttribute("data-selected", "yes");
        }
        else if (itemElements.length > 0) {
                if (selectedItem.nextSibling && selectedItem.nextSibling.setAttribute) {
                    selectedItem.removeAttribute("data-selected");
                    selectedItem.nextSibling.setAttribute("data-selected", "yes");
                }
        }
    };

    var searchTableRowUp = function () {
        var itemElements = that.obj.element.querySelectorAll("[data-search-item-id]");

        var selectedItem = that.obj.element.querySelector('[data-selected="yes"]')
        if (selectedItem == null && itemElements.length > 0) {
            itemElements[itemElements.length - 1].setAttribute("data-selected", "yes");
        }
        else if (itemElements.length > 0){
            if (selectedItem.previousSibling && selectedItem.previousSibling.setAttribute) {
                selectedItem.removeAttribute("data-selected");
                selectedItem.previousSibling.setAttribute("data-selected", "yes");
            }
        }
    };

    var searchTableSelectEnter = function () {
        var selectedItem = that.obj.element.querySelector('[data-selected="yes"]');
        if (!selectedItem){
            return;
        }
        var id = selectedItem.getAttribute('data-search-item-id');

        var result = OrgChart.events.publish('searchclick', [that.obj, id]);
        if (result != false) {
            that.obj.center(id);
        }
    };
};

OrgChart.searchUI.prototype.hide = function () {
    if (this.searchTableWrapper){
        this.searchTableWrapper.innerHTML = '';
    }
    if (this.input){
        this.input.value = '';
        //start we need both focus and blur dont remove
        this.input.focus();
        this.input.blur();
        //start we need both focus and blur dont remove
    }
};


OrgChart.searchUI.prototype.find = function (value) {
    if (this.input){
        this.input.value = value;
        this._serverSearch(value);
        this.input.focus();
    }
};


OrgChart.searchUI.prototype._serverSearch = function (value) {
    var that = this;

    var result = OrgChart._search.search(
        this.obj.config.nodes,
        value,
        this.obj.config.searchFields,
        this.obj.config.searchFields,
        this.obj.config.searchDisplayField,
        this.obj.config.searchFieldsWeight
    );


    var imgFiled = OrgChart._getFistImgField(this.obj.config);
    var html = `<table border="0" cellspacing="0" cellpadding="0">
                    <tbody>
                        ${(function () {
                            var html = '';
                            for (var i = 0; i < result.length; i++) {
                                if (i >= OrgChart.SEARCH_RESULT_LIMIT) {
                                    break;
                                }

                                var item = result[i];


                                var img = '';
                                if (imgFiled) {
                                    var data = that.obj._get(item.id);
                                    if (typeof (imgFiled) == 'function') {
                                        img = imgFiled(that.obj, that.obj.getNode(item.id), data);
                                    }
                                    else if (data[imgFiled]) {
                                        img = data[imgFiled];
                                    }
                                }

                                var first = '';
                                var second = '';
                                if (that.obj.config.searchDisplayField == item.__searchField) {
                                    first = item.__searchMarks;
                                }
                                else if (that.obj.config.searchDisplayField) {
                                    first = item[that.obj.config.searchDisplayField];
                                    if (OrgChart.isNEU(first)) {
                                        first = '';
                                    }
                                    second = item.__searchMarks;
                                }
                                else {
                                    first = item.__searchMarks;
                                }
                                html += OrgChart.searchUI.createItem(img, item.id, first, second);
                            }
                            return html;
                        })()}
                    </tbody>
                </table>`;


    this.searchTableWrapper.innerHTML = html;

     var itemElements = this.obj.element.querySelectorAll("[data-search-item-id]");
     for (var i = 0; i < itemElements.length; i++) {
        itemElements[i].addEventListener("click", function () {
            var result = OrgChart.events.publish('searchclick', [that.obj, this.getAttribute("data-search-item-id")]);

            if (result !== false) {
                that.obj.center(this.getAttribute("data-search-item-id"));
                var selectedItem = that.obj.element.querySelector('[data-selected="yes"]');
                if (selectedItem){
                    selectedItem.removeAttribute('data-selected');
                }
                this.setAttribute("data-selected", "yes");
                that.input.focus();
            }
        });
    }
};


OrgChart.searchUI.createItem = function (img, id, first, second) {
    if (first) {
        first = '<b>' + first + '</b>';
    }

    if (img){
        img = `<div class="boc-search-photo" style="background-image: url(${img})"></div>`;
    }
    else{
        img = `<div class="boc-search-photo">${OrgChart.icon.user(32,32,'#aeaeae')}</div>`;
    }
    return `<tr data-search-item-id="${id}">
                <td class="boc-search-image-td">
                    ${img}
                </td>
                <td class="boc-search-text-td">${first} <br/>${second}</td>
            </tr>`;
};

﻿if (typeof (OrgChart) == "undefined") {
    OrgChart = {};
}

OrgChart.manager = function (instance) {
    this.config = instance.config;
    this.layoutConfigs = instance._layoutConfigs;
    this.visibleNodeIds = [];
    this.viewBox = null;
    this.action = null;
    this.actionParams = null;
    this.nodes = {};
    this.oldNodes = {};
    this.maxX = null;
    this.maxY = null;
    this.minX = null;
    this.minY = null;
    this.bordersByRootIdAndLevel = null;
    this.roots = null;
    this.state = null;
    this.vbIsInitializedFromState = false;
    this.rootList = [];
    this.instance  = instance;
};

OrgChart.manager.prototype.read = function (readFromCache, width, height, viewBox, action, actionParams, callback, readyCallback) {
    var that = this;

    OrgChart.state._get(this.config.state, width, height, function(state){
        that.state = state;
        that.action = action;
        that.actionParams = actionParams;

        //START: TEST STATE FEATURE IF CHANGE
        //fix #286  - added actionParams fot
        if ((action != OrgChart.action.init) || (!that.state) || (actionParams && actionParams.method && actionParams.method == 'fit')){
            that.viewBox = viewBox;
            that.vbIsInitializedFromState = false;
        }
        else{
            that.viewBox = that.state.vb;
            that.vbIsInitializedFromState = true;
        }
        //END: TEST STATE FEATURE IF CHANGE

        var maxX = that.maxX;
        var maxY = that.maxY;
        var minX = that.minX;
        var minY = that.minY;
        var bordersByRootIdAndLevel = that.bordersByRootIdAndLevel;
        var roots = that.roots;
        var nodes = that.nodes;

        if (!readFromCache) {
            if (nodes) {
                that.oldNodes = nodes;//clone
            }
            else {
                that.oldNodes = null;
            }
            that._read(function(result){
                maxX = result.maxX;
                maxY = result.maxY;
                minX = result.minX;
                minY = result.minY;
                bordersByRootIdAndLevel = result.bordersByRootIdAndLevel;
                roots = result.roots;
                nodes = result.nodes;

                var response = OrgChart.manager._getResponse(
                    width,
                    height,
                    that.visibleNodeIds,
                    that.config,
                    maxX,
                    maxY,
                    minX,
                    minY,
                    that.viewBox,
                    roots,
                    that.action,
                    that.actionParams,
                    nodes,
                    that.oldNodes,
                    that.vbIsInitializedFromState);

                response.notif = result.limit;

                response.roots = roots;
                response.bordersByRootIdAndLevel = bordersByRootIdAndLevel;
                response.adjustify = result.adjustify;

                if (action != OrgChart.action.exporting) {
                    that.maxX = maxX;
                    that.maxY = maxY;
                    that.minX = minX;
                    that.minY = minY;
                    that.roots = roots;
                    that.nodes = nodes;
                    that.visibleNodeIds = response.visibleNodeIds;
                    that.bordersByRootIdAndLevel = bordersByRootIdAndLevel;
                    that.rootList = result.rootList;
                }

                callback(response);
            }, readyCallback);
        }
        else{
            var response = OrgChart.manager._getResponse(
                width,
                height,
                that.visibleNodeIds,
                that.config,
                maxX,
                maxY,
                minX,
                minY,
                that.viewBox,
                roots,
                that.action,
                that.actionParams,
                nodes,
                that.oldNodes,
                that.vbIsInitializedFromState);

            if (action != OrgChart.action.exporting) {
                that.maxX = maxX;
                that.maxY = maxY;
                that.minX = minX;
                that.minY = minY;
                that.roots = roots;
                that.nodes = nodes;
                that.visibleNodeIds = response.visibleNodeIds;
            }

            response.bordersByRootIdAndLevel = bordersByRootIdAndLevel;
            response.roots = roots;

            //START: TEST STATE FEATURE IF CHANGE
            response.adjustify = {x: 0, y: 0};
            if (that.state){
                response.adjustify = that.state.adjustify;
            }
            //END: TEST STATE FEATURE IF CHANGE

            callback(response);
        }
    });

};

OrgChart.manager.prototype._read = function (callback, readyCallback) {
    var that = this;
    var result = OrgChart.manager._createNodes(this.instance);
    readyCallback(result);
    var nodes = result.nodes;
    var roots = result.roots;
    var service = OrgChart.remote;

    if (service == undefined){
        service = OrgChart.local;
    }

    service._setPositions(roots, that.layoutConfigs, function(limit){
        //START: TEST STATE FEATURE IF CHANGE
        var adjust = OrgChart.manager._doNotChangePositionOfClickedNodeIfAny(roots, nodes, that.action, that.actionParams, that.oldNodes, that.config.orientation);
        if (that.state && that.action == OrgChart.action.init){
            adjust = that.state.adjustify;
        }
        //END: TEST STATE FEATURE IF CHANGE

        var border = {
            minX: null,
            minY: null,
            maxX: null,
            maxY: null
        };

        var bordersByRootIdAndLevel = {};
        for(var i = 0; i < roots.length; i++){
            OrgChart.manager._setMinMaxXYAdjustifyIterate(roots[i], roots[i], border, 0, bordersByRootIdAndLevel, adjust, that.config.orientation);
        }

        callback({
            minX: border.minX,
            minY: border.minY,
            maxX: border.maxX,
            maxY: border.maxY,
            bordersByRootIdAndLevel: bordersByRootIdAndLevel,
            nodes: nodes,
            roots: roots,
            rootList: result.rootList,
            limit: limit,
            adjustify: adjust
        });
    }, nodes);

};

if (typeof (OrgChart) == "undefined") {
    OrgChart = {};
}

OrgChart.manager._initDinamicNode = function (node, lcn, isAssistant) {
    if (lcn) {
        node.lcn = lcn;
    }
    if (isAssistant) {
        node.isAssistant = true;
    }
    var t = OrgChart.t(node.templateName);
    node.w = t && t.size ? t.size[0] : 0;
    node.h = t && t.size ? t.size[1] : 0;
    node.isSplit = node.templateName == "split";
};

OrgChart.manager._setCollpasedProperty = function (node, lconfig, actionParams, expandedNodeIds, action, level, state) {
    if (node.collapsed == undefined && lconfig.collapse && lconfig.collapse.allChildren) {
        node.collapsed = true;
    }
    else if (node.collapsed == undefined){
        node.collapsed = false;
    }
    if (action == OrgChart.action.expand && actionParams.ids.indexOf(node.id) != -1) {
        node.collapsed = false;
    }
    if (action == OrgChart.action.collapse && (actionParams.expandIds || actionParams.collapseIds)) {
        if (actionParams.expandIds && actionParams.expandIds.indexOf(node.id) != -1) {
            node.collapsed = false;
        }
        else if (actionParams.collapseIds && actionParams.collapseIds.indexOf(node.id) != -1){
            node.collapsed = true;
        }
    }
    else if (action == OrgChart.action.collapse && actionParams.ids.indexOf(node.id) != -1) {
        node.collapsed = true;
    }
    if (action == OrgChart.action.expand && actionParams.ids == "all") {
        node.collapsed = false;
    }
    if (action == OrgChart.action.exporting && actionParams.expandChildren) {
        node.collapsed = false;
    }

    if (action == OrgChart.action.init && state != null) {
        node.collapsed = !state.exp.has(node.id);
    }
    else if (action == OrgChart.action.init) {
        node.collapsed = (lconfig.collapse && level >= lconfig.collapse.level - 1) && (expandedNodeIds.indexOf(node.id) == -1);
    }
    else if (action == OrgChart.action.centerNode || action == OrgChart.action.insert || action == OrgChart.action.expand || action == OrgChart.action.collapse) {
        if (expandedNodeIds.has(node.id)) {
            node.collapsed = false;
        }
    }
};


OrgChart.manager._initNode = function (node, nodes, layoutConfigName, level, expandedNodeIds, partnerIds, instance) {
    var config = instance.manager.config;
    var layoutConfigs = instance.manager.layoutConfigs;
    var action = instance.manager.action;
    var actionParams = instance.manager.actionParams;
    var state = instance.manager.state;

    var lcname = layoutConfigName ? layoutConfigName : "base";
    var lconfig = layoutConfigs[lcname];

    if (node.parent == null){
        OrgChart.manager._setCollpasedProperty(node, lconfig, actionParams, expandedNodeIds, action, level - 1, state);
    }

    for (var i = 0; i < node.childrenIds.length; i++) {
        var cnode = nodes[node.childrenIds[i]];

        //start expand collapse logic
        OrgChart.manager._setCollpasedProperty(cnode, lconfig, actionParams, expandedNodeIds, action, level, state);
        //end expand collapse logic

        if (!cnode.collapsed) {
            cnode.parent = node;
            if (cnode.ppid != undefined){
                var ppnode = nodes[cnode.ppid];
                if (ppnode){
                    cnode.parentPartner = ppnode;
                }
            }
            if ((cnode.tags.indexOf("left-partner") != -1) || (cnode.tags.indexOf("right-partner") != -1) || (cnode.tags.indexOf("partner") != -1) || cnode.parentPartner) {
                if (partnerIds.indexOf(node.id) == -1){
                    partnerIds.push(node.id);
                }
            }
            node.children.push(cnode);
        }
    }

    if (!node.min && action == OrgChart.action.minimize) {
        if (actionParams.all){
            node.min = true;
        }
        else if (actionParams.id == node.id){
            node.min = true;
        }
    }
    if (node.min === true && action == OrgChart.action.maximize) {
        if (actionParams.all){
            node.min = false;
        }
        else if (actionParams.id == node.id){
            node.min = false;
        }
    }
    if (action == OrgChart.action.init && state != null){
        node.min = state.min.has(node.id);
    }

    if (!node.min) {
        for (var i = 0; i < node.stChildrenIds.length; i++) {
            var cnode = nodes[node.stChildrenIds[i]];
            cnode.stParent = node;
            node.stChildren.push(cnode);
        }
    }




    if (level != undefined) {
        node.level = level;
    }

    if (layoutConfigName) {
        node.lcn = layoutConfigName;
    }

    var subLevels = OrgChart._getSubLevels(node.tags, config.tags);
    if (subLevels > 0) {
        node.subLevels = subLevels;
    }

    if (node.tags.indexOf("assistant") != -1 && node.parent != null) {
        node.isAssistant = true;
    }

    var t = OrgChart.t(node.templateName, node.min);

    node.w = t && t.size ? t.size[0] : 0;
    node.h = t && t.size ? t.size[1] : 0;
    node.padding = t && t.padding ? t.padding : [0,0,0,0];

    var args = {node: node};
    OrgChart.events.publish('node-initialized', [instance, args]);


    //remove May 2024, use node-initialized instead
    OrgChart.events.publish('node-created', [node]);
}

OrgChart.manager._iterate = function (root, node, nodes, level, subTreeIds, assistantPidIds, subLevelsIds, lastChildrenPidIds, layoutConfigName, expandedNodeIds, partnerIds, instance) {
    var layoutConfigs = instance.manager.layoutConfigs;

    OrgChart.manager._initNode(node, nodes, layoutConfigName, level, expandedNodeIds, partnerIds, instance);

    if (node.isAssistant) {
        if (!assistantPidIds[node.pid]) {
            assistantPidIds[node.pid] = [];
        }
        assistantPidIds[node.pid].push(node.id);
    }

    if (node.subLevels > 0) {
        subLevelsIds.push(node.id);
    }

    if (OrgChart.MIXED_LAYOUT_FOR_NODES_WITH_COLLAPSED_CHILDREN && !node.isAssistant && node.parent){
        if (node.parent && node.parent.children.length && node.parent.children[node.parent.children.length - 1] == node) {
            var lastChildrenArr = [];
            var assistantChildrenCount = 0;
            var partnerChildrenCount = 0;


            for (var j = 0; j < node.parent.children.length; j++) {
                var lnode = node.parent.children[j];
                if (lnode.tags.indexOf("partner") == -1 && lnode.tags.indexOf("left-partner") == -1 && lnode.tags.indexOf("right-partner") == -1 && lnode.tags.indexOf("assistant") == -1 && lnode.children.length == 0) {
                    lastChildrenArr.push(lnode.id);
                }
                else if (lnode.tags.indexOf("assistant") != -1) {
                    assistantChildrenCount++;
                }
                else if (lnode.tags.indexOf("partner") != -1 || lnode.tags.indexOf("left-partner") != -1 || lnode.tags.indexOf("right-partner") != -1) {
                    partnerChildrenCount++;
                }
            }

            if (OrgChart.MIXED_LAYOUT_ALL_NODES && lastChildrenArr.length > 1 && lastChildrenArr.length == node.parent.children.length - assistantChildrenCount - partnerChildrenCount) {
                lastChildrenPidIds[node.pid] = lastChildrenArr;
            }
            else if (!OrgChart.MIXED_LAYOUT_ALL_NODES && lastChildrenArr.length > 1) {
                lastChildrenPidIds[node.pid] = lastChildrenArr;
            }
        }
    }
    else if (!node.isAssistant && node.childrenIds.length == 0 && node.parent) {
        if (!lastChildrenPidIds[node.pid]) {
            var lastChildrenArr = [];
            var assistantChildrenCount = 0;
            var partnerChildrenCount = 0;
            for (var j = 0; j < node.parent.children.length; j++) {
                var lnode = node.parent.children[j];
                if (lnode.tags.indexOf("partner") == -1 && lnode.tags.indexOf("left-partner") == -1 && lnode.tags.indexOf("right-partner") == -1 && lnode.tags.indexOf("assistant") == -1 && lnode.childrenIds.length == 0) {
                    lastChildrenArr.push(lnode.id);
                }
                else if (lnode.tags.indexOf("assistant") != -1) {
                    assistantChildrenCount++;
                }
                else if (lnode.tags.indexOf("partner") != -1 || lnode.tags.indexOf("left-partner") != -1 || lnode.tags.indexOf("right-partner") != -1) {
                    partnerChildrenCount++;
                }
            }

            if (OrgChart.MIXED_LAYOUT_ALL_NODES && lastChildrenArr.length > 1 && lastChildrenArr.length == node.parent.childrenIds.length - assistantChildrenCount - partnerChildrenCount) {
                lastChildrenPidIds[node.pid] = lastChildrenArr;
            }
            else if (!OrgChart.MIXED_LAYOUT_ALL_NODES && lastChildrenArr.length > 1) {

                lastChildrenPidIds[node.pid] = lastChildrenArr;
            }
        }
    }





    if (node.stChildren.length) {
        if (!root.stContainerNodes) {
            root.stContainerNodes = [];
        }
        root.stContainerNodes.push(node);
    }

    for (var i = 0; i < node.stChildren.length; i++) {
        var lcn = "";
        for (var j = 0; j < node.tags.length; j++) {
            if (layoutConfigs[node.tags[j]]) {
                lcn = node.tags[j];
                break;
            }
        }

        subTreeIds.push(node.stChildren[i].id);
        OrgChart.manager._iterate(root, node.stChildren[i], nodes, 0, subTreeIds, assistantPidIds, subLevelsIds, lastChildrenPidIds, lcn, expandedNodeIds, partnerIds, instance);
    }

    level++;

    for (var i = 0; i < node.children.length; i++) {
        OrgChart.manager._iterate(root, node.children[i], nodes, level, subTreeIds, assistantPidIds, subLevelsIds, lastChildrenPidIds, layoutConfigName, expandedNodeIds, partnerIds, instance);
    }

};

OrgChart.manager.__createNodes = function (nodes, roots, config, action, actionParams, oldNodes, rootList, instance) {
    var data = config.nodes;
    var nodeIds = [];

    for (var i = 0; i < data.length; i++) {
        var d = data[i];

        var tags;
        if (OrgChart.STRING_TAGS){
            tags = d.tags ? d.tags.split(',') : []
        }
        else{
            tags = Array.isArray(d.tags) ? d.tags.slice(0) : [];
        }

        if (instance.filterUI.addFilterTag(d)){
            tags.push('filter');
        }

        var templateName = OrgChart._getTemplate(tags, config.tags, config.template);
        var node = new OrgChart.node(d.id, d.pid, tags, templateName);

        if (!OrgChart.isNEU(d.ppid)){
            node.ppid = d.ppid;
        }

        if (!OrgChart.isNEU(d.stpid)) {
            node.stpid = d.stpid;
        }

        if (config.orderBy != null) {
            node.order = OrgChart.manager._getOrderFieldValue(d, config.orderBy);
        }
        nodes[d.id] = node;
        nodeIds.push(d.id);
    }

    //start order
    if (config.orderBy != null) {
        nodeIds.sort(function (a, b) {
            var an = nodes[a].order;
            var bn = nodes[b].order;

            if (typeof (an) == "number" || typeof (bn) == "number") {
                if (an == undefined) {
                    an = -1;
                }
                if (bn == undefined) {
                    bn = -1;
                }
                if (config.orderBy.desc) {
                    return bn - an;
                }
                else {
                    return an - bn;
                }
            }
            else if (typeof (an) == "string" || typeof (bn) == "string") {
                if (an == undefined) {
                    an = "";
                }
                if (bn == undefined) {
                    bn = "";
                }
                if (config.orderBy.desc) {
                    return bn.localeCompare(an);
                }
                else {
                    return an.localeCompare(bn);
                }

            }
        });
    }
    //end start order

    for (var i = 0; i < nodeIds.length; i++) {
        var id = nodeIds[i];
        var node = nodes[id];
        var oldNode = oldNodes ? oldNodes[id] : null;

        var stpnode = nodes[node.stpid];
        var pnode = nodes[node.pid];

        if (!stpnode) {
            node.stpid = null;
        }

        if (!pnode) {
            node.pid = null;
        }

        if (stpnode) {
            var stOldNode = oldNodes ? oldNodes[stpnode.id] : null;

            if (stOldNode) {
                stpnode.min = stOldNode.min;
            }

            stpnode.stChildrenIds.push(node.id);
        }
        else if (pnode) {
            if (oldNode){
                node.collapsed = oldNode.collapsed;
                node.min = oldNode.min;
            }
            pnode.childrenIds.push(node.id);
        }
        else {
            if (oldNode){
                node.collapsed = oldNode.collapsed;
                node.min = oldNode.min;
            }
            roots.push(node);
            rootList.push(node.id);
        }


        if (action == OrgChart.action.init) {
            node.min = OrgChart._getMin(node, config);
        }
    }
};

OrgChart.manager._createNodes = function (instance) {
    var config = instance.manager.config;
    var layoutConfigs = instance.manager.layoutConfigs;
    var action = instance.manager.action;
    var actionParams = instance.manager.actionParams;
    var oldNodes = instance.manager.oldNodes;
    var state = instance.manager.state;

    var nodes = {};
    var roots = [];
    var rootList = [];

    OrgChart.manager.__createNodes(nodes, roots, config, action, actionParams, oldNodes, rootList, instance);




    if (config.roots != null) {
        roots = [];
        for(var i = 0; i < config.roots.length; i++){
            var root = nodes[config.roots[i]];
            if (root && action == OrgChart.action.centerNode){
                var realRoot = root;
                while(realRoot.pid != null || realRoot.stpid != null){
                    if (realRoot.pid == null && realRoot.stpid != null){
                        realRoot = nodes[realRoot.stpid];
                    }
                    else{
                        realRoot = nodes[realRoot.pid];
                    }
                }

                var centerRootNode = nodes[actionParams.id];
                while (centerRootNode.pid != null || centerRootNode.stpid != null) {
                    if (centerRootNode.pid == null && centerRootNode.stpid != null){
                        centerRootNode = nodes[centerRootNode.stpid];
                    }
                    else{
                        centerRootNode = nodes[centerRootNode.pid];
                    }
                }

                if (realRoot == centerRootNode){
                    root = realRoot;
                }
            }

            if (root){
                var contains = false;
                for(var k = 0; k < roots.length; k++){
                    if (roots[k].id == root.id){
                        contains = true;
                        break;
                    }
                }

                if (!contains){
                    //fix https://balkan.app/OrgChartJS-Demos/SetNodeAsRoot
                    if  (!OrgChart.isNEU(root.pid)){
                        var pnode = nodes[root.pid];

                        var index = pnode.childrenIds.indexOf(root.id);;
                        if (index > -1) {
                            pnode.childrenIds.splice(index, 1);
                        }
                        //fix https://balkan.app/OrgChartJS-Demos/ExpandCollapseParent.html
                        //root.pid = null;
                        //end fix https://balkan.app/OrgChartJS-Demos/ExpandCollapseParent.html
                    }
                    //end fix https://balkan.app/OrgChartJS-Demos/SetNodeAsRoot
                    roots.push(root);
                }
            }
        }


        config.roots = [];
        for(var i = 0; i < roots.length; i++){
            config.roots.push(roots[i].id);
        }
    }

    if (action == OrgChart.action.exporting && actionParams.id != undefined) {
        var node = nodes[actionParams.id];
        if (node){
            node.pid = null;
            //OrgChart.manager._setStContainerNodesForRoot(node, node);
            roots = [node];
        }
    }





    //start expand collapse logic
    var expandedNodeIds = [];
    //TEST STATE FEATURE IF CHANGE THE IF BELOW
    if (action == OrgChart.action.init  && config.expand && config.expand.nodes && state == null) {
        for (var i = 0; i < config.expand.nodes.length; i++) {
            var node = nodes[config.expand.nodes[i]];

            //set add all children as expanded
            if (config.expand.allChildren === true){
                OrgChart.manager._addExpandedNodeIdsIterate(node, nodes, expandedNodeIds);
            }

            //set add all parents as expanded
            while (node) {
                expandedNodeIds.push(node.id);
                if (node.pid == null && node.stpid != null){
                    node = nodes[node.stpid];
                    node.min = false;
                }
                else{
                    node = nodes[node.pid];
                }
            }
        }
    }
    else if ((action == OrgChart.action.expand && actionParams.ids && actionParams.ids != 'all') || (action == OrgChart.action.collapse && actionParams &&  actionParams.expandIds)) {
        var ids;
        if (action == OrgChart.action.expand){
            ids = actionParams.ids;
        }
        else {
            ids = actionParams.expandIds;
        }
        for (var i = 0; i < ids.length; i++) {
            var node = nodes[ids[i]];
            var pnode = nodes[node.pid];

            while (pnode) {
                expandedNodeIds.push(pnode.id);
                if (pnode.pid == null && pnode.stpid != null){
                    pnode = nodes[pnode.stpid];
                    pnode.min = false;
                }
                else{
                    pnode = nodes[pnode.pid];
                }
            }
        }
    }
    else if (action == OrgChart.action.centerNode) {
        var centerNode = nodes[actionParams.id];
        while (centerNode) {
            expandedNodeIds.push(centerNode.id);
            if (actionParams.options.parentState === OrgChart.COLLAPSE_PARENT_NEIGHBORS) {
                if (centerNode) {
                    for (var i = 0; i < centerNode.childrenIds.length; i++) {
                        var cnode = nodes[centerNode.childrenIds[i]];
                        cnode.collapsed = true;
                    }
                }
            }
            if (centerNode.pid == null && centerNode.stpid != null){
                centerNode = nodes[centerNode.stpid];
                centerNode.min = false;
            }
            else{
                centerNode = nodes[centerNode.pid];
            }
        }

        var centerNode = nodes[actionParams.id];
        if (actionParams.options.childrenState === OrgChart.COLLAPSE_SUB_CHILDRENS) {
            for (var i = 0; i < centerNode.childrenIds.length; i++) {
                var c1node = nodes[centerNode.childrenIds[i]];
                c1node.collapsed = false;
                for (var j = 0; j < c1node.childrenIds.length; j++) {
                    var c2node = nodes[c1node.childrenIds[j]];
                    c2node.collapsed = true;
                }
            }
        }
        if (actionParams.options.parentState === OrgChart.COLLAPSE_PARENT_SUB_CHILDREN_EXCEPT_CLICKED) {
            var pnode = nodes[centerNode.pid];
            if (pnode){
                for (var i = 0; i < pnode.childrenIds.length; i++) {
                    var c1node = nodes[pnode.childrenIds[i]];
                    if (c1node != centerNode){
                        c1node.collapsed = false;
                        for (var j = 0; j < c1node.childrenIds.length; j++) {
                            var c2node = nodes[c1node.childrenIds[j]];
                            c2node.collapsed = true;
                        }
                    }
                }
            }
        }
    }
    else if (action == OrgChart.action.insert){

        var node = nodes[actionParams.insertedNodeId];

        while (node) {
            expandedNodeIds.push(node.id);
            if (node.pid == null && node.stpid != null){
                node = nodes[node.stpid];
                node.min = false;
            }
            else{
                node = nodes[node.pid];
            }
        }
    }
    //end expand collapse logic

    var subTreeIds = [];
    var assistantPidIds = {};
    var subLevelsIds = [];
    var lastChildrenPidIds = {};
    var partnerIds = [];

    for (var i = 0; i < roots.length; i++) {
        OrgChart.manager._iterate(roots[i], roots[i], nodes, 0, subTreeIds, assistantPidIds, subLevelsIds, lastChildrenPidIds, "", expandedNodeIds, partnerIds, instance);
        //state
        //actionParams
        //layoutConfigs,
        //config,
        //action
    }

    for (var i = roots.length - 1; i >= 0; i--) {
        if (roots[i].collapsed){
            roots.splice(i, 1);
        }
    }

    // var args = {
    //     config: config,
    //     nodes: nodes,
    //     partnerIds: partnerIds
    // };

    // var result = OrgChart.events.publish('structure', [args]);
    // if (result === false) {
    //     return;
    // }

    //start partners
    for(var i = 0; i < partnerIds.length; i++) {
        var node = nodes[partnerIds[i]];
        var childrenIds = []; //do not use node.childrenIds directly as it couild have collpased nodes
        var rightPartnerIds = [];
        var leftPartnerIds = [];
        var ppidPartnerPpidIds = {};
        var evenChecker = 0;
        var leftNodesWithPpidCount = 0;
        var rightNodesWithPpidCount = 0;

        var rightPartnersWithChildrenIds = [];
        var leftPartnersWithChildrenIds = [];

        for(var j = 0; j < node.children.length; j++){
            var cnode = node.children[j];

            if (!cnode.isAssistant){
                if (cnode.tags.indexOf('right-partner') != -1){
                    cnode.isPartner = 1;
                    cnode.children = [];
                    rightPartnerIds.push(cnode.id);
                }
                else if (cnode.tags.indexOf('left-partner') != -1){
                    cnode.isPartner = 2;
                    cnode.children = [];
                    leftPartnerIds.push(cnode.id);
                }
                else if (cnode.tags.indexOf('partner') != -1 && !(evenChecker%2)){
                    cnode.isPartner = 1;
                    cnode.children = [];
                    rightPartnerIds.push(cnode.id);
                    evenChecker++;
                }
                else if (cnode.tags.indexOf('partner') != -1 && (evenChecker%2)){
                    cnode.isPartner = 2;
                    cnode.children = [];
                    leftPartnerIds.push(cnode.id);
                    evenChecker++;
                }
                else if (cnode.parentPartner){
                    if (!ppidPartnerPpidIds[cnode.parentPartner.id]){
                        ppidPartnerPpidIds[cnode.parentPartner.id] = [];
                    }
                    ppidPartnerPpidIds[cnode.parentPartner.id].push(cnode.id);

                }
                else{
                    childrenIds.push(cnode.id);
                }
            }
            else{
                childrenIds.push(cnode.id);
            }
        }

        node.children = [];

        for(var j = 0; j < rightPartnerIds.length; j++){
            var cnode = nodes[rightPartnerIds[j]];
            if (ppidPartnerPpidIds[cnode.id]){
                node.children.push(cnode);
            }
            else{
                node.children.splice(0,0,cnode);
            }
        }

        for(var j = 0; j < leftPartnerIds.length; j++){
            var cnode = nodes[leftPartnerIds[j]];
            if (ppidPartnerPpidIds[cnode.id]){
                node.children.push(cnode);
            }
            else{
                node.children.splice(0,0,cnode);
            }
        }

        for(var j = leftPartnerIds.length - 1; j >= 0 ; j--){
            if (ppidPartnerPpidIds[leftPartnerIds[j]]){
                for(var k = 0; k < ppidPartnerPpidIds[leftPartnerIds[j]].length; k++){
                    node.children.push(nodes[ppidPartnerPpidIds[leftPartnerIds[j]][k]]);
                    leftNodesWithPpidCount++;

                    if (leftPartnersWithChildrenIds.indexOf(leftPartnerIds[j]) == -1){
                        leftPartnersWithChildrenIds.push(leftPartnerIds[j]);
                    }
                }
            }
        }

        for(var j = 0; j < childrenIds.length; j++){
            var cnode = nodes[childrenIds[j]];
            node.children.push(cnode);
        }

        for(var j = 0; j < rightPartnerIds.length; j++){
            if (ppidPartnerPpidIds[rightPartnerIds[j]]){
                for(var k = 0; k < ppidPartnerPpidIds[rightPartnerIds[j]].length; k++){
                    node.children.push(nodes[ppidPartnerPpidIds[rightPartnerIds[j]][k]]);
                    rightNodesWithPpidCount++;

                    if (rightPartnersWithChildrenIds.indexOf(rightPartnerIds[j]) == -1){
                        rightPartnersWithChildrenIds.push(rightPartnerIds[j]);
                    }
                }
            }
        }

        node.partnerSeparation = Math.max(leftPartnersWithChildrenIds.length, rightPartnersWithChildrenIds.length) * config.partnerChildrenSplitSeparation + config.minPartnerSeparation;


        if (!childrenIds.length && leftNodesWithPpidCount && !rightNodesWithPpidCount){
            node.hasPartners = 2;
        }
        else if (!childrenIds.length && !leftNodesWithPpidCount && rightNodesWithPpidCount){
            node.hasPartners = 3;
        }
        else if (!childrenIds.length && leftNodesWithPpidCount == 1 && rightNodesWithPpidCount == 1){
            node.hasPartners = 4;
        }
        else if (!childrenIds.length && !leftNodesWithPpidCount  && !rightNodesWithPpidCount){
            node.hasPartners = 5;
        }
        else if (childrenIds.length && !leftNodesWithPpidCount  && !rightNodesWithPpidCount){
            node.hasPartners = 6;
        }
        else if (childrenIds.length && (leftNodesWithPpidCount  || rightNodesWithPpidCount)){
            node.hasPartners = 7;
        }
        else {
            node.hasPartners = 1;
        }
    }
    //end partners


    //start SubLevels
    for (var i = 0; i < subLevelsIds.length; i++) {
        var node = nodes[subLevelsIds[i]];
        var configName = node.lcn ? node.lcn : "base";
        var layoutConfig = layoutConfigs[configName];
        if (layoutConfig.layout != OrgChart.normal &&  lastChildrenPidIds[node.pid]){ //Not set subLevels if the node is last child and has mixed layout
            continue;
        }
        for (var j = 0; j < node.subLevels; j++) {

            var slnode = new OrgChart.node(node.id + "_sub_level_index_" + j, node.pid, [], "subLevel");
            OrgChart.manager._initDinamicNode(slnode, node.lcn);

            var pnode = node.parent;
            if (!pnode) continue; // probably root


            var index = pnode.children.indexOf(node);
            if (index > -1) {
                pnode.children.splice(index, 1);
                pnode.children.splice(index, 0, slnode);
            }

            slnode.children.push(node);
            slnode.parent = pnode;
            node.parent = slnode;
            nodes[slnode.id] = slnode;
        }
    }
    //end SubLevels

    //start assistant change structure
    for (var pid in assistantPidIds) {
        var pnode = nodes[pid]; //parent node
        pnode.hasAssistants = true;

        var slnode = new OrgChart.node(pnode.id + "_split_assitant_0", pnode.id, ["assistant"], "split"); //last split node
        OrgChart.manager._initDinamicNode(slnode, pnode.lcn, true);


        nodes[slnode.id] = slnode;


        var anodeIds = [];//assistant node ids

        for (var j = pnode.children.length - 1; j >= 0; j--) {
            var cnode = pnode.children[j]; //child node
            if (cnode.isAssistant) {
                cnode.parent = null;
                pnode.children.splice(j, 1);
                anodeIds.splice(0, 0, cnode.id);
            }
            else if(!cnode.isPartner){
                //cnode.pid = slnode.id;

                //fix start https://github.com/BALKANGraph/OrgChartJS/issues/596
                if (cnode.parent && lastChildrenPidIds[cnode.parent.id] && slnode && cnode.parent.id != slnode.id){
                    Object.defineProperty(lastChildrenPidIds, slnode.id,
                        Object.getOwnPropertyDescriptor(lastChildrenPidIds, cnode.parent.id));
                    delete lastChildrenPidIds[cnode.parent.id];
                }
                //fix end https://github.com/BALKANGraph/OrgChartJS/issues/596

                cnode.parent = slnode;
                slnode.children.unshift(cnode);
                pnode.children.splice(j, 1);
            }
        }

        if (anodeIds.length % 2) { //odd
            var lanode = nodes[anodeIds[anodeIds.length - 1]]; //last assistant node

            var mnode = new OrgChart.node(lanode.id + "_mirror", lanode.pid, [], "mirror"); //mirror node
            OrgChart.manager._initDinamicNode(mnode, lanode.lcn, true);
            lanode._m = mnode.id;
            mnode.isAssistant = true;
            mnode.w = lanode.w;
            mnode.h = lanode.h;
            nodes[mnode.id] = mnode;
            anodeIds.splice(anodeIds.length - 1, 0, mnode.id);
        }

        var autoIncrement = 1;

        for (var j = anodeIds.length - 1; j >= 0; j--) {
            if (j % 2 && j != anodeIds.length - 1) {//odd
                var snode = new OrgChart.node(pnode.id + "_split_assitant_" + autoIncrement, null, [], "split"); //split node
                OrgChart.manager._initDinamicNode(snode, pnode.lcn, true);

                nodes[snode.id] = snode;
                anodeIds.splice(j, 0, snode.id);
                autoIncrement++;
            }
            else if (j % 2) {
                anodeIds.splice(j, 0, slnode.id);
            }
        }


        for (var j = 0; j < anodeIds.length; j = j + 3) {
            var psnode = null;
            if (j == 0) {
                psnode = pnode;
            }
            else {
                psnode = nodes[anodeIds[j - 2]]; //parent split node
            }

            var fcnode = nodes[anodeIds[j]];
            var scnode = nodes[anodeIds[j + 1]];
            var tcnode = nodes[anodeIds[j + 2]];

            fcnode.parent = psnode;
            //fcnode.pid = psnode.id;

            scnode.parent = psnode;
            //scnode.pid = psnode.id;

            tcnode.parent = psnode;
            //tcnode.pid = psnode.id;

            psnode.children.push(fcnode);
            psnode.children.push(scnode);
            psnode.children.push(tcnode);
        }
    }
    //end assistant change structure


    //start layout change structure
    var hasMixedLayout = false;
    for (var layoutConfigName in layoutConfigs) {
        var layoutConfig = layoutConfigs[layoutConfigName];
        if (layoutConfig.layout == OrgChart.mixed || layoutConfig.layout == OrgChart.tree || layoutConfig.layout == OrgChart.treeRightOffset || layoutConfig.layout == OrgChart.treeLeftOffset) {
            hasMixedLayout = true;
            break;
        }
    }

    var hasAttachedLayoutEventListener = OrgChart.events.has('node-layout', instance._event_id)

    if (hasMixedLayout || hasAttachedLayoutEventListener) {
        var args = {
            nodes: nodes,
            config: config,
            action: action,
            actionParams: actionParams
        };

        for (var pid in lastChildrenPidIds) {
            var pnode = nodes[pid];
            var configName = pnode.lcn ? pnode.lcn : "base";
            var layoutConfig = layoutConfigs[configName];

            if (layoutConfig.layout == OrgChart.mixed || layoutConfig.layout == OrgChart.tree || layoutConfig.layout == OrgChart.treeRightOffset || layoutConfig.layout == OrgChart.treeLeftOffset || hasAttachedLayoutEventListener) {
                args.pnode = pnode;
                args.layout = layoutConfig.layout;
                args.childrenIds = lastChildrenPidIds[pid];
                args.lastChildrenPidIds = lastChildrenPidIds;

                OrgChart.events.publish('node-layout', [instance, args]);

                //remove May 2024, use node-layout instead
                OrgChart.events.publish('layout', [args]);

                if (args.layout ==  OrgChart.mixed){
                    var cnodeIds = args.childrenIds;
                    for (var i = cnodeIds.length - 1; i >= 0; i--) {
                        var cnode = nodes[cnodeIds[i]];
                        pnode = cnode.parent;
                        cnode.layout = OrgChart.mixed;

                        for (var j = pnode.children.length - 1; j >= 0; j--) {
                            if (cnode.id == pnode.children[j].id) {
                                pnode.children.splice(j, 1);
                                break;
                            }
                        }

                        if (i > 0) {
                            var cpnode = nodes[cnodeIds[i - 1]]
                            cnode.parent = cpnode;
                            cnode.layout = OrgChart.mixed;
                            cpnode.children.push(cnode);
                        }
                        else{
                            pnode.children.push(cnode);
                        }

                    }
                }
                else if (args.layout == OrgChart.tree || args.layout == OrgChart.treeRightOffset || args.layout == OrgChart.treeLeftOffset){

                    var slnode = new OrgChart.node(pnode.id + "_split_0", pnode.id, [], "split"); //last split node
                    OrgChart.manager._initDinamicNode(slnode, pnode.lcn)
                    nodes[slnode.id] = slnode;
                    slnode.layout = OrgChart.tree;

                    var tnodeIds = [];//tree node ids

                    for (var i = args.childrenIds.length - 1; i >= 0; i--) {

                        var cnode = nodes[args.childrenIds[i]];

                        for (var j = 0; j < pnode.children.length; j++) {
                            if (pnode.children[j].id == cnode.id) {
                                pnode.children.splice(j, 1);
                            }
                        }
                        cnode.parent = null;
                        cnode.layout = OrgChart.tree;

                        if (args.layout == OrgChart.treeRightOffset) {
                            tnodeIds.splice(0, 0, cnode.id);
                        }
                        if (args.layout == OrgChart.treeLeftOffset || args.layout == OrgChart.treeRightOffset) {
                            var tnode = new OrgChart.node(cnode.id + "_mirror", null, [], "mirror"); //mirror node
                            OrgChart.manager._initDinamicNode(tnode, cnode.lcn)
                            tnode.layout = OrgChart.tree;
                            nodes[tnode.id] = tnode;
                            tnodeIds.splice(0, 0, tnode.id);
                        }

                        if (args.layout != OrgChart.treeRightOffset) {
                            tnodeIds.splice(0, 0, cnode.id);
                        }
                    }

                    var autoIncrement = 1;

                    for (var j = tnodeIds.length - 1; j >= 0; j--) {
                        if (j % 2 && j != tnodeIds.length - 1) {//odd
                            var snode = new OrgChart.node(pnode.id + "_split_" + autoIncrement, null, [], "split"); //split node
                            OrgChart.manager._initDinamicNode(snode, pnode.lcn)

                            snode.layout = OrgChart.tree;

                            nodes[snode.id] = snode;
                            tnodeIds.splice(j, 0, snode.id);
                            autoIncrement++;
                        }
                        else if (j % 2) {
                            tnodeIds.splice(j, 0, slnode.id);
                        }
                    }

                    for (var j = 0; j < tnodeIds.length; j = j + 3) {
                        var psnode = null;
                        if (j == 0) {
                            psnode = pnode;
                        }

                        var fcnode = nodes[tnodeIds[j]];
                        var scnode = nodes[tnodeIds[j + 1]];
                        var tcnode = nodes[tnodeIds[j + 2]];

                        if (j != 0) {
                            psnode = nodes[tnodeIds[j - 3]]; //parent split node
                        }
                        if (j != 0 && !scnode) {
                            psnode = nodes[tnodeIds[j - 2]]; //parent split node
                        }
                        fcnode.parent = psnode;
                        psnode.children.push(fcnode);

                        if (scnode) {
                            if (j != 0) {
                                psnode = nodes[tnodeIds[j - 2]]; //parent split node
                            }
                            scnode.parent = psnode;
                            psnode.children.push(scnode);
                        }

                        if (tcnode) {
                            if (j != 0) {
                                psnode = nodes[tnodeIds[j - 1]]; //parent split node
                            }
                            tcnode.parent = psnode;
                            psnode.children.push(tcnode);
                        }
                    }
                }
            }
        }
    }
   //end tree layout change structure





    return {
        nodes: nodes,
        roots: roots,
        rootList: rootList
    };
};

OrgChart.manager._getOrderFieldValue = function (dataItem, orderBy) {
    var orderByField = orderBy;
    if (orderBy.field) {
        orderByField = orderBy.field;
    }
    return dataItem[orderByField];
};

OrgChart.manager._getNodeWidth = function (node, config) {
    switch (config.orientation) {
        case OrgChart.orientation.top:
        case OrgChart.orientation.top_left:
        case OrgChart.orientation.bottom:
        case OrgChart.orientation.bottom_left:
            return node.w;

        case OrgChart.orientation.right:
        case OrgChart.orientation.right_top:
        case OrgChart.orientation.left:
        case OrgChart.orientation.left_top:
            return node.h;
    }

    return 0;
};


OrgChart.manager._isVisible = function (node, config, viewBox, action) {
    if (node.x == null || node.y == null) {
        return;
    }
    if (config.lazyLoading && action !== OrgChart.action.exporting) {
        function is_vizible(n, viewBox) {
            var x = n.x;
            var y = n.y;
            var w = n.w;
            var h = n.h;

            var viewBox_x1 = viewBox[0] - OrgChart.LAZY_LOADING_FACTOR;
            var viewBox_x2 = viewBox[2] + OrgChart.LAZY_LOADING_FACTOR + viewBox[0];
            var viewBox_y1 = viewBox[1] - OrgChart.LAZY_LOADING_FACTOR;
            var viewBox_y2 = viewBox[3] + OrgChart.LAZY_LOADING_FACTOR + viewBox[1];

            var visible = (x + w > viewBox_x1 && viewBox_x2 > x);
            if (visible) {
                visible = (y + h > viewBox_y1 && viewBox_y2 > y);
            }
            return visible;
        }

        if (is_vizible(node, viewBox)) {
            return true;
        }
        else {
            for (var i = 0; i < node.children.length; i++) {
                if (is_vizible(node.children[i], viewBox)) {
                    return true;
                }
            }
        }
        return false;
    }

    return true;
};



OrgChart.manager.getAllFields = function (config) {
    var fields = [OrgChart.TAGS];

    for (var i in config.nodeBinding) {
        fields.push(config.nodeBinding[i]);
    }

    for (var i = 0; i < config.nodes.length; i++) {
        for (var j in config.nodes[i]) {
            if (j === OrgChart.ID) {
                continue;
            }
            if (j === OrgChart.TAGS) {
                continue;
            }
            if (j === OrgChart.NODES) {
                continue;
            }
            if (j === OrgChart.PID) {
                continue;
            }
            if (j === OrgChart.STPID) {
                continue;
            }
            if (config.nodeBinding[j]) {
                continue;
            }
            if (!fields.has(j)) {
                fields.push(j);
            }
        }
    }

    return fields;
};



OrgChart.manager._getMostDeepChild = function (node) {
    if (!node) {
        return;
    }
    var mostDeep = node;
    function getMostDeepChild(n) {

        if (n.sl > mostDeep.sl) {
            mostDeep = n;
        }

        for (var i = 0; i < n.children.length; i++) {
            getMostDeepChild(n.children[i]);
        }
    }
    getMostDeepChild(node);

    return mostDeep;
};





OrgChart.manager._getResponse = function (width, height, oldVisibleNodeIds, config, maxX, maxY, minX, minY, viewBox, roots, action, actionParams, nodes, oldNodes, vbIsInitializedFromState) {
    var firstRoot = roots[0];
    var visibleNodeIds = [];
    var boundary = {
        top: null,
        left: null,
        bottom: null,
        right: null,
        minX: null,
        maxX: null,
        minY: null,
        maxY: null
    };

    var animations = [[], [], []];

    var inX = maxX - minX + config.padding * 2;
    var inY = maxY - minY + config.padding * 2;

    var scale = OrgChart.getScale(viewBox, width, height, config.scaleInitial, config.scaleMax, config.scaleMin, inX, inY);

    boundary.top = minY - config.padding;
    boundary.left = minX - config.padding;
    boundary.bottom = maxY + config.padding - height / scale;
    boundary.right = maxX + config.padding - width / scale;
    boundary.maxX = maxX;
    boundary.minX = minX;
    boundary.maxY = maxY;
    boundary.minY = minY;



    if (roots.length == 0 || (viewBox == null && !vbIsInitializedFromState && config.align == OrgChart.CENTER)) { //initial load viewBox  is null
        var w = Math.ceil(width / scale);
        var h = Math.ceil(height / scale);
        var x = 0;
        var y = 0;

        if (w - config.padding * 2 >= maxX - minX) {//x is inside boundery areay
            x = (maxX + minX) / 2 - w / 2;
            switch (config.orientation) {
                case OrgChart.orientation.right:
                case OrgChart.orientation.right_top:
                    x = (minX - maxX) / 2 - w / 2;
                    break;
            }
        }
        else {//outside boundary area
            x = firstRoot.x - w / 2 + OrgChart.manager._getNodeWidth(firstRoot, config) / 2;
            switch (config.orientation) {
                case OrgChart.orientation.right:
                case OrgChart.orientation.right_top:
                    x = -((w / 2) - (minX - maxX) / 2);
                    if (x < config.padding - w) {
                        x = config.padding - w;
                    }
                    break;
                case OrgChart.orientation.left:
                case OrgChart.orientation.bottom_left:
                case OrgChart.orientation.top_left:
                case OrgChart.orientation.left_top:
                    x = -((w / 2) - (maxX - minX) / 2);
                    if (x > -config.padding) {
                        x = -config.padding
                    }
                    break;
            }
        }

        if (h - config.padding * 2 >= maxY - minY) {//y is inside boundery areay
            y = (maxY + minY) / 2 - h / 2;
            switch (config.orientation) {
                case OrgChart.orientation.bottom:
                case OrgChart.orientation.bottom_left:
                    y = (minY - maxY) / 2 - h / 2;
                    break;
            }
        }
        else {//outside boundary area

            y = -((h / 2) - (maxY - minY) / 2);

            if (y > -config.padding) {
                y = -config.padding;
            }
            switch (config.orientation) {
                case OrgChart.orientation.bottom:
                case OrgChart.orientation.bottom_left:
                    y = -((h / 2) - (minY - maxY) / 2);
                    if (y < config.padding - h) {
                        y = config.padding - h;
                    }
                    break;
                case OrgChart.orientation.left:
                case OrgChart.orientation.right:
                    y = firstRoot.y - h / 2 + OrgChart.manager._getNodeWidth(firstRoot, config) / 2;
                    break;
            }
        }

        viewBox = [x, y, w, h];
    }
    else if (viewBox == null && !vbIsInitializedFromState && config.align == OrgChart.ORIENTATION) {
        var w = Math.ceil(width / scale);
        var h = Math.ceil(height / scale);
        var x = 0;
        var y = 0;
        switch (config.orientation) {
            case OrgChart.orientation.top:
                x = firstRoot.x - w / 2 + OrgChart.manager._getNodeWidth(firstRoot, config) / 2;
                y = -config.padding;
                break;
            case OrgChart.orientation.bottom:
                x = firstRoot.x - w / 2 + OrgChart.manager._getNodeWidth(firstRoot, config) / 2;
                y = config.padding - h;
                break;
            case OrgChart.orientation.left:
                x = -config.padding;
                y = firstRoot.y - h / 2 + OrgChart.manager._getNodeWidth(firstRoot, config) / 2;
                break;
            case OrgChart.orientation.right:
                x = config.padding - w;
                y = firstRoot.y - h / 2 + OrgChart.manager._getNodeWidth(firstRoot, config) / 2;
                break;
            case OrgChart.orientation.top_left:
                x = -config.padding;
                y = -config.padding;
                break;
            case OrgChart.orientation.right_top:
                x = config.padding - w;
                y = -config.padding;
                break;
            case OrgChart.orientation.left_top:
                x = -config.padding;
                y = -config.padding;
                break;
            case OrgChart.orientation.bottom_left:
                x = -config.padding;
                y = config.padding - h;
                break;
        }



        viewBox = [x, y, w, h];

        if (config.sticky) {
            //_moveToBoundaryArea start
            if (viewBox[0] < boundary.left && viewBox[0] < boundary.right) {
                viewBox[0] = boundary.left > boundary.right ? boundary.right : boundary.left;
            }
            if (viewBox[0] > boundary.right && viewBox[0] > boundary.left) {
                viewBox[0] = boundary.left > boundary.right ? boundary.left : boundary.right;
            }
            if (viewBox[1] < boundary.top && viewBox[1] < boundary.bottom) {
                viewBox[1] = boundary.top > boundary.bottom ? boundary.bottom : boundary.top;
            }
            if (viewBox[1] > boundary.bottom && viewBox[1] > boundary.top) {
                viewBox[1] = boundary.top > boundary.bottom ? boundary.top : boundary.bottom;
            }
            //_moveToBoundaryArea end
        }

    }


    if (action == OrgChart.action.centerNode || action == OrgChart.action.maximize) {
        var centerNode = nodes[actionParams.id];
        if (actionParams.options.horizontal == true) {
            viewBox[0] = (centerNode.x + centerNode.w / 2 - viewBox[2] / 2);
        }
        if (actionParams.options.vertical == true) {
            viewBox[1] = (centerNode.y + centerNode.h / 2 - viewBox[3] / 2);
        }

        if (config.sticky) {
            //_moveToBoundaryArea start
            if (viewBox[0] < boundary.left && viewBox[0] < boundary.right) {
                viewBox[0] = boundary.left > boundary.right ? boundary.right : boundary.left;
            }
            if (viewBox[0] > boundary.right && viewBox[0] > boundary.left) {
                viewBox[0] = boundary.left > boundary.right ? boundary.left : boundary.right;
            }
            if (viewBox[1] < boundary.top && viewBox[1] < boundary.bottom) {
                viewBox[1] = boundary.top > boundary.bottom ? boundary.bottom : boundary.top;
            }
            if (viewBox[1] > boundary.bottom && viewBox[1] > boundary.top) {
                viewBox[1] = boundary.top > boundary.bottom ? boundary.top : boundary.bottom;
            }
            //_moveToBoundaryArea end
        }
    }

    if (action == OrgChart.action.insert || action == OrgChart.action.expand || action == OrgChart.action.collapse || action == OrgChart.action.update || action == OrgChart.action.centerNode || action == OrgChart.action.maximize) {
        var shouldBeVisNode = null;
        if (action == OrgChart.action.insert && actionParams && actionParams.insertedNodeId != undefined && actionParams.insertedNodeId != null) {
            shouldBeVisNode = nodes[actionParams.insertedNodeId];
        }
        else if (action == OrgChart.action.update && actionParams && actionParams.visId != undefined && actionParams.visId != null) {
            shouldBeVisNode = nodes[actionParams.visId];
        }
        else if ((action == OrgChart.action.expand || action == OrgChart.action.collapse || action == OrgChart.action.maximize) && actionParams && actionParams.id != undefined && actionParams.id != null) {
            shouldBeVisNode = nodes[actionParams.id];
            shouldBeVisNode = OrgChart.manager._getMostDeepChild(shouldBeVisNode, nodes);
        }
        else if (action == OrgChart.action.centerNode || action == OrgChart.action.maximize) {
            switch (config.orientation) {
                case OrgChart.orientation.top:
                case OrgChart.orientation.top_left:
                case OrgChart.orientation.bottom:
                case OrgChart.orientation.bottom_left:
                    if (!actionParams.options.vertical) {
                        shouldBeVisNode = nodes[actionParams.id];
                    }
                    break;
                case OrgChart.orientation.right:
                case OrgChart.orientation.right_top:
                case OrgChart.orientation.left:
                case OrgChart.orientation.left_top:
                    if (!actionParams.options.horizontal) {
                        shouldBeVisNode = nodes[actionParams.id];
                    }
                    break;
            }

            if (shouldBeVisNode) {
                shouldBeVisNode = OrgChart.manager._getMostDeepChild(shouldBeVisNode, nodes);
            }
        }

        if (!OrgChart.FIXED_POSITION_ON_CLICK && shouldBeVisNode) {
            switch (config.orientation) {
                case OrgChart.orientation.top:
                case OrgChart.orientation.top_left:
                    var newX = (shouldBeVisNode.y + shouldBeVisNode.h - viewBox[3] + config.padding);
                    if (viewBox[1] < newX) {
                        viewBox[1] = newX;
                    }
                    break;
                case OrgChart.orientation.bottom:
                case OrgChart.orientation.bottom_left:
                    var newX = (shouldBeVisNode.y - config.padding);
                    if (viewBox[1] > newX) {
                        viewBox[1] = newX;
                    }
                    break;
                case OrgChart.orientation.right:
                case OrgChart.orientation.right_top:
                    var newX = (shouldBeVisNode.x - config.padding);
                    if (viewBox[0] > newX) {
                        viewBox[0] = newX;
                    }
                    break;
                case OrgChart.orientation.left:
                case OrgChart.orientation.left_top:
                    var newX = (shouldBeVisNode.x + shouldBeVisNode.w - viewBox[2] + config.padding);
                    if (viewBox[0] < newX) {
                        viewBox[0] = newX;
                    }
                    break;
            }
        }
    }

    for (var i = 0; i < roots.length; i++) {
       OrgChart.manager._iterate2(roots[i], nodes, config, viewBox, action, actionParams, visibleNodeIds, oldNodes, oldVisibleNodeIds, animations);
    }

    return {
        animations: animations,
        boundary: boundary,
        viewBox: viewBox,
        visibleNodeIds: visibleNodeIds,
        nodes: nodes,
        allFields: OrgChart.manager.getAllFields(config)
    };
};


OrgChart.manager._iterate2 = function (node, nodes, config, viewBox, action, actionParams, visibleNodeIds, oldNodes, oldVisibleNodeIds, animations) {
    if (OrgChart.manager._isVisible(node, config, viewBox, action)) {//childrean are expanded and in visible area

        visibleNodeIds.push(node.id);
        var a = null;
        if ((action == OrgChart.action.expand || action == OrgChart.action.collapse || action == OrgChart.action.maximize) && oldNodes && oldNodes[node.id] && actionParams.method == 'expandCollapseToLevel') {
            var oldNode = oldNodes[node.id];
            a = {
                x: oldNode.x,
                y: oldNode.y,
            };

            if (oldNode) {
                a = {
                    x: oldNode.x,
                    y: oldNode.y,
                };

                var pnode = node;
                var fCollpased = null;
                while (pnode != null) {
                    if (oldNodes[pnode.id] && oldNodes[pnode.id].collapsed) {
                        fCollpased = pnode;
                    }
                    pnode = pnode.parent;
                }

                if (fCollpased && fCollpased.parent) {
                    a = {
                        x: fCollpased.parent.x,
                        y: fCollpased.parent.y,
                    };
                }
            }

            var clickedNode = nodes[actionParams.id];

            if (clickedNode) {
                var pnode = node.parent;
                while (pnode != null) {
                    pnode = pnode.parent;
                }
                if (pnode) {
                    a = {
                        x: clickedNode.x + clickedNode.w / 2 - node.w / 2,
                        y: clickedNode.y + clickedNode.h / 2 - node.h / 2
                    };
                }
            }
        }
        else if ((action == OrgChart.action.expand || action == OrgChart.action.collapse) && oldNodes && oldNodes[node.id]) {
            var oldNode = oldNodes[node.id];
            a = {
                x: oldNode.x,
                y: oldNode.y,
            };

            if (actionParams.ids == "all") {
                if (oldNode) {
                    a = {
                        x: oldNode.x,
                        y: oldNode.y,
                    };

                    var pnode = node;
                    var fCollpased = null;
                    while (pnode != null) {
                        if (oldNodes[pnode.id] && oldNodes[pnode.id].collapsed) {
                            fCollpased = pnode;
                        }
                        pnode = pnode.parent;
                    }

                    if (fCollpased && fCollpased.parent) {
                        a = {
                            x: fCollpased.parent.x,
                            y: fCollpased.parent.y,
                        };
                    }
                }
            }

            var clickedNode = nodes[actionParams.id];

            if (clickedNode) {
                var pnode = node.parent;
                while (pnode != null && actionParams.ids.indexOf(node.id) == -1 && actionParams.ids.indexOf(pnode.id) == -1) {
                    pnode = pnode.parent;
                }
                if (pnode) {
                    a = {
                        x: clickedNode.x + clickedNode.w / 2 - node.w / 2,
                        y: clickedNode.y + clickedNode.h / 2 - node.h / 2
                    };
                }
            }
        }
        else if (action == OrgChart.action.centerNode && oldNodes && oldNodes[node.id]) {
            var oldNode = oldNodes[node.id];
            if (oldNode.x != null && oldNode.y != null) {
                a = {
                    x: oldNode.x,
                    y: oldNode.y,
                };
            }

            var centerNode = nodes[actionParams.id];
            if (centerNode && centerNode == node) {
                var pnode = node.parent;
                if (pnode && pnode.id == actionParams.id) {
                    a = {
                        x: centerNode.x + centerNode.w / 2 - node.w / 2,
                        y: centerNode.y + centerNode.h / 2 - node.h / 2
                    };
                }
            }
        }
        else if (action == OrgChart.action.maximize && oldNodes && oldNodes[node.id]) {
            var oldNode = oldNodes[node.id];
            if (oldNode.x != null && oldNode.y != null) {
                a = {
                    x: oldNode.x,
                    y: oldNode.y,
                };
            }

            var centerNode = nodes[actionParams.id];
            if (centerNode && centerNode == node) {
                var pnode = node.parent;
                if (pnode && pnode.id == actionParams.id) {
                    a = {
                        x: centerNode.x + centerNode.w / 2 - node.w / 2,
                        y: centerNode.y + centerNode.h / 2 - node.h / 2
                    };
                }
            }
        }
        else if (action == OrgChart.action.minimize && oldNodes && oldNodes[node.id]) {
            var oldNode = oldNodes[node.id];
            a = {
                x: oldNode.x,
                y: oldNode.y,
            };
        }
        else if (action == OrgChart.action.insert && actionParams && actionParams.insertedNodeId == node.id && node.parent) {
            a = {
                x: node.parent.x,
                y: node.parent.y,
            };
        }
        else if ((action == OrgChart.action.update || action == OrgChart.action.insert) && oldNodes) {
            var oldNode = oldNodes[node.id];
            if (((!oldNode || (OrgChart.isNEU(oldNode.x) && OrgChart.isNEU(oldNode.y))) && actionParams)){
                var clickedNode = nodes[actionParams.id];
                if (clickedNode){
                    var pnode = clickedNode;
                    while(pnode && pnode.id == node.id){
                        pnode = pnode.parent;
                    }
                    if (pnode){
                        a = {
                            x: clickedNode.x,
                            y: clickedNode.y,
                        };
                    }
                }
            }
            else if (oldNode){
                a = {
                    x: oldNode.x,
                    y: oldNode.y,
                };
            }
        }

        else if (action !== OrgChart.action.exporting && action !== OrgChart.action.init) {//animation from lazy loading
            if (oldVisibleNodeIds.indexOf(node.id) == -1) {
                animations[0].push(node.id);
                animations[1].push({ opacity: 0 });
                animations[2].push({ opacity: 1 });
            }
        }

        if (a != null && a.x != null && a.y != null) { //#106
            if (a.x != node.x || a.y != node.y) {
                animations[0].push(node.id);
                animations[1].push({ transform: [1, 0, 0, 1, a.x, a.y] });
                animations[2].push({ transform: [1, 0, 0, 1, node.x, node.y] });
            }
        }
    }


    for (var i = 0; i < node.stChildren.length; i++) {
        OrgChart.manager._iterate2(node.stChildren[i], nodes, config, viewBox, action, actionParams, visibleNodeIds, oldNodes, oldVisibleNodeIds, animations);
    }

    for (var i = 0; i < node.children.length; i++) {
        OrgChart.manager._iterate2(node.children[i], nodes, config, viewBox, action, actionParams, visibleNodeIds, oldNodes, oldVisibleNodeIds, animations);
    }
};


OrgChart.manager._addExpandedNodeIdsIterate = function (node, nodes, expandedNodeIds) {
    for (var i = 0; i < node.childrenIds.length; i++) {
        expandedNodeIds.push(node.childrenIds[i]);
        OrgChart.manager._addExpandedNodeIdsIterate(nodes[node.childrenIds[i]], nodes, expandedNodeIds);
    }
};



OrgChart.manager._setMinMaxXYAdjustifyIterate = function(node, root, border, sl, bordersByRootIdAndLevel, adjust, orientation){
    //adding parent node reqyires changing y as well in top oriantation
    //if it is not working add new action with if clouse and uncomment switch
    node.x += adjust.x;
    node.y += adjust.y;
    // switch (orientation) {
    //     case OrgChart.orientation.top:
    //     case OrgChart.orientation.top_left:
    //     case OrgChart.orientation.bottom:
    //     case OrgChart.orientation.bottom_left:
    //         node.x += adjust.x;
    //         break;
    //     case OrgChart.orientation.right:
    //     case OrgChart.orientation.right_top:
    //     case OrgChart.orientation.left:
    //     case OrgChart.orientation.left_top:
    //         node.y += adjust.y;
    //         break;
    // }


    OrgChart._setMinMaxXY(node, border);

    for (var i = 0; i < node.stChildren.length; i++) {
        OrgChart.manager._setMinMaxXYAdjustifyIterate(node.stChildren[i], node.stChildren[i], border, 0, bordersByRootIdAndLevel, adjust, orientation);
    }

    if (node.isPartner){
        node.sl = sl - 1;
    }
    else{
        node.sl = sl;
    }

    if (bordersByRootIdAndLevel[root.id] == undefined){
        bordersByRootIdAndLevel[root.id] = {};
    }

    if (bordersByRootIdAndLevel[root.id][node.sl] == undefined){
        bordersByRootIdAndLevel[root.id][node.sl] = {
            minX: null,
            minY: null,
            maxX: null,
            maxY: null
        };
    }
    if (!node.layout){
        OrgChart._setMinMaxXY(node, bordersByRootIdAndLevel[root.id][node.sl]);
    }



    sl++;

    for (var i = 0; i < node.children.length; i++) {
        OrgChart.manager._setMinMaxXYAdjustifyIterate(node.children[i], root, border, sl, bordersByRootIdAndLevel, adjust, orientation);
    }
}



OrgChart.manager._doNotChangePositionOfClickedNodeIfAny = function (roots, nodes, action, actionParams, oldNodes, orientation) {
    if (action != OrgChart.action.expand && action != OrgChart.action.collapse && action != OrgChart.action.minimize && action != OrgChart.action.maximize && action != OrgChart.action.centerNode && action != OrgChart.action.update && action != OrgChart.action.insert) {
        return {
            x: 0,
            y: 0
        };
    }

    if (action == OrgChart.action.update && (!actionParams || actionParams.id == undefined)) {
        if (!roots || !roots.length) {
            return {
                x: 0,
                y: 0
            };
        }
        actionParams = { id: roots[0].id };
    }

    if (actionParams.id == null) {//expand all
        return {
            x: 0,
            y: 0
        };
    }
    var id = actionParams.id;

    if (action == OrgChart.action.minimize && nodes[id].parent || action == OrgChart.action.maximize && nodes[id].parent) {
        id = nodes[id].pid;
    }

    var node = nodes[id];

    var oldNode = oldNodes[id];

    if (!oldNode) {
        return {
            x: 0,
            y: 0
        };
    }

    var adjust = {
        x: (oldNode.x ? oldNode.x : 0) - node.x,
        y: (oldNode.y ? oldNode.y : 0) - node.y
    };

    return adjust;
};
if (typeof (OrgChart) == "undefined") {
    OrgChart = {};
}

OrgChart.templates = {};

//start base
OrgChart.templates.base = {
    defs: '',
    size: [250, 120],
    expandCollapseSize: 30,
    linkAdjuster: {
        fromX: 0,
        fromY: 0,
        toX: 0,
        toY: 0
    },
    ripple: {
        radius: 0,
        color: "#e6e6e6",
        rect: null
    },
    assistanseLink: '<path stroke-linejoin="round" stroke="#aeaeae" stroke-width="2px" fill="none" d="M{xa},{ya} {xb},{yb} {xc},{yc} {xd},{yd} L{xe},{ye}"/>',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display:block;" width="{w}" height="{h}" viewBox="{viewBox}">{content}</svg>',
    link: '<path stroke-linejoin="round" stroke="#aeaeae" stroke-width="1px" fill="none" d="M{xa},{ya} {xb},{yb} {xc},{yc} L{xd},{yd}"/>',
    pointer: '<g data-pointer="pointer" transform="matrix(0,0,0,0,100,100)"><radialGradient id="pointerGradient"><stop stop-color="#ffffff" offset="0" /><stop stop-color="#C1C1C1" offset="1" /></radialGradient><circle cx="16" cy="16" r="16" stroke-width="1" stroke="#acacac" fill="url(#pointerGradient)"></circle></g>',
    node: '<rect x="0" y="0" height="120" width="250" fill="none" stroke-width="1" stroke="#aeaeae" rx="7" ry="7"></rect>',
    plus: '<circle cx="15" cy="15" r="15" fill="#ffffff" stroke="#aeaeae" stroke-width="1"></circle>'
    + '<line x1="4" y1="15" x2="26" y2="15" stroke-width="1" stroke="#aeaeae"></line>'
    + '<line x1="15" y1="4" x2="15" y2="26" stroke-width="1" stroke="#aeaeae"></line>',
    minus: '<circle cx="15" cy="15" r="15" fill="#ffffff" stroke="#aeaeae" stroke-width="1"></circle>'
    + '<line x1="4" y1="15" x2="26" y2="15" stroke-width="1" stroke="#aeaeae"></line>',
    nodeMenuButton: '<g style="cursor:pointer;" transform="matrix(1,0,0,1,225,105)" ' + OrgChart.attr.control_node_menu_id + '="{id}"><rect x="-4" y="-10" fill="#000000" fill-opacity="0" width="22" height="22"></rect><circle cx="0" cy="0" r="2" fill="#ffffff"></circle><circle cx="7" cy="0" r="2" fill="#ffffff"></circle><circle cx="14" cy="0" r="2" fill="#ffffff"></circle></g>',
    menuButton: '<div style="position:absolute;right:{p}px;top:{p}px; width:30px;height:50px;cursor:pointer;" ' + OrgChart.attr.control_export_menu + '=""><hr style="background-color: #7A7A7A; height: 3px; border: none;"><hr style="background-color: #7A7A7A; height: 3px; border: none;"><hr style="background-color: #7A7A7A; height: 3px; border: none;"></div>',
    img_0: '<clipPath id="{randId}"><circle cx="60" cy="60" r="40"></circle></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="20" y="20"  width="80" height="80"></image>',
    link_field_0: '<text text-anchor="middle" fill="#aeaeae" ' + OrgChart.attr.width + '="290" x="0" y="0" style="font-size:10px;">{val}</text>',
    editFormHeaderColor: '#039BE5'
};
//end base


//start ana
OrgChart.templates.ana = {
    defs: '',
    size: [250, 120],
    linkAdjuster: {
        fromX: 0,
        fromY: 0,
        toX: 0,
        toY: 0
    },
    ripple: {
        radius: 0,
        color: "#e6e6e6",
        rect: null
    },
    expandCollapseSize: 30,
    svg: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  style="display:block;" width="{w}" height="{h}" viewBox="{viewBox}">{content}</svg>',
    link: '<path stroke-linejoin="round" stroke="#aeaeae" stroke-width="1px" fill="none" d="{rounded}" />',
    assistanseLink: '<path stroke-linejoin="round" stroke="#aeaeae" stroke-width="2px" fill="none" d="M{xa},{ya} {xb},{yb} {xc},{yc} {xd},{yd} L{xe},{ye}"/>',
    pointer: '<g data-pointer="pointer" transform="matrix(0,0,0,0,100,100)"><radialGradient id="pointerGradient"><stop stop-color="#ffffff" offset="0" /><stop stop-color="#C1C1C1" offset="1" /></radialGradient><circle cx="16" cy="16" r="16" stroke-width="1" stroke="#acacac" fill="url(#pointerGradient)"></circle></g>',
    node: '<rect x="0" y="0" height="{h}" width="{w}" fill="#039BE5" stroke-width="1" stroke="#aeaeae" rx="7" ry="7"></rect>',
    plus: '<circle cx="15" cy="15" r="15" class="boc-fill" stroke="#aeaeae" stroke-width="1"></circle>'
        + '<line x1="4" y1="15" x2="26" y2="15" stroke-width="1" stroke="#aeaeae"></line>'
        + '<line x1="15" y1="4" x2="15" y2="26" stroke-width="1" stroke="#aeaeae"></line>',

    minus: '<circle cx="15" cy="15" r="15" class="boc-fill" stroke="#aeaeae" stroke-width="1"></circle>'
        + '<line x1="4" y1="15" x2="26" y2="15" stroke-width="1" stroke="#aeaeae"></line>',
    up: '<rect x="20" y="-25" width="30" height="17" fill="#aeaeae" rx="3" ry="3"></rect><line x1="35" x2="35" y1="0" y2="-8" stroke="#aeaeae" stroke-width="1"></line>',
    nodeMenuButton: '<g style="cursor:pointer;" transform="matrix(1,0,0,1,225,105)" ' + OrgChart.attr.control_node_menu_id + '="{id}"><rect x="-4" y="-10" fill="#000000" fill-opacity="0" width="22" height="22"></rect><circle cx="0" cy="0" r="2" fill="#ffffff"></circle><circle cx="7" cy="0" r="2" fill="#ffffff"></circle><circle cx="14" cy="0" r="2" fill="#ffffff"></circle></g>',
    menuButton: OrgChart.templates.base.menuButton,
    img_0: '<clipPath id="{randId}"><circle cx="50" cy="30" r="40"></circle></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="10" y="-10"  width="80" height="80"></image>',
    link_field_0: '<text text-anchor="middle" fill="#aeaeae" ' + OrgChart.attr.width + '="290" x="0" y="0" style="font-size:10px;">{val}</text>',
    field_0: '<text ' + OrgChart.attr.width + '="230" style="font-size: 18px;" fill="#ffffff" x="125" y="95" text-anchor="middle">{val}</text>',
    field_1: '<text ' + OrgChart.attr.width + '="130" ' + OrgChart.attr.text_overflow + '="multiline" style="font-size: 14px;" fill="#ffffff" x="230" y="30" text-anchor="end">{val}</text>',
    padding: [50, 20, 35, 20],
    editFormHeaderColor: '#039BE5'
    //scaleLessThen: {
    //    "0.5": {
    //        field_0: '<text width="230" class="field_0" style="font-size: 24px;" fill="#ffffff" x="125" y="100" text-anchor="middle">{val}</text>',
    //        field_1: "",
    //        nodeMenuButton: ""
    //    },
    //    "0.3": {
    //        field_0: "",
    //        field_1: "",
    //        img_0: '<clipPath id="{randId}"><circle cx="70" cy="50" r="60"></circle></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="10" y="-10"  width="120" height="120"></image>',
    //        nodeMenuButton: ""
    //    }
    //}
};
//end ana


OrgChart.templates.split = Object.assign({}, OrgChart.templates.ana);
OrgChart.templates.split.size = [10, 10];
OrgChart.templates.split.node = '<circle cx="5" cy="5" r="5" fill="none" stroke-width="1" stroke="#aeaeae"></circle>';
OrgChart.templates.split.field_0 = '';
OrgChart.templates.split.field_1 = '';
OrgChart.templates.split.img_0 = '';

OrgChart.templates.dot = Object.assign({}, OrgChart.templates.split);


//start sub tree
OrgChart.templates.group = Object.assign({}, OrgChart.templates.ana);
OrgChart.templates.group.size = [250, 120];
OrgChart.templates.group.node = '<rect rx="50" ry="50" x="0" y="0" height="{h}" width="{w}" fill="#f2f2f2" stroke-width="0"></rect>';
OrgChart.templates.group.link = '<path stroke="#aeaeae" stroke-width="1px" fill="none" d="M{xa},{ya} C{xb},{yb} {xc},{yc} {xd},{yd}"/>';
OrgChart.templates.group.nodeMenuButton = '<g style="cursor:pointer;" transform="matrix(1,0,0,1,{ew},25)" ' + OrgChart.attr.control_node_menu_id + '="{id}"><g transform="matrix(1,0,0,1,-22,-8)"><rect x="0" y="0" fill="red" fill-opacity="0" width="18" height="22"></rect><line x1="0" y1="2" x2="9" y2="2" stroke="#aeaeae" stroke-width="1"></line><line x1="0" y1="9" x2="18" y2="9" stroke="#aeaeae" stroke-width="1"></line><line x1="0" y1="16" x2="22" y2="16" stroke="#aeaeae" stroke-width="1"></line></g></g>';
OrgChart.templates.group.field_0 = '<text ' + OrgChart.attr.width + '="230" style="font-size: 18px;" fill="#aeaeae" x="{cw}" y="30" text-anchor="middle">{val}</text>';
OrgChart.templates.group.field_1 = '';

OrgChart.templates.group.ripple = {
    radius: 50,
    color: "#aeaeae"
};

OrgChart.templates.invisibleGroup = Object.assign({}, OrgChart.templates.group);
OrgChart.templates.invisibleGroup.node = "";
OrgChart.templates.invisibleGroup.padding = [0,0,0,0];
OrgChart.templates.invisibleGroup.field_0 = '';
OrgChart.templates.invisibleGroup.nodeMenuButton = "";
//end sub tree

OrgChart.templates.mirror = {
    linkAdjuster: {},
    link: "",
    node: "",
    nodeMenuButton: "",
    size: [0, 0]
};


//start ula
OrgChart.templates.ula = Object.assign({}, OrgChart.templates.ana);
OrgChart.templates.ula.field_0 = '<text ' + OrgChart.attr.width + '="145" style="font-size: 18px;" fill="#039BE5" x="100" y="55">{val}</text>';
OrgChart.templates.ula.field_1 = '<text ' + OrgChart.attr.width + '="145" ' + OrgChart.attr.text_overflow + '="multiline" style="font-size: 14px;" fill="#afafaf" x="100" y="76">{val}</text>';
OrgChart.templates.ula.node = '<rect x="0" y="0" height="{h}" width="{w}" fill="#ffffff" stroke-width="1" stroke="#aeaeae"></rect><line x1="0" y1="0" x2="250" y2="0" stroke-width="2" stroke="#039BE5"></line>';
OrgChart.templates.ula.img_0 = '<clipPath id="{randId}"><circle cx="50" cy="60" r="40"></circle></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="10" y="20" width="80" height="80" ></image>';
OrgChart.templates.ula.menu = '<g style="cursor:pointer;" transform="matrix(1,0,0,1,225,12)" ' + OrgChart.attr.control_node_menu_id + '="{id}"><rect x="-4" y="-10" fill="#ffffff" width="22" height="22"></rect><circle cx="0" cy="0" r="2" fill="#039BE5"></circle><circle cx="7" cy="0" r="2" fill="#039BE5"></circle><circle cx="14" cy="0" r="2" fill="#039BE5"></circle></g>';
OrgChart.templates.ula.nodeMenuButton = '<g style="cursor:pointer;" transform="matrix(1,0,0,1,225,105)" ' + OrgChart.attr.control_node_menu_id + '="{id}"><rect x="-4" y="-10" fill="#000000" fill-opacity="0" width="22" height="22"></rect><circle cx="0" cy="0" r="2" fill="#AEAEAE"></circle><circle cx="7" cy="0" r="2" fill="#AEAEAE"></circle><circle cx="14" cy="0" r="2" fill="#AEAEAE"></circle></g>';
//end ula

//start olivia
OrgChart.templates.olivia = Object.assign({}, OrgChart.templates.ana);
OrgChart.templates.olivia.defs = `<style>
                                    #olivia_gradient {
                                        --color-stop-1: #ffffff;
                                        --color-stop-2: #eeeeee;
                                        --opacity-stop: 1;
                                    }
                                    .olivia-f0{
                                        font-size: 18px;
                                        fill: #757575;
                                    }
                                    .olivia-f1{
                                        font-size: 14px;
                                        fill: #757575;
                                    }
                                    .boc-dark .olivia-f0,.boc-dark .olivia-f1{
                                        fill: #aeaeae;
                                    }
                                    .boc-dark #olivia_gradient {
                                        --color-stop-1: #646464;
                                        --color-stop-2: #363636;
                                        --opacity-stop: 1;
                                    }
                                </style>
                                '<linearGradient id="olivia_gradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="var(--color-stop-1)" stop-opacity="var(--opacity-stop)"/><stop offset="100%" stop-color="var(--color-stop-2)" stop-opacity="var(--opacity-stop)" /></linearGradient>`;
OrgChart.templates.olivia.field_0 = '<text ' + OrgChart.attr.width + '="135" class="olivia-f0" x="100" y="55">{val}</text>';
OrgChart.templates.olivia.field_1 = '<text ' + OrgChart.attr.width + '="135" class="olivia-f1" x="100" y="76">{val}</text>';
OrgChart.templates.olivia.node = '<rect fill="url(#olivia_gradient)" x="0" y="0" height="{h}" width="{w}" stroke-width="1" stroke="#aeaeae" rx="7" ry="7"></rect>';
OrgChart.templates.olivia.img_0 = '<clipPath id="{randId}"><circle cx="50" cy="60" r="40"></circle></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="10" y="20" width="80" height="80" ></image>';
OrgChart.templates.olivia.nodeMenuButton = '<g style="cursor:pointer;" transform="matrix(1,0,0,1,225,105)" ' + OrgChart.attr.control_node_menu_id + '="{id}"><rect x="-4" y="-10" fill="#000000" fill-opacity="0" width="22" height="22"></rect><circle cx="0" cy="0" r="2" fill="#AEAEAE"></circle><circle cx="7" cy="0" r="2" fill="#AEAEAE"></circle><circle cx="14" cy="0" r="2" fill="#AEAEAE"></circle></g>';
//end olivia



//start belinda
OrgChart.templates.belinda = Object.assign({}, OrgChart.templates.ana);
OrgChart.templates.belinda.size = [180, 180];
OrgChart.templates.belinda.ripple = {
    radius: 90,
    color: "#e6e6e6",
    rect: null
};

OrgChart.templates.belinda.node = '<circle cx="90" cy="90" r="90" fill="#039BE5" stroke-width="1" stroke="#aeaeae"></circle>';
OrgChart.templates.belinda.img_0 = '<clipPath id="{randId}"><circle cx="90" cy="45" r="40"></circle></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="50" y="5" width="80" height="80" ></image>';
OrgChart.templates.belinda.field_0 = '<text ' + OrgChart.attr.width + '="170" style="font-size: 18px;" text-anchor="middle" fill="#ffffff"  x="90" y="105">{val}</text>';
OrgChart.templates.belinda.field_1 = '<text ' + OrgChart.attr.width + '="160" style="font-size: 14px;" text-anchor="middle" fill="#ffffff"  x="90" y="125">{val}</text>';
OrgChart.templates.belinda.link = '<path stroke="#aeaeae" stroke-width="1px" fill="none" d="M{xa},{ya} C{xb},{yb} {xc},{yc} {xd},{yd}"/>';
OrgChart.templates.belinda.nodeMenuButton = '<g style="cursor:pointer;" transform="matrix(1,0,0,1,79,5)" ' + OrgChart.attr.control_node_menu_id + '="{id}"><rect x="0" y="0" fill="#000000" fill-opacity="0" width="22" height="22"></rect>'
    + '<line stroke-width="2" stroke="#000" x1="0" y1="3" x2="22" y2="3"></line>'
    + '<line stroke-width="2" stroke="#000" x1="0" y1="9" x2="22" y2="9"></line>'
    + '<line stroke-width="2" stroke="#000" x1="0" y1="15" x2="22" y2="15"></line>'
    + '</g>';

//end belinda

//start rony
OrgChart.templates.rony = Object.assign({}, OrgChart.templates.ana);
OrgChart.templates.rony.svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="background-color:#E8E8E8;display:block;" width="{w}" height="{h}" viewBox="{viewBox}">{content}</svg>';
OrgChart.templates.rony.defs = '<filter id="{randId}" x="0" y="0" width="200%" height="200%"><feOffset result="offOut" in="SourceAlpha" dx="5" dy="5"></feOffset><feGaussianBlur result="blurOut" in="offOut" stdDeviation="5"></feGaussianBlur><feBlend in="SourceGraphic" in2="blurOut" mode="normal"></feBlend></filter>';
OrgChart.templates.rony.size = [180, 250];
OrgChart.templates.rony.ripple = {
    color: "#F57C00",
    radius: 5,
    rect: null
};
OrgChart.templates.rony.img_0 = '<clipPath id="{randId}"><circle cx="90" cy="160" r="60"></circle></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="30" y="100"  width="120" height="120"></image>';
OrgChart.templates.rony.node = '<rect filter="url(#{randId})" x="0" y="0" height="250" width="180" fill="#ffffff" stroke-width="0" rx="7" ry="7"></rect>';
OrgChart.templates.rony.field_0 = '<text ' + OrgChart.attr.width + '="165" style="font-size: 18px;" fill="#039BE5" x="90" y="40" text-anchor="middle">{val}</text>';
OrgChart.templates.rony.field_1 = '<text ' + OrgChart.attr.width + '="165" style="font-size: 14px;" fill="#F57C00" x="90" y="60" text-anchor="middle">{val}</text>';
OrgChart.templates.rony.field_2 = '<text ' + OrgChart.attr.width + '="165" style="font-size: 14px;" fill="#FFCA28" x="90" y="80" text-anchor="middle">{val}</text>';
OrgChart.templates.rony.link = '<path stroke="#039BE5" stroke-width="1px" fill="none" d="M{xa},{ya} {xb},{yb} {xc},{yc} L{xd},{yd}"/>';
OrgChart.templates.rony.plus = '<circle cx="15" cy="15" r="15" fill="#ffffff" stroke="#039BE5" stroke-width="1"></circle>'
    + '<line x1="4" y1="15" x2="26" y2="15" stroke-width="1" stroke="#039BE5"></line>'
    + '<line x1="15" y1="4" x2="15" y2="26" stroke-width="1" stroke="#039BE5"></line>';

OrgChart.templates.rony.minus = '<circle cx="15" cy="15" r="15" fill="#ffffff" stroke="#039BE5" stroke-width="1"></circle>'
    + '<line x1="4" y1="15" x2="26" y2="15" stroke-width="1" stroke="#039BE5"></line>';
OrgChart.templates.rony.nodeMenuButton = '<g style="cursor:pointer;" transform="matrix(1,0,0,1,155,235)" ' + OrgChart.attr.control_node_menu_id + '="{id}"><rect x="-4" y="-10" fill="#000000" fill-opacity="0" width="22" height="22"></rect><circle cx="0" cy="0" r="2" fill="#F57C00"></circle><circle cx="7" cy="0" r="2" fill="#F57C00"></circle><circle cx="14" cy="0" r="2" fill="#F57C00"></circle></g>';
//end rony

//start mery
OrgChart.templates.mery = Object.assign({}, OrgChart.templates.ana);
OrgChart.templates.mery.ripple = {
    color: "#e6e6e6",
    radius: 50,
    rect: null
};
OrgChart.templates.mery.node = '<rect x="0" y="0" height="120" width="250" fill="#ffffff" stroke-width="1" stroke="#686868" rx="50" ry="50"></rect><rect x="0" y="45" height="30" width="250" fill="#039BE5" stroke-width="1"></rect>';
OrgChart.templates.mery.link = '<path stroke="#aeaeae" stroke-width="1px" fill="none" d="M{xa},{ya} C{xb},{yb} {xc},{yc} {xd},{yd}" />';
OrgChart.templates.mery.img_0 = '<clipPath id="{randId}"><circle cx="125" cy="60" r="24"></circle></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="95" y="33"  width="60" height="60"></image>';
OrgChart.templates.mery.field_0 = '<text ' + OrgChart.attr.width + '="220" style="font-size: 18px;" fill="#039BE5" x="125" y="30" text-anchor="middle">{val}</text>';
OrgChart.templates.mery.field_1 = '<text ' + OrgChart.attr.width + '="220" style="font-size: 14px;" fill="#039BE5" x="125" y="100" text-anchor="middle">{val}</text>';
OrgChart.templates.mery.nodeMenuButton = '<g style="cursor:pointer;" transform="matrix(1,0,0,1,225,60)" ' + OrgChart.attr.control_node_menu_id + '="{id}"><rect x="-4" y="-10" fill="#000000" fill-opacity="0" width="22" height="22"></rect><circle cx="0" cy="0" r="2" fill="#ffffff"></circle><circle cx="7" cy="0" r="2" fill="#ffffff"></circle><circle cx="14" cy="0" r="2" fill="#ffffff"></circle></g>';
//end mery

//start polina
OrgChart.templates.polina = Object.assign({}, OrgChart.templates.ana);
OrgChart.templates.polina.size = [300, 80];
OrgChart.templates.polina.ripple = {
    color: "#e6e6e6",
    radius: 40,
    rect: null
};
OrgChart.templates.polina.node = '<rect x="0" y="0" height="80" width="300" fill="#039BE5" stroke-width="1" stroke="#686868" rx="40" ry="40"></rect>';
OrgChart.templates.polina.img_0 = '<clipPath id="{randId}"><circle  cx="40" cy="40" r="35"></circle></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="0" y="0"  width="80" height="80"></image>';
OrgChart.templates.polina.field_0 = '<text ' + OrgChart.attr.width + '="210" style="font-size: 18px;" fill="#ffffff" x="80" y="30" text-anchor="start">{val}</text>';
OrgChart.templates.polina.field_1 = '<text ' + OrgChart.attr.width + '="210" style="font-size: 14px;" fill="#ffffff" x="80" y="55" text-anchor="start">{val}</text>';
OrgChart.templates.polina.link = '<path stroke="#686868" stroke-width="1px" fill="none" d="M{xa},{ya} C{xb},{yb} {xc},{yc} {xd},{yd}" />';
OrgChart.templates.polina.nodeMenuButton = '<g style="cursor:pointer;" transform="matrix(1,0,0,1,285,33)" ' + OrgChart.attr.control_node_menu_id + '="{id}"><rect x="-4" y="-10" fill="#000000" fill-opacity="0" width="22" height="22"></rect><circle cx="0" cy="0" r="2" fill="#ffffff"></circle><circle cx="0" cy="7" r="2" fill="#ffffff"></circle><circle cx="0" cy="14" r="2" fill="#ffffff"></circle></g>';
//end polina

//start mila
OrgChart.templates.mila = Object.assign({}, OrgChart.templates.ana);
OrgChart.templates.mila.node = '<rect x="0" y="0" height="120" width="250" fill="#039BE5" stroke-width="1" stroke="#aeaeae"></rect><rect x="-5" y="70" height="30" width="260" fill="#ffffff" stroke-width="1" stroke="#039BE5"></rect><line x1="-5" x2="0" y1="100" y2="105" stroke-width="1" stroke="#039BE5"/><line x1="255" x2="250" y1="100" y2="105" stroke-width="1" stroke="#039BE5"/>';
OrgChart.templates.mila.img_0 = '<image preserveAspectRatio="xMidYMid slice" xlink:href="{val}" x="20" y="5"  width="64" height="64"></image>';
OrgChart.templates.mila.field_0 = '<text ' + OrgChart.attr.width + '="240" style="font-size: 18px;" fill="#039BE5" x="125" y="92" text-anchor="middle">{val}</text>';
OrgChart.templates.mila.nodeMenuButton = '<g style="cursor:pointer;" transform="matrix(1,0,0,1,225,110)" ' + OrgChart.attr.control_node_menu_id + '="{id}"><rect x="-4" y="-10" fill="#000000" fill-opacity="0" width="22" height="22"></rect><circle cx="0" cy="0" r="2" fill="#ffffff"></circle><circle cx="7" cy="0" r="2" fill="#ffffff"></circle><circle cx="14" cy="0" r="2" fill="#ffffff"></circle></g>';
//end mila

//start diva
OrgChart.templates.diva = Object.assign({}, OrgChart.templates.ana);
OrgChart.templates.diva.size = [200, 170];
OrgChart.templates.diva.node = '<rect x="0" y="80" height="90" width="200" fill="#039BE5"></rect><circle cx="100" cy="50" fill="#ffffff" r="50" stroke="#039BE5" stroke-width="2"></circle>';
OrgChart.templates.diva.img_0 = '<clipPath id="{randId}"><circle cx="100" cy="50" r="45"></circle></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="50" y="0"  width="100" height="100"></image>';
OrgChart.templates.diva.field_0 = '<text ' + OrgChart.attr.width + '="185" style="font-size: 18px;" fill="#ffffff" x="100" y="125" text-anchor="middle">{val}</text>';
OrgChart.templates.diva.field_1 = '<text ' + OrgChart.attr.width + '="185" style="font-size: 14px;" fill="#ffffff" x="100" y="145" text-anchor="middle">{val}</text>';
OrgChart.templates.diva.pointer = '<g data-pointer="pointer" transform="matrix(0,0,0,0,100,100)"><radialGradient id="pointerGradient"><stop stop-color="#ffffff" offset="0" /><stop stop-color="#039BE5" offset="1" /></radialGradient><circle cx="16" cy="16" r="16" stroke-width="1" stroke="#acacac" fill="url(#pointerGradient)"></circle></g>';
OrgChart.templates.diva.nodeMenuButton = '<g style="cursor:pointer;" transform="matrix(1,0,0,1,175,155)" ' + OrgChart.attr.control_node_menu_id + '="{id}"><rect x="-4" y="-10" fill="#000000" fill-opacity="0" width="22" height="22"></rect><circle cx="0" cy="0" r="2" fill="#ffffff"></circle><circle cx="7" cy="0" r="2" fill="#ffffff"></circle><circle cx="14" cy="0" r="2" fill="#ffffff"></circle></g>';
//end diva

//start luba
OrgChart.templates.luba = Object.assign({}, OrgChart.templates.ana);
OrgChart.templates.luba.svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display:block;background-color: #2E2E2E;" width="{w}" height="{h}" viewBox="{viewBox}">{content}</svg>';
OrgChart.templates.luba.defs = '<linearGradient id="{randId}" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#646464;stop-opacity:1" /><stop offset="100%" style="stop-color:#363636;stop-opacity:1" /></linearGradient>';
OrgChart.templates.luba.node = '<rect fill="url(#{randId})" x="0" y="0" height="120" width="250" stroke-width="1" stroke="#aeaeae" rx="7" ry="7"></rect>';
OrgChart.templates.luba.img_0 = '<clipPath id="{randId}"><circle cx="50" cy="25" r="40"></circle></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="10" y="-15"  width="80" height="80"></image>';
OrgChart.templates.luba.nodeMenuButton = '<g style="cursor:pointer;" transform="matrix(1,0,0,1,225,105)" ' + OrgChart.attr.control_node_menu_id + '="{id}"><rect x="-4" y="-10" fill="#000000" fill-opacity="0" width="22" height="22"></rect><circle cx="0" cy="0" r="2" fill="#aeaeae"></circle><circle cx="7" cy="0" r="2" fill="#aeaeae"></circle><circle cx="14" cy="0" r="2" fill="#aeaeae"></circle></g>';
OrgChart.templates.luba.field_0 = '<text ' + OrgChart.attr.width + '="235" style="font-size: 18px;" fill="#aeaeae" x="125" y="90" text-anchor="middle">{val}</text>';
OrgChart.templates.luba.field_1 = '<text ' + OrgChart.attr.width + '="140" style="font-size: 14px;" fill="#aeaeae" x="240" y="30" text-anchor="end">{val}</text>';
OrgChart.templates.luba.plus = '<rect x="0" y="0" width="36" height="36" rx="12" ry="12" fill="#2E2E2E" stroke="#aeaeae" stroke-width="1"></rect>'
    + '<line x1="4" y1="18" x2="32" y2="18" stroke-width="1" stroke="#aeaeae"></line>'
    + '<line x1="18" y1="4" x2="18" y2="32" stroke-width="1" stroke="#aeaeae"></line>';

OrgChart.templates.luba.minus = '<rect x="0" y="0" width="36" height="36" rx="12" ry="12" fill="#2E2E2E" stroke="#aeaeae" stroke-width="1"></rect>'
    + '<line x1="4" y1="18" x2="32" y2="18" stroke-width="1" stroke="#aeaeae"></line>';

OrgChart.templates.luba.expandCollapseSize = 36;
//end luba





//start isla

OrgChart.templates.isla = Object.assign({}, OrgChart.templates.ana);
OrgChart.templates.isla.defs = '<filter x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox" id="isla-shadow"><feOffset dx="0" dy="4" in="SourceAlpha" result="shadowOffsetOuter1" /><feGaussianBlur stdDeviation="10" in="shadowOffsetOuter1" result="shadowBlurOuter1" /><feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.2 0" in="shadowBlurOuter1" type="matrix" result="shadowMatrixOuter1" /><feMerge><feMergeNode in="shadowMatrixOuter1" /><feMergeNode in="SourceGraphic" /></feMerge></filter>';
OrgChart.templates.isla.size = [180, 120];
OrgChart.templates.isla.node = '<rect filter="url(#isla-shadow)" x="0" y="20" rx="7" ry="7" height="100" width="180" fill="#FFF" stroke-width="1" stroke="#039BE5" ></rect><rect x="25" y="75" rx="10" ry="10" height="20" width="130" fill="#039BE5" stroke-width="3" stroke="#039BE5"></rect><rect fill="#ffffff" stroke="#039BE5" stroke-width="1" x="70" y="0" rx="13" ry="13" width="40" height="40"></rect><circle stroke="#FFCA28" stroke-width="3" fill="none" cx="90" cy="12" r="8"></circle><path d="M75,34 C75,17 105,17 105,34" stroke="#FFCA28" stroke-width="3" fill="none"></path>';
OrgChart.templates.isla.field_0 = '<text ' + OrgChart.attr.width + '="120" style="font-size: 12px;" fill="#fff" x="90" y="90" text-anchor="middle">{val}</text>';
OrgChart.templates.isla.field_1 = '<text ' + OrgChart.attr.width + '="160" style="font-size: 13px;" fill="#039BE5" x="90" y="64" text-anchor="middle">{val}</text>';
OrgChart.templates.isla.img_0 = '<clipPath id="{randId}"><rect filter="url(#isla-shadow)" fill="#ffffff" stroke="#039BE5" stroke-width="1" x="70" y="0" rx="13" ry="13" width="40" height="40"></rect></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="70" y="0"  width="40" height="40"></image>';
OrgChart.templates.isla.minus = '<circle cx="15" cy="15" r="15" fill="#F57C00" stroke="#F57C00" stroke-width="1"></circle><line x1="8" y1="15" x2="22" y2="15" stroke-width="1" stroke="#ffffff"></line>';
OrgChart.templates.isla.plus = '<circle cx="15" cy="15" r="15" fill="#ffffff" stroke="#039BE5" stroke-width="1"></circle><line x1="4" y1="15" x2="26" y2="15" stroke-width="1" stroke="#039BE5"></line><line x1="15" y1="4" x2="15" y2="26" stroke-width="1" stroke="#039BE5"></line>';
OrgChart.templates.isla.nodeMenuButton = '<g style="cursor:pointer;" transform="matrix(1,0,0,1,83,45)" ' + OrgChart.attr.control_node_menu_id + '="{id}"><rect x="-4" y="-10" fill="#000000" fill-opacity="0" width="22" height="22"></rect><circle cx="0" cy="0" r="2" fill="#F57C00"></circle><circle cx="7" cy="0" r="2" fill="#F57C00"></circle><circle cx="14" cy="0" r="2" fill="#F57C00"></circle></g>';

OrgChart.templates.isla.ripple = {
    radius: 0,
    color: "#F57C00",
    rect: { x: 0, y: 20, width: 180, height: 100 }
};
//end isla


//start deborah
OrgChart.templates.deborah = Object.assign({}, OrgChart.templates.polina);

OrgChart.templates.deborah.size = [150, 150];
OrgChart.templates.deborah.node =
    '<rect x="0" y="0" height="150" width="150" fill="#039BE5" stroke-width="1" stroke="#686868" rx="15" ry="15"></rect>';

OrgChart.templates.deborah.img_0 =
    '<clipPath id="{randId}"><rect fill="#ffffff" stroke="#039BE5" stroke-width="1" x="5" y="5" rx="15" ry="15" width="140" height="140"></rect></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="5" y="5"  width="140" height="140"></image><rect x="3" y="5" height="30" width="144" fill="#039BE5" opacity="0.5" rx="3" ry="3"></rect><rect x="3" y="115" height="30" width="144" fill="#039BE5" opacity="0.5" rx="3" ry="3"></rect>';

OrgChart.templates.deborah.field_0 = '<text ' + OrgChart.attr.width + '="125" ' + OrgChart.attr.text_overflow + '="ellipsis" style="font-size: 18px;" fill="#ffffff" x="15" y="25" text-anchor="start">{val}</text>';
OrgChart.templates.deborah.field_1 = '<text ' + OrgChart.attr.width + '="105" ' + OrgChart.attr.text_overflow + '="ellipsis" style="font-size: 11px;" fill="#ffffff" x="15" y="135" text-anchor="start">{val}</text>';

OrgChart.templates.deborah.nodeMenuButton =
    '<g style="cursor:pointer;" transform="matrix(1,0,0,1,125,130)" ' + OrgChart.attr.control_node_menu_id + '="{id}"><rect x="-4" y="-10" fill="#000000" fill-opacity="0" width="22" height="22"></rect><circle cx="0" cy="0" r="2" fill="#ffffff"></circle><circle cx="7" cy="0" r="2" fill="#ffffff"></circle><circle cx="14" cy="0" r="2" fill="#ffffff"></circle></g>';
//end deborah



//start subLevel
OrgChart.templates.subLevel = Object.assign({}, OrgChart.templates.base);
OrgChart.templates.subLevel.size = [0, 0];
OrgChart.templates.subLevel.node = '';
OrgChart.templates.subLevel.plus = '';
OrgChart.templates.subLevel.minus = '';
OrgChart.templates.subLevel.nodeMenuButton = '';
//end subLevel


OrgChart.ui = {
    _defsIds: {},
    defs: function (fromrender) {
        var defs = "";
        for (var templateNeme in OrgChart.templates) {
            var template = OrgChart.templates[templateNeme];
            if (template.defs) {
                OrgChart.ui._defsIds[templateNeme] = OrgChart.randomId();
                defs += template.defs.replaceAll("{randId}", OrgChart.ui._defsIds[templateNeme]);
            }
        }

        return '<defs>' + defs + fromrender +'</defs>';
    },

    lonely: function (config) {
        if (!config.nodes || !config.nodes.length) {
            return OrgChart.IT_IS_LONELY_HERE
                .replace("{link}", OrgChart.RES.IT_IS_LONELY_HERE_LINK);
        }
        else {
            return "";
        }
    },

    pointer: function (config, action, scale) {
        if (action === OrgChart.action.exporting) {
            return "";
        }
        var t = OrgChart.t(config.template, false, scale);
        return t.pointer;
    },

    node: function (node, data, animations, config, x, y, nodeBinding, action, scale, sender) {
        var t = OrgChart.t(node.templateName, node.min, scale);

        var nodeHtml = t.node
            .replaceAll("{w}", node.w)
            .replaceAll("{h}", node.h);



        if (t.defs) {
            nodeHtml = nodeHtml.replaceAll("{randId}", OrgChart.ui._defsIds[node.templateName]);
        }

        if (nodeBinding == undefined) {
            nodeBinding = config.nodeBinding;
        }

        var args = {
            node: node,
            data: data
        };

        for (var f in nodeBinding) {
            var name = nodeBinding[f];
            //if (data) {
                var replacement;

                if (data){
                    replacement = data[name];
                }

                //start depreciate at 19 Apr 2022
                if (typeof (name) == "function") {
                    replacement = name(sender, node, data);
                }
                //end depreciate at 19 Apr 2022

                args.value = replacement;
                args.element = t[f];
                args.name = name;

                var result = OrgChart.events.publish('field', [sender, args]);
                if (result !== false) {
                    if (args.value != undefined && args.value != null && args.element != undefined) {
                        var fieldHtml;
                        if (!OrgChart._lblIsImg(config, f) && typeof (args.value) == "string") {
                            args.value = OrgChart.wrapText(args.value, args.element);
                            fieldHtml = args.element.replace("{val}", function() { return args.value});
                        }
                        else {
                            fieldHtml = args.element.replace("{val}", function() { return args.value});
                        }
                        fieldHtml = fieldHtml
                            .replaceAll("{ew}", node.w - (node.padding ? node.padding[1] : 0))
                            .replaceAll("{cw}", node.w / 2)
                            .replaceAll("{randId}", OrgChart.randomId())
                            .replaceAll("{randId2}", OrgChart.randomId());
                        nodeHtml += fieldHtml;
                    }
                //}
            }
        }


        var pos = OrgChart._getPosition(animations, node, x, y);

        var selectors = "node";
        if (Array.isArray(node.tags) && node.tags.length) {
            selectors += " " + node.tags.join(" ");
        }
        if (node.layout) {
            selectors += " tree-layout";
        }

        var lcn = "";
        if (node.lcn){
            lcn = 'lcn="' + node.lcn + '"'
        }

        var openTag = OrgChart.nodeOpenTag
            .replace("{lcn}", lcn)
            .replace("{id}", node.id)
            .replace("{class}", selectors)
            .replace("{sl}", node.sl)
            .replace("{level}", node.level)
            .replace("{x}", pos.x)
            .replace("{y}", pos.y);



        var opacity = OrgChart._getOpacity(animations, node);
        openTag = openTag.replace("{opacity}", opacity);

        nodeHtml += OrgChart.ui.nodeBtns(config, node, action, t, sender);

        nodeHtml = openTag + nodeHtml +  OrgChart.grCloseTag;

        return nodeHtml;
    },

    nodeBtns: function (config, node, action, t, sender) {
        var btnsHtml = '';
        if ((config.nodeMenu != null) && !node.isSplit && (action !== OrgChart.action.exporting)) {
            btnsHtml += t.nodeMenuButton
                .replace("{id}", node.id)
                .replace("{cw}", node.w / 2)
                .replace("{ew}", node.w - (node.padding ? node.padding[1] : 0));
        }


        if ((config.nodeCircleMenu != null) && !node.isSplit && (action !== OrgChart.action.exporting)) {
            if (!OrgChart.isNEU(t.nodeCircleMenuButton)){
                btnsHtml += '<g style="cursor:pointer;" transform="matrix(1,0,0,1,' + t.nodeCircleMenuButton.x + ',' + t.nodeCircleMenuButton.y + ')" ' + OrgChart.attr.control_node_circle_menu_id + '="' + node.id + '"><circle cx="0" cy="0" fill="' + t.nodeCircleMenuButton.color + '" r="' + t.nodeCircleMenuButton.radius + '" stroke-width="1" stroke="' + t.nodeCircleMenuButton.stroke + '"></circle><line x1="-' + t.nodeCircleMenuButton.radius / 2 + '" y1="-6" x2="' + t.nodeCircleMenuButton.radius / 2 + '" y2="-6" stroke-width="2" stroke="' + t.nodeCircleMenuButton.stroke + '"></line><line x1="-' + t.nodeCircleMenuButton.radius / 2 + '" y1="0" x2="' + t.nodeCircleMenuButton.radius / 2 + '" y2="0" stroke-width="2" stroke="' + t.nodeCircleMenuButton.stroke + '"></line><line x1="-' + t.nodeCircleMenuButton.radius / 2 + '" y1="6" x2="' + t.nodeCircleMenuButton.radius / 2 + '" y2="6" stroke-width="2" stroke="' + t.nodeCircleMenuButton.stroke + '"></line></g>';
            }
        }
        return btnsHtml;
    },

    expandCollapseBtn: function (chart, node, layoutConfigs, action, scale) {
        var html = '';

        if (action !== OrgChart.action.exporting && !node.isSplit) {
            var configName = node.lcn ? node.lcn : "base";
            var layoutConfig = layoutConfigs[configName];
            var x = 0;
            var y = 0;
            var t = OrgChart.t(node.templateName, node.min, scale);

            if (node.childrenIds.length > 0){
                if (node.hasPartners){
                    var flag = false;
                    for(var i = 0; i < node.children.length; i++){
                        if (!node.children[i].parentPartner && !node.children[i].isPartner){
                            flag = true;
                        }
                    }

                    if (!flag){
                        return '';
                    }
                }

                switch (layoutConfig.orientation) {
                    case OrgChart.orientation.top:
                    case OrgChart.orientation.top_left:
                        x = node.x + (node.w / 2);
                        y = node.y + node.h;
                        break;

                    case OrgChart.orientation.bottom:
                    case OrgChart.orientation.bottom_left:
                        x = node.x + (node.w / 2);
                        y = node.y;
                        break;

                    case OrgChart.orientation.right:
                    case OrgChart.orientation.right_top:
                        x = node.x;
                        y = node.y + (node.h / 2);
                        break;

                    case OrgChart.orientation.left:
                    case OrgChart.orientation.left_top:
                        x = node.x + node.w;
                        y = node.y + (node.h / 2);
                        break;
                }

                x = x - t.expandCollapseSize / 2;
                y = y - t.expandCollapseSize / 2;

                var collapsedChildrenIds = chart.getCollapsedIds(node);

                if (collapsedChildrenIds.length) {
                    html += OrgChart.expcollOpenTag
                        .replace("{id}", node.id)
                        .replace("{x}", x)
                        .replace("{y}", y);

                    html += t.plus;
                    html += OrgChart.grCloseTag;
                }
                else {
                    html += OrgChart.expcollOpenTag
                        .replace("{id}", node.id)
                        .replace("{x}", x)
                        .replace("{y}", y);

                    html += t.minus;
                    html += OrgChart.grCloseTag;
                }




                if (html.indexOf("{collapsed-children-count}")){
                    var collapsedChildrenCount = OrgChart.collapsedChildrenCount(chart, node);
                    html = html.replace("{collapsed-children-count}", collapsedChildrenCount);
                }
            }

            if (chart._nodeHasHiddenParent(node)){
                html += OrgChart.upOpenTag
                    .replace("{id}", node.id)
                    .replace("{x}", node.x)
                    .replace("{y}", node.y);

                html += t.up;
                html += OrgChart.grCloseTag;
            }
        }

        var args = {
            html: html,
            node: node
        };


        OrgChart.events.publish('renderbuttons', [chart, args]);


        return args.html;
    },


    link: function (node, obj, scale, bordersByRootIdAndLevel, nodes, action) {
        var configName = node.lcn ? node.lcn : "base";
        var layoutConfig = obj._layoutConfigs[configName];

        var t = OrgChart.t(node.templateName, node.min, scale);

        var linkArray = [];
        var rotate = 0;

        var separation = layoutConfig.levelSeparation / 2;
        if (node.layout == OrgChart.mixed || node.layout == OrgChart.tree) {
            separation = layoutConfig.mixedHierarchyNodesSeparation / 2;
        }

        var pSeparation = 0;

        var rootId = OrgChart.getRootOf(node).id;

        var nodeb = bordersByRootIdAndLevel[rootId][node.sl];

        var parentPartnersHelper = undefined;
        if (node.hasPartners){
            parentPartnersHelper = {
                ids: [],
                indexes: {},
                ppnodes: {},
                lastLeft: null,
                firstRight: null,
                maxSidePartnersWithChildren: 0,
                rightIds: [],
                leftIds: [],
                partnerChildrenSplitSeparation: obj.config.partnerChildrenSplitSeparation
            };

            for (var i = 0; i < node.children.length; i++) {
                var cnode = node.children[i];
                if (cnode.parentPartner){
                    parentPartnersHelper.ppnodes[cnode.id] = cnode.parentPartner;
                    parentPartnersHelper.ids.push(cnode.id);
                    if (cnode.parentPartner.isPartner == 1){
                        if (parentPartnersHelper.rightIds.indexOf(cnode.parentPartner.id) == -1){
                            parentPartnersHelper.rightIds.push(cnode.parentPartner.id);
                        }

                        parentPartnersHelper.indexes[cnode.id] = parentPartnersHelper.rightIds.indexOf(cnode.parentPartner.id);
                        if (!parentPartnersHelper.firstRight){
                            parentPartnersHelper.firstRight = cnode;
                        }

                    }
                    else if (cnode.parentPartner.isPartner == 2){
                        if (parentPartnersHelper.leftIds.indexOf(cnode.parentPartner.id) == -1){
                            parentPartnersHelper.leftIds.push(cnode.parentPartner.id);
                        }

                        parentPartnersHelper.indexes[cnode.id] = parentPartnersHelper.leftIds.indexOf(cnode.parentPartner.id);
                        parentPartnersHelper.lastLeft = cnode;

                    }
                }
                else if (!cnode.isPartner){
                    parentPartnersHelper.lastLeft = cnode;
                    if (!parentPartnersHelper.firstRight){
                        parentPartnersHelper.firstRight = cnode;
                    }
                }
            }

            parentPartnersHelper.maxSidePartnersWithChildren = Math.max(parentPartnersHelper.leftIds.length, parentPartnersHelper.rightIds.length);



            if (parentPartnersHelper.maxSidePartnersWithChildren == 0){
                pSeparation = (obj.config.minPartnerSeparation / 2 );
            }
            else{
                pSeparation = (obj.config.minPartnerSeparation / 2 ) + parentPartnersHelper.partnerChildrenSplitSeparation * parentPartnersHelper.maxSidePartnersWithChildren + parentPartnersHelper.partnerChildrenSplitSeparation / 2;
            }

        }

        for (var i = 0; i < node.children.length; i++) {

            var cnode = node.children[i];

            var cnodeb = bordersByRootIdAndLevel[rootId][cnode.sl];

            var p = { xa: 0, ya: 0, xb: 0, yb: 0, xc: 0, yc: 0, xd: 0, yd: 0, x: 0, y: 0, rotate: 0 };

            t = OrgChart.t(cnode.templateName, cnode.min, scale);

            var linkTemplate = t.link;

            if (parentPartnersHelper && parentPartnersHelper.ids.indexOf(cnode.id) != -1){
                switch (layoutConfig.orientation) {
                    case OrgChart.orientation.top:
                    case OrgChart.orientation.top_left:
                        p = OrgChart.ui._linkPpTop(parentPartnersHelper, node, cnode, cnodeb, nodeb,  t);
                        break;

                    case OrgChart.orientation.bottom:
                    case OrgChart.orientation.bottom_left:
                        p = OrgChart.ui._linkPpBottom(parentPartnersHelper, node, cnode, cnodeb, nodeb,  t);
                        break;

                    case OrgChart.orientation.right:
                    case OrgChart.orientation.right_top:
                        p = OrgChart.ui._linkPpRight(parentPartnersHelper, node, cnode, cnodeb, nodeb, t);
                        break;

                    case OrgChart.orientation.left:
                    case OrgChart.orientation.left_top:
                        p = OrgChart.ui._linkPpLeft(parentPartnersHelper, node, cnode, cnodeb, nodeb,  t);
                        break;
                }
            }
            else{
                if ((cnode.isAssistant || cnode.layout == 2) && cnode.rightNeighbor && cnode.rightNeighbor.isSplit) {
                    switch (layoutConfig.orientation) {
                        case OrgChart.orientation.top:
                        case OrgChart.orientation.top_left:
                            p = OrgChart.ui._linkRightToLeft(cnode.rightNeighbor, cnode, t, separation);
                            break;

                        case OrgChart.orientation.bottom:
                        case OrgChart.orientation.bottom_left:
                            p = OrgChart.ui._linkRightToLeft(cnode.rightNeighbor, cnode, t, separation);
                            break;

                        case OrgChart.orientation.right:
                        case OrgChart.orientation.right_top:
                            p = OrgChart.ui._linkBottomToTop(cnode.rightNeighbor, cnode, t, separation);
                            break;

                        case OrgChart.orientation.left:
                        case OrgChart.orientation.left_top:
                            p = OrgChart.ui._linkBottomToTop(cnode.rightNeighbor, cnode, t, separation);
                            break;
                    }
                }
                else if ((cnode.isAssistant || cnode.layout == 2) && cnode.leftNeighbor && cnode.leftNeighbor.isSplit) {
                    switch (layoutConfig.orientation) {
                        case OrgChart.orientation.top:
                        case OrgChart.orientation.top_left:
                            p = OrgChart.ui._linkLeftToRight(cnode.leftNeighbor, cnode, t, separation);
                            break;

                        case OrgChart.orientation.bottom:
                        case OrgChart.orientation.bottom_left:
                            p = OrgChart.ui._linkLeftToRight(cnode.leftNeighbor, cnode, t, separation);
                            break;

                        case OrgChart.orientation.right:
                        case OrgChart.orientation.right_top:
                            p = OrgChart.ui._linkTopToBottom(cnode.leftNeighbor, cnode, t, separation);
                            break;

                        case OrgChart.orientation.left:
                        case OrgChart.orientation.left_top:
                            p = OrgChart.ui._linkTopToBottom(cnode.leftNeighbor, cnode, t, separation);
                            break;
                    }
                }
                else {
                    switch (layoutConfig.orientation) {
                        case OrgChart.orientation.top:
                        case OrgChart.orientation.top_left:
                            if (cnode.isPartner == 1){
                                p = OrgChart.ui._linkLeftToRight(node, cnode, t, pSeparation );
                            }
                            else if (cnode.isPartner == 2){
                                p = OrgChart.ui._linkRightToLeft(node, cnode, t, pSeparation);
                            }
                            else{
                                var mid  = cnode.layout == 1 ? undefined : (cnodeb.minY - (cnodeb.minY - nodeb.maxY) / 2);
                                p = OrgChart.ui._linkTopToBottom(node, cnode, t, separation, mid);
                            }
                            break;

                        case OrgChart.orientation.bottom:
                        case OrgChart.orientation.bottom_left:
                            if (cnode.isPartner == 1){
                                p = OrgChart.ui._linkLeftToRight(node, cnode, t, pSeparation);
                            }
                            else if (cnode.isPartner == 2){
                                p = OrgChart.ui._linkRightToLeft(node, cnode, t, pSeparation);
                            }
                            else{
                                var mid  = cnode.layout == 1 ? undefined : (cnodeb.maxY - (cnodeb.maxY - nodeb.minY) / 2);
                                p = OrgChart.ui._linkBottomToTop(node, cnode, t, separation, mid);
                            }

                            break;

                        case OrgChart.orientation.right:
                        case OrgChart.orientation.right_top:
                            if (cnode.isPartner == 1){
                                p = OrgChart.ui._linkTopToBottom(node, cnode, t, pSeparation);
                            }
                            else if (cnode.isPartner == 2){
                                p = OrgChart.ui._linkBottomToTop(node, cnode, t, pSeparation);
                            }
                            else{
                                var mid  = cnode.layout == 1 ? undefined : (cnodeb.maxX - (cnodeb.maxX - nodeb.minX) / 2);
                                p = OrgChart.ui._linkRightToLeft(node, cnode, t, separation, mid);
                            }

                            break;

                        case OrgChart.orientation.left:
                        case OrgChart.orientation.left_top:
                            if (cnode.isPartner == 1){
                                p = OrgChart.ui._linkTopToBottom(node, cnode, t, pSeparation);
                            }
                            else if (cnode.isPartner == 2){
                                p = OrgChart.ui._linkBottomToTop(node, cnode, t, pSeparation);
                            }
                            else{
                                var mid  = cnode.layout == 1 ? undefined : (cnodeb.minX - (cnodeb.minX - nodeb.maxX) / 2);
                                p = OrgChart.ui._linkLeftToRight(node, cnode, t, separation, mid);
                            }

                            break;
                    }
                }
           }


            if (linkTemplate.indexOf('{rounded}') != -1) {
                if ((p.xa == p.xb && p.xa == p.xc && p.xa == p.xd) || (p.ya == p.yb && p.ya == p.yc && p.ya == p.yd)){
                    linkTemplate = linkTemplate.replace("{rounded}", 'M' + p.xa + ',' + p.ya + ' L' + p.xd + ',' + p.yd);
                }
                else{
                    var r1 = OrgChart.ui._roundedEdge(p.xa, p.ya, p.xb, p.yb, p.xc, p.yc);
                    var r2 = OrgChart.ui._roundedEdge(p.xb, p.yb, p.xc, p.yc, p.xd, p.yd);


                    linkTemplate = linkTemplate.replace("{rounded}", 'M' + r1.x1 + ',' + r1.y1 + ' ' + r1.x2 + ',' + r1.y2
                        + ' Q' + r1.qx1 + ',' + r1.qy1 + ' ' + r1.qx2 + ',' + r1.qy2
                        + ' L' + r2.x2 + ',' + r2.y2
                        + ' Q' + r2.qx1 + ',' + r2.qy1 + ' ' + r2.qx2 + ',' + r2.qy2
                        + ' L' + r2.x3 + ',' + r2.y3);
                }
            }
            else if (linkTemplate.indexOf('{edge}') != -1) {
                linkTemplate = linkTemplate.replace("{edge}", 'M' + p.xa + ',' + p.ya + ' ' + p.xb + ',' + p.yb + ' ' + p.xc + ',' + p.yc + ' L' + p.xd + ',' + p.yd);
            }
            else if (linkTemplate.indexOf('{curve}') != -1) {
                linkTemplate = linkTemplate.replace("{curve}", 'M' + p.xa + ',' + p.ya + ' C' + p.xb + ',' + p.yb + ' ' + p.xc + ',' + p.yc + ' ' + p.xd + ',' + p.yd);
            }
            else {
                linkTemplate = linkTemplate
                    .replaceAll("{xa}", p.xa)
                    .replaceAll("{ya}", p.ya)
                    .replaceAll("{xb}", p.xb)
                    .replaceAll("{yb}", p.yb)
                    .replaceAll("{xc}", p.xc)
                    .replaceAll("{yc}", p.yc)
                    .replaceAll("{xd}", p.xd)
                    .replaceAll("{yd}", p.yd);
            }


            linkArray.push(OrgChart.linkOpenTag
                .replace("{id}", node.id)
                .replace("{class}", "link " + cnode.tags.join(" "))
                .replace("{child-id}", cnode.id)
            );


            var args = {
                node: node,
                cnode: cnode,
                p: p,
                html: linkTemplate,
                action: action
            };
            OrgChart.events.publish('render-link', [obj, args]);
            linkArray.push(args.html);
            var linkFieldsHtml = "";


            for (var f in obj.config.linkBinding) {
                var val = obj.config.linkBinding[f];
                var data = obj._get(cnode.id);
                if (data) {
                    var replacement = data[val];

                    args.value = replacement;
                    args.element = t[f];
                    args.name = val;

                    var result = OrgChart.events.publish('label', [obj, args]);

                    if (result !== false){
                        if (!OrgChart.isNEU(args.value) && !OrgChart.isNEU(args.element)) {
                            linkFieldsHtml += args.element.replace("{val}", args.value);
                        }
                    }
                }
            }

            if (linkFieldsHtml != "") {
                linkFieldsHtml = OrgChart.linkFieldsOpenTag
                    .replace("{x}", p.x)
                    .replace("{y}", p.y)
                    .replace("{rotate}", rotate) + linkFieldsHtml + OrgChart.grCloseTag;

                linkArray.push(linkFieldsHtml);
            }

            linkArray.push(OrgChart.grCloseTag);

        }

        return linkArray.join('');
    },

    svg: function (width, height, viewBox, config, content, scale) {
        var html = OrgChart.t(config.template, false, scale).svg
            .replace("{w}", width)
            .replace("{h}", height)
            .replace("{viewBox}", viewBox)
            .replace("{randId}", OrgChart.ui._defsIds[config.template])
            .replace("{mode}", config.mode)
            .replace("{template}", config.template)
            .replace("{content}", function() { return content});

        return html;
    },

    //wrapper: function (width, height, viewBox, config, content, scale) {
    //    var html = OrgChart.templates[config.template].svg
    //        .replace("{w}", width)
    //        .replace("{h}", height)
    //        .replace("{viewBox}", viewBox)
    //        .replace("{content}", content);

    //    return html;
    //},

    menuButton: function (config) {
        if (config.menu == null) {
            return "";
        }

        var template = OrgChart.t(config.template, false);
        return template.menuButton.replaceAll("{p}", config.padding);
    },

    _roundedEdge: function (x1, y1, x2, y2, x3, y3) {
        var angle = OrgChart.LINK_ROUNDED_CORNERS;
        if (Math.abs(x1 - x3) < angle){
            angle = 0;
        }
        if (Math.abs(y1 - y3) < angle){
            angle = 0;
        }
        var qx1, qy1, qx2, qy2 = 0;

        if ((x1 == x2 && x1 == x3)
            || (y1 == y2 && y1 == y3)){
            qx1 = qx2 = x2;
            qy1 = qy2 = y2;
        }
        else{

            if (x1 != x3 && x2 == x3){
                qx1 = qx2 = x2;
                qy1 = y2;
                if (y1 < y3){
                    qy2 = y2 + angle;
                }
                else if (y1 > y3){
                    qy2 = y2 - angle;
                }
            }

            if (x1 < x3 && x2 == x3){
                x2 -= angle;
            }
            else if (x1 > x3 && x2 == x3){
                x2 += angle;
            }

            if (y1 != y3 && y2 == y3){
                qx1 = x2;
                qy1 = qy2 = y2;
                if (x1 < x3){
                    qx2 = x2 + angle;
                }
                else if (x1 > x3){
                    qx2 = x2 - angle;
                }
            }

            if (y1 < y3 && y2 == y3){
                y2 -= angle;
            }
            else if (y1 > y3 && y2 == y3){
                y2 += angle;
            }
        }

        return {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            x3: x3,
            y3: y3,
            qx1: qx1,
            qy1: qy1,
            qx2: qx2,
            qy2: qy2
        }
    },

    _linkTopToBottom: function (node1, node2, t, separation, mid) {
        var xa = 0, ya = 0, xb = 0, yb = 0, xc = 0, yc = 0, xd = 0, yd = 0, x = 0, y = 0, rotate = 0;
        xa = node1.x + (node1.w / 2) + t.linkAdjuster.toX;
        ya = node1.y + node1.h + t.linkAdjuster.toY;
        xd = xc = node2.x + (node2.w / 2) + t.linkAdjuster.fromX;
        yd = node2.y + t.linkAdjuster.fromY;
        xb = xa;

        if (node1.rightNeighbor && node1.rightNeighbor.isAssistant && node2.templateName == "split") {
            yb = yc = node1.rightNeighbor.y + node1.rightNeighbor.h + separation;
        }
        else if (node1.templateName == "split" && (node2.isAssistant || node2.layout == 2)) {
            yb = yc = yd;
        }
        else if (node2.templateName == "split") {
            yb = yc = ya + separation;
        }
        else if (mid != undefined) {
            yb = yc = mid;
        }
        else {
            yb = yc = yd - separation;
        }


        x = xc;
        y = yc + 16;
        return { xa: xa, ya: ya, xb: xb, yb: yb, xc: xc, yc: yc, xd: xd, yd: yd, x: x, y: y, rotate: rotate };
    },

    _linkBottomToTop: function (node1, node2, t, separation, mid) {
        var xa = 0, ya = 0, xb = 0, yb = 0, xc = 0, yc = 0, xd = 0, yd = 0, x = 0, y = 0, rotate = 0;
        xa = node1.x + (node1.w / 2) + t.linkAdjuster.toX;
        ya = node1.y + t.linkAdjuster.toY;
        xd = xc = node2.x + (node2.w / 2) + t.linkAdjuster.fromX;
        yd = node2.y + node2.h + t.linkAdjuster.fromY;
        xb = xa;

        if (node1.rightNeighbor && node1.rightNeighbor.isAssistant && node2.templateName == "split") {
            yb = yc = node1.rightNeighbor.y - separation;
        }
        else if (node1.templateName == "split" && (node2.isAssistant || node2.layout == 2)) {
            yb = yc = yd;
        }
        else if (node2.templateName == "split") {
            yb = yc = ya - separation;
        }
        else if (mid != undefined){
            yb = yc = mid;
        }
        else {
            yb = yc = yd + separation;
        }

        x = xc;
        y = yc - 14;
        return { xa: xa, ya: ya, xb: xb, yb: yb, xc: xc, yc: yc, xd: xd, yd: yd, x: x, y: y, rotate: rotate };
    },

    _linkRightToLeft: function (node1, node2, t, separation, mid) {
        var xa = 0, ya = 0, xb = 0, yb = 0, xc = 0, yc = 0, xd = 0, yd = 0, x = 0, y = 0, rotate = 0;
        xa = node1.x + t.linkAdjuster.toX;
        ya = node1.y + (node1.h / 2) + t.linkAdjuster.toY;
        xd = node2.x + node2.w + t.linkAdjuster.fromX;
        yd = yc = node2.y + (node2.h / 2) + t.linkAdjuster.fromY;
        yb = ya;

        if (node1.rightNeighbor && node1.rightNeighbor.isAssistant && node2.templateName == "split") {
            xb = xc = node1.rightNeighbor.x - separation;
        }
        else if (node1.templateName == "split" && (node2.isAssistant || node2.layout == 2)) {
            xb = xc = xd;
        }
        else if (node2.templateName == "split") {
            xb = xc = xa - separation;
        }
        else if (mid != undefined){
            xb = xc = mid;
        }
        else {
            xb = xc = xd + separation;
        }

        x = xc - 16;
        y = yc;
        rotate = 90;
        return { xa: xa, ya: ya, xb: xb, yb: yb, xc: xc, yc: yc, xd: xd, yd: yd, x: x, y: y, rotate: rotate };
    },

    _linkLeftToRight: function (node1, node2, t, separation, mid) {
        var xa = 0, ya = 0, xb = 0, yb = 0, xc = 0, yc = 0, xd = 0, yd = 0, x = 0, y = 0, rotate = 0;
        xa = node1.x + node1.w + t.linkAdjuster.toX;
        ya = node1.y + (node1.h / 2) + t.linkAdjuster.toY;
        xd = node2.x + t.linkAdjuster.fromX;
        yd = yc = node2.y + (node2.h / 2) + t.linkAdjuster.fromY;
        yb = ya;

        if (node1.rightNeighbor && node1.rightNeighbor.isAssistant && node2.templateName == "split") {
            xb = xc = node1.rightNeighbor.x + node1.rightNeighbor.w + separation;
        }
        else if (node1.templateName == "split" && (node2.isAssistant || node2.layout == 2)) {
            xb = xc = xd;
        }
        else if (node2.templateName == "split") {
            xb = xc = xa + separation;
        }
        else if (mid != undefined){
            xb = xc = mid;
        }
        else {
            xb = xc = xd - separation;
        }

        x = xc + 14;
        y = yc;
        rotate = 270;
        return { xa: xa, ya: ya, xb: xb, yb: yb, xc: xc, yc: yc, xd: xd, yd: yd, x: x, y: y, rotate: rotate };
    },

     _linkPpTop: function(parentPartnersHelper, node, cnode, cnodeb, nodeb, t){
        var ppnode = parentPartnersHelper.ppnodes[cnode.id];

        var y = ppnode.y + ppnode.h / 2;
        var mid  = cnodeb.minY - (cnodeb.minY - nodeb.maxY) / 2;
        var lineSep  = ((cnodeb.minY - nodeb.maxY) / parentPartnersHelper.maxSidePartnersWithChildren) / 4;

        var result = OrgChart.ui.__linkPpBottomTop(parentPartnersHelper, node, cnode, mid, lineSep, ppnode);
        var x = result.x;
        mid = result.mid;

        return OrgChart.ui._linkTopToBottom({
            x: x,
            y: y,
            w: 0,
            h: 0
        }, cnode, t, 0, mid);
    },

    _linkPpBottom: function(parentPartnersHelper, node, cnode, cnodeb, nodeb, t){
        var ppnode = parentPartnersHelper.ppnodes[cnode.id];

        var y = ppnode.y + ppnode.h / 2;
        var mid  = (cnodeb.maxY - (cnodeb.maxY - nodeb.minY) / 2);
        var lineSep  = ((cnodeb.maxY - nodeb.minY) / parentPartnersHelper.maxSidePartnersWithChildren) / 4;

        var result = OrgChart.ui.__linkPpBottomTop(parentPartnersHelper, node, cnode, mid, lineSep, ppnode);
        var x = result.x;
        mid = result.mid;

        return OrgChart.ui._linkBottomToTop({
            x: x,
            y: y,
            w: 0,
            h: 0
        }, cnode, t, 0, mid);
    },

    _linkPpLeft: function(parentPartnersHelper, node, cnode, cnodeb, nodeb, t){
        var ppnode = parentPartnersHelper.ppnodes[cnode.id];

        var mid  = (cnodeb.minX - (cnodeb.minX - nodeb.maxX) / 2);
        var lineSep  = ((cnodeb.minX - nodeb.maxX) / parentPartnersHelper.maxSidePartnersWithChildren) / 4;

        var x = ppnode.x + ppnode.w / 2;
        var result = OrgChart.ui.__linkPpLeftRight(parentPartnersHelper, node, cnode, mid, lineSep, ppnode);
        var y = result.y;
        mid = result.mid;

        return OrgChart.ui._linkLeftToRight({
            x: x,
            y: y,
            w: 0,
            h: 0
        }, cnode, t, 0, mid);
    },

    _linkPpRight: function(parentPartnersHelper, node, cnode, cnodeb, nodeb, t){
        var ppnode = parentPartnersHelper.ppnodes[cnode.id];

        var mid  = (cnodeb.maxX - (cnodeb.maxX - nodeb.minX) / 2);
        var lineSep  = ((cnodeb.maxX - nodeb.minX) / parentPartnersHelper.maxSidePartnersWithChildren) / 4;

        var x = ppnode.x + ppnode.w / 2;
        var result = OrgChart.ui.__linkPpLeftRight(parentPartnersHelper, node, cnode, mid, lineSep, ppnode);
        var y = result.y;
        mid = result.mid;

        return OrgChart.ui._linkRightToLeft({
            x: x,
            y: y,
            w: 0,
            h: 0
        }, cnode, t, 0, mid);
    },

    __linkPpBottomTop: function(parentPartnersHelper, node, cnode, mid, lineSep, ppnode){
        var x = 0;

        if (ppnode.isPartner == 1){
            x = (ppnode.x - node.partnerSeparation / 2) + (parentPartnersHelper.indexes[cnode.id] * parentPartnersHelper.partnerChildrenSplitSeparation) - ((parentPartnersHelper.rightIds.length - 1) * parentPartnersHelper.partnerChildrenSplitSeparation) / 2;

            if (parentPartnersHelper.lastLeft  && (x < (parentPartnersHelper.lastLeft.x + parentPartnersHelper.lastLeft.w / 2))){
                if (x < (cnode.x + cnode.w / 2)){
                    mid -= (parentPartnersHelper.indexes[cnode.id] + 1) * lineSep;
                }
                else{
                    mid -= (parentPartnersHelper.rightIds.length  - parentPartnersHelper.indexes[cnode.id]) * lineSep;
                }
            }
            else{
                if (x < (cnode.x + cnode.w / 2)){
                    mid += (parentPartnersHelper.rightIds.length  - parentPartnersHelper.indexes[cnode.id]) * lineSep;
                }
                else{
                    mid += (parentPartnersHelper.indexes[cnode.id] + 1) * lineSep;
                }
            }
        }
        else if (ppnode.isPartner == 2){
            x = (ppnode.x + ppnode.w + node.partnerSeparation / 2) + (parentPartnersHelper.indexes[cnode.id] * parentPartnersHelper.partnerChildrenSplitSeparation) - ((parentPartnersHelper.leftIds.length - 1) * parentPartnersHelper.partnerChildrenSplitSeparation) / 2;

            if (parentPartnersHelper.firstRight && (x > (parentPartnersHelper.firstRight.x + parentPartnersHelper.firstRight.w / 2))){
                if (x < (cnode.x + cnode.w / 2)){
                    mid -= (parentPartnersHelper.indexes[cnode.id] + 1) * lineSep;
                }
                else{
                    mid -= (parentPartnersHelper.leftIds.length  - parentPartnersHelper.indexes[cnode.id]) * lineSep;
                }
            }
            else{
                if (x < (cnode.x + cnode.w / 2)){
                    mid += (parentPartnersHelper.leftIds.length  - parentPartnersHelper.indexes[cnode.id]) * lineSep;
                }
                else{
                    mid += (parentPartnersHelper.indexes[cnode.id] + 1) * lineSep;
                }
            }
        }
        return{
            x: x,
            mid: mid
        }
    },

    __linkPpLeftRight: function(parentPartnersHelper, node, cnode, mid, lineSep, ppnode){
        var y = 0;

        if (ppnode.isPartner == 1){
            y = (ppnode.y - node.partnerSeparation / 2) + (parentPartnersHelper.indexes[cnode.id] * parentPartnersHelper.partnerChildrenSplitSeparation) - ((parentPartnersHelper.rightIds.length - 1) * parentPartnersHelper.partnerChildrenSplitSeparation) / 2;

            if (parentPartnersHelper.lastLeft  && (y < (parentPartnersHelper.lastLeft.y + parentPartnersHelper.lastLeft.h / 2))){
                if (y < (cnode.y + cnode.h / 2)){
                    mid -= (parentPartnersHelper.indexes[cnode.id] + 1) * lineSep;
                }
                else{
                    mid -= (parentPartnersHelper.rightIds.length  - parentPartnersHelper.indexes[cnode.id]) * lineSep;
                }
            }
            else{
                if (y < (cnode.y + cnode.h / 2)){
                    mid += (parentPartnersHelper.rightIds.length  - parentPartnersHelper.indexes[cnode.id]) * lineSep;
                }
                else{
                    mid += (parentPartnersHelper.indexes[cnode.id] + 1) * lineSep;
                }
            }
        }
        else if (ppnode.isPartner == 2){
            y = (ppnode.y + ppnode.h + node.partnerSeparation / 2) + (parentPartnersHelper.indexes[cnode.id] * parentPartnersHelper.partnerChildrenSplitSeparation) - ((parentPartnersHelper.leftIds.length - 1) * parentPartnersHelper.partnerChildrenSplitSeparation) / 2;

            if (parentPartnersHelper.firstRight && (y > (parentPartnersHelper.firstRight.y + parentPartnersHelper.firstRight.h / 2))){
                if (y < (cnode.y + cnode.h / 2)){
                    mid -= (parentPartnersHelper.indexes[cnode.id] + 1) * lineSep;
                }
                else{
                    mid -= (parentPartnersHelper.leftIds.length  - parentPartnersHelper.indexes[cnode.id]) * lineSep;
                }
            }
            else{
                if (y < (cnode.y + cnode.h / 2)){
                    mid += (parentPartnersHelper.leftIds.length  - parentPartnersHelper.indexes[cnode.id]) * lineSep;
                }
                else{
                    mid += (parentPartnersHelper.indexes[cnode.id] + 1) * lineSep;
                }
            }
        }
        return{
            y: y,
            mid: mid
        }
    }
};



if (typeof (OrgChart) == "undefined") {
    OrgChart = {};
}

OrgChart._validateConfig = function (config) {
    if (!config) {
        console.error("config is not defined");
    }
    else {
        return true;
    }
    return false;
};

OrgChart._arrayContains = function (arr, obj) {
    if (arr && Array.isArray(arr)) {
        var i = arr.length;
        while (i--)
            if (arr[i] === obj)
                return true;
    }
    return false;
};

OrgChart._interceptions = function (o1, o2) {
    if (!o1) {
        return [];
    }
    if (!o2) {
        return [];
    }

    var r = [];

    if (Array.isArray(o1) && Array.isArray(o2)) {
        for (var i1 in o1) {
            for (var i2 in o2) {
                if (o1[i1] == o2[i2]) {
                    r.push(o1[i1])
                }
            }
        }
    }
    else if (Array.isArray(o1) && !Array.isArray(o2)) {
        for (var i1 in o1) {
            for (var i2 in o2) {
                if (o1[i1] == i2) {
                    r.push(o1[i1])
                }
            }
        }
    }
    else if (!Array.isArray(o1) && Array.isArray(o2)) {
        for (var i1 in o1) {
            for (var i2 in o2) {
                if (i1 == o2[i2]) {
                    r.push(o2[i2])
                }
            }
        }
    }

    return r;
};



OrgChart._getTags = function (sourceNode) {
    if (sourceNode.tags && !Array.isArray(sourceNode.tags)) {
        return sourceNode.tags.split(",");
    }
    else if (sourceNode.tags && Array.isArray(sourceNode.tags)) {
        return sourceNode.tags;
    }
    return [];
};

OrgChart._centerPointInPercent = function (element, pageX, pageY) {
    var rect = element.getBoundingClientRect();
    var x = pageX - rect.left;
    var y = pageY - rect.top;

    var relativeXpercent = (x) / (rect.width / 100);
    var relativeYpercent = (y) / (rect.height / 100);

    return [relativeXpercent, relativeYpercent];
};

OrgChart._trim = function (val) {
    return val.replace(/^\s+|\s+$/g, '');
};

OrgChart._getTransform = function (element) {
    var transform = element.getAttribute("transform");
    transform = transform.replace("matrix", "").replace("(", "").replace(")", "");

    if (OrgChart._browser().msie) {
        transform = transform.replace(/ /g, ",");
    }
    transform = OrgChart._trim(transform);
    transform = "[" + transform + "]";
    transform = JSON.parse(transform);

    return transform;
};

OrgChart.getScale = function (viewBox, w, h, initial, max, min, x, y) {
    var scale = 1;
    if (!viewBox && initial === OrgChart.match.boundary) {
        var scaleX = (w) / x;
        var scaleY = (h) / y;
        scale = scaleX > scaleY ? scaleY : scaleX;
    }
    else if (!viewBox && initial === OrgChart.match.width) {
        scale = (w) / x;
    }
    else if (!viewBox && initial === OrgChart.match.height) {
        scale = (h) / y;
    }
    else if (!viewBox) {
        scale = initial;
    }
    else {
        var scaleX = w / viewBox[2];
        var scaleY = h / viewBox[3];
        scale = scaleX > scaleY ? scaleY : scaleX;
    }

    if (scale && scale > max) {
        scale = max;
    }
    if (scale && scale < min) {
        scale = min;
    }

    return scale;
};


OrgChart.isObject = function (item) {
    return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
};


OrgChart.fileUploadDialog = function (callback) {
    var fileUpload = document.createElement("INPUT");
    fileUpload.setAttribute("type", "file");
    fileUpload.style.display = "none";
    fileUpload.onchange = function () {
        var file = this.files[0];
        callback(file);
    };
    document.body.appendChild(fileUpload);
    fileUpload.click();
};

OrgChart.mergeDeep = function (target, source) {
    if (OrgChart.isObject(target) && OrgChart.isObject(source)) {
        for (var key in source) {
            if (OrgChart.isObject(source[key])) {
                if (!target[key]) {
                    Object.assign(target, { [key]: {} });
                }
                OrgChart.mergeDeep(target[key], source[key]);
            }
            else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }
    return target;
};

OrgChart._lblIsImg = function (config, lbl) {
    if (config.nodeBinding) {
        if (typeof (lbl) == 'string' && lbl.indexOf("img") != -1 && config.nodeBinding[lbl]) {
            return true;
        }
    }
    return false;
};

OrgChart._getFistImgField = function (config) {
    if (config.nodeBinding) {
        for (var lbl in config.nodeBinding) {
            if (lbl.indexOf("img") != -1) {
                return config.nodeBinding[lbl];
            }
        }
    }
    return false;
};

OrgChart._fieldIsImg = function (config, f) {
    if (config.nodeBinding) {
        for (var b in config.nodeBinding) {
            if (config.nodeBinding[b] == f) {
                return OrgChart._lblIsImg(config, b);
            }
        }
    }
    return false;
};




OrgChart._guid = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

OrgChart.htmlRipple = function (element) {
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ''
        + ' .boc-ripple-container {position: absolute; top: 0; right: 0; bottom: 0; left: 0; }'
        + ' .boc-ripple-container span {transform: scale(0);border-radius:100%;position:absolute;opacity:0.75;background-color:#fff;animation: boc-ripple 1000ms; }'
        + '@-moz-keyframes boc-ripple {to {opacity: 0;transform: scale(2);}}@-webkit-keyframes boc-ripple {to {opacity: 0;transform: scale(2);}}@-o-keyframes boc-ripple {to {opacity: 0;transform: scale(2);}}@keyframes boc-ripple {to {opacity: 0;transform: scale(2);}}';


    document.head.appendChild(css);


    var debounce = function (func, delay) {
        var inDebounce;
        inDebounce = undefined;
        return function () {
            var args, context;
            context = this;
            args = arguments;
            clearTimeout(inDebounce);
            return inDebounce = setTimeout(function () {
                return func.apply(context, args);
            }, delay);
        };
    };

    var showRipple = function (e) {
        var pos, ripple, rippler, size, style, x, y;
        ripple = this;
        rippler = document.createElement('span');
        size = ripple.offsetWidth;
        pos = ripple.getBoundingClientRect();
        x = e.pageX - pos.left - (size / 2);
        y = e.pageY - pos.top - (size / 2);
        style = 'top:' + y + 'px; left: ' + x + 'px; height: ' + size + 'px; width: ' + size + 'px;';
        element.rippleContainer.appendChild(rippler);
        return rippler.setAttribute('style', style);
    };

    var cleanUp = function () {
        while (this.rippleContainer.firstChild) {
            this.rippleContainer.removeChild(this.rippleContainer.firstChild);
        }
    };


    var rippleContainer = document.createElement('div');
    rippleContainer.className = 'boc-ripple-container';
    element.addEventListener('mousedown', showRipple);
    element.addEventListener('mouseup', debounce(cleanUp, 2000));
    element.rippleContainer = rippleContainer;
    element.appendChild(rippleContainer);
};

OrgChart._moveToBoundaryArea = function (svgElement, startViewBox, boundary, callback) {
    var endViewBox = startViewBox.slice(0);//clone

    if (startViewBox[0] < boundary.left && startViewBox[0] < boundary.right) {
        endViewBox[0] = boundary.left > boundary.right ? boundary.right : boundary.left;
    }
    if (startViewBox[0] > boundary.right && startViewBox[0] > boundary.left) {
        endViewBox[0] = boundary.left > boundary.right ? boundary.left : boundary.right;
    }
    if (startViewBox[1] < boundary.top && startViewBox[1] < boundary.bottom) {
        endViewBox[1] = boundary.top > boundary.bottom ? boundary.bottom : boundary.top;

    }
    if (startViewBox[1] > boundary.bottom && startViewBox[1] > boundary.top) {
        endViewBox[1] = boundary.top > boundary.bottom ? boundary.top : boundary.bottom;
    }

    if (startViewBox[0] !== endViewBox[0] || startViewBox[1] !== endViewBox[1]) {
        OrgChart.animate(svgElement,
            { viewBox: startViewBox },
            { viewBox: endViewBox },
            300,
            OrgChart.anim.outPow, function () {
                if (callback)
                    callback();
            });
    }
    else if (callback) {
        callback();
    }
};

OrgChart.randomId = function () {
    return '_' + ("0000" + ((Math.random() * Math.pow(36, 4)) | 0).toString(36)).slice(-4);
}

OrgChart._getClientXY = function (e) {
    if (e.type.indexOf("touch") != -1) {
        if (e.changedTouches.length) {
            return {
                x: e.changedTouches[0].clientX,
                y: e.changedTouches[0].clientY
            }
        }
    }
    else {
        return {
            x: e.clientX,
            y: e.clientY
        }
    }
}

OrgChart._getClientTouchesXY = function (e, i) {
    if (e.type.indexOf("touch") != -1) {
        if (e.touches.length < i + 1) {
            return {
                x: null,
                y: null
            }
        }
        else {
            return {
                x: e.touches[i].clientX,
                y: e.touches[i].clientY
            }
        }
    }
    else {
        return {
            x: e.clientX,
            y: e.clientY
        }
    }
}

OrgChart._getOffset = function (object, offset) {
    if (!object)
        return;
    offset.x += object.offsetLeft;
    offset.y += object.offsetTop;

    OrgChart._getOffset(object.offsetParent, offset);
}

OrgChart._getTopLeft = function (div) {
    var offset = { x: 0, y: 0 };
    OrgChart._getOffset(div, offset);
    return offset;
}

OrgChart._getOffsetXY = function (el, e) {
    if (e.type.indexOf("touch") != -1) {
        if (e.touches.length) {
            var offset = OrgChart._getTopLeft(el);
            return {
                x: e.touches[0].pageX - offset.x,
                y: e.touches[0].pageY - offset.y
            }
        }
        else if (e.changedTouches.length) {
            var offset = OrgChart._getTopLeft(el);
            return {
                x: e.changedTouches[0].pageX - offset.x,
                y: e.changedTouches[0].pageY - offset.y
            }
        }
    }
    else {
        return {
            x: e.offsetX,
            y: e.offsetY
        }
    }
}

OrgChart._pinchMiddlePointInPercent = function (el, w, h, e) {
    var offset = OrgChart._getTopLeft(el);
    var t1x = e.touches[0].pageX - offset.x;
    var t1y = e.touches[0].pageY - offset.y;
    var t2x = e.touches[1].pageX - offset.x;
    var t2y = e.touches[1].pageY - offset.y;

    var relativeXpercent = ((t1x - t2x) / 2 + t2x) / (w / 100);
    var relativeYpercent = ((t1y - t2y) / 2 + t2y) / (h / 100);

    return [relativeXpercent, relativeYpercent];
}

OrgChart._browser = function () {
    // Opera 8.0+
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

    // Firefox 1.0+
    var isFirefox = typeof InstallTrigger !== 'undefined';

    // Safari 3.0+ "[object HTMLElementConstructor]"
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode;

    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;

    // Chrome 1 - 71
    var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

    // Blink engine detection
    var isBlink = (isChrome || isOpera) && !!window.CSS;

    return {
        opera: isOpera,
        firefox: isFirefox,
        safari: isSafari,
        msie: isIE,
        edge: isEdge,
        chrome: isChrome,
        blink: isBlink
    };
};


OrgChart._menuPosition = function (stickEl, wrapperEl, svgEl) {
    var stickElbcr = stickEl.getBoundingClientRect();
    var svgElbcr = svgEl.getBoundingClientRect();
    var wrapperElbcr = wrapperEl.getBoundingClientRect();

    var x = stickElbcr.left - svgElbcr.left;
    var y = stickElbcr.top - svgElbcr.top;

    if ((stickElbcr.top + wrapperElbcr.height) > (svgElbcr.top + svgElbcr.height)) {
        y = y - wrapperElbcr.height;
    }

    if ((stickElbcr.left - wrapperElbcr.width) < (svgElbcr.left)) {
        x = x + wrapperElbcr.width;
    }

    return { x: x, y: y };
};

OrgChart._getTemplate = function (tags, configTags, defaultTemplate) {
    if (Array.isArray(tags)) {
        for (var i = 0; i < tags.length; i++) {
            var tag = configTags[tags[i]];
            if (tag && tag.template) {
                return tag.template;
            }
        }
    }

    return defaultTemplate;
};

OrgChart._getMin = function (node, config) {
    if (node.tags && node.tags.length && config.tags) {
        for (var i = 0; i < node.tags.length; i++) {
            var tag = config.tags[node.tags[i]];
            if (tag && tag.min === true) {
                return true;
            }
        }
    }

    return config.min;
};

// OrgChart._getCollapsed = function (tags, layoutConfigs) {
//         for (var i = 0; i < tags.length; i++) {
//             var tag = layoutConfigs[tags[i]];
//             if (tag && tag.collapse) {
//                 return tag.collapse;
//             }
//         }

//     return {};
// };



OrgChart._getSubLevels = function (tags, configTags) {
    if (tags && tags.length) {
        for (var i = 0; i < tags.length; i++) {
            var tag = configTags[tags[i]];
            if (tag && tag.subLevels) {
                return tag.subLevels;
            }
        }
    }

    return 0;
};

OrgChart._isHTML = function (str) {
    var div = document.createElement('div');
    div.innerHTML = str;

    for (var c = div.childNodes, i = c.length; i--;) {
        if (c[i].nodeType == 1) return true;
    }

    return false;
}


OrgChart._getTestDiv = function () {
    var testDiv = document.getElementById("orgchart_js_test_div");

    if (!testDiv) {
        testDiv = document.createElement('div');
        testDiv.id = 'orgchart_js_test_div';
        testDiv.style.position = "fixed";
        testDiv.style.top = "-10000px";
        testDiv.style.left = "-10000px";
        document.body.appendChild(testDiv);
    }

    return testDiv;
}

OrgChart._getLabelSize = function (label) {
    var testDiv = OrgChart._getTestDiv();
    testDiv.innerHTML = '<svg>' + label + '</svg>';

    var textElement = testDiv.querySelector('text');

    return textElement.getBoundingClientRect();
}
OrgChart.wrapText = function (text, field) {
    var fieldLowerCase = field.toLowerCase();
    if (fieldLowerCase.indexOf("<text") == -1) {
        return text;
    }
    else if (fieldLowerCase.indexOf(OrgChart.attr.width) == -1) {
        return text;
    }
    else if (fieldLowerCase.indexOf("foreignobject") != -1) {
        return text;
    }

    if (field.indexOf(OrgChart.attr.width) == -1) {
        return text;
    }
    if (OrgChart._isHTML(text)) {
        return text;
    }
    var testDiv = OrgChart._getTestDiv();
    field = field.replaceAll("{cw}", 0);
    testDiv.innerHTML = '<svg>' + field + '</svg>';
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(field, "text/xml");
    var xmlText = xmlDoc.getElementsByTagName("text")[0];
    var x = parseFloat(xmlText.getAttribute("x"));
    var y = parseFloat(xmlText.getAttribute("y"));
    var textAnchor = xmlText.getAttribute("text-anchor");
    var width = xmlText.getAttribute(OrgChart.attr.width);
    var textOverflow = xmlText.getAttribute(OrgChart.attr.text_overflow);
    var svgNS = "http://www.w3.org/2000/svg";
    var text_element = testDiv.getElementsByTagName("svg")[0].getElementsByTagName("text")[0];
    var lines;
    var multilineWithEllipsis;

    if (!textOverflow) {
        textOverflow = "ellipsis";
    }
    var textOverflowArgs = textOverflow.split('-');
    if (textOverflowArgs.length > 1) {
        lines = parseInt(textOverflow.split('-')[1]);
        if (textOverflowArgs.length > 2 && textOverflowArgs[2] == "ellipsis") {
            multilineWithEllipsis = true;
        }
    }


    if (!width) {
        return text;
    }

    width = parseFloat(width);

    if (!x) {
        x = 0;
    }
    if (!y) {
        y = 0;
    }
    if (!x) {
        textAnchor = "start";
    }

    if (textOverflow == "ellipsis") {
        text_element.removeChild(text_element.firstChild);
        text_element.textContent = text;

        var length = text_element.getComputedTextLength();
        var index = 2;
        while (length > width) {
            text_element.textContent = text.substring(0, text.length - index);
            text_element.textContent += "...";
            length = text_element.getComputedTextLength();
            index++;
        }

        if (index > 2) {
            return '<title>' + text + '</title>' + text_element.textContent;
        }
        else {
            return text;
        }
    }
    else if (textOverflow.indexOf("multiline") != -1) {
        var words = text.split(' ');
        var height = text_element.getBBox().height;

        text_element.textContent = "";


        var tspan_element = document.createElementNS(svgNS, "tspan");
        var text_node = document.createTextNode(words[0]);

        tspan_element.setAttributeNS(null, "x", x);
        tspan_element.setAttributeNS(null, "y", y);
        tspan_element.setAttributeNS(null, "text-anchor", textAnchor);
        tspan_element.appendChild(text_node);
        text_element.appendChild(tspan_element);

        var index = 1;
        var line_count = 1;

        for (var i = 1; i < words.length; i++) {
            var len = tspan_element.firstChild.data.length;
            tspan_element.firstChild.data += " " + words[i];

            if (tspan_element.getComputedTextLength() > width) {
                tspan_element.firstChild.data = tspan_element.firstChild.data.slice(0, len);
                line_count++;

                if (lines && line_count > lines) {
                    if (multilineWithEllipsis && text_element.children.length == lines) {
                        var textContent = text_element.children[lines - 1].textContent;
                        text_element.children[lines - 1].textContent = textContent.substring(0, textContent.length - 3) + "...";
                    }
                    break;
                }

                var tspan_element = document.createElementNS(svgNS, "tspan");
                tspan_element.setAttributeNS(null, "x", x);
                tspan_element.setAttributeNS(null, "y", y + height * index);
                tspan_element.setAttributeNS(null, "text-anchor", textAnchor);
                text_node = document.createTextNode(words[i]);
                tspan_element.appendChild(text_node);
                text_element.appendChild(tspan_element);

                index++;
            }
        }

        var result = "";
        if (text_element.innerHTML != undefined) {
            result = text_element.innerHTML;
            text_element.innerHTML = "";
        }
        else {
            var innerHTML = "";
            for (var i = text_element.childNodes.length - 1; i >= 0; i--) {
                innerHTML = XMLSerializer().serializeToString(text_element.childNodes[i]) + innerHTML;

                text_element.removeChild(text_element.childNodes[i]);
            }
            result = innerHTML;
        }

        return result;
    }
}




OrgChart._downloadFile = function (type, content, filename, openInNewTab) {
    var blob = new Blob([content], { type: type });

    if (openInNewTab == true) {
        var url = URL.createObjectURL(blob);
        var win = window.open(url, '_blank');
        win.focus();
    }
    else {
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }
};

OrgChart._getPosition = function (anims, node, x, y) {
    var pos = { x: node.x, y: node.y };
    if (x != undefined) {
        pos.x = x;
    }
    if (y != undefined) {
        pos.y = x;
    }
    if (anims && anims.length == 3) {
        var index = anims[0].indexOf(node.id);
        if (index != -1) {
            if (anims[1][index].transform != undefined) {
                if (x == undefined) {
                    pos.x = anims[1][index].transform[4];
                }
                if (y == undefined) {
                    pos.y = anims[1][index].transform[5];
                }
            }
        }
    }

    return pos;
};

OrgChart._getOpacity = function (anims, node) {
    var opacity = 1;

    if (anims && anims.length == 3) {
        var index = anims[0].indexOf(node.id);
        if (index != -1) {
            if (anims[1][index].opacity != undefined) {
                opacity = anims[1][index].opacity;
            }
        }
    }

    return opacity;
};


OrgChart.t = function (name, minimized, scale) {
    var t = OrgChart.templates[name];

    var tClone = null;
    if (scale != undefined && t.scaleLessThen) {
        var scales = [];
        for (var k in t.scaleLessThen) {
            var v = parseFloat(k);
            if (scale < v) {
                scales.push(v);
            }
        }
        if (scales.length > 0) {
            scales.sort(function (a, b) {
                return a - b;
            });

            var s = t.scaleLessThen[scales[0]];

            for (var j in s) {
                if (tClone == null) {
                    tClone = Object.assign({}, t);
                }
                tClone[j] = s[j];
            }

        }
    }

    if (minimized) {
        return tClone == null ? (t.min ? t.min : t) : (tClone.min ? tClone.min : tClone);
    }
    else {
        return tClone == null ? t : tClone;
    }
};


OrgChart.setNodeSize = function (node) {
    var t = OrgChart.t(node.templateName, node.min);
    node.w = t && t.size ? t.size[0] : 0;
    node.h = t && t.size ? t.size[1] : 0;
};

OrgChart._imgs2base64 = function (el, tag, attr, callback) {
    var images = el.getElementsByTagName(tag);
    var count = images.length;
    if (count == 0) {
        callback();
    }
    for (var i = 0; i < count; i++) {
        (function () {
            var index = i;
            var image = images[index];
            OrgChart._getDataUri(image.getAttribute(attr), function (res) {
                if (res.success) {
                    image.setAttribute(attr, res.result);
                }
                if (index == (count - 1)) {
                    callback();
                }
            });
        })();
    }
}

OrgChart._getDataUri = function (url, callback) {
    if (url.indexOf('base64') != -1) {
        callback({
            success: false
        });
    }
    else {
        var imgxhr = new XMLHttpRequest();
        imgxhr.open("GET", url);
        imgxhr.responseType = "blob";
        imgxhr.onload = function () {
            if (imgxhr.status === 200) {
                reader.readAsDataURL(imgxhr.response);
            }
            else if (imgxhr.status === 404) {
                callback({
                    success: false,
                    result: imgxhr.status
                });
            }
        };
        var reader = new FileReader();
        reader.onloadend = function () {
            callback({
                success: true,
                result: reader.result
            });
        };
        imgxhr.send();
    }
};


OrgChart._csvToArray = function (strData, strDelimiter) {
    strDelimiter = (strDelimiter || ",");
    var objPattern = new RegExp(
        (
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );
    var arrData = [[]];
    var arrMatches = null;
    while (arrMatches = objPattern.exec(strData)) {
        var strMatchedDelimiter = arrMatches[1];
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
        ) {
            arrData.push([]);
        }
        var strMatchedValue;
        if (arrMatches[2]) {
            strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"),
                "\""
            );
        } else {
            strMatchedValue = arrMatches[3];
        }
        arrData[arrData.length - 1].push(strMatchedValue);
    }
    return (arrData);
};

OrgChart._json2xml = function (nodes) {
    var doc = document.implementation.createDocument("", "", null);
    var nodesEl = doc.createElement("nodes");

    for (var i = 0; i < nodes.length; i++) {
        var nodeEl = doc.createElement("node");
        var node = nodes[i];
        for (var name in node) {
            var val = node[name];
            if (name == 'tags') {
                val = val.join();
            }
            nodeEl.setAttribute(name, val);
        }
        nodesEl.appendChild(nodeEl);
    }

    doc.appendChild(nodesEl);
    return '<?xml version="1.0" encoding="utf-8" ?>' + new XMLSerializer().serializeToString(doc.documentElement);
};

OrgChart._xml2json = function (text) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(text, "text/xml");
    var nodeEls = doc.getElementsByTagName("node");

    var nodes = [];
    for (var i = 0; i < nodeEls.length; i++) {
        var nodeEl = nodeEls[i];
        var node = {};
        for (var j = 0; j < nodeEl.attributes.length; j++) {
            var attr = nodeEl.attributes[j];
            var val = attr.value;
            if (attr.name == 'tags') {
                val = val.split(',');
            }
            node[attr.name] = val;
        }
        nodes.push(node);
    }
    return nodes;
};

OrgChart._json2csv = function (nodes) {
    var nodePropArr = [];

    var processNode = function (node) {
        var finalVal = '';
        for (var j = 0; j < nodePropArr.length; j++) {
            var innerValue;
            if (nodePropArr[j] == "reportsTo") {
                innerValue = null;
            }
            else if (node[nodePropArr[j]] == undefined) {
                innerValue = '';
            }
            else {
                innerValue = node[nodePropArr[j]];
            }
            if (innerValue instanceof Date) {
                innerValue = innerValue.toLocaleString();
            };

            innerValue = innerValue === null ? '' : innerValue.toString();
            var result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += ',';
            finalVal += result;
        }
        return finalVal + '\n';
    };

    var csvFile = '';

    for (var i = 0; i < nodes.length; i++) {
        for (var prop in nodes[i]) {
            if (!OrgChart._arrayContains(nodePropArr, prop)) {
                nodePropArr.push(prop);
                csvFile += prop + ",";
            }
        }
    }
    csvFile = csvFile.substring(0, csvFile.length - 1);
    csvFile += "\n";


    for (var i = 0; i < nodes.length; i++) {
        csvFile += processNode(nodes[i]);
    }
    csvFile = csvFile.substring(0, csvFile.length - 1);
    return csvFile;
};

OrgChart.accentFold = function (inStr) {
    inStr = inStr.toString().toLowerCase();
    return inStr.replace(
        /([àáâãäå])|([ç])|([èéêë])|([ìíîï])|([ñ])|([òóôõöø])|([ß])|([ùúûü])|([ÿ])|([æ])/g,
        function (str, a, c, e, i, n, o, s, u, y, ae) {
            if (a) return 'a';
            if (c) return 'c';
            if (e) return 'e';
            if (i) return 'i';
            if (n) return 'n';
            if (o) return 'o';
            if (s) return 's';
            if (u) return 'u';
            if (y) return 'y';
            if (ae) return 'ae';
        }
    );
}


OrgChart.copy = function (obj) {
    if (obj === null || typeof (obj) !== 'object' || 'isActiveClone' in obj)
        return obj;

    if (obj instanceof Date)
        var temp = new obj.constructor(); //or new Date(obj);
    else
        var temp = obj.constructor();

    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            obj['isActiveClone'] = null;
            temp[key] = OrgChart.copy(obj[key]);
            delete obj['isActiveClone'];
        }
    }
    return temp;
}



OrgChart._getScrollSensitivity = function () {
    var browser = OrgChart._browser();

    if (browser.msie && OrgChart.scroll.ie) {
        return OrgChart.scroll.ie;
    }
    else if (browser.edge && OrgChart.scroll.edge) {
        return OrgChart.scroll.edge;
    }
    else if (browser.safari && OrgChart.scroll.safari) {
        return OrgChart.scroll.safari;
    }
    else if (browser.chrome && OrgChart.scroll.chrome) {
        return OrgChart.scroll.chrome;
    }
    else if (browser.firefox && OrgChart.scroll.firefox) {
        return OrgChart.scroll.firefox;
    }
    else if (browser.opera && OrgChart.scroll.opera) {
        return OrgChart.scroll.opera;
    }
    else {
        return {
            smooth: OrgChart.scroll.smooth,
            speed: OrgChart.scroll.speed
        }
    }
}
OrgChart.isMobile = function () {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

OrgChart.isTrial = function () {
    return OrgChart.remote !== undefined;
};

OrgChart.childrenCount = function (chart, node, count) {
    if (count == undefined) {
        count = 0;
    }

    for (var i = 0; i < node.childrenIds.length; i++) {
        var cnode = chart.nodes[node.childrenIds[i]];

        if (cnode) {
            count++;
            OrgChart.childrenCount(chart, cnode, count);
        }
    }

    return count;
};

OrgChart.collapsedChildrenCount = function (chart, node, count) {
    if (count == undefined) {
        count = 0;
    }

    for (var i = 0; i < node.childrenIds.length; i++) {
        var cnode = chart.nodes[node.childrenIds[i]];

        if (cnode) {
            if (cnode.collapsed === true) {
                count++;
            }
            OrgChart.collapsedChildrenCount(chart, cnode, count);
        }
    }

    return count;
};

OrgChart._setMinMaxXY = function (node, b) {
    if (b.minX == null || ((node.x != null) && (node.x < b.minX))) {
        b.minX = node.x;
    }
    if (b.minY == null || ((node.y != null) && (node.y < b.minY))) {
        b.minY = node.y;
    }
    if (b.maxX == null || ((node.x != null) && (node.x + node.w > b.maxX))) {
        b.maxX = node.x + node.w;
    }
    if (b.maxY == null || ((node.y != null) && (node.y + node.h > b.maxY))) {
        b.maxY = node.y + node.h;
    }
};

OrgChart.getStParentNodes = function (node, stParentNodes) {
    if (!stParentNodes) {
        stParentNodes = [];
    }

    while (node.parent) {
        node = node.parent;
    }
    if (node.stParent) {
        stParentNodes.push(node.stParent);
        OrgChart.getStParentNodes(node.stParent, stParentNodes);
    }
    return stParentNodes;
};

OrgChart.getRootOf = function (node) {
    while (node) {
        if (!node.parent) {
            break;
        }
        node = node.parent;
    }
    return node;
};

OrgChart._getViewBox = function (svg) {
    var viewBox = null;
    if (svg) {
        viewBox = svg.getAttribute("viewBox");
        viewBox = "[" + viewBox + "]";
        viewBox = viewBox.replace(/\ /g, ",");
        viewBox = JSON.parse(viewBox);
        return viewBox;
    }
    else {
        return null;
    }
};

OrgChart.isNEU = function (val) {
    return (val === null || val === undefined || val === '');
};


OrgChart.gradientCircleForDefs = function (id, colors, r, strokeWidth) {
    if (!Array.isArray(colors)){
        colors = [colors,colors,colors,colors,colors,colors];
    }
    function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    function describeArc(x, y, radius, startAngle, endAngle) {
        var start = polarToCartesian(x, y, radius, endAngle);
        var end = polarToCartesian(x, y, radius, startAngle);

        var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        var d = [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");

        return d;
    }
    return `<linearGradient id="${id}_linearColors1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${colors[0]}"></stop>
            <stop offset="100%" stop-color="${colors[1]}"></stop>
        </linearGradient>
        <linearGradient id="${id}_linearColors2" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stop-color="${colors[1]}"></stop>
            <stop offset="100%" stop-color="${colors[2]}"></stop>
        </linearGradient>
        <linearGradient id="${id}_linearColors3" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${colors[2]}"></stop>
            <stop offset="100%" stop-color="${colors[3]}"></stop>
        </linearGradient>
        <linearGradient id="${id}_linearColors4" x1="1" y1="1" x2="0" y2="0">
            <stop offset="0%" stop-color="${colors[3]}"></stop>
            <stop offset="100%" stop-color="${colors[4]}"></stop>
        </linearGradient>
        <linearGradient id="${id}_linearColors5" x1="0.5" y1="1" x2="0.5" y2="0">
            <stop offset="0%" stop-color="${colors[4]}"></stop>
            <stop offset="100%" stop-color="${colors[5]}"></stop>
        </linearGradient>
        <linearGradient id="${id}_linearColors6" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stop-color="${colors[5]}"></stop>
            <stop offset="100%" stop-color="${colors[0]}"></stop>
        </linearGradient>
        <g id="${id}">
            <path stroke-width="${strokeWidth}" fill="none" stroke="url(#${id}_linearColors1)" d="${describeArc(r, r, r, 1, 60)}"  />
            <path stroke-width="${strokeWidth}" fill="none" stroke="url(#${id}_linearColors2)" d="${describeArc(r, r, r, 60, 120)}"/>
            <path stroke-width="${strokeWidth}" fill="none" stroke="url(#${id}_linearColors3)" d="${describeArc(r, r, r, 120, 180)}" />
            <path stroke-width="${strokeWidth}" fill="none" stroke="url(#${id}_linearColors4)" d="${describeArc(r, r, r, 180, 240)}" />
            <path stroke-width="${strokeWidth}" fill="none" stroke="url(#${id}_linearColors5)" d="${describeArc(r, r, r, 240, 300)}" />
            <path stroke-width="${strokeWidth}" fill="none" stroke="url(#${id}_linearColors6)" d="${describeArc(r, r, r, 300, 1)}"/>
        </g>`;
}

OrgChart._intersectionObserver = function(element, callback) {
    if (typeof IntersectionObserver === 'function'){ //is IntersectionObs erver supported, in salceforce lwc is not supported
        //var options = {root: document.documentElement}; //removed becouse of ionic - it works well with the dewfault options
        var observer = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                callback(entry.intersectionRatio > 0);
            });
        });

        observer.observe(element);
    }
    else {
        callback(true);
    }
}

OrgChart.convertCsvToNodes = function (text) {
    var csv = OrgChart._csvToArray(text);
    var columnNames = csv[0];
    var nodes = [];
    for(var i = 1; i < csv.length; i++){
        var node = {};
        for(var j = 0; j < csv[i].length; j++){
            if (columnNames[j] == 'tags' && csv[i][j] != ''){
                csv[i][j] = csv[i][j].split(',');
            }
            else if (columnNames[j] == 'tags' && csv[i][j] == ''){
                continue;
            }
            node[columnNames[j]] = csv[i][j];
        }
        if (node.id.trim() != ''){
            nodes.push(node);
        }
    }
    return nodes;
};

OrgChart.xScrollUI = function (element, config, requestParams, onSetViewBoxCallback, onDrawCallback) {
    this.element = element;
    this.requestParams = requestParams;
    this.config = config;
    this.onSetViewBoxCallback = onSetViewBoxCallback;
    this.onDrawCallback = onDrawCallback;
    this.pos = 0;
};

OrgChart.xScrollUI.prototype.addListener = function (svg) {
    var that = this;
    if (this.config.mouseScrool != OrgChart.action.xScroll && this.config.mouseScrool != OrgChart.action.scroll) {
        return;
    }
    if (!this.bar) {//disabled
        return;
    }


    function smoothScroll(target, speed, smooth) {
        var moving = false;

        target.addEventListener('wheel', scrolled,  {passive: true});

        function scrolled(e) {
            var delta = 0;
            if (that.config.mouseScrool == OrgChart.action.xScroll){
                delta = e.deltaX || e.wheelDeltaX;
                if (!delta){
                    delta = e.deltaY || e.wheelDeltaY;
                }
            }
            else if (that.config.mouseScrool == OrgChart.action.scroll){
                if (!e.shiftKey){
                    delta = e.deltaX || e.wheelDeltaX;
                }
                else{
                    delta = e.deltaY || e.wheelDeltaY;
                }
                if (!delta) {
                    return;
                }
            }

            delta = -delta;


            delta = Math.max(-1, Math.min(1, delta)) // cap the delta to [-1,1] for cross browser consistency
            that.pos += -delta * speed;

            var hundredPercentScroll = (parseFloat(that.innerBar.clientWidth) - parseFloat(that.bar.clientWidth));


            if (that.pos < 0) {
                that.pos = 0;
            }
            if (that.pos > hundredPercentScroll) {
                that.pos = hundredPercentScroll;
            }

            if (!moving) update()
        }

        function update() {
            moving = true;
            var delta = (that.pos - that.bar.scrollLeft) / smooth;
            if (delta > 0) {
                delta++;
            }
            else if (delta == 0){
                moving = false
                return;
            }
            else {
                delta--;
            }


            if (Math.ceil(that.bar.scrollLeft) == Math.ceil(that.pos)) {
                moving = false
            }
            else {
                that.bar.scrollLeft += delta;
                requestFrame(update);
            }
        }

        var requestFrame = function () { // requestAnimationFrame cross browser
            return (
                window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (func) {
                    setTimeout(func, 1000 / 50);
                }
            );
        }()
    }
    var sensitivity = OrgChart._getScrollSensitivity();
    smoothScroll(svg, sensitivity.speed, sensitivity.smooth);
};

OrgChart.xScrollUI.prototype.create = function (width) {
    if (this.config.showXScroll !== OrgChart.scroll.visible
        && this.config.mouseScrool !== OrgChart.action.scroll
        && this.config.mouseScrool !== OrgChart.action.xScroll){
        return;
    }
    var that = this;
    if (this.bar){
        this.bar.parentNode.removeChild(this.bar);
    }
    this.bar = document.createElement("div");
    if (this.config.showXScroll !== OrgChart.scroll.visible){
        this.bar.style.visibility = 'hidden';
    }
    this.innerBar = document.createElement("div");

    var p = this.requestParams();

    this.innerBar.innerHTML = "&nbsp";

    Object.assign(this.bar.style, {
        position: "absolute", left: 0, bottom: 0, width: (width /*- this.config.padding*/) + "px", "overflow-x": "scroll", height: "20px"
    });

    this.element.appendChild(this.bar);
    this.bar.appendChild(this.innerBar);

    this.bar.addEventListener("scroll", function () {
        if (this.ignore) {
            this.ignore = false;
            return;
        }

        var p = that.requestParams();
        var onePercentScroll = (parseFloat(that.innerBar.clientWidth) - parseFloat(that.bar.clientWidth)) / 100;
        var scrollGoLeftInPercentage = this.scrollLeft / onePercentScroll;
        var onePercentView = ((p.boundary.right) - (p.boundary.left)) / 100;

        p.viewBox[0] = scrollGoLeftInPercentage * onePercentView + p.boundary.left;
        that.onSetViewBoxCallback(p.viewBox);

        clearTimeout(this._timeout);
        this._timeout = setTimeout(function () {
            that.onDrawCallback();
        }, 500);
    });
};

OrgChart.xScrollUI.prototype.setPosition = function () {
    if (!this.bar) {//disabled
        return;
    }
    var p = this.requestParams();

    var innerWidth = Math.abs(p.boundary.maxX - p.boundary.minX) * p.scale;

    switch (this.config.orientation) {
        case OrgChart.orientation.bottom:
        case OrgChart.orientation.bottom_left:
            innerHeight = Math.abs(p.boundary.minY * p.scale);
            break;
        case OrgChart.orientation.right:
        case OrgChart.orientation.right_top:
            innerWidth = Math.abs(p.boundary.minX * p.scale);
            break;
    }

    this.innerBar.style.width = innerWidth + "px";

    var onePercentView = ((p.boundary.right) - (p.boundary.left)) / 100;

    var scrollGoLeftInPercentage = ((p.viewBox[0] - (p.boundary.left)) / onePercentView);

    if (scrollGoLeftInPercentage < 0) {
        scrollGoLeftInPercentage = 0;
    }
    else if (scrollGoLeftInPercentage > 100) {
        scrollGoLeftInPercentage = 100;
    }

    var onePercentXScroll = (parseFloat(this.innerBar.clientWidth) - parseFloat(this.bar.clientWidth)) / 100;

    var scrollLeft = scrollGoLeftInPercentage * onePercentXScroll;
    this.bar.ignore = true;
    this.bar.scrollLeft = scrollLeft;
    this.pos = this.bar.scrollLeft;

    if (onePercentXScroll <= 0){
        this.bar.style.visibility = 'hidden';
    }
    else {
        this.bar.style.visibility = '';
    }
};







OrgChart.yScrollUI = function (element, config, requestParams, onSetViewBoxCallback, onDrawCallback) {
    this.element = element;
    this.requestParams = requestParams;
    this.config = config;
    this.onSetViewBoxCallback = onSetViewBoxCallback;
    this.onDrawCallback = onDrawCallback;
    this.pos = 0;
};

OrgChart.yScrollUI.prototype.addListener = function (svg) {
    var that = this;
    if (this.config.mouseScrool != OrgChart.action.yScroll && this.config.mouseScrool != OrgChart.action.scroll) {
        return;
    }




    function smoothScroll(target, speed, smooth) {

        var moving = false;

        target.addEventListener('wheel', scrolled,  {passive: true});
        function scrolled(e) {
            var delta = 0;
            if (that.config.mouseScrool == OrgChart.action.yScroll){
                delta = e.deltaY || e.wheelDeltaY;
                if (!delta){
                    delta = e.deltaX || e.wheelDeltaX;
                }
            }
            else if (that.config.mouseScrool == OrgChart.action.scroll){
                if (!e.shiftKey){
                    delta = e.deltaY || e.wheelDeltaY;
                }
                else{
                    delta = e.deltaX || e.wheelDeltaX;
                }
                if (!delta) {
                    return;
                }
            }

            delta = -delta;

            delta = Math.max(-1, Math.min(1, delta)) // cap the delta to [-1,1] for cross browser consistency

            that.pos += -delta * speed;

            var hundredPercentScroll = (parseFloat(that.innerBar.clientHeight) - parseFloat(that.bar.clientHeight));
            if (that.pos < 0) {
                that.pos = 0;
            }
            if (that.pos > hundredPercentScroll) {
                that.pos = hundredPercentScroll;
            }

            if (!moving) update()
        }

        function update() {
            moving = true;
            var delta = (that.pos - that.bar.scrollTop) / smooth;
            if (delta > 0) {
                delta++;
            }
            else if (delta == 0){
                moving = false
                return;
            }
            else {
                delta--;
            }

            if (Math.ceil(that.bar.scrollTop) == Math.ceil(that.pos)) {
                moving = false
            }
            else {
                that.bar.scrollTop += delta;
                requestFrame(update);
            }
        }

        var requestFrame = function () { // requestAnimationFrame cross browser
            return (
                window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (func) {
                    setTimeout(func, 1000 / 50);
                }
            );
        }()
    }
    var sensitivity = OrgChart._getScrollSensitivity();
    smoothScroll(svg, sensitivity.speed, sensitivity.smooth);
};


OrgChart.yScrollUI.prototype.create = function (height) {
    if (this.config.showYScroll !== OrgChart.scroll.visible
        && this.config.mouseScrool !== OrgChart.action.scroll
        && this.config.mouseScrool !== OrgChart.action.yScroll){
        return;
    }
    var that = this;
    if (this.bar){
        this.bar.parentNode.removeChild(this.bar);
    }
    this.bar = document.createElement("div");
    if (this.config.showYScroll !== OrgChart.scroll.visible){
        this.bar.style.visibility = 'hidden';
    }
    this.innerBar = document.createElement("div");

    this.innerBar.innerHTML = "&nbsp";

    Object.assign(this.bar.style, {
        position: "absolute", right: 0, bottom: 0, height: (height /*- padding*/) + "px", "overflow-y": "scroll", width: "20px"
    });

    this.element.appendChild(this.bar);
    this.bar.appendChild(this.innerBar);

    this.bar.addEventListener("scroll", function () {
        if (this.ignore) {
            this.ignore = false;
            return;
        }

        var p = that.requestParams();
        var onePercentScroll = (parseFloat(that.innerBar.clientHeight) - parseFloat(that.bar.clientHeight)) / 100;

        var scrollGoTopInPercentage = this.scrollTop / onePercentScroll;
        var onePercentView = ((p.boundary.bottom) - (p.boundary.top)) / 100;
        p.viewBox[1] = scrollGoTopInPercentage * onePercentView + p.boundary.top;

        that.onSetViewBoxCallback(p.viewBox);

        clearTimeout(this._timeout);
        this._timeout = setTimeout(function () {
            that.onDrawCallback();
        }, 500);
    });
};

OrgChart.yScrollUI.prototype.setPosition = function () {
    if (!this.bar) {//disabled
        return;
    }
    var p = this.requestParams();
    var innerHeight = p.boundary.maxY * p.scale;

    switch (this.config.orientation) {
        case OrgChart.orientation.bottom:
        case OrgChart.orientation.bottom_left:
            innerHeight = Math.abs(p.boundary.minY * p.scale);
            break;
        case OrgChart.orientation.right:
        case OrgChart.orientation.right_top:
            innerWidth = Math.abs(p.boundary.minX * p.scale);
            break;
    }

    this.innerBar.style.height = innerHeight + "px";

    var onePercentView = (p.boundary.bottom - p.boundary.top) / 100;

    var scrollGoTopInPercentage = ((p.viewBox[1] - p.boundary.top) / Math.abs(onePercentView));

    if (scrollGoTopInPercentage < 0) {
        scrollGoTopInPercentage = 0;
    }
    else if (scrollGoTopInPercentage > 100) {
        scrollGoTopInPercentage = 100;
    }

    var onePercentYScroll = (parseFloat(this.innerBar.clientHeight) - parseFloat(this.bar.clientHeight)) / 100;
    var scrollTop = scrollGoTopInPercentage * onePercentYScroll;

    this.bar.ignore = true;
    this.bar.scrollTop = scrollTop;
    this.pos = this.bar.scrollTop;

    if (onePercentYScroll <= 0){
        this.bar.style.visibility = 'hidden';
    }
    else {
        this.bar.style.visibility = '';
    }
};







OrgChart.prototype.zoom = function ( delta, center, shouldAnimate, callback) {


    var viewBox = this.getViewBox().slice(0); //clone
    var tempViewBox = viewBox;

    var tempViewBoxWidth = viewBox[2];
    var tempViewBoxHeight = viewBox[3];

    if (delta === true) {
        viewBox[2] = viewBox[2] / (OrgChart.SCALE_FACTOR);
        viewBox[3] = viewBox[3] / (OrgChart.SCALE_FACTOR);
    }
    else if (delta === false) {
        viewBox[2] = viewBox[2] * (OrgChart.SCALE_FACTOR);
        viewBox[3] = viewBox[3] * (OrgChart.SCALE_FACTOR);
    }
    else {
        viewBox[2] = viewBox[2] / (delta);
        viewBox[3] = viewBox[3] / (delta);
    }
    if (!center) {
        center = [50, 50];
    }

    viewBox[0] = tempViewBox[0] - (viewBox[2] - tempViewBoxWidth) / (100 / center[0]);
    viewBox[1] = tempViewBox[1] - (viewBox[3] - tempViewBoxHeight) / (100 / center[1]);

    var scale = this.getScale(viewBox);

    viewBox[2] = this.width() / scale;
    viewBox[3] = this.height() / scale;

    if (((delta === true) && (scale < this.config.scaleMax)) || ((delta === false) && (scale > this.config.scaleMin)) || (delta != false && delta != true && scale < this.config.scaleMax && scale > this.config.scaleMin)) {
        this._hideBeforeAnimation();
        var that = this;
        if (shouldAnimate) {
            clearTimeout(that._timeout);

            OrgChart.animate(this.getSvg(), { viewbox: this.getViewBox() }, { viewbox: viewBox }, this.config.anim.duration, this.config.anim.func, function () {
                clearTimeout(that._timeout);
                that._timeout = setTimeout(function () {
                    that._draw(true, OrgChart.action.zoom, null, callback);
                }, 500);
            });
        }
        else {
            this.setViewBox(viewBox);
            clearTimeout(that._timeout);

            that._timeout = setTimeout(function () {
                that._draw(true, OrgChart.action.zoom, null, callback);
            }, 500);
        }
    }
};

OrgChart.loading = {};


OrgChart.loading.show = function(chart){
    var html = '<style>@-webkit-keyframes dot-keyframes {0% { opacity: .4; -webkit-transform: scale(1, 1);transform: scale(1, 1);}50% {opacity: 1;-webkit-transform: scale(1.2, 1.2);transform: scale(1.2, 1.2);}100% {opacity: .4;-webkit-transform: scale(1, 1);transform: scale(1, 1);}}@keyframes dot-keyframes {0% {opacity: .4;-webkit-transform: scale(1, 1);transform: scale(1, 1);}50% {opacity: 1;-webkit-transform: scale(1.2, 1.2);transform: scale(1.2, 1.2);}100% {opacity: .4;-webkit-transform: scale(1, 1);transform: scale(1, 1);}}.boc-loading-dots div {margin: 10px;}      .boc-dot-1 {background-color: #039BE5;}.boc-dot-2 {background-color: #F57C00;}.boc-dot-3 {background-color: #FFCA28;}      .boc-loading-dots {text-align: center;width: 100%; position: absolute; top: 0;}.boc-loading-dots--dot {-webkit-animation: dot-keyframes 1.5s infinite ease-in-out;animation: dot-keyframes 1.5s infinite ease-in-out;        border-radius: 10px;display: inline-block;height: 10px;width: 10px;}.boc-loading-dots--dot:nth-child(2) {-webkit-animation-delay: .5s;animation-delay: .5s;}.boc-loading-dots--dot:nth-child(3) {-webkit-animation-delay: 1s;animation-delay: 1s;}</style><div class="boc-loading-dots"><div class="boc-loading-dots--dot boc-dot-1"></div><div class="boc-loading-dots--dot boc-dot-2"></div><div class="boc-loading-dots--dot boc-dot-3"></div></div>';
    var div = document.createElement("div");
    div.id = 'boc-loading';


    div.innerHTML = html;

    chart.element.appendChild(div);
};

OrgChart.loading.hide = function(chart){
    var loadingEl = chart.element.querySelector('#boc-loading');
    if (loadingEl){
        loadingEl.parentNode.removeChild(loadingEl);
    }
};


OrgChart.pdfPrevUI = {};

if (!OrgChart.loc){
    OrgChart.loc = {};
}

OrgChart.loc.ppdfCmdTitle = 'PDF Preview';
OrgChart.loc.ppdfSave = 'Save';
OrgChart.loc.ppdfCancel = 'Cancel';
OrgChart.loc.ppdfFormat = 'Format';
OrgChart.loc.ppdfFitToDrwaing = 'Fit';
OrgChart.loc.ppdfA4 = 'A4';
OrgChart.loc.ppdfA3 = 'A3';
OrgChart.loc.ppdfA2 = 'A2';
OrgChart.loc.ppdfA1 = 'A1';
OrgChart.loc.ppdfLetter = 'Letter';
OrgChart.loc.ppdfLegal = 'Legal';
OrgChart.loc.ppdfLayout = 'Layout';
OrgChart.loc.ppdfPortrait = 'Portrait';
OrgChart.loc.ppdfLandscape = 'Landscape';
OrgChart.loc.ppdfFittopagewidth = 'Fit to page width';
OrgChart.loc.ppdfMargin = 'Margin';
OrgChart.loc.ppdfHeader = 'Header';
OrgChart.loc.ppdfFooter = 'Footer';
OrgChart.loc.ppdfScale = 'Scale';


OrgChart.pdfPrevUI.show = function (chart, options) {
    OrgChart.pdfPrevUI.hide(chart);

    options = chart._defaultExportOptions(options, 'pdf')

    var div1 = document.createElement("div");
    div1.classList.add(chart.config.mode);
    div1.id = 'boc-ppdf-btns';
    Object.assign(div1.style, {
        position: 'absolute', top: 0, left: 0, 'background-color': '#fff', 'z-index': 5, margin: "0 0 0 -265px", 'box-shadow': '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',  width: '265px', height: '100%', "font-family": "Roboto,Helvetica", 'color': '#757575', 'text-align': 'right', 'padding' : '10px'
    });

    chart.element.appendChild(div1);

    div1.innerHTML = '<h1>'
    + OrgChart.loc.ppdfCmdTitle
    + '</h1>'
    + '<div><button type="button" id="boc-prev-save" style="font-size: 14px; width: 90px;">' + OrgChart.loc.ppdfSave + '</button>&nbsp;<button type="button" id="boc-prev-cancel" style="width: 90px;font-size: 14px;">' + OrgChart.loc.ppdfCancel + '</button></div>'
    + '<div style="margin-top:30px; height:10px;border-bottom:1px solid #eeeeee;"></div>'
    + '<div style="padding-top:30px;"><label for="boc-size">' + OrgChart.loc.ppdfFormat + ': </label><select id="boc-ppdf-size" style="color: #757575; width: 150px; font-size: 14px;" id="boc-size">'
    + '<option value="fit">' + OrgChart.loc.ppdfFitToDrwaing + '</option>'
    + '<option value="A4">' + OrgChart.loc.ppdfA4 + '</option>'
    + '<option value="A3">' + OrgChart.loc.ppdfA3 + '</option>'
    + '<option value="A2">' + OrgChart.loc.ppdfA2 + '</option>'
    + '<option value="A1">' + OrgChart.loc.ppdfA1 + '</option>'
    + '<option value="Letter">' + OrgChart.loc.ppdfLetter + '</option>'
    + '<option value="Legal">' + OrgChart.loc.ppdfLegal + '</option>'
    + '</select></div>'
    + '<div style="padding-top:10px;"><label for="boc-ppdf-layout">' + OrgChart.loc.ppdfLayout + ': </label><select id="boc-ppdf-layout" style="color: #757575; width: 150px;font-size: 14px;" >'
    + '<option value="false">' + OrgChart.loc.ppdfPortrait + '</option>'
    + '<option value="true">' + OrgChart.loc.ppdfLandscape + '</option>'
    + '</select></div>'
    + '<div style="padding-top:10px;"><label for="boc-scale">' + OrgChart.loc.ppdfScale + ': </label><select id="boc-ppdf-scale" style="color: #757575; width: 150px;font-size: 14px;" id="boc-scale">'
    + '<option value="fit">'+ OrgChart.loc.ppdfFittopagewidth + '</option>'
    + '<option value="10">10%</option>'
    + '<option value="20">20%</option>'
    + '<option value="30">30%</option>'
    + '<option value="40">40%</option>'
    + '<option value="50">50%</option>'
    + '<option value="60">60%</option>'
    + '<option value="70">70%</option>'
    + '<option value="80">80%</option>'
    + '<option value="90">90%</option>'
    + '<option value="100">100%</option>'
    + '<option value="110">110%</option>'
    + '<option value="120">120%</option>'
    + '<option value="130">130%</option>'
    + '<option value="140">140%</option>'
    + '<option value="150">150%</option>'
    + '<option value="160">160%</option>'
    + '<option value="170">170%</option>'
    + '<option value="180">180%</option>'
    + '<option value="190">190%</option>'
    + '<option value="200">200%</option>'
    + '</select></div>'
    + '<div style="margin-top:10px;margin-bottom:10px; height:10px;border-bottom:1px solid #eeeeee;"></div>'
    + '<div style="padding-top:10px;"><label for="boc-ppdf-header">' + OrgChart.loc.ppdfHeader + ': </label><input id="boc-ppdf-header" type="text" style="color: #757575; width: 100px;font-size: 14px;" ></div>'
    + '<div style="padding-top:10px;"><label for="boc-ppdf-footer">' + OrgChart.loc.ppdfFooter + ': </label><input id="boc-ppdf-footer" type="text" style="color: #757575; width: 100px;font-size: 14px;" ></div>'
    + '<div style="padding-top:10px;"><label for="boc-ppdf-margin">' + OrgChart.loc.ppdfMargin + ': </label><input id="boc-ppdf-margin" type="text" style="color: #757575; width: 100px;font-size: 14px;" ></div>';

    var div2 = document.createElement("div");
    div2.id = 'boc-ppdf-wrapper';
    Object.assign(div2.style, {
        'overflow-y': 'scroll', 'z-index': 11, position: 'absolute', top: 0, left: '285px', 'background-color': '#eee', width: (chart.width() - 270) + 'px', height: '100%'
    });

    chart.element.appendChild(div2);

    div2.innerHTML = '<div id="boc-ppdf-content" style="width: 100%;margin-top:10px;margin-bottom:10px;opacity:0;"></div>';

    var bgppdfformat = chart.element.querySelector('#boc-ppdf-size');
    var bgppdflayout = chart.element.querySelector('#boc-ppdf-layout');
    var bgppdfscale = chart.element.querySelector('#boc-ppdf-scale');
    var bgppdfmargin = chart.element.querySelector('#boc-ppdf-margin');
    var bgppdfheader = chart.element.querySelector('#boc-ppdf-header');
    var bgppdffooter = chart.element.querySelector('#boc-ppdf-footer');

    bgppdfformat.value = options.format;
    bgppdflayout.value = options.landscape;
    bgppdfscale.value = options.scale;
    bgppdfmargin.value = options.margin;
    bgppdfheader.value = options.header;
    bgppdffooter.value = options.footer;

    OrgChart.animate(chart.element.querySelector('#boc-ppdf-btns'), { margin: [0,0,0,-250] },  { margin: [0,0,0,0] }, 300, OrgChart.anim.outSin, function(){
        chart.exportPDF(options, OrgChart.pdfPrevUI._handler);
    });

    chart.element.querySelector('#boc-prev-cancel').addEventListener('click', function(){
        OrgChart.pdfPrevUI.hide(chart);
    });

    chart.element.querySelector('#boc-prev-save').addEventListener('click', function(){
        chart.exportPDF(options);
        OrgChart.pdfPrevUI.hide(chart);
    });

    OrgChart.pdfPrevUI._showHide(bgppdfformat, bgppdflayout, bgppdfscale);

    bgppdfformat.addEventListener('change', function(){
        OrgChart.animate(chart.element.querySelector('#boc-ppdf-content'), { opacity: 1 },  { opacity: 0 }, 300, OrgChart.anim.inSin, function(){
            chart.element.querySelector('#boc-ppdf-content').innerHTML = '';
            options.format = bgppdfformat.value;
            chart.exportPDF(options, OrgChart.pdfPrevUI._handler);
            OrgChart.pdfPrevUI._showHide(bgppdfformat, bgppdflayout, bgppdfscale);
        });
    });

    bgppdflayout.addEventListener('change', function(){
        OrgChart.animate(chart.element.querySelector('#boc-ppdf-content'), { opacity: 1 },  { opacity: 0 }, 300, OrgChart.anim.inSin, function(){
            chart.element.querySelector('#boc-ppdf-content').innerHTML = '';
            options.landscape = bgppdflayout.value == 'true';
            chart.exportPDF(options, OrgChart.pdfPrevUI._handler);
            OrgChart.pdfPrevUI._showHide(bgppdfformat, bgppdflayout, bgppdfscale);
        });
    });

    bgppdfscale.addEventListener('change', function(){
        OrgChart.animate(chart.element.querySelector('#boc-ppdf-content'), { opacity: 1 },  { opacity: 0 }, 300, OrgChart.anim.inSin, function(){
            chart.element.querySelector('#boc-ppdf-content').innerHTML = '';
            options.scale = bgppdfscale.value;
            chart.exportPDF(options, OrgChart.pdfPrevUI._handler);
            OrgChart.pdfPrevUI._showHide(bgppdfformat, bgppdflayout, bgppdfscale);
        });
    });

    var timeotmargin;
    bgppdfmargin.addEventListener('keyup', function(){
        clearTimeout(timeotmargin);
        timeotmargin = setTimeout(function(){
            OrgChart.animate(chart.element.querySelector('#boc-ppdf-content'), { opacity: 1 },  { opacity: 0 }, 300, OrgChart.anim.inSin, function(){
                chart.element.querySelector('#boc-ppdf-content').innerHTML = '';
                var margin = bgppdfmargin.value.split(',');
                if (margin.length == 4){
                    for(var t = 0; t < margin.length; t++){
                        margin[t] = parseInt(margin[t]);
                    }
                    options.margin = margin;
                    chart.exportPDF(options, OrgChart.pdfPrevUI._handler);
                }
            });
        }, 1000);
    });

    var timeotheader;
    bgppdfheader.addEventListener('keyup', function(){
        clearTimeout(timeotheader);
        timeotheader = setTimeout(function(){
            OrgChart.animate(chart.element.querySelector('#boc-ppdf-content'), { opacity: 1 },  { opacity: 0 }, 300, OrgChart.anim.inSin, function(){
                chart.element.querySelector('#boc-ppdf-content').innerHTML = '';
                options.header = bgppdfheader.value;
                chart.exportPDF(options, OrgChart.pdfPrevUI._handler);
            });
        }, 1000);
    });

    var timeotfooter;
    bgppdffooter.addEventListener('keyup', function(){
        clearTimeout(timeotfooter);
        timeotfooter = setTimeout(function(){
            OrgChart.animate(chart.element.querySelector('#boc-ppdf-content'), { opacity: 1 },  { opacity: 0 }, 300, OrgChart.anim.inSin, function(){
                chart.element.querySelector('#boc-ppdf-content').innerHTML = '';
                options.footer = bgppdffooter.value;
                chart.exportPDF(options, OrgChart.pdfPrevUI._handler);
            });
        }, 1000);
    });
};

OrgChart.pdfPrevUI._showHide = function(bgppdfformat, bgppdflayout, bgppdfscale){
    if (bgppdfformat.value == 'A4'
        || bgppdfformat.value == 'A3'
        || bgppdfformat.value == 'A2'
        || bgppdfformat.value == 'A1'
        || bgppdfformat.value == 'Letter'
        || bgppdfformat.value == 'Legal'){
        bgppdflayout.parentNode.style.display = 'block';
        bgppdfscale.parentNode.style.display = 'block';
    }
    else{
        bgppdflayout.parentNode.style.display = 'none';
        bgppdfscale.parentNode.style.display = 'none';
    }
};


OrgChart.pdfPrevUI._handler = function (sender, req, svg) {
    var options = req.options;
    var pages = req.pages;
    var marginTop = options.margin[0];
    var marginBottom = options.margin[2];
    var el = document.createElement('div');
    el.classList.add(sender.config.mode);
    el.innerHTML = svg.outerHTML;
    if(OrgChart._browser().msie){//fix ie 11 svg.outerHTML not supported
        el.innerHTML = new XMLSerializer().serializeToString(svg)
    }
    var newSvg = el.querySelector('svg');

    var bgppdfcontent = sender.element.querySelector('#boc-ppdf-content');
    for(var i = 0; i < pages.length; i++){
        var iframe = document.createElement('iframe');

        Object.assign(iframe.style, {
            'display': 'block', 'margin': '10px auto', 'border': '1px solid #eeeeee', 'box-shadow': '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
        });

        bgppdfcontent.appendChild(iframe);

        if (newSvg && newSvg.style.backgroundColor){
            iframe.style.backgroundColor = newSvg.style.backgroundColor;
        }
        else{
            iframe.style.backgroundColor = '#fff';
        }
        var doc = iframe.contentWindow.document;
        doc.open();



        iframe.style.width = (pages[i].size.w + 'px');
        iframe.style.height = (pages[i].size.h + 'px');
        iframe.style.margin = '10 auto';

        if (pages[i].backgroundColor){
            iframe.style.backgroundColor = pages[i].backgroundColor;
        }


        var header = options.header;
        if (pages[i].header){
            header = pages[i].header;
        }
        if (header){
            header = header.replace('{current-page}', i + 1).replace('{total-pages}', pages.length);
        }

        var footer = options.footer;
        if (pages[i].footer){
            footer = pages[i].footer;
        }
        if (footer){
            footer = footer.replace('{current-page}', i + 1).replace('{total-pages}', pages.length);
        }


        if (pages[i].html){
            doc.write(OrgChart._exportHtml(pages[i].html, req.styles, options, pages[i].innerSize.w, pages[i].innerSize.h, header, footer, sender.config.mode));
        }
        else{
            newSvg.setAttribute('viewBox', pages[i].vb);
            doc.write(OrgChart._exportHtml(el.innerHTML, req.styles, options, pages[i].innerSize.w, pages[i].innerSize.h, header, footer, sender.config.mode));
        }

        var bgheader = doc.getElementById('boc-header');
        var bgfooter = doc.getElementById('boc-footer');
        if (bgheader){
            var top = marginTop - bgheader.offsetHeight - 7;
            bgheader.style.top = top + 'px';
        }

        if (bgfooter){
            var bottom = marginBottom - bgfooter.offsetHeight - 7;
            bgfooter.style.bottom = bottom + 'px';
        }
        doc.close();
    }

    var bgppdfwrapper = sender.element.querySelector('#boc-ppdf-content');
    OrgChart.animate(bgppdfwrapper, { opacity: 0 },  { opacity: 1 }, 300, OrgChart.anim.outSin);
};


OrgChart.pdfPrevUI._getViewBox = function (svg) {
    var viewBox = null;
    if (svg) {
        viewBox = svg.getAttribute("viewBox");
        viewBox = "[" + viewBox + "]";
        viewBox = viewBox.replace(/\ /g, ",");
        viewBox = JSON.parse(viewBox);
        return viewBox;
    }
    else {
        return null;
    }
};

OrgChart._exportHtml = function(html, styles, options, w, h, header, footer, mode){
    var smargin = '';
    for(var j = 0; j < options.margin.length; j++){
        smargin += (options.margin[j] + 'px ');
    }
    var result = '<!DOCTYPE html><html style="margin:0;padding:0;"><head></head>'
        + styles
        + '<body class="boc-' + mode + '" style="margin:0; padding:0;">'
        + '<div style="margin: ' + smargin  + ';overflow:hidden;width:' + w + 'px;height:' + (h) + 'px">';

        if (header){
            result += '<div id="boc-header" style="width:' + w + 'px;color:#757575;position:absolute;left:' + options.margin[3] + 'px;top:0;">' +  header + '</div>';
        }

        result += html;

        if (footer){
            result += '<div id="boc-footer" style="width:' + w + 'px;color:#757575;position:absolute;left:' + options.margin[3] + 'px;bottom:0;">' +  footer + '</div>';
        }

    result +=  '</div>';
    result += '</body></html>';

    return result;
}


OrgChart.pdfPrevUI.hide = function (chart) {
    var bgppdfwrapper = chart.element.querySelector('#boc-ppdf-wrapper');

    if (bgppdfwrapper){
        bgppdfwrapper.parentNode.removeChild(bgppdfwrapper);
        bgppdfwrapper.style.opacity = 0;
        var bgppdfbtns = chart.element.querySelector('#boc-ppdf-btns');
        bgppdfbtns.parentNode.removeChild(bgppdfbtns);


        // OrgChart.animate(bgppdfwrapper, {opacity: 1}, {opacity: 0}, 300, OrgChart.anim.inSin, function(){
        //     bgppdfwrapper.parentNode.removeChild(bgppdfwrapper);
        //     var bgppdfbtns = chart.element.querySelector('#boc-ppdf-btns');
        //     OrgChart.animate(bgppdfbtns, {margin: [0,0,0,0]}, {margin: [0,0,0,-280]}, 300, OrgChart.anim.inSin, function(){
        //         bgppdfbtns.parentNode.removeChild(bgppdfbtns);
        //     });
        // });
    }
};


if (typeof (OrgChart) == "undefined") {
    OrgChart = {};
}

OrgChart.events.on('renderdefs', function(sender, args){
    for (var i = 0; i < sender.config.clinks.length; i++) {
        var clink = sender.config.clinks[i];
        var templateName = clink.template;
        if (!templateName){
            templateName = 'orange';
        }
        var t = OrgChart.clinkTemplates[templateName];
        args.defs += t.defs;
    }
});



OrgChart.events.on('render', function(sender, args){
    sender._clink(sender, args);
});


OrgChart.prototype._clink = function(sender, args){
    var html = '';
    for (var i = 0; i < this.config.clinks.length; i++) {
        var clink = this.config.clinks[i];

        var fromnode = sender.getNode(clink.from);
        var tonode = sender.getNode(clink.to);

        if (!fromnode || args.res.visibleNodeIds.indexOf(fromnode.id) == -1){
            continue;
        }

        if (!tonode || args.res.visibleNodeIds.indexOf(tonode.id) == -1){
            continue;
        }

        var from_x = fromnode.x;
        var from_y = fromnode.y;

        var to_x = tonode.x;
        var to_y = tonode.y;

        var a = { };
        var b = { };

        var c_fromnode_x = (from_x + fromnode.w / 2);
        var c_tonode_x = (to_x + tonode.w / 2);
        var c_fromnode_y = (from_y + fromnode.h / 2);
        var c_tonode_y = (to_y + tonode.h / 2);

        var left = 1;

        switch (this.config.orientation) {
            case OrgChart.orientation.top:
            case OrgChart.orientation.top_left:
                if (c_fromnode_x <= c_tonode_x){
                    left = 1;
                    a.x = c_fromnode_x + fromnode.w / 10;
                    b.x = c_tonode_x - tonode.w / 10;
                }
                else{
                    left = -1;
                    a.x = c_fromnode_x - fromnode.w / 10;
                    b.x = c_tonode_x + tonode.w / 10;
                }

                if (from_y == to_y){
                    left = 1;
                    a.y = from_y;
                    b.y = to_y;
                }
                else if (from_y > to_y){
                    a.y = from_y;
                    b.y = to_y + tonode.h;
                }
                else{
                    a.y = from_y + fromnode.h;
                    b.y = to_y;
                }
                break;
            case OrgChart.orientation.bottom:
            case OrgChart.orientation.bottom_left:
                if (c_fromnode_x <= c_tonode_x){
                    left = -1;
                    a.x = c_fromnode_x + fromnode.w / 10;
                    b.x = c_tonode_x + tonode.w / 10;
                }
                else{
                    left = 1;
                    a.x = c_fromnode_x - fromnode.w / 10;
                    b.x = c_tonode_x + tonode.w / 10;
                }

                if (from_y == to_y){
                    left = -1;
                    a.y = from_y + fromnode.h;
                    b.y = to_y + tonode.h;
                }
                else if (from_y > to_y){
                    a.y = from_y;
                    b.y = to_y + tonode.h;
                }
                else{
                    a.y = from_y + fromnode.h;
                    b.y = to_y;
                }
                break;
            case OrgChart.orientation.left:
            case OrgChart.orientation.left_top:
                if (c_fromnode_y <= c_tonode_y){
                    left = -1;
                    a.y = c_fromnode_y + fromnode.h / 5;
                    b.y = c_tonode_y + tonode.h / 5;
                }
                else{
                    left = 1;
                    a.y = c_fromnode_y - fromnode.h / 5;
                    b.y = c_tonode_y + tonode.h / 5;
                }

                if (from_x == to_x){
                    left = -1;
                    a.x = from_x;
                    b.x = to_x;
                }
                else if (from_x > to_x){
                    a.x = from_x;
                    b.x = to_x + tonode.w;
                }
                else{
                    a.x = from_x + fromnode.w;
                    b.x = to_x;
                }
                break;
            case OrgChart.orientation.right:
            case OrgChart.orientation.right_top:
                if (c_fromnode_y <= c_tonode_y){
                    left = 1;
                    a.y = c_fromnode_y + fromnode.h / 5;
                    b.y = c_tonode_y + tonode.h / 5;
                }
                else{
                    left = -1;
                    a.y = c_fromnode_y - fromnode.h / 5;
                    b.y = c_tonode_y + tonode.h / 5;
                }

                if (from_x == to_x){
                    left = 1;
                    a.x = from_x + fromnode.w;
                    b.x = to_x + tonode.w;
                }
                else if (from_x > to_x){
                    a.x = from_x;
                    b.x = to_x + tonode.w;
                }
                else{
                    a.x = from_x + fromnode.w;
                    b.x = to_x;
                }
            break;
        }

        function findD(A, B, left){ // if left = 1 the D is left of the line AB
            if (left == undefined){
                left = 1;
            }
            var nx = B.x - A.x;
            var ny = B.y - A.y;
            var dist = Math.sqrt(Math.pow((B.x - A.x), 2) + Math.pow((B.y - A.y), 2)) / 3;
            dist = dist / (Math.sqrt(nx * nx + ny * ny) * left) * OrgChart.CLINK_CURVE;
            return {
                x : A.x + nx / 2 - ny * dist,
                y : A.y + ny / 2 + nx * dist
            }
        }

        function findM(A, B, C){ // if left = 1 the D is left of the line AB
            var abx = (B.x - A.x) / 2 + A.x;
            var aby = (B.y - A.y) / 2 + A.y;

            return{
                x: (abx - C.x) / 2 + C.x,
                y: (aby - C.y) / 2 + C.y
            }
        }

        var c = findD(a, b, left);

        var templateName = clink.template;
        if (!templateName){
            templateName = 'orange';
        }
        var t = OrgChart.clinkTemplates[templateName];

        var m = findM(a, b, c);

        if (clink.label){
            html += t.label
                .replace('{x}', m.x)
                .replace('{y}', m.y)
                .replace('{val}', clink.label);
        }


        var d = 'M' + a.x + ',' + a.y + 'C' + a.x + ',' + a.y + ' ' + c.x + ',' + c.y + ' ' + b.x + ',' + b.y;
        html += ('<g ' + OrgChart.attr.c_link_from + '="{from}" ' + OrgChart.attr.c_link_to + '="{to}">')
            .replace("{from}", fromnode.id)
            .replace("{to}", tonode.id)
            + t.link.replaceAll('{d}', d)
            + '<path stroke="transparent" stroke-width="15" fill="none" d="' + d + '" />';


        html += OrgChart.grCloseTag;
    }

    args.content += html;
};


OrgChart.prototype.addClink = function(from, to, label, template){
    this.removeClink(from, to);
    this.config.clinks.push({
        from: from,
        to: to,
        label: label,
        template: template
    });
    return this;
};

OrgChart.prototype.removeClink = function(from, to){
    for(var i = this.config.clinks.length - 1; i >= 0; i--){
        var clink = this.config.clinks[i];
        if (clink.from == from && clink.to == to){
            this.config.clinks.splice(i, 1);
        }
    }
    return this;
};

OrgChart.clinkTemplates = {};

OrgChart.clinkTemplates.orange = {
    defs: '<marker id="arrowOrange" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path fill="#F57C00" d="M 0 0 L 10 5 L 0 10 z" /></marker><marker id="dotOrange" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5"> <circle cx="5" cy="5" r="5" fill="#F57C00" /></marker>',
    link: '<path marker-start="url(#dotOrange)" marker-end="url(#arrowOrange)" stroke="#F57C00" stroke-width="2" fill="none" d="{d}" />',
    label: '<text fill="#F57C00" text-anchor="middle" x="{x}" y="{y}">{val}</text>'
};

OrgChart.clinkTemplates.blue = {
    defs: '<marker id="arrowBlue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path fill="#039BE5" d="M 0 0 L 10 5 L 0 10 z" /></marker><marker id="dotBlue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5"> <circle cx="5" cy="5" r="5" fill="#039BE5" /></marker>',
    link: '<path marker-start="url(#dotBlue)" marker-end="url(#arrowBlue)" stroke="#039BE5" stroke-width="2" fill="none" d="{d}" />',
    label: '<text fill="#039BE5"  text-anchor="middle" x="{x}" y="{y}">{val}</text>'
};

OrgChart.clinkTemplates.yellow = {
    defs: '<marker id="arrowYellow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path fill="#FFCA28" d="M 0 0 L 10 5 L 0 10 z" /></marker><marker id="dotYellow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5"> <circle cx="5" cy="5" r="5" fill="#FFCA28" /></marker>',
    link: '<path marker-start="url(#dotYellow)" marker-end="url(#arrowYellow)" stroke="#FFCA28" stroke-width="2" fill="none" d="{d}" />',
    label: '<text fill="#FFCA28"  text-anchor="middle" x="{x}" y="{y}">{val}</text>'
};



if (typeof (OrgChart) == "undefined") {
    OrgChart = {};
}

OrgChart.events.on('renderdefs', function(sender, args){
    for (var i = 0; i < sender.config.slinks.length; i++) {
        var slink = sender.config.slinks[i];
        var templateName = slink.template;
        if (!templateName){
            templateName = 'orange';
        }
        var t = OrgChart.slinkTemplates[templateName];
        args.defs += t.defs;
    }
});


OrgChart.events.on('render', function(sender, args){
    sender._slinks(sender, args);
});

OrgChart.prototype._slinks = function (sender, args) {
    var html = '';

    var scale = this.getScale();
    var boundary = args.res.boundary;

    function _findM(p1, p2){
        return {
            x: (p1[0] + p2[0]) / 2,
            y: (p1[1] + p2[1]) / 2
        };
    }

    function _slinks(fromnode, tonode, reverse){
        var path = [];
        var parentNode = null;
        var align = "left";

        var configName = fromnode.lcn ? fromnode.lcn : "base";
        var layoutConfig = sender._layoutConfigs[configName];


        switch (layoutConfig.orientation) {
            case OrgChart.orientation.top:
            case OrgChart.orientation.top_left:
            case OrgChart.orientation.bottom:
            case OrgChart.orientation.bottom_left:
                if (tonode.x > fromnode.x) {
                    align = "right";
                }
                break;
            case OrgChart.orientation.left:
            case OrgChart.orientation.left_top:
            case OrgChart.orientation.right:
            case OrgChart.orientation.right_top:
                align = "top";
                if (tonode.y > fromnode.y) {
                    align = "bottom";
                }
                break;
        }

        var t = OrgChart.t(fromnode.templateName, fromnode.min, scale);
        var separation = layoutConfig.levelSeparation;
        if ((fromnode.parent && fromnode.parent.layout == OrgChart.mixed) || (fromnode.parent && fromnode.parent.layout == OrgChart.tree)) {
            separation = layoutConfig.mixedHierarchyNodesSeparation;
        }
        var point = {
            p: fromnode.x + fromnode.w / 2 + t.expandCollapseSize,
            q: fromnode.y,
            r: fromnode.x + fromnode.w / 2 + t.expandCollapseSize,
            s: boundary.minY + separation
        };

        var fromnodeLevel = fromnode.level;
        if (fromnode.subLevels){
            fromnodeLevel += fromnode.subLevels;
        }

        var tonodeLevel = tonode.level;
        if (tonode.subLevels){
            tonodeLevel += tonode.subLevels;
        }
        if (fromnodeLevel == tonodeLevel){
            parentNode = tonode;
            switch (layoutConfig.orientation) {
                case OrgChart.orientation.top:
                case OrgChart.orientation.top_left:
                    path.push([point.p, point.q]);
                    path.push([point.p, point.q - separation / 3]);
                    t = OrgChart.t(parentNode.templateName, parentNode.min, scale);
                    path.push([parentNode.x + parentNode.w / 2 + t.expandCollapseSize, path[path.length - 1][1]]);
                    path.push([path[path.length - 1][0], parentNode.y]);
                break;
                case OrgChart.orientation.bottom:
                case OrgChart.orientation.bottom_left:
                    point.q = fromnode.y + fromnode.h;
                    point.s = boundary.maxY - separation;
                    path.push([point.p, point.q]);
                    path.push([point.r, fromnode.y + fromnode.h + separation / 3]);
                    t = OrgChart.t(parentNode.templateName, parentNode.min, scale);
                    path.push([parentNode.x + parentNode.w / 2 + t.expandCollapseSize, path[path.length - 1][1]]);
                    path.push([path[path.length - 1][0], parentNode.y + parentNode.h]);
                    break;
                case OrgChart.orientation.left:
                case OrgChart.orientation.left_top:
                    point.p = fromnode.x;
                    point.q = fromnode.y + fromnode.h / 2 + t.expandCollapseSize;
                    point.r = boundary.minX - separation;
                    point.s = fromnode.y + fromnode.h / 2 + t.expandCollapseSize;
                    path.push([point.p, point.q]);
                    path.push([fromnode.x - separation / 3, point.q]);
                    t = OrgChart.t(parentNode.templateName, parentNode.min, scale);
                    path.push([path[path.length - 1][0], parentNode.y + parentNode.h / 2 + t.expandCollapseSize]);
                    path.push([parentNode.x, path[path.length - 1][1]]);
                    break;
                case OrgChart.orientation.right:
                case OrgChart.orientation.right_top:
                    point.p = fromnode.x + fromnode.w;
                    point.q = fromnode.y + fromnode.h / 2 + t.expandCollapseSize;
                    point.r = boundary.maxX + separation;
                    point.s = fromnode.y + fromnode.h / 2 + t.expandCollapseSize;
                    path.push([point.p, point.q]);
                    path.push([fromnode.x + fromnode.w + separation / 3, point.q]);
                    t = OrgChart.t(parentNode.templateName, parentNode.min, scale);
                    path.push([path[path.length - 1][0], parentNode.y + parentNode.h / 2 + t.expandCollapseSize]);
                    path.push([parentNode.x + parentNode.w, path[path.length - 1][1]]);
                    break;
            }
        }
        else{
            switch (layoutConfig.orientation) {
                case OrgChart.orientation.top:
                case OrgChart.orientation.top_left:
                    path.push([point.p, point.q]);
                    path.push([point.r, fromnode.y - separation / 3]);
                    break;
                case OrgChart.orientation.bottom:
                case OrgChart.orientation.bottom_left:
                    point.q = fromnode.y + fromnode.h;
                    point.s = boundary.maxY - separation;
                    path.push([point.p, point.q]);
                    path.push([point.r, fromnode.y + fromnode.h + separation / 3]);
                    break;
                case OrgChart.orientation.left:
                case OrgChart.orientation.left_top:
                    point.p = fromnode.x;
                    point.q = fromnode.y + fromnode.h / 2 + t.expandCollapseSize;
                    point.r = boundary.minX - separation;
                    point.s = fromnode.y + fromnode.h / 2 + t.expandCollapseSize;
                    path.push([point.p, point.q]);
                    path.push([fromnode.x - separation / 3, point.q]);
                    break;
                case OrgChart.orientation.right:
                case OrgChart.orientation.right_top:
                    point.p = fromnode.x + fromnode.w;
                    point.q = fromnode.y + fromnode.h / 2 + t.expandCollapseSize;
                    point.r = boundary.maxX + separation;
                    point.s = fromnode.y + fromnode.h / 2 + t.expandCollapseSize;
                    path.push([point.p, point.q]);
                    path.push([fromnode.x + fromnode.w + separation / 3, point.q]);
                    break;
            }

            var n = fromnode;

            while (parentNode == null) {
                var hasIntersect = false;
                var pn = n.parent;

                var ln = pn.leftNeighbor;
                var rn = pn.rightNeighbor;

                if (pn.id == tonode.id) {
                    parentNode = pn;
                }
                else if (OrgChart._intersects(pn, point, sender.config)) {
                    point = OrgChart._addPoint(pn, path, sender.config, point, align);
                    hasIntersect = true;
                }

                if (pn.id != tonode.id) {
                    while (ln) {
                        if (ln.id == tonode.id) {
                            parentNode = ln;
                            break;
                        }
                        if (OrgChart._intersects(ln, point, sender.config)) {
                            point = OrgChart._addPoint(ln, path, sender.config, point, align);
                            hasIntersect = true;
                        }
                        ln = ln.leftNeighbor;
                    }

                    while (rn) {
                        if (rn.id == tonode.id) {
                            parentNode = rn;
                            break;
                        }
                        if (OrgChart._intersects(rn, point, sender.config)) {
                            point = OrgChart._addPoint(rn, path, sender.config, point, align);
                            hasIntersect = true;
                        }
                        rn = rn.rightNeighbor;
                    }
                }


                if (!hasIntersect) {
                    var x = path[path.length - 1][0];
                    var y = 0;
                    if (pn.parent) {
                        separation = layoutConfig.levelSeparation;
                        if (pn.parent.layout == OrgChart.mixed || pn.parent.layout == OrgChart.tree) {
                            separation = layoutConfig.mixedHierarchyNodesSeparation;
                        }

                        switch (layoutConfig.orientation) {
                            case OrgChart.orientation.top:
                            case OrgChart.orientation.top_left:
                                y = pn.parent.y + pn.parent.h + separation * (2 / 3);
                                break;
                            case OrgChart.orientation.bottom:
                            case OrgChart.orientation.bottom_left:
                                y = pn.parent.y - separation * (2 / 3);
                                break;
                            case OrgChart.orientation.left:
                            case OrgChart.orientation.left_top:
                                x = pn.parent.x + pn.parent.w + separation * (2 / 3);
                                y = path[path.length - 1][1];
                                break;
                            case OrgChart.orientation.right:
                            case OrgChart.orientation.right_top:
                                x = pn.parent.x - separation * (2 / 3);
                                y = path[path.length - 1][1];
                                break;
                        }
                    }

                    path.push([x, y]);
                }
                n = pn;
            }

            t = OrgChart.t(parentNode.templateName, parentNode.min, scale);

            path.splice(path.length - 1, 1);
            switch (layoutConfig.orientation) {
                case OrgChart.orientation.top:
                case OrgChart.orientation.top_left:
                    path.push([parentNode.x + parentNode.w / 2 + t.expandCollapseSize, path[path.length - 1][1]]);
                    path.push([path[path.length - 1][0], parentNode.y + parentNode.h]);
                    break;
                case OrgChart.orientation.bottom:
                case OrgChart.orientation.bottom_left:
                    path.push([parentNode.x + parentNode.w / 2 + t.expandCollapseSize, path[path.length - 1][1]]);
                    path.push([path[path.length - 1][0], parentNode.y]);
                    break;
                case OrgChart.orientation.left:
                case OrgChart.orientation.left_top:
                    path.push([path[path.length - 1][0], parentNode.y + parentNode.h / 2 + t.expandCollapseSize]);
                    path.push([parentNode.x + parentNode.w, path[path.length - 1][1]]);
                    break;
                case OrgChart.orientation.right:
                case OrgChart.orientation.right_top:
                    path.push([path[path.length - 1][0], parentNode.y + parentNode.h / 2 + t.expandCollapseSize]);
                    path.push([parentNode.x, path[path.length - 1][1]]);
                    break;
            }
        }

        var templateName = slink.template;
        if (!templateName){
            templateName = 'orange';
        }
        var t = OrgChart.slinkTemplates[templateName];

        var m = null;

        switch(t.labelPosition){
            case 'start':{
                m = { x: path[1][0], y: path[1][1] };
                break;
            }
            case 'middle':{
                var mPointIndex = Math.ceil(path.length / 2);
                m = _findM(path[mPointIndex], path[mPointIndex - 1]);
                break;
            }
            case 'end':{
                m = { x: path[path.length - 2][0], y: path[path.length - 2][1] };
                break;
            }
        }

        if (reverse){
            path = path.reverse();
        }

        path[0] = "M" + path[0].join(",");

        for (var j = 1; j < path.length; j++) {
            path[j] = "L" + path[j].join(",");
        }

        var pathStr = path.join(" ");

        if (slink.label){
            var testLlabel = t.label
                .replace('{x}', m.x)
                .replace('{y}', m.y)
                .replace('{val}', slink.label);

            var rect = OrgChart._getLabelSize(testLlabel);

            var adjustLabelY = - (rect.height / 2);

            switch (layoutConfig.orientation) {
                case OrgChart.orientation.bottom:
                case OrgChart.orientation.bottom_left:
                    adjustLabelY = rect.height;
                    break;
            }

            html += t.label
                .replace('{x}', m.x)
                .replace('{y}', m.y + adjustLabelY)
                .replace('{val}', slink.label);
        }

        html += ('<g ' + OrgChart.attr.s_link_from + '="{from}" ' + OrgChart.attr.s_link_to + '="{to}">')
            .replace("{from}", fromnode.id)
            .replace("{to}", tonode.id)
            + t.link.replaceAll("{d}", pathStr)
            + '<path stroke="transparent" stroke-width="15" fill="none" d="' + pathStr + '" />';



        html += OrgChart.grCloseTag;
    }


    for (var i = 0; i < this.config.slinks.length; i++) {
        var slink = this.config.slinks[i];

        var fromnode = sender.getNode(slink.from);
        var tonode = sender.getNode(slink.to);

        if (fromnode && tonode && args.res.visibleNodeIds.indexOf(tonode.id) != -1 && args.res.visibleNodeIds.indexOf(fromnode.id) != -1){
            if (fromnode.level >= tonode.level){
                _slinks(fromnode, tonode, false);
            }
            else{
                _slinks(tonode, fromnode, true);
            }
        }
    }

    args.content += html;
};

OrgChart.prototype.addSlink = function(from, to, label, template){
    this.removeClink(from, to);
    this.config.slinks.push({
        from: from,
        to: to,
        label: label,
        template: template
    });
    return this;
};

OrgChart.prototype.removeSlink = function(from, to){
    for(var i = this.config.slinks.length - 1; i >= 0; i--){
        var slink = this.config.slinks[i];
        if (slink.from == from && slink.to == to){
            this.config.slinks.splice(i, 1);
        }
    }
    return this;
};

OrgChart.slinkTemplates = {};

OrgChart.slinkTemplates.orange = {
    defs: '<marker id="arrowSlinkOrange" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path fill="#F57C00" d="M 0 0 L 10 5 L 0 10 z" /></marker><marker id="dotSlinkOrange" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5"> <circle cx="5" cy="5" r="5" fill="#F57C00" /></marker>',
    link: '<path stroke-dasharray="4, 2" marker-start="url(#dotSlinkOrange)" marker-end="url(#arrowSlinkOrange)" stroke-linejoin="round" stroke="#F57C00" stroke-width="2" fill="none" d="{d}" />',
    label: '<text dominant-baseline="middle" fill="#F57C00" alignment-baseline="middle" text-anchor="middle" x="{x}" y="{y}">{val}</text>',
    labelPosition: 'middle'
};

OrgChart.slinkTemplates.blue = {
    defs: '<marker id="arrowSlinkBlue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path fill="#039BE5" d="M 0 0 L 10 5 L 0 10 z" /></marker><marker id="dotSlinkBlue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5"> <circle cx="5" cy="5" r="5" fill="#039BE5" /></marker>',
    link: '<path stroke-dasharray="4, 2" marker-start="url(#dotSlinkBlue)" marker-end="url(#arrowSlinkBlue)" stroke-linejoin="round" stroke="#039BE5" stroke-width="2" fill="none" d="{d}" />',
    label: '<text fill="#039BE5" text-anchor="middle" x="{x}" y="{y}">{val}</text>',
    labelPosition: 'middle'
};

OrgChart.slinkTemplates.yellow = {
    defs: '<marker id="arrowSlinkYellow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path fill="#FFCA28" d="M 0 0 L 10 5 L 0 10 z" /></marker><marker id="dotSlinkYellow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5"> <circle cx="5" cy="5" r="5" fill="#FFCA28" /></marker>',
    link: '<path stroke-dasharray="4, 2" marker-start="url(#dotSlinkYellow)" marker-end="url(#arrowSlinkYellow)" stroke-linejoin="round" stroke="#FFCA28" stroke-width="2" fill="none" d="{d}" />',
    label: '<text  fill="#FFCA28" text-anchor="middle" x="{x}" y="{y}">{val}</text>',
    labelPosition: 'middle'
};







OrgChart.events.on('redraw', function(sender, args){
  if (!sender.config.miniMap){
    return;
  }
  var canvas = OrgChart.miniMap._getCanvas(sender);
  var ctx = canvas.getContext("2d");

  //start reset scale, translation and other...
  canvas.width = canvas.width;
  canvas.height = canvas.height;
  //end

  var width = (sender.response.boundary.maxX - sender.response.boundary.minX);
  var height = (sender.response.boundary.maxY - sender.response.boundary.minY);

  var scale = Math.min(canvas.width / width, canvas.height / height);
  var adjustX = (canvas.width - (width * scale)) / 2; //find the center
  var adjustY = (canvas.height - (height * scale)) / 2; //find the center
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(-sender.response.boundary.minX * scale + adjustX, -sender.response.boundary.minY * scale + adjustY);
  ctx.scale(scale, scale);

  var subTreeLevel = 0;
 // var drawnNodes = [];
  var checkedLevel = [];
  function iterate(c, n){

    if (Array.isArray(n)){
      for(var i = 0; i < n.length; i++){
        iterate(c, n[i])
      }
      return;
    }

    ctx.fillStyle = OrgChart.miniMap.colors[3];
    ctx.beginPath();
    ctx.lineWidth = "0.5";
    ctx.fillRect(n.x, n.y, n.w, n.h);
    ctx.strokeRect(n.x, n.y, n.w, n.h);

    for(var i = 0; i < n.stChildrenIds.length; i++){
      subTreeLevel++;
      if (!checkedLevel.includes(n.id)) {

        if (subTreeLevel == 1 ) {
          ctx.fillStyle = OrgChart.miniMap.colors[0];
        }
        else if (subTreeLevel == 2 ) {
          ctx.fillStyle = OrgChart.miniMap.colors[1];
        }

        else if (subTreeLevel == 3 ) {
          ctx.fillStyle = OrgChart.miniMap.colors[2];
       }

       ctx.beginPath();
       ctx.fillRect(n.x, n.y, n.w, n.h);
       ctx.strokeRect(n.x, n.y, n.w, n.h);
       checkedLevel.push(n.id);

      }

      iterate(c, c.getNode(n.stChildrenIds[i]));
      subTreeLevel--;
    }

    for(var i = 0; i < n.childrenIds.length; i++){
      iterate(c, c.getNode(n.childrenIds[i]))
    }
  }

  iterate(sender, sender.roots);



  var x = sender.getViewBox()[0];
  var y = sender.getViewBox()[1];
  var w = sender.getViewBox()[2];
  var h = sender.getViewBox()[3];
  ctx.lineWidth = 0.5 / scale;
  ctx.strokeStyle = "#f57c00";
  ctx.strokeRect(x, y, w, h);
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = OrgChart.miniMap.selectorBackgroundColor;
  ctx.fillRect(x, y, w, h);

});


OrgChart.miniMap = {};
OrgChart.miniMap._getCanvas = function(sender){
var canvas = sender.element.querySelector('[' + OrgChart.attr.id + '="mini-map"]');

if (!canvas){

  var canvas = document.createElement('canvas');
  canvas.width = 250;
  canvas.height = 140;
  canvas.setAttribute(OrgChart.attr.id, 'mini-map');
  canvas.style.display = 'inline-block';
  canvas.style.backgroundColor = OrgChart.miniMap.backgroundColor;

  var canvasContent = document.createElement("div");
  canvasContent.classList.add("mini-map");
  canvasContent.style.position = 'absolute';
  canvasContent.style.bottom = '10px';
  canvasContent.style.left = '10px';
  canvasContent.style.border = '1px solid #aeaeae';
  canvasContent.style.padding = '5px';
  canvasContent.style.margin = sender.config.padding +'px';
  canvasContent.style.backgroundColor = OrgChart.miniMap.backgroundColor;
  canvasContent.appendChild(canvas);
  sender.element.appendChild(canvasContent);
}

return canvas;

}

OrgChart.miniMap.colors = ["#E0E0E0", "#BDBDBD", "#9E9E9E", "#757575"];
OrgChart.miniMap.selectorBackgroundColor = "white";
OrgChart.miniMap.backgroundColor = "white";

OrgChart._search = {};

OrgChart._search.search = function(dataArray, search, searchInFileds, retrieveFields, searchDisplayField, searchFieldsWeight){
    var result = [];
    var searchLower = search.toLowerCase();
    var searchPhrases = searchLower.split(' ');


    searchPhrases = searchPhrases.filter(function (value, currentIndex, self) {
        return self.indexOf(value) === currentIndex;
      });

    var id___score = {};
    for(var i = 0; i < dataArray.length; i++){
        var data = dataArray[i];
        for (var j = 0; j < searchInFileds.length; j++){
            var __searchInFiled = searchInFileds[j];
            if (!OrgChart.isNEU(data[__searchInFiled])){
                var value = data[__searchInFiled];
                var search = OrgChart._search.searchAndComputeScore(searchPhrases, value, __searchInFiled, searchFieldsWeight);
                if (search != null){
                    var id = data.id;
                    if (!id___score[id]){
                        id___score[id] = search.__score;
                        OrgChart._search.addNodeToResult(result, retrieveFields, data, search, __searchInFiled, searchDisplayField);
                    }
                    else if (id___score[id] && id___score[id] < search.__score){
                        id___score[id] = search.__score;
                        for(var  z = result.length - 1;  z >=0 ; z--){
                            if (result[z].id == id){
                                result.splice(z, 1);
                            }
                        }
                        OrgChart._search.addNodeToResult(result, retrieveFields, data, search, __searchInFiled, searchDisplayField);
                    }
                }
            }
        }
    }

    result.sort( function ( a, b ) {
        if ( a.__score < b.__score ){
          return 1;
        }
        if ( a.__score > b.__score ){
          return -1;
        }
        return 0;
      } );

      return result;
};

OrgChart._search.addNodeToResult = function(result, retrieveFields, data, search, __searchFiled, searchDisplayField){
    var resultNode = {};
    resultNode['id'] = data['id'];
    if(!OrgChart.isNEU(data[searchDisplayField])){
        resultNode[searchDisplayField] = data[searchDisplayField];
    }

    for (var  i = 0; i < retrieveFields.length; i++) {
        var retrieveField = retrieveFields[i];
        if (!OrgChart.isNEU(data[retrieveField])){
            if (OrgChart.isNEU(resultNode[retrieveField])){
                resultNode[retrieveField] = data[retrieveField];
            }
        }
    }

    if (search != null){
        if (OrgChart.isNEU(resultNode['__score'])){
            resultNode['__score']= search.__score;
        }
        if (OrgChart.isNEU(resultNode['__searchField'])){
            resultNode['__searchField']= __searchFiled;
        }
        if (OrgChart.isNEU(resultNode['__searchMarks'])){
            resultNode['__searchMarks']= search.__searchMarks;
        }
    }

    result.push(resultNode);
}

OrgChart._search.searchAndComputeScore = function(searchPhrases, searchIn, fieldName, searchFieldsWeight){
    if (OrgChart.isNEU(searchIn))
    {
        return null;
    }
    if (OrgChart.isNEU(searchPhrases))
    {
        return null;
    }
    if (!searchPhrases.length)
    {
        return null;
    }

    if (typeof(searchIn) != 'string'){
        searchIn = searchIn.toString();
    }

    var searchInLower = searchIn.toLowerCase();
    var indexes = OrgChart._search.searchIndexesOf(searchInLower, searchPhrases);

    if (!indexes.length){
        return null;
    }


    var onePercent = searchInLower.length / 100;
    var sumMathces = 0;
    var minStart = 0;
    var orderPercentWeight = sumMathces > 0 ? 100 : 0;

    if (indexes.length){
        minStart = indexes[0].start;
        for(var i = 0; i < indexes.length; i++){
            sumMathces += indexes[i].length;
            if (indexes[i].start < minStart){
                minStart = indexes[i].start;
            }
            if (i >= 1 && indexes[i - 1].start > indexes[i].start){
                orderPercentWeight = 0;
                break;
            }
        }
    }
    var lengthPercentWeight = 0;
    if (sumMathces != 0){
        lengthPercentWeight = (sumMathces / onePercent);
    }

    var minStartPercentWeight = sumMathces > 0 ? 100 : 0;
    if (minStart != 0)
    {
        minStartPercentWeight = 100 - (minStart / onePercent);
    }

    var filedNamePercentWeight = 0;
    if (searchFieldsWeight && searchFieldsWeight[fieldName]){
        filedNamePercentWeight = searchFieldsWeight[fieldName];
    }

    if (lengthPercentWeight > 0)
    {
        lengthPercentWeight = lengthPercentWeight / 100 * 20;
    }
    if (minStartPercentWeight > 0)
    {
        minStartPercentWeight = minStartPercentWeight / 100 * 20;
    }
    if (orderPercentWeight > 0)
    {
        orderPercentWeight = orderPercentWeight / 100 * 20;
    }
    if (filedNamePercentWeight > 0)
    {
        filedNamePercentWeight = filedNamePercentWeight / 100 * 40;
    }

    var __score = parseInt(lengthPercentWeight + minStartPercentWeight + orderPercentWeight + filedNamePercentWeight);


    if (__score > 100)
    {
        __score = 100;
    }


    indexes.sort( function ( a, b ) {
        if ( a.start < b.start ){
            return -1;
        }
          if ( a.start > b.start ){
            return 1;
        }
        return 0;
      } );

    var __searchMarks = searchIn;
    for (var i = indexes.length - 1; i >= 0; i--)
    {
        __searchMarks = __searchMarks.insert(indexes[i].start + indexes[i].length, "</mark>");
        __searchMarks = __searchMarks.insert(indexes[i].start, "<mark>");
    }


    return {
        __searchMarks:  __searchMarks,
        __score: __score
    };
}

OrgChart._search.searchIndexesOf = function(str, values){
    var indexes = [];
    if (!OrgChart.isNEU(str))
    {
        for (var m = 0; m < values.length; m++)
        {
            var value = values[m];
            if (!OrgChart.isNEU(value))
            {
                var tempIndex = 0;
                while (true)
                {
                    tempIndex = str.indexOf(value, tempIndex);
                    if (tempIndex > -1){
                        indexes.push(
                            {
                                length: value.length,
                                start: tempIndex
                            });
                        tempIndex += value.length;
                    }
                    else
                    {
                        break;
                    }
                }
            }

        }
    }


    indexes.sort( function ( a, b ) {
        if ( a.length < b.length ){
          return 1;
        }
        if ( a.length > b.length ){
          return -1;
        }
        if ( a.start < b.start ){
            return -1;
        }
          if ( a.start > b.start ){
            return 1;
        }
        return 0;
      } );


      indexes = indexes.filter(function (current){
                        var alredyExist = false;
                        for(var i = 0; i < indexes.length; i++){
                            var start = indexes[i].start;
                            var end = indexes[i].start + indexes[i].length - 1;

                            var startNew = current.start;
                            var endNew = current.start + current.length - 1;


                            if (start == startNew && end == endNew){
                                alredyExist = false;
                                break;
                            }

                            if (start >= startNew && end <= endNew){
                                alredyExist = true;
                                break;
                            }

                            else if (start <= startNew && end >= endNew){
                                alredyExist = true;
                                break;
                            }
                        }
                        return !alredyExist;

        });

    return indexes;
}
OrgChart.events.on('redraw', function(sender, args){
    if (!sender.config.state){
        return;
    }

    var exp = [];
    var min = [];
    function iterate(n){
        if (Array.isArray(n)){
            for(var i = 0; i < n.length; i++){
                iterate(n[i])
            }
            return;
        }

        if (typeof(n.id) != 'string' || (typeof(n.id) == 'string' && n.id.indexOf('split') == -1 && n.id.indexOf('mirror') == -1)){
            exp.push(n.id);
            if (n.min == true){
                min.push(n.id);
            }
        }

        for(var i = 0; i < n.stChildren.length; i++){
            iterate(n.stChildren[i])
        }

        for(var i = 0; i < n.children.length; i++){
            iterate(n.children[i])
        }
    }

    iterate(sender.roots);

    OrgChart.state._put(sender.width(),
        sender.height(),
        sender.response.viewBox,
        exp,
        min,
        sender.response.adjustify,
        sender.config.state);
});


OrgChart.state = {};


OrgChart.state._buildStateNames = function(name){
    return{
        paramScale: name + '-scale',
        paramX: name + '-x',
        paramY: name + '-y',
        paramExp: name + '-exp',
        paramMin: name + '-min',
        paramAdjustify: name + '-adjustify'
    }
}


OrgChart.state._put = function(w, h, vb, exp, min , adjustify, state){
    if (!state){
        return;
    }

    var sn = OrgChart.state._buildStateNames(state.name);
    var stateParams = {
        scale: Math.min(w / vb[2], h / vb[3]),
        x: vb[0],
        y: vb[1],
        exp: exp,
        min: min,
        adjustify: adjustify
    };

    if (state.writeToUrlParams){
        var urlSearchParams = new URLSearchParams(window.location.search);
        if (urlSearchParams.has(sn.paramScale)){
            urlSearchParams.set(sn.paramScale, stateParams.scale);
        }
        else{
            urlSearchParams.append(sn.paramScale, stateParams.scale);
        }

        if (urlSearchParams.has(sn.paramX)){
            urlSearchParams.set(sn.paramX, stateParams.x);
        }
        else{
            urlSearchParams.append(sn.paramX, stateParams.x);
        }

        if (urlSearchParams.has(sn.paramY)){
            urlSearchParams.set(sn.paramY, stateParams.y);
        }
        else{
            urlSearchParams.append(sn.paramY, stateParams.y);
        }
        if (urlSearchParams.has(sn.paramExp)){
            urlSearchParams.set(sn.paramExp, stateParams.exp.join('*'));
        }
        else{
            urlSearchParams.append(sn.paramExp, stateParams.exp.join('*'));
        }

        if (urlSearchParams.has(sn.paramMin)){
            urlSearchParams.set(sn.paramMin, stateParams.min.join('*'));
        }
        else{
            urlSearchParams.append(sn.paramMin, stateParams.min.join('*'));
        }

        if (urlSearchParams.has(sn.paramAdjustify)){
            urlSearchParams.set(sn.paramAdjustify, stateParams.adjustify.x + '*' + stateParams.adjustify.y);
        }
        else{
            urlSearchParams.append(sn.paramAdjustify, stateParams.adjustify.x + '*' + stateParams.adjustify.y);
        }

        window.history.replaceState(null, null, "?" + urlSearchParams);
    }

    if (state.writeToIndexedDB){
        stateParams.id = state.name;

        OrgChart.idb.put(stateParams, function(success){
            if (success == false){
                console.error("Cannot write row - " + state.name);
            }
        });
    }

    if (state.writeTosessionStorage){
        OrgChart.sessionStorage.setItem(state.name, JSON.stringify(stateParams));
    }
}

OrgChart.state._get = function(state, w, h, callback){
    if (!state){
        callback(null);
        return;
    }

    var sn = OrgChart.state._buildStateNames(state.name);

    if (state.readFromUrlParams){
        var urlSearchParams = new URLSearchParams(window.location.search);

        if (urlSearchParams.has(sn.paramScale)
            && urlSearchParams.has(sn.paramX)
            && urlSearchParams.has(sn.paramY)
            && urlSearchParams.has(sn.paramExp)
            && urlSearchParams.has(sn.paramMin)
            && urlSearchParams.has(sn.paramAdjustify)){

            var result  = {};
            var scale = parseFloat(urlSearchParams.get(sn.paramScale));
            var x = parseFloat(urlSearchParams.get(sn.paramX));
            var y = parseFloat(urlSearchParams.get(sn.paramY));

            var vb = [];
            vb[0] = x;
            vb[1] = y;
            vb[2] =  w / scale;
            vb[3] =  h / scale;

            result.vb = vb;
            result.scale = scale;
            result.x = x;
            result.y = y;

            result.exp = urlSearchParams.get(sn.paramExp).split('*');
            result.min = urlSearchParams.get(sn.paramMin).split('*');
            var adjustify = urlSearchParams.get(sn.paramAdjustify).split('*');
            result.adjustify = {
                x: parseFloat(adjustify[0]),
                y: parseFloat(adjustify[1])
            };

            callback(result);
            return;
        }
        else if (!state.readFromIndexedDB && !state.readFromsessionStorage){
            callback(null);
            return;
        }
    }

    if (state.readFromsessionStorage){
        var result = OrgChart.sessionStorage.getItem(state.name);

        if (result != null){
            result = JSON.parse(result);
            var vb = [];
            vb[0] = result.x;
            vb[1] = result.y;
            vb[2] =  w / result.scale;
            vb[3] =  h / result.scale;

            result.vb = vb;
            callback(result);
            return;
        }
        else if (!state.readFromIndexedDB) {
            callback(null);
            return;
        }
    }

    if (state.readFromIndexedDB){
        OrgChart.idb.read(state.name, function(success, result){
            if (success == false){
                console.error("Cannot read from - " + state.name);
                callback(null);
            }
            else if (success == null){
                callback(null);
            }
            else{
                var vb = [];
                vb[0] = result.x;
                vb[1] = result.y;
                vb[2] =  w / result.scale;
                vb[3] =  h / result.scale;

                result.vb = vb;

                callback(result);
            }
        });
    }
}


OrgChart.state.clear = function(stateName){
    if (!stateName){
        return false;
    }

    var sn = OrgChart.state._buildStateNames(stateName);

    var urlSearchParams = new URLSearchParams(window.location.search);
    if (urlSearchParams.has(sn.paramScale)){
        urlSearchParams.delete(sn.paramScale);
    }

    if (urlSearchParams.has(sn.paramX)){
        urlSearchParams.delete(sn.paramX);
    }

    if (urlSearchParams.has(sn.paramY)){
        urlSearchParams.delete(sn.paramY);
    }

    if (urlSearchParams.has(sn.paramExp)){
        urlSearchParams.delete(sn.paramExp);
    }

    if (urlSearchParams.has(sn.paramMin)){
        urlSearchParams.delete(sn.paramMin);
    }

    if (urlSearchParams.has(sn.paramAdjustify)){
        urlSearchParams.delete(sn.paramAdjustify);
    }

    window.history.replaceState(null, null, "?" + urlSearchParams);

    OrgChart.idb.delete(stateName, function(success){
        if (success == false){
            console.error("Cannot delete row - " + stateName);
        }
    });
}




OrgChart._magnify = {};

OrgChart.prototype.magnify = function (id, scale, front, anim, callback) {
    if (!anim){
        anim = this.config.anim;
    }
    var node = this.getNode(id);
    var nodeElement = this.getNodeElement(id);

    if (!node && !nodeElement){
        return;
    }
    var magnify = OrgChart._magnify[id];
    if (magnify){
        if (magnify.timer != undefined){
            clearInterval(magnify.timer);
        }
        if (magnify.timerBack != undefined){
            clearInterval(magnify.timerBack);
        }
        nodeElement.setAttribute('transform', "matrix(" + magnify.transformStart.toString() + ")");
        OrgChart._magnify[id] == null;
    }

    if (front){
        nodeElement = nodeElement.cloneNode(true);
        var svg = this.getSvg();
        svg.appendChild(nodeElement);
    }
    var transformStart = OrgChart._getTransform(nodeElement);
    var transformEnd = JSON.parse(JSON.stringify(transformStart));
    transformEnd[0] = scale;
    transformEnd[3] = scale;
    var newWidth = node.w + node.w * (scale - 1);
    var newHeight = node.h + node.h * (scale - 1);

    transformEnd[4] += (node.w - newWidth   ) / 2;
    transformEnd[5] += (node.h - newHeight ) / 2;
    var timer = OrgChart.animate(nodeElement, {transform: transformStart}, {transform: transformEnd}, anim.duration, anim.func);

    OrgChart._magnify[id] = {
        timer: timer,
        transformStart: transformStart,
        nodeElement: nodeElement,
        front: front
    };

    if (callback){
        callback(nodeElement);
    }
};

OrgChart.prototype.magnifyBack = function (id, anim, callback) {
    if (!anim){
        anim = this.config.anim;
    }
    var magnify = OrgChart._magnify[id];
    if (!magnify){
        return;
    }
    if (magnify.timer != undefined){
        clearInterval(magnify.timer);
    }
    if (magnify.timerBack != undefined){
        clearInterval(magnify.timerBack);
    }
    var backTransformStart = OrgChart._getTransform(magnify.nodeElement);

    magnify.timerBack = OrgChart.animate(magnify.nodeElement, {transform: backTransformStart}, {transform: magnify.transformStart}, anim.duration, anim.func, function(elements){
        var nodeId = elements[0].getAttribute(OrgChart.attr.node_id);
        if (OrgChart._magnify[nodeId]){
            if (OrgChart._magnify[nodeId].front){
                elements[0].parentNode.removeChild(elements[0]);
                OrgChart._magnify[nodeId] = null;
            }
        }
        if(callback){
            callback(elements[0]);
        }
    });
};

﻿if (typeof (OrgChart) == "undefined") {
    OrgChart = {};
}


OrgChart.events.on('init', function(sender, args){
    if (sender.config.enableKeyNavigation){
        sender._addEvent(window, 'keydown', sender._windowKeyDownHandler);

        if (OrgChart.isNEU(sender._keyNavigationActiveNodeId)){
            if (sender.roots && sender.roots.length){
                sender._keyNavigationActiveNodeId = sender.roots[0].id;
                sender.center(sender._keyNavigationActiveNodeId);
            }
        }
    }
});

OrgChart.prototype._windowKeyDownHandler = function (senderElement, e) {
    var element = e.target;
    var nodeId = null;
    while(element && element != this.element){
        if (element.hasAttribute && element.hasAttribute(OrgChart.attr.node_id)){
            nodeId = element.getAttribute(OrgChart.attr.node_id);
            break;
        }
        element = element.parentNode;
    }

    if (element){
        var node = nodeId ? this.getNode(nodeId) : null;
        var data = nodeId ? this.get(nodeId) : null;

        var args = {
            node: node,
            data: data,
            event: e
        };

        var result = OrgChart.events.publish('key-down', [this, args]);

        if (result !== false && node){
            if (e.code == 'KeyF'){//ctrl+f`
                this.searchUI.find('');
            }
            else if (e.code == 'ArrowRight' || (node.isAssistant && e.code == 'ArrowDown') || (node.isPartner && e.code == 'ArrowDown')){//right
                var pnode = this.getNode(node.pid);
                if (pnode){
                    var index = pnode.childrenIds.indexOf(node.id);
                    index++;
                    if (index < pnode.childrenIds.length){
                        var activeNodeId = pnode.childrenIds[index];
                        this._keyNavigationActiveNodeId = activeNodeId;
                        this.center(activeNodeId);
                    }
                }
            }
            else if (e.code == 'ArrowLeft'){//left
                var pnode = this.getNode(node.pid);
                if (pnode){
                    var index = pnode.childrenIds.indexOf(node.id);
                    index--;
                    if (index >= 0){
                        var activeNodeId = pnode.childrenIds[index];
                        this._keyNavigationActiveNodeId = activeNodeId;
                        this.center(activeNodeId);
                    }
                }
            }
            else if (e.code == 'ArrowUp'){//up
                var pnode = this.getNode(node.pid);
                if (pnode){
                    var activeNodeId = pnode.id;
                    if (node.isAssistant || pnode.hasAssistants || node.isPartner || pnode.hasPartners){
                        var index = pnode.childrenIds.indexOf(node.id);
                        index--;
                        if (index >= 0){
                            activeNodeId = pnode.childrenIds[index];
                        }
                    }
                    this._keyNavigationActiveNodeId = activeNodeId;
                    this.center(activeNodeId);
                }
            }
            else if (e.code == 'ArrowDown'){//down
                if (node.childrenIds.length){
                    this._keyNavigationActiveNodeId = node.childrenIds[0];
                    this.center(node.childrenIds[0]);
                }
            }
            else if (e.code == 'Space'){//interval
                var id = element.getAttribute(OrgChart.attr.node_id);
                this.toggleExpandCollapse(id, e);
                return;
            }
        }
    }
};

OrgChart.events.on('redraw', function(sender, args){
    if (sender.config.enableKeyNavigation){
        OrgChart._keyNavigation(sender);
    }
});

OrgChart.events.on('click', function(sender, args){
    if (sender.config && sender.config.enableKeyNavigation){
        sender._keyNavigationActiveNodeId = args.node.id;
        sender.center(args.node.id);
    }
});


OrgChart._keyNavigation = function (sender) {
    var focusedElement = sender.element.querySelector(':focus');
    if (focusedElement && focusedElement.parentElement && focusedElement.parentElement.hasAttribute(OrgChart.attr.node_id)){
        var activeNodeElement = focusedElement.parentElement;
        var firstChildElement = focusedElement;
        var title = firstChildElement.querySelector('title');
        if (title){
            title.parentNode.removeChild(title);
        }
        //sender._removeEvent(firstChildElement, 'keydown');
        firstChildElement.removeAttribute('tabindex');
    }

    if (OrgChart.isNEU(sender._keyNavigationActiveNodeId)){
        return;
    }

    var activeNodeElement = sender.getNodeElement(sender._keyNavigationActiveNodeId);

    if (!activeNodeElement || !activeNodeElement.children.length){
        return;
    }

    var firstChildElement = activeNodeElement.children[0];
    firstChildElement.setAttribute('tabindex', 2);

    var args = {
        text: '',
        id: sender._keyNavigationActiveNodeId
    };

    OrgChart.events.publish('screen-reader-text', [sender, args]);

    if (!OrgChart.isNEU(args.text)){
        var title = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'title'
        );
        title.innerHTML = args.text;
        firstChildElement.appendChild(title);
    }

    sender.searchUI.hide();

    firstChildElement.focus();
};


OrgChart.elements = {};

OrgChart.elements.textbox = function (data, editElement, minWidth, readOnly) {
    var vidrf = OrgChart.elements._vidrf(data, editElement, readOnly);
    if (vidrf.doNotRender){
        return {
            html: ''
        };
    }
    var inputBtn =  '';
    if (editElement.btn){
        inputBtn = `<a href="#" boc-input-btn="" class="boc-link boc-link-boc-button">${editElement.btn}</a>`;
    }

    return {
            html: `<div class="boc-form-field" style="min-width: ${minWidth};">
                    <div class="boc-input" data-boc-input="" ${vidrf.disabledAttribute} ${vidrf.vlidators}>
                        <label for="${vidrf.id}">${vidrf.label}</label>
                        <input ${vidrf.readOnlyAttribute} data-binding="${vidrf.binding}" maxlength="256" id="${vidrf.id}" name="${vidrf.id}" type="text" value="${vidrf.value}" autocomplete="off">
                        ${inputBtn}
                    </div>
                </div>`,
            id: vidrf.id,
            value: vidrf.value
        };
};

OrgChart.elements.checkbox = function (data, editElement, minWidth, readOnly) {
    var vidrf = OrgChart.elements._vidrf(data, editElement, readOnly);
    if (vidrf.doNotRender){
        return {
            html: ''
        };
    }
    var checked = vidrf.value ? 'checked' : '';
    var onclick = readOnly ? 'onclick="return false;"' : '';

    return {
            html: `<div class="boc-form-field"  style="min-width: ${minWidth};" >
                        <label class="boc-checkbox" data-boc-input="" ${vidrf.disabledAttribute}>
                            <input ${checked} ${onclick} data-binding="${vidrf.binding}" type="checkbox"><span class="boc-checkbox-checkmark" type="checkbox"></span>${vidrf.label}
                        </label>
                    </div>`,
            id: vidrf.id,
            value: checked
        };
};


OrgChart.elements.select = function (data, editElement, minWidth, readOnly) {
    if (readOnly){
        return OrgChart.elements.textbox(data, editElement, minWidth, readOnly);
    }
    var vidrf = OrgChart.elements._vidrf(data, editElement, readOnly);
    if (vidrf.doNotRender){
        return {
            html: ''
        };
    }
    return {
        html: `<div class="boc-form-field" style="min-width: ${minWidth};">
                    <div class="boc-input" data-boc-input="" ${vidrf.disabledAttribute} ${vidrf.vlidators}>
                        <label for="${vidrf.id}">${vidrf.label}</label>
                        <select data-binding="${vidrf.binding}" ${vidrf.readOnlyAttribute} id="${vidrf.id}" name="${vidrf.id}">
                            ${(function () {
                                var htmlOptions = '';

                                for(var i = 0; i < vidrf.options.length; i++){
                                    var option = vidrf.options[i];
                                    var selected = option.value == vidrf.value ? 'selected' : '';
                                    htmlOptions += `<option ${selected} value="${option.value}">${option.text}</option>`;
                                }

                                return htmlOptions;
                            })()}
                        </select>
                    </div>
                </div>`,
        id: vidrf.id,
        value: vidrf.value
    };
};

OrgChart.elements.date = function (data, editElement, minWidth, readOnly) {
    var vidrf = OrgChart.elements._vidrf(data, editElement, readOnly);
    if (vidrf.doNotRender){
        return {
            html: ''
        };
    }
    return {
        html: `<div class="boc-form-field" style="min-width: ${minWidth};">
                    <div class="boc-input" data-boc-input="" ${vidrf.disabledAttribute} ${vidrf.vlidators}>
                        <label for="${vidrf.id}" class="hasval">${vidrf.label}</label>
                        <input data-binding="${vidrf.binding}" ${vidrf.readOnlyAttribute} maxlength="256" id="${vidrf.id}" name="${vidrf.id}" type="date" value="${vidrf.value}" autocomplete="off">
                    </div>
                </div>`,
        id: vidrf.id,
        value: vidrf.value
    };
};

OrgChart.elements._vidrf = function (data, editElement, readOnly) {
    var result = {};
    if (!editElement.binding){
        editElement.binding = '';
    }
    if (!editElement.label){
        editElement.label = '';
    }
    if (editElement.type == 'select' && !Array.isArray(editElement.options)){
        result.options = [];
    }
    else{
        result.options = editElement.options;
    }
    result.value = (data && !OrgChart.isNEU(data[editElement.binding])) ? data[editElement.binding]: '';
    if (readOnly && result.options){ // in details mode it shows text box instead of select, gets the text by value from options
        for (var i = 0; i < result.options.length; i++){
            if (result.options[i].value == result.value){
                result.value = result.options[i].text;
                break;
            }
        }
    }
    result.id = OrgChart.elements.generateId();
    result.disabledAttribute =  readOnly ? 'data-boc-input-disabled' : '';
    result.readOnlyAttribute = readOnly ? 'readonly' : '';
    result.id = result.id;

    if (readOnly && OrgChart.isNEU(result.value)){
        result.doNotRender = true;
    }
    if (readOnly && editElement.binding == 'photo'){
        result.id = null;
        result.doNotRender = true;
    }
    result.binding = editElement.binding;
    result.label = editElement.label;
    result.vlidators = '';
    if (editElement.vlidators){
        for (var vname in editElement.vlidators){
            result.vlidators += `data-v-${vname}="${editElement.vlidators[vname]}" `;
        }
    }
    return result;
};

OrgChart.elements.ids = [];
OrgChart.elements.generateId = function (){
    while (true) {
        var uid = '_' + ("0000" + ((Math.random() * Math.pow(36, 4)) | 0).toString(36)).slice(-4);
        if (!OrgChart.elements.ids.has(uid)) {
            OrgChart.elements.ids.push(uid);
            return uid;
        }
    }
};


OrgChart.input = {};

OrgChart.input._timeout = null;
OrgChart.input.initWithTimeout = function () {
    if (OrgChart.input._timeout) {
        clearTimeout(OrgChart.input._timeout);
        OrgChart.input._timeout = null;
    }
    OrgChart.input._timeout = setTimeout(OrgChart.input.init, 200);
};

OrgChart.input.init = function (containerElement) {
    var inputFields;
    if (containerElement) {
        inputFields = containerElement.querySelectorAll('[data-boc-input]');
    }
    else {
        inputFields = document.querySelectorAll("[data-boc-input]");
    }

    for(var i = 0; i < inputFields.length; i++){
        var inputField = inputFields[i];

        var inputElement = null;

        //for input type hidden
        if (inputField.type && inputField.type.toLowerCase() == "hidden"){
            inputElement = inputField;
        }

        //for input type textbox or password
        if (!inputElement){
            inputElement = inputField.querySelector("input");
        }


        //for input type select
        if (!inputElement){
            inputElement = inputField.querySelector("select");
        }

        var labelElement = inputField.querySelector("label");

        //some inputs could not have labels
        if (labelElement) {
            if (inputElement.value) {
                labelElement.classList.add("hasval");
            }
            else if (inputElement.type == 'select-one') {
                if (inputElement.selectedOptions
                    && inputElement.selectedOptions.length
                    && inputElement.selectedOptions[0].value == ''
                    && inputElement.selectedOptions[0].innerHTML) {

                    labelElement.classList.add("hasval");
                }
            }

        }

        if (inputElement.type.toLowerCase() != "checkbox") {
            inputElement.addEventListener("focus", function () {
                this.classList.remove("boc-validation-error");
                var lbl = this.parentNode.querySelector("label");
                lbl.classList.add("focused");
                var validation_error_message = lbl.querySelector(".boc-validation-error-message");
                if (validation_error_message) validation_error_message.parentNode.removeChild(validation_error_message);
            });
        }

        if (inputElement.type.toLowerCase() != "checkbox") {
            inputElement.addEventListener("blur", function () {
                var lbl = this.parentNode.querySelector("label");
                lbl.classList.remove("focused");
                if (this.value) {
                    lbl.classList.add("hasval");
                }
                else if (this.type == 'date') {
                    lbl.classList.add("hasval");
                }
                else {
                    lbl.classList.remove("hasval");
                }

                //OrgChart.input.validate(this.parentNode);
            });
        }
    }
}

OrgChart.input.validate = function (inputField) {
    var inputElement = null;

    //for input type hidden
    if (inputField.type && inputField.type.toLowerCase() == "hidden") {
        inputElement = inputField;
    }

    //for input type textbox or password
    if (!inputElement) {
        inputElement = inputField.querySelector("input");
    }

    //for input type select
    if (!inputElement) {
        inputElement = inputField.querySelector("select");
    }

    var labelElement = inputField.querySelector("label");

    inputElement.classList.remove("boc-validation-error");
    if (labelElement) {
        var validation_error_message = labelElement.querySelector(".boc-validation-error-message");
        if (validation_error_message) validation_error_message.parentNode.removeChild(validation_error_message);
    }

    if (inputElement.value) inputElement.value = inputElement.value.trim();


    var baInputRequired = inputField.getAttribute("data-v-required");
    var baInputPassword = inputField.getAttribute("data-v-password");
    var baInputEmail = inputField.getAttribute("data-v-email");
    var baInputEmails = inputField.getAttribute("data-v-emails");

    if (baInputRequired && inputElement.value == "") {
        labelElement.innerHTML += '<span class="boc-validation-error-message">&nbsp;' + baInputRequired + '</span>';
        inputElement.classList.add("boc-validation-error");
        return false;
    }
    else if (baInputPassword && !OrgChart.input.validatePassword(inputElement.value)) {
        labelElement.innerHTML += '<span class="boc-validation-error-message">&nbsp;' + baInputPassword + '</span>';
        inputElement.classList.add("boc-validation-error");
        return false;
    }
    else if (baInputEmail && !OrgChart.input.isValidEmail(inputElement.value)) {
        labelElement.innerHTML += '<span class="boc-validation-error-message">&nbsp;' + baInputEmail + '</span>';
        inputElement.classList.add("boc-validation-error");
        return false;
    }
    else if (baInputEmails && !OrgChart.input.isValidEmails(inputElement.value)) {

        labelElement.innerHTML += '<span class="boc-validation-error-message">&nbsp;' + baInputEmails + '</span>';
        inputElement.classList.add("boc-validation-error");
        return false;
    }

    return true;
};

OrgChart.input.validateAndGetData = function (element){
    var inputFields = element.querySelectorAll('[data-boc-input]');

    var isValid = true;
    for(var i = 0; i < inputFields.length; i++){
        var inputField = inputFields[i];

        if (!OrgChart.input.validate(inputField)) {
            isValid = false;
        }
    }

    if (!isValid) {
        return false;
    }

    var dbElements = element.querySelectorAll('[data-binding]');

    var postData = {};
    for (var i = 0; i < dbElements.length; i++) {
        var dbElement = dbElements[i];
        var prop = dbElement.getAttribute('data-binding');
        if (dbElement.type.toLowerCase() == "checkbox") {
            postData[prop] = dbElement.checked;
        }
        else{
            postData[prop] = dbElement.value;
        }
    }

    return postData;
}

OrgChart.input.validatePassword = function (val) {
    if (val) val = val.trim();

    if (val.length < 5) {
        return false;
    }
    else if (val.length > 18) {
        return false;
    }
    else if (val.indexOf(' ') != -1) {
        return false;
    }
    return true;
};

OrgChart.input.isValidEmails = function (val) {
    if (val) {
        var emailArr = val.split(',');
        for (var i = 0; i < emailArr.length; i++) {
            var email = emailArr[i].trim();
            if (!OrgChart.input.isValidEmail(email)) {
                return false;
            }
        }
    }
    return true;
};


OrgChart.input.isValidEmail = function(val){
    if (val) val = val.trim();
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(val).toLowerCase());
};


OrgChart.ui.css = function () {
            return '<style data-boc-styles>.boc-button{background-color:#039be5;cursor:pointer;width:calc(100%);height:50px;color:#fff;padding-top:5px;padding-left:7px;padding-right:7px;text-align:center;text-transform:uppercase;border:1px solid #3fc0ff;display:inline-block;border-radius:5px}.boc-button.orange{background-color:#f57c00;border:1px solid #ffa03e}.boc-button.yellow{background-color:#ffca28;border:1px solid #ffdf7c}.boc-button.lower{text-transform:unset}.boc-button.transparent{background-color:transparent}.boc-button:hover{background-color:#35afea}.boc-button.orange:hover{background-color:#f79632}.boc-button.yellow:hover{background-color:#ffd452}.boc-button:active{transform:matrix(.98,0,0,.98,0,0)}.boc-button-icon{text-align:initial;cursor:pointer;margin-bottom:15px;color:#039be5}.boc-dark .boc-button-icon:hover{background-color:#2d2d2d}.boc-light .boc-button-icon:hover{background-color:#ececec}.boc-button-icon>img{height:24px;width:24px;vertical-align:middle;padding:7px}.boc-button:focus{outline:0}.boc-button-icon>img{filter:invert(46%) sepia(66%) saturate(2530%) hue-rotate(171deg) brightness(95%) contrast(98%)}.boc-light .boc-button.transparent{color:#039be5}.boc-light .boc-button.transparent:hover{color:#fff}.boc-button-loading{background-color:transparent;cursor:pointer;width:calc(100% - 2px);height:50px;color:#fff;text-align:center;text-transform:uppercase;border:1px solid #027cb7;display:inline-block;display:flex;justify-content:center;align-items:center;display:none}.boc-button-loading .boc-loading-dots div{margin:0 10px}.boc-link-boc-button{position:absolute;right:10px;top:-1px}[data-boc-input-disabled] .boc-link-boc-button{display:none}[dir=rtl] .boc-link-boc-button{left:10px;right:unset}.boc-img-button{width:48px;height:48px;cursor:pointer;border-radius:50%;background-color:#039be5;background-repeat:no-repeat;background-size:24px 24px;background-position:center center;margin:3px;display:inline-block}.boc-img-button:hover{background-color:#f57c00}.boc-checkbox{display:block;position:relative;padding-left:35px;margin-bottom:12px;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;white-space:nowrap}.boc-checkbox input{position:absolute;opacity:0;cursor:pointer;height:0;width:0}.boc-checkbox-checkmark{position:absolute;top:0;left:0;height:25px;width:25px;border-radius:5px}.boc-dark [data-boc-input-disabled] .boc-checkbox-checkmark,.boc-dark [data-boc-input-disabled].boc-checkbox input:checked~.boc-checkbox-checkmark,.boc-light [data-boc-input-disabled] .boc-checkbox-checkmark,.boc-light [data-boc-input-disabled].boc-checkbox input:checked~.boc-checkbox-checkmark{background-color:#aeaeae!important}[data-boc-input-disabled].boc-checkbox{cursor:default}[dir=rtl] .boc-checkbox-checkmark{right:0}[dir=rtl] .boc-checkbox{padding-left:unset;padding-right:35px}.boc-dark .boc-checkbox-checkmark{background-color:#333;border:1px solid #5b5b5b}.boc-light .boc-checkbox-checkmark{background-color:#fff;border:1px solid #c7c7c7}.boc-dark .boc-checkbox:hover input~.boc-checkbox-checkmark{background-color:#3c3c3c}.boc-light .boc-checkbox:hover input~.boc-checkbox-checkmark{background-color:#f8f9f9}.boc-dark .boc-checkbox input:checked~.boc-checkbox-checkmark{background-color:#039be5}.boc-light .boc-checkbox input:checked~.boc-checkbox-checkmark{background-color:#039be5}.boc-checkbox-checkmark:after{content:"";position:absolute;display:none}.boc-checkbox input:checked~.boc-checkbox-checkmark:after{display:block}.boc-checkbox .boc-checkbox-checkmark:after{left:9px;top:5px;width:5px;height:10px;border:solid #fff;border-width:0 3px 3px 0;-webkit-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg)}.boc-filter{user-select:none}.boc-light .boc-filter{color:#757575}.boc-dark .boc-filter{color:#ccc}.boc-filter>div>div{display:inline-block;padding:3px 10px;cursor:pointer}.boc-filter-menu fieldset,.boc-filter>div,.filter-field-selected{border-radius:5px}.boc-filter-menu fieldset{overflow-y:auto;max-height:300px}.boc-filter>div.boc-filter-menu{padding:10px}.boc-light .boc-filter>div.boc-filter-menu,.boc-light .filter-field-selected{background-color:#f8f9f9}.boc-dark .boc-filter>div.boc-filter-menu,.boc-dark .filter-field-selected{background-color:#3c3c3c}.boc-light .boc-filter>div{background-color:#eee}.boc-dark .boc-filter>div{background-color:#333}.boc-form-perspective{transform-style:preserve-3d;perspective:500px;position:absolute;top:32px}.boc-form{box-shadow:rgba(0,0,0,.2) 0 6px 6px 0,rgba(0,0,0,.19) 0 13px 20px 0;padding:14px;transform-origin:top center;user-select:none;display:none;position:relative;max-height:calc(100vh - 100px);overflow-y:auto;border-bottom-left-radius:5px;border-bottom-right-radius:5px}.boc-form-bottom{border-bottom-left-radius:unset;border-bottom-right-radius:unset;border-top-left-radius:5px;border-top-right-radius:5px}.boc-form .separator{margin:0 10px}@media screen and (max-width:1000px){.boc-form-perspective{min-width:100%;max-height:calc(100% - 32px);left:unset!important;right:unset!important;transform:none!important}.boc-form .set{max-height:calc(100vh - 74px)}.boc-form-fieldset{max-width:unset!important}}.boc-light .boc-form .separator{border-bottom:1px solid #c7c7c7}.boc-dark .boc-form .separator{border-bottom:1px solid #5b5b5b}.boc-light .boc-form{background-color:#fff}.boc-dark .boc-form{background-color:#252526}.boc-item{padding:6px 12px 6px 12px;display:flex;flex-direction:row}.boc-light .boc-form .boc-item.selected,.boc-light .boc-form .boc-item:hover{background-color:#0074e8;color:#fff}.boc-dark .boc-form .boc-item.selected,.boc-dark .boc-form .boc-item:hover{background-color:#094771;color:#fff}.boc-item.selected img,.boc-item:hover img{filter:invert(100%)}.boc-item.selected img{visibility:visible!important}.boc-form-fieldset{display:flex;flex-wrap:wrap;margin:0!important}.boc-form-field{flex:1 0 21%;margin:3px;min-width:200px}.boc-form-field-100{flex:1 0 96%;margin:3px;min-width:200px}.boc-input{position:relative}.boc-input>input,.boc-input>select{height:50px;padding:18px 10px 2px 9px;width:100%;box-sizing:border-box;border-style:solid;border-width:1px}.boc-input select{height:50px;padding:20px 5px 4px 5px}[data-boc-input-disabled].boc-input>input,[data-boc-input-disabled].boc-input>select{border-color:transparent!important}.boc-light [data-boc-input-disabled]>input,.boc-light [data-boc-input-disabled]>select{background-color:#fff!important}.boc-dark [data-boc-input-disabled]>input,.boc-dark [data-boc-input-disabled]>select{background-color:#252526!important}[data-boc-input-disabled]>select{appearance:none;padding-left:8px}.boc-input>label{display:inline-block;position:absolute;padding-left:10px;padding-right:10px;color:#acacac;cursor:text;-webkit-transition:all .1s ease-out;-moz-transition:all .1s ease-out;-ms-transition:all .1s ease-out;-o-transition:all .1s ease-out;transition:all .1 ease-out;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:initial;text-align:initial;white-space:nowrap}.boc-input>label{top:12px;overflow:hidden;text-overflow:ellipsis;max-width:calc(100% - 14px)}.boc-input>label.focused,.boc-input>label.hasval{top:-1px}.boc-input>input,.boc-input>select{outline:0;border-radius:5px}.boc-dark .boc-input>label.focused,.boc-light .boc-input>label.focused{color:#039be5}.boc-dark .boc-input>input,.boc-dark .boc-input>select{color:#ccc;background-color:#333;border-color:#5b5b5b}.boc-light .boc-input>input,.boc-light .boc-input>select{color:#757575;background-color:#fff;border-color:#c7c7c7}.boc-light .boc-input>input:focus,.boc-light .boc-input>select:focus{border-color:#039be5;background-color:#f8f9f9}.boc-dark .boc-input>input:focus,.boc-dark .boc-input>select:focus{border-color:#039be5;background-color:#3c3c3c}.boc-dark .boc-input>input.boc-validation-error,.boc-dark .boc-input>select.boc-validation-error,.boc-light .boc-input>input.boc-validation-error,.boc-light .boc-input>select.boc-validation-error{border-color:#ca2a2a}.boc-dark .boc-validation-error-message,.boc-light .boc-validation-error-message{color:#ca2a2a}.boc-link{color:#039be5;cursor:pointer;text-decoration:underline}.boc-link:hover{color:#f57c00}.boc-dark ::-webkit-scrollbar,.boc-light ::-webkit-scrollbar{width:15px}.boc-dark ::-webkit-scrollbar-track{background:#1e1e1e;border-left:1px solid #333}.boc-dark ::-webkit-scrollbar-thumb{background:#424242}.boc-dark ::-webkit-scrollbar-thumb:hover{background:#4f4f4f}.boc-dark ::-webkit-scrollbar-thumb:active{background:#5e5e5e}.boc-light ::-webkit-scrollbar-track{background:#fff;border-left:1px solid #ddd}.boc-light ::-webkit-scrollbar-thumb{background:#c1c1c1}.boc-light ::-webkit-scrollbar-thumb:hover{background:#929292}.boc-light ::-webkit-scrollbar-thumb:active{background:#666}.boc-edit-form{position:fixed;top:0;right:0;height:100%;width:100%;box-shadow:rgba(0,0,0,.2) 0 6px 6px 0,rgba(0,0,0,.19) 0 13px 20px 0;display:flex;flex-direction:column;height:100%;width:400px}@media screen and (max-width:1000px){.boc-edit-form{width:100%}}.boc-dark .boc-edit-form{background-color:#252526}.boc-light .boc-edit-form{background-color:#fff}.boc-edit-form-header{height:200px;text-align:center;border-radius:10px}.export-service .boc-edit-form-header{border-radius:unset}.boc-edit-form-title{color:#fff;margin:0;padding:14px 17px 7px 17px}.boc-edit-form-avatar{border-radius:50%;width:150px;height:150px;position:absolute;top:75px;border:5px solid #fff;left:50%;transform:translateX(-50%);background-color:#cacaca;box-shadow:rgba(0,0,0,.2) 0 6px 6px 0,rgba(0,0,0,.19) 0 13px 20px 0}.boc-edit-form-close{position:absolute;right:14px;top:14px;width:34px;height:34px;cursor:pointer}.boc-edit-form-fields{flex-grow:1;overflow-y:auto;overflow-x:hidden}.boc-edit-form-fields-inner{margin:0 7px 20px 7px}.boc-chart-menu{opacity:0;display:inline-block;position:absolute;text-align:left;user-select:none;min-width:270px;box-shadow:rgba(0,0,0,.2) 0 4px 8px 0,rgba(0,0,0,.19) 0 6px 20px 0;font:13px/28px Helvetica,"Segoe UI",Arial,sans-serif;border-radius:10px}.boc-chart-menu>div:hover img{filter:invert(100%)}.boc-chart-menu [data-item]{text-align:start;padding:7px 10px}.boc-dark .boc-chart-menu [data-item]{background-color:#252526;color:#acacac;border-bottom:1px solid #333}.boc-dark .boc-chart-menu [data-item]:hover{background-color:#094771!important;color:#fff!important}.boc-dark .boc-chart-menu [data-item]:hover svg{filter:brightness(0) invert(1)}.boc-light .boc-chart-menu [data-item]{background-color:#fff;color:#333;border-bottom:1px solid #c7c7c7}.boc-light .boc-chart-menu [data-item]:hover{background-color:#0074e8!important;color:#fff!important}.boc-light .boc-chart-menu [data-item]:hover svg{filter:brightness(0) invert(1)}.boc-chart-menu [data-item] svg{vertical-align:middle}.boc-chart-menu [data-item]:first-child{border-top-left-radius:7px;border-top-right-radius:7px}.boc-chart-menu [data-item]:last-child{border-bottom-width:0;border-bottom-style:none;border-bottom-left-radius:7px;border-bottom-right-radius:7px}.boc-search{position:absolute}@media screen and (max-width:1000px){.boc-search{width:calc(100% - 30px)}}.boc-search .boc-input{margin-bottom:0}.boc-search-input{color:#7a7a7a;width:100%;border:none;outline:0;padding-top:10px;padding-right:47px}.boc-search label{padding-right:47px}.boc-search-image-td{width:43px}.boc-search-text-td{padding-inline-end:7px;line-height:15px;text-align:start}.boc-search table{box-shadow:rgba(0,0,0,.2) 0 4px 8px 0,rgba(0,0,0,.19) 0 6px 20px 0;margin:0 3.5px 0 3.5px;width:calc(100% - 7px);border-radius:7px}.boc-search table tr:first-child td:first-child{border-top-left-radius:7px}.boc-search table tr:first-child td:last-child{border-top-right-radius:7px}[dir=rtl] .boc-search table tr:first-child td:first-child{border-top-left-radius:unset;border-top-right-radius:7px}[dir=rtl] .boc-search table tr:first-child td:last-child{border-top-right-radius:unset;border-top-left-radius:7px}.boc-search table tr:last-child td:first-child{border-bottom-left-radius:7px}.boc-search table tr:last-child td:last-child{border-bottom-right-radius:7px}[dir=rtl] .boc-search table tr:last-child td:first-child{border-bottom-left-radius:unset;border-bottom-right-radius:7px}[dir=rtl] .boc-search table tr:last-child td:last-child{border-bottom-right-radius:unset;border-bottom-left-radius:7px}.boc-dark .boc-search table{background-color:#252526;color:#acacac}.boc-search [data-search-item-id]{cursor:pointer}.boc-search-photo{margin:7px 7px 0 7px;width:32px;height:32px;background-size:cover;background-position:top center;border-radius:50%;display:inline-block;border:1px solid #8c8c8c}.boc-dark .boc-search [data-search-item-id] td{border-top:1px solid #333}.boc-dark .boc-search [data-search-item-id]:hover,.boc-dark .boc-search [data-selected=yes]{background-color:#094771;color:#fff}.boc-light .boc-search table{background-color:#fff;color:#333}.boc-light .boc-search [data-search-item-id] td{border-top:1px solid #c7c7c7}.boc-light .boc-search [data-search-item-id]:hover,.boc-light .boc-search [data-selected=yes]{background-color:#0074e8;color:#fff}.boc-search [data-search-item-id]:first-child td{border-top:unset}.boc-ripple-container{position:absolute;top:0;right:0;bottom:0;left:0}.boc-drag-over rect{opacity:.5}.boc-ripple-container span{transform:scale(0);border-radius:100%;position:absolute;opacity:.75;background-color:#fff;animation:boc-ripple 1s}@-moz-keyframes boc-ripple{to{opacity:0;transform:scale(2)}}@-webkit-keyframes boc-ripple{to{opacity:0;transform:scale(2)}}@-o-keyframes boc-ripple{to{opacity:0;transform:scale(2)}}@keyframes boc-ripple{to{opacity:0;transform:scale(2)}}.boc-slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;-webkit-transition:.4s;transition:.4s}.boc-slider:before{position:absolute;content:"";height:16px;width:16px;left:4px;bottom:4px;background-color:#fff;-webkit-transition:.4s;transition:.4s}.boc-slider.round{border-radius:24px}.boc-slider.round:before{border-radius:50%}svg text:hover{cursor:default}svg.boc-cursor-grab,svg.boc-cursor-grab text:hover{cursor:grab}svg.boc-cursor-nodrop,svg.boc-cursor-nodrop text:hover{cursor:no-drop}svg.boc-cursor-copy,svg.boc-cursor-copy text:hover{cursor:copy}svg.boc-cursor-move,svg.boc-cursor-move text:hover{cursor:move}#boc-close-btn:focus,#boc-close-btn:hover{color:#000;text-decoration:none;cursor:pointer}#boc-id-select:focus{outline:.5px solid #aeaeae}#boc-sampleDialog #title:hover{cursor:default;background:gray}.boc-light{background-color:#fff;font:13px/28px Helvetica,"Segoe UI",Arial,sans-serif}.boc-dark{background-color:#1e1e1e;font:13px/28px Helvetica,"Segoe UI",Arial,sans-serif}.boc-light .boc-fill{fill:#fff}.boc-dark .boc-fill{fill:#1e1e1e}.boc-dark input,.boc-dark select,.boc-light input,.boc-light select{font:16px Helvetica,"Segoe UI",Arial,sans-serif}.boc-dark h1,.boc-light h1{font-size:30px;line-height:1}.boc-edit-form{position:absolute;border-radius:10px}.export-service .boc-edit-form{border-radius:unset}.boc-dark .boc-edit-form{color:#acacac}.boc-light .boc-edit-form{color:#333}.boc-dark ::-webkit-calendar-picker-indicator{filter:invert(70%)}.boc-light ::-webkit-calendar-picker-indicator{filter:invert(50%)}.boc-edit-form-instruments{margin:42px 10px 0 10px;text-align:center;min-height:70px}.boc-img-button svg{position:relative;top:12px}.boc-light .boc-toolbar-container svg circle,.boc-light .boc-toolbar-container svg line,.boc-light .boc-toolbar-container svg path{stroke:#8c8c8c!important}.boc-dark .boc-toolbar-container svg circle,.boc-dark .boc-toolbar-container svg line,.boc-dark .boc-toolbar-container svg path{stroke:#8c8c8c!important}.boc-dark .boc-toolbar-container svg rect{fill:#252526!important}.boc-dark .boc-toolbar-container [data-tlbr=minus] svg{border-left:1px solid #5b5b5b!important;border-right:1px solid #5b5b5b!important;border-bottom:1px solid #5b5b5b!important}.boc-dark .boc-toolbar-container [data-tlbr=plus] svg{border-left:1px solid #5b5b5b!important;border-right:1px solid #5b5b5b!important;border-top:1px solid #5b5b5b!important}.boc-dark .boc-toolbar-container [data-tlbr]>svg{border:1px solid #5b5b5b!important;background-color:#252526!important}</style>';
        };
if (typeof (OrgChart) == "undefined") {
    OrgChart = {};
}



OrgChart.prototype.onField = function (listener) {
    return this.on('field', function (sender, args) {
        return listener.call(sender, args)
    });
}


OrgChart.prototype.onInit = function (listener) {
    return this.on('init', function (sender) {
        return listener.call(sender)
    });
}

OrgChart.prototype.onRedraw = function (listener) {
    return this.on('redraw', function (sender) {
        return listener.call(sender)
    });
}

OrgChart.prototype.onUpdateNode = function (listener) {
    return this.on('update', function (sender, oldData, data) {
        var args = {
            oldData: oldData,
            newData: data
        };
        return listener.call(sender, args)
    });
}


OrgChart.prototype.onRemoveNode = function (listener) {
    return this.on('remove', function (sender, id, newPidsAndStpidsForIds) {
        var args = {
            id: id,
            newPidsAndStpidsForIds: newPidsAndStpidsForIds
        };
        return listener.call(sender, args)
    });
}

OrgChart.prototype.onAddNode = function (listener) {
    return this.on('add', function (sender, data) {
        var args = {
            data: data
        };
        return listener.call(sender, args)
    });
}

OrgChart.prototype.onDrop = function (listener) {
    return this.on('drop', function (sender, dragId, dropId) {
        var args = {
            dragId: dragId,
            dropId: dropId
        };
        return listener.call(sender, args)
    });
}


OrgChart.prototype.onDrag = function (listener) {
    return this.on('drag', function (sender, dragId, event) {
        var args = {
            dragId: dragId,
            event: event
        };
        return listener.call(sender, args)
    });
}

OrgChart.prototype.onExpandCollpaseButtonClick = function (listener) {
    return this.on('expcollclick', function (sender, collapsing, id, ids) {
        var args = {
            collapsing: collapsing,
            id: id,
            ids: ids
        };
        return listener.call(sender, args)
    });
}

OrgChart.prototype.onExportStart = function (listener) {
    return this.on('exportstart', function (sender, args) {
        return listener.call(sender, args)
    });
}

OrgChart.prototype.onExportEnd = function (listener) {
    return this.on('exportend', function (sender, args) {
        return listener.call(sender, args)
    });
}


OrgChart.prototype.onNodeClick = function (listener) {
    return this.on('click', function (sender, args) {
        return listener.call(sender, args)
    });
}

OrgChart.prototype.onNodeDoubleClick = function (listener) {
    return this.on('dbclick', function (sender, data) {
        var args = {
            data: data
        };
        return listener.call(sender, args);
    });
}




﻿OrgChart.filterUI = function () {
};

OrgChart.filterUI.prototype.init = function (instance) {
    this.instance = instance;
};

OrgChart.filterUI.prototype.addFilterTag = function (data) {
    if (!this.instance.config.filterBy){
        return false;
    }
    if (OrgChart.isNEU(data)){
        return false;
    }

    var filterMenuElements = this.instance.element.querySelectorAll(`[data-filter-menu]`);
    if (filterMenuElements){
        for (var i = 0; i < filterMenuElements.length; i++) {
            var field = filterMenuElements[i].getAttribute('data-filter-menu');
            var val = data[field];

            if (!OrgChart.isNEU(val)) {
                var checkboxElement = filterMenuElements[i].querySelector(`[name="${val}"]`);
                if (checkboxElement && !checkboxElement.checked) {
                    return true;
                }
            }
        }
    }

    return false;
};


OrgChart.filterUI.prototype.update = function () {
    if (!this.instance.config.filterBy){
        return;
    }
    var filterByIsArray = Array.isArray(this.instance.config.filterBy);
    var that = this;
    var filterElement = this.instance.element.querySelector('[data-filter]');
    if (filterElement) {
        filterElement.parentNode.removeChild(filterElement);
    }

    filterElement = document.createElement('div');
    filterElement.setAttribute('data-filter', '');
    filterElement.style.position = 'absolute';
    filterElement.setAttribute('class', 'boc-filter');
    filterElement.style.top = this.instance.config.padding + 'px';
    filterElement.style.left = this.instance.config.padding + 'px';

    var html = '';
    for (var i = 0; i < this.instance.editUI.fields.length; i++) {
        if ((!filterByIsArray && this.instance.editUI.fields[i] != 'tags' && this.instance.editUI.fields[i] != 'id' && this.instance.editUI.fields[i] != 'pid' && this.instance.editUI.fields[i] != 'ppid' && this.instance.editUI.fields[i] != 'stpid')
            || (filterByIsArray && this.instance.config.filterBy.has(this.instance.editUI.fields[i]))) {
            html += `<div data-filter-field="${this.instance.editUI.fields[i]}">${this.instance.editUI.fields[i]}</div>`;
        }
    }
    filterElement.innerHTML = `<div>${html}</div>`;


    filterElement.addEventListener('click', function (e) {
        if (e.target.hasAttribute('data-filter-close') || e.target.hasAttribute('data-filter-field')) {
            var field = e.target.getAttribute('data-filter-field');

            var filterMenuElements = that.instance.element.querySelectorAll(`[data-filter-menu]`);
            for (var i = 0; i < filterMenuElements.length; i++) {
                filterMenuElements[i].style.display = 'none';
            }


            var filterFieldSelectedElements = that.instance.element.querySelectorAll('.filter-field-selected');
            for (var i = 0; i < filterFieldSelectedElements.length; i++) {
                filterFieldSelectedElements[i].classList.remove('filter-field-selected');
            }

            var filterCloseElement = that.instance.element.querySelector('[data-filter-close]');
            if (filterCloseElement) {
                filterCloseElement.parentNode.removeChild(filterCloseElement);
            }

            if (e.target.hasAttribute('data-filter-close')) {
                return;
            }

            if (!e.target.hasAttribute('data-filter-field')) {
                return;
            }

            var filterMenuElement = that.instance.element.querySelector(`[data-filter-menu="${field}"]`);

            if (!filterMenuElement) {
                var fieldsHTML = `<div>
                                        <input data-all type="checkbox" id="all_${field}" name="all_${field}" checked>
                                        <label for="all_${field}">[All]</label>
                                    </div>`;

                var vals = [];
                for (var i = 0; i < that.instance.config.nodes.length; i++) {
                    var val = that.instance.config.nodes[i][field];
                    if (!OrgChart.isNEU(val) && !vals.has(val)) {
                        fieldsHTML += `<div>
                                    <input type="checkbox" id="${val}" name="${val}" checked>
                                    <label for="${val}">${val}</label>
                                </div>`;
                        vals.push(val);
                    }
                }


                filterMenuElement = document.createElement('div');
                filterMenuElement.innerHTML = `<fieldset>
                                                    <legend>Filter by ${field}:</legend>
                                                    ${fieldsHTML}
                                                </fieldset>`;
                filterMenuElement.setAttribute('data-filter-menu', field);
                filterMenuElement.classList.add('boc-filter-menu');
                e.target.parentNode.parentNode.appendChild(filterMenuElement);


                var checkBoxElements = filterMenuElement.querySelectorAll('input');
                for (var i = 0; i < checkBoxElements.length; i++) {
                    checkBoxElements[i].addEventListener('change', function (e) {
                        if (e.target.hasAttribute('data-all')) {
                            var inputElements = e.target.parentNode.parentNode.querySelectorAll('input');
                            for (var j = 0; j < inputElements.length; j++) {
                                if (inputElements[j] != e.target) {
                                    inputElements[j].checked = e.target.checked;
                                }
                            }
                        }


                        that.instance.draw();
                    });
                }
            }

            filterMenuElement.style.display = 'block';

            e.target.classList.add('filter-field-selected');

            filterCloseElement = document.createElement('div');
            filterCloseElement.classList.add('close');
            filterCloseElement.innerHTML = 'x';
            filterCloseElement.setAttribute('data-filter-close', '');
            e.target.parentNode.appendChild(filterCloseElement);
        }
    });

    this.instance.element.appendChild(filterElement);
};

if (typeof (OrgChart) == "undefined") {
    OrgChart = {};
}

OrgChart.local = {};


OrgChart.local._setPositions = function (roots, layoutConfigs, callback) {
    var borders = {};

    for(var i = 0; i < roots.length; i++){
        var root = roots[i];
        if (root.stContainerNodes){
            for(var j = root.stContainerNodes.length - 1; j >= 0; j--){
                var stContainerNode = root.stContainerNodes[j];
                var border = OrgChart.local._walk(stContainerNode.stChildren, layoutConfigs);
                console.log(border.maxX);
                stContainerNode.w = border.maxX - border.minX + stContainerNode.padding[3] + stContainerNode.padding[1];
                stContainerNode.h = border.maxY - border.minY + stContainerNode.padding[0] + stContainerNode.padding[2];
                if (stContainerNode._m){
                    stContainerNode._m.w = stContainerNode.w;
                    stContainerNode._m.h = stContainerNode.h;
                }

                borders[stContainerNode.id] = border;
            }
        }
    }

    OrgChart.local._walk(roots, layoutConfigs);

    for(var i = 0; i < roots.length; i++){
        var root = roots[i];
        if (root.stContainerNodes){
            for(var j = 0; j < root.stContainerNodes.length; j++){
                var stContainerNode = root.stContainerNodes[j];
                var adjustX = stContainerNode.x;
                var adjustY = stContainerNode.y;
                for(var k = 0; k < stContainerNode.stChildren.length; k++){
                    var stChildren = stContainerNode.stChildren[k];
                    OrgChart.local._lastWalk(stChildren, adjustX, adjustY, borders[stContainerNode.id], stContainerNode.padding)
                }
            }
        }
    }

    callback();
};


OrgChart.local._walk = function (roots, layoutConfigs) {

    var border = {
        minX: null,
        minY: null,
        maxX: null,
        maxY: null
    };

    var maxLevelHeightArr = [];
    var maxTreeRowHeightArr = [];
    var previousLevelNodeArr = [];

    //START do not change the tworoot iterations bug https://jsfiddle.net/BALKANGraph/ztmebjcq/
    for (var i = 0; i < roots.length; i++) {

        var configName = roots[i].lcn ? roots[i].lcn : "base";
        var config = layoutConfigs[configName];

         var row = parseInt(i / config.columns);
         var column = i - row * config.columns;
        if (column == 0) {
            previousLevelNodeArr = [];
        };
        OrgChart.local._firstWalk(roots[i],  0, maxLevelHeightArr, previousLevelNodeArr, config);
    }

    for (var i = 0; i < roots.length; i++) {
        var configName = roots[i].lcn ? roots[i].lcn : "base";
        var config = layoutConfigs[configName];
        var row = parseInt(i / config.columns);
        var column = i - row * config.columns;
        var y = 0;
        if (row > 0) {
            y = maxTreeRowHeightArr[row - 1] + config.siblingSeparation;
        };
        OrgChart.local._secondWalk(roots[i], 0, 0, y, maxLevelHeightArr, border, config);
        maxTreeRowHeightArr[row] = border.maxY - border.minY;

        switch (config.orientation) {
            case OrgChart.orientation.right:
            case OrgChart.orientation.right_top:
            case OrgChart.orientation.left:
            case OrgChart.orientation.left_top:
                maxTreeRowHeightArr[row] = border.maxX - border.minX;
                break;
        }
    }
    //END do not change the tworoot iterations bug https://jsfiddle.net/BALKANGraph/ztmebjcq/

    return border;
};


//Layout algorithm
OrgChart.local._firstWalk = function (node, level, maxLevelHeightArr, previousLevelNodeArr, config) {
    if (node.isPartner){
        return;
    }
    var leftSibling = null;
    node.x = 0;
    node.y = 0;
    node._prelim = 0;
    node._modifier = 0;
    node.leftNeighbor = null;
    node.rightNeighbor = null;
    OrgChart.local._setLevelMaxNodeHeight(node, level, maxLevelHeightArr, config);
    OrgChart.local._setNeighbors(node, level, previousLevelNodeArr);


    if (!OrgChart.local._hasChildren(node) || level == OrgChart.MAX_DEPTH) {
        leftSibling = OrgChart.local._getLeftSibling(node);
        if (leftSibling != null) {
            var siblingSeparation = config.siblingSeparation;

            if (node.isAssistant){
                siblingSeparation = config.assistantSeparation;
            }
            else if (leftSibling.layout == 2) {
                siblingSeparation = config.mixedHierarchyNodesSeparation;
            }
            else if (leftSibling.parent && leftSibling.parent.hasPartners == 4 && config.orientation <= 3) {
                var parentSize = OrgChart.local._size(leftSibling.parent, config);
                var leftMid = OrgChart.local._rightMidPoint(leftSibling, config);

                 siblingSeparation = leftSibling.parent.partnerSeparation  + parentSize / 2 - leftMid;
                 if (siblingSeparation < config.siblingSeparation){
                    siblingSeparation = config.siblingSeparation;
                 }
            }

            node._prelim = leftSibling._prelim + OrgChart.local._nodeWithPartnersSize(leftSibling, config) + siblingSeparation;
        }
        else {
            node._prelim = 0;
        }
    }
    else {
        var n = node.children.length;
        for (var i = 0; i < n; i++) {
            OrgChart.local._firstWalk(node.children[i], level + 1, maxLevelHeightArr, previousLevelNodeArr, config);
        }

        var fChildNode = OrgChart.local._fChild(node);
        var lChildNode = node.children[node.children.length - 1];

        var midPoint = fChildNode._prelim + (lChildNode._prelim - fChildNode._prelim) / 2 + OrgChart.local._leftMidPoint(lChildNode, config);

        //#307 fix
        //#620 fix
        if (fChildNode.isAssistant && lChildNode.isAssistant && node.children.length > 1 && node.children[1].isSplit){
            midPoint = node.children[1]._prelim + OrgChart.local._mid(node.children[1], config);
            //midPoint = fChildNode._prelim + (lChildNode._prelim - fChildNode._prelim) / 2 + OrgChart.local._leftMidPoint(fChildNode, config);
        }


        midPoint -= OrgChart.local._mid(node, config);


        leftSibling = OrgChart.local._getLeftSibling(node);

        if (leftSibling != null) {

            var siblingSeparation = config.siblingSeparation;

            if (node.isAssistant && node.isSplit){
                siblingSeparation = config.assistantSeparation;
            }
            else if (leftSibling.layout == 2) {
                siblingSeparation = config.mixedHierarchyNodesSeparation;
            }
            else if (leftSibling.parent && leftSibling.parent.hasPartners == 4 && config.orientation <= 3) {
                var parentSize = OrgChart.local._size(leftSibling.parent, config);
                var leftMid = OrgChart.local._rightMidPoint(leftSibling, config);
                //fix removed * 15, if you change test data ([{id: 1},{id: 2, pid: 1, tags: ['partner']},{id: 3, pid: 1, tags: ['partner']},{id: 4, pid: 1, ppid: 3},{id: 5, pid: 1, ppid: 2},{id: 6, pid: 5, tags: ['partner']},{id: 7, pid: 5, ppid: 6}]
                 siblingSeparation = leftSibling.parent.partnerSeparation /* * 15 */ + parentSize / 2 - leftMid;
                 if (siblingSeparation < config.siblingSeparation){
                    siblingSeparation = config.siblingSeparation;
                 }
            }

            node._prelim = leftSibling._prelim + OrgChart.local._nodeWithPartnersSize(leftSibling, config) + siblingSeparation;
            node._modifier = node._prelim - midPoint;

            OrgChart.local._apportion(node, level, maxLevelHeightArr, config);
        }
        else if (config.orientation <= 3) {
            node._prelim = midPoint;
        }
        else {
            node._prelim = 0;
        }

        // console.log(node._prelim);

        // if (node._prelim == 1300) {node._prelim = 400;node._modifier = 0;}
    }
};

OrgChart.local._secondWalk = function (node, level, X, Y, maxLevelHeightArr, border, config) {
    if (level <= OrgChart.MAX_DEPTH && !node.isPartner ) {
        var xTmp = node._prelim + X;
        var yTmp = Y;
        var maxsizeTmp = 0;
        var nodesizeTmp = 0;

        maxsizeTmp = maxLevelHeightArr[level];
        nodesizeTmp = OrgChart.local._getNodeHeight(node, config);

        if (node.layout && !node.isSplit){ //node.layout 1 or 2
            maxsizeTmp = nodesizeTmp;
        }
        else if (node.layout && node.isSplit){//node.layout 1 or 2
            if (node.leftNeighbor && node.leftNeighbor.layout && node.leftNeighbor.id.toString().indexOf('mirror') == -1){//node.leftNeighbor.layout 1 or 2
                maxsizeTmp = OrgChart.local._getNodeHeight(node.leftNeighbor, config);
            }
            else if (node.rightNeighbor && node.rightNeighbor.layout && node.rightNeighbor.id.toString().indexOf('mirror') == -1){//node.rightNeighbor.layout 1 or 2
                maxsizeTmp = OrgChart.local._getNodeHeight(node.rightNeighbor, config);
            }
        }

        node.x = xTmp;
        node.y = yTmp;

        if (node.hasPartners){
            OrgChart.local.nodeHasPartnersPosition(node, config, maxsizeTmp);
        }


        if (node.isSplit || (node.isAssistant || node.layout == 2)) {
            node.y = yTmp + maxsizeTmp / 2 - nodesizeTmp / 2;
        }


        switch (config.orientation) {
            case OrgChart.orientation.right:
            case OrgChart.orientation.right_top:
            case OrgChart.orientation.left:
            case OrgChart.orientation.left_top:
                var swapTmp = node.x;
                node.x = node.y;
                node.y = swapTmp;
                break;
        }

        switch (config.orientation) {
            case OrgChart.orientation.bottom:
            case OrgChart.orientation.bottom_left:
                node.y = -node.y - nodesizeTmp;
                break;

            case OrgChart.orientation.right:
            case OrgChart.orientation.right_top:
                node.x = -node.x - nodesizeTmp;
                break;
        }

        OrgChart._setMinMaxXY(node, border);

        if (node.children != 0) { //do not use OrgChart.local._hasChildren here will not render partners
            var levelSeparation = config.levelSeparation;
            if (node.layout) {//node.layout 1 or 2
                levelSeparation = config.mixedHierarchyNodesSeparation;
            }
            var index = 0;
            OrgChart.local._secondWalk(node.children[index], level + 1, X + node._modifier, Y + maxsizeTmp + levelSeparation, maxLevelHeightArr, border, config);
            if (node.children[index].isPartner){
                while(node.children.length - 1 > index && node.children[index].isPartner){
                    //fix https://code.balkan.app/cartel--requirement#JS
                    OrgChart._setMinMaxXY(node.children[index], border);
                    index++;
                }
                //fix https://code.balkan.app/cartel--requirement#JS
                OrgChart._setMinMaxXY(node.children[index], border);

                OrgChart.local._secondWalk(node.children[index], level + 1, X + node._modifier, Y + maxsizeTmp + levelSeparation, maxLevelHeightArr, border, config);
            }
        }
        var rightSibling = OrgChart.local._getRightSibling(node);

        if (rightSibling != null) {
            OrgChart.local._secondWalk(rightSibling, level, X, Y, maxLevelHeightArr, border, config);
        }
    }
    else{
       OrgChart.local.nodeIsPartnerPosition(node, config, maxLevelHeightArr, level);
    }
};

OrgChart.local._lastWalk = function (node, adjustX, adjustY, border, padding) {
    node.x += adjustX + padding[3] - border.minX;
    node.y += adjustY + padding[0] - border.minY;
    var n = node.children.length;
    for (var i = 0; i < n; i++) {
        var iChild = node.children[i];
        OrgChart.local._lastWalk(iChild, adjustX, adjustY, border, padding);
    }
};


OrgChart.local._apportion = function (node, level, maxLevelHeightArr, config) {
    if (node.isPartner){
        return;
    }
    var firstChild = OrgChart.local._fChild(node);
    var firstChildLeftNeighbor = firstChild.leftNeighbor;
    var j = 1;
    for (var k = OrgChart.MAX_DEPTH - level; firstChild != null && firstChildLeftNeighbor != null && j <= k;) {
        var modifierSumRight = 0;
        var modifierSumLeft = 0;
        var rightAncestor = firstChild;
        var leftAncestor = firstChildLeftNeighbor;
        for (var l = 0; l < j; l++) {
            rightAncestor = rightAncestor.parent;
            leftAncestor = leftAncestor.parent;
            modifierSumRight += rightAncestor._modifier;
            modifierSumLeft += leftAncestor._modifier;
        }

        var subtreeSeparation = config.subtreeSeparation;

        if (node.leftNeighbor && node.leftNeighbor.layout == 2) {
            subtreeSeparation = 0;
        }

        var totalGap = (firstChildLeftNeighbor._prelim + modifierSumLeft + OrgChart.local._nodeWithPartnersSize(firstChildLeftNeighbor, config) + subtreeSeparation) - (firstChild._prelim + modifierSumRight);
        if (totalGap > 0) {
            var subtreeAux = node;
            var numSubtrees = 0;
            for (; subtreeAux != null && subtreeAux != leftAncestor; subtreeAux = OrgChart.local._getLeftSibling(subtreeAux))
                numSubtrees++;


            if (subtreeAux != null) {
                var subtreeMoveAux = node;
                var singleGap = totalGap / numSubtrees;
                for (; subtreeMoveAux != leftAncestor; subtreeMoveAux = OrgChart.local._getLeftSibling(subtreeMoveAux)) {
                    var shouldSetGaps = true;

                    if (subtreeMoveAux.layout){
                        var levelHeight = maxLevelHeightArr[level];
                        var args = {config: config, node: node, size: -config.mixedHierarchyNodesSeparation};

                        if (args.node.id.toString().indexOf('mirror') != -1){
                            var id = args.node.id.toString().replace('_mirror', '');
                            for(var i = 0; i < args.node.parent.children.length; i++){
                                if (args.node.parent.children[i].id == id){
                                    args.node = args.node.parent.children[i];
                                    break;
                                }
                            }
                        }
                        OrgChart.local._mixedTreeHeight(args);
                        shouldSetGaps = levelHeight < args.size;
                    }

                    if (shouldSetGaps){
                        subtreeMoveAux._prelim += totalGap;
                        subtreeMoveAux._modifier += totalGap;
                        totalGap -= singleGap;
                    }
                }
            }
        }
        j++;
        if (!OrgChart.local._hasChildren(firstChild))
            firstChild = OrgChart.local._getLeftmost(node, 0, j);
        else
            firstChild = OrgChart.local._fChild(firstChild);
        if (firstChild != null)
            firstChildLeftNeighbor = firstChild.leftNeighbor;
    }
}

OrgChart.local._mixedTreeHeight = function (args) {
    args.size += OrgChart.local._getNodeHeight(args.node, args.config) + args.config.mixedHierarchyNodesSeparation;

    for(var i = 0; i < args.node.children.length; i++){
        args.node = args.node.children[i];
        OrgChart.local._mixedTreeHeight(args);
    }

    return;
}

OrgChart.local._setLevelMaxNodeHeight = function (node, level, maxLevelHeightArr, config) {
    if (maxLevelHeightArr[level] == null)
        maxLevelHeightArr[level] = 0;


    var h = OrgChart.local._getNodeHeight(node, config);


    if (maxLevelHeightArr[level] < h)
        maxLevelHeightArr[level] = h;
};


OrgChart.local._setNeighbors = function (node, level, previousLevelNodeArr) {
    if (previousLevelNodeArr[level] && previousLevelNodeArr[level].id === node.id) {
        return;
    }

    node.leftNeighbor = previousLevelNodeArr[level];

    if (node.leftNeighbor != null)
        node.leftNeighbor.rightNeighbor = node;

    if (!node.isPartner)
        previousLevelNodeArr[level] = node;
};


OrgChart.local._nodeWithPartnersSize = function (node, config) {
    switch (config.orientation) {
        case OrgChart.orientation.top:
        case OrgChart.orientation.top_left:
        case OrgChart.orientation.bottom:
        case OrgChart.orientation.bottom_left:
            return OrgChart.local._getPartnerRightPanelWidth(node, config) + node.w + OrgChart.local._getPartnerLeftPanelWidth(node, config);

        case OrgChart.orientation.right:
        case OrgChart.orientation.right_top:
        case OrgChart.orientation.left:
        case OrgChart.orientation.left_top:
            return OrgChart.local._getPartnerRightPanelHeight(node, config) + node.h + OrgChart.local._getPartnerLeftPanelHeight(node, config);
    }

    return 0;
};

OrgChart.local._size = function (node, config) {
    switch (config.orientation) {
        case OrgChart.orientation.top:
        case OrgChart.orientation.top_left:
        case OrgChart.orientation.bottom:
        case OrgChart.orientation.bottom_left:
            return node.w;
        case OrgChart.orientation.right:
        case OrgChart.orientation.right_top:
        case OrgChart.orientation.left:
        case OrgChart.orientation.left_top:
            return node.h;
    }

    return 0;
};

OrgChart.local._leftMidPoint = function (node, config) {
    switch (config.orientation) {
        case OrgChart.orientation.top:
        case OrgChart.orientation.top_left:
        case OrgChart.orientation.bottom:
        case OrgChart.orientation.bottom_left:
            return OrgChart.local._getPartnerLeftPanelWidth(node, config)  + node.w / 2;
        case OrgChart.orientation.right:
        case OrgChart.orientation.right_top:
        case OrgChart.orientation.left:
        case OrgChart.orientation.left_top:
            return OrgChart.local._getPartnerLeftPanelHeight(node, config) + node.h / 2;
    }

    return 0;
};

OrgChart.local._rightMidPoint = function (node, config) {
    switch (config.orientation) {
        case OrgChart.orientation.top:
        case OrgChart.orientation.top_left:
        case OrgChart.orientation.bottom:
        case OrgChart.orientation.bottom_left:
            return OrgChart.local._getPartnerRightPanelWidth(node, config)  + node.w / 2;
        case OrgChart.orientation.right:
        case OrgChart.orientation.right_top:
        case OrgChart.orientation.left:
        case OrgChart.orientation.left_top:
            return OrgChart.local._getPartnerRightPanelHeight(node, config) + node.h / 2;
    }

    return 0;
};

OrgChart.local._mid = function (node, config) {
    switch (config.orientation) {
        case OrgChart.orientation.top:
        case OrgChart.orientation.top_left:
        case OrgChart.orientation.bottom:
        case OrgChart.orientation.bottom_left:
            switch (node.hasPartners){
                case 2:
                    return OrgChart.local._getPartnerLeftPanelWidth(node, config) - node.partnerSeparation / 2;
                case 3:
                    return OrgChart.local._getPartnerLeftPanelWidth(node, config)  + node.w  + node.partnerSeparation / 2;
                case 4: {
                    if (config.orientation <= 3){
                        var leftMid = OrgChart.local._rightMidPoint(OrgChart.local._fChild(node), config);
                        var rightMid = OrgChart.local._leftMidPoint(node.children[node.children.length - 1], config);
                        return OrgChart.local._getPartnerLeftPanelWidth(node, config)  + node.w / 2 + (rightMid - leftMid) / 2;
                    }
                    else{
                        return OrgChart.local._getPartnerLeftPanelWidth(node, config)  + node.w / 2;
                    }
                }
                default:
                    return OrgChart.local._getPartnerLeftPanelWidth(node, config)  + node.w / 2;
            }

        case OrgChart.orientation.right:
        case OrgChart.orientation.right_top:
        case OrgChart.orientation.left:
        case OrgChart.orientation.left_top:
            switch (node.hasPartners){
                case 2:
                    return OrgChart.local._getPartnerLeftPanelHeight(node, config) - node.partnerSeparation / 2;
                case 3:
                    return OrgChart.local._getPartnerLeftPanelHeight(node, config)  + node.h  + node.partnerSeparation / 2;
                case 4: {
                    if (config.orientation <= 3){
                        var leftMid = OrgChart.local._rightMidPoint(OrgChart.local._fChild(node), config);
                        var rightMid = OrgChart.local._leftMidPoint(node.children[node.children.length - 1], config);
                        return OrgChart.local._getPartnerLeftPanelHeight(node, config)  + node.h / 2 + (rightMid - leftMid) / 2;
                    }
                    else{
                        return OrgChart.local._getPartnerLeftPanelHeight(node, config)  + node.h / 2;
                    }
                }
                default:
                    return OrgChart.local._getPartnerLeftPanelHeight(node, config)  + node.h / 2;
            }
    }

    return 0;
};

OrgChart.local._getNodeHeight = function (node, config) {
    switch (config.orientation) {
        case OrgChart.orientation.top:
        case OrgChart.orientation.top_left:
        case OrgChart.orientation.bottom:
        case OrgChart.orientation.bottom_left:
            return Math.max(OrgChart.local._getPartnerRightPanelHeight(node, config),  node.h, OrgChart.local._getPartnerLeftPanelHeight(node, config));

        case OrgChart.orientation.right:
        case OrgChart.orientation.right_top:
        case OrgChart.orientation.left:
        case OrgChart.orientation.left_top:
            return Math.max(OrgChart.local._getPartnerRightPanelWidth(node, config),  node.w, OrgChart.local._getPartnerLeftPanelWidth(node, config));
    }

    return 0;
};



OrgChart.local._getLeftSibling = function (node) {
    if ((node.leftNeighbor != null && node.leftNeighbor.parent == node.parent)) {
        return node.leftNeighbor;
    }
    else
        return null;
};

OrgChart.local._getRightSibling = function (node) {
    if (node.rightNeighbor != null && node.rightNeighbor.parent == node.parent)
        return node.rightNeighbor;
    else
        return null;
};

OrgChart.local._getLeftmost = function (node, level, maxlevel) {
    if (level >= maxlevel) {
        return node;
    }
    if (!OrgChart.local._hasChildren(node)) {
        return null;
    }

    var n = node.children.length;
    for (var i = 0; i < n; i++) {
        var cnode = node.children[i];
        if (cnode.isPartner) continue;
        var leftmostDescendant = OrgChart.local._getLeftmost(cnode, level + 1, maxlevel);
        if (leftmostDescendant != null){
            return leftmostDescendant;
        }
    }

    return null;
};

OrgChart.local.nodeHasPartnersPosition = function (node, config, maxsizeTmp) {
    switch (config.orientation) {
        case OrgChart.orientation.top:
        case OrgChart.orientation.top_left:
        case OrgChart.orientation.bottom:
        case OrgChart.orientation.bottom_left:
            var lpw = OrgChart.local._getPartnerLeftPanelWidth(node, config);
            node.x += lpw;

            if (node.h < maxsizeTmp){
                if (config.orientation == OrgChart.orientation.bottom || config.orientation == OrgChart.orientation.bottom_left){
                    node.y -= ((maxsizeTmp - node.h) / 2);
                }
                else{
                    node.y += ((maxsizeTmp - node.h) / 2);
                }
            }
            break;
        case OrgChart.orientation.right:
        case OrgChart.orientation.right_top:
        case OrgChart.orientation.left:
        case OrgChart.orientation.left_top:
            var lph = OrgChart.local._getPartnerLeftPanelHeight(node, config);
            node.x += lph;

            if (node.w < maxsizeTmp){
                if (config.orientation == OrgChart.orientation.right || config.orientation == OrgChart.orientation.right_top){
                    node.y -= ((maxsizeTmp - node.w) / 2);
                }
                else{
                    node.y += ((maxsizeTmp - node.w) / 2);
                }
            }
            break;
    }
}

OrgChart.local.nodeIsPartnerPosition = function (node, config, maxLevelHeightArr, level) {
    var h_left = 0;
    var h_right = 0;

    var partnerRightX = 0;
    var partnerRightY = 0;
    var partnerLeftX = 0;
    var partnerLeftY = 0;

    var prevLeftH = 0;
    var prevRightH = 0;

    var isFirstRightPartner = true;
    var isFirstLeftPartner = true;

    switch (config.orientation) {
        case OrgChart.orientation.top:
        case OrgChart.orientation.top_left:
        case OrgChart.orientation.bottom:
        case OrgChart.orientation.bottom_left:
            h_left = OrgChart.local._getPartnerLeftPanelHeight(node.parent, config);
            h_right = OrgChart.local._getPartnerRightPanelHeight(node.parent, config);
            for (var i = 0; i < node.parent.children.length; i++){
                var cnode = node.parent.children[i];
                if (cnode.isPartner == 1){
                    partnerRightX = node.parent.x + node.parent.w + node.parent.partnerSeparation ;
                    if (isFirstRightPartner){
                        partnerRightY = (node.parent.y - ((maxLevelHeightArr[level - 1] - node.parent.h) / 2)) + ((maxLevelHeightArr[level - 1] - h_right) / 2) ;
                        prevRightH = cnode.h;
                        isFirstRightPartner = false;
                    }
                    else{
                        partnerRightY += (prevRightH + config.partnerNodeSeparation);
                        prevRightH = cnode.h;
                    }
                    cnode.x = partnerRightX;
                    cnode.y = partnerRightY;
                }
                else if (cnode.isPartner == 2){
                    partnerLeftX = node.parent.x - cnode.w - node.parent.partnerSeparation;
                    if (isFirstLeftPartner){
                        partnerLeftY = node.parent.y - ((maxLevelHeightArr[level - 1] - node.parent.h) / 2) + ((maxLevelHeightArr[level - 1] - h_left) / 2);
                        prevLeftH = cnode.h;
                        isFirstLeftPartner = false;
                    }
                    else{
                        partnerLeftY += (prevLeftH + config.partnerNodeSeparation);
                        prevLeftH = cnode.h;
                    }
                    cnode.x = partnerLeftX;
                    cnode.y = partnerLeftY;
                }
            }
            break;
        case OrgChart.orientation.right:
        case OrgChart.orientation.right_top:
        case OrgChart.orientation.left:
        case OrgChart.orientation.left_top:
            h_left = OrgChart.local._getPartnerLeftPanelWidth(node.parent, config);
            h_right = OrgChart.local._getPartnerRightPanelWidth(node.parent, config);

            for (var i = 0; i < node.parent.children.length; i++){
                var cnode = node.parent.children[i];
                if (!cnode) continue;
                if (cnode.isPartner == 1){
                    partnerRightY = node.parent.y + node.parent.h + node.parent.partnerSeparation;
                    if (isFirstRightPartner){
                        partnerRightX = (node.parent.x - ((maxLevelHeightArr[level - 1] - node.parent.w) / 2)) + ((maxLevelHeightArr[level - 1] - h_right) / 2) ;
                        prevRightH = cnode.w;
                        isFirstRightPartner = false;
                    }
                    else{
                        partnerRightX += (prevRightH + config.partnerNodeSeparation);
                        prevRightH = cnode.w;
                    }
                    cnode.x = partnerRightX;
                    cnode.y = partnerRightY;
                }
                else if (cnode.isPartner == 2){
                    partnerLeftY = node.parent.y - cnode.h - node.parent.partnerSeparation;
                    if (isFirstLeftPartner){
                        partnerLeftX = node.parent.x - ((maxLevelHeightArr[level - 1] - node.parent.w) / 2) + ((maxLevelHeightArr[level - 1] - h_left) / 2);
                        prevLeftH = cnode.w;
                        isFirstLeftPartner = false;
                    }
                    else{
                        partnerLeftX += (prevLeftH + config.partnerNodeSeparation);
                        prevLeftH = cnode.w;
                    }
                    cnode.x = partnerLeftX;
                    cnode.y = partnerLeftY;
                }
            }
            break;
    }
}


OrgChart.local._getPartnerRightPanelWidth = function (node, config) {
    if (!node.hasPartners){
        return 0;
    }
    var w = 0;
    switch (config.orientation) {
        case OrgChart.orientation.top:
        case OrgChart.orientation.top_left:
        case OrgChart.orientation.bottom:
        case OrgChart.orientation.bottom_left:
            for (var i = 0; i < node.children.length; i++){
                var cnode = node.children[i];
                if (cnode.isPartner == 1 && cnode.w > w){
                    w = cnode.w;
                }
            }

            if (w){
                w += node.partnerSeparation;
            }
            return w;
        case OrgChart.orientation.right:
        case OrgChart.orientation.right_top:
        case OrgChart.orientation.left:
        case OrgChart.orientation.left_top:
            for (var i = 0; i < node.children.length; i++){
                var cnode = node.children[i];
                if (cnode.isPartner == 1){
                    w += cnode.w + config.partnerNodeSeparation;
                }
            }

            if (w){
                w -= config.partnerNodeSeparation;
            }

            return w;

    }
};


OrgChart.local._getPartnerLeftPanelWidth = function (node, config) {
    if (!node.hasPartners){
        return 0;
    }
    var w = 0;
    switch (config.orientation) {
        case OrgChart.orientation.top:
        case OrgChart.orientation.top_left:
        case OrgChart.orientation.bottom:
        case OrgChart.orientation.bottom_left:
            for (var i = 0; i < node.children.length; i++){
                var cnode = node.children[i];
                if (cnode.isPartner == 2 && cnode.w > w){
                    w = cnode.w;
                }
            }

            if (w){
                w += node.partnerSeparation;
            }
            return w;
        case OrgChart.orientation.right:
        case OrgChart.orientation.right_top:
        case OrgChart.orientation.left:
        case OrgChart.orientation.left_top:
            for (var i = 0; i < node.children.length; i++){
                var cnode = node.children[i];
                if (cnode.isPartner == 2){
                    w += cnode.w + config.partnerNodeSeparation;
                }
            }

            if (w){
                w -= config.partnerNodeSeparation;
            }

            return w;
    }
};



OrgChart.local._getPartnerRightPanelHeight = function (node, config) {
    if (!node.hasPartners){
        return 0;
    }
    var h = 0;
    switch (config.orientation) {
        case OrgChart.orientation.top:
        case OrgChart.orientation.top_left:
        case OrgChart.orientation.bottom:
        case OrgChart.orientation.bottom_left:
            for (var i = 0; i < node.children.length; i++){
                var cnode = node.children[i];
                if (cnode.isPartner == 1){
                    h += cnode.h + config.partnerNodeSeparation;
                }
            }

            if (h){
                h -= config.partnerNodeSeparation;
            }

            return h;
        case OrgChart.orientation.right:
        case OrgChart.orientation.right_top:
        case OrgChart.orientation.left:
        case OrgChart.orientation.left_top:
            for (var i = 0; i < node.children.length; i++){
                var cnode = node.children[i];
                if (cnode.isPartner == 1 && cnode.h > h){
                    h = cnode.h;
                }
            }

            if (h){
                h += node.partnerSeparation;
            }
            return h;
    }
};


OrgChart.local._getPartnerLeftPanelHeight = function (node, config) {
    if (!node.hasPartners){
        return 0;
    }
    var h = 0;
    switch (config.orientation) {
        case OrgChart.orientation.top:
        case OrgChart.orientation.top_left:
        case OrgChart.orientation.bottom:
        case OrgChart.orientation.bottom_left:
            for (var i = 0; i < node.children.length; i++){
                var cnode = node.children[i];
                if (cnode.isPartner == 2){
                    h += cnode.h + config.partnerNodeSeparation;
                }
            }

            if (h){
                h -= config.partnerNodeSeparation;
            }

            return h;
        case OrgChart.orientation.right:
        case OrgChart.orientation.right_top:
        case OrgChart.orientation.left:
        case OrgChart.orientation.left_top:

            for (var i = 0; i < node.children.length; i++){
                var cnode = node.children[i];
                if (cnode.isPartner == 2 && cnode.h > h){
                    h = cnode.h;
                }
            }

            if (h){
                h += node.partnerSeparation;
            }
            return h;
    }
};


OrgChart.local._fChild = function (node) {
    var index  = 0;

    while(index < node.children.length && node.children[index].isPartner){
        index++;
    }

    return node.children[index];
}

OrgChart.local._hasChildren = function (node) {
    for(var i = 0; i < node.children.length; i++)
        if (!node.children[i].isPartner)
            return true


    return false;
}





