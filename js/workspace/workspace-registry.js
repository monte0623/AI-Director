/*
========================================================
AI Director Assistant
V10 Foundation-R1
Package-2
Release-003

File:
js/workspace/workspace-registry.js

Architecture:
Workspace Registry

Depends:
event-bus.js
workspace-state.js
workspace-lifecycle.js

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

    class WorkspaceRegistry {

        constructor(){

            //----------------------------------------
            // Registry
            //----------------------------------------

            this.registry =
                new Map();

            //----------------------------------------
            // Fixed Workspace
            //----------------------------------------

            this.fixedWorkspace = [

                "script",
                "scene",
                "shot",
                "detail",
                "storyboard"
            ];

            //----------------------------------------
            // Mobile Progressive
            //----------------------------------------

            this.mobileWorkspace = [

                ["script","scene"],
                ["scene","shot"],
                ["shot","detail"],
                ["detail","storyboard"],
                ["storyboard","shooting"]
            ];

            //----------------------------------------
            // Initialize
            //----------------------------------------

            this.initialize();
        }

        //----------------------------------------
        // Initialize
        //----------------------------------------

        initialize(){

            this.register(
                "script",
                {
                    title:"Script",
                    type:"workspace",
                    persistent:true
                }
            );

            this.register(
                "scene",
                {
                    title:"Scene",
                    type:"workspace",
                    persistent:true
                }
            );

            this.register(
                "shot",
                {
                    title:"Shot",
                    type:"workspace",
                    persistent:true
                }
            );

            this.register(
                "detail",
                {
                    title:"Detail",
                    type:"workspace",
                    persistent:true
                }
            );

            this.register(
                "storyboard",
                {
                    title:"Storyboard",
                    type:"workspace",
                    persistent:true
                }
            );

            this.register(
                "shooting",
                {
                    title:"Shooting",
                    type:"workspace",
                    persistent:true
                }
            );
        }

        //----------------------------------------
        // Register
        //----------------------------------------

        register(
            workspaceId,
            config={}
        ){

            if(
                this.registry.has(
                    workspaceId
                )
            ){
                return;
            }

            const workspace = {

                id:
                    workspaceId,

                title:
                    config.title || "",

                type:
                    config.type || "workspace",

                persistent:
                    config.persistent ?? true,

                mounted:false,

                visible:false,

                loaded:false,

                component:null,

                container:null,

                createdAt:
                    Date.now(),

                updatedAt:
                    Date.now()
            };

            this.registry.set(
                workspaceId,
                workspace
            );

            global
                .AIDirector
                .Workspace
                .State
                .register(
                    workspaceId
                );

            global
                .AIDirector
                .Workspace
                .Lifecycle
                .create(
                    workspaceId
                );

            this.emit(
                "workspace.registry.registered",
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
                .registry
                .get(
                    workspaceId
                );
        }

        //----------------------------------------
        // Get All
        //----------------------------------------

        getAll(){

            return [
                ...this
                    .registry
                    .values()
            ];
        }

        //----------------------------------------
        // Mount
        //----------------------------------------

        mount(
            workspaceId,
            container,
            component
        ){

            const ws =
                this.get(
                    workspaceId
                );

            if(!ws){
                return;
            }

            ws.container =
                container;

            ws.component =
                component;

            ws.mounted =
                true;

            ws.loaded =
                true;

            ws.updatedAt =
                Date.now();

            global
                .AIDirector
                .Workspace
                .Lifecycle
                .mount(
                    workspaceId
                );

            this.emit(
                "workspace.registry.mounted",
                {
                    workspaceId
                }
            );
        }

        //----------------------------------------
        // Show
        //----------------------------------------

        show(
            workspaceId
        ){

            global
                .AIDirector
                .Workspace
                .Lifecycle
                .show(
                    workspaceId
                );

            this.emit(
                "workspace.registry.visible",
                {
                    workspaceId
                }
            );
        }

        //----------------------------------------
        // Hide
        //----------------------------------------

        hide(
            workspaceId
        ){

            global
                .AIDirector
                .Workspace
                .Lifecycle
                .hide(
                    workspaceId
                );

            this.emit(
                "workspace.registry.hidden",
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

            global
                .AIDirector
                .Workspace
                .Lifecycle
                .focus(
                    workspaceId
                );

            this.emit(
                "workspace.registry.focused",
                {
                    workspaceId
                }
            );
        }

        //----------------------------------------
        // iPad Layout
        //----------------------------------------

        getFixedLayout(){

            return [
                ...this
                    .fixedWorkspace
            ];
        }

        //----------------------------------------
        // Mobile Layout
        //----------------------------------------

        getMobileStages(){

            return structuredClone(
                this
                    .mobileWorkspace
            );
        }

        //----------------------------------------
        // Persistence
        //----------------------------------------

        export(){

            return structuredClone(
                [
                    ...this
                        .registry
                ]
            );
        }

        import(
            data
        ){

            this.registry =
                new Map(
                    structuredClone(
                        data
                    )
                );

            this.emit(
                "workspace.registry.restored"
            );
        }

        //----------------------------------------
        // Snapshot
        //----------------------------------------

        snapshot(){

            return {

                timestamp:
                    Date.now(),

                registry:
                    this.export()
            };
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
                    "WorkspaceRegistry"
                );
        }
    }

    global
        .AIDirector
        .Workspace
        .Registry =
            new WorkspaceRegistry();

})(window);
