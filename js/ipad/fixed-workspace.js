/*
========================================================
AI Director Assistant
V10 Foundation-R1
Package-3
Release-001

File:
js/ipad/fixed-workspace-engine.js

Architecture:
iPad Fixed Workspace Engine

Depends:
event-bus.js
project-store.js
workspace-state.js
workspace-lifecycle.js
workspace-registry.js

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

    class FixedWorkspaceEngine {

        constructor(){

            //------------------------------------
            // Layout
            //------------------------------------

            this.layout = [

                "script",
                "scene",
                "shot",
                "detail",
                "storyboard"
            ];

            //------------------------------------
            // State
            //------------------------------------

            this.active = "scene";

            this.expanded = null;

            this.container = null;

            //------------------------------------
            // Ratio
            //------------------------------------

            this.ratios = {

                script:20,
                scene:20,
                shot:20,
                detail:20,
                storyboard:20
            };

            //------------------------------------
            // Minimum Width
            //------------------------------------

            this.minimum = {

                script:240,
                scene:280,
                shot:320,
                detail:320,
                storyboard:320
            };
        }

        //------------------------------------
        // Initialize
        //------------------------------------

        initialize(
            container
        ){

            this.container =
                container;

            this.build();

            this.bindEvents();

            this.restore();

            this.emit(
                "ipad.initialized"
            );
        }

        //------------------------------------
        // Build
        //------------------------------------

        build(){

            if(
                !this.container
            ){
                return;
            }

            this.container.innerHTML =
                "";

            this.layout
                .forEach(
                    workspaceId => {

                        const panel =
                            document
                                .createElement(
                                    "div"
                                );

                        panel.className =
                            "ipad-panel";

                        panel.dataset
                            .workspace =
                                workspaceId;

                        panel.innerHTML =
                            `
                            <div class="panel-header">
                                ${workspaceId.toUpperCase()}
                            </div>

                            <div class="panel-content">
                            </div>
                            `;

                        this.container
                            .appendChild(
                                panel
                            );

                        AIDirector
                            .Workspace
                            .Registry
                            .mount(
                                workspaceId,
                                panel,
                                null
                            );
                    }
                );

            this.updateLayout();
        }

        //------------------------------------
        // Focus
        //------------------------------------

        focus(
            workspaceId
        ){

            this.active =
                workspaceId;

            AIDirector
                .Workspace
                .Registry
                .focus(
                    workspaceId
                );

            document
                .querySelectorAll(
                    ".ipad-panel"
                )
                .forEach(
                    panel => {

                        panel
                            .classList
                            .remove(
                                "focused"
                            );

                        if(
                            panel
                                .dataset
                                .workspace ===
                            workspaceId
                        ){

                            panel
                                .classList
                                .add(
                                    "focused"
                                );
                        }
                    }
                );

            this.emit(
                "ipad.focus",
                {
                    workspaceId
                }
            );
        }

        //------------------------------------
        // Expand
        //------------------------------------

        expand(
            workspaceId
        ){

            this.expanded =
                workspaceId;

            const total = 100;

            const expand = 60;

            const remain =
                (
                    total -
                    expand
                ) / 4;

            this.layout
                .forEach(
                    id => {

                        this.ratios[
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

            this.updateLayout();

            this.emit(
                "ipad.expand",
                {
                    workspaceId
                }
            );
        }

        //------------------------------------
        // Restore
        //------------------------------------

        restore(){

            this.expanded =
                null;

            this.layout
                .forEach(
                    id =>
                        this
                            .ratios[
                                id
                            ] = 20
                );

            this.updateLayout();

            this.emit(
                "ipad.restore"
            );
        }

        //------------------------------------
        // Collapse
        //------------------------------------

        collapse(
            workspaceId
        ){

            this.restore();

            this.emit(
                "ipad.collapse",
                {
                    workspaceId
                }
            );
        }

        //------------------------------------
        // Layout
        //------------------------------------

        updateLayout(){

            document
                .querySelectorAll(
                    ".ipad-panel"
                )
                .forEach(
                    panel => {

                        const id =
                            panel
                                .dataset
                                .workspace;

                        panel
                            .style
                            .flex =
                                this
                                    .ratios[
                                        id
                                    ];
                    }
                );
        }

        //------------------------------------
        // Save
        //------------------------------------

        save(){

            localStorage
                .setItem(
                    "AI_DIRECTOR_IPAD",
                    JSON.stringify({

                        active:
                            this
                                .active,

                        expanded:
                            this
                                .expanded,

                        ratios:
                            this
                                .ratios
                    })
                );

            this.emit(
                "ipad.saved"
            );
        }

        //------------------------------------
        // Load
        //------------------------------------

        load(){

            const data =
                localStorage
                    .getItem(
                        "AI_DIRECTOR_IPAD"
                    );

            if(
                !data
            ){
                return;
            }

            const state =
                JSON.parse(
                    data
                );

            this.active =
                state.active;

            this.expanded =
                state.expanded;

            this.ratios =
                state.ratios;

            this.updateLayout();

            this.emit(
                "ipad.loaded"
            );
        }

        //------------------------------------
        // Events
        //------------------------------------

        bindEvents(){

            const bus =
                AIDirector
                    .EventBus;

            bus.on(
                "scene.selected",
                () =>
                    this.focus(
                        "scene"
                    )
            );

            bus.on(
                "shot.selected",
                () =>
                    this.focus(
                        "shot"
                    )
            );

            bus.on(
                "workspace.expand",
                e =>
                    this.expand(
                        e.payload
                            .workspaceId
                    )
            );
        }

        //------------------------------------
        // EventBus
        //------------------------------------

        emit(
            namespace,
            payload={}
        ){

            AIDirector
                .EventBus
                .emit(
                    namespace,
                    payload,
                    "FixedWorkspaceEngine"
                );
        }
    }

    global
        .AIDirector
        .iPad
        .Engine =
            new FixedWorkspaceEngine();

})(window);
