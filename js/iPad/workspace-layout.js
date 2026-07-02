/*
========================================================
AI Director Assistant
V10 Foundation-R1
Package-3
Release-002

File:
js/ipad/workspace-layout.js

Architecture:
Dynamic Workspace Layout Engine

Depends:
event-bus.js
fixed-workspace-engine.js
workspace-state.js

Status:
Foundation Stable
========================================================
*/

(function(global){

    "use strict";

    if(!global.AIDirector){
        global.AIDirector = {};
    }

    if(!global.AIDirector.iPad){
        global.AIDirector.iPad = {};
    }

    class WorkspaceLayoutEngine {

        constructor(){

            //----------------------------------------
            // State
            //----------------------------------------

            this.container = null;

            this.panels = [];

            this.handles = [];

            this.dragging = false;

            this.currentHandle = null;

            //----------------------------------------
            // Constraints
            //----------------------------------------

            this.minWidth = 180;

            this.maxWidth = 80;

            //----------------------------------------
            // Layout
            //----------------------------------------

            this.layout = {

                script:20,
                scene:20,
                shot:20,
                detail:20,
                storyboard:20
            };
        }

        //----------------------------------------
        // Initialize
        //----------------------------------------

        initialize(container){

            this.container =
                container;

            this.collectPanels();

            this.createHandles();

            this.bindEvents();

            this.load();

            this.emit(
                "layout.initialized"
            );
        }

        //----------------------------------------
        // Panel Collection
        //----------------------------------------

        collectPanels(){

            this.panels =
                Array.from(
                    document.querySelectorAll(
                        ".ipad-panel"
                    )
                );
        }

        //----------------------------------------
        // Create Handles
        //----------------------------------------

        createHandles(){

            this.handles = [];

            for(
                let i=0;
                i<this.panels.length-1;
                i++
            ){

                const handle =
                    document
                        .createElement(
                            "div"
                        );

                handle.className =
                    "workspace-resize-handle";

                handle.dataset.index =
                    i;

                this.panels[i]
                    .after(
                        handle
                    );

                this.handles.push(
                    handle
                );
            }
        }

        //----------------------------------------
        // Resize
        //----------------------------------------

        resize(
            leftId,
            rightId,
            delta
        ){

            const left =
                this.layout[
                    leftId
                ];

            const right =
                this.layout[
                    rightId
                ];

            const total =
                left + right;

            let newLeft =
                left + delta;

            let newRight =
                total - newLeft;

            if(
                newLeft < 5 ||
                newRight < 5
            ){
                return;
            }

            this.layout[
                leftId
            ] = newLeft;

            this.layout[
                rightId
            ] = newRight;

            this.apply();

            this.emit(
                "layout.resized",
                {
                    leftId,
                    rightId
                }
            );
        }

        //----------------------------------------
        // Apply
        //----------------------------------------

        apply(){

            Object
                .keys(
                    this.layout
                )
                .forEach(
                    id => {

                        const panel =
                            document
                                .querySelector(
                                    `[data-workspace="${id}"]`
                                );

                        if(panel){

                            panel
                                .style
                                .flex =
                                    this
                                        .layout[
                                            id
                                        ];
                        }
                    }
                );

            this.save();
        }

        //----------------------------------------
        // Equal
        //----------------------------------------

        equalize(){

            Object
                .keys(
                    this.layout
                )
                .forEach(
                    id =>
                        this
                            .layout[
                                id
                            ] = 20
                );

            this.apply();

            this.emit(
                "layout.equalized"
            );
        }

        //----------------------------------------
        // Expand
        //----------------------------------------

        expand(
            workspaceId
        ){

            const expand =
                60;

            const remain =
                10;

            Object
                .keys(
                    this.layout
                )
                .forEach(
                    id => {

                        this.layout[
                            id
                        ] =
                            id ===
                            workspaceId
                            ?
                            expand
                            :
                            remain;
                    }
                );

            this.apply();

            this.emit(
                "layout.expanded",
                {
                    workspaceId
                }
            );
        }

        //----------------------------------------
        // Save
        //----------------------------------------

        save(){

            localStorage
                .setItem(
                    "AI_DIRECTOR_LAYOUT",
                    JSON.stringify(
                        this.layout
                    )
                );
        }

        //----------------------------------------
        // Load
        //----------------------------------------

        load(){

            const data =
                localStorage
                    .getItem(
                        "AI_DIRECTOR_LAYOUT"
                    );

            if(
                !data
            ){
                return;
            }

            this.layout =
                JSON.parse(
                    data
                );

            this.apply();

            this.emit(
                "layout.loaded"
            );
        }

        //----------------------------------------
        // Snapshot
        //----------------------------------------

        snapshot(){

            return {

                timestamp:
                    Date.now(),

                layout:
                    structuredClone(
                        this.layout
                    )
            };
        }

        //----------------------------------------
        // Restore
        //----------------------------------------

        restore(
            snapshot
        ){

            this.layout =
                structuredClone(
                    snapshot
                        .layout
                );

            this.apply();

            this.emit(
                "layout.restored"
            );
        }

        //----------------------------------------
        // Events
        //----------------------------------------

        bindEvents(){

            this.handles
                .forEach(
                    handle => {

                        handle
                            .addEventListener(
                                "mousedown",
                                e => {

                                    this.dragging =
                                        true;

                                    this.currentHandle =
                                        parseInt(
                                            handle
                                                .dataset
                                                .index
                                        );

                                    e.preventDefault();
                                }
                            );
                    }
                );

            document
                .addEventListener(
                    "mousemove",
                    e => {

                        if(
                            !this.dragging
                        ){
                            return;
                        }

                        const left =
                            this.panels[
                                this.currentHandle
                            ]
                                .dataset
                                .workspace;

                        const right =
                            this.panels[
                                this.currentHandle
                                +1
                            ]
                                .dataset
                                .workspace;

                        this.resize(
                            left,
                            right,
                            e.movementX
                            /20
                        );
                    }
                );

            document
                .addEventListener(
                    "mouseup",
                    ()=>{

                        this.dragging =
                            false;

                        this.currentHandle =
                            null;
                    }
                );

            global
                .AIDirector
                .EventBus
                .on(
                    "ipad.expand",
                    e =>
                        this.expand(
                            e.payload
                                .workspaceId
                        )
                );

            global
                .AIDirector
                .EventBus
                .on(
                    "ipad.restore",
                    ()=>this.equalize()
                );
        }

        //----------------------------------------
        // EventBus
        //----------------------------------------

        emit(
            namespace,
            payload={}
        ){

            global
                .AIDirector
                .EventBus
                .emit(
                    namespace,
                    payload,
                    "WorkspaceLayout"
                );
        }
    }

    global
        .AIDirector
        .iPad
        .Layout =
            new WorkspaceLayoutEngine();

})(window);
