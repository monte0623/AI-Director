/*
========================================================
AI Director Assistant
V10 Foundation-R1
Package-3
Release-003

File:
js/ipad/workspace-focus.js

Architecture:
Workspace Focus Engine

Depends:
event-bus.js
project-store.js
workspace-state.js
workspace-lifecycle.js
workspace-registry.js
fixed-workspace-engine.js

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

    class WorkspaceFocusEngine {

        constructor(){

            //----------------------------------------
            // Active
            //----------------------------------------

            this.activeWorkspace = null;

            this.activeScene = null;

            this.activeShot = null;

            this.activeSequence = null;

            //----------------------------------------
            // Focus History
            //----------------------------------------

            this.history = [];

            //----------------------------------------
            // Lock
            //----------------------------------------

            this.locked = false;
        }

        //----------------------------------------
        // Initialize
        //----------------------------------------

        initialize(){

            this.bindEvents();

            this.emit(
                "focus.initialized"
            );
        }

        //----------------------------------------
        // Focus Workspace
        //----------------------------------------

        focusWorkspace(
            workspaceId
        ){

            if(this.locked){
                return;
            }

            this.activeWorkspace =
                workspaceId;

            global
                .AIDirector
                .Workspace
                .State
                .focus(
                    workspaceId
                );

            if(
                global
                    .AIDirector
                    .iPad
                    .Engine
            ){

                global
                    .AIDirector
                    .iPad
                    .Engine
                    .focus(
                        workspaceId
                    );
            }

            this.pushHistory(
                "workspace",
                workspaceId
            );

            this.emit(
                "focus.workspace",
                {
                    workspaceId
                }
            );
        }

        //----------------------------------------
        // Focus Scene
        //----------------------------------------

        focusScene(
            sceneId
        ){

            this.activeScene =
                sceneId;

            this.focusWorkspace(
                "scene"
            );

            const scene =
                global
                    .AIDirector
                    .ProjectStore
                    .getScene(
                        sceneId
                    );

            if(scene){

                global
                    .AIDirector
                    .Workspace
                    .State
                    .select(
                        "scene",
                        sceneId
                    );
            }

            this.pushHistory(
                "scene",
                sceneId
            );

            this.emit(
                "focus.scene",
                {
                    sceneId
                }
            );
        }

        //----------------------------------------
        // Focus Shot
        //----------------------------------------

        focusShot(
            shotId
        ){

            this.activeShot =
                shotId;

            this.focusWorkspace(
                "shot"
            );

            const shot =
                global
                    .AIDirector
                    .ProjectStore
                    .getShot(
                        shotId
                    );

            if(shot){

                global
                    .AIDirector
                    .Workspace
                    .State
                    .select(
                        "shot",
                        shotId
                    );
            }

            this.pushHistory(
                "shot",
                shotId
            );

            this.emit(
                "focus.shot",
                {
                    shotId
                }
            );
        }

        //----------------------------------------
        // Focus Sequence
        //----------------------------------------

        focusSequence(
            sequenceId
        ){

            this.activeSequence =
                sequenceId;

            this.pushHistory(
                "sequence",
                sequenceId
            );

            this.emit(
                "focus.sequence",
                {
                    sequenceId
                }
            );
        }

        //----------------------------------------
        // Focus Detail
        //----------------------------------------

        focusDetail(){

            this.focusWorkspace(
                "detail"
            );

            this.emit(
                "focus.detail"
            );
        }

        //----------------------------------------
        // Focus Storyboard
        //----------------------------------------

        focusStoryboard(){

            this.focusWorkspace(
                "storyboard"
            );

            this.emit(
                "focus.storyboard"
            );
        }

        //----------------------------------------
        // Navigation
        //----------------------------------------

        next(){

            const order = [

                "script",
                "scene",
                "shot",
                "detail",
                "storyboard"
            ];

            const index =
                order.indexOf(
                    this
                        .activeWorkspace
                );

            if(
                index <
                order.length-1
            ){

                this.focusWorkspace(
                    order[
                        index+1
                    ]
                );
            }
        }

        previous(){

            const order = [

                "script",
                "scene",
                "shot",
                "detail",
                "storyboard"
            ];

            const index =
                order.indexOf(
                    this
                        .activeWorkspace
                );

            if(
                index > 0
            ){

                this.focusWorkspace(
                    order[
                        index-1
                    ]
                );
            }
        }

        //----------------------------------------
        // History
        //----------------------------------------

        pushHistory(
            type,
            value
        ){

            this.history.push({

                timestamp:
                    Date.now(),

                type,

                value
            });

            if(
                this.history
                    .length > 1000
            ){

                this.history
                    .shift();
            }
        }

        getHistory(){

            return [
                ...this.history
            ];
        }

        //----------------------------------------
        // Lock
        //----------------------------------------

        lock(){

            this.locked =
                true;

            this.emit(
                "focus.locked"
            );
        }

        unlock(){

            this.locked =
                false;

            this.emit(
                "focus.unlocked"
            );
        }

        //----------------------------------------
        // Snapshot
        //----------------------------------------

        snapshot(){

            return {

                timestamp:
                    Date.now(),

                activeWorkspace:
                    this
                        .activeWorkspace,

                activeScene:
                    this
                        .activeScene,

                activeShot:
                    this
                        .activeShot,

                activeSequence:
                    this
                        .activeSequence,

                history:
                    structuredClone(
                        this
                            .history
                    )
            };
        }

        //----------------------------------------
        // Restore
        //----------------------------------------

        restore(
            snapshot
        ){

            this.activeWorkspace =
                snapshot
                    .activeWorkspace;

            this.activeScene =
                snapshot
                    .activeScene;

            this.activeShot =
                snapshot
                    .activeShot;

            this.activeSequence =
                snapshot
                    .activeSequence;

            this.history =
                structuredClone(
                    snapshot
                        .history
                );

            this.emit(
                "focus.restored"
            );
        }

        //----------------------------------------
        // Event Binding
        //----------------------------------------

        bindEvents(){

            const bus =
                global
                    .AIDirector
                    .EventBus;

            bus.on(
                "scene.selected",
                e =>
                    this.focusScene(
                        e.payload
                            .sceneId
                    )
            );

            bus.on(
                "shot.selected",
                e =>
                    this.focusShot(
                        e.payload
                            .shotId
                    )
            );

            bus.on(
                "sequence.selected",
                e =>
                    this.focusSequence(
                        e.payload
                            .sequenceId
                    )
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
                    "WorkspaceFocus"
                );
        }
    }

    global
        .AIDirector
        .iPad
        .Focus =
            new WorkspaceFocusEngine();

})(window);
