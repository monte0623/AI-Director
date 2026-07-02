/*
========================================================
AI Director Assistant
V10 Foundation-R1
Package-2
Release-001

File:
js/workspace/workspace-state.js

Architecture:
Workspace State Engine

Depends:
event-bus.js

Status:
Foundation Stable
========================================================
*/

(function(global){

    "use strict";

    if(!global.AIDirector){
        global.AIDirector = {};
    }

    if(!global.AIDirector.Workspace){
        global.AIDirector.Workspace = {};
    }

    class WorkspaceStateEngine {

        constructor(){

            //----------------------------------------
            // Registry
            //----------------------------------------

            this.workspaces =
                new Map();

            //----------------------------------------
            // History
            //----------------------------------------

            this.history = [];

            //----------------------------------------
            // Active
            //----------------------------------------

            this.activeWorkspace =
                null;

            //----------------------------------------
            // Mobile
            //----------------------------------------

            this.mobileState = {

                currentStage:0,

                topWorkspace:null,

                bottomWorkspace:null,

                snapIndex:0,

                snapProgress:0,

                isSnapping:false
            };

            //----------------------------------------
            // Layout
            //----------------------------------------

            this.layoutState = {

                ratios:{},

                expanded:null,

                collapsed:[]
            };
        }

        //----------------------------------------
        // Register
        //----------------------------------------

        register(
            workspaceId,
            config={}
        ){

            if(
                this.workspaces.has(
                    workspaceId
                )
            ){
                return;
            }

            this.workspaces.set(
                workspaceId,
                {

                    id:
                        workspaceId,

                    mounted:false,

                    visible:false,

                    focused:false,

                    expanded:false,

                    collapsed:false,

                    scrollTop:0,

                    scrollLeft:0,

                    selectedId:null,

                    selectedIds:[],

                    expandedIds:[],

                    filter:null,

                    sort:null,

                    viewMode:null,

                    layoutRatio:50,

                    draftData:{},

                    cache:{},

                    history:[
                    ],

                    ...config
                }
            );

            this.emit(
                "workspace.created",
                {
                    workspaceId
                }
            );
        }

        //----------------------------------------
        // Get
        //----------------------------------------

        get(
            workspaceId
        ){

            return this
                .workspaces
                .get(
                    workspaceId
                );
        }

        //----------------------------------------
        // Update
        //----------------------------------------

        update(
            workspaceId,
            state={}
        ){

            const ws =
                this.get(
                    workspaceId
                );

            if(!ws){
                return;
            }

            Object.assign(
                ws,
                state
            );

            ws.history.push({

                timestamp:
                    Date.now(),

                state:
                    structuredClone(
                        state
                    )
            });

            this.emit(
                "workspace.updated",
                {
                    workspaceId
                }
            );
        }

        //----------------------------------------
        // Focus
        //----------------------------------------

        focus(
            workspaceId
        ){

            this.workspaces
                .forEach(
                    ws =>
                        ws.focused =
                            false
                );

            const ws =
                this.get(
                    workspaceId
                );

            if(!ws){
                return;
            }

            ws.focused =
                true;

            this.activeWorkspace =
                workspaceId;

            this.emit(
                "workspace.focused",
                {
                    workspaceId
                }
            );
        }

        //----------------------------------------
        // Visible
        //----------------------------------------

        show(
            workspaceId
        ){

            const ws =
                this.get(
                    workspaceId
                );

            if(!ws){
                return;
            }

            ws.visible =
                true;

            this.emit(
                "workspace.visible",
                {
                    workspaceId
                }
            );
        }

        hide(
            workspaceId
        ){

            const ws =
                this.get(
                    workspaceId
                );

            if(!ws){
                return;
            }

            ws.visible =
                false;

            this.emit(
                "workspace.hidden",
                {
                    workspaceId
                }
            );
        }

        //----------------------------------------
        // Expand
        //----------------------------------------

        expand(
            workspaceId
        ){

            const ws =
                this.get(
                    workspaceId
                );

            if(!ws){
                return;
            }

            ws.expanded =
                true;

            this.layoutState
                .expanded =
                    workspaceId;

            this.emit(
                "workspace.expand",
                {
                    workspaceId
                }
            );
        }

        collapse(
            workspaceId
        ){

            const ws =
                this.get(
                    workspaceId
                );

            if(!ws){
                return;
            }

            ws.collapsed =
                true;

            if(
                !this
                    .layoutState
                    .collapsed
                    .includes(
                        workspaceId
                    )
            ){

                this
                    .layoutState
                    .collapsed
                    .push(
                        workspaceId
                    );
            }

            this.emit(
                "workspace.collapse",
                {
                    workspaceId
                }
            );
        }

        //----------------------------------------
        // Scroll
        //----------------------------------------

        saveScroll(
            workspaceId,
            top,
            left=0
        ){

            const ws =
                this.get(
                    workspaceId
                );

            if(!ws){
                return;
            }

            ws.scrollTop =
                top;

            ws.scrollLeft =
                left;
        }

        //----------------------------------------
        // Selection
        //----------------------------------------

        select(
            workspaceId,
            selectedId
        ){

            const ws =
                this.get(
                    workspaceId
                );

            if(!ws){
                return;
            }

            ws.selectedId =
                selectedId;

            this.emit(
                "workspace.selected",
                {
                    workspaceId,
                    selectedId
                }
            );
        }

        //----------------------------------------
        // Cache
        //----------------------------------------

        cache(
            workspaceId
        ){

            const ws =
                this.get(
                    workspaceId
                );

            if(!ws){
                return;
            }

            ws.cache =
                structuredClone(
                    ws
                );

            this.emit(
                "workspace.cached",
                {
                    workspaceId
                }
            );
        }

        //----------------------------------------
        // Restore
        //----------------------------------------

        restore(
            workspaceId
        ){

            const ws =
                this.get(
                    workspaceId
                );

            if(
                !ws ||
                !ws.cache
            ){
                return;
            }

            Object.assign(
                ws,
                structuredClone(
                    ws.cache
                )
            );

            this.emit(
                "workspace.restored",
                {
                    workspaceId
                }
            );
        }

        //----------------------------------------
        // Snapshot
        //----------------------------------------

        snapshot(){

            const snapshot = {

                timestamp:
                    Date.now(),

                active:
                    this
                        .activeWorkspace,

                mobile:
                    structuredClone(
                        this
                            .mobileState
                    ),

                layout:
                    structuredClone(
                        this
                            .layoutState
                    ),

                workspaces:
                    structuredClone(
                        [
                            ...this
                                .workspaces
                        ]
                    )
            };

            this.history
                .push(
                    snapshot
                );

            this.emit(
                "workspace.snapshot",
                {}
            );

            return snapshot;
        }

        //----------------------------------------
        // Restore Snapshot
        //----------------------------------------

        restoreSnapshot(
            snapshot
        ){

            this.activeWorkspace =
                snapshot.active;

            this.mobileState =
                structuredClone(
                    snapshot.mobile
                );

            this.layoutState =
                structuredClone(
                    snapshot.layout
                );

            this.workspaces =
                new Map(
                    structuredClone(
                        snapshot
                            .workspaces
                    )
                );

            this.emit(
                "workspace.snapshot.restored",
                {}
            );
        }

        //----------------------------------------
        // Mobile
        //----------------------------------------

        setMobileStage(
            stage,
            top,
            bottom
        ){

            this.mobileState
                .currentStage =
                    stage;

            this.mobileState
                .topWorkspace =
                    top;

            this.mobileState
                .bottomWorkspace =
                    bottom;

            this.emit(
                "mobile.stage.changed",
                {
                    stage,
                    top,
                    bottom
                }
            );
        }

        startSnap(){

            this.mobileState
                .isSnapping =
                    true;

            this.emit(
                "mobile.snap.begin"
            );
        }

        endSnap(){

            this.mobileState
                .isSnapping =
                    false;

            this.emit(
                "mobile.snap.complete"
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
                    "WorkspaceState"
                );
        }

    }

    global
        .AIDirector
        .Workspace
        .State =
            new WorkspaceStateEngine();

})(window);
