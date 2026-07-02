/*
========================================================
AI Director Assistant
V10 Foundation-R1
Package-2
Release-002

File:
js/workspace/workspace-lifecycle.js

Architecture:
Workspace Lifecycle Engine

Depends:
event-bus.js
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

    if(!global.AIDirector.Workspace){
        global.AIDirector.Workspace = {};
    }

    class WorkspaceLifecycle {

        constructor(){

            //----------------------------------------
            // Lifecycle State
            //----------------------------------------

            this.lifecycle =
                new Map();

            //----------------------------------------
            // Mobile Stage
            //----------------------------------------

            this.mobileStages = [

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

            const bus =
                global
                    .AIDirector
                    .EventBus;

            bus.on(
                "mobile.stage.changed",
                e =>
                    this.handleStage(
                        e.payload
                    )
            );
        }

        //----------------------------------------
        // Create
        //----------------------------------------

        create(
            workspaceId
        ){

            this.lifecycle.set(
                workspaceId,
                {

                    created:true,

                    mounted:false,

                    visible:false,

                    hidden:false,

                    focused:false,

                    cached:false,

                    restored:false,

                    destroyed:false,

                    createdAt:
                        Date.now(),

                    updatedAt:
                        Date.now()
                }
            );

            global
                .AIDirector
                .Workspace
                .State
                .register(
                    workspaceId
                );

            this.emit(
                "workspace.created",
                {
                    workspaceId
                }
            );
        }

        //----------------------------------------
        // Mount
        //----------------------------------------

        mount(
            workspaceId
        ){

            const life =
                this.lifecycle
                    .get(
                        workspaceId
                    );

            if(!life){
                return;
            }

            life.mounted =
                true;

            life.updatedAt =
                Date.now();

            global
                .AIDirector
                .Workspace
                .State
                .update(
                    workspaceId,
                    {
                        mounted:true
                    }
                );

            this.emit(
                "workspace.mounted",
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

            const life =
                this.lifecycle
                    .get(
                        workspaceId
                    );

            if(!life){
                return;
            }

            life.visible =
                true;

            life.hidden =
                false;

            life.updatedAt =
                Date.now();

            global
                .AIDirector
                .Workspace
                .State
                .show(
                    workspaceId
                );

            this.emit(
                "workspace.visible",
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

            const life =
                this.lifecycle
                    .get(
                        workspaceId
                    );

            if(!life){
                return;
            }

            life.hidden =
                true;

            life.visible =
                false;

            life.updatedAt =
                Date.now();

            global
                .AIDirector
                .Workspace
                .State
                .hide(
                    workspaceId
                );

            this.emit(
                "workspace.hidden",
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

            this.lifecycle
                .forEach(
                    state =>
                        state.focused =
                            false
                );

            const life =
                this.lifecycle
                    .get(
                        workspaceId
                    );

            if(!life){
                return;
            }

            life.focused =
                true;

            global
                .AIDirector
                .Workspace
                .State
                .focus(
                    workspaceId
                );

            this.emit(
                "workspace.focused",
                {
                    workspaceId
                }
            );
        }

        //----------------------------------------
        // Cache
        //----------------------------------------

        cache(
            workspaceId
        ){

            const life =
                this.lifecycle
                    .get(
                        workspaceId
                    );

            if(!life){
                return;
            }

            life.cached =
                true;

            global
                .AIDirector
                .Workspace
                .State
                .cache(
                    workspaceId
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

            const life =
                this.lifecycle
                    .get(
                        workspaceId
                    );

            if(!life){
                return;
            }

            life.restored =
                true;

            global
                .AIDirector
                .Workspace
                .State
                .restore(
                    workspaceId
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

            return {

                timestamp:
                    Date.now(),

                lifecycle:
                    structuredClone(
                        [
                            ...this
                                .lifecycle
                        ]
                    )
            };
        }

        //----------------------------------------
        // Restore Snapshot
        //----------------------------------------

        restoreSnapshot(
            snapshot
        ){

            this.lifecycle =
                new Map(
                    structuredClone(
                        snapshot
                            .lifecycle
                    )
                );

            this.emit(
                "workspace.snapshot.restored"
            );
        }

        //----------------------------------------
        // Mobile Stage
        //----------------------------------------

        handleStage(
            data
        ){

            const top =
                data.top;

            const bottom =
                data.bottom;

            this.lifecycle
                .forEach(
                    (v,k)=>{

                        if(
                            k===top ||
                            k===bottom
                        ){

                            this.show(k);
                        }
                        else{

                            this.hide(k);
                        }
                    }
                );
        }

        //----------------------------------------
        // Mobile Next
        //----------------------------------------

        nextStage(
            current
        ){

            const next =
                current + 1;

            if(
                next >=
                this.mobileStages
                    .length
            ){
                return;
            }

            const pair =
                this.mobileStages[
                    next
                ];

            global
                .AIDirector
                .Workspace
                .State
                .setMobileStage(
                    next,
                    pair[0],
                    pair[1]
                );
        }

        //----------------------------------------
        // Mobile Previous
        //----------------------------------------

        previousStage(
            current
        ){

            const prev =
                current - 1;

            if(
                prev < 0
            ){
                return;
            }

            const pair =
                this.mobileStages[
                    prev
                ];

            global
                .AIDirector
                .Workspace
                .State
                .setMobileStage(
                    prev,
                    pair[0],
                    pair[1]
                );
        }

        //----------------------------------------
        // Destroy
        //----------------------------------------

        destroyRequest(
            workspaceId
        ){

            this.emit(
                "workspace.destroy.request",
                {
                    workspaceId
                }
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
                    "WorkspaceLifecycle"
                );
        }
    }

    global
        .AIDirector
        .Workspace
        .Lifecycle =
            new WorkspaceLifecycle();

})(window);
